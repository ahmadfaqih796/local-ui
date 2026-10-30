import {
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  FileCode,
  File,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Download,
  Clock,
  Zap,
} from 'lucide-react'
import { formatBytes, formatSpeed, formatETA } from '../utils/formatBytes'

/**
 * Komponen Antrean Proses Pengiriman & Penerimaan Berkas Real-time
 */
export function TransferQueueCard({
  transfers = [],
  onCancel = () => {},
}) {
  if (transfers.length === 0) return null

  const renderCategoryIcon = (category) => {
    switch (category) {
      case 'image':
        return <FileImage className="h-5 w-5 text-emerald-400" />
      case 'video':
        return <FileVideo className="h-5 w-5 text-purple-400" />
      case 'audio':
        return <FileAudio className="h-5 w-5 text-amber-400" />
      case 'archive':
        return <FileArchive className="h-5 w-5 text-rose-400" />
      case 'code':
        return <FileCode className="h-5 w-5 text-cyan-400" />
      case 'document':
        return <FileText className="h-5 w-5 text-blue-400" />
      default:
        return <File className="h-5 w-5 text-slate-400" />
    }
  }

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <Zap className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200">
            Transfer Aktif ({transfers.length})
          </h3>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20">
          Kecepatan Tinggi P2P
        </span>
      </div>

      <div className="space-y-3">
        {transfers.map((item) => {
          const isSending = item.direction === 'sending'
          const isComplete = item.status === 'completed'

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-800">
                    {renderCategoryIcon(item.category)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                      {item.fileName}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-400 font-mono">
                        {formatBytes(item.fileSize)}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold border ${
                          isSending
                            ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                            : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                        }`}
                      >
                        {isSending ? (
                          <>
                            <ArrowUpRight className="h-3 w-3" />
                            <span>Kirim ke {item.peerName}</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownLeft className="h-3 w-3" />
                            <span>Terima dari {item.peerName}</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isComplete && item.blobUrl ? (
                    <a
                      href={item.blobUrl}
                      download={item.fileName}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-500 transition-all cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Simpan</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onCancel(item.id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Batalkan transfer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Bar & Statistik Kecepatan */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>
                    {formatBytes(item.transferredBytes || 0)} / {formatBytes(item.fileSize)}
                  </span>
                  <div className="flex items-center gap-3">
                    {item.speed > 0 && (
                      <span className="text-indigo-400 font-semibold">
                        {formatSpeed(item.speed)}
                      </span>
                    )}
                    {item.eta > 0 && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="h-3 w-3" />
                        {formatETA(item.eta)}
                      </span>
                    )}
                    <span className="font-bold text-white">
                      {item.progress || 0}%
                    </span>
                  </div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      isComplete
                        ? 'bg-emerald-500'
                        : isSending
                        ? 'bg-linear-to-r from-indigo-500 to-indigo-400'
                        : 'bg-linear-to-r from-cyan-500 to-emerald-400'
                    }`}
                    style={{ width: `${item.progress || 0}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
