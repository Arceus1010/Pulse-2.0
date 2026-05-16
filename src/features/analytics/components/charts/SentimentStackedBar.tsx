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
  horizontal?: boolean
}

export default function SentimentStackedBar({ data, xKey = 'period', height = 240, horizontal = false }: Props) {
  const theme = useChartTheme()

  const tooltipStyle = {
    cursor: { fill: theme.cursor },
    contentStyle: {
      backgroundColor: theme.tooltip.bg,
      border: `1px solid ${theme.tooltip.border}`,
      borderRadius: 6,
      fontSize: 12,
      color: theme.tooltip.text,
    },
    labelStyle: { color: theme.tooltip.label, fontSize: 11, marginBottom: 2 },
    itemStyle: { color: theme.tooltip.text },
    formatter: (v: unknown): string => (typeof v === 'number' ? `${v}%` : String(v)),
  }

  if (horizontal) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
          <XAxis
            type="number"
            domain={[0, 100]}
            tick={{ fill: theme.text, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey={xKey}
            width={80}
            tick={{ fill: theme.text, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="positive" stackId="s" fill={`${SENTIMENT_COLORS.positive}88`} stroke={SENTIMENT_COLORS.positive} strokeWidth={1} name="Positive" />
          <Bar dataKey="neutral" stackId="s" fill={`${SENTIMENT_COLORS.neutral}88`} stroke={SENTIMENT_COLORS.neutral} strokeWidth={1} name="Neutral" />
          <Bar dataKey="negative" stackId="s" fill={`${SENTIMENT_COLORS.negative}88`} stroke={SENTIMENT_COLORS.negative} strokeWidth={1} name="Negative" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )
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
        <Tooltip {...tooltipStyle} />
        <Bar dataKey="positive" stackId="s" fill={`${SENTIMENT_COLORS.positive}88`} stroke={SENTIMENT_COLORS.positive} strokeWidth={1} name="Positive" />
        <Bar dataKey="neutral" stackId="s" fill={`${SENTIMENT_COLORS.neutral}88`} stroke={SENTIMENT_COLORS.neutral} strokeWidth={1} name="Neutral" />
        <Bar dataKey="negative" stackId="s" fill={`${SENTIMENT_COLORS.negative}88`} stroke={SENTIMENT_COLORS.negative} strokeWidth={1} name="Negative" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
