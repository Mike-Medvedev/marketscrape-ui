import { createTheme } from '@mantine/core'
import type { MantineColorsTuple } from '@mantine/core'

const amber: MantineColorsTuple = [
  '#fffbeb',
  '#fef3c7',
  '#fde68a',
  '#facc15',
  '#eab308',
  '#ca8a04',
  '#a16207',
  '#854d0e',
  '#713f12',
  '#422006',
]

export const theme = createTheme({
  primaryColor: 'amber',
  primaryShade: 4,
  autoContrast: true,
  colors: {
    amber,
  },
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: "'JetBrains Mono', 'Roboto Mono', 'Courier New', monospace",
  radius: {
    xs: '0.225rem',
    sm: '0.425rem',
    md: '0.625rem',
    lg: '1.025rem',
    xl: '1.5rem',
  },
})
