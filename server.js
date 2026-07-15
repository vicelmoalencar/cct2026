import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { compress } from 'hono/compress'

// Load the Hono app
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

// Use PORT from environment, default to 8080
// Easypanel usually provides PORT env var
const port = parseInt(process.env.PORT || '8080', 10)

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY
const DATABASE_CCT = process.env.DATABASE_CCT
const DATABASE_SUITEPLUS = process.env.DATABASE_SUITEPLUS
const DATABASE_URL_CREDITOS = process.env.DATABASE_URL_CREDITOS

console.log('🔍 Environment variables check:')
console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing')
console.log('SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✅ Set (length: ' + SUPABASE_ANON_KEY.length + ')' : '❌ Missing')

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
  console.error('Please set them in Easypanel Environment settings')
  console.error('Current env keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')).join(', '))
  // Don't exit in production, continue with warning
  console.warn('⚠️ Continuing without Supabase - features will be limited')
}

// Import the built worker
const workerModule = await import('./dist/_worker.js')
const workerApp = workerModule.default

// Create a NEW wrapper app to add our Node.js specific middleware
const app = new Hono()

// Add static file serving for Node.js
// Try multiple path resolutions for Docker/Easypanel compatibility
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicPath = join(__dirname, 'public')

console.log('📁 Static files directory:', publicPath)

// Check if public directory exists
import { existsSync, readdirSync } from 'fs'
import { readFileSync, statSync } from 'fs'

if (existsSync(publicPath)) {
  console.log('✅ Public directory exists')
  const staticPath = join(publicPath, 'static')
  if (existsSync(staticPath)) {
    console.log('✅ Static directory exists')
    const files = readdirSync(staticPath)
    console.log('📄 Static files found:', files.join(', '))
  } else {
    console.error('❌ Static directory NOT found at:', staticPath)
  }
} else {
  console.error('❌ Public directory NOT found at:', publicPath)
}

app.use('*', compress())

// Add request logging middleware BEFORE static files when explicitly enabled
const debugRequests = process.env.DEBUG_REQUESTS === 'true'
app.use('*', async (c, next) => {
  if (!debugRequests) return next()

  const start = Date.now()
  const path = new URL(c.req.url).pathname
  console.log(`📥 ${c.req.method} ${path}`)
  await next()
  const ms = Date.now() - start
  console.log(`📤 ${c.req.method} ${path} - ${c.res.status} (${ms}ms)`)
})

// CRITICAL: Add health check endpoint for Docker/Easypanel
app.get('/health', (c) => {
  console.log('🩺 Health check called')
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    supabase: SUPABASE_URL ? 'configured' : 'missing'
  })
})

// Serve static files - CRITICAL: rewrite /static/* to /public/static/*
console.log('🔧 Configuring static file serving...')
console.log('   Root path:', publicPath)
console.log('   Static path:', join(publicPath, 'static'))
console.log('   Pattern: /static/* -> ' + join(publicPath, 'static'))

const staticFileCache = new Map()
const contentTypes = new Map([
  ['.js', 'application/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.csv', 'text/csv; charset=utf-8'],
  ['.svg', 'image/svg+xml; charset=utf-8'],
])

function getContentType(fileName) {
  const extension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase()
  return contentTypes.get(extension) || 'application/octet-stream'
}

function getStaticFile(filePath) {
  const stats = statSync(filePath)
  const cached = staticFileCache.get(filePath)
  if (cached && cached.mtimeMs === stats.mtimeMs && cached.size === stats.size) {
    return cached
  }

  const body = readFileSync(filePath)
  const etag = `"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`
  const nextCached = { body, etag, mtimeMs: stats.mtimeMs, size: stats.size }
  staticFileCache.set(filePath, nextCached)
  return nextCached
}

// Admin JS served without immutable cache so updates deploy immediately
app.get('/static/admin.js', async (c) => {
  const filePath = join(publicPath, 'static', 'admin.js')
  if (existsSync(filePath)) {
    const file = getStaticFile(filePath)
    const ifNoneMatch = c.req.header('if-none-match')
    c.header('ETag', file.etag)
    c.header('Cache-Control', 'no-cache')
    c.header('Content-Type', 'application/javascript; charset=utf-8')
    if (ifNoneMatch === file.etag) return c.body(null, 304)
    return c.body(file.body)
  }
  return c.notFound()
})

// Serve static assets from memory with browser caching and conditional 304s.
app.use('/static/*', async (c, next) => {
  const requestPath = new URL(c.req.url).pathname
  const fileName = requestPath.replace('/static/', '')
  const filePath = join(publicPath, 'static', fileName)

  if (existsSync(filePath)) {
    const file = getStaticFile(filePath)
    const ifNoneMatch = c.req.header('if-none-match')

    c.header('ETag', file.etag)
    c.header('Cache-Control', 'public, max-age=31536000, immutable')
    c.header('Content-Type', getContentType(fileName))

    if (ifNoneMatch === file.etag) {
      return c.body(null, 304)
    }

    return c.body(file.body)
  }

  await next()
})

// Fallback to Hono static serving for other public files.
app.use('/static/*', serveStatic({ root: publicPath }))

// Serve favicon.svg from public/
app.get('/favicon.svg', async (c) => {
  const filePath = join(publicPath, 'favicon.svg')
  if (existsSync(filePath)) {
    const file = getStaticFile(filePath)
    const ifNoneMatch = c.req.header('if-none-match')

    c.header('ETag', file.etag)
    c.header('Cache-Control', 'public, max-age=86400')
    c.header('Content-Type', 'image/svg+xml; charset=utf-8')

    if (ifNoneMatch === file.etag) {
      return c.body(null, 304)
    }

    return c.body(file.body)
  }
  return c.notFound()
})

// Mount the original worker app to handle all other routes
app.route('/', workerApp)

console.log(`🚀 Starting server on port ${port}...`)
console.log(`📦 Supabase URL: ${SUPABASE_URL || 'NOT SET'}`)

const server = serve({
  fetch: (req) => {
    // Create a custom environment object with Supabase credentials
    const env = {
      SUPABASE_URL: SUPABASE_URL || '',
      SUPABASE_ANON_KEY: SUPABASE_ANON_KEY || '',
      DATABASE_CCT: DATABASE_CCT || '',
      DATABASE_SUITEPLUS: DATABASE_SUITEPLUS || '',
      DATABASE_URL_CREDITOS: DATABASE_URL_CREDITOS || '',
      VITE_OPENROUTER_API_KEY: process.env.VITE_OPENROUTER_API_KEY || '',
      VIMEO_ACCESS_TOKEN: process.env.VIMEO_ACCESS_TOKEN || '',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
      GROQ_API_KEY: process.env.GROQ_API_KEY || '',
      EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY || '',
      EVOLUTION_SERVER_URL: process.env.EVOLUTION_SERVER_URL || '',
      EVOLUTION_INSTANCE_ID: process.env.EVOLUTION_INSTANCE_ID || '',
      EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY || ''
    }
    
    // Call the Hono app with the environment
    return app.fetch(req, env)
  },
  port: port,
  hostname: '0.0.0.0'
})

console.log(`✅ Server running at http://0.0.0.0:${port}`)
console.log(`✅ Server ready to accept connections`)

// Keep-alive ping every 30 seconds
const keepAlive = setInterval(() => {
  console.log(`💓 Keep-alive ping - ${new Date().toISOString()}`)
}, 30000)

const selfCheck = process.env.ENABLE_SELF_CHECK === 'true'
  ? setInterval(async () => {
      try {
        const response = await fetch(`http://localhost:${port}/health`)
        if (response.ok) {
          console.log(`🩺 Self health check: OK`)
        } else {
          console.warn(`⚠️ Self health check failed: ${response.status}`)
        }
      } catch (error) {
        console.error(`❌ Self health check error:`, error.message)
      }
    }, 10000)
  : null

// Handle graceful shutdown
let isShuttingDown = false

process.on('SIGTERM', () => {
  if (isShuttingDown) return
  isShuttingDown = true
  
  console.log('⚠️ SIGTERM received, shutting down gracefully...')
  clearInterval(keepAlive)
  if (selfCheck) clearInterval(selfCheck)
  
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('⚠️ Forced shutdown after timeout')
    process.exit(1)
  }, 10000)
})

process.on('SIGINT', () => {
  if (isShuttingDown) return
  isShuttingDown = true
  
  console.log('⚠️ SIGINT received, shutting down gracefully...')
  clearInterval(keepAlive)
  if (selfCheck) clearInterval(selfCheck)
  
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

// Log unhandled errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason)
})
