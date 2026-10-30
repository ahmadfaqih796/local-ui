import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
  Wifi,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
  Mountain,
  Radio,
  Settings,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import { openWindowsHotspotSettings } from '@/features/file-transfer/services/localStorageApi'

/**
 * Banner Pusat Penyimpanan Lokal (Wi-Fi Shared Drive Hub) - Fresh Green Mode Terang
 * Dilengkapi Mode Wi-Fi Bersama & Mode Hotspot Mandiri (Outdoor / Di Atas Gunung Tanpa Router)
 */
export function StorageBanner({
  networkInfo = {
    ip: '127.0.0.1',
    port: 5173,
    url: '',
    interfaces: [],
    isHotspotActive: false,
  },
}) {
  const [activeMode, setActiveMode] = useState(
    networkInfo?.isHotspotActive ? 'hotspot' : 'wifi'
  )
  const [customIp, setCustomIp] = useState(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [isOpeningSettings, setIsOpeningSettings] = useState(false)

  // Hitung IP aktif secara deklaratif murni tanpa efek samping cascading render
  let selectedIp = customIp
  if (!selectedIp) {
    if (activeMode === 'hotspot') {
      const hotspotIface = networkInfo?.interfaces?.find((i) => i.isHotspot)
      selectedIp = hotspotIface ? hotspotIface.ip : networkInfo?.ip || '127.0.0.1'
    } else {
      const wifiIface = networkInfo?.interfaces?.find((i) => i.type === 'wifi')
      selectedIp = wifiIface ? wifiIface.ip : networkInfo?.ip || '127.0.0.1'
    }
  }

  const port = networkInfo?.port || 5173
  const activeUrl = `http://${selectedIp}:${port}`
  const shareUrl = `${activeUrl}/file-transfer`

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
      toast.success('Alamat penyimpanan berhasil disalin!')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Gagal menyalin alamat')
    }
  }

  const handleOpenHotspot = async () => {
    setIsOpeningSettings(true)
    try {
      await openWindowsHotspotSettings()
      toast.success('Membuka pengaturan Hotspot Windows...')
    } catch (err) {
      console.warn('Gagal membuka hotspot:', err)
      toast.info('Buka Action Center (Win + A) lalu aktifkan Mobile Hotspot')
    } finally {
      setTimeout(() => setIsOpeningSettings(false), 1200)
    }
  }

  const availableInterfaces = networkInfo?.interfaces || []

  return (
    <div className="rounded-3xl border border-emerald-200 bg-white p-5 sm:p-7 shadow-sm relative overflow-hidden space-y-6">
      {/* Efek Cahaya Halus Fresh Green */}
      <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-emerald-100/60 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-green-100/60 blur-3xl pointer-events-none" />

      {/* 1. Pemilih Skenario / Mode Jaringan (Tab Wi-Fi Bersama vs Mode Gunung / Hotspot) */}
      <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-center p-1 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 self-start">
          <button
            type="button"
            onClick={() => {
              setActiveMode('wifi')
              setCustomIp(null)
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'wifi'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Wifi className="h-3.5 w-3.5 text-emerald-600" />
            <span>Mode 1: Wi-Fi Kantor / Rumah</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('hotspot')
              setCustomIp(null)
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              activeMode === 'hotspot'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <Mountain className="h-3.5 w-3.5" />
            <span>Mode 2: Di Gunung / Tanpa Router (Hotspot)</span>
          </button>
        </div>

        {/* Pemilih IP Adapter jika ada lebih dari 1 jaringan */}
        {availableInterfaces.length > 1 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
            <span className="font-semibold text-slate-600 shrink-0">Pilih Jalur IP:</span>
            <select
              value={selectedIp}
              onChange={(e) => setCustomIp(e.target.value)}
              className="rounded-xl border border-emerald-300 bg-white px-2.5 py-1 text-xs font-mono font-semibold text-emerald-950 focus:outline-emerald-500 cursor-pointer shadow-xs"
            >
              {availableInterfaces.map((iface) => (
                <option key={iface.ip} value={iface.ip}>
                  {iface.label || `${iface.name} (${iface.ip})`}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 2. Konten Utama Sesuai Mode Terpilih */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
        {/* Kolom Informasi & Alamat Akses */}
        <div className="space-y-4 w-full max-w-xl text-center lg:text-left">
          {activeMode === 'wifi' ? (
            <>
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
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-700 text-white px-3 py-1 text-xs font-bold shadow-xs">
                <Mountain className="h-3.5 w-3.5" />
                <span>Mode Tanpa Router • Laptop Sebagai Hotspot</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Di Atas Gunung / Outdoor? Laptop Jadi Pemancar!
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tidak ada Wi-Fi atau modem? Nyalakan <strong>Mobile Hotspot</strong> di laptop ini. HP teman Anda tinggal tersambung ke Wi-Fi laptop tersebut, dan langsung bisa saling kirim file tanpa kuota internet sedikit pun!
              </p>
            </>
          )}

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

      {/* 3. Panel Khusus Mode Hotspot Mandiri (Outdoor / Di Gunung) */}
      {activeMode === 'hotspot' && (
        <div className="relative rounded-2xl border border-emerald-300 bg-emerald-50/60 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-emerald-700" />
              <span className="text-xs font-bold text-emerald-950">
                Panduan Praktis: Laptop Menjadi Hotspot Mandiri
              </span>
              {networkInfo?.isHotspotActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-900">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Hotspot Laptop Aktif
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-300 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                  Belum Dinyalakan di Windows
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleOpenHotspot}
              disabled={isOpeningSettings}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-60"
            >
              <Settings className="h-3.5 w-3.5" />
              <span>{isOpeningSettings ? 'Membuka...' : 'Buka Pengaturan Hotspot Windows'}</span>
            </button>
          </div>

          {/* 3 Langkah Mudah */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  1
                </span>
                <span>Nyalakan Hotspot Laptop</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Klik tombol di atas atau tekan <kbd className="px-1 py-0.5 bg-slate-100 border border-slate-300 rounded text-[10px] font-mono">Win + A</kbd> di keyboard lalu aktifkan <strong>Mobile Hotspot</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  2
                </span>
                <span>Sambungkan HP Teman</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Di HP rekan Anda, buka Wi-Fi dan hubungkan ke Wi-Fi Hotspot laptop ini. <strong>100% tanpa internet/kuota</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-white p-3 space-y-1 shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                  3
                </span>
                <span>Scan QR & Selesai!</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Arahkan kamera HP ke QR Code di samping. Semua berkas tersimpan langsung di hard drive laptop!
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 bg-white/70 border border-emerald-200/80 rounded-xl p-2.5">
            <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              <strong>Tips Alternatif:</strong> Jika kartu Wi-Fi laptop tidak mendukung hotspot, rekan Anda juga bisa menyalakan <strong>Tethering Hotspot dari HP</strong> (tanpa perlu paket data aktif), lalu hubungkan laptop ini ke Wi-Fi HP tersebut. Keduanya akan otomatis langsung terhubung!
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
