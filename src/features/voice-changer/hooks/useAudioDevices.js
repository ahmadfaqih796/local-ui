import { useState, useEffect, useCallback } from 'react'

/**
 * Custom hook untuk mendeteksi perangkat audio dengan Auto-Config Cerdas:
 * 1. Otomatis memprioritaskan Headset USB / Mic Eksternal (AB13X USB Audio)
 * 2. Menolak kabel virtual dari masukan mic fisik
 * 3. Otomatis menghubungkan CABLE Input sebagai jalur meeting
 */
export function useAudioDevices() {
  const [inputDevices, setInputDevices] = useState([])
  const [outputDevices, setOutputDevices] = useState([])
  const [autoPhysicalMicId, setAutoPhysicalMicId] = useState('')
  const [autoMeetingOutputId, setAutoMeetingOutputId] = useState('')
  const [hasPermission, setHasPermission] = useState(false)

  const processDevices = useCallback((devices) => {
    const inputs = devices.filter((d) => d.kind === 'audioinput')
    const outputs = devices.filter((d) => d.kind === 'audiooutput')

    // 1. Temukan Mic Fisik Asli (bukan CABLE, bukan Virtual, bukan Stereo Mix)
    const realMics = inputs.filter((d) => {
      const label = d.label.toLowerCase()
      return (
        !label.includes('cable') &&
        !label.includes('virtual') &&
        !label.includes('stereo mix') &&
        !label.includes('campuran stereo')
      )
    })

    // Prioritaskan Mic Headset USB (seperti AB13X USB Audio) dibanding mic laptop bawaan
    const usbOrHeadsetMic = realMics.find((d) => {
      const l = d.label.toLowerCase()
      return (
        l.includes('usb') ||
        l.includes('headset') ||
        l.includes('headphone') ||
        l.includes('ab13x')
      )
    })

    const bestRealMic = usbOrHeadsetMic?.deviceId || realMics[0]?.deviceId || inputs[0]?.deviceId || ''

    // 2. Temukan CABLE Input untuk meeting
    const cableIn = outputs.find((d) => {
      const label = d.label.toLowerCase()
      return (
        label.includes('cable input') ||
        label.includes('vb-audio') ||
        (label.includes('cable') && !label.includes('output'))
      )
    })
    const bestMeetingOut = cableIn?.deviceId || ''

    setHasPermission(inputs.some((d) => d.label !== ''))
    setInputDevices(inputs)
    setOutputDevices(outputs)
    setAutoPhysicalMicId(bestRealMic)
    setAutoMeetingOutputId(bestMeetingOut)

    return { bestRealMic, bestMeetingOut }
  }, [])

  const fetchDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      processDevices(devices)
    } catch (err) {
      console.warn('Gagal membaca daftar perangkat audio:', err)
    }
  }, [processDevices])

  useEffect(() => {
    let isMounted = true

    async function init() {
      if (!navigator.mediaDevices?.enumerateDevices) return
      try {
        const devices = await navigator.mediaDevices.enumerateDevices()
        if (!isMounted) return
        processDevices(devices)
      } catch (err) {
        console.warn('Gagal membaca perangkat audio:', err)
      }
    }

    init()

    const onDeviceChange = () => {
      init()
    }

    navigator.mediaDevices?.addEventListener?.('devicechange', onDeviceChange)
    return () => {
      isMounted = false
      navigator.mediaDevices?.removeEventListener?.('devicechange', onDeviceChange)
    }
  }, [processDevices])

  return {
    inputDevices,
    outputDevices,
    autoPhysicalMicId,
    autoMeetingOutputId,
    hasPermission,
    refreshDevices: fetchDevices,
  }
}
