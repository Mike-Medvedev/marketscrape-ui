import { notifications } from '@mantine/notifications'
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react'
import { createElement } from 'react'
import { ActionToast } from '@/theme/components/ActionToast/ActionToast'

interface ToastAction {
  label: string
  onClick: () => void
}

interface ToastOptions {
  title?: string
  message: string
  action?: ToastAction
  autoClose?: number
}

function renderMessage(message: string, action?: ToastAction) {
  return createElement(ActionToast, { message, action })
}

export const toast = {
  success({ title = 'Success', message, action, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message: renderMessage(message, action),
      color: 'green',
      icon: createElement(IconCheck, { size: 18 }),
      autoClose,
    })
  },

  error({ title = 'Error', message, action, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message: renderMessage(message, action),
      color: 'red',
      icon: createElement(IconX, { size: 18 }),
      autoClose,
    })
  },

  warning({ title = 'Warning', message, action, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message: renderMessage(message, action),
      color: 'yellow',
      icon: createElement(IconAlertTriangle, { size: 18 }),
      autoClose,
    })
  },

  info({ title = 'Info', message, action, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message: renderMessage(message, action),
      color: 'blue',
      icon: createElement(IconInfoCircle, { size: 18 }),
      autoClose,
    })
  },
}
