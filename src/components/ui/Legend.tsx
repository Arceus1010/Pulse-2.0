interface LegendItem {
  label: string
  color: string
  shape?: 'square' | 'line'
  dashed?: boolean
}

interface Props {
  items: LegendItem[]
  className?: string
}

export default function Legend({ items, className }: Props) {
  return (
    <div className={`flex flex-wrap gap-4 ${className ?? ''}`}>
      {items.map(item => (
        <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
          {item.shape === 'line' ? (
            <span
              className="w-5 rounded-full inline-block shrink-0"
              style={
                item.dashed
                  ? { borderTop: `2px dashed ${item.color}`, height: 0 }
                  : { background: item.color, height: 2 }
              }
            />
          ) : (
            <span className="w-2 h-2 rounded-sm inline-block shrink-0" style={{ background: item.color }} />
          )}
          {item.label}
        </span>
      ))}
    </div>
  )
}
