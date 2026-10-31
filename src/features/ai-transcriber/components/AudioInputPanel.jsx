import { useState } from 'react'
import { Upload, Mic, Music, Sparkles } from 'lucide-react'
import { Button } from '@/components'
import { SAMPLE_MEETINGS } from '../constants/sampleTranscripts'
import { toast } from 'sonner'

/**
 * Panel Masukan Audio Rapat untuk AI Transcriber
 * Mendukung Unggah Berkas Audio, Rekam Langsung Mic, dan Sampel Demo Instan
 */
export function AudioInputPanel({
  onStartTranscription = () => {},
  isProcessing = false,
}) {
  const [activeTab, setActiveTab] = useState('sample') // 'sample' | 'upload' | 'record'
  const [selectedSampleId, setSelectedSampleId] = useState('sample-paul-review')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)

  // Handle pilih file lokal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
      toast.info(`Berkas "${file.name}" Dipilih`, {
        description: `Ukuran: ${(file.size / (1024 * 1024)).toFixed(2)} MB • Siap diproses oleh AI on-device.`,
      })
    }
  }

  // Handle simulasi mulai rekam mic rapat
  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false)
      toast.success('Perekaman Rapat Selesai', {
        description: `Terekam ${recordingSeconds} detik audio rapat. Siap ditranskripsikan.`,
      })
    } else {
      setIsRecording(true)
      setRecordingSeconds(0)
      const timer = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            clearInterval(timer)
            setIsRecording(false)
            return 60
          }
          return prev + 1
        })
      }, 1000)
    }
  }

  // Trigger proses transkripsi AI
  const handleExecute = () => {
    if (activeTab === 'upload' && !uploadedFileName) {
      toast.error('Pilih Berkas Audio Terlebih Dahulu', {
        description: 'Silakan unggah rekaman audio rapat (MP3, WAV, atau M4A).',
      })
      return
    }

    const selectedData =
      activeTab === 'sample'
        ? SAMPLE_MEETINGS.find((m) => m.id === selectedSampleId) || SAMPLE_MEETINGS[0]
        : {
            ...SAMPLE_MEETINGS[0],
            title: activeTab === 'upload' ? `Notulensi: ${uploadedFileName}` : 'Notulensi Rapat Langsung (Live Mic)',
            duration: activeTab === 'record' ? `${recordingSeconds} detik` : '03 menit 12 detik',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          }

    onStartTranscription(selectedData)
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-surface p-5 sm:p-6 shadow-sm space-y-5">
      {/* Tab Navigasi Masukan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Pilih Sumber Suara Rapat</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilih rekaman suara yang ingin diubah menjadi teks notulensi otomatis
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-surface text-amber-800 shadow-xs border border-amber-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Sampel Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-surface text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="h-3.5 w-3.5 text-emerald-600" />
            <span>Unggah Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('record')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'record'
                ? 'bg-surface text-rose-800 shadow-xs border border-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-rose-600" />
            <span>Rekam Mic</span>
          </button>
        </div>
      </div>

      {/* Konten Sesuai Tab */}
      {activeTab === 'sample' && (
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Pilih Sampel Rapat untuk Diuji:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_MEETINGS.map((sample) => {
              const isSelected = sample.id === selectedSampleId
              return (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => setSelectedSampleId(sample.id)}
                  className={`flex flex-col text-left p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50/70 shadow-xs ring-2 ring-amber-200'
                      : 'border-slate-200 bg-page hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-bold font-mono text-slate-500">
                      {sample.duration}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Terpilih
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{sample.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {sample.summary}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="space-y-3">
          <label
            htmlFor="audio-file-input"
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors cursor-pointer text-center space-y-2"
          >
            <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Upload className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {uploadedFileName ? uploadedFileName : 'Klik untuk Memilih Berkas Audio Rapat'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mendukung format MP3, WAV, M4A, OGG, atau WebM (hingga 250 MB)
              </p>
            </div>
            <input
              id="audio-file-input"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      )}

      {activeTab === 'record' && (
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 bg-page text-center space-y-3">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            <Mic className="h-6 w-6" />
          </div>

          <div>
            <p className="text-xs font-bold text-slate-800">
              {isRecording ? 'Sedang Merekam Percakapan Rapat...' : 'Rekam Suara Rapat Langsung'}
            </p>
            <p className="text-xs font-mono text-rose-600 font-bold mt-0.5">
              {isRecording ? `00:${recordingSeconds.toString().padStart(2, '0')}` : 'Tekan tombol untuk mulai'}
            </p>
          </div>

          <Button
            variant={isRecording ? 'danger' : 'primary'}
            onClick={handleToggleRecord}
            className="font-bold text-xs"
          >
            {isRecording ? 'Hentikan Perekaman' : 'Mulai Rekam Suara'}
          </Button>
        </div>
      )}

      {/* Tombol Eksekusi AI Transcriber */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <Music className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Pemrosesan lokal tanpa kirim audio ke server cloud.</span>
        </div>

        <Button
          variant="primary"
          isLoading={isProcessing}
          loadingText="Model Whisper Sedang Memproses..."
          icon={<Sparkles className="h-4 w-4 text-amber-300" />}
          onClick={handleExecute}
          className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 font-black shadow-amber-600/30"
        >
          ⚡ Proses Notulensi dengan Local AI
        </Button>
      </div>
    </div>
  )
}
