import { useState } from 'react'
import {
  FolderOpen,
  Download,
  Trash2,
  Search,
  RefreshCw,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
  HardDrive,
} from 'lucide-react'
import { toast } from 'sonner'
import { formatBytes } from '../utils/formatBytes'
import { detectFileType } from '../utils/fileChunker'
import { deleteStoredFile } from '../services/localStorageApi'

/**
 * Komponen Daftar Berkas yang Tersimpan di Storage Laptop (Fresh Green Light Mode)
 * Tampilan rapi dan responsif di layar ponsel maupun desktop
 */
export function StoredFilesCard({
  files = [],
  isLoading = false,
  onRefresh = () => {},
}) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleDelete = async (fileName) => {
    if (confirm(`Hapus berkas "${fileName}" dari storage laptop?`)) {
      const ok = await deleteStoredFile(fileName)
      if (ok) {
        toast.success(`Berkas "${fileName}" berhasil dihapus`)
        onRefresh()
      } else {
        toast.error('Gagal menghapus berkas')
      }
    }
  }

  const renderFileIcon = (fileName) => {
    const type = detectFileType('', fileName)
    switch (type) {
      case 'image':
        return <FileImage className="h-5 w-5 text-emerald-600" />
      case 'video':
        return <FileVideo className="h-5 w-5 text-teal-600" />
      case 'audio':
        return <FileAudio className="h-5 w-5 text-amber-600" />
      case 'archive':
        return <FileArchive className="h-5 w-5 text-rose-600" />
      case 'code':
        return <FileCode className="h-5 w-5 text-cyan-600" />
      case 'document':
        return <FileText className="h-5 w-5 text-blue-600" />
      default:
        return <File className="h-5 w-5 text-slate-500" />
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ''
    const d = new Date(timestamp)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="rounded-3xl border border-emerald-200 bg-surface p-4 sm:p-6 shadow-sm space-y-4">
      {/* Header & Kotak Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200">
            <HardDrive className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-text-primary tracking-wide">
              Berkas Tersimpan di Laptop ({files.length})
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Dapat diunduh langsung oleh siapa saja di Wi-Fi ini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Input Filter Pencarian */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-emerald-200 bg-emerald-50/50 pl-8 pr-3 py-1.5 text-xs text-text-primary placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 focus:bg-surface transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/80 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Muat ulang daftar file"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Daftar Berkas */}
      {files.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/40 p-8 text-center space-y-2">
          <FolderOpen className="h-10 w-10 text-emerald-500/80 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">Storage Laptop Masih Kosong</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tarik file ke kotak di atas atau kirim dari HP untuk menyimpan berkas di laptop ini.
          </p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500">
          Tidak ada berkas yang cocok dengan pencarian &quot;{searchQuery}&quot;
        </div>
      ) : (
        <div className="divide-y divide-emerald-100">
          {filteredFiles.map((file) => (
            <div
              key={file.name}
              className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0 hover:bg-emerald-50/50 px-2 sm:px-2.5 rounded-xl transition-colors gap-2"
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200/80">
                  {renderFileIcon(file.name)}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate" title={file.name}>
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-slate-500 mt-0.5 whitespace-nowrap overflow-hidden">
                    <span className="font-semibold text-emerald-800 shrink-0 whitespace-nowrap">
                      {formatBytes(file.size)}
                    </span>
                    <span className="text-slate-300 shrink-0">•</span>
                    <span className="truncate text-slate-500 whitespace-nowrap">
                      {formatDate(file.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Unduh & Hapus */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <a
                  href={file.url}
                  download={file.name}
                  className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer active:scale-95"
                  title={`Unduh ${file.name}`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh</span>
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(file.name)}
                  className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Hapus berkas dari storage laptop"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
