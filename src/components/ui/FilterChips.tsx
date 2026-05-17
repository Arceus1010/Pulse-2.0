interface FilterChipItem {
  value: string
  label: string
  color?: string
  count?: number
}

interface Props {
  items: FilterChipItem[]
  active: string[]
  onToggle: (value: string) => void
  label?: string
  minActive?: number
  className?: string
}

export default function FilterChips({ items, active, onToggle, label, minActive = 1, className }: Props) {
  const activeSet = new Set(active)

  const handleToggle = (value: string) => {
    if (activeSet.has(value) && active.length <= minActive) return
    onToggle(value)
  }

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      {label && (
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 shrink-0">
          {label}
        </span>
      )}
      <div className="flex flex-wrap gap-1.5">
        {items.map(item => {
          const isActive = activeSet.has(item.value)
          return (
            <button
              key={item.value}
              onClick={() => handleToggle(item.value)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border capitalize transition-all ${
                isActive
                  ? 'bg-white dark:bg-zinc-700 border-slate-200 dark:border-zinc-600 text-slate-800 dark:text-zinc-100 shadow-sm'
                  : 'bg-transparent border-slate-200 dark:border-zinc-700 text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 hover:border-slate-300 dark:hover:border-zinc-600'
              }`}
            >
              {item.color !== undefined && (
                <span
                  className="w-2 h-2 rounded-full shrink-0 transition-colors"
                  style={{ background: isActive ? item.color : '#94a3b8' }}
                />
              )}
              {item.label}
              {item.count !== undefined && (
                <span className={`font-mono ${isActive ? 'text-slate-400 dark:text-zinc-500' : 'text-slate-300 dark:text-zinc-600'}`}>
                  {item.count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
