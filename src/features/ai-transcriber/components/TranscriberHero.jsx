import { Sparkles, ShieldCheck, Cpu, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '@/components'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Header Banner untuk Workstation Local AI Meeting Transcriber
 */
export function TranscriberHero() {
  const user = useAuthStore((state) => state.user)

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-200/90 bg-surface p-6 shadow-sm space-y-4">
      <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-amber-100/60 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-emerald-100/50 blur-2xl pointer-events-none" />

      {/* Navigasi Kembali & Badge Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Wadah Vending Hub</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="amber" size="sm" pulse dot>
            💎 PRO Workstation
          </Badge>
          <Badge variant="emerald" size="sm">
            <Cpu className="h-3 w-3 mr-1 inline" />
            Whisper AI On-Device
          </Badge>
        </div>
      </div>

      {/* Judul & Keterangan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-amber-500" />
            <span>Local AI Meeting Transcriber</span>
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Transkripsikan rekaman percakapan rapat menjadi <strong>notulensi terstruktur</strong>, <strong>poin keputusan penting</strong>, dan <strong>daftar tugas tindakan (action items)</strong> secara otomatis di laptop Anda sendiri.
          </p>
        </div>

        {/* Info Lisensi Mesin Pengguna */}
        <div className="shrink-0 p-3 rounded-2xl bg-page border border-slate-200 text-right font-mono text-[11px] space-y-0.5">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Status Lisensi</span>
          <p className="font-bold text-emerald-800 flex items-center gap-1 justify-end">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>{user.isPro ? 'Lisensi PRO Aktif' : 'Mode Terbuka'}</span>
          </p>
          <span className="text-[10px] text-slate-500">Device: {user.machineId}</span>
        </div>
      </div>
    </div>
  )
}

