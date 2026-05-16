import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'
import { useChartTheme } from '../../hooks/useChartTheme'

interface Segment {
  name: string
  value: number
  color?: string
}

interface Props {
  data: Segment[]
  height?: number
  defaultColor?: string
  valueFormatter?: (v: number) => string
}

export default function HorizontalBar({ data, height, defaultColor = '#3b82f6', valueFormatter }: Props) {
  const theme = useChartTheme()
  const h = height ?? Math.max(180, data.length * 36)

  const fmt = (v: number) => (valueFormatter ? valueFormatter(v) : String(v))

  return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: theme.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={valueFormatter}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={90}
          tick={{ fill: theme.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: theme.cursor }}
          contentStyle={{
            backgroundColor: theme.tooltip.bg,
            border: `1px solid ${theme.tooltip.border}`,
            borderRadius: 6,
            fontSize: 12,
            color: theme.tooltip.text,
          }}
          labelStyle={{ color: theme.tooltip.label, fontSize: 11, marginBottom: 2 }}
          itemStyle={{ color: theme.tooltip.text }}
          formatter={(v) => [typeof v === 'number' ? fmt(v) : v, '']}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((seg, i) => (
            <Cell key={i} fill={seg.color ?? defaultColor} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
