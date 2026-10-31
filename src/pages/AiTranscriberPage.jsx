import { useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { TranscriberHero } from '@/features/ai-transcriber/components/TranscriberHero'
import { AudioInputPanel } from '@/features/ai-transcriber/components/AudioInputPanel'
import { ProcessingStatusCard } from '@/features/ai-transcriber/components/ProcessingStatusCard'
import { TranscriptionResultPanel } from '@/features/ai-transcriber/components/TranscriptionResultPanel'
import { TranscriberLockedState } from '@/features/ai-transcriber/components/TranscriberLockedState'
import { SAMPLE_MEETINGS } from '@/features/ai-transcriber/constants/sampleTranscripts'
import { Sparkles, Eye } from 'lucide-react'
import { Button } from '@/components'

/**
 * Halaman Layar Kerja Slot Pro "Local AI Meeting Transcriber"
 * Menyediakan transkripsi audio rapat menjadi notulensi terstruktur secara offline on-device
 */
export function AiTranscriberPage() {
  const isPro = useAuthStore((state) => state.user.isPro)
  const unlockedApps = useAuthStore((state) => state.unlockedApps)
  const openPaymentModal = useAuthStore((state) => state.openPaymentModal)

  const isAppUnlocked = isPro || unlockedApps.includes('ai-transcriber')

  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')
  const [resultData, setResultData] = useState(SAMPLE_MEETINGS[0])

  // Jalankan simulasi transkripsi AI Whisper On-Device
  const handleStartTranscription = (meetingData) => {
    setIsProcessing(true)
    setProgress(15)
    setCurrentStep('Memuat model Whisper On-Device ke memori RAM laptop...')

    setTimeout(() => {
      setProgress(45)
      setCurrentStep('Mendeteksi pola spektrum akustik & pemisahan pembicara (Speaker Diarization)...')
    }, 600)

    setTimeout(() => {
      setProgress(85)
      setCurrentStep('Menyusun ringkasan eksekutif & mengekstrak action items...')
    }, 1200)

    setTimeout(() => {
      setProgress(100)
      setCurrentStep('Notulensi selesai disusun!')
      setResultData(meetingData)
      setIsProcessing(false)
    }, 1800)
  }

  // Tampilkan layar terkunci jika belum Pro dan tidak dalam mode preview
  if (!isAppUnlocked && !isPreviewMode) {
    return (
      <div className="min-h-screen text-slate-800 pb-20 sm:pb-12 px-4 sm:px-6 lg:px-8 pt-6">
        <TranscriberLockedState onPreviewDemo={() => setIsPreviewMode(true)} />
      </div>
    )
  }

  return (
    <div className="min-h-screen text-slate-800 pb-20 sm:pb-12">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner Khusus jika Akun Belum Pro tapi sedang Melihat Mode Pratinjau */}
        {!isAppUnlocked && isPreviewMode && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                <strong>Mode Pratinjau Demo:</strong> Anda sedang melihat contoh hasil transkripsi AI. Untuk mentranskripsikan rekaman audio Anda sendiri, silakan buka Lisensi PRO.
              </span>
            </div>

            <Button
              variant="amber"
              size="sm"
              icon={<Sparkles className="h-3.5 w-3.5" />}
              onClick={() =>
                openPaymentModal({
                  type: 'pro',
                  title: 'Aktivasi Lisensi PRO LocalHub',
                  price: 49000,
                  tokensCount: 20,
                })
              }
              className="shrink-0 font-bold"
            >
              Buka Akses PRO
            </Button>
          </div>
        )}

        {/* Banner Utama Workstation */}
        <TranscriberHero />

        {/* Panel Masukan Audio Rapat */}
        <AudioInputPanel
          onStartTranscription={handleStartTranscription}
          isProcessing={isProcessing}
        />

        {/* Kartu Status Pemrosesan AI On-Device */}
        {isProcessing && (
          <ProcessingStatusCard progress={progress} currentStep={currentStep} />
        )}

        {/* Panel Hasil Notulensi Terstruktur */}
        {!isProcessing && resultData && (
          <TranscriptionResultPanel
            resultData={resultData}
            onReset={() => setResultData(null)}
          />
        )}
      </main>
    </div>
  )
}

