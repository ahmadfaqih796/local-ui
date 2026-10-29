import { useEffect, useRef, useState } from 'react'
import { Activity, BarChart3, Radio, Volume2 } from 'lucide-react'
import { audioEngine } from '../services/audioEngine'

/**
 * Komponen Visualizer Audio Real-Time
 * Menggambar oscilloscope gelombang vokal dan spektrum frekuensi dengan canvas 60 FPS
 */
export function VoiceVisualizer({ isActive, isMuted }) {
  const canvasRef = useRef(null)
  const [viewMode, setViewMode] = useState('waveform') // 'waveform' | 'spectrum'
  const [vuLevel, setVuLevel] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let animationFrameId
    const fftSize = 512
    const dataArray = new Uint8Array(fftSize)

    const render = () => {
      // Resize canvas sesuai ukuran tampilan asli
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight
      }

      const width = canvas.width
      const height = canvas.height

      // Bersihkan canvas dengan latar belakang gelap pekat
      ctx.fillStyle = '#0b0f19'
      ctx.fillRect(0, 0, width, height)

      // Gambar grid latar belakang tipis bergaya studio audio
      ctx.strokeStyle = 'rgba(55, 65, 81, 0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < width; x += 30) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
      }
      for (let y = 0; y < height; y += 25) {
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()

      // Jika mikrofon tidak aktif atau di-mute
      if (!isActive || isMuted) {
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(0, height / 2)
        ctx.lineTo(width, height / 2)
        ctx.stroke()

        setVuLevel(0)
        animationFrameId = requestAnimationFrame(render)
        return
      }

      if (viewMode === 'waveform') {
        // --- MODE GELOMBANG VOKAL (WAVEFORM) ---
        audioEngine.getTimeDomainData(dataArray)

        // Hitung RMS untuk VU meter
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          const val = (dataArray[i] - 128) / 128
          sum += val * val
        }
        const rms = Math.sqrt(sum / dataArray.length)
        setVuLevel(Math.min(100, Math.round(rms * 280)))

        // Gambar kurva gelombang dengan gradien neon
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, '#06b6d4')   // Cyan
        gradient.addColorStop(0.5, '#6366f1') // Indigo
        gradient.addColorStop(1, '#ec4899')   // Pink

        ctx.lineWidth = 2.5
        ctx.strokeStyle = gradient
        ctx.shadowBlur = 10
        ctx.shadowColor = 'rgba(99, 102, 241, 0.6)'
        ctx.beginPath()

        const sliceWidth = width / dataArray.length
        let x = 0

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0
          const y = (v * height) / 2

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
          x += sliceWidth
        }

        ctx.lineTo(width, height / 2)
        ctx.stroke()
        ctx.shadowBlur = 0 // Reset shadow
      } else {
        // --- MODE SPEKTRUM FREKUENSI (EQUALIZER BARS) ---
        audioEngine.getFrequencyData(dataArray)

        // Hitung level volume rata-rata
        let sum = 0
        const barCount = 48
        const step = Math.floor((dataArray.length / 2) / barCount)
        const barWidth = (width / barCount) - 3

        for (let i = 0; i < barCount; i++) {
          let barSum = 0
          for (let j = 0; j < step; j++) {
            barSum += dataArray[i * step + j]
          }
          const barAvg = barSum / step
          sum += barAvg

          const barHeight = (barAvg / 255) * (height - 20)
          const x = i * (barWidth + 3) + 2
          const y = height - barHeight - 10

          const barGradient = ctx.createLinearGradient(0, height, 0, y)
          barGradient.addColorStop(0, '#3b82f6')
          barGradient.addColorStop(0.6, '#8b5cf6')
          barGradient.addColorStop(1, '#f43f5e')

          ctx.fillStyle = barGradient
          ctx.beginPath()
          ctx.roundRect(x, y, barWidth, Math.max(3, barHeight), 2)
          ctx.fill()
        }

        const avg = sum / barCount
        setVuLevel(Math.min(100, Math.round((avg / 255) * 120)))
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive, isMuted, viewMode])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      {/* Header Visualizer */}
      <div className="mb-3 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-3 w-3 items-center justify-center rounded-full ${
              isActive && !isMuted ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-rose-500'
            }`}
          >
            {isActive && !isMuted && (
              <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-300" />
            )}
          </div>
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-300">
            {isActive && !isMuted
              ? 'Live Effect Engine Aktif'
              : isMuted
              ? 'Mikrofon Dibisukan (Muted)'
              : 'Mikrofon Standby'}
          </span>
        </div>

        {/* Tombol Ganti Mode Tampilan */}
        <div className="flex items-center rounded-lg bg-slate-950/70 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setViewMode('waveform')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === 'waveform'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan Gelombang Suara (Oscilloscope)"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Waveform</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('spectrum')}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
              viewMode === 'spectrum'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tampilkan Spektrum Frekuensi Suara"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Spektrum</span>
          </button>
        </div>
      </div>

      {/* Area Layar Canvas */}
      <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950">
        <canvas ref={canvasRef} className="h-full w-full block" />

        {/* Overlay saat non-aktif */}
        {!isActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/75 backdrop-blur-xs text-center p-4">
            <Radio className="h-8 w-8 text-slate-600 mb-2 animate-pulse" />
            <p className="text-sm font-medium text-slate-300">Mikrofon Belum Dinyalakan</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Klik tombol &quot;Mulai Mikrofon&quot; di bawah untuk mendengar suara vokal
            </p>
          </div>
        )}
      </div>

      {/* Meter Level Input (VU Meter) */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Volume2 className="h-3.5 w-3.5" />
          <span className="font-mono">VU</span>
        </div>
        <div className="relative flex-1 h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-75 rounded-full ${
              vuLevel > 85
                ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                : vuLevel > 65
                ? 'bg-amber-400'
                : 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
            }`}
            style={{ width: `${vuLevel}%` }}
          />
        </div>
        <span className="font-mono text-[11px] text-slate-400 w-8 text-right">
          {vuLevel}%
        </span>
      </div>
    </div>
  )
}

