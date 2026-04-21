import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

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

// Add request logging middleware BEFORE static files
app.use('*', async (c, next) => {
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

// Option 1: Serve from /app/public/static/* at URL /static/*
app.use('/static/*', serveStatic({ 
  root: publicPath,
  rewriteRequestPath: (path) => {
    console.log('🔄 Rewriting path:', path, '-> /static' + path.replace('/static', ''))
    return path.replace('/static', '/static')
  }
}))

// Option 2: Try direct mapping (fallback)
app.use('/static/*', async (c, next) => {
  const requestPath = new URL(c.req.url).pathname
  const fileName = requestPath.replace('/static/', '')
  const filePath = join(publicPath, 'static', fileName)
  
  console.log('🔍 Looking for file:', filePath)
  
  if (existsSync(filePath)) {
    console.log('✅ File found, serving:', fileName)
    const { readFileSync } = await import('fs')
    const content = readFileSync(filePath, 'utf-8')
    
    // Set appropriate content type
    let contentType = 'text/plain'
    if (fileName.endsWith('.js')) contentType = 'application/javascript'
    else if (fileName.endsWith('.css')) contentType = 'text/css'
    else if (fileName.endsWith('.html')) contentType = 'text/html'
    
    return c.text(content, 200, { 'Content-Type': contentType })
  }
  
  console.log('❌ File not found:', filePath)
  await next()
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
      DATABASE_SUITEPLUS: DATABASE_SUITEPLUS || ''
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

// Self health check every 10 seconds
const selfCheck = setInterval(async () => {
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

// Handle graceful shutdown
let isShuttingDown = false

process.on('SIGTERM', () => {
  if (isShuttingDown) return
  isShuttingDown = true
  
  console.log('⚠️ SIGTERM received, shutting down gracefully...')
  clearInterval(keepAlive)
  clearInterval(selfCheck)
  
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
  clearInterval(selfCheck)
  
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
