import { useMemo, useState, useRef } from 'react'
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

interface TooltipState {
  label: string
  posts: number
  x: number
  y: number
}

export default function PostingHeatmap() {
  const data = useMemo(() => generateData(), [])
  const theme = useChartTheme()
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const labelStyle = () => ({
    fontSize: '10px',
    color: theme.text,
  })

  const handleMouseEnter = (day: number, hour: number, value: number, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip({
      label: `${DAYS[day]} ${HOURS[hour]}:00`,
      posts: value,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!tooltip) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setTooltip(prev => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTooltip(null)}
    >
      <HeatMapGrid
        data={data}
        xLabels={HOURS}
        yLabels={DAYS}
        cellHeight="24px"
        xLabelsPos="top"
        xLabelsStyle={labelStyle}
        yLabelsStyle={() => ({ ...labelStyle(), paddingRight: '8px' })}
        cellStyle={(_x, _y, ratio) => {
          const base = { borderRadius: '3px', margin: '1px', border: 'none', cursor: 'default' }
          if (ratio < 0.05) {
            return { ...base, background: isDark ? '#27272a' : '#f1f5f9' }
          }
          const alpha = isDark ? 0.2 + ratio * 0.8 : 0.12 + ratio * 0.88
          return { ...base, background: `hsla(0, 84%, 60%, ${alpha.toFixed(2)})` }
        }}
        cellRender={(day, hour, value) => (
          <div
            style={{ width: '100%', height: '100%' }}
            onMouseEnter={e => handleMouseEnter(day, hour, value, e)}
          />
        )}
      />

      {tooltip && (
        <div
          className="pointer-events-none absolute z-50 px-2.5 py-1.5 rounded-md text-sm shadow-md"
          style={{
            left: tooltip.x + 12,
            top: tooltip.y - 36,
            backgroundColor: theme.tooltip.bg,
            border: `1px solid ${theme.tooltip.border}`,
            color: theme.tooltip.text,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: theme.tooltip.label }}>{tooltip.label}</span>
          <span className="mx-1.5" style={{ color: theme.tooltip.border }}>·</span>
          <span className="font-semibold">{tooltip.posts} posts</span>
        </div>
      )}
    </div>
  )
}
