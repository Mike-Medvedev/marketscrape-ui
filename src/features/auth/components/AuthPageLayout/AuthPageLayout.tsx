import type { ReactNode } from 'react'
import { IconSearch } from '@tabler/icons-react'
import './AuthPageLayout.css'

interface AuthPageLayoutProps {
  children: ReactNode
}

export function AuthPageLayout({ children }: AuthPageLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-page-container">
        <div className="auth-page-logo">
          <div className="auth-page-logo-icon">
            <IconSearch size={24} />
          </div>
          <span className="auth-page-logo-text">marketscrape</span>
        </div>
        {children}
      </div>
    </div>
  )
}
