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
 * Komponen Pemilihan Preset Suara Cepat (Fresh Green Light Mode)
 */
export function PresetSelector({ selectedPresetId, onSelectPreset }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold tracking-wider uppercase text-emerald-900">
          Preset Karakter Suara
        </h3>
        {selectedPresetId === 'custom' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-300">
            Mode Kustom Aktif
          </span>
        )}
      </div>

      {/* Grid Kartu Preset Responsif Mode Terang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {VOICE_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id
          const IconComponent = ICON_MAP[preset.icon] || Mic

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset.id)}
              className={`group relative flex flex-col items-start p-4 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-50/90 shadow-md ring-2 ring-emerald-500/50'
                  : 'border-emerald-200/90 bg-white hover:bg-emerald-50/50 hover:border-emerald-300 shadow-xs'
              }`}
            >
              {/* Header Kartu: Ikon & Badge */}
              <div className="flex w-full items-center justify-between mb-2.5">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${preset.color} text-white shadow-md transition-transform group-hover:scale-105`}
                >
                  <IconComponent className="h-5 w-5" />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="rounded-md bg-emerald-100/70 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-emerald-800 border border-emerald-200">
                    {preset.badge}
                  </span>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                      <Check className="h-3 w-3 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Judul & Deskripsi */}
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                {preset.name}
              </h4>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                {preset.description}
              </p>

              {/* Garis Aksen Bawah jika aktif */}
              {isSelected && (
                <div className="absolute inset-x-0 bottom-0 h-1.5 rounded-b-2xl bg-gradient-to-r from-emerald-500 to-teal-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
