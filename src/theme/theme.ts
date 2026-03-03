import { createTheme } from '@mantine/core'
import type { MantineColorsTuple } from '@mantine/core'

const amber: MantineColorsTuple = [
  '#fefce8',
  '#fef9c3',
  '#fef08a',
  '#fde047',
  '#facc15',
  '#f5c000',
  '#e0b000',
  '#c89e00',
  '#a68300',
  '#856a00',
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
