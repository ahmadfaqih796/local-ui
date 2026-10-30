import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Radio, Mic, FolderSync, Wifi, Menu } from 'lucide-react'

import { MobileDrawer } from './MobileDrawer'

/**
 * Header Bersih & Segar (Fresh Green Light Theme - Mode Terang)
 * Dilengkapi Navigasi Responsive Desktop & Integrasi Mobile Drawer
 */
export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-green-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo & Identitas Aplikasi */}
            <NavLink to="/file-transfer" className="flex items-center gap-2.5 shrink-0">
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
                  Utilitas Lokal: Voice Changer Meeting &amp; Penyimpanan Wi-Fi Bersama
                </p>
              </div>
            </NavLink>

            {/* Desktop Navigation Tabs (Hidden on mobile < md) */}
            <nav className="hidden md:flex items-center rounded-2xl bg-green-100/70 border border-green-200 p-1 shadow-inner">
              <NavLink
                to="/voice-changer"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-white/80'
                  }`
                }
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Pengubah Suara Mic</span>
              </NavLink>

              <NavLink
                to="/file-transfer"
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                    : 'text-emerald-900 hover:text-emerald-950 hover:bg-white/80'
                  }`
                }
              >
                <FolderSync className="h-3.5 w-3.5" />
                <span>Kirim File (LAN / Wi-Fi)</span>
                <span className="rounded-md bg-emerald-200/90 px-1.5 py-0.2 text-[9px] font-extrabold text-emerald-900 border border-emerald-300">
                  LOKAL
                </span>
              </NavLink>
            </nav>

            {/* Indikator Status Jaringan Wi-Fi Tanpa Kuota (Desktop) */}
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs text-emerald-800 shadow-xs">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Wifi className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-mono text-[11px] font-semibold">Bebas Kuota (Wi-Fi)</span>
              </div>
            </div>

            {/* Mobile Hamburger Button (Visible only on mobile < md) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                aria-label="Buka Menu Navigasi"
                className="flex items-center justify-center h-10 w-10 rounded-xl border border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-950 active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <Menu className="h-5 w-5" />
              </button>
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
