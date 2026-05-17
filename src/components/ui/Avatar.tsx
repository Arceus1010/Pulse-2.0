interface Props {
  initials: string
  className?: string
}

export default function Avatar({ initials, className }: Props) {
  return (
    <div className={`w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-[11px] font-bold text-blue-700 dark:text-blue-400 shrink-0 ${className ?? ''}`}>
      {initials}
    </div>
  )
}
