import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router'
import { Title, Text, Loader, Stack, RingProgress } from '@mantine/core'
import { IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { getApiErrorCode } from '@/features/auth/hooks/auth-error.hook'
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout/AuthPageLayout'
import * as authService from '@/features/auth/service/auth.service'
import './VerifyPage.css'

type VerifyStatus = 'verifying' | 'success' | 'expired' | 'error'

const VERIFY_ERROR_MAP: Record<string, VerifyStatus> = {
  VERIFICATION_TOKEN_EXPIRED: 'expired',
}

const REDIRECT_DELAY = 3000

export function VerifyPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<VerifyStatus>('verifying')
  const [countdown, setCountdown] = useState(REDIRECT_DELAY / 1000)
  const calledRef = useRef(false)

  const token = searchParams.get('token')

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    if (!token) {
      setStatus('error')
      return
    }

    authService
      .verify(token)
      .then(() => {
        setStatus('success')
      })
      .catch((err) => {
        const code = getApiErrorCode(err)
        setStatus(code && VERIFY_ERROR_MAP[code] ? VERIFY_ERROR_MAP[code] : 'error')
      })
  }, [token])

  useEffect(() => {
    if (status !== 'success') return

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate('/login', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [status, navigate])

  return (
    <AuthPageLayout>
      <div className="auth-card verify-card">
        {status === 'verifying' && (
          <Stack align="center" gap="md">
            <Loader color="var(--primary)" size="lg" />
            <Title order={3} className="auth-card-title" ta="center">
              Verifying your email
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Please wait while we confirm your account...
            </Text>
          </Stack>
        )}

        {status === 'success' && (
          <Stack align="center" gap="lg">
            <div className="verify-success-check">
              <IconCircleCheck size={48} />
            </div>
            <div>
              <Title order={2} className="auth-card-title" ta="center">
                You&apos;re all set!
              </Title>
              <Text size="sm" c="dimmed" ta="center" mt={4}>
                Your email has been successfully verified.
              </Text>
            </div>
            <div className="verify-redirect-ring">
              <RingProgress
                size={56}
                thickness={3}
                roundCaps
                sections={[
                  {
                    value: (countdown / (REDIRECT_DELAY / 1000)) * 100,
                    color: 'var(--primary)',
                  },
                ]}
                label={
                  <Text ta="center" size="sm" fw={600}>
                    {countdown}
                  </Text>
                }
              />
              <Text size="xs" c="dimmed">
                Redirecting to login...
              </Text>
            </div>
            <Link to="/login" className="auth-card-link verify-login-link">
              Go to login now
            </Link>
          </Stack>
        )}

        {status === 'expired' && (
          <Stack align="center" gap="md">
            <div className="verify-icon verify-icon--error">
              <IconAlertTriangle size={40} />
            </div>
            <Title order={3} className="auth-card-title" ta="center">
              Link expired
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              This verification link has expired. Please sign up again.
            </Text>
            <Text size="sm" ta="center" className="auth-card-footer">
              <Link to="/signup" className="auth-card-link">
                Sign up again
              </Link>
            </Text>
          </Stack>
        )}

        {status === 'error' && (
          <Stack align="center" gap="md">
            <div className="verify-icon verify-icon--error">
              <IconAlertTriangle size={40} />
            </div>
            <Title order={3} className="auth-card-title" ta="center">
              Verification failed
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              We couldn&apos;t verify your email. The link may be invalid.
            </Text>
            <Text size="sm" ta="center" className="auth-card-footer">
              <Link to="/login" className="auth-card-link">
                Back to login
              </Link>
            </Text>
          </Stack>
        )}
      </div>
    </AuthPageLayout>
  )
}
