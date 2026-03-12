import './ActionToast.css'

interface ActionToastProps {
  message: string
  action?: { label: string; onClick: () => void }
}

export function ActionToast({ message, action }: ActionToastProps) {
  if (!action) return <span>{message}</span>

  return (
    <div className="action-toast">
      <span>{message}</span>
      <button className="action-toast-button" onClick={action.onClick}>
        {action.label}
      </button>
    </div>
  )
}
