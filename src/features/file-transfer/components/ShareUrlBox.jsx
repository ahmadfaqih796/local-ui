import { useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Komponen Kotak Tautan Berbagi Cepat dengan Tombol Salin & Buka Tab
 * @param {{ shareUrl: string }} props
 */
export function ShareUrlBox({ shareUrl = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Alamat penyimpanan berhasil disalin!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin alamat')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1 w-full">
      <div className="flex-1 min-w-0 flex items-center justify-between gap-2 rounded-2xl border border-emerald-300/80 bg-emerald-50/70 px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-mono text-emerald-950 shadow-inner">
        <span className="truncate font-semibold">{shareUrl}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 text-xs font-sans font-bold text-white shadow-xs transition-all cursor-pointer"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Tersalin' : 'Salin'}</span>
        </button>
      </div>

      <a
        href={shareUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-emerald-200 bg-white px-4 py-2.5 sm:py-3 text-xs font-bold text-emerald-900 hover:bg-emerald-50 transition-all cursor-pointer shrink-0 shadow-xs"
        title="Buka di tab baru"
      >
        <ExternalLink className="h-4 w-4 text-emerald-600" />
        <span>Buka Tab</span>
      </a>
    </div>
  )
}
