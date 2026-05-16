import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  label: string
  value: string | number
  delta: number
  unit?: string
}

export default function KPICard({ label, value, delta, unit }: Props) {
  const isPos = delta > 0
  const isNeg = delta < 0

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg p-4 hover:border-slate-300 dark:hover:border-zinc-700 transition-colors">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3">
        {label}
      </p>
      <p className="text-2xl font-bold text-slate-900 dark:text-zinc-100 leading-none mb-2">
        {value}
        {unit && <span className="text-sm font-normal text-slate-400 dark:text-zinc-500 ml-1">{unit}</span>}
      </p>
      <div className={`flex items-center gap-1 text-xs font-medium ${
        isPos ? 'text-emerald-600 dark:text-emerald-400'
        : isNeg ? 'text-red-500 dark:text-red-400'
        : 'text-slate-400 dark:text-zinc-500'
      }`}>
        {isPos ? <TrendingUp className="w-3 h-3" />
          : isNeg ? <TrendingDown className="w-3 h-3" />
          : <Minus className="w-3 h-3" />}
        <span>{isPos ? '+' : ''}{delta}% vs prev period</span>
      </div>
    </div>
  )
}
