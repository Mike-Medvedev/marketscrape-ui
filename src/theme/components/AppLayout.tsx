import { type ReactNode, useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { AppShell } from '@mantine/core'
import { IconSearch, IconRefresh } from '@tabler/icons-react'
import { IdentityAbsorber } from '@/features/search/components/IdentityAbsorber'
import {
  requestIdentitySync,
  useIdentitySyncListener,
} from '@/utils/identity-sync.utils'
import '@/theme/components/AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()
  const [showSyncModal, setShowSyncModal] = useState(false)

  const handleSyncRequested = useCallback(() => {
    setShowSyncModal(true)
  }, [])

  useIdentitySyncListener(handleSyncRequested)

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

          <button
            onClick={requestIdentitySync}
            className="app-sync-button"
          >
            <IconRefresh size={16} />
            <span>Sync</span>
          </button>
        </div>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>

      <IdentityAbsorber
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
      />
    </AppShell>
  )
}
