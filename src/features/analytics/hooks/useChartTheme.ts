import { useTheme } from '../../../hooks/useTheme'

export interface ChartTheme {
  grid: string
  text: string
  cursor: string
  tooltip: {
    bg: string
    border: string
    text: string
    label: string
  }
}

export function useChartTheme(): ChartTheme {
  const { isDark } = useTheme()
  return isDark
    ? {
        grid: '#27272a',
        text: '#71717a',
        cursor: 'rgba(255,255,255,0.05)',
        tooltip: { bg: '#18181b', border: '#3f3f46', text: '#e4e4e7', label: '#a1a1aa' },
      }
    : {
        grid: '#e2e8f0',
        text: '#94a3b8',
        cursor: 'rgba(0,0,0,0.04)',
        tooltip: { bg: '#ffffff', border: '#e2e8f0', text: '#1e293b', label: '#64748b' },
      }
}
