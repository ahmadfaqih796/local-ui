import { Store, Zap, ShieldCheck, Wifi, Sparkles, CreditCard } from 'lucide-react'
import { Card, Badge, Button } from '@/components'

/**
 * Banner Hero Konsep Vending Machine Hub
 * Memperkenalkan LocalHub sebagai wadah cerdas untuk aplikasi-aplikasi utilitas lokal
 * Menggunakan komponen reusable Card, Badge, dan Button
 */
export function VendingHero({ onOpenAuthPayment = () => {} }) {
  return (
    <Card padding="lg" className="border-emerald-200/90 shadow-sm">
      {/* Latar Belakang Gradien Halus */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-linear-to-br from-emerald-400/10 via-teal-300/10 to-transparent blur-2xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-linear-to-tr from-blue-400/10 via-emerald-300/10 to-transparent blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <Badge
            variant="emerald"
            size="md"
            icon={<Store className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />}
          >
            Vending Machine App Hub • Wadah Aplikasi Lokal
          </Badge>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
            Wadah Aplikasi Utilitas <span className="text-emerald-700">Offline-First</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ibarat mengambil softdrink dari vending machine, seluruh aplikasi utilitas yang dibuat tersimpan rapi dalam satu wadah mandiri. Cepat, bekerja di jaringan lokal, dan tidak memerlukan kuota internet.
          </p>

          {/* Indikator Status Mesin */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200/80 px-3 py-1.5 text-slate-700 font-medium">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              <span>Dispenser Siap Pakai</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200/80 px-3 py-1.5 text-slate-700 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Privasi 100% di Laptop</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 border border-slate-200/80 px-3 py-1.5 text-slate-700 font-medium">
              <Wifi className="h-3.5 w-3.5 text-blue-500" />
              <span>Bisa di Gunung (Hotspot)</span>
            </div>
          </div>
        </div>

        {/* Kotak Info Jalur Pembayaran & Otentikasi (Permintaan Pak Paul) */}
        <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
          <div className="rounded-2xl border border-emerald-200 bg-page p-4 text-center sm:text-left lg:text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>Arsitektur Siap Bisnis</span>
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Jalur integrasi akun otentikasi pengguna dan sistem payment gateway siap dihubungkan.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={<CreditCard className="h-3.5 w-3.5" />}
              onClick={onOpenAuthPayment}
              className="w-full"
            >
              Lihat Jalur Otentikasi &amp; Payment
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
