import { cn } from '@/utils/cn'

const PADDING_MAP = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-5 sm:p-6',
  lg: 'p-6 sm:p-8',
}

const ROUNDED_MAP = {
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
}

const BORDER_MAP = {
  default: 'border border-emerald-200/90',
  slate: 'border border-slate-200',
  indigo: 'border border-indigo-200',
  none: 'border-0',
}

const BG_MAP = {
  surface: 'bg-surface',
  page: 'bg-page',
  glass: 'bg-surface/90 backdrop-blur-md',
}

/**
 * Komponen Reusable Card Container Universal
 * Menggunakan token desain Figma (bg-surface, border-default, text-text-primary)
 * Mendukung varian padding, rounded radius, efek hover lift, dan interaktivitas
 */
export function Card({
  children,
  hover = false,
  padding = 'md',
  rounded = '3xl',
  border = 'default',
  background = 'surface',
  className = '',
  onClick = null,
  ...props
}) {
  const paddingClass = PADDING_MAP[padding] || PADDING_MAP.md
  const roundedClass = ROUNDED_MAP[rounded] || ROUNDED_MAP['3xl']
  const borderClass = BORDER_MAP[border] || BORDER_MAP.default
  const bgClass = BG_MAP[background] || BG_MAP.surface
  const isInteractive = Boolean(onClick)

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative overflow-hidden shadow-xs transition-all duration-300 text-text-primary',
        bgClass,
        borderClass,
        roundedClass,
        paddingClass,
        hover &&
          'hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10',
        isInteractive && 'cursor-pointer active:scale-[0.99]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

