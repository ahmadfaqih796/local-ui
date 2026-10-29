import { Wifi, Cable, Laptop, Sparkles, Clock } from 'lucide-react'

/**
 * Halaman Roadmap: Fitur Transfer File Lokal (P2P Wi-Fi / Kabel LAN)
 */
export function FileTransferPage({ onBackToVoiceChanger = () => {} }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Banner Fitur Mendatang */}
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-slate-950 p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-500/40 px-3 py-1 text-xs font-semibold text-indigo-300 mb-4">
            <Clock className="h-3.5 w-3.5" />
            <span>Fitur Tahap 2 (Dalam Pengembangan)</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Kirim File Antar Laptop &amp; PC (Wi-Fi / Kabel LAN)
          </h1>
          <p className="mt-3 text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            Kirim file super cepat tanpa kuota internet menggunakan jaringan lokal (Same Wi-Fi atau sambungan kabel LAN P2P) langsung dari peramban.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onBackToVoiceChanger}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>Kembali ke Pengubah Suara Mic</span>
            </button>
          </div>
        </div>

        {/* 3 Keunggulan Fitur Transfer Lokal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Wifi className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">Satu Jaringan Wi-Fi</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cukup hubungkan kedua laptop ke hotspot / router Wi-Fi yang sama, file terkirim dengan enkripsi P2P lokal.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cable className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">Kabel LAN (Gigabit Speed)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tancapkan kabel LAN antar-laptop untuk kecepatan transfer hingga 1 Gbps (125 MB/detik) tanpa batas ukuran file.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Laptop className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-100 text-sm">Tanpa Instal Software</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penerima cukup membuka tautan browser lokal atau memindai kode QR dari laptop utama.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
