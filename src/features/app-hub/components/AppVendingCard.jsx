import { Link } from 'react-router-dom'
import {
  Mic,
  HardDrive,
  Share2,
  Sparkles,
  Check,
  ArrowRight,
  Lock,
  Tag,
  Activity,
  Layers,
} from 'lucide-react'

// Mapping ikon dinamis
const ICON_MAP = {
  Mic,
  HardDrive,
  Share2,
  Sparkles,
}

/**
 * Kartu Slot Aplikasi Vending Machine (Local App Card)
 * Mewakili satu produk "snack / softdrink" utilitas lokal dalam wadah vending machine
 */
export function AppVendingCard({ app = {}, onOpenDetails = () => {} }) {
  const IconComponent = ICON_MAP[app.iconName] || Layers
  const isLocked = app.status === 'coming_soon' || !app.pricing?.isUnlocked

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border ${
        app.borderColor || 'border-emerald-200/90'
      } bg-surface p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10`}
    >
      {/* Background Soft Glow */}
      <div
        className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-linear-to-br ${app.gradientBg} blur-xl pointer-events-none transition-transform group-hover:scale-125`}
      />

      {/* Bagian Atas: Ikon, Kategori, & Badge Status */}
      <div className="relative space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
              app.accentColor === 'emerald'
                ? 'bg-emerald-100 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white'
                : app.accentColor === 'blue'
                ? 'bg-blue-100 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white'
                : app.accentColor === 'indigo'
                ? 'bg-indigo-100 text-indigo-700 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white'
                : 'bg-amber-100 text-amber-700 border-amber-200 group-hover:bg-amber-600 group-hover:text-white'
            }`}
          >
            <IconComponent className="h-7 w-7 transition-transform group-hover:scale-110" />
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isLocked
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {isLocked ? (
                <>
                  <Lock className="h-3 w-3" />
                  <span>{app.badge}</span>
                </>
              ) : (
                <>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{app.badge}</span>
                </>
              )}
            </span>

            <span className="text-[10px] font-mono text-slate-500 font-medium">
              {app.version}
            </span>
          </div>
        </div>

        {/* Judul & Deskripsi */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Tag className="h-3 w-3" />
            <span>{app.categoryLabel}</span>
          </div>

          <h3 className="text-lg font-bold text-text-primary tracking-tight group-hover:text-emerald-700 transition-colors">
            {app.name}
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
            {app.description}
          </p>
        </div>

        {/* Fitur Kunci (Checklist) */}
        <div className="space-y-1.5 rounded-2xl bg-page/80 border border-slate-200/80 p-3 text-xs">
          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            Fitur Utama Wadah:
          </p>
          <ul className="space-y-1 text-[11px] text-slate-600">
            {app.features?.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bagian Bawah: Statistik Cepat & Tombol Aksi */}
      <div className="relative mt-5 pt-4 border-t border-slate-100 space-y-3">
        {/* Info Cepat */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-emerald-600" />
            {app.stats?.tech || 'Local Core'}
          </span>
          <span className="font-semibold text-emerald-800">
            {app.pricing?.priceLabel}
          </span>
        </div>

        {/* Tombol Peluncuran */}
        {isLocked ? (
          <button
            type="button"
            onClick={() => onOpenDetails(app)}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500/15 border border-amber-300 text-amber-900 px-4 py-2.5 text-xs font-bold hover:bg-amber-500 hover:text-white transition-all cursor-pointer shadow-2xs active:scale-95"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Lihat Jalur Pembayaran &amp; Lisensi</span>
          </button>
        ) : (
          <Link
            to={app.route}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all cursor-pointer group-hover:shadow-emerald-600/30 active:scale-95"
          >
            <span>Buka Aplikasi Ini</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  )
}

