import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Radio,
  Mic,
  FolderSync,
  X,
  ChevronRight,
  ShieldCheck,
  Store,
  Coins,
  Plus,
} from 'lucide-react'
import { Badge, Button } from '@/components'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Komponen Sidebar Drawer Mobile dengan Backdrop Blur & Penguncian Scroll
 * Dilengkapi Info Akun & Dompet Koin Vending
 * @param {{ isOpen: boolean, onClose: () => void }} props
 */
export function MobileDrawer({ isOpen = false, onClose = () => {} }) {
  const tokens = useAuthStore((state) => state.tokens)
  const user = useAuthStore((state) => state.user)
  const openPaymentModal = useAuthStore((state) => state.openPaymentModal)

  // Kunci scroll body saat drawer terbuka di layar mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
      {/* Backdrop Blur Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Slide-in Panel (Dari Kanan) */}
      <aside className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-surface border-l border-emerald-200 p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
                <Radio className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold tracking-tight text-slate-900 text-base">
                  Local<span className="text-emerald-600">Hub</span>
                </span>
                <span className="block text-[10px] text-emerald-700 font-semibold">
                  Menu Navigasi
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Menu"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Card Profil & Saldo Koin Mobile */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-3 mb-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 border border-amber-300 text-amber-900 shadow-2xs">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-amber-950">
                    {tokens} Koin Vending
                  </span>
                  {user.isPro ? (
                    <Badge variant="amber" size="xs">
                      PRO
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="xs">
                      Tamu
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  ID: {user.machineId}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="h-3 w-3" />}
              onClick={() => {
                onClose()
                openPaymentModal({
                  type: 'tokens',
                  title: 'Top-up 10 Koin Vending',
                  price: 15000,
                  tokensCount: 10,
                })
              }}
              className="bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
            >
              Top Up
            </Button>
          </div>

          {/* Section Navigasi */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1 mb-2">
              Fitur Utama Wadah
            </p>

            {/* NavLink 0: Vending Hub / Beranda */}
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs'
                    : 'border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Store className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm block">Vending Hub</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Katalog Dispenser Aplikasi
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-600 shrink-0" />
            </NavLink>

            {/* NavLink 1: Pengubah Suara Mic */}
            <NavLink
              to="/voice-changer"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs'
                    : 'border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
                  <Mic className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <span className="text-sm block">Pengubah Suara Mic</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Voice Changer Google Meet &amp; Zoom
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-600 shrink-0" />
            </NavLink>

            {/* NavLink 2: Kirim File & Storage */}
            <NavLink
              to="/file-transfer"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-50/90 text-emerald-950 font-bold shadow-xs'
                    : 'border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 border border-teal-200">
                  <FolderSync className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm block">Kirim File &amp; Storage</span>
                    <span className="rounded bg-emerald-200/90 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-900 border border-emerald-300">
                      Wi-Fi
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Penyimpanan laptop tanpa kuota
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-emerald-600 shrink-0" />
            </NavLink>
          </div>

          {/* Status Jaringan Wi-Fi Card */}
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-2 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-emerald-950">
                Jaringan Wi-Fi Lokal Aktif
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Semua berkas yang diunggah dari ponsel ini langsung tersimpan di hard drive laptop tanpa menggunakan kuota data internet.
            </p>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-slate-100 text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>LocalHub Utility App • v1.0</span>
          </div>
        </div>
      </aside>
    </div>
  )
}

