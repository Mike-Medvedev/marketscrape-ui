import { useState } from 'react'
import { Link } from 'react-router'
import {
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Alert,
  Stack,
  Divider,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zod4Resolver } from 'mantine-form-zod-resolver'
import {
  IconAlertCircle,
  IconMailCheck,
  IconBrandGoogle,
  IconBrandGithub,
} from '@tabler/icons-react'
import { signupSchema, type SignupPayload } from '@/features/auth/auth.types'
import { useAuth } from '@/features/auth/hooks/auth.hook'
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout/AuthPageLayout'
import './SignupPage.css'

export function SignupPage() {
  const { signup, signInWithOAuth } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<SignupPayload>({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '', confirmPassword: '' },
    validate: zod4Resolver(signupSchema),
  })

  const handleSubmit = async (values: SignupPayload) => {
    setError(null)
    setLoading(true)
    try {
      await signup(values.email, values.password)
      setEmailSent(true)
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

  if (emailSent) {
    return (
      <AuthPageLayout>
        <div className="auth-card signup-success">
          <div className="signup-success-icon">
            <IconMailCheck size={40} />
          </div>
          <Title order={2} className="auth-card-title" ta="center">
            Check your email
          </Title>
          <Text size="sm" c="dimmed" ta="center" className="signup-success-text">
            We&apos;ve sent a verification link to your email address.
            Click the link to activate your account.
          </Text>
          <Text size="sm" ta="center" className="auth-card-footer">
            <Link to="/login" className="auth-card-link">
              Back to login
            </Link>
          </Text>
        </div>
      </AuthPageLayout>
    )
  }

  return (
    <AuthPageLayout>
      <div className="auth-card">
        <Title order={2} className="auth-card-title">
          Create an account
        </Title>
        <Text size="sm" c="dimmed" className="auth-card-subtitle">
          Get started with Marketscrape
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
              placeholder="At least 8 characters"
              autoComplete="new-password"
              {...form.getInputProps('password')}
              key={form.key('password')}
            />
            <PasswordInput
              label="Confirm password"
              placeholder="Repeat your password"
              autoComplete="new-password"
              {...form.getInputProps('confirmPassword')}
              key={form.key('confirmPassword')}
            />
            <Button type="submit" fullWidth loading={loading}>
              Create account
            </Button>
          </Stack>
        </form>

        <Text size="sm" ta="center" className="auth-card-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-card-link">
            Log in
          </Link>
        </Text>
      </div>
    </AuthPageLayout>
  )
}
