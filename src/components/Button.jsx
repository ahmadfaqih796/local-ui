import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

const VARIANT_MAP = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 active:scale-95',
  secondary:
    'bg-surface border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs active:scale-95',
  'emerald-outline':
    'bg-emerald-50/70 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-2xs active:scale-95',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20 active:scale-95',
  'danger-outline':
    'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 active:scale-95',
  amber:
    'bg-amber-500/15 border border-amber-300 text-amber-900 hover:bg-amber-500 hover:text-white shadow-2xs active:scale-95',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:scale-95',
}

const SIZE_MAP = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
  md: 'px-4 py-2.5 text-xs font-bold rounded-xl gap-2',
  lg: 'px-6 py-3 text-sm font-bold rounded-2xl gap-2.5',
  icon: 'h-9 w-9 p-0 flex items-center justify-center rounded-xl',
  'icon-sm': 'h-8 w-8 p-0 flex items-center justify-center rounded-lg',
}

/**
 * Komponen Reusable Button Universal
 * Mendukung varian visual, ukuran proporsional, status loading dengan spinner, dan ikon
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = '',
  icon = null,
  iconRight = null,
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.primary
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-sans transition-all duration-200 cursor-pointer select-none',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          {loadingText ? <span>{loadingText}</span> : children}
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {iconRight && <span className="shrink-0">{iconRight}</span>}
        </>
      )}
    </button>
  )
}

