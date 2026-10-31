import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Radio, Mic, FolderSync, Wifi, Menu, Store, Coins, Plus, Crown, User, Sparkles } from 'lucide-react'

import { Badge } from '@/components'
import { useAuthStore } from '@/store/useAuthStore'
import { MobileDrawer } from './MobileDrawer'

/**
 * Header Bersih & Segar (Fresh Green Light Theme - Mode Terang)
 * Dilengkapi Navigasi Responsive Desktop, Dompet Token Vending, & Integrasi Mobile Drawer
 */
export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const tokens = useAuthStore((state) => state.tokens)
  const user = useAuthStore((state) => state.user)
  const openPaymentModal = useAuthStore((state) => state.openPaymentModal)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-green-200/80 bg-surface/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-2 sm:gap-3">
            {/* Logo & Identitas Aplikasi */}
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
                <Radio className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold tracking-tight text-slate-900 text-base sm:text-lg">
                    Local<span className="text-emerald-600">Hub</span>
                  </span>
                  <span className="rounded-full bg-emerald-100 border border-emerald-300/80 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    v1.0 Fresh
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 hidden sm:block">
                  Wadah Utilitas: Vending Hub, Voice Changer &amp; Wi-Fi Storage
                </p>
              </div>
            </NavLink>

            {/* Desktop Navigation Tabs (Hidden on mobile < md) */}
            <nav className="hidden md:flex items-center rounded-2xl bg-green-100/70 border border-green-200 p-1 shadow-inner gap-1">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-white/80'
                  }`
                }
              >
                <Store className="h-3.5 w-3.5" />
                <span>Vending Hub</span>
              </NavLink>

              <NavLink
                to="/voice-changer"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-white/80'
                  }`
                }
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Voice Changer</span>
              </NavLink>

              <NavLink
                to="/file-transfer"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-white/80'
                  }`
                }
              >
                <FolderSync className="h-3.5 w-3.5" />
                <span>Storage &amp; File</span>
                <span className="rounded-md bg-emerald-200/90 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-900 border border-emerald-300">
                  LOKAL
                </span>
              </NavLink>

              <NavLink
                to="/ai-transcriber"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${isActive
                    ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
                    : 'text-amber-950 hover:text-amber-900 hover:bg-white/80'
                  }`
                }
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>AI Notulensi</span>
                <span className="rounded-md bg-amber-200 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-950 border border-amber-300">
                  PRO
                </span>
              </NavLink>
            </nav>

            {/* Bagian Kanan: Dompet Koin Vending & Status Lisensi */}
            <div className="flex items-center gap-2">
              {/* Dompet Koin Vending */}
              <button
                type="button"
                onClick={() =>
                  openPaymentModal({
                    type: 'tokens',
                    title: 'Isi Ulang 10 Koin Vending',
                    price: 15000,
                    tokensCount: 10,
                  })
                }
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50/90 px-2.5 py-1 text-xs font-bold text-amber-950 hover:bg-amber-100 hover:border-amber-400 transition-all cursor-pointer shadow-2xs active:scale-95"
                title="Klik untuk Isi Ulang Koin Vending via QRIS"
              >
                <Coins className="h-3.5 w-3.5 text-amber-600" />
                <span>{tokens} Koin</span>
                <Plus className="h-3 w-3 text-amber-800 bg-amber-200 rounded-full" />
              </button>

              {/* Status Lisensi Akun */}
              <div className="hidden sm:block">
                {user.isPro ? (
                  <Badge variant="amber" icon={<Crown className="h-3 w-3" />}>
                    PRO Active
                  </Badge>
                ) : (
                  <Badge
                    variant="neutral"
                    icon={<User className="h-3 w-3 text-slate-500" />}
                  >
                    Tamu
                  </Badge>
                )}
              </div>

              {/* Status Jaringan Wi-Fi Bebas Kuota (Desktop Layar Lebar) */}
              <div className="hidden xl:flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/90 px-2.5 py-1 text-xs text-emerald-800 shadow-2xs">
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-mono text-[11px] font-semibold">Wi-Fi Lokal</span>
              </div>

              {/* Mobile Hamburger Button */}
              <div className="flex items-center md:hidden">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  aria-label="Buka Menu Navigasi"
                  className="flex items-center justify-center h-9 w-9 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 active:scale-95 transition-all cursor-pointer shadow-2xs"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Komponen Drawer Khusus Mobile */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  )
}
