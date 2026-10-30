import { useState, useRef } from 'react'
import { UploadCloud, FileUp, AlertCircle, Laptop, Smartphone } from 'lucide-react'

/**
 * Komponen Area Drag & Drop Berkas
 * Mendukung pemilihan banyak file sekaligus dengan drag-and-drop atau klik telusuri
 */
export function FileDropzone({
  activePeer = null,
  onFilesSelected = () => {},
  disabled = false,
}) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files || [])
    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles)
    }
  }

  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length > 0) {
      onFilesSelected(selectedFiles)
    }
    // Reset nilai input agar bisa memilih file yang sama berulang kali
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleTriggerBrowse = () => {
    if (fileInputRef.current && !disabled) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleTriggerBrowse}
        className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-indigo-400 bg-indigo-950/40 scale-[1.01] shadow-2xl shadow-indigo-500/20'
            : disabled
            ? 'border-slate-800 bg-slate-900/30 opacity-70 cursor-not-allowed'
            : 'border-slate-700/80 bg-slate-900/50 hover:border-indigo-500/80 hover:bg-slate-900/80 hover:shadow-xl'
        }`}
      >
        {/* Latar Belakang Efek Cahaya Halus */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-all" />

        <div className="relative flex flex-col items-center justify-center space-y-4">
          {/* Ikon Utama Interaktif */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
              isDragging
                ? 'bg-indigo-500 text-white border-indigo-400 scale-110 rotate-3'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:scale-105 group-hover:bg-indigo-500/20'
            }`}
          >
            <UploadCloud className="h-8 w-8 transition-transform group-hover:-translate-y-0.5" />
          </div>

          {/* Teks Petunjuk */}
          <div className="space-y-1.5 max-w-md">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Tarik &amp; Letakkan Berkas di Sini
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              atau klik untuk telusuri berkas dari komputer (Video, Gambar, Dokumen, Arsip ZIP, APK, dll).
            </p>
          </div>

          {/* Status Sasaran Perangkat Tujuan */}
          <div className="pt-2">
            {activePeer ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 shadow-sm">
                {activePeer.type === 'phone' ? (
                  <Smartphone className="h-3.5 w-3.5" />
                ) : (
                  <Laptop className="h-3.5 w-3.5" />
                )}
                <span>Siap kirim ke: <strong>{activePeer.name}</strong></span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300 shadow-sm">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>Belum ada perangkat tujuan yang dipilih</span>
              </div>
            )}
          </div>

          {/* Tombol Aksi Tambahan */}
          <div className="pt-1">
            <button
              type="button"
              disabled={disabled}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FileUp className="h-4 w-4" />
              <span>Pilih Berkas untuk Dikirim</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
