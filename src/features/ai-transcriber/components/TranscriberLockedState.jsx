import { Lock, Sparkles, QrCode, Ticket, ShieldCheck, Check } from 'lucide-react'
import { Button, Badge, Card } from '@/components'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Layar Terkunci untuk Slot Aplikasi Pro "Local AI Meeting Transcriber"
 * Menampilkan gerbang pembayaran QRIS atau penukaran voucher platform jika akun belum Pro
 */
export function TranscriberLockedState({ onPreviewDemo = () => {} }) {
  const openPaymentModal = useAuthStore((state) => state.openPaymentModal)

  return (
    <div className="mx-auto max-w-4xl space-y-6 pt-4">
      {/* Banner Utama Terkunci */}
      <Card className="relative overflow-hidden border-2 border-amber-300/80 bg-surface p-6 sm:p-8 shadow-sm">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-amber-100/70 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center text-center space-y-4 max-w-2xl mx-auto">
          {/* Badge & Icon Lock */}
          <div className="flex items-center gap-2">
            <Badge variant="amber" size="md">
              <Lock className="h-3 w-3 mr-1 inline" />
              Slot Aplikasi PRO Terkunci
            </Badge>
            <Badge variant="emerald" size="md">
              100% Offline On-Device AI
            </Badge>
          </div>

          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-300 flex items-center justify-center text-amber-600 shadow-inner">
            <Sparkles className="h-8 w-8" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Local AI Meeting Transcriber
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ubah rekaman percakapan Google Meet / Zoom menjadi <strong>notulensi rapat terstruktur</strong>, <strong>poin kesimpulan</strong>, dan <strong>daftar tugas (action items)</strong> secara otomatis di laptop Anda sendiri tanpa kuota internet dan tanpa kirim ke cloud.
            </p>
          </div>

          {/* Nilai Plus Keamanan & Privasi */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5 text-xs text-emerald-950 flex items-center gap-2.5 text-left">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <p className="leading-relaxed text-[11px]">
              <strong>Kerahasiaan Dokumen 100% Terjamin:</strong> Model AI Whisper berjalan langsung pada CPU/GPU laptop Anda. Tidak ada satu pun rekaman suara atau dokumen rapat yang dikirim ke server luar.
            </p>
          </div>

          {/* Fitur Kunci */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left text-xs pt-2">
            <div className="p-3 rounded-xl bg-page border border-slate-200 flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Transkripsi otomatis multibahasa (Indonesia &amp; Inggris)</span>
            </div>
            <div className="p-3 rounded-xl bg-page border border-slate-200 flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Ringkasan eksekutif &amp; pemisahan pembicara (*speaker*)</span>
            </div>
            <div className="p-3 rounded-xl bg-page border border-slate-200 flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Tabel Action Items lengkap dengan PIC dan deadline</span>
            </div>
            <div className="p-3 rounded-xl bg-page border border-slate-200 flex items-start gap-2">
              <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Ekspor dokumen instan ke format Markdown &amp; Teks</span>
            </div>
          </div>

          {/* Tombol Aksi Pembukaan Slot */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
            <Button
              variant="amber"
              size="lg"
              icon={<QrCode className="h-4 w-4" />}
              onClick={() =>
                openPaymentModal({
                  type: 'pro',
                  title: 'Aktivasi Lisensi PRO LocalHub',
                  price: 49000,
                  tokensCount: 20,
                })
              }
              className="w-full sm:w-auto font-black shadow-md shadow-amber-500/20"
            >
              Beli Lisensi PRO via QRIS (Rp 49.000)
            </Button>

            <Button
              variant="secondary"
              size="lg"
              icon={<Ticket className="h-4 w-4 text-indigo-600" />}
              onClick={() =>
                openPaymentModal({
                  type: 'pro',
                  title: 'Klaim Voucher Platform Mitra',
                  price: 49000,
                  tokensCount: 20,
                })
              }
              className="w-full sm:w-auto font-bold border-indigo-200 hover:bg-indigo-50"
            >
              🎟️ Masukkan Voucher Platform (misal: JCPRO)
            </Button>
          </div>

          {/* Opsi Pratinjau Demo Coba-Coba */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onPreviewDemo}
              className="text-xs text-slate-500 hover:text-indigo-600 underline font-medium cursor-pointer transition-colors"
            >
              Ingin lihat contoh hasil transkripsi AI? Klik di sini untuk Pratinjau Demo
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

