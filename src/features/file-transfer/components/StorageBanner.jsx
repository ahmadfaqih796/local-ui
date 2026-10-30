import { useState } from 'react'
import { Wifi, Mountain } from 'lucide-react'

import { ShareUrlBox } from './ShareUrlBox'
import { QrShareCard } from './QrShareCard'
import { HotspotGuidePanel } from './HotspotGuidePanel'

/**
 * Banner Pusat Penyimpanan Lokal (Wi-Fi Shared Drive Hub) - Fresh Green Mode Terang
 * Bertindak sebagai orkestrator tampilan mode Wi-Fi Kantor vs Hotspot Mandiri (Outdoor/Gunung)
 * @param {{ networkInfo: { ip: string, port: number, url: string, interfaces: Array, isHotspotActive: boolean } }} props
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
  const availableInterfaces = networkInfo?.interfaces || []

  return (
    <div className="rounded-3xl border border-emerald-200 bg-surface p-5 sm:p-7 shadow-sm relative overflow-hidden space-y-6">
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
                ? 'bg-surface text-emerald-800 shadow-xs border border-emerald-200'
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

        {/* Pemilih Jalur IP Adapter jika ada lebih dari 1 antarmuka jaringan */}
        {availableInterfaces.length > 1 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 self-end sm:self-auto">
            <span className="font-semibold text-slate-600 shrink-0">Pilih Jalur IP:</span>
            <select
              value={selectedIp}
              onChange={(e) => setCustomIp(e.target.value)}
              className="rounded-xl border border-emerald-300 bg-surface px-2.5 py-1 text-xs font-mono font-semibold text-emerald-950 focus:outline-emerald-500 cursor-pointer shadow-xs"
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
          <ShareUrlBox shareUrl={shareUrl} />
        </div>

        {/* Kolom QR Code untuk Kamera HP */}
        <QrShareCard shareUrl={shareUrl} />
      </div>

      {/* 3. Panel Khusus Mode Hotspot Mandiri (Outdoor / Di Gunung) */}
      {activeMode === 'hotspot' && (
        <HotspotGuidePanel isHotspotActive={networkInfo?.isHotspotActive} />
      )}
    </div>
  )
}
