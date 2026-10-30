import { useState } from 'react'
import { Copy, Check, QrCode, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { Modal } from '@/components/Modal'

/**
 * Modal Petunjuk Pairing & Kode Ruangan 6-Digit
 * Menggunakan komponen reusable Modal dengan Sticky Header & Sticky Footer
 */
export function PairingModal({
  isOpen = false,
  onClose = () => {},
  roomCode = '123456',
}) {
  const [copied, setCopied] = useState(false)

  const currentUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}?room=${roomCode}`
      : ''

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      icon={<QrCode className="h-5 w-5 text-indigo-600" />}
      title="Sambungkan Perangkat Lain"
      subtitle="Kirim file langsung antar-laptop atau ke HP tanpa kabel internet"
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Pastikan kedua perangkat berada di Wi-Fi / Hotspot yang sama.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 ml-auto"
          >
            <span>Mengerti &amp; Tutup</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    >
      {/* Kotak Kode Pairing 6-Digit */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 text-center space-y-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
          Kode Pairing Ruangan Lokal
        </span>

        <div className="flex items-center justify-center gap-2">
          {roomCode.split('').map((char, index) => (
            <span
              key={index}
              className="flex h-12 w-10 sm:w-11 items-center justify-center rounded-xl bg-surface border border-indigo-300 text-xl font-mono font-extrabold text-indigo-950 shadow-xs"
            >
              {char}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-300 bg-surface px-4 py-1.5 text-xs font-semibold text-indigo-800 hover:bg-indigo-100 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          <span>{copied ? 'Tersalin!' : 'Salin Kode'}</span>
        </button>
      </div>

      {/* Langkah Petunjuk */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          3 Langkah Mudah Menghubungkan:
        </h4>

        <div className="space-y-2.5">
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-page p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white font-bold text-xs shadow-2xs">
              1
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-800">Satu Jaringan Wi-Fi / Hotspot / Kabel LAN</p>
              <p className="text-slate-500 leading-relaxed">
                Pastikan kedua laptop atau HP terhubung ke Wi-Fi yang sama atau Hotspot laptop.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-page p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shadow-2xs">
              2
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-800">Buka Tautan di Peramban HP/Laptop</p>
              <p className="text-slate-500 leading-relaxed">
                Buka alamat web aplikasi ini di perangkat kedua.
              </p>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Salin Tautan Lengkap</span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-page p-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs shadow-2xs">
              3
            </div>
            <div className="text-xs space-y-0.5">
              <p className="font-bold text-slate-800">Kirim File Tanpa Batas</p>
              <p className="text-slate-500 leading-relaxed">
                Kedua perangkat otomatis muncul di layar radar dan berkas siap ditransfer dengan kecepatan penuh!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
