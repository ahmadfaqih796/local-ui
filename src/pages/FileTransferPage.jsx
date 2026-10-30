import { useState, useEffect } from 'react'
import {
  Wifi,
  HardDrive,
  Zap,
  Mountain,
} from 'lucide-react'
import { StorageBanner } from '@/features/file-transfer/components/StorageBanner'
import { UploadDropzone } from '@/features/file-transfer/components/UploadDropzone'
import { StoredFilesCard } from '@/features/file-transfer/components/StoredFilesCard'
import {
  getNetworkInfo,
  getStoredFiles,
  subscribeToFileChanges,
} from '@/features/file-transfer/services/localStorageApi'

/**
 * Halaman Utama: Pusat Penyimpanan Berkas Wi-Fi Lokal (Fresh Green Theme)
 * Laptop ini bertindak sebagai storage drive tanpa memerlukan kuota internet.
 */
export function FileTransferPage() {
  const [networkInfo, setNetworkInfo] = useState({
    ip: '127.0.0.1',
    port: 5173,
    url: 'http://localhost:5173',
  })
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const refreshFiles = async () => {
    setIsLoading(true)
    try {
      const fileList = await getStoredFiles()
      setFiles(fileList)
    } finally {
      setIsLoading(false)
    }
  }

  // Muat data saat halaman dibuka secara aman
  useEffect(() => {
    let isMounted = true
    let debounceTimer = null

    const safeRefresh = () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => {
        getStoredFiles().then((fileList) => {
          if (isMounted) setFiles(fileList)
        })
      }, 200)
    }

    Promise.all([getNetworkInfo(), getStoredFiles()]).then(([net, fileList]) => {
      if (!isMounted) return
      if (net) setNetworkInfo(net)
      setFiles(fileList)
    })

    // Sambungkan ke Server-Sent Events (SSE) murni event-driven (NO POLLING!)
    const unsubscribe = subscribeToFileChanges(() => {
      safeRefresh()
    })

    return () => {
      isMounted = false
      if (debounceTimer) clearTimeout(debounceTimer)
      unsubscribe()
    }
  }, [])

  return (
    <div className="min-h-screen pb-16">
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* 1. Banner Alamat Wi-Fi & QR Code Kamera HP */}
        <StorageBanner networkInfo={networkInfo} />

        {/* 2. Area Drag & Drop Berkas ke Storage Laptop */}
        <UploadDropzone onUploadSuccess={refreshFiles} />

        {/* 3. Daftar Berkas yang Tersimpan di Hard Drive Laptop */}
        <StoredFilesCard
          files={files}
          isLoading={isLoading}
          onRefresh={refreshFiles}
        />

        {/* 4. Pilar Keunggulan Penyimpanan Wi-Fi Lokal & Hotspot Mandiri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200">
              <Wifi className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">100% Bebas Kuota Internet</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Walaupun kuota internet Wi-Fi habis atau tanpa paket data, transfer tetap berjalan lancar karena murni jaringan lokal.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 border border-teal-200">
              <HardDrive className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Laptop Sebagai Storage</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Berkas yang diunggah dari HP langsung tersimpan fisik di hard drive laptop ini dan tidak hilang saat halaman di-refresh.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-100 text-green-700 border border-green-200">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Kecepatan Maksimal</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tidak ada limit ukuran file (bisa gigabyte-an) dengan kecepatan penuh jaringan lokal tanpa batasan cloud.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200 bg-white p-4 space-y-2 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-100 text-lime-800 border border-lime-200">
              <Mountain className="h-4 w-4" />
            </div>
            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Bisa di Gunung & Outdoor</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Tanpa perlu router atau modem. Cukup nyalakan Mobile Hotspot laptop atau HP, transfer langsung jalan.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
