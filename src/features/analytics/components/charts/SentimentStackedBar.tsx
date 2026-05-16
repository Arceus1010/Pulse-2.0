import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { useChartTheme } from '../../hooks/useChartTheme'
import { SENTIMENT_COLORS } from '../../constants'

interface DataPoint {
  [key: string]: string | number
}

interface Props {
  data: DataPoint[]
  xKey?: string
  height?: number
}

export default function SentimentStackedBar({ data, xKey = 'period', height = 240 }: Props) {
  const theme = useChartTheme()
  const tooltipStyle = {
    backgroundColor: theme.tooltip.bg,
    border: `1px solid ${theme.tooltip.border}`,
    borderRadius: 6,
    fontSize: 12,
    color: theme.tooltip.text,
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: theme.text, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: theme.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={v => `${v}%`}
          domain={[0, 100]}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => typeof v === 'number' ? `${v}%` : v} />
        <Bar dataKey="positive" stackId="s" fill={`${SENTIMENT_COLORS.positive}88`} stroke={SENTIMENT_COLORS.positive} strokeWidth={1} name="Positive" />
        <Bar dataKey="neutral" stackId="s" fill={`${SENTIMENT_COLORS.neutral}88`} stroke={SENTIMENT_COLORS.neutral} strokeWidth={1} name="Neutral" />
        <Bar dataKey="negative" stackId="s" fill={`${SENTIMENT_COLORS.negative}88`} stroke={SENTIMENT_COLORS.negative} strokeWidth={1} name="Negative" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
