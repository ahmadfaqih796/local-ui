import { useState } from 'react'
import { Radio, Settings, Info } from 'lucide-react'
import { toast } from 'sonner'

import { openWindowsHotspotSettings } from '@/features/file-transfer/services/localStorageApi'

/**
 * Panel Panduan Penggunaan Hotspot Mandiri (Outdoor / Di Atas Gunung Tanpa Router)
 * @param {{ isHotspotActive: boolean }} props
 */
export function HotspotGuidePanel({ isHotspotActive = false }) {
  const [isOpeningSettings, setIsOpeningSettings] = useState(false)

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

  return (
    <div className="relative rounded-2xl border border-emerald-300 bg-emerald-50/60 p-4 sm:p-5 space-y-4">
      {/* Baris Status & Tombol Pengaturan Windows */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-bold text-emerald-950">
            Panduan Praktis: Laptop Menjadi Hotspot Mandiri
          </span>
          {isHotspotActive ? (
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

      {/* 3 Langkah Praktis */}
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

      {/* Catatan Tips Alternatif */}
      <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-600 bg-white/70 border border-emerald-200/80 rounded-xl p-2.5">
        <Info className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
        <span>
          <strong>Tips Alternatif:</strong> Jika kartu Wi-Fi laptop tidak mendukung hotspot, rekan Anda juga bisa menyalakan <strong>Tethering Hotspot dari HP</strong> (tanpa perlu paket data aktif), lalu hubungkan laptop ini ke Wi-Fi HP tersebut. Keduanya akan otomatis langsung terhubung!
        </span>
      </div>
    </div>
  )
}

