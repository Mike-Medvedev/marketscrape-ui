import { IconSparkles } from '@tabler/icons-react'
import { Button } from '@mantine/core'
import type { ReactNode } from 'react'
import '@/features/search/components/NewSearchButton.css'

interface NewSearchButtonProps {
  onClick: () => void
  children: ReactNode
  size?: 'default' | 'large'
}

export function NewSearchButton({ onClick, children, size = 'default' }: NewSearchButtonProps) {
  return (
    <Button
      onClick={onClick}
      color="amber"
      size={size === 'large' ? 'lg' : 'md'}
      leftSection={<IconSparkles size={size === 'large' ? 20 : 16} className="new-search-btn-icon" />}
      className="new-search-btn"
    >
      <span className="new-search-btn-gradient" />
      {children}
    </Button>
  )
}
