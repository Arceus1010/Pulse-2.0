import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { useChartTheme } from '../../hooks/useChartTheme'
import { PLATFORM_COLORS } from '../../constants'

interface LineConfig {
  key: string
  color: string
  dashed?: boolean
  label?: string
}

interface Props {
  data: Record<string, string | number>[]
  lines?: LineConfig[]
  bars?: { key: string; colorByIndex?: boolean }
  xKey?: string
  height?: number
  valueFormatter?: (v: number) => string
}

function fmtNum(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
}

export default function TrendLineChart({ data, lines, bars, xKey = 'date', height = 260, valueFormatter = fmtNum }: Props) {
  const theme = useChartTheme()

  const tooltipProps = {
    contentStyle: {
      backgroundColor: theme.tooltip.bg,
      border: `1px solid ${theme.tooltip.border}`,
      borderRadius: 6,
      fontSize: 12,
      color: theme.tooltip.text,
    },
    labelStyle: { color: theme.tooltip.label, fontSize: 11, marginBottom: 2 },
    itemStyle: { color: theme.tooltip.text },
    formatter: (v: unknown): string => typeof v === 'number' ? valueFormatter(v) : String(v),
  }

  if (bars) {
    const colors = Object.values(PLATFORM_COLORS)
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
          <XAxis dataKey="platform" tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={valueFormatter} />
          <Tooltip cursor={{ fill: theme.cursor }} {...tooltipProps} />
          <Bar dataKey={bars.key} radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={valueFormatter} />
        <Tooltip cursor={{ stroke: theme.grid, strokeWidth: 1 }} {...tooltipProps} />
        {(lines ?? []).map(l => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            stroke={l.color}
            strokeWidth={2}
            strokeDasharray={l.dashed ? '5 4' : undefined}
            dot={{ r: 3, fill: l.color, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            name={l.label ?? l.key}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
