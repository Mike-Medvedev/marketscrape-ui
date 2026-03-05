import { client } from '@/generated/client.gen'
import { getToken } from '@/infra/auth-token'

client.instance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
