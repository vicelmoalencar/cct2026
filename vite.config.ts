import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import nodeAdapter from '@hono/vite-dev-server/node'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const adapter = {
    ...nodeAdapter(),
    env: { ...process.env, ...env }
  }

  return {
    plugins: [
      build(),
      command === 'serve'
        ? devServer({
            adapter,
            entry: 'src/index.tsx'
          })
        : null
    ].filter(Boolean)
  }
})
