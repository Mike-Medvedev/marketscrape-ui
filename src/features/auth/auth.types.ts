import { z } from 'zod/v4'

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginPayload = z.infer<typeof loginSchema>

export const signupSchema = z
  .object({
    email: z.email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type SignupPayload = z.infer<typeof signupSchema>

const authResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    sessionToken: z.string(),
    email: z.string(),
  }),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

export function parseAuthResponse(data: unknown): AuthResponse {
  return authResponseSchema.parse(data)
}

const meResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    email: z.string(),
  }),
})

export type MeResponse = z.infer<typeof meResponseSchema>

export function parseMeResponse(data: unknown): MeResponse {
  return meResponseSchema.parse(data)
}

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})

export type ApiError = z.infer<typeof apiErrorSchema>

export interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  email: string | null
}
