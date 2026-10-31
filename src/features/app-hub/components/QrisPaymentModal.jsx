import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {
  QrCode,
  Zap,
  Timer,
  Sparkles,
  RotateCcw,
  Smartphone,
} from 'lucide-react'
import { Modal, Button, Badge } from '@/components'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Modal Pembayaran QRIS & Simulasi Transaksi Vending Machine
 * Menampilkan kode QRIS dinamis, hitung mundur kedaluwarsa, dan tombol simulator sukses
 */
export function QrisPaymentModal() {
  const isPaymentModalOpen = useAuthStore((state) => state.isPaymentModalOpen)
  const paymentIntent = useAuthStore((state) => state.paymentIntent)
  const closePaymentModal = useAuthStore((state) => state.closePaymentModal)
  const topupTokens = useAuthStore((state) => state.topupTokens)
  const upgradeToPro = useAuthStore((state) => state.upgradeToPro)
  const resetDemo = useAuthStore((state) => state.resetDemo)

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('')
  const [timeLeft, setTimeLeft] = useState(899) // 14:59 detik
  const [isProcessing, setIsProcessing] = useState(false)

  const intent = paymentIntent || {
    type: 'tokens',
    title: 'Top-up 10 Koin Vending',
    price: 15000,
    tokensCount: 10,
  }

  // Generate QR Code dinamis saat modal aktif
  useEffect(() => {
    if (!isPaymentModalOpen) return

    let isMounted = true
    const payload = `00020101021226670016ID.CO.LOCALHUB.WWW011893600914LOCALHUB0215DEV8821-${Date.now()}520458125303360540${intent.price}5802ID5908LOCALHUB6007JAKARTA62070703A016304`

    QRCode.toDataURL(payload, {
      width: 240,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrCodeDataUrl(url)
        }
      })
      .catch((err) => console.error('Gagal generate QRIS:', err))

    return () => {
      isMounted = false
    }
  }, [isPaymentModalOpen, intent.price])

  // Timer hitung mundur 15 menit
  useEffect(() => {
    if (!isPaymentModalOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaymentModalOpen])

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Eksekusi simulasi bayar sukses
  const handleSimulateSuccess = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      if (intent.type === 'pro') {
        upgradeToPro(intent.price)
      } else {
        topupTokens(intent.tokensCount, intent.price)
      }
    }, 800)
  }

  return (
    <Modal
      isOpen={isPaymentModalOpen}
      onClose={closePaymentModal}
      maxWidth="lg"
      icon={<QrCode className="h-5 w-5 text-emerald-600" />}
      badge={
        <Badge variant="emerald" size="sm" pulse dot>
          QRIS Nasional Standar
        </Badge>
      }
      title="Pembayaran QRIS Instan"
      subtitle="Buka kamera e-wallet atau m-banking Anda untuk memindai"
      footer={
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={resetDemo}
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            title="Kembalikan status akun ke Mode Tamu awal (5 koin)"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Demo Akun</span>
          </button>

          {/* Tombol Simulasi Pembayaran (Demo Developer) */}
          <Button
            variant="primary"
            isLoading={isProcessing}
            loadingText="Memverifikasi Transaksi..."
            icon={<Zap className="h-4 w-4 text-amber-300" />}
            onClick={handleSimulateSuccess}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 font-bold"
          >
            ⚡ Simulasikan Bayar Sukses
          </Button>
        </div>
      }
    >
      {/* Rincian Tagihan */}
      <div className="rounded-2xl border border-emerald-200 bg-page p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Produk Vending
          </span>
          <h4 className="text-sm font-bold text-text-primary">{intent.title}</h4>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Total Biaya
          </span>
          <p className="text-base sm:text-lg font-black text-emerald-700 font-mono">
            Rp {Number(intent.price).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Tampilan QRIS & Timer */}
      <div className="flex flex-col items-center justify-center p-4 rounded-3xl border border-emerald-200/80 bg-surface shadow-xs space-y-3">
        {/* Header QRIS */}
        <div className="flex items-center justify-between w-full max-w-[240px] px-2 text-[11px] font-semibold text-slate-500 border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1 text-slate-700 font-bold">
            <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
            <span>Scan QRIS</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-rose-600">
            <Timer className="h-3.5 w-3.5" />
            <span>{formatTimer(timeLeft)}</span>
          </div>
        </div>

        {/* Gambar QR Code */}
        <div className="relative p-2 rounded-2xl border-2 border-slate-200 bg-white shadow-inner">
          {qrCodeDataUrl ? (
            <img
              src={qrCodeDataUrl}
              alt="QRIS Pembayaran LocalHub"
              className="h-48 w-48 sm:h-52 sm:w-52 block"
            />
          ) : (
            <div className="h-48 w-48 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
              Membuat QR...
            </div>
          )}
        </div>

        {/* Metode Pembayaran yang Didukung */}
        <div className="text-center space-y-1">
          <p className="text-[11px] text-slate-500">
            Mendukung semua e-wallet &amp; mobile banking:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-slate-700">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">GoPay</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">OVO</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Dana</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">BCA</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">Mandiri</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">ShopeePay</span>
          </div>
        </div>
      </div>

      {/* Petunjuk Pengujian untuk Pak Paul */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 text-xs text-amber-950 space-y-1.5">
        <p className="font-bold flex items-center gap-1.5 text-amber-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Petunjuk Demo Jalur Pembayaran:</span>
        </p>
        <p className="text-[11px] leading-relaxed text-amber-900/90">
          Untuk keperluan presentasi ke Pak Paul, Anda cukup mengklik tombol hijau <strong>&quot;⚡ Simulasikan Bayar Sukses&quot;</strong> di bawah. Saldo koin akan langsung bertambah dan slot aplikasi Pro akan otomatis terbuka tanpa memotong uang sungguhan!
        </p>
      </div>
    </Modal>
  )
}
