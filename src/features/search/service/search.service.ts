// import { httpClient } from '../../../infra/http.client'
// import { activeSearchSchema } from '../search.types'
// import { z } from 'zod/v4'

import type {
  ActiveSearch,
  CreateSearchPayload,
  UpdateSearchPayload,
} from '../search.types'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let mockSearches: ActiveSearch[] = [
  {
    id: '1',
    status: 'running',
    criteria: {
      query: 'Fender Stratocaster',
      location: 'San Francisco, CA',
      minPrice: '800',
      maxPrice: '2000',
      dateListed: '7d',
    },
    settings: {
      frequency: 'Every 2 hours',
      listingsPerCheck: 20,
      notifications: ['email'],
    },
    createdAt: new Date(),
    lastRun: new Date(Date.now() - 1000 * 60 * 45),
  },
  {
    id: '2',
    status: 'refresh',
    criteria: {
      query: 'Gibson Les Paul',
      location: 'Los Angeles, CA',
      minPrice: '1500',
      maxPrice: '4000',
      dateListed: '24h',
    },
    settings: {
      frequency: 'Every hour',
      listingsPerCheck: 10,
      notifications: ['email', 'sms'],
    },
    createdAt: new Date(),
    lastRun: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: '3',
    status: 'error',
    criteria: {
      query: 'Martin D-28',
      location: 'Austin, TX',
      minPrice: '2000',
      maxPrice: '5000',
      dateListed: '7d',
    },
    settings: {
      frequency: 'Every 6 hours',
      listingsPerCheck: 15,
      notifications: ['webhook'],
    },
    createdAt: new Date(),
    lastRun: new Date(Date.now() - 1000 * 60 * 360),
  },
]

let nextId = 4

export async function getSearches(): Promise<ActiveSearch[]> {
  await delay(400)
  return [...mockSearches]
  // const { data } = await httpClient.get('/searches')
  // return z.array(activeSearchSchema).parse(data)
}

export async function getSearchById(id: string): Promise<ActiveSearch> {
  await delay(300)
  const search = mockSearches.find((s) => s.id === id)
  if (!search) throw new Error(`Search ${id} not found`)
  return { ...search }
  // const { data } = await httpClient.get(`/searches/${id}`)
  // return activeSearchSchema.parse(data)
}

export async function createSearch(payload: CreateSearchPayload): Promise<ActiveSearch> {
  await delay(500)
  const search: ActiveSearch = {
    id: String(nextId++),
    criteria: payload.criteria,
    settings: payload.settings,
    status: 'running',
    createdAt: new Date(),
  }
  mockSearches = [...mockSearches, search]
  return search
  // const { data } = await httpClient.post('/searches', payload)
  // return activeSearchSchema.parse(data)
}

export async function updateSearch(id: string, payload: UpdateSearchPayload): Promise<ActiveSearch> {
  await delay(500)
  const index = mockSearches.findIndex((s) => s.id === id)
  if (index === -1) throw new Error(`Search ${id} not found`)
  const updated: ActiveSearch = {
    ...mockSearches[index],
    criteria: payload.criteria,
    settings: payload.settings,
  }
  mockSearches = mockSearches.map((s) => (s.id === id ? updated : s))
  return updated
  // const { data } = await httpClient.put(`/searches/${id}`, payload)
  // return activeSearchSchema.parse(data)
}

export async function deleteSearch(id: string): Promise<void> {
  await delay(300)
  mockSearches = mockSearches.filter((s) => s.id !== id)
  // await httpClient.delete(`/searches/${id}`)
}
