import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@/index.css'
import '@/errors/ApiErrorAction.css'
import { theme } from '@/theme/theme'
import { queryClient } from '@/infra/tanstack.client'
import { Router } from '@/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Notifications position="top-right" autoClose={4000} />
        <Router />
      </MantineProvider>
    </QueryClientProvider>
  </StrictMode>,
)
