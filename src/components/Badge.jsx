import { cn } from '@/utils/cn'

const VARIANT_MAP = {
  emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300/80',
  success: 'bg-emerald-100 text-emerald-800 border-emerald-300/80',
  rose: 'bg-rose-100 text-rose-800 border-rose-300/80',
  danger: 'bg-rose-100 text-rose-800 border-rose-300/80',
  amber: 'bg-amber-100 text-amber-900 border-amber-300/80',
  warning: 'bg-amber-100 text-amber-900 border-amber-300/80',
  blue: 'bg-blue-100 text-blue-800 border-blue-300/80',
  info: 'bg-blue-100 text-blue-800 border-blue-300/80',
  indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300/80',
  purple: 'bg-indigo-100 text-indigo-800 border-indigo-300/80',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
}

const DOT_COLOR_MAP = {
  emerald: 'bg-emerald-500',
  success: 'bg-emerald-500',
  rose: 'bg-rose-500',
  danger: 'bg-rose-500',
  amber: 'bg-amber-500',
  warning: 'bg-amber-500',
  blue: 'bg-blue-500',
  info: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-indigo-500',
  slate: 'bg-slate-500',
  neutral: 'bg-slate-500',
}

const SIZE_MAP = {
  xs: 'px-1.5 py-0.2 text-[9px] font-bold rounded-md gap-1',
  sm: 'px-2.5 py-0.5 text-[10px] font-bold rounded-full gap-1.5',
  md: 'px-3 py-1 text-xs font-semibold rounded-full gap-1.5',
}

/**
 * Komponen Reusable Badge Status Universal
 * Digunakan untuk status live, tier lisensi, tag versi, dan indikator perangkat
 */
export function Badge({
  children,
  variant = 'emerald',
  size = 'sm',
  dot = false,
  pulse = false,
  icon = null,
  className = '',
  ...props
}) {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.emerald
  const dotColorClass = DOT_COLOR_MAP[variant] || DOT_COLOR_MAP.emerald
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.sm

  return (
    <span
      className={cn(
        'inline-flex items-center border font-sans select-none tracking-wide uppercase',
        variantClass,
        sizeClass,
        className
      )}
      {...props}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          {pulse && (
            <span
              className={cn(
                'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                dotColorClass
              )}
            />
          )}
          <span
            className={cn(
              'relative inline-flex rounded-full h-1.5 w-1.5',
              dotColorClass
            )}
          />
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children && <span>{children}</span>}
    </span>
  )
}

