import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

// Load the Hono app
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

const port = process.env.PORT || 8080

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

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
const app = workerModule.default

// Add static file serving for Node.js
// Try multiple path resolutions for Docker/Easypanel compatibility
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const publicPath = join(__dirname, 'public')

console.log('📁 Static files directory:', publicPath)

app.use('/static/*', serveStatic({ root: publicPath }))

console.log(`🚀 Starting server on port ${port}...`)
console.log(`📦 Supabase URL: ${SUPABASE_URL}`)

serve({
  fetch: (req) => {
    // Create a custom environment object with Supabase credentials
    const env = {
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    }
    
    // Call the Hono app with the environment
    return app.fetch(req, env)
  },
  port: port,
  hostname: '0.0.0.0'
})

console.log(`✅ Server running at http://0.0.0.0:${port}`)
