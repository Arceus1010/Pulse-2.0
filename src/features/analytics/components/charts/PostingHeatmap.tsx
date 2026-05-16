import { useMemo } from 'react'
import { HeatMapGrid } from 'react-grid-heatmap'
import { useTheme } from '../../../../hooks/useTheme'
import { useChartTheme } from '../../hooks/useChartTheme'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const HOURS = ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22']

function generateData() {
  return Array.from({ length: 7 }, (_, d) =>
    Array.from({ length: 12 }, (_, h) => {
      const hour = h * 2
      const base = d < 5
        ? (hour >= 8 && hour <= 18 ? Math.random() * 80 + 20 : Math.random() * 15)
        : Math.random() * 40
      return Math.floor(base)
    })
  )
}

export default function PostingHeatmap() {
  const data = useMemo(() => generateData(), [])
  const theme = useChartTheme()
  const { isDark } = useTheme()

  const labelStyle = () => ({
    fontSize: '10px',
    color: theme.text,
  })

  return (
    <HeatMapGrid
      data={data}
      xLabels={HOURS}
      yLabels={DAYS}
      cellHeight="24px"
      xLabelsPos="top"
      xLabelsStyle={labelStyle}
      yLabelsStyle={() => ({ ...labelStyle(), paddingRight: '8px' })}
      cellStyle={(_x, _y, ratio) => {
        const base = { borderRadius: '3px', margin: '1px', border: 'none' }
        if (ratio < 0.05) {
          return { ...base, background: isDark ? '#27272a' : 'transparent' }
        }
        const alpha = isDark ? 0.2 + ratio * 0.8 : 0.12 + ratio * 0.88
        return { ...base, background: `hsla(0, 84%, 60%, ${alpha.toFixed(2)})` }
      }}
      cellRender={(x, y, value) => (
        <div
          title={`${DAYS[x]} ${HOURS[y]}:00 — ${value} posts`}
          style={{ width: '100%', height: '100%' }}
        />
      )}
    />
  )
}
