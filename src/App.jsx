import { useState } from 'react'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { VoiceChangerPage } from '@/pages/VoiceChangerPage'
import { FileTransferPage } from '@/pages/FileTransferPage'
import { useAudioEngine } from '@/features/voice-changer/hooks/useAudioEngine'

export function App() {
  const [activeTab, setActiveTab] = useState('voice-changer')

  const {
    isActive,
    isMuted,
    toggleMic,
    setMuted,
  } = useAudioEngine()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notifikasi Global */}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="dark"
      />

      {/* Header Utama dengan Kontrol Cepat Mikrofon */}
      <Header
        isActive={isActive}
        isMuted={isMuted}
        onToggleMic={toggleMic}
        onToggleMute={() => setMuted(!isMuted)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Konten Halaman Aktif */}
      <div className="flex-1">
        {activeTab === 'voice-changer' ? (
          <VoiceChangerPage />
        ) : (
          <FileTransferPage
            onBackToVoiceChanger={() => setActiveTab('voice-changer')}
          />
        )}
      </div>
    </div>
  )
}

export default App
