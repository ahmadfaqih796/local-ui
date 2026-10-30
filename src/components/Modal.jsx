import { useEffect } from 'react'
import { X } from 'lucide-react'

const MAX_WIDTH_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
}

/**
 * Komponen Reusable Modal Dialog Universal
 * Memiliki fitur:
 * 1. Penguncian scroll body latar belakang (Anti-body scroll bug)
 * 2. Sticky Header (Judul & Tombol Tutup tetap di atas)
 * 3. Scrollable Body Content (Hanya konten isi yang memiliki scrollbar independen)
 * 4. Sticky Footer (Tombol aksi konfirmasi/tutup tetap terlihat di bawah)
 * 5. Dukungan tombol Escape & klik backdrop untuk menutup
 */
export function Modal({
  isOpen = false,
  onClose = () => {},
  title = '',
  subtitle = '',
  icon = null,
  badge = null,
  maxWidth = '2xl',
  children,
  footer = null,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className = '',
}) {
  // 1. Kunci scroll body latar belakang saat modal aktif
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    // Hitung lebar scrollbar untuk mencegah layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isOpen])

  // 2. Event listener tombol Escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, closeOnEscape, onClose])

  if (!isOpen) return null

  const maxWidthClass = MAX_WIDTH_MAP[maxWidth] || 'max-w-2xl'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      {/* Backdrop Gelap dengan Blur */}
      <div
        onClick={closeOnBackdropClick ? onClose : undefined}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity cursor-pointer"
        aria-hidden="true"
      />

      {/* Kontainer Dialog Utama Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative flex flex-col w-full ${maxWidthClass} max-h-[92vh] sm:max-h-[88vh] rounded-3xl border border-emerald-200 bg-surface shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 ${className}`}
      >
        {/* =========================================================================
            1. STICKY HEADER (Tetap menempel di bagian paling atas)
            ========================================================================= */}
        <div className="shrink-0 flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-emerald-100 bg-surface/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                {icon}
              </div>
            )}
            <div className="min-w-0 space-y-0.5">
              {badge && <div className="mb-0.5">{badge}</div>}
              {title && (
                <h2 className="text-base sm:text-lg font-extrabold text-text-primary tracking-tight truncate">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 line-clamp-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Tombol Tutup Silang (X) */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Dialog"
            className="shrink-0 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* =========================================================================
            2. SCROLLABLE BODY CONTENT (Hanya area ini yang dapat di-scroll)
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 sm:py-5 space-y-5 text-slate-700 overscroll-contain">
          {children}
        </div>

        {/* =========================================================================
            3. STICKY FOOTER (Tetap menempel di bagian bawah jika disediakan)
            ========================================================================= */}
        {footer && (
          <div className="shrink-0 px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 bg-page/90 backdrop-blur-xs z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

