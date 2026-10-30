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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-200 bg-surface p-6 shadow-2xl text-text-primary">
        {/* Tombol Tutup */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Modal */}
        <div className="flex items-center gap-3 mb-5 border-b border-emerald-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <Laptop className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">
              Panduan Jalur Mikrofon &amp; Anti-Mantul (Anti-Echo)
            </h2>
            <p className="text-xs text-slate-500">
              Konfigurasi agar HANYA suara Anda yang diubah efek dan suara peserta lain tidak mantul
            </p>
          </div>
        </div>

        {/* Kotak Emas: 3 Langkah Mencegah Suara Orang Lain Mantul */}
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs space-y-2.5 text-amber-950">
          <p className="font-bold text-amber-900 flex items-center gap-2 text-sm">
            <ShieldCheck className="h-4 w-4 text-amber-600" />
            <span>3 Langkah Pasti Agar Suara Teman Meeting Tidak Mantul (Anti-Gema):</span>
          </p>
          <ul className="space-y-1.5 text-amber-900 text-[11px] list-disc list-inside">
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
        <div className="mb-6 rounded-xl bg-emerald-50/60 border border-emerald-200 p-4 text-xs space-y-3">
          <p className="font-semibold text-emerald-900 flex items-center gap-1.5">
            <AlertCircle className="h-4 w-4 text-emerald-600" />
            Alur Perutean Audio yang Benar
          </p>
          <div className="rounded-lg bg-white p-3 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-center shadow-xs">
            <div className="p-2 rounded bg-slate-50 border border-slate-200 w-full sm:w-auto">
              <span className="text-emerald-800 block font-bold">1. Mic Fisik Laptop</span>
              <span className="text-slate-500 text-[10px]">Hanya suara Anda</span>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 rotate-90 sm:rotate-0" />
            <div className="p-2 rounded bg-emerald-50 border border-emerald-200 w-full sm:w-auto">
              <span className="text-pink-600 block font-bold">2. LocalHub Voice</span>
              <span className="text-slate-500 text-[10px]">Cepreng / Bass / Robot</span>
            </div>
            <ArrowRight className="h-4 w-4 text-emerald-400 shrink-0 rotate-90 sm:rotate-0" />
            <div className="p-2 rounded bg-emerald-100/70 border border-emerald-300 w-full sm:w-auto">
              <span className="text-emerald-800 block font-bold">3. CABLE Output</span>
              <span className="text-slate-500 text-[10px]">Mic di Google Meet</span>
            </div>
          </div>
        </div>

        {/* Langkah-langkah */}
        <div className="space-y-4">
          {/* Langkah 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs">
              1
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-semibold text-slate-800">
                Pasang Driver VB-CABLE (Driver Virtual Resmi Gratis)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                VB-CABLE bertindak sebagai jembatan yang menghubungkan output LocalHub menjadi input Mikrofon di Google Meet.
              </p>
              <div className="pt-1">
                <a
                  href="https://vb-audio.com/Cable/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Unduh VB-CABLE Driver Resmi (vb-audio.com)</span>
                </a>
              </div>
            </div>
          </div>

          {/* Langkah 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs">
              2
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-800">
                Pilih Jalur Efek di LocalHub
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pada kotak <strong className="text-slate-800">&quot;2. Jalur Suara Efek ke Meeting&quot;</strong>, pilih:
              </p>
              <div className="inline-flex items-center gap-2 mt-1 font-mono text-xs px-3 py-1.5 rounded-md bg-white text-emerald-800 border border-emerald-200 shadow-xs">
                <Radio className="h-3.5 w-3.5 text-emerald-600" />
                <span>CABLE Input (VB-Audio Virtual Cable)</span>
              </div>
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white shadow-xs">
              3
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">
                Atur Google Meet / Zoom
              </h3>
              <div className="p-3 rounded-lg bg-white border border-slate-200 space-y-1.5 text-xs shadow-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Mic className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Pengaturan Audio Google Meet</span>
                </div>
                <p className="text-slate-700 text-[11px]">
                  • <strong>Mikrofon:</strong> Pilih <span className="text-emerald-700 font-mono font-semibold">CABLE Output (VB-Audio)</span>
                </p>
                <p className="text-slate-700 text-[11px]">
                  • <strong>Speaker:</strong> Tetap pilih <span className="text-indigo-700 font-mono font-semibold">Speaker Realtek / Headphone Anda</span> (jangan CABLE!)
                </p>
                <p className="text-amber-800 text-[11px] flex items-center gap-1 pt-1">
                  <VolumeX className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                  <span>Jika Share Screen: Matikan opsi &quot;Bagikan audio presentasi&quot;.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Selesai */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            <p className="leading-relaxed">
              <strong>Selesai &amp; Bebas Mantul!</strong> Kini hanya suara mikrofon Anda yang diubah efek dan terdengar oleh teman meeting tanpa ada gema!
            </p>
          </div>
        </div>

        {/* Footer Modal */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
          >
            <span>Mengerti &amp; Siap Rapat</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
