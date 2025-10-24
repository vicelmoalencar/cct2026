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

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables')
  console.error('Please set them in Easypanel Environment settings')
  process.exit(1)
}

// Import the built worker
const workerModule = await import('./dist/_worker.js')
const app = workerModule.default

// Add static file serving for Node.js
app.use('/static/*', serveStatic({ root: './public' }))

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
