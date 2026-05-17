interface ProgressSegment {
  width: number
  color: string
}

interface Props {
  segments: ProgressSegment[]
  height?: number
  className?: string
  animated?: boolean
}

export default function ProgressBar({ segments, height = 6, className, animated }: Props) {
  return (
    <div
      className={`flex rounded-full overflow-hidden w-full ${className ?? ''}`}
      style={{ height }}
    >
      {segments.map((seg, i) => (
        <div
          key={i}
          style={{
            width: `${seg.width}%`,
            background: seg.color,
            ...(animated ? { transition: 'width 0.4s ease' } : {}),
          }}
        />
      ))}
    </div>
  )
}
