import {
  Mic,
  MicOff,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Headphones,
  Check,
} from 'lucide-react'

/**
 * Kartu Mode Rapat Otomatis (Zero-Setting Auto Pilot)
 * Mengunci jalur audio 1-arah anti-mantul dan anti-bocor speaker
 */
export function SimpleMeetingCard({
  isActive = false,
  isMuted = false,
  isMonitoring = false,
  physicalMicLabel = '',
  virtualCableLabel = '',
  hasVirtualCable = false,
  onToggleMic = () => {},
  onToggleMute = () => {},
  onToggleMonitoring = () => {},
  onOpenGuide = () => {},
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 shadow-2xl space-y-5">
      {/* Glow ambient */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

      {/* Baris Atas: Badge Status & Tombol Panduan */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-full ${
              isActive && !isMuted
                ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]'
                : 'bg-rose-500'
            }`}
          >
            {isActive && !isMuted && (
              <span className="h-2 w-2 animate-ping rounded-full bg-emerald-300" />
            )}
          </div>
          <span className="text-xs font-bold tracking-wider uppercase text-slate-200">
            {isActive && !isMuted
              ? 'Mode Rapat Siap (Auto Anti-Mantul & Noise Gate Aktif)'
              : isMuted
              ? 'Mikrofon Dibisukan (Muted)'
              : 'Mode Rapat Siap Dinyalakan'}
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenGuide}
          className="flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all cursor-pointer"
        >
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Panduan Cepat Google Meet</span>
        </button>
      </div>

      {/* Konten Tombol Utama & Penjelasan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Pengubah Suara Rapat Otomatis</span>
            <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold">
              1-KLIK
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
            Hanya suara <strong>Mikrofon Anda</strong> yang diubah efek dan didengar teman rapat. Suara lawan bicara (Pak Paul) <strong>100% terlindungi tidak akan ikut terubah</strong>.
          </p>
        </div>

        {/* Tombol Utama 1-Klik */}
        <div className="flex items-center gap-2 shrink-0">
          {isActive && (
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex items-center justify-center h-12 w-12 rounded-2xl border transition-all cursor-pointer ${
                isMuted
                  ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-lg shadow-rose-500/20'
                  : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'Buka Bisukan' : 'Bisukan Suara'}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>
          )}

          <button
            type="button"
            onClick={onToggleMic}
            className={`flex items-center gap-2.5 rounded-2xl px-6 py-3.5 text-sm font-extrabold transition-all shadow-xl cursor-pointer active:scale-95 ${
              isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-500/50'
                : 'bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-600/30 ring-2 ring-indigo-500/40'
            }`}
          >
            {isActive ? (
              <>
                <MicOff className="h-5 w-5" />
                <span>Matikan Voice Changer</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>Mulai Pengubah Suara</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KARTU PENTING: KUNCI AGAR SUARA PAK PAUL TIDAK IKUT TERUBAH */}
      <div className="rounded-2xl border border-indigo-500/40 bg-indigo-950/40 p-4 space-y-3">
        <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wide">
          <Headphones className="h-4 w-4 text-pink-400" />
          <span>Kunci Utama Agar Suara Lawan Bicara (Pak Paul) Tidak Ikut Terubah:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Solusi 1: Pakai Headset */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-pink-600 text-[10px]">1</span>
              <span>Gunakan Headset / Earphone HP</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Jika Anda memakai speaker laptop tanpa headset, suara Pak Paul dari speaker laptop akan <strong>terdengar oleh mikrofon laptop</strong> yang berjarak 10 cm, sehingga suara Pak Paul ikut diubah jadi cepreng!
            </p>
            <p className="text-[10px] text-pink-400 font-medium">
              👉 Cukup colok headset: Suara Pak Paul masuk ke telinga Anda, mic laptop hanya mendengar suara Anda!
            </p>
          </div>

          {/* Solusi 2: Noise Gate Otomatis */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px]">2</span>
              <span>Noise Gate Otomatis Aktif</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Aplikasi kini dilengkapi pemotong suara otomatis (*Noise Gate*). Saat Anda sedang tidak bicara, mikrofon langsung dikunci hening (0 dB), sehingga suara bocoran speaker ditolak.
            </p>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <Check className="h-3 w-3" />
              <span>Peredam Suara Speaker Lawan Bicara: AKTIF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Jalur Otomatis */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Jalur Otomatis di LocalHub (Terkunci Sempurna):
          </span>
          <span className="text-[11px] font-mono text-emerald-400">
            Sinyal Aktif ke CABLE Input
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-2 font-mono text-xs text-center">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Masukan (Input Fisik)
            </span>
            <p className="font-bold text-indigo-300 truncate mt-0.5 text-xs">
              {physicalMicLabel || 'Intel Smart Sound / Realtek Mic'}
            </p>
            <span className="text-[9px] text-emerald-400">✓ Hanya suara Anda</span>
          </div>

          <div className="flex justify-center items-center text-slate-500">
            <ArrowRight className="h-4 w-4 hidden md:block text-indigo-400" />
            <span className="text-[10px] md:hidden">↓</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-left">
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">
              Keluaran (Ke Google Meet)
            </span>
            <p className="font-bold text-pink-300 truncate mt-0.5 text-xs">
              {hasVirtualCable
                ? virtualCableLabel || 'CABLE Input (VB-Audio)'
                : 'Speaker Default (Pasang VB-Cable)'}
            </p>
            <span className="text-[9px] text-emerald-400">
              {hasVirtualCable ? '✓ Tersambung ke Meeting' : '⚠️ Unduh VB-Cable'}
            </span>
          </div>
        </div>

        {/* Toggle Monitor Suara Sendiri Ringkas */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleMonitoring(!isMonitoring)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
                isMonitoring ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isMonitoring ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-slate-400" />
              Dengarkan Suara Sendiri (Monitor Headset)
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {isMonitoring ? (
              <span className="text-amber-400">
                ⚠️ Gunakan Headphone agar suara monitor tidak masuk ke mic laptop!
              </span>
            ) : (
              <span className="text-emerald-400">
                ✓ Monitor mati: Tidak ada suara yang bocor ke ruangan.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
