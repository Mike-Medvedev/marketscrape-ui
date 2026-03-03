import { type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { AppShell } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import '@/theme/components/AppLayout.css'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate()

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
        </div>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  )
}
