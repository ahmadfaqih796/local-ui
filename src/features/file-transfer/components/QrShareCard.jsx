import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Smartphone } from 'lucide-react'

/**
 * Komponen Kartu QR Code untuk Pemindaian Instan Kamera HP
 * @param {{ shareUrl: string }} props
 */
export function QrShareCard({ shareUrl = '' }) {
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    if (!shareUrl) return

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
  }, [shareUrl])

  return (
    <div className="flex flex-col items-center shrink-0 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm backdrop-blur-md w-full sm:w-auto">
      <div className="rounded-xl overflow-hidden border border-emerald-200 shadow-sm p-2 bg-surface">
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
  )
}
