import { useState, useEffect } from 'react'
import {
  Mic,
  Play,
  Square,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Zap,
  Volume2,
  Music,
  CheckCircle2,
  Ticket,
} from 'lucide-react'
import { Button, Badge } from '@/components'
import { VOICE_PRESETS } from '../constants/presets'
import { audioDemoPlayer } from '../services/audioDemoPlayer'
import { useAuthStore } from '@/store/useAuthStore'
import { toast } from 'sonner'

/**
 * Komponen Playground Uji Coba Vokal Online (Demo Sandbox 5–10 Detik)
 * Memungkinkan calon pengguna menguji efek pengubah suara langsung di browser
 * tanpa perlu instalasi aplikasi lokal atau pengaturan VB-Cable.
 */
export function VoiceDemoPlayground({ onOpenMeetingMode = () => {} }) {
  const tokens = useAuthStore((state) => state.tokens)
  const isPro = useAuthStore((state) => state.user.isPro)
  const consumeToken = useAuthStore((state) => state.consumeToken)
  const openPaymentModal = useAuthStore((state) => state.openPaymentModal)

  const [hasBuffer, setHasBuffer] = useState(false)
  const [audioBuffer, setAudioBuffer] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [countdown, setCountdown] = useState(5)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedPresetId, setSelectedPresetId] = useState('cepreng')
  const [sourceType, setSourceType] = useState(null) // 'mic' | 'sample'

  // Bersihkan audio player saat komponen unmount
  useEffect(() => {
    return () => {
      audioDemoPlayer.stop()
    }
  }, [])

  const activePreset = VOICE_PRESETS.find((p) => p.id === selectedPresetId) || VOICE_PRESETS[1]

  // Mulai perekaman vokal dari mic pengguna selama 5 detik
  const handleStartRecord = async () => {
    try {
      audioDemoPlayer.stop()
      setIsPlaying(false)
      setIsRecording(true)
      setCountdown(5)

      toast.info('Perekaman Dimulai!', {
        description: 'Bicaralah sekarang ke mikrofon: "Halo semuanya, ini suara asli saya!"',
      })

      const buffer = await audioDemoPlayer.recordSample(5, (remaining) => {
        setCountdown(remaining)
      })

      setAudioBuffer(buffer)
      setHasBuffer(true)
      setSourceType('mic')
      setIsRecording(false)

      toast.success('Perekaman Selesai! Memutar dengan efek...', {
        description: `Karakter vokal "${activePreset.name}" langsung diputar ke speaker/headphone Anda.`,
      })

      // Otomatis putar ulang dengan preset vokal terpilih
      handlePlayEffect(buffer, activePreset.params)
    } catch (err) {
      setIsRecording(false)
      toast.error('Gagal Mengakses Mikrofon', {
        description: err.message || 'Pastikan izin mikrofon telah diberikan di browser.',
      })
    }
  }

  // Gunakan sampel suara vokal sintesis (Uji Coba 1-Klik Instan)
  const handleUseSample = () => {
    audioDemoPlayer.stop()
    setIsPlaying(false)
    const sampleBuf = audioDemoPlayer.generateSpeechSample()
    setAudioBuffer(sampleBuf)
    setHasBuffer(true)
    setSourceType('sample')

    toast.info('Sampel Audio Vokal Dimuat', {
      description: 'Memutar sampel dengan karakter vokal yang dipilih.',
    })

    handlePlayEffect(sampleBuf, activePreset.params)
  }

  // Putar buffer audio dengan parameter preset
  const handlePlayEffect = (buf = audioBuffer, params = activePreset.params) => {
    if (!buf) return

    // Cek saldo koin vending sebelum memutar (kecuali Pro)
    if (!isPro) {
      const allowed = consumeToken(1, `Uji Coba Demo Vokal (${activePreset.name})`)
      if (!allowed) {
        return
      }
    }

    setIsPlaying(true)
    audioDemoPlayer.play(buf, params, () => {
      setIsPlaying(false)
    })
  }

  // Hentikan pemutaran
  const handleStopPlay = () => {
    audioDemoPlayer.stop()
    setIsPlaying(false)
  }

  // Ganti preset vokal
  const handleSelectPreset = (presetId) => {
    setSelectedPresetId(presetId)
    const preset = VOICE_PRESETS.find((p) => p.id === presetId)
    if (preset && hasBuffer && isPlaying) {
      // Putar ulang dengan efek baru seketika
      handlePlayEffect(audioBuffer, preset.params)
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-300 bg-surface p-6 shadow-sm space-y-6">
      {/* Background Accent Pill */}
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-emerald-100/60 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-indigo-100/60 blur-2xl pointer-events-none" />

      {/* HEADER SECTION: TRUST & SANDBOX BADGE */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant="emerald" size="sm" pulse dot>
              100% Web Audio Sandbox
            </Badge>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              Bebas Virus &amp; Tanpa Perlu Install
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Uji Coba Suara Online</span>
            <span className="rounded-full bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold">
              DEMO 5 DETIK
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Buktikan kualitas vokal Anda berubah langsung di browser sebelum membeli. Rekam 5 detik, dengarkan suaranya bertransformasi secara instan!
          </p>
        </div>

        {/* DOMPET SALDO TOKEN VENDING */}
        <div className="flex items-center gap-2.5 shrink-0 bg-page px-3.5 py-2 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Saldo Uji Coba</span>
            <p className="text-xs font-black font-mono text-emerald-700">
              {isPro ? '💎 PRO Unlimited' : `🪙 ${tokens} Koin`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openPaymentModal({ type: 'tokens', title: 'Top-up Koin Uji Coba', price: 15000, tokensCount: 10 })}
            className="flex items-center gap-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs transition-colors cursor-pointer"
            title="Tambah koin atau tukar voucher platform"
          >
            <Ticket className="h-3 w-3" />
            <span>Klaim / Top-up</span>
          </button>
        </div>
      </div>

      {/* STEP 1 & 2: REKAM & KONTROL PEMUTARAN */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Kolom Kiri: Perekam & Indikator Progres (5 Kolom) */}
        <div className="md:col-span-5 p-4 rounded-2xl border border-slate-200 bg-page space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Mic className="h-4 w-4 text-emerald-600" />
              <span>Langkah 1: Rekam Suara Vokal</span>
            </span>
            {hasBuffer && (
              <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                <span>{sourceType === 'mic' ? 'Mic Tersimpan' : 'Sampel Siap'}</span>
              </span>
            )}
          </div>

          {/* Kotak Hitung Mundur / Status Rekaman */}
          <div className="relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 border-dashed border-emerald-300 bg-surface text-center space-y-2">
            {isRecording ? (
              <>
                <div className="h-12 w-12 rounded-full bg-rose-500 flex items-center justify-center text-white animate-pulse shadow-md">
                  <span className="font-mono text-xl font-black">{countdown}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-600">Sedang Merekam Suara...</p>
                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                    &quot;Halo semuanya, ini suara asli saya di LocalHub!&quot;
                  </p>
                </div>
                {/* Visualizer Bar Animasi */}
                <div className="flex items-center gap-1 h-3 mt-1">
                  <span className="w-1 bg-rose-500 h-2 animate-bounce rounded-full" />
                  <span className="w-1 bg-rose-500 h-4 animate-bounce delay-75 rounded-full" />
                  <span className="w-1 bg-rose-500 h-3 animate-bounce delay-150 rounded-full" />
                  <span className="w-1 bg-rose-500 h-5 animate-bounce delay-100 rounded-full" />
                  <span className="w-1 bg-rose-500 h-2 animate-bounce delay-200 rounded-full" />
                </div>
              </>
            ) : hasBuffer ? (
              <>
                <div className="h-12 w-12 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700">
                  <Volume2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {sourceType === 'mic' ? 'Rekaman Vokal Anda Siap' : 'Sampel Audio Vokal Siap'}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Durasi: ~5 detik • Siap diubah dengan berbagai karakter
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <Mic className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Belum Ada Rekaman Vokal</p>
                  <p className="text-[11px] text-slate-500">
                    Klik tombol hijau di bawah untuk mulai rekam 5 detik
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Tombol Aksi Perekaman */}
          <div className="flex flex-col gap-2">
            <Button
              variant="primary"
              disabled={isRecording}
              icon={isRecording ? <Mic className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
              onClick={handleStartRecord}
              className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold justify-center shadow-emerald-600/30"
            >
              {isRecording
                ? `Merekam... Sisa ${countdown}s`
                : hasBuffer
                ? '🔄 Rekam Ulang Suara Saya'
                : '🎙️ Rekam Suara Saya (5 Detik)'}
            </Button>

            {!isRecording && (
              <button
                type="button"
                onClick={handleUseSample}
                className="inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 py-1 transition-colors cursor-pointer"
              >
                <Music className="h-3 w-3" />
                <span>Atau coba dengan Sampel Suara Siap Pakai (1-Klik)</span>
              </button>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Pilihan Karakter Suara & Playback (7 Kolom) */}
        <div className="md:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Langkah 2: Pilih Karakter Efek &amp; Dengarkan</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Biaya: {isPro ? 'Gratis (Akun Pro)' : '1 Koin / Putar'}
            </span>
          </div>

          {/* Grid Karakter Vokal Preset */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {VOICE_PRESETS.map((preset) => {
              const isSelected = preset.id === selectedPresetId
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`flex flex-col text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-xs ring-2 ring-emerald-300'
                      : 'border-slate-200 bg-surface hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                      {preset.badge}
                    </span>
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-900 truncate">
                    {preset.name.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {preset.description}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Tombol Playback & Audio Player Bar */}
          <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                Efek Vokal Aktif:
              </span>
              <p className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="text-emerald-700">●</span>
                <span>{activePreset.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              {isPlaying ? (
                <Button
                  variant="danger"
                  icon={<Square className="h-4 w-4" />}
                  onClick={handleStopPlay}
                  className="font-bold text-xs"
                >
                  Hentikan
                </Button>
              ) : (
                <Button
                  variant="primary"
                  disabled={!hasBuffer || isRecording}
                  icon={<Play className="h-4 w-4 fill-current" />}
                  onClick={() => handlePlayEffect()}
                  className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shadow-emerald-600/30"
                >
                  ▶ Putar Suara Efek
                </Button>
              )}

              {hasBuffer && !isPlaying && (
                <button
                  type="button"
                  onClick={() => handlePlayEffect()}
                  className="p-2 rounded-xl border border-slate-200 bg-surface hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
                  title="Putar ulang suara"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER CALLOUT: INTEGRASI BISNIS KE GOOGLE MEET / ZOOM */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="h-4 w-4 text-amber-300" />
          </div>
          <div>
            <p className="font-bold text-indigo-950">
              Suka dengan hasil suaranya? Pakai langsung saat Rapat Google Meet / Zoom!
            </p>
            <p className="text-[11px] text-indigo-900/80 leading-relaxed mt-0.5">
              Aktifkan <strong>Mode Rapat Realtime 1-Klik</strong> di bawah. Efek suara akan langsung didengar teman meeting Anda secara live tanpa jeda.
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenMeetingMode}
          className="shrink-0 font-bold border-indigo-300 text-indigo-800 hover:bg-indigo-100"
        >
          Lihat Mode Rapat Realtime ↓
        </Button>
      </div>
    </div>
  )
}

