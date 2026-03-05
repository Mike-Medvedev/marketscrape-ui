import { type ReactNode, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { AppShell } from '@mantine/core'
import { IconSearch, IconRefresh, IconLogout, IconMenu2, IconX } from '@tabler/icons-react'
import { IdentityAbsorber } from '@/features/search/components/IdentityAbsorber/IdentityAbsorber'
import {
  requestIdentitySync,
  useIdentitySyncListener,
} from '@/utils/identity-sync.utils'
import { useAuth } from '@/features/auth/hooks/auth.hook'
import './AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showSyncModal, setShowSyncModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSyncRequested = useCallback(() => {
    setShowSyncModal(true)
  }, [])

  useIdentitySyncListener(handleSyncRequested)

  const handleLogout = useCallback(async () => {
    await logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header className="app-header">
        <div className="app-header-inner">
          <button
            onClick={() => navigate('/')}
            className="app-logo-button"
          >
            <div className="app-logo-icon">
              <IconSearch size={20} />
            </div>
            <span className="app-logo-text">marketscrape</span>
          </button>

          <div className="app-header-actions">
            <button
              onClick={requestIdentitySync}
              disabled={showSyncModal}
              className={`app-sync-button${showSyncModal ? ' app-sync-button--disabled' : ''}`}
            >
              <IconRefresh size={16} />
              <span>Sync</span>
            </button>

            <button onClick={handleLogout} className="app-logout-button">
              <IconLogout size={16} />
              <span>Logout</span>
            </button>
          </div>

          <button
            className="app-mobile-toggle"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
          </button>
        </div>
      </AppShell.Header>

      {mobileMenuOpen && (
        <>
          <div className="app-mobile-backdrop" onClick={closeMobileMenu} />
          <div className="app-mobile-menu">
            <button
              onClick={() => { requestIdentitySync(); closeMobileMenu() }}
              disabled={showSyncModal}
              className={`app-mobile-menu-item${showSyncModal ? ' app-mobile-menu-item--disabled' : ''}`}
            >
              <IconRefresh size={18} />
              <span>Sync Identity</span>
            </button>

            <button
              onClick={() => { handleLogout(); closeMobileMenu() }}
              className="app-mobile-menu-item app-mobile-menu-item--danger"
            >
              <IconLogout size={18} />
              <span>Logout</span>
            </button>
          </div>
        </>
      )}

      <AppShell.Main>{children}</AppShell.Main>

      <IdentityAbsorber
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
      />
    </AppShell>
  )
}
