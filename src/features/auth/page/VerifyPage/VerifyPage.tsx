import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router'
import { Title, Text, Loader, Stack } from '@mantine/core'
import { IconCircleCheck, IconAlertTriangle } from '@tabler/icons-react'
import { useAuth } from '@/features/auth/hooks/auth.hook'
import { getApiErrorCode } from '@/features/auth/hooks/auth-error.hook'
import { AuthPageLayout } from '@/features/auth/components/AuthPageLayout/AuthPageLayout'
import './VerifyPage.css'

type VerifyStatus = 'verifying' | 'success' | 'expired' | 'error'

const VERIFY_ERROR_MAP: Record<string, VerifyStatus> = {
  VERIFICATION_TOKEN_EXPIRED: 'expired',
}

export function VerifyPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { verify } = useAuth()
  const [status, setStatus] = useState<VerifyStatus>('verifying')

  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setStatus('error')
      return
    }

    verify(token)
      .then(() => {
        setStatus('success')
        setTimeout(() => navigate('/', { replace: true }), 2000)
      })
      .catch((err) => {
        const code = getApiErrorCode(err)
        setStatus(code && VERIFY_ERROR_MAP[code] ? VERIFY_ERROR_MAP[code] : 'error')
      })
  }, [token, verify, navigate])

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
          <Stack align="center" gap="md">
            <div className="verify-icon verify-icon--success">
              <IconCircleCheck size={40} />
            </div>
            <Title order={3} className="auth-card-title" ta="center">
              Email verified
            </Title>
            <Text size="sm" c="dimmed" ta="center">
              Your account has been verified. Redirecting...
            </Text>
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
