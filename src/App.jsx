import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/Header'
import { VoiceChangerPage } from '@/pages/VoiceChangerPage'
import { FileTransferPage } from '@/pages/FileTransferPage'

/**
 * Komponen Utama Aplikasi dengan React Router DOM dan Fresh Green Light Mode (bg-green-50)
 */
export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-green-50/60 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
        {/* Toast Notifikasi Global Mode Terang */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
        />

        {/* Header Bersih Segar Tanpa Tombol Mikrofon di Navbar */}
        <Header />

        {/* Sistem Navigasi Halaman dengan React Router */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<VoiceChangerPage />} />
            <Route path="/voice-changer" element={<VoiceChangerPage />} />
            <Route path="/file-transfer" element={<FileTransferPage />} />
            <Route path="*" element={<Navigate to="/file-transfer" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
