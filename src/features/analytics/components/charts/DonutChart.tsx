import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { useChartTheme } from '../../hooks/useChartTheme'

interface Segment {
  name: string
  value: number
  color: string
}

interface Props {
  data: Segment[]
  height?: number
  innerRadius?: number
  valueFormatter?: (v: number) => string
}

export default function DonutChart({ data, height = 200, innerRadius = 55, valueFormatter }: Props) {
  const theme = useChartTheme()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius}
          outerRadius={innerRadius + 38}
          paddingAngle={2}
          dataKey="value"
          strokeWidth={0}
        >
          {data.map((seg, i) => (
            <Cell key={i} fill={seg.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: theme.tooltip.bg,
            border: `1px solid ${theme.tooltip.border}`,
            borderRadius: 6,
            fontSize: 12,
            color: theme.tooltip.text,
          }}
          labelStyle={{ color: theme.tooltip.label, fontSize: 11, marginBottom: 2 }}
          itemStyle={{ color: theme.tooltip.text }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v, _key, props: any) => [
            valueFormatter ? valueFormatter(Number(v)) : `${v}%`,
            props?.payload?.name ?? '',
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
