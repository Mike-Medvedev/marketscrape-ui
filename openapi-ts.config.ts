import 'dotenv/config'
import { existsSync } from 'node:fs'
import { defineConfig } from '@hey-api/openapi-ts'

const apiUrl = process.env.VITE_API_URL?.replace(/\/$/, '')
const remoteSpec = apiUrl ? `${apiUrl}/docs/openapi.json` : undefined
const localSpec = './openapi.json'

const input = remoteSpec ?? localSpec
if (!remoteSpec && !existsSync(localSpec)) {
  throw new Error('VITE_API_URL is not set and no local openapi.json found')
}

export default defineConfig({
  input,
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
