import { create } from 'zustand'
import { VOICE_PRESETS } from '../constants/presets'
import { audioEngine } from '../services/audioEngine'

export const useVoiceStore = create((set, get) => ({
  // Status Mikrofon & Engine
  isActive: false,
  isMuted: false,
  isMonitoring: false,
  inputVolume: 1.0,

  // Preset Terpilih & Parameter
  selectedPresetId: 'normal',
  customParams: { ...VOICE_PRESETS[0].params },

  // Perangkat Audio
  inputDeviceId: '',
  outputDeviceId: '',

  // Aksi-aksi (Actions)
  setActive: (isActive) => set({ isActive }),

  setMuted: (isMuted) => {
    audioEngine.setMuted(isMuted)
    set({ isMuted })
  },

  setMonitoring: (isMonitoring) => {
    audioEngine.setMonitoring(isMonitoring)
    set({ isMonitoring })
  },

  setInputVolume: (inputVolume) => {
    audioEngine.setInputVolume(inputVolume)
    set({ inputVolume })
  },

  selectPreset: (presetId) => {
    const preset = VOICE_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      const params = { ...preset.params }
      audioEngine.applyParams(params)
      set({
        selectedPresetId: presetId,
        customParams: params,
      })
    }
  },

  updateCustomParam: (key, value) => {
    const state = get()
    const updated = {
      ...state.customParams,
      [key]: value,
    }
    // Jika sedang di preset baku lalu slider digeser, tandai sebagai custom
    const isCustom = state.selectedPresetId !== 'custom'
    audioEngine.applyParams(updated)
    set({
      selectedPresetId: isCustom ? 'custom' : state.selectedPresetId,
      customParams: updated,
    })
  },

  setInputDevice: (inputDeviceId) => set({ inputDeviceId }),
  setOutputDevice: (outputDeviceId) => set({ outputDeviceId }),
}))

