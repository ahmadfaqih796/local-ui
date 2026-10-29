import { Mic, Sparkles, Volume2, Smile, UserCheck, Cpu, Check } from 'lucide-react'
import { VOICE_PRESETS } from '../constants/presets'

// Mapping ikon Lucide berdasarkan nama string
const ICON_MAP = {
  Mic,
  Sparkles,
  Volume2,
  Smile,
  UserCheck,
  Cpu,
}

/**
 * Komponen Pemilihan Preset Suara Cepat
 */
export function PresetSelector({ selectedPresetId, onSelectPreset }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
          Preset Karakter Suara
        </h3>
        {selectedPresetId === 'custom' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/30">
            Mode Kustom Aktif
          </span>
        )}
      </div>

      {/* Grid Kartu Preset Responsif */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VOICE_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id
          const IconComponent = ICON_MAP[preset.icon] || Mic

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`group relative flex flex-col items-start p-4 rounded-xl text-left transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'border-indigo-500/80 bg-slate-800/90 shadow-[0_0_20px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500'
                  : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/60 hover:border-slate-700'
              }`}
            >
              {/* Header Kartu: Ikon & Badge */}
              <div className="flex w-full items-center justify-between mb-2.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${preset.color} text-white shadow-md transition-transform group-hover:scale-105`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase text-slate-400 border border-slate-700/60">
                    {preset.badge}
                  </span>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-white shadow-xs">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Judul & Deskripsi */}
              <h4 className="font-semibold text-slate-100 text-sm group-hover:text-indigo-300 transition-colors">
                {preset.name}
              </h4>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed line-clamp-2">
                {preset.description}
              </p>

              {/* Garis Aksen Bawah jika aktif */}
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl bg-gradient-to-r from-indigo-500 to-pink-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

