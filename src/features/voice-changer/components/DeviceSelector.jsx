import {
  Mic,
  Headphones,
  Volume2,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  ExternalLink,
  Radio,
  ShieldAlert,
} from 'lucide-react'

/**
 * Komponen Pemilihan Perangkat Audio & Jalur Mikrofon Virtual untuk Meeting
 * Dilengkapi proteksi anti-echo / anti-mantul pintar
 */
export function DeviceSelector({
  inputDevices = [],
  outputDevices = [],
  inputDeviceId = '',
  outputDeviceId = '',
  isMonitoring = false,
  inputVolume = 1.0,
  onSelectInputDevice = () => {},
  onSelectOutputDevice = () => {},
  onToggleMonitoring = () => {},
  onVolumeChange = () => {},
  onRefreshDevices = () => {},
  onOpenMeetingGuide = () => {},
}) {
  // Cek apakah driver Virtual Audio Cable terpasang
  const hasVirtualCable = outputDevices.some(
    (d) =>
      d.label.toLowerCase().includes('cable') ||
      d.label.toLowerCase().includes('vb-audio') ||
      d.label.toLowerCase().includes('virtual')
  )

  // Cek apakah user keliru memilih kabel virtual sebagai MIC MASUKAN FISIK
  const selectedInputDevice = inputDevices.find((d) => d.deviceId === inputDeviceId)
  const isInputVirtualCable =
    selectedInputDevice?.label.toLowerCase().includes('cable') ||
    selectedInputDevice?.label.toLowerCase().includes('virtual')

  // Cek apakah output sudah diarahkan ke CABLE Input
  const selectedOutputDevice = outputDevices.find((d) => d.deviceId === outputDeviceId)
  const isOutputCableInput =
    selectedOutputDevice?.label.toLowerCase().includes('cable input') ||
    (selectedOutputDevice?.label.toLowerCase().includes('cable') &&
      !selectedOutputDevice?.label.toLowerCase().includes('output'))

  return (
    <div className="rounded-2xl border border-emerald-200/90 bg-white p-5 shadow-xs space-y-4">
      {/* Header Panel Perangkat */}
      <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-800">
            Jalur Mikrofon &amp; Perangkat Audio
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRefreshDevices}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors p-1 cursor-pointer"
            title="Muat ulang daftar perangkat yang terdeteksi"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            type="button"
            onClick={onOpenMeetingGuide}
            className="flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-xs"
          >
            <HelpCircle className="h-3.5 w-3.5 text-emerald-700" />
            <span>Panduan Sambung Meet</span>
          </button>
        </div>
      </div>

      {/* PERINGATAN KRITIS: Jika user salah pilih CABLE Output sebagai Mic Masukan */}
      {isInputVirtualCable && (
        <div className="rounded-xl border border-rose-300 bg-rose-50 p-3.5 text-xs text-rose-900 space-y-1.5 animate-pulse">
          <div className="flex items-center gap-2 font-bold text-rose-800 text-sm">
            <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0" />
            <span>Penyebab Suara Lawan Bicara Mantul!</span>
          </div>
          <p className="leading-relaxed">
            Anda memilih <strong className="text-rose-900 bg-white px-1.5 py-0.5 rounded border border-rose-200 font-mono">{selectedInputDevice?.label}</strong> pada kotak <strong>1. Mikrofon Masukan Fisik</strong>.
          </p>
          <p className="leading-relaxed text-rose-800">
            👉 <strong>Solusi:</strong> Segera ganti kotak nomor 1 ke <strong>Mikrofon Fisik Asli Laptop</strong> Anda (seperti <em>Intel Smart Sound</em> atau <em>Realtek Microphone</em>), bukan CABLE! Kabel CABLE hanya untuk jalur keluar ke meeting.
          </p>
        </div>
      )}

      {/* Banner Peringatan Status Jalur Virtual Mic */}
      {!hasVirtualCable ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs space-y-2 text-amber-950">
          <div className="flex items-start gap-2.5 text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-900">
                Jalur Mikrofon Virtual Belum Terdeteksi di Windows
              </p>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Agar suara efek ini masuk ke Google Meet sebagai Mikrofon, pasang driver kabel virtual gratis <strong>VB-CABLE</strong> (hanya butuh 1 menit).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://vb-audio.com/Cable/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2"
            >
              <span>Unduh VB-CABLE Driver</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <span className="text-amber-300">•</span>
            <button
              type="button"
              onClick={onOpenMeetingGuide}
              className="text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              Lihat Tutorial Sambung
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-xs flex items-center gap-2.5 text-emerald-900">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-[11px] leading-relaxed">
            <strong>Driver Kabel Virtual Siap!</strong> Pastikan kotak nomor 1 adalah Mic Laptop Anda, dan kotak nomor 2 adalah <span className="font-mono text-emerald-800 font-semibold">CABLE Input</span>.
          </p>
        </div>
      )}

      {/* Grid Pemilihan Perangkat */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Dropdown Mikrofon Fisik Masukan */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Mic className="h-3.5 w-3.5 text-emerald-600" />
              1. Mikrofon Masukan Fisik (Mic Laptop)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {inputDevices.length} terdeteksi
            </span>
          </label>
          <select
            value={inputDeviceId}
            onChange={(e) => onSelectInputDevice(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors cursor-pointer ${
              isInputVirtualCable
                ? 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-500'
                : 'border-slate-300 bg-white text-slate-800 focus:border-emerald-500 focus:outline-hidden'
            }`}
          >
            <option value="">Default Mikrofon Laptop (Intel / Realtek)</option>
            {inputDevices.map((device, idx) => {
              const isCable =
                device.label.toLowerCase().includes('cable') ||
                device.label.toLowerCase().includes('virtual')
              return (
                <option
                  key={device.deviceId || idx}
                  value={device.deviceId}
                  className={isCable ? 'text-rose-600 font-bold' : ''}
                >
                  {isCable
                    ? `⚠️ JANGAN PILIH: ${device.label}`
                    : `🎙️ ${device.label || `Mikrofon Fisik ${idx + 1}`}`}
                </option>
              )
            })}
          </select>
          <p className="text-[10px] text-slate-500">
            ✅ <strong>Wajib pilih Mic Asli Laptop Anda</strong> (bukan CABLE) agar suara teman meeting tidak mantul.
          </p>
        </div>

        {/* Dropdown Jalur Mikrofon Virtual ke Meeting */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Radio className="h-3.5 w-3.5 text-emerald-600" />
              2. Jalur Suara Efek ke Meeting (Virtual Mic)
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Jalur Meeting
            </span>
          </label>
          <select
            value={outputDeviceId}
            onChange={(e) => onSelectOutputDevice(e.target.value)}
            className={`w-full rounded-xl border px-3 py-2 text-xs transition-colors cursor-pointer ${
              hasVirtualCable && !isOutputCableInput
                ? 'border-amber-400 bg-amber-50/60 text-amber-900'
                : 'border-slate-300 bg-white text-slate-800 focus:border-emerald-500 focus:outline-hidden'
            }`}
          >
            <option value="">Default Speaker / Headphone (Tes Lokal)</option>
            {outputDevices.map((device, idx) => {
              const isCableInput =
                device.label.toLowerCase().includes('cable input') ||
                (device.label.toLowerCase().includes('cable') &&
                  !device.label.toLowerCase().includes('output'))
              return (
                <option key={device.deviceId || idx} value={device.deviceId}>
                  {isCableInput
                    ? `⭐ [PILIH INI UNTUK MEETING] ${device.label}`
                    : (device.label || `Speaker ${idx + 1}`)}
                </option>
              )
            })}
          </select>
          <p className="text-[10px] text-slate-500">
            {hasVirtualCable && !isOutputCableInput ? (
              <span className="text-amber-700 font-medium">
                👉 Pilih &quot;CABLE Input&quot; agar suara efek vokal mengalir ke Google Meet.
              </span>
            ) : (
              <span>Aliran suara efek yang akan ditangkap oleh Google Meet.</span>
            )}
          </p>
        </div>
      </div>

      {/* Baris Kontrol Monitoring & Volume */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-emerald-100">
        {/* Toggle Dengarkan Suara Sendiri */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleMonitoring(!isMonitoring)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                isMonitoring ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isMonitoring ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="text-xs">
              <p className="font-medium text-slate-800 flex items-center gap-1.5">
                <Headphones className="h-3.5 w-3.5 text-slate-500" />
                Monitor Suara Sendiri (Headset)
              </p>
              <p className="text-[10px] text-slate-500">
                {isMonitoring ? 'Aktif (Mendengar suara Anda)' : 'Mati (Disarankan saat meeting)'}
              </p>
            </div>
          </div>

          {isMonitoring && (
            <div className="flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
              <AlertTriangle className="h-3 w-3 text-amber-600" />
              <span>Gunakan Headphone</span>
            </div>
          )}
        </div>

        {/* Slider Volume Masukan Mic */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <Volume2 className="h-3.5 w-3.5 text-slate-500" />
          <div className="flex-1 space-y-0.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-600">Gain Mic Fisik</span>
              <span className="font-mono text-emerald-800 font-semibold">{Math.round(inputVolume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={inputVolume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-slate-200 appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
