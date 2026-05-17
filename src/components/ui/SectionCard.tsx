import type { ReactNode } from 'react'

interface Props {
  title: string
  children: ReactNode
  action?: ReactNode
  className?: string
  contentClassName?: string
}

export default function SectionCard({ title, children, action, className, contentClassName }: Props) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden ${className ?? ''}`}>
      <div className="px-4 py-3 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-zinc-400 shrink-0">
          {title}
        </h2>
        {action}
      </div>
      <div className={contentClassName ?? 'p-4'}>{children}</div>
    </div>
  )
}
