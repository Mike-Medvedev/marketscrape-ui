import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { APIProvider } from '@vis.gl/react-google-maps'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import '@/index.css'
import '@/errors/ApiErrorAction.css'
import { theme } from '@/theme/theme'
import { queryClient } from '@/infra/tanstack.client'
import { settings } from '@/settings'
import { Router } from '@/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <APIProvider apiKey={settings.env.VITE_GOOGLE_MAPS_API_KEY}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <Notifications position="top-right" autoClose={4000} />
          <Router />
        </MantineProvider>
      </QueryClientProvider>
    </APIProvider>
  </StrictMode>,
)
