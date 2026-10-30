import { useState } from 'react'
import {
  Laptop,
  Smartphone,
  Tablet,
  Radio,
  Edit2,
  Check,
  QrCode,
  Wifi,
  CheckCircle2,
} from 'lucide-react'

/**
 * Komponen Radar Deteksi Perangkat di Jaringan Lokal
 */
export function PeerDiscoveryCard({
  myDevice = {},
  peers = [],
  activePeerId = null,
  onSelectPeer = () => {},
  onUpdateMyName = () => {},
  onOpenPairingModal = () => {},
}) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempName, setTempName] = useState(myDevice.name || '')

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateMyName(tempName.trim())
    }
    setIsEditingName(false)
  }

  const renderDeviceIcon = (type) => {
    switch (type) {
      case 'phone':
        return <Smartphone className="h-5 w-5" />
      case 'tablet':
        return <Tablet className="h-5 w-5" />
      default:
        return <Laptop className="h-5 w-5" />
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-6">
      {/* Header Radar & Aksi Pairing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Radio className="h-5 w-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase text-slate-200">
              Radar Perangkat Lokal (P2P LAN)
            </h2>
            <p className="text-xs text-slate-400">
              Otomatis mendeteksi laptop &amp; HP di Wi-Fi / jaringan kabel yang sama
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPairingModal}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all cursor-pointer"
        >
          <QrCode className="h-4 w-4" />
          <span>Kode Pairing &amp; QR Code</span>
        </button>
      </div>

      {/* Kartu Identitas Perangkat Pengguna Sendiri */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
            {renderDeviceIcon(myDevice.type)}
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Perangkat Anda Saat Ini
            </span>
            {isEditingName ? (
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="rounded-lg border border-indigo-500/50 bg-slate-900 px-2.5 py-1 text-xs text-white focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="rounded-lg bg-indigo-600 p-1 text-white hover:bg-indigo-500 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  {myDevice.name}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setTempName(myDevice.name)
                    setIsEditingName(true)
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Ubah nama perangkat"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
            Online (Siap Kirim &amp; Terima)
          </span>
        </div>
      </div>

      {/* Daftar Perangkat Lain yang Ditemukan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Perangkat Lain yang Terdeteksi ({peers.length}):</span>
          <span className="flex items-center gap-1.5 text-[11px] text-indigo-400">
            <Wifi className="h-3.5 w-3.5" />
            <span>Jaringan Wi-Fi / LAN Lokal</span>
          </span>
        </div>

        {peers.length === 0 ? (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-8 text-center space-y-3">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800/60 text-slate-400">
              <Radio className="h-6 w-6 animate-pulse text-indigo-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-slate-200">
                Menunggu Perangkat Lain Terhubung...
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Buka tab baru atau buka halaman ini di HP/laptop kedua pada Wi-Fi yang sama untuk langsung saling mendeteksi secara otomatis.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenPairingModal}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all cursor-pointer"
            >
              <QrCode className="h-4 w-4" />
              <span>Tampilkan QR Code Pairing untuk HP</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {peers.map((peer) => {
              const isSelected = peer.id === activePeerId
              return (
                <div
                  key={peer.id}
                  onClick={() => onSelectPeer(peer.id)}
                  className={`flex items-center justify-between rounded-2xl border p-4 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {renderDeviceIcon(peer.type)}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        {peer.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-slate-400 font-mono">
                          Tersambung P2P
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {isSelected ? (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400 hover:text-indigo-400">
                        Pilih Target
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

