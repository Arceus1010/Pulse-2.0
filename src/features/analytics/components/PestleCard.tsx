import type { PestleEntry } from '../types'
import { PESTLE_COLORS } from '../constants'
import { PESTLE_LETTER_DISPLAY } from '../mock-data'

interface Props {
  entry: PestleEntry
  active: boolean
  onClick: () => void
}

export default function PestleCard({ entry, active, onClick }: Props) {
  const color = PESTLE_COLORS[entry.dimension]
  const letter = PESTLE_LETTER_DISPLAY[entry.dimension]

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-4 transition-all ${
        active
          ? 'border-slate-400 dark:border-zinc-600 bg-slate-100 dark:bg-zinc-800'
          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl font-bold leading-none" style={{ color }}>{letter}</span>
        <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">{entry.percentage}%</span>
      </div>
      <p className="text-xs font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1">{entry.name}</p>
      <p className="text-xl font-bold text-slate-900 dark:text-zinc-100 mb-1" style={{ color }}>{entry.count.toLocaleString()}</p>
      <p className="text-[10px] text-slate-400 dark:text-zinc-500 mb-3">posts tagged</p>

      <div className="h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${entry.percentage * 3}%`, background: color }} />
      </div>

      <div className="flex flex-wrap gap-1">
        {entry.tags.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${color}18`, color }}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
