import { Sliders, RotateCcw, Volume2, Sparkles, Cpu, Waves, Flame } from 'lucide-react'

/**
 * Komponen Pengaturan Suara Kustom Parametrik
 * Memungkinkan fine-tuning pitch, formant, bass, treble, dan efek
 */
export function CustomControls({
  params = {},
  onParamChange = () => {},
  onReset = () => {},
}) {
  const pitchSemitones = params.pitchSemitones ?? 0
  const bassBoost = params.bassBoost ?? 0
  const trebleBoost = params.trebleBoost ?? 0
  const formantF1 = params.formantF1 ?? 0
  const formantF2 = params.formantF2 ?? 0
  const robotMix = params.robotMix ?? 0
  const echoMix = params.echoMix ?? 0
  const distortion = params.distortion ?? 0

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      {/* Header Panel Kontrol */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-200">
            Penyesuaian Kustom (Fine-Tuning)
          </h3>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700/80 hover:text-white transition-all cursor-pointer"
          title="Reset ke pengaturan awal preset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Grid Slider Pengaturan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Pitch Shifter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Tinggi Nada (Pitch Shift)
            </span>
            <span className="font-mono font-semibold text-indigo-400">
              {pitchSemitones > 0 ? `+${pitchSemitones}` : pitchSemitones} semitones
            </span>
          </div>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={pitchSemitones}
            onChange={(e) => onParamChange('pitchSemitones', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-12 (Bass Dalam)</span>
            <span>0 (Normal)</span>
            <span>+12 (Cepreng)</span>
          </div>
        </div>

        {/* 2. Bass EQ Boost */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Volume2 className="h-3.5 w-3.5 text-purple-400" />
              Resonansi Bass (Low Freq)
            </span>
            <span className="font-mono font-semibold text-purple-400">
              {bassBoost > 0 ? `+${bassBoost}` : bassBoost} dB
            </span>
          </div>
          <input
            type="range"
            min="-12"
            max="14"
            step="1"
            value={bassBoost}
            onChange={(e) => onParamChange('bassBoost', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-12 dB (Tipis)</span>
            <span>0 dB</span>
            <span>+14 dB (Tebal)</span>
          </div>
        </div>

        {/* 3. Treble EQ Boost */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Waves className="h-3.5 w-3.5 text-cyan-400" />
              Kejernihan Treble (High Freq)
            </span>
            <span className="font-mono font-semibold text-cyan-400">
              {trebleBoost > 0 ? `+${trebleBoost}` : trebleBoost} dB
            </span>
          </div>
          <input
            type="range"
            min="-12"
            max="12"
            step="1"
            value={trebleBoost}
            onChange={(e) => onParamChange('trebleBoost', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-cyan-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-12 dB (Redup)</span>
            <span>0 dB</span>
            <span>+12 dB (Tajam)</span>
          </div>
        </div>

        {/* 4. Formant Vokal Feminin (F2 Shaping) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-pink-400" />
              Karakter Formant (Feminin / Maskulin)
            </span>
            <span className="font-mono font-semibold text-pink-400">
              {formantF2 > 0 ? `+${formantF2}` : formantF2} dB
            </span>
          </div>
          <input
            type="range"
            min="-8"
            max="10"
            step="1"
            value={formantF2}
            onChange={(e) => {
              const val = Number(e.target.value)
              onParamChange('formantF2', val)
              onParamChange('formantF1', Math.round(val * 0.7))
            }}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-pink-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>Maskulin (Tenggorokan)</span>
            <span>Netral</span>
            <span>Feminin (Nasal/Halus)</span>
          </div>
        </div>

        {/* 5. Resonansi Tenggorokan F1 */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Waves className="h-3.5 w-3.5 text-indigo-400" />
              Resonansi Vokal Inti (F1)
            </span>
            <span className="font-mono font-semibold text-indigo-400">
              {formantF1 > 0 ? `+${formantF1}` : formantF1} dB
            </span>
          </div>
          <input
            type="range"
            min="-8"
            max="8"
            step="1"
            value={formantF1}
            onChange={(e) => onParamChange('formantF1', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>-8 dB (Kering)</span>
            <span>0 dB</span>
            <span>+8 dB (Tebal)</span>
          </div>
        </div>

        {/* 6. Modulasi Robot (Ring Modulator) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Cpu className="h-3.5 w-3.5 text-emerald-400" />
              Modulasi Suara Robot
            </span>
            <span className="font-mono font-semibold text-emerald-400">
              {Math.round(robotMix * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={robotMix}
            onChange={(e) => onParamChange('robotMix', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Off)</span>
            <span>50%</span>
            <span>100% (Full Robot)</span>
          </div>
        </div>

        {/* 7. Echo / Ruangan (Reverb Delay) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Waves className="h-3.5 w-3.5 text-blue-400" />
              Efek Echo / Pantulan Ruang
            </span>
            <span className="font-mono font-semibold text-blue-400">
              {Math.round(echoMix * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.02"
            value={echoMix}
            onChange={(e) => onParamChange('echoMix', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Dry)</span>
            <span>25%</span>
            <span>50% (Gema Jelas)</span>
          </div>
        </div>

        {/* 8. Distorsi / Saturasi Vokal */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Flame className="h-3.5 w-3.5 text-rose-400" />
              Saturasi / Grit Vokal
            </span>
            <span className="font-mono font-semibold text-rose-400">
              {Math.round(distortion * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="0.5"
            step="0.05"
            value={distortion}
            onChange={(e) => onParamChange('distortion', Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0% (Murni)</span>
            <span>25%</span>
            <span>50% (Grit Padat)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
