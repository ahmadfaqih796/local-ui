import {
  CreditCard,
  UserCheck,
  ShieldCheck,
  QrCode,
  Key,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Modal } from '@/components/Modal'

/**
 * Modal Pratinjau Desain Jalur Otentikasi & Payment (Permintaan Pak Paul)
 * Menggunakan komponen reusable Modal dengan Sticky Header & Sticky Footer
 */
export function AuthPaymentPreviewModal({ isOpen, onClose = () => {} }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
      badge={
        <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          <Sparkles className="h-3 w-3" />
          <span>Rancangan Blueprint Vending Machine</span>
        </div>
      }
      title="Jalur Otentikasi & Sistem Pembayaran"
      subtitle="Arsitektur wadah aplikasi untuk monetisasi dan lisensi pengguna"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 text-center sm:text-left">
            Arsitektur modul ini siap dihubungkan ke API backend / payment gateway pilihan Pak Paul.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95"
          >
            <span>Tutup &amp; Siap Diuji</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      }
    >
      {/* Konsep Ringkas Pak Paul */}
      <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-4 space-y-2">
        <p className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
          <Layers className="h-4 w-4 text-emerald-700" />
          <span>Konsep Vending Machine Wadah Aplikasi:</span>
        </p>
        <p className="text-xs text-emerald-900 leading-relaxed">
          &quot;Aplikasi diibaratkan seperti softdrink/snack di vending machine. Wadahnya menyediakan jalur siap pakai untuk otentikasi pengguna dan pembayaran fitur premium tanpa mengubah kode inti aplikasi yang sudah ada.&quot;
        </p>
      </div>

      {/* 2 Jalur Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Jalur 1: Otentikasi Pengguna */}
        <div className="rounded-2xl border border-slate-200/90 bg-page p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
            <UserCheck className="h-4 w-4 text-blue-600" />
            <span>1. Jalur Otentikasi Pengguna</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="rounded-xl bg-surface border border-slate-200 p-2.5 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <Key className="h-3 w-3 text-emerald-600" />
                <span>Mode Tamu (Guest / Free Tier)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Langsung pakai tanpa login untuk fitur utilitas gratis (Voice Changer &amp; Wi-Fi Storage).
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-slate-200 p-2.5 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-blue-600" />
                <span>Hardware Machine ID (Offline)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Lisensi diikat ke sidik jari laptop (Motherboard/CPU ID), tetap aktif meski di atas gunung tanpa internet.
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-slate-200 p-2.5 space-y-1">
              <p className="font-bold text-slate-800">
                <span>Cloud SSO (Google / Email)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Sinkronisasi profil &amp; riwayat antar perangkat saat terhubung ke jaringan internet.
              </p>
            </div>
          </div>
        </div>

        {/* Jalur 2: Sistem Pembayaran (Payment Rails) */}
        <div className="rounded-2xl border border-slate-200/90 bg-page p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
            <CreditCard className="h-4 w-4 text-emerald-600" />
            <span>2. Jalur Pembayaran &amp; Lisensi</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="rounded-xl bg-surface border border-slate-200 p-2.5 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <QrCode className="h-3 w-3 text-emerald-600" />
                <span>QRIS Otomatis Real-Time</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Pembayaran instan via GoPay, ShopeePay, BCA, Livin Mandiri untuk beli lisensi sekali bayar.
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-slate-200 p-2.5 space-y-1">
              <p className="font-bold text-slate-800">
                <span>Sistem Koin Vending (Pay-per-Use)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Beli saldo koin token (misal Rp 10.000 untuk 10x transkrip rapat AI otomatis).
              </p>
            </div>

            <div className="rounded-xl bg-surface border border-slate-200 p-2.5 space-y-1">
              <p className="font-bold text-slate-800">
                <span>Langganan Pro (Monthly / Lifetime)</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Akses tak terbatas untuk semua aplikasi baru yang dimasukkan ke wadah vending machine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
