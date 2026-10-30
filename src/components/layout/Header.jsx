import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Radio, Mic, FolderSync, Wifi, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react'

/**
 * Header Bersih & Segar (Fresh Green Light Theme - Mode Terang)
 * Dilengkapi Navigasi Responsive Desktop & Mobile Sidebar Drawer
 */
export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Kunci scroll body saat drawer terbuka di layar mobile
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDrawerOpen])

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-green-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Logo & Identitas Aplikasi */}
            <NavLink to="/file-transfer" className="flex items-center gap-2.5 shrink-0">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20">
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
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
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
                  `flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    isActive
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

      {/* Mobile Sidebar Drawer & Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
          {/* Backdrop Blur Overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Slide-in Panel (From Right) */}
          <aside className="fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white border-l border-emerald-200 p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between border-b border-emerald-100 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-sm">
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
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Tutup Menu"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-800 active:scale-95 transition-all cursor-pointer shadow-xs"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Section Navigasi */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 px-1 mb-2">
                  Fitur Utama
                </p>

                {/* NavLink 1: Pengubah Suara Mic */}
                <NavLink
                  to="/voice-changer"
                  onClick={() => setIsDrawerOpen(false)}
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
                  onClick={() => setIsDrawerOpen(false)}
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
      )}
    </>
  )
}
