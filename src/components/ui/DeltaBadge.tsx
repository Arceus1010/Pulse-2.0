interface Props {
  delta: number
}

export default function DeltaBadge({ delta }: Props) {
  const up = delta >= 0
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-1.5 py-0.5 rounded ${
      up
        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
        : 'bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400'
    }`}>
      {up ? '↑' : '↓'}{Math.abs(delta)}%
    </span>
  )
}
