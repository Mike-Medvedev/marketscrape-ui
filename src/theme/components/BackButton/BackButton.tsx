import { useNavigate } from 'react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import './BackButton.css'

interface BackButtonProps {
  to?: string
  label?: string
  onClick?: () => void
}

export function BackButton({ to = '/', label = 'Back', onClick }: BackButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      navigate(to)
    }
  }

  return (
    <button className="back-button" onClick={handleClick}>
      <IconArrowLeft size={18} />
      <span>{label}</span>
    </button>
  )
}
