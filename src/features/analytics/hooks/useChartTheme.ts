import { useTheme } from '../../../hooks/useTheme'

export interface ChartTheme {
  grid: string
  text: string
  tooltip: {
    bg: string
    border: string
    text: string
  }
}

export function useChartTheme(): ChartTheme {
  const { isDark } = useTheme()
  return isDark
    ? {
        grid: '#27272a',
        text: '#71717a',
        tooltip: { bg: '#18181b', border: '#3f3f46', text: '#e4e4e7' },
      }
    : {
        grid: '#e2e8f0',
        text: '#94a3b8',
        tooltip: { bg: '#ffffff', border: '#e2e8f0', text: '#0f172a' },
      }
}
