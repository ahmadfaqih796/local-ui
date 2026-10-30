import { useState } from 'react'
import {
  X,
  Copy,
  Check,
  QrCode,
} from 'lucide-react'
import { toast } from 'sonner'

/**
 * Modal Petunjuk Pairing & Kode Ruangan 6-Digit
 */
export function PairingModal({
  isOpen = false,
  onClose = () => {},
  roomCode = '123456',
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}?room=${roomCode}` : ''

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode)
      setCopied(true)
      toast.success('Kode pairing berhasil disalin!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin kode')
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      toast.success('Tautan pairing berhasil disalin!')
    } catch {
      toast.error('Gagal menyalin tautan')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <QrCode className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Sambungkan Perangkat Lain
            </h3>
            <p className="text-xs text-slate-400">
              Kirim file langsung antar-laptop atau ke HP tanpa kabel internet
            </p>
          </div>
        </div>

        {/* Kotak Kode Pairing 6-Digit */}
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-5 text-center space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Kode Pairing Ruangan Lokal
          </span>

          <div className="flex items-center justify-center gap-2">
            {roomCode.split('').map((char, index) => (
              <span
                key={index}
                className="flex h-12 w-10 sm:w-11 items-center justify-center rounded-xl bg-slate-950 border border-indigo-500/40 text-xl font-mono font-extrabold text-white shadow-inner"
              >
                {char}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-500/30 transition-all cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
          </button>
        </div>

        {/* Langkah Petunjuk */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            3 Langkah Mudah Menghubungkan:
          </h4>

          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-xs">
                1
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-slate-200">Satu Jaringan Wi-Fi / Kabel LAN</p>
                <p className="text-slate-400 leading-relaxed">
                  Pastikan kedua laptop atau HP terhubung ke Wi-Fi yang sama atau kabel LAN langsung.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-xs">
                2
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-slate-200">Buka Tautan di Peramban HP/Laptop</p>
                <p className="text-slate-400 leading-relaxed">
                  Buka alamat web aplikasi ini di perangkat kedua.
                </p>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:underline cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Salin Tautan Lengkap</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-xs">
                3
              </div>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-slate-200">Kirim File Tanpa Batas</p>
                <p className="text-slate-400 leading-relaxed">
                  Kedua perangkat otomatis muncul di layar radar dan berkas siap ditransfer dengan kecepatan penuh!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tombol Tutup Selesai */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            Mengerti &amp; Tutup
          </button>
        </div>
      </div>
    </div>
  )
}
