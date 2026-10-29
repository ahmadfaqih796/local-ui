import {
  X,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Laptop,
  Radio,
  Mic,
  ShieldCheck,
  VolumeX,
} from 'lucide-react'

/**
 * Modal Dialog Panduan Menghubungkan Jalur Suara Efek ke Jalur Mikrofon Google Meet, Zoom, dan Discord
 * Dilengkapi petunjuk Anti-Mantul / Anti-Echo
 */
export function MeetingGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Laptop className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Panduan Jalur Mikrofon &amp; Anti-Mantul (Anti-Echo)
            </h2>
            <p className="text-xs text-slate-400">
              Konfigurasi agar HANYA suara Anda yang diubah efek dan suara peserta lain tidak mantul
            </p>
          </div>
        </div>

        {/* Kotak Emas: 3 Langkah Mencegah Suara Orang Lain Mantul */}
        <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/40 p-4 text-xs space-y-2.5">
          <p className="font-bold text-amber-300 flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-amber-400" />
            <span>3 Langkah Pasti Agar Suara Teman Meeting Tidak Mantul (Anti-Gema):</span>
          </p>
          <ul className="space-y-1.5 text-slate-200 text-[11px] list-disc list-inside">
            <li>
              <strong>Di LocalHub Kotak 1:</strong> WAJIB pilih <strong>Mikrofon Fisik Laptop</strong> (contoh: <em>Intel Smart Sound</em> atau <em>Realtek</em>), <u>JANGAN</u> pilih CABLE Output!
            </li>
            <li>
              <strong>Di LocalHub Kotak 2:</strong> Pilih <strong>CABLE Input</strong> (agar suara vokal efek mengalir ke Google Meet).
            </li>
            <li>
              <strong>Di Google Meet:</strong> Jika sedang membagikan layar (Share Screen), <strong>MATIKAN &quot;Audio Presentasi&quot;</strong> agar suara komputer tidak disiarkan ulang ke Google Meet.
            </li>
            <li>
              <strong>Monitor Suara Sendiri:</strong> Matikan tombol monitor di LocalHub jika Anda memakai speaker laptop (tanpa headset).
            </li>
          </ul>
        </div>

        {/* Penjelasan Masalah Jalur Mic vs Audio */}
        <div className="mb-6 rounded-xl bg-slate-950/90 border border-slate-800 p-4 text-xs space-y-3">
          <p className="font-semibold text-indigo-300 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-indigo-400" />
            Alur Perutean Audio yang Benar
          </p>
          <div className="rounded-lg bg-slate-900 p-3 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-center">
            <div className="p-2 rounded bg-slate-950 border border-slate-700/60 w-full sm:w-auto">
              <span className="text-indigo-400 block font-bold">1. Mic Fisik Laptop</span>
              <span className="text-slate-400 text-[10px]">Hanya suara Anda</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 shrink-0 rotate-90 sm:rotate-0" />
            <div className="p-2 rounded bg-indigo-950/60 border border-indigo-500/40 w-full sm:w-auto">
              <span className="text-pink-400 block font-bold">2. LocalHub Voice</span>
              <span className="text-slate-400 text-[10px]">Cepreng / Bass / Robot</span>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-500 shrink-0 rotate-90 sm:rotate-0" />
            <div className="p-2 rounded bg-emerald-950/60 border border-emerald-500/40 w-full sm:w-auto">
              <span className="text-emerald-400 block font-bold">3. CABLE Output</span>
              <span className="text-slate-400 text-[10px]">Mic di Google Meet</span>
            </div>
          </div>
        </div>

        {/* Langkah-langkah */}
        <div className="space-y-4">
          {/* Langkah 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              1
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-200">
                Pasang Driver VB-CABLE (Driver Virtual Resmi Gratis)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                VB-CABLE bertindak sebagai jembatan yang menghubungkan output LocalHub menjadi input Mikrofon di Google Meet.
              </p>
              <div className="pt-1">
                <a
                  href="https://vb-audio.com/Cable/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600/30 border border-indigo-500/50 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-600/50 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Unduh VB-CABLE Driver Resmi (vb-audio.com)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Langkah 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              2
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-200">
                Pilih Jalur Efek di LocalHub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pada kotak <strong className="text-slate-200">&quot;2. Jalur Suara Efek ke Meeting&quot;</strong>, pilih:
              </p>
              <div className="inline-flex items-center gap-2 mt-1 font-mono text-xs px-3 py-1.5 rounded-md bg-slate-950 text-emerald-300 border border-emerald-500/40">
                <Radio className="h-3.5 w-3.5 text-emerald-400" />
                <span>CABLE Input (VB-Audio Virtual Cable)</span>
              </div>
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
              3
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-200">
                Atur Google Meet / Zoom
              </h3>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-white">
                  <Mic className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Pengaturan Audio Google Meet</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  • <strong>Mikrofon:</strong> Pilih <span className="text-emerald-400 font-mono">CABLE Output (VB-Audio)</span>
                </p>
                <p className="text-slate-300 text-[11px]">
                  • <strong>Speaker:</strong> Tetap pilih <span className="text-indigo-300 font-mono">Speaker Realtek / Headphone Anda</span> (jangan CABLE!)
                </p>
                <p className="text-amber-300 text-[11px] flex items-center gap-1 pt-1">
                  <VolumeX className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Jika Share Screen: Matikan opsi &quot;Bagikan audio presentasi&quot;.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Selesai */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            <p className="leading-relaxed">
              <strong>Selesai &amp; Bebas Mantul!</strong> Kini hanya suara mikrofon Anda yang diubah efek dan terdengar oleh Pak Paul dan peserta meeting lainnya tanpa ada gema!
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <span>Mengerti &amp; Siap Rapat</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
