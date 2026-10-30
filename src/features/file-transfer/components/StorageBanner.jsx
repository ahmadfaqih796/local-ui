import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Wifi, Copy, Check, Smartphone, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

/**
 * Banner Pusat Penyimpanan Lokal (Wi-Fi Shared Drive Hub) - Fresh Green Mode Terang
 * Responsif sempurna di layar desktop, tablet, dan smartphone
 */
export function StorageBanner({ networkInfo = { ip: '127.0.0.1', port: 5173, url: '' } }) {
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const shareUrl = `${networkInfo.url}/file-transfer`

  useEffect(() => {
    if (shareUrl) {
      QRCode.toDataURL(shareUrl, {
        width: 180,
        margin: 1,
        color: {
          dark: '#064e3b',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Gagal generate QR Code:', err))
    }
  }, [shareUrl])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Alamat Wi-Fi berhasil disalin!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin alamat')
    }
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-5 sm:p-8 shadow-sm relative overflow-hidden">
      {/* Efek Cahaya Lembut Fresh Green */}
      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-green-100/60 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Kolom Informasi & Alamat Akses */}
        <div className="space-y-3.5 sm:space-y-4 w-full max-w-xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
            <Wifi className="h-3.5 w-3.5 animate-pulse text-emerald-600" />
            <span>Pusat Penyimpanan Wi-Fi • Bebas Kuota</span>
          </div>

          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Laptop Ini Adalah Pusat Penyimpanan (Storage)
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Semua file yang diunggah otomatis tersimpan di hard drive laptop ini. Siapa saja (HP atau laptop lain) yang tersambung ke Wi-Fi yang sama cukup membuka tautan di bawah untuk unduh atau kirim file langsung ke laptop ini.
          </p>

          {/* Kotak Tautan Berbagi Cepat */}
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
        </div>

        {/* Kolom QR Code untuk Kamera HP */}
        <div className="flex flex-col items-center shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm backdrop-blur-md w-full sm:w-auto">
          <div className="rounded-xl overflow-hidden border border-emerald-200 shadow-sm p-2 bg-white">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR Code Akses Penyimpanan Wi-Fi"
                className="h-32 w-32 sm:h-36 sm:w-36 block mx-auto"
              />
            ) : (
              <div className="h-32 w-32 flex items-center justify-center bg-emerald-50 text-emerald-600 text-xs">
                Membuat QR...
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-center text-xs font-bold text-emerald-900">
            <Smartphone className="h-3.5 w-3.5 text-emerald-700" />
            <span>Scan dengan Kamera HP</span>
          </div>
          <span className="text-[10px] text-slate-500 text-center max-w-[170px] mt-0.5">
            Otomatis buka halaman storage di browser HP
          </span>
        </div>
      </div>
    </div>
  )
}
