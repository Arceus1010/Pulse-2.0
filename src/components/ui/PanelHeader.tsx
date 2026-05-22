import type { ReactNode } from 'react'

interface Props {
  label: string
  action?: ReactNode
}

export default function PanelHeader({ label, action }: Props) {
  return (
    <div className="h-11 shrink-0 flex items-center justify-between gap-3 px-4 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-10">
      <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
        {label}
      </span>
      {action}
    </div>
  )
}
