import { z } from 'zod/v4'
import type { User } from '@supabase/supabase-js'

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

export interface AuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated'
  user: User | null
  email: string | null
}
