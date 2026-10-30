import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
  Download,
  Trash2,
  CheckCircle2,
  XCircle,
  History,
} from 'lucide-react'
import { formatBytes } from '../utils/formatBytes'

/**
 * Komponen Riwayat Pengiriman & Penerimaan Berkas
 */
export function TransferHistory({
  history = [],
  onClearHistory = () => {},
}) {
  if (history.length === 0) return null

  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'image':
        return <FileImage className="h-4 w-4 text-emerald-400" />
      case 'video':
        return <FileVideo className="h-4 w-4 text-purple-400" />
      case 'audio':
        return <FileAudio className="h-4 w-4 text-amber-400" />
      case 'archive':
        return <FileArchive className="h-4 w-4 text-rose-400" />
      case 'code':
        return <FileCode className="h-4 w-4 text-cyan-400" />
      case 'document':
        return <FileText className="h-4 w-4 text-blue-400" />
      default:
        return <File className="h-4 w-4 text-slate-400" />
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const d = new Date(timestamp)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200">
            Riwayat Transfer ({history.length})
          </h3>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-800/60 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700/80 hover:text-rose-400 transition-all cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Bersihkan</span>
        </button>
      </div>

      <div className="divide-y divide-slate-800/60">
        {history.map((item) => {
          const isSuccess = item.status === 'completed'
          const isReceived = item.direction === 'receiving'

          return (
            <div
              key={item.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-slate-800">
                  {renderCategoryIcon(item.category)}
                </div>

                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                    {item.fileName}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                    <span>{formatBytes(item.fileSize)}</span>
                    <span>•</span>
                    <span>{isReceived ? `Dari: ${item.peerName}` : `Ke: ${item.peerName}`}</span>
                    <span>•</span>
                    <span>{formatTime(item.finishedAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isSuccess ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Sukses</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400">
                    <XCircle className="h-3 w-3 text-rose-400" />
                    <span>Dibatalkan</span>
                  </span>
                )}

                {item.blobUrl && (
                  <a
                    href={item.blobUrl}
                    download={item.fileName}
                    className="inline-flex items-center gap-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-2.5 py-1 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/40 transition-all cursor-pointer"
                    title="Unduh kembali"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Unduh</span>
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

