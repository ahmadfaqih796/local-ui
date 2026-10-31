import { useState, useEffect } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Settings2,
} from 'lucide-react'
import { useAudioEngine } from '@/features/voice-changer/hooks/useAudioEngine'
import { useAudioDevices } from '@/features/voice-changer/hooks/useAudioDevices'
import { SimpleMeetingCard } from '@/features/voice-changer/components/SimpleMeetingCard'
import { VoiceDemoPlayground } from '@/features/voice-changer/components/VoiceDemoPlayground'
import { VoiceVisualizer } from '@/features/voice-changer/components/VoiceVisualizer'
import { PresetSelector } from '@/features/voice-changer/components/PresetSelector'
import { CustomControls } from '@/features/voice-changer/components/CustomControls'
import { DeviceSelector } from '@/features/voice-changer/components/DeviceSelector'
import { MeetingGuideModal } from '@/features/voice-changer/components/MeetingGuideModal'
import { VOICE_PRESETS } from '@/features/voice-changer/constants/presets'
import { audioEngine } from '@/features/voice-changer/services/audioEngine'

export function VoiceChangerPage() {
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const {
    isActive,
    isMuted,
    isMonitoring,
    inputVolume,
    selectedPresetId,
    customParams,
    inputDeviceId,
    outputDeviceId,
    startMic,
    stopMic,
    setMuted,
    setMonitoring,
    setInputVolume,
    selectPreset,
    updateCustomParam,
    changeInputDevice,
    changeOutputDevice,
  } = useAudioEngine()

  const {
    inputDevices,
    outputDevices,
    autoPhysicalMicId,
    autoMeetingOutputId,
    refreshDevices,
  } = useAudioDevices()

  // Otomatis pasangkan mic fisik asli dan VB-Cable jika user belum memilih
  useEffect(() => {
    if (autoPhysicalMicId && (!inputDeviceId || inputDeviceId.toLowerCase().includes('cable'))) {
      changeInputDevice(autoPhysicalMicId)
    }
    if (autoMeetingOutputId && !outputDeviceId) {
      changeOutputDevice(autoMeetingOutputId)
    }
  }, [autoPhysicalMicId, autoMeetingOutputId, inputDeviceId, outputDeviceId, changeInputDevice, changeOutputDevice])

  const activePreset = VOICE_PRESETS.find((p) => p.id === selectedPresetId)

  const handleResetParams = () => {
    if (activePreset) {
      selectPreset(activePreset.id)
    } else {
      selectPreset('normal')
    }
  }

  // Label mic fisik dan virtual cable untuk kartu simpel
  const physicalMicObj = inputDevices.find((d) => d.deviceId === inputDeviceId) ||
    inputDevices.find((d) => d.deviceId === autoPhysicalMicId)
  const virtualCableObj = outputDevices.find((d) => d.deviceId === outputDeviceId) ||
    outputDevices.find((d) => d.deviceId === autoMeetingOutputId)

  const hasVirtualCable = outputDevices.some(
    (d) =>
      d.label.toLowerCase().includes('cable') ||
      d.label.toLowerCase().includes('virtual')
  )

  // Handler tombol 1-klik mulai dengan mic fisik & cable otomatis
  const handleSimpleToggle = async () => {
    if (isActive) {
      stopMic()
    } else {
      const targetInput = autoPhysicalMicId || inputDeviceId || undefined
      const targetOutput = autoMeetingOutputId || outputDeviceId || undefined

      await startMic(targetInput)

      if (targetOutput) {
        changeOutputDevice(targetOutput)
        await audioEngine.setOutputDevice(targetOutput)
      }
    }
  }

  return (
    <div className="min-h-screen text-slate-800 pb-20 sm:pb-12">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* FITUR INOVASI 1: PLAYGROUND UJI COBA SUARA ONLINE (SANDBOX 100% AMAN BEBAS VIRUS) */}
        <VoiceDemoPlayground
          onOpenMeetingMode={() => {
            const el = document.getElementById('meeting-mode-card')
            el?.scrollIntoView({ behavior: 'smooth' })
          }}
        />

        {/* FITUR INOVASI 2: KARTU UTAMA MODE RAPAT 1-KLIK (ZERO CONFIGURATION LIVE VB-CABLE) */}
        <div id="meeting-mode-card">
          <SimpleMeetingCard
            isActive={isActive}
            isMuted={isMuted}
            isMonitoring={isMonitoring}
            physicalMicLabel={physicalMicObj?.label || 'Intel Smart Sound / Realtek Mic'}
            virtualCableLabel={virtualCableObj?.label || 'CABLE Input (VB-Audio)'}
            hasVirtualCable={hasVirtualCable}
            onToggleMic={handleSimpleToggle}
            onToggleMute={() => setMuted(!isMuted)}
            onToggleMonitoring={setMonitoring}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        </div>

        {/* AREA INTI: PILIHAN PRESET CEPAT & VISUALIZER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri: Visualizer Gelombang Suara (5 Kolom) */}
          <div className="lg:col-span-5 space-y-4">
            <VoiceVisualizer isActive={isActive} isMuted={isMuted} />

            {/* Kotak Petunjuk Anti-Mantul Singkat */}
            <div className="rounded-2xl border border-emerald-200 bg-surface p-4 text-xs text-slate-600 shadow-xs space-y-2">
              <p className="font-semibold text-text-primary flex items-center gap-2">
                <span>🛡️ Status Jalur Audio Google Meet:</span>
              </p>
              <ul className="space-y-1 text-slate-600 text-[11px] list-disc list-inside">
                <li>Google Meet Mikrofon: <strong className="text-emerald-800">CABLE Output (VB-Audio)</strong>.</li>
                <li>Google Meet Speaker: <strong className="text-text-primary">Speaker (Realtek Audio)</strong>.</li>
                <li>Audio presentasi di Google Meet: <strong className="text-status-danger font-bold">NONAKTIF / MATI</strong>.</li>
              </ul>
            </div>
          </div>

          {/* Kolom Kanan: Pilihan Suara Cepat (7 Kolom) */}
          <div className="lg:col-span-7 space-y-4">
            <PresetSelector
              selectedPresetId={selectedPresetId}
              onSelectPreset={selectPreset}
            />
          </div>
        </div>

        {/* ACCORDION PENGATURAN LANJUTAN (OPSIONAL) */}
        <div className="rounded-2xl border border-emerald-200/90 bg-surface overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-emerald-600" />
              <span>Pengaturan Lanjutan &amp; Fine-Tuning Slider (Opsional)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span>{showAdvanced ? 'Sembunyikan' : 'Buka Pengaturan'}</span>
              {showAdvanced ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {showAdvanced && (
            <div className="p-4 border-t border-emerald-100 space-y-6 animate-in fade-in duration-200 bg-emerald-50/20">
              {/* Slider Fine-Tuning Kustom */}
              <CustomControls
                params={customParams}
                onParamChange={updateCustomParam}
                onReset={handleResetParams}
              />

              {/* Selector Perangkat Manual */}
              <DeviceSelector
                inputDevices={inputDevices}
                outputDevices={outputDevices}
                inputDeviceId={inputDeviceId}
                outputDeviceId={outputDeviceId}
                isMonitoring={isMonitoring}
                inputVolume={inputVolume}
                onSelectInputDevice={changeInputDevice}
                onSelectOutputDevice={changeOutputDevice}
                onToggleMonitoring={setMonitoring}
                onVolumeChange={setInputVolume}
                onRefreshDevices={refreshDevices}
                onOpenMeetingGuide={() => setIsGuideOpen(true)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Modal Dialog Panduan Sambung ke Meeting */}
      <MeetingGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  )
}
