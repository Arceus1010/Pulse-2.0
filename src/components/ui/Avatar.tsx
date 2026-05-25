import { cn } from '@/lib/cn'

type Size = 'sm' | 'md' | 'lg'

const sizeClasses: Record<Size, string> = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
}

interface Props {
  initials: string
  className?: string
  label?: string
  size?: Size
}

export default function Avatar({ initials, className, label, size = 'md' }: Props) {
  return (
    <div
      role="img"
      aria-label={label ?? initials}
      title={label ?? initials}
      className={cn(
        'rounded-full bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center font-bold text-blue-700 dark:text-blue-400 shrink-0',
        sizeClasses[size],
        className
      )}>
      {initials?.trim().slice(0, 2).toUpperCase() || '?'}
    </div>
  )
}
