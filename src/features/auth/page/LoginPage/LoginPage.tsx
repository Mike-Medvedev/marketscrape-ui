import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { TextInput, PasswordInput, Button, Title, Text, Alert, Stack, Divider } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import { IconAlertCircle, IconBrandGoogle, IconBrandGithub } from '@tabler/icons-react'
import { loginSchema, type LoginPayload } from '@/features/auth/auth.types'
import { useAuth } from '@/features/auth/hooks/auth.hook'
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout/AuthPageLayout'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, signInWithOAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginPayload>({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: zod4Resolver(loginSchema),
  })

  const handleSubmit = async (values: LoginPayload) => {
    setError(null)
    setLoading(true)
    try {
      await login(values.email, values.password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async (provider: 'google' | 'github') => {
    setError(null)
    try {
      await signInWithOAuth(provider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <AuthPageLayout>
      <div className="auth-card">
        <Title order={2} className="auth-card-title">
          Welcome back
        </Title>
        <Text size="sm" c="dimmed" className="auth-card-subtitle">
          Sign in to your account
        </Text>

        {error && (
          <Alert
            icon={<IconAlertCircle size={18} />}
            color="red"
            variant="light"
            className="auth-card-alert"
          >
            {error}
          </Alert>
        )}

        <Stack gap="sm" className="auth-oauth-buttons">
          <Button
            variant="default"
            fullWidth
            leftSection={<IconBrandGoogle size={18} />}
            onClick={() => handleOAuth('google')}
          >
            Continue with Google
          </Button>
          <Button
            variant="default"
            fullWidth
            leftSection={<IconBrandGithub size={18} />}
            onClick={() => handleOAuth('github')}
          >
            Continue with GitHub
          </Button>
        </Stack>

        <Divider label="or" labelPosition="center" className="auth-divider" />

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
              {...form.getInputProps('email')}
              key={form.key('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              autoComplete="current-password"
              {...form.getInputProps('password')}
              key={form.key('password')}
            />
            <Button type="submit" fullWidth loading={loading}>
              Sign in
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" className="auth-card-footer">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="auth-card-link">
            Sign up
          </Link>
        </Text>
      </div>
    </AuthPageLayout>
  )
}
