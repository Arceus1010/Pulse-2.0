import { ChevronRight } from 'lucide-react'
import type { PestleEntry } from '../types'
import { PESTLE_COLORS, PESTLE_LETTER_DISPLAY } from '../constants'

interface Props {
  entry: PestleEntry
  active: boolean
  onClick: () => void
  maxPercentage: number
}

export default function PestleCard({ entry, active, onClick, maxPercentage }: Props) {
  const color = PESTLE_COLORS[entry.dimension]
  const letter = PESTLE_LETTER_DISPLAY[entry.dimension]
  const barWidth = Math.round((entry.percentage / maxPercentage) * 85)

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-lg border p-4 transition-all cursor-pointer ${
        active
          ? 'border-transparent bg-slate-50 dark:bg-zinc-800'
          : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-sm'
      }`}
      style={active ? { boxShadow: `0 0 0 2px ${color}` } : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-3xl font-bold leading-none" style={{ color }}>{letter}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs font-mono text-slate-400 dark:text-zinc-500">{entry.percentage}%</span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-all duration-200 ${
              active ? 'opacity-100 rotate-90' : 'opacity-0 group-hover:opacity-50'
            }`}
            style={{ color }}
          />
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400 uppercase tracking-wide mb-1">{entry.name}</p>
      <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 mb-0.5" style={{ color }}>{entry.count.toLocaleString()}</p>
      <p className="text-xs text-slate-400 dark:text-zinc-500 mb-3">posts tagged</p>

      <div className="h-1 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${barWidth}%`, background: color }}
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {entry.tags.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 rounded text-xs font-medium" style={{ background: `${color}18`, color }}>
            {tag}
          </span>
        ))}
      </div>
    </button>
  )
}
