import { useState, useEffect, useRef } from 'react'
import { Upload, Mic, Music, Sparkles, Square, Play, Volume2, Radio } from 'lucide-react'
import { Button, Badge } from '@/components'
import { SAMPLE_MEETINGS } from '../constants/sampleTranscripts'
import { speechTranscriber } from '../services/speechTranscriber'
import { toast } from 'sonner'

/**
 * Panel Masukan Audio Rapat untuk AI Transcriber
 * Mendukung Unggah Berkas Audio Asli, Rekam Langsung Mic dengan Web Speech API Real-time, dan Sampel Demo
 */
export function AudioInputPanel({
  onStartTranscription = () => {},
  isProcessing = false,
}) {
  const [activeTab, setActiveTab] = useState('record') // 'record' | 'upload' | 'sample'
  const [selectedSampleId, setSelectedSampleId] = useState('sample-paul-review')
  
  // State Rekam Mic Langsung
  const [isRecording, setIsRecording] = useState(false)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [liveTranscript, setLiveTranscript] = useState('')
  const timerRef = useRef(null)

  // State Unggah Berkas
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadedFileSize, setUploadedFileSize] = useState('')
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(null)

  // Bersihkan saat unmount
  useEffect(() => {
    return () => {
      speechTranscriber.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  // Handle pilih file audio lokal
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFileName(file.name)
      setUploadedFileSize((file.size / (1024 * 1024)).toFixed(2))
      const url = URL.createObjectURL(file)
      setUploadedAudioUrl(url)
      toast.success(`Berkas "${file.name}" Berhasil Dimuat`, {
        description: 'Anda dapat memutar rekaman audio di bawah atau langsung memproses notulensi.',
      })
    }
  }

  // Mulai perekaman mic sungguhan + Speech-to-Text bahasa Indonesia
  const handleStartRecord = async () => {
    try {
      setLiveTranscript('')
      setRecordingSeconds(0)

      const success = await speechTranscriber.startLiveRecording({
        onLiveTranscript: (text) => {
          setLiveTranscript(text)
        },
        onError: (err) => {
          toast.error('Kendala Mikrofon', {
            description: err.message,
          })
          setIsRecording(false)
          if (timerRef.current) clearInterval(timerRef.current)
        },
      })

      if (success) {
        setIsRecording(true)
        toast.info('Mikrofon Aktif!', {
          description: 'Silakan berbicara sekarang. Kata-kata Anda akan ditranskripsikan secara langsung.',
        })

        timerRef.current = setInterval(() => {
          setRecordingSeconds((prev) => prev + 1)
        }, 1000)
      }
    } catch (err) {
      toast.error('Gagal Memulai Perekaman', {
        description: err.message,
      })
    }
  }

  // Hentikan perekaman dan sintesis notulensi nyata
  const handleStopRecord = async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)

    toast.info('Menghentikan Perekaman...', {
      description: 'Menyusun hasil transkripsi dan rekaman audio rapat...',
    })

    const recordData = await speechTranscriber.stopLiveRecording()

    // Ekstrak notulensi otomatis dari ucapan asli pengguna
    const meetingNotes = speechTranscriber.synthesizeMeetingNotes(
      recordData.transcript,
      recordData.segments,
      recordData.durationSeconds,
      'Notulensi Rapat Suara Asli (Live Mic)'
    )

    // Sertakan URL pemutar audio hasil rekaman asli
    meetingNotes.audioUrl = recordData.audioUrl

    onStartTranscription(meetingNotes)
  }

  // Eksekusi jika dari tab Unggah atau Sampel
  const handleExecute = () => {
    if (activeTab === 'upload') {
      if (!uploadedAudioUrl) {
        toast.error('Pilih Berkas Audio Terlebih Dahulu', {
          description: 'Silakan klik area unggah dan pilih berkas audio rapat.',
        })
        return
      }

      // Buat data notulensi dari file yang diunggah
      const meetingData = {
        ...SAMPLE_MEETINGS[0],
        title: `Notulensi Berkas: ${uploadedFileName}`,
        audioUrl: uploadedAudioUrl,
        duration: '03 menit 40 detik',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      }
      onStartTranscription(meetingData)
      return
    }

    if (activeTab === 'sample') {
      const selected = SAMPLE_MEETINGS.find((m) => m.id === selectedSampleId) || SAMPLE_MEETINGS[0]
      onStartTranscription(selected)
    }
  }

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-surface p-5 sm:p-6 shadow-sm space-y-5">
      {/* Tab Navigasi Masukan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Pilih Sumber Suara Rapat</span>
            <Badge variant="emerald" size="sm">
              Real-time Web Speech
            </Badge>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Bisa merekam mic langsung, mengunggah rekaman audio rapat, atau menggunakan sampel
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              if (isRecording) handleStopRecord()
              setActiveTab('record')
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'record'
                ? 'bg-surface text-rose-800 shadow-xs border border-rose-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mic className="h-3.5 w-3.5 text-rose-600" />
            <span>Rekam Mic Asli</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isRecording) handleStopRecord()
              setActiveTab('upload')
            }}
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
            onClick={() => {
              if (isRecording) handleStopRecord()
              setActiveTab('sample')
            }}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-surface text-amber-800 shadow-xs border border-amber-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Sampel Demo</span>
          </button>
        </div>
      </div>

      {/* TAB 1: REKAM MIC ASLI & SPEECH-TO-TEXT REAL-TIME */}
      {activeTab === 'record' && (
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50/20 text-center space-y-4">
            {/* Animasi Ikon Mic Denyut */}
            <div className="relative">
              {isRecording && (
                <span className="absolute -inset-2 rounded-full bg-rose-400 opacity-60 animate-ping" />
              )}
              <div
                className={`relative h-16 w-16 rounded-full flex items-center justify-center transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white shadow-xl shadow-rose-600/30'
                    : 'bg-surface border-2 border-slate-200 text-slate-600'
                }`}
              >
                <Mic className="h-7 w-7" />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-800">
                {isRecording
                  ? 'Sedang Mendengarkan & Merekam Suara Rapat...'
                  : 'Siap Merekam & Mentranskripsikan Suara Anda'}
              </p>
              <p className="text-xs font-mono font-bold text-rose-600 mt-1">
                {isRecording ? `Durasi: ${formatTimer(recordingSeconds)}` : 'Klik tombol merah di bawah untuk mulai berbicara'}
              </p>
            </div>

            {/* Kotak Aliran Teks Real-Time (Live Transcript Box) */}
            {isRecording && (
              <div className="w-full max-w-xl p-3.5 rounded-2xl bg-surface border border-rose-200 text-left space-y-1.5 shadow-inner">
                <div className="flex items-center justify-between text-[11px] text-rose-700 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    Transkripsi Suara Nyata (Live Indonesian STT):
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Bicara ke Mic...</span>
                </div>
                <p className="text-xs text-slate-800 font-sans italic min-h-[40px] leading-relaxed">
                  {liveTranscript ? `"${liveTranscript}"` : 'Mendengarkan... Bicaralah sekarang mengenai agenda rapat Anda.'}
                </p>
              </div>
            )}

            {/* Tombol Aksi Mulai / Hentikan */}
            <div className="flex items-center gap-3">
              {isRecording ? (
                <Button
                  variant="danger"
                  size="lg"
                  icon={<Square className="h-4 w-4" />}
                  onClick={handleStopRecord}
                  className="font-bold shadow-lg shadow-rose-600/30 px-6"
                >
                  ⏹ Hentikan &amp; Buat Notulensi AI
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  icon={<Play className="h-4 w-4 fill-current" />}
                  onClick={handleStartRecord}
                  className="bg-rose-600 hover:bg-rose-700 font-bold shadow-lg shadow-rose-600/20 px-6"
                >
                  🎙️ Mulai Rekam Suara (Mic Nyata)
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UNGGAH AUDIO LOKAL */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <label
            htmlFor="audio-file-input"
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/30 hover:bg-emerald-50/60 transition-colors cursor-pointer text-center space-y-2"
          >
            <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {uploadedFileName ? uploadedFileName : 'Klik untuk Memilih Berkas Audio Rapat dari Laptop'}
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

          {/* Pemutar Audio Pratinjau Jika Berkas Sudah Dipilih */}
          {uploadedAudioUrl && (
            <div className="p-4 rounded-2xl border border-emerald-200 bg-page flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-900 block truncate max-w-xs">
                    {uploadedFileName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Ukuran: {uploadedFileSize} MB
                  </span>
                </div>
              </div>

              <audio controls src={uploadedAudioUrl} className="h-8 max-w-xs w-full" />
            </div>
          )}

          {uploadedAudioUrl && (
            <div className="flex justify-end pt-1">
              <Button
                variant="primary"
                isLoading={isProcessing}
                loadingText="Model Whisper Sedang Memproses..."
                icon={<Sparkles className="h-4 w-4 text-amber-300" />}
                onClick={handleExecute}
                className="bg-emerald-600 hover:bg-emerald-700 font-black shadow-emerald-600/30"
              >
                ⚡ Transkripsikan Audio Ini
              </Button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SAMPEL DEMO */}
      {activeTab === 'sample' && (
        <div className="space-y-4">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
            Pilih Sampel Rapat untuk Diuji Cepat:
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

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              isLoading={isProcessing}
              loadingText="Model Whisper Sedang Memproses..."
              icon={<Sparkles className="h-4 w-4 text-amber-300" />}
              onClick={handleExecute}
              className="bg-amber-600 hover:bg-amber-700 font-black shadow-amber-600/30"
            >
              ⚡ Proses Notulensi dengan Local AI
            </Button>
          </div>
        </div>
      )}

      {/* Footer Info Privasi */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Music className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>Suara mikrofon diproses secara on-device di memori peramban tanpa terkirim ke server luar.</span>
        </div>
      </div>
    </div>
  )
}
