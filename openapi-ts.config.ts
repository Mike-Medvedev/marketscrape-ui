import 'dotenv/config'
import { defineConfig } from '@hey-api/openapi-ts'

const apiUrl = process.env.VITE_API_URL?.replace(/\/$/, '')

if (!apiUrl) {
  throw new Error('VITE_API_URL is not set in .env')
}

export default defineConfig({
  input: `${apiUrl}/docs/openapi.json`,
  output: 'src/generated',
  plugins: [
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: '../infra/hey-api.config.ts',
    },
    '@hey-api/typescript',
    {
      name: '@hey-api/sdk',
      validator: 'zod',
    },
    'zod',
    '@tanstack/react-query',
  ],
})
