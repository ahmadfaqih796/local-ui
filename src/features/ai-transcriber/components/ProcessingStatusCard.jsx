import { Cpu, ShieldCheck, Activity, Sparkles } from 'lucide-react'

/**
 * Kartu Status Visualisasi Pemrosesan Model AI On-Device
 */
export function ProcessingStatusCard({ progress = 0, currentStep = '' }) {
  return (
    <div className="rounded-3xl border border-amber-300 bg-amber-50/70 p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
            <Sparkles className="h-4 w-4 animate-spin text-amber-200" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-950">
              Sedang Memproses Notulensi Rapat...
            </h4>
            <p className="text-[11px] text-amber-900/80">{currentStep}</p>
          </div>
        </div>
        <span className="font-mono text-sm font-black text-amber-700">{progress}%</span>
      </div>

      {/* Progress Bar Dinamis */}
      <div className="h-2.5 w-full rounded-full bg-amber-200 overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-amber-500 to-orange-600 transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Statistik On-Device Hardware */}
      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono text-amber-900 pt-1">
        <div className="p-2 rounded-xl bg-surface/80 border border-amber-200">
          <span className="text-slate-500 block">Hardware Engine</span>
          <span className="font-bold text-amber-800 flex items-center justify-center gap-1 mt-0.5">
            <Cpu className="h-3 w-3" /> Whisper Local
          </span>
        </div>
        <div className="p-2 rounded-xl bg-surface/80 border border-amber-200">
          <span className="text-slate-500 block">Privasi Data</span>
          <span className="font-bold text-emerald-700 flex items-center justify-center gap-1 mt-0.5">
            <ShieldCheck className="h-3 w-3" /> 100% On-Device
          </span>
        </div>
        <div className="p-2 rounded-xl bg-surface/80 border border-amber-200">
          <span className="text-slate-500 block">Konsumsi Internet</span>
          <span className="font-bold text-blue-700 flex items-center justify-center gap-1 mt-0.5">
            <Activity className="h-3 w-3" /> 0 KB (Offline)
          </span>
        </div>
      </div>
    </div>
  )
}

