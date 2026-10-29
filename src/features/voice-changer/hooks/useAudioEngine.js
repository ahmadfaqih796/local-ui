import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { audioEngine } from '../services/audioEngine'
import { useVoiceStore } from '../store/useVoiceStore'

/**
 * Custom hook untuk mengontrol siklus hidup Audio Engine dan interaksi React
 */
export function useAudioEngine() {
  const {
    isActive,
    isMuted,
    isMonitoring,
    inputVolume,
    selectedPresetId,
    customParams,
    inputDeviceId,
    outputDeviceId,
    setActive,
    setMuted,
    setMonitoring,
    setInputVolume,
    selectPreset,
    updateCustomParam,
    setInputDevice,
    setOutputDevice,
  } = useVoiceStore()

  // Mulai mikrofon
  const startMic = useCallback(async (customDeviceId = null) => {
    try {
      const targetDevice = customDeviceId || inputDeviceId || undefined
      await audioEngine.start(targetDevice)
      audioEngine.applyParams(customParams)
      audioEngine.setMonitoring(isMonitoring)
      audioEngine.setMuted(isMuted)
      audioEngine.setInputVolume(inputVolume)

      if (outputDeviceId) {
        await audioEngine.setOutputDevice(outputDeviceId)
      }

      setActive(true)
      toast.success('Mikrofon aktif! Suara Anda kini terhubung ke pengubah suara.')
      return true
    } catch (err) {
      console.error('Error menyalakan mikrofon:', err)
      toast.error('Tidak dapat mengakses mikrofon. Pastikan izin mikrofon telah diberikan di browser.')
      setActive(false)
      return false
    }
  }, [inputDeviceId, customParams, isMonitoring, isMuted, inputVolume, outputDeviceId, setActive])

  // Matikan mikrofon
  const stopMic = useCallback(() => {
    audioEngine.stop()
    setActive(false)
    toast.info('Mikrofon dimatikan.')
  }, [setActive])

  // Toggle Aktif / Mati
  const toggleMic = useCallback(async () => {
    if (isActive) {
      stopMic()
    } else {
      await startMic()
    }
  }, [isActive, startMic, stopMic])

  // Ganti perangkat input live
  const changeInputDevice = useCallback(async (deviceId) => {
    setInputDevice(deviceId)
    if (isActive) {
      audioEngine.stop()
      try {
        await audioEngine.start(deviceId)
        audioEngine.applyParams(customParams)
        audioEngine.setMonitoring(isMonitoring)
        audioEngine.setMuted(isMuted)
        toast.success('Perangkat mikrofon berhasil dialihkan.')
      } catch (err) {
        console.error('Gagal beralih mic:', err)
        toast.error('Gagal beralih ke perangkat mikrofon baru.')
      }
    }
  }, [isActive, setInputDevice, customParams, isMonitoring, isMuted])

  // Ganti perangkat output live
  const changeOutputDevice = useCallback(async (deviceId) => {
    setOutputDevice(deviceId)
    const success = await audioEngine.setOutputDevice(deviceId)
    if (success) {
      toast.success('Perangkat output berhasil dipilih.')
    }
  }, [setOutputDevice])

  // Cleanup saat unmount
  useEffect(() => {
    return () => {
      // Tidak langsung mematikan jika user masih berada di tab, tapi pastikan dibersihkan saat refresh
    }
  }, [])

  return {
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
    toggleMic,
    setMuted,
    setMonitoring,
    setInputVolume,
    selectPreset,
    updateCustomParam,
    changeInputDevice,
    changeOutputDevice,
  }
}

