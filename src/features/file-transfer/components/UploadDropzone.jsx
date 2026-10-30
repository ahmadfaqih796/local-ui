import { useState, useRef } from 'react'
import { UploadCloud, FileUp } from 'lucide-react'
import { toast } from 'sonner'
import { uploadFileToLaptop, notifyLocalFileChange } from '../services/localStorageApi'
import { formatBytes } from '../utils/formatBytes'

/**
 * Komponen Unggah Berkas ke Storage Laptop (Fresh Green Light Mode)
 */
export function UploadDropzone({ onUploadSuccess = () => {} }) {
  const [isDragging, setIsDragging] = useState(false)
  const [activeUploads, setActiveUploads] = useState([])
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
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

    const files = Array.from(e.dataTransfer.files || [])
    if (files.length > 0) {
      processFiles(files)
    }
  }

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      processFiles(files)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const processFiles = async (files) => {
    for (const file of files) {
      const uploadId = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

      setActiveUploads((prev) => [
        {
          id: uploadId,
          name: file.name,
          size: file.size,
          progress: 0,
          status: 'uploading',
        },
        ...prev,
      ])

      try {
        await uploadFileToLaptop(file, (percent) => {
          setActiveUploads((prev) =>
            prev.map((item) => (item.id === uploadId ? { ...item, progress: percent } : item))
          )
        })

        setActiveUploads((prev) =>
          prev.map((item) =>
            item.id === uploadId ? { ...item, progress: 100, status: 'success' } : item
          )
        )

        toast.success(`Berhasil disimpan ke laptop: ${file.name}`)
        notifyLocalFileChange()
        onUploadSuccess()

        setTimeout(() => {
          setActiveUploads((prev) => prev.filter((item) => item.id !== uploadId))
        }, 3000)
      } catch (err) {
        console.error('Upload gagal:', err)
        toast.error(`Gagal mengunggah ${file.name}`)
        setActiveUploads((prev) =>
          prev.map((item) => (item.id === uploadId ? { ...item, status: 'error' } : item))
        )
      }
    }
  }

  return (
    <div className="w-full space-y-4">
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
        onClick={() => fileInputRef.current?.click()}
        className={`group relative overflow-hidden rounded-3xl border-2 border-dashed p-5 sm:p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-emerald-500 bg-emerald-100/50 scale-[1.01] shadow-lg shadow-emerald-500/15 ring-2 ring-emerald-400'
            : 'border-emerald-300/80 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 hover:shadow-md'
        }`}
      >
        <div className="relative flex flex-col items-center justify-center space-y-3.5">
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border transition-all duration-300 ${
              isDragging
                ? 'bg-emerald-600 text-white border-emerald-500 scale-110 shadow-md'
                : 'bg-emerald-100 text-emerald-700 border-emerald-200 group-hover:scale-105 group-hover:bg-emerald-200'
            }`}
          >
            <UploadCloud className="h-8 w-8 transition-transform group-hover:-translate-y-0.5" />
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Tarik Berkas ke Sini untuk Disimpan di Laptop
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              atau klik untuk memilih berkas dari perangkat ini (Video, Foto, ZIP, Dokumen).
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 active:scale-95 transition-all cursor-pointer"
          >
            <FileUp className="h-4 w-4" />
            <span>Pilih Berkas untuk Diunggah</span>
          </button>
        </div>
      </div>

      {/* Daftar Upload Aktif */}
      {activeUploads.length > 0 && (
        <div className="rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Mengunggah ke Storage Laptop ({activeUploads.length})</span>
          </div>

          <div className="space-y-2.5">
            {activeUploads.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-700">
                    <span>{formatBytes(item.size)}</span>
                    <span className="font-bold">{item.progress}%</span>
                  </div>
                </div>

                <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-200/60">
                  <div
                    className={`h-full transition-all duration-200 rounded-full ${
                      item.status === 'success'
                        ? 'bg-emerald-600'
                        : item.status === 'error'
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
