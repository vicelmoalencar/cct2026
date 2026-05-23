import 'dotenv/config'
import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/node'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  plugins: [
    build(),
    command === 'serve'
      ? devServer({
          adapter,
          entry: 'src/index.tsx'
        })
      : null
  ].filter(Boolean)
}))
