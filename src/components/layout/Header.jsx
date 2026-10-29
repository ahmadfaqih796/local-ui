import { Mic, MicOff, Radio, Sparkles, Send, Zap } from 'lucide-react'

/**
 * Header Komponen Aplikasi dengan Kontrol Utama Mikrofon
 */
export function Header({
  isActive = false,
  isMuted = false,
  onToggleMic = () => {},
  onToggleMute = () => {},
  activeTab = 'voice-changer',
  onTabChange = () => {},
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Identitas Aplikasi */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  Local<span className="text-indigo-400">Hub</span>
                </span>
                <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                  v1.0 Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Utilitas Lokal: Voice Changer Meeting & Kirim File LAN
              </p>
            </div>
          </div>

          {/* Tab Navigasi Fitur */}
          <nav className="hidden md:flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
            <button
              type="button"
              onClick={() => onTabChange('voice-changer')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'voice-changer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="h-3.5 w-3.5" />
              <span>Pengubah Suara Mic</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange('file-transfer')}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'file-transfer'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Kirim File (LAN / Wi-Fi)</span>
              <span className="rounded-md bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                Segera
              </span>
            </button>
          </nav>

          {/* Tombol Kontrol Utama Mikrofon */}
          <div className="flex items-center gap-2.5">
            {/* Status Latensi */}
            {isActive && (
              <div className="hidden lg:flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-emerald-400">
                <Zap className="h-3 w-3" />
                <span>&lt; 15ms Latency</span>
              </div>
            )}

            {/* Tombol Mute Cepat */}
            {isActive && (
              <button
                type="button"
                onClick={onToggleMute}
                className={`flex items-center justify-center h-9 w-9 rounded-xl border transition-all cursor-pointer ${
                  isMuted
                    ? 'border-rose-500/60 bg-rose-500/20 text-rose-300'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:text-white'
                }`}
                title={isMuted ? 'Buka Bisukan (Unmute)' : 'Bisukan Suara (Mute)'}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
            )}

            {/* Tombol Nyalakan / Matikan Mic Utama */}
            <button
              type="button"
              onClick={onToggleMic}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-lg cursor-pointer ${
                isActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 ring-2 ring-rose-500/40'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 ring-2 ring-indigo-500/40 active:scale-95'
              }`}
            >
              {isActive ? (
                <>
                  <MicOff className="h-4 w-4" />
                  <span>Matikan Mic</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Mulai Mikrofon</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
