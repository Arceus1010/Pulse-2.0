import type { TaskPhase } from '../types'
import { TASK_PHASE_LABELS } from '../types'

interface BadgeConfig {
  containerClass: string
  /** Dot class string, or null when no animated dot should be shown. */
  dotClass: string | null
}

const BADGE_CONFIG: Record<TaskPhase, BadgeConfig> = {
  queued:     { containerClass: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400',             dotClass: null },
  planning:   { containerClass: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',            dotClass: 'bg-blue-500 dark:bg-blue-400 animate-pulse' },
  pre_launch: { containerClass: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',        dotClass: null },
  executing:  { containerClass: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',            dotClass: 'bg-blue-500 dark:bg-blue-400 animate-pulse' },
  done:       { containerClass: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400', dotClass: null },
  failed:     { containerClass: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',                dotClass: null },
  canceled:   { containerClass: 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400',            dotClass: null },
}

interface PhaseBadgeProps {
  phase: TaskPhase
  className?: string
}

export function PhaseBadge({ phase, className = '' }: PhaseBadgeProps) {
  const { containerClass, dotClass } = BADGE_CONFIG[phase]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${containerClass} ${className}`}
    >
      {dotClass && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      )}
      {TASK_PHASE_LABELS[phase]}
    </span>
  )
}
