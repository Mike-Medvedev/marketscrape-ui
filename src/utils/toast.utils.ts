import { notifications } from '@mantine/notifications'
import {
  IconCheck,
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react'
import { createElement } from 'react'

interface ToastOptions {
  title?: string
  message: string
  autoClose?: number
}

export const toast = {
  success({ title = 'Success', message, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message,
      color: 'green',
      icon: createElement(IconCheck, { size: 18 }),
      autoClose,
    })
  },

  error({ title = 'Error', message, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message,
      color: 'red',
      icon: createElement(IconX, { size: 18 }),
      autoClose,
    })
  },

  warning({ title = 'Warning', message, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message,
      color: 'yellow',
      icon: createElement(IconAlertTriangle, { size: 18 }),
      autoClose,
    })
  },

  info({ title = 'Info', message, autoClose }: ToastOptions) {
    notifications.show({
      title,
      message,
      color: 'blue',
      icon: createElement(IconInfoCircle, { size: 18 }),
      autoClose,
    })
  },
}
