import { type ReactNode, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { AppShell, Avatar, Menu } from '@mantine/core'
import {
  IconSearch,
  IconRefresh,
  IconLogout,
  IconMenu2,
  IconX,
  IconSettings,
  IconUser,
} from '@tabler/icons-react'
import { IdentityAbsorber } from '@/features/search/components/IdentityAbsorber/IdentityAbsorber'
import {
  requestIdentitySync,
  useIdentitySyncListener,
} from '@/utils/identity-sync.utils'
import { useAuth, useMe } from '@/features/auth/hooks/auth.hook'
import './AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

function getUserInitials(
  firstName: string | null,
  lastName: string | null,
  email: string | null,
): string {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase()
  }
  if (firstName) return firstName[0].toUpperCase()
  if (email) return email[0].toUpperCase()
  return ''
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const { logout, email } = useAuth()
  const { data: meResponse } = useMe()
  const me = meResponse?.data

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

  const initials = getUserInitials(
    me?.firstName ?? null,
    me?.lastName ?? null,
    email,
  )

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
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <button className="app-avatar-button" aria-label="User menu">
                  <Avatar
                    size="md"
                    radius="xl"
                    color="yellow"
                    className="app-avatar"
                  >
                    {initials || <IconUser size={18} />}
                  </Avatar>
                </button>
              </Menu.Target>

              <Menu.Dropdown className="app-menu-dropdown">
                <Menu.Item
                  leftSection={<IconSettings size={16} />}
                  onClick={() => navigate('/settings')}
                >
                  Settings
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconRefresh size={16} />}
                  disabled={showSyncModal}
                  onClick={requestIdentitySync}
                >
                  Sync Identity
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconLogout size={16} />}
                  color="red"
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
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
              onClick={() => { navigate('/settings'); closeMobileMenu() }}
              className="app-mobile-menu-item"
            >
              <IconSettings size={18} />
              <span>Settings</span>
            </button>

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
