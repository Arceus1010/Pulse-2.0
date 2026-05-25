import { forwardRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'ghost-danger' | 'danger' | 'outline' | 'outline-danger'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: ReactNode
  iconRight?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const VARIANT: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-800 hover:bg-blue-900 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold',
  secondary:
    'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 font-medium',
  ghost:
    'text-slate-500 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-700 dark:hover:text-zinc-200 font-medium',
  'ghost-danger':
    'text-slate-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium',
  danger:
    'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 text-white font-semibold',
  outline:
    'border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-600 font-medium',
  'outline-danger':
    'border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:border-red-300 dark:hover:border-red-800/60 hover:text-red-600 dark:hover:text-red-400 font-medium',
}

const SIZE: Record<ButtonSize, string> = {
  xs: 'h-6 px-2.5 text-xs gap-1',
  sm: 'h-7 px-3 text-sm gap-1.5',
  md: 'h-8 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-base gap-2',
}

// Sizes the <svg> inside the icon slot without the caller needing to pass className
const ICON_SLOT: Record<ButtonSize, string> = {
  xs: 'shrink-0 flex items-center [&>svg]:w-3 [&>svg]:h-3',
  sm: 'shrink-0 flex items-center [&>svg]:w-3 [&>svg]:h-3',
  md: 'shrink-0 flex items-center [&>svg]:w-3.5 [&>svg]:h-3.5',
  lg: 'shrink-0 flex items-center [&>svg]:w-4 [&>svg]:h-4',
}

const LOADER: Record<ButtonSize, string> = {
  xs: 'w-3 h-3',
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconRight,
      loading = false,
      fullWidth = false,
      disabled,
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center rounded-sm transition-colors',
          'cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed select-none whitespace-nowrap',
          VARIANT[variant],
          SIZE[size],
          fullWidth ? 'w-full' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {loading ? (
          <Loader2 className={`${LOADER[size]} animate-spin shrink-0`} />
        ) : icon ? (
          <span className={ICON_SLOT[size]}>{icon}</span>
        ) : null}

        {children != null && <span>{children}</span>}

        {!loading && iconRight != null && (
          <span className={ICON_SLOT[size]}>{iconRight}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
