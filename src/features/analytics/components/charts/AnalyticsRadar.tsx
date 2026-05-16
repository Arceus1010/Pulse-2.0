import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip } from 'recharts'
import { useChartTheme } from '../../hooks/useChartTheme'
import { CHART_COLORS } from '../../constants'

interface DataPoint {
  dim: string
  negative: number
  positive: number
}

interface Props {
  data: DataPoint[]
  height?: number
}

export default function AnalyticsRadar({ data, height = 280 }: Props) {
  const theme = useChartTheme()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 8, right: 24, bottom: 8, left: 24 }}>
        <PolarGrid stroke={theme.grid} />
        <PolarAngleAxis
          dataKey="dim"
          tick={{ fill: theme.text, fontSize: 11, fontFamily: 'inherit' }}
        />
        <Radar
          name="Negative"
          dataKey="negative"
          stroke={CHART_COLORS.red}
          fill={CHART_COLORS.red}
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Radar
          name="Positive"
          dataKey="positive"
          stroke={CHART_COLORS.blue}
          fill={CHART_COLORS.blue}
          fillOpacity={0.12}
          strokeWidth={2}
          strokeDasharray="5 4"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.tooltip.bg,
            border: `1px solid ${theme.tooltip.border}`,
            borderRadius: 6,
            fontSize: 12,
            color: theme.tooltip.text,
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
