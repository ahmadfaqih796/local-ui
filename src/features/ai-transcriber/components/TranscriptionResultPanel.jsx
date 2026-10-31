import { useState } from 'react'
import {
  FileText,
  CheckCircle2,
  ListTodo,
  Clock,
  Users,
  Copy,
  Download,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react'
import { Button, Badge } from '@/components'
import { toast } from 'sonner'

/**
 * Panel Tampilan Hasil Notulensi AI Rapat Terstruktur
 */
export function TranscriptionResultPanel({
  resultData = null,
  onReset = () => {},
}) {
  const [activeTab, setActiveTab] = useState('summary') // 'summary' | 'actions' | 'transcript'
  const [copied, setCopied] = useState(false)

  if (!resultData) return null

  // Format teks lengkap untuk disalin ke clipboard / didownload
  const generateMarkdownText = () => {
    return `# 📝 NOTULENSI RAPAT: ${resultData.title}
**Tanggal:** ${resultData.date}  
**Durasi:** ${resultData.duration}  
**Peserta:** ${resultData.speakers?.join(', ')}  
**Engine:** Local AI Whisper On-Device (100% Offline Privasi Terjaga)

---

## 📌 Ringkasan Eksekutif
${resultData.summary}

---

## 🎯 Keputusan Kunci
${resultData.keyDecisions?.map((kd, i) => `${i + 1}. ${kd}`).join('\n')}

---

## 📋 Action Items (Tugas & Penanggung Jawab)
${resultData.actionItems?.map((a) => `- [${a.status === 'completed' ? 'x' : ' '}] **${a.task}** (PIC: ${a.pic} | Deadline: ${a.deadline})`).join('\n')}

---

## 💬 Transkrip Percakapan
${resultData.transcriptSegments?.map((s) => `[${s.time}] **${s.speaker}:** "${s.text}"`).join('\n\n')}
`
  }

  // Handle Salin ke Clipboard
  const handleCopy = () => {
    const text = generateMarkdownText()
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      toast.success('Notulensi Berhasil Disalin!', {
        description: 'Teks notulensi siap ditempel ke WhatsApp, Email, atau Google Docs.',
      })
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Handle Unduh File Markdown
  const handleDownloadMarkdown = () => {
    const text = generateMarkdownText()
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Notulensi_${resultData.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast.success('Berkas Notulensi Diunduh!', {
      description: 'Dokumen tersimpan sebagai format Markdown (.md) di laptop Anda.',
    })
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-surface p-5 sm:p-7 shadow-sm space-y-6">
      {/* Header Hasil & Aksi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="emerald" size="sm">
              <CheckCircle2 className="h-3 w-3 mr-1 inline" />
              Notulensi Selesai Dibuat
            </Badge>
            <span className="text-[11px] font-mono text-slate-500">
              Durasi: {resultData.duration}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            {resultData.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {resultData.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-slate-400" />
              {resultData.speakers?.join(', ')}
            </span>
          </div>
        </div>

        {/* Tombol Ekspor & Salin */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            icon={copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            onClick={handleCopy}
            className="font-bold text-xs"
          >
            {copied ? 'Tersalin!' : 'Salin Teks'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Download className="h-3.5 w-3.5" />}
            onClick={handleDownloadMarkdown}
            className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shadow-emerald-600/20"
          >
            Unduh .MD
          </Button>

          <button
            type="button"
            onClick={onReset}
            className="p-2 rounded-xl border border-slate-200 bg-page hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Transkripsikan audio lain"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Switcher: Ringkasan vs Action Items vs Transkrip */}
      <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-surface text-amber-800 shadow-xs border border-amber-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>Ringkasan &amp; Keputusan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('actions')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'actions'
              ? 'bg-surface text-emerald-800 shadow-xs border border-emerald-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTodo className="h-3.5 w-3.5 text-emerald-600" />
          <span>Action Items ({resultData.actionItems?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transcript')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'transcript'
              ? 'bg-surface text-indigo-800 shadow-xs border border-indigo-200'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-indigo-600" />
          <span>Transkrip Lengkap</span>
        </button>
      </div>

      {/* ISI TAB 1: RINGKASAN & KEPUTUSAN */}
      {activeTab === 'summary' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Ringkasan Eksekutif */}
          <div className="rounded-2xl border border-slate-200 bg-page p-4 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Ringkasan Eksekutif:
            </span>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">
              {resultData.summary}
            </p>
          </div>

          {/* Keputusan Kunci */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600" />
              <span>Poin Keputusan Kunci:</span>
            </span>
            <ul className="space-y-2 text-xs text-slate-800">
              {resultData.keyDecisions?.map((kd, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{kd}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ISI TAB 2: ACTION ITEMS (DAFTAR TUGAS) */}
      {activeTab === 'actions' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Daftar Tindakan Lanjutan (Action Items):
          </span>
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Tugas Tindakan</th>
                  <th className="p-3">PIC (Penanggung Jawab)</th>
                  <th className="p-3">Batas Waktu</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-surface">
                {resultData.actionItems?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-slate-800">{item.task}</td>
                    <td className="p-3 font-mono text-slate-600">{item.pic}</td>
                    <td className="p-3 text-slate-500">{item.deadline}</td>
                    <td className="p-3">
                      {item.status === 'completed' ? (
                        <Badge variant="emerald" size="sm">
                          Selesai
                        </Badge>
                      ) : (
                        <Badge variant="amber" size="sm">
                          Dalam Proses
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ISI TAB 3: TRANSKRIP LENGKAP BERSAMA PEMBICARA */}
      {activeTab === 'transcript' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Transkrip Percakapan Rapat (Speaker Diarization):
          </span>
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-page p-4 max-h-[350px] overflow-y-auto">
            {resultData.transcriptSegments?.map((seg, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-surface border border-slate-200 space-y-1 shadow-xs"
              >
                <div className="flex items-center justify-between text-[11px] border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-900">{seg.speaker}</span>
                  <span className="font-mono text-slate-400 text-[10px]">{seg.time}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans pt-0.5">
                  &quot;{seg.text}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
