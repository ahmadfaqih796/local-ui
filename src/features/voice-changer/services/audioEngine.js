/**
 * Mesin Audio Real-time Web Audio API
 * Didesain khusus dengan:
 * 1. Pitch Shifter Granular Dual-Direction (Hann-Window Anti-Click & Anti-Clip)
 * 2. Dynamics Compressor Studio Limiter (Suara bulat & jernih tanpa distorsi kresek)
 * 3. Automatic Noise Gate (Menahan bocoran speaker)
 * 4. Isolasi Jalur 1-Arah ke VB-CABLE Input
 */

class AudioEngine {
  constructor() {
    this.audioContext = null
    this.mediaStream = null
    this.sourceNode = null

    // Node Noise Gate
    this.gateGain = null
    this.gateAnalyser = null
    this.gateThreshold = 0.02
    this.isGateOpen = true
    this.gateCheckInterval = null

    // Node Pemrosesan
    this.inputGain = null
    this.highPassFilter = null
    this.lowPassFilter = null
    this.bassFilter = null
    this.trebleFilter = null
    this.formantF1 = null
    this.formantF2 = null

    // Node Pitch Shifter
    this.pitchDelay1 = null
    this.pitchDelay2 = null
    this.pitchGain1 = null
    this.pitchGain2 = null
    this.pitchModSource1 = null
    this.pitchModSource2 = null
    this.pitchModGainSource1 = null
    this.pitchModGainSource2 = null
    this.pitchMixGain = null
    this.dryGain = null
    this.currentDirection = null

    // Node Efek Robot
    this.robotOsc = null
    this.robotModGain = null
    this.robotDryGain = null
    this.robotWetGain = null

    // Node Efek Echo / Ruang
    this.echoDelay = null
    this.echoFeedback = null
    this.echoWetGain = null

    // Node Efek Distorsi
    this.waveShaper = null

    // Dynamics Compressor (Studio Limiter anti-pecah)
    this.compressor = null

    // Node Output & Monitoring
    this.masterGain = null
    this.analyser = null
    this.monitorGain = null
    this.streamDestination = null

    // Elemen audio untuk sinkId
    this.virtualAudioEl = null

    // Status
    this.isRunning = false
    this.isMuted = false
    this.isMonitoring = false
    this.currentParams = null
    this.grainDuration = 0.08 // 80ms window optimal
    this.targetOutputDeviceId = ''
    this.isCableConnected = false
  }

  /**
   * Menginisialisasi AudioContext dengan proteksi Anti-Echo
   * @param {string} [inputDeviceId] - ID perangkat mikrofon fisik
   * @returns {Promise<boolean>}
   */
  async start(inputDeviceId = null) {
    if (this.isRunning) return true

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioCtx({ latencyHint: 'interactive' })

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      const constraints = {
        audio: {
          deviceId: inputDeviceId ? { exact: inputDeviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
          channelCount: 1,
        },
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream)

      this._buildNodeGraph()
      this._startNoiseGateLoop()
      await this._bindCableOutputImmediate()

      this.isRunning = true
      return true
    } catch (err) {
      console.error('Gagal menginisialisasi Audio Engine:', err)
      this.stop()
      throw err
    }
  }

  /**
   * Menyusun rantai pemrosesan suara
   * @private
   */
  _buildNodeGraph() {
    const ctx = this.audioContext

    // 0. Noise Gate
    this.gateGain = ctx.createGain()
    this.gateGain.gain.setValueAtTime(1.0, ctx.currentTime)

    this.gateAnalyser = ctx.createAnalyser()
    this.gateAnalyser.fftSize = 256

    // 1. Input Gain & Mute
    this.inputGain = ctx.createGain()
    this.inputGain.gain.setValueAtTime(1.0, ctx.currentTime)

    // 2. High-Pass Filter (Memotong dengung frekuensi rendah)
    this.highPassFilter = ctx.createBiquadFilter()
    this.highPassFilter.type = 'highpass'
    this.highPassFilter.frequency.setValueAtTime(80, ctx.currentTime)

    // 3. Low-Pass Filter
    this.lowPassFilter = ctx.createBiquadFilter()
    this.lowPassFilter.type = 'lowpass'
    this.lowPassFilter.frequency.setValueAtTime(14000, ctx.currentTime)

    // 4. Bass Filter (Low Shelf 120Hz)
    this.bassFilter = ctx.createBiquadFilter()
    this.bassFilter.type = 'lowshelf'
    this.bassFilter.frequency.setValueAtTime(120, ctx.currentTime)
    this.bassFilter.gain.setValueAtTime(0, ctx.currentTime)

    // 5. Treble Filter (High Shelf 4000Hz)
    this.trebleFilter = ctx.createBiquadFilter()
    this.trebleFilter.type = 'highshelf'
    this.trebleFilter.frequency.setValueAtTime(4000, ctx.currentTime)
    this.trebleFilter.gain.setValueAtTime(0, ctx.currentTime)

    // 6. Formant Filter F1 (Peaking 1200Hz - Vokal Tengah)
    this.formantF1 = ctx.createBiquadFilter()
    this.formantF1.type = 'peaking'
    this.formantF1.frequency.setValueAtTime(1200, ctx.currentTime)
    this.formantF1.Q.setValueAtTime(1.6, ctx.currentTime)
    this.formantF1.gain.setValueAtTime(0, ctx.currentTime)

    // 7. Formant Filter F2 (Peaking 2600Hz - Vokal Kejernihan)
    this.formantF2 = ctx.createBiquadFilter()
    this.formantF2.type = 'peaking'
    this.formantF2.frequency.setValueAtTime(2600, ctx.currentTime)
    this.formantF2.Q.setValueAtTime(1.8, ctx.currentTime)
    this.formantF2.gain.setValueAtTime(0, ctx.currentTime)

    // 8. Setup Pitch Shifter Nodes
    this._setupPitchShifter(ctx)

    // 9. Setup Robot Modulator
    this._setupRobotModulator(ctx)

    // 10. Echo / Delay
    this.echoDelay = ctx.createDelay()
    this.echoDelay.delayTime.setValueAtTime(0.18, ctx.currentTime)
    this.echoFeedback = ctx.createGain()
    this.echoFeedback.gain.setValueAtTime(0.25, ctx.currentTime)
    this.echoWetGain = ctx.createGain()
    this.echoWetGain.gain.setValueAtTime(0, ctx.currentTime)

    this.echoDelay.connect(this.echoFeedback)
    this.echoFeedback.connect(this.echoDelay)
    this.echoDelay.connect(this.echoWetGain)

    // 11. WaveShaper Distorsi
    this.waveShaper = ctx.createWaveShaper()
    this.waveShaper.curve = this._makeDistortionCurve(0)
    this.waveShaper.oversample = '2x'

    // 12. DYNAMICS COMPRESSOR (Studio Limiter anti-kresek / anti-pecah)
    this.compressor = ctx.createDynamicsCompressor()
    this.compressor.threshold.setValueAtTime(-14, ctx.currentTime)
    this.compressor.knee.setValueAtTime(8, ctx.currentTime)
    this.compressor.ratio.setValueAtTime(5, ctx.currentTime)
    this.compressor.attack.setValueAtTime(0.003, ctx.currentTime)
    this.compressor.release.setValueAtTime(0.12, ctx.currentTime)

    // 13. Master Gain & Analyser
    this.masterGain = ctx.createGain()
    this.masterGain.gain.setValueAtTime(1.0, ctx.currentTime)

    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 512
    this.analyser.smoothingTimeConstant = 0.8

    // 14. Monitor Gain (Headset)
    this.monitorGain = ctx.createGain()
    this.monitorGain.gain.setValueAtTime(this.isMonitoring ? 1.0 : 0.0, ctx.currentTime)

    // 15. Stream Destination (Kabel Virtual ke Meeting)
    this.streamDestination = ctx.createMediaStreamDestination()

    // Hubungkan Rantai Suara
    this.sourceNode.connect(this.gateAnalyser)
    this.sourceNode.connect(this.gateGain)
    this.gateGain.connect(this.inputGain)

    this.inputGain.connect(this.highPassFilter)
    this.highPassFilter.connect(this.lowPassFilter)
    this.lowPassFilter.connect(this.bassFilter)
    this.bassFilter.connect(this.trebleFilter)
    this.trebleFilter.connect(this.formantF1)
    this.formantF1.connect(this.formantF2)

    // Formant -> Pitch Shifter Input
    this.formantF2.connect(this.pitchDelay1)
    this.formantF2.connect(this.pitchDelay2)
    this.formantF2.connect(this.dryGain)

    // Pitch Mix -> Robot
    this.pitchMixGain.connect(this.robotModGain)
    this.pitchMixGain.connect(this.robotDryGain)

    this.robotOutputGain = ctx.createGain()
    this.robotDryGain.connect(this.robotOutputGain)
    this.robotWetGain.connect(this.robotOutputGain)

    this.robotOutputGain.connect(this.waveShaper)
    this.waveShaper.connect(this.echoDelay)
    this.waveShaper.connect(this.compressor)
    this.echoWetGain.connect(this.compressor)

    // Compressor -> Master Gain -> Analyser
    this.compressor.connect(this.masterGain)
    this.masterGain.connect(this.analyser)

    // Analyser -> Jalur Meeting & Monitor
    this.analyser.connect(this.streamDestination)
    this.analyser.connect(this.monitorGain)
    this.monitorGain.connect(ctx.destination)

    this._attachStreamToAudioElement(this.streamDestination.stream)
  }

  /**
   * Menyiapkan Node Pitch Shifter Granular
   * @private
   */
  _setupPitchShifter(ctx) {
    this.pitchDelay1 = ctx.createDelay(1.0)
    this.pitchDelay2 = ctx.createDelay(1.0)

    this.pitchGain1 = ctx.createGain()
    this.pitchGain2 = ctx.createGain()
    this.pitchMixGain = ctx.createGain()
    this.dryGain = ctx.createGain()

    this.pitchDelay1.connect(this.pitchGain1)
    this.pitchDelay2.connect(this.pitchGain2)
    this.pitchGain1.connect(this.pitchMixGain)
    this.pitchGain2.connect(this.pitchMixGain)
    this.dryGain.connect(this.pitchMixGain)

    this.dryGain.gain.setValueAtTime(1.0, ctx.currentTime)
    this.pitchMixGain.gain.setValueAtTime(1.0, ctx.currentTime)

    // Set awal ke arah normal
    this._configurePitchModulators('down')
  }

  /**
   * Menghasilkan audio buffer ramp linier dengan Hann Window
   * Delay terjamin SELALU positif (0.005s s/d 0.075s), bebas kresek & bebas clipping
   * @private
   */
  _createModulationBuffers(ctx, grainDuration, direction) {
    const bufferLen = Math.floor(ctx.sampleRate * grainDuration)
    const modBuffer1 = ctx.createBuffer(1, bufferLen, ctx.sampleRate)
    const modBuffer2 = ctx.createBuffer(1, bufferLen, ctx.sampleRate)
    const gainBuffer1 = ctx.createBuffer(1, bufferLen, ctx.sampleRate)
    const gainBuffer2 = ctx.createBuffer(1, bufferLen, ctx.sampleRate)

    const d1 = modBuffer1.getChannelData(0)
    const d2 = modBuffer2.getChannelData(0)
    const g1 = gainBuffer1.getChannelData(0)
    const g2 = gainBuffer2.getChannelData(0)

    const minDelay = 0.005
    const maxDelay = grainDuration - 0.005
    const delayRange = maxDelay - minDelay

    for (let i = 0; i < bufferLen; i++) {
      const t = i / bufferLen

      if (direction === 'up') {
        // Pitch Up: delay waktu mengecil dari maxDelay ke minDelay
        d1[i] = maxDelay - (t * delayRange)
        d2[i] = maxDelay - (((t + 0.5) % 1.0) * delayRange)
      } else {
        // Pitch Down: delay waktu membesar dari minDelay ke maxDelay
        d1[i] = minDelay + (t * delayRange)
        d2[i] = minDelay + (((t + 0.5) % 1.0) * delayRange)
      }

      // Hann Window crossfade (pasti bernilai 0 di titik reset t=0 dan t=1)
      g1[i] = 0.5 * (1 - Math.cos(2 * Math.PI * t))
      g2[i] = 0.5 * (1 - Math.cos(2 * Math.PI * ((t + 0.5) % 1.0)))
    }

    return { modBuffer1, modBuffer2, gainBuffer1, gainBuffer2 }
  }

  /**
   * Mengatur modulator buffer sesuai arah pitch (up atau down)
   * @private
   */
  _configurePitchModulators(direction) {
    const ctx = this.audioContext
    if (!ctx) return

    // Hentikan modulator sebelumnya
    if (this.pitchModSource1) {
      try { this.pitchModSource1.stop() } catch { /* ignore */ }
    }
    if (this.pitchModSource2) {
      try { this.pitchModSource2.stop() } catch { /* ignore */ }
    }
    if (this.pitchModGainSource1) {
      try { this.pitchModGainSource1.stop() } catch { /* ignore */ }
    }
    if (this.pitchModGainSource2) {
      try { this.pitchModGainSource2.stop() } catch { /* ignore */ }
    }

    this.currentDirection = direction
    const { modBuffer1, modBuffer2, gainBuffer1, gainBuffer2 } =
      this._createModulationBuffers(ctx, this.grainDuration, direction)

    this.pitchModSource1 = ctx.createBufferSource()
    this.pitchModSource2 = ctx.createBufferSource()
    this.pitchModGainSource1 = ctx.createBufferSource()
    this.pitchModGainSource2 = ctx.createBufferSource()

    this.pitchModSource1.buffer = modBuffer1
    this.pitchModSource2.buffer = modBuffer2
    this.pitchModGainSource1.buffer = gainBuffer1
    this.pitchModGainSource2.buffer = gainBuffer2

    this.pitchModSource1.loop = true
    this.pitchModSource2.loop = true
    this.pitchModGainSource1.loop = true
    this.pitchModGainSource2.loop = true

    // Hubungkan delayTime langsung ke buffer source (1.0 scale)
    this.pitchModSource1.connect(this.pitchDelay1.delayTime)
    this.pitchModSource2.connect(this.pitchDelay2.delayTime)

    // Hubungkan crossfade gain
    this.pitchModGainSource1.connect(this.pitchGain1.gain)
    this.pitchModGainSource2.connect(this.pitchGain2.gain)

    this.pitchModSource1.start(0)
    this.pitchModSource2.start(0)
    this.pitchModGainSource1.start(0)
    this.pitchModGainSource2.start(0)
  }

  /**
   * Mengatur kecepatan pergeseran nada (Pitch Shift)
   * @private
   */
  _updatePitchRatio(ratio) {
    if (!this.audioContext) return

    const isNormal = Math.abs(ratio - 1.0) < 0.04
    const ctx = this.audioContext

    if (isNormal) {
      this.dryGain.gain.setTargetAtTime(1.0, ctx.currentTime, 0.02)
      this.pitchMixGain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.02)
      return
    }

    this.dryGain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.02)
    this.pitchMixGain.gain.setTargetAtTime(1.0, ctx.currentTime, 0.02)

    // Tentukan arah modulasi (up atau down)
    const neededDirection = ratio > 1.0 ? 'up' : 'down'
    if (this.currentDirection !== neededDirection) {
      this._configurePitchModulators(neededDirection)
    }

    // Hitung playback rate modulator
    // f_shift rate: deltaDelay / time = |1 - ratio|
    const delta = Math.abs(1.0 - ratio)
    const rate = Math.max(0.1, delta * 1.6)

    if (this.pitchModSource1 && this.pitchModSource2) {
      this.pitchModSource1.playbackRate.setTargetAtTime(rate, ctx.currentTime, 0.02)
      this.pitchModSource2.playbackRate.setTargetAtTime(rate, ctx.currentTime, 0.02)
      this.pitchModGainSource1.playbackRate.setTargetAtTime(rate, ctx.currentTime, 0.02)
      this.pitchModGainSource2.playbackRate.setTargetAtTime(rate, ctx.currentTime, 0.02)
    }
  }

  /**
   * Menyiapkan modulasi robot
   * @private
   */
  _setupRobotModulator(ctx) {
    this.robotOsc = ctx.createOscillator()
    this.robotOsc.type = 'sine'
    this.robotOsc.frequency.setValueAtTime(56, ctx.currentTime)

    this.robotModGain = ctx.createGain()
    this.robotDryGain = ctx.createGain()
    this.robotWetGain = ctx.createGain()

    this.robotOsc.connect(this.robotModGain.gain)
    this.robotModGain.connect(this.robotWetGain)

    this.robotDryGain.gain.setValueAtTime(1.0, ctx.currentTime)
    this.robotWetGain.gain.setValueAtTime(0, ctx.currentTime)

    this.robotOsc.start(0)
  }

  /**
   * Membuat kurva transfer distorsi halus (anti-clipping)
   * @private
   */
  _makeDistortionCurve(amount) {
    const k = typeof amount === 'number' ? amount * 30 : 0
    const nSamples = 44100
    const curve = new Float32Array(nSamples)
    const deg = Math.PI / 180

    for (let i = 0; i < nSamples; i++) {
      const x = (i * 2) / nSamples - 1
      if (k === 0) {
        curve[i] = x
      } else {
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
      }
    }
    return curve
  }

  /**
   * Loop Noise Gate
   * @private
   */
  _startNoiseGateLoop() {
    if (this.gateCheckInterval) clearInterval(this.gateCheckInterval)

    const buffer = new Float32Array(256)

    this.gateCheckInterval = setInterval(() => {
      if (!this.isRunning || !this.gateAnalyser || !this.audioContext) return

      this.gateAnalyser.getFloatTimeDomainData(buffer)

      let sum = 0
      for (let i = 0; i < buffer.length; i++) {
        sum += buffer[i] * buffer[i]
      }
      const rms = Math.sqrt(sum / buffer.length)

      const ctx = this.audioContext
      if (rms < this.gateThreshold) {
        if (this.isGateOpen) {
          this.gateGain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.05)
          this.isGateOpen = false
        }
      } else {
        if (!this.isGateOpen) {
          this.gateGain.gain.setTargetAtTime(1.0, ctx.currentTime, 0.01)
          this.isGateOpen = true
        }
      }
    }, 25)
  }

  /**
   * Menerapkan parameter preset atau slider kustom
   * @param {Object} params - Parameter vokal
   */
  applyParams(params) {
    if (!this.isRunning || !this.audioContext) {
      this.currentParams = params
      return
    }

    const ctx = this.audioContext
    const t = ctx.currentTime
    const rampTime = 0.03

    this.currentParams = params

    const ratio = params.pitchRatio ?? Math.pow(2, (params.pitchSemitones ?? 0) / 12)
    this._updatePitchRatio(ratio)

    if (params.highPassFreq !== undefined) {
      this.highPassFilter.frequency.setTargetAtTime(params.highPassFreq, t, rampTime)
    }
    if (params.lowPassFreq !== undefined) {
      this.lowPassFilter.frequency.setTargetAtTime(params.lowPassFreq, t, rampTime)
    }

    if (params.bassBoost !== undefined) {
      this.bassFilter.gain.setTargetAtTime(params.bassBoost, t, rampTime)
    }
    if (params.trebleBoost !== undefined) {
      this.trebleFilter.gain.setTargetAtTime(params.trebleBoost, t, rampTime)
    }

    if (params.formantF1 !== undefined) {
      this.formantF1.gain.setTargetAtTime(params.formantF1, t, rampTime)
    }
    if (params.formantF2 !== undefined) {
      this.formantF2.gain.setTargetAtTime(params.formantF2, t, rampTime)
    }

    if (params.robotMix !== undefined) {
      this.robotWetGain.gain.setTargetAtTime(params.robotMix, t, rampTime)
      this.robotDryGain.gain.setTargetAtTime(1.0 - params.robotMix * 0.6, t, rampTime)
    }
    if (params.robotFreq !== undefined) {
      this.robotOsc.frequency.setTargetAtTime(params.robotFreq, t, rampTime)
    }

    if (params.echoMix !== undefined) {
      this.echoWetGain.gain.setTargetAtTime(params.echoMix, t, rampTime)
    }

    if (params.distortion !== undefined && this.waveShaper) {
      this.waveShaper.curve = this._makeDistortionCurve(params.distortion)
    }
  }

  /**
   * Menyiapkan elemen audio output ke VB-CABLE Input
   * @private
   */
  _attachStreamToAudioElement(stream) {
    if (!this.virtualAudioEl) {
      this.virtualAudioEl = document.createElement('audio')
      this.virtualAudioEl.autoplay = true
      document.body.appendChild(this.virtualAudioEl)
    }

    this.virtualAudioEl.srcObject = stream
    this.virtualAudioEl.muted = false
    this.virtualAudioEl.volume = 1.0

    this.virtualAudioEl.play().catch(() => {})
  }

  /**
   * Mencari dan menghubungkan VB-CABLE Input secara otomatis
   * @private
   */
  async _bindCableOutputImmediate() {
    if (!navigator.mediaDevices?.enumerateDevices) return

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cableIn = devices.find((d) => {
        if (d.kind !== 'audiooutput') return false
        const label = d.label.toLowerCase()
        return (
          label.includes('cable input') ||
          label.includes('vb-audio') ||
          (label.includes('cable') && !label.includes('output'))
        )
      })

      if (cableIn) {
        this.targetOutputDeviceId = cableIn.deviceId
        this.isCableConnected = true

        if (this.virtualAudioEl && typeof this.virtualAudioEl.setSinkId === 'function') {
          await this.virtualAudioEl.setSinkId(cableIn.deviceId)
          this.virtualAudioEl.muted = false
          this.virtualAudioEl.volume = 1.0
          await this.virtualAudioEl.play().catch(() => {})
        }

        if (this.audioContext && typeof this.audioContext.setSinkId === 'function') {
          await this.audioContext.setSinkId(cableIn.deviceId).catch(() => {})
        }
      } else {
        this.isCableConnected = false
      }
    } catch (err) {
      console.warn('Gagal autobind cable:', err)
    }
  }

  /**
   * Mengatur tujuan perutean output (CABLE Input untuk Meeting)
   * @param {string} deviceId - ID perangkat audio tujuan
   */
  async setOutputDevice(deviceId) {
    this.targetOutputDeviceId = deviceId
    if (this.virtualAudioEl && typeof this.virtualAudioEl.setSinkId === 'function') {
      try {
        await this.virtualAudioEl.setSinkId(deviceId)
        this.virtualAudioEl.muted = false
        this.virtualAudioEl.volume = 1.0
        await this.virtualAudioEl.play().catch(() => {})
        return true
      } catch (err) {
        console.warn('Gagal setSinkId:', err)
        return false
      }
    }
    return false
  }

  /**
   * Mengaktifkan/menonaktifkan monitor suara sendiri ke headphone pengguna
   * @param {boolean} enabled - True jika ingin mendengarkan suara sendiri
   */
  setMonitoring(enabled) {
    this.isMonitoring = enabled
    if (this.monitorGain && this.audioContext) {
      const ctx = this.audioContext
      this.monitorGain.gain.setTargetAtTime(enabled ? 1.0 : 0.0, ctx.currentTime, 0.05)
    }
  }

  /**
   * Mengatur volume mikrofon masukan
   * @param {number} volume - Skala 0 hingga 2.0 (1.0 = normal)
   */
  setInputVolume(volume) {
    if (this.inputGain && this.audioContext) {
      const ctx = this.audioContext
      this.inputGain.gain.setTargetAtTime(this.isMuted ? 0 : volume, ctx.currentTime, 0.02)
    }
  }

  /**
   * Mengatur Mute/Unmute
   * @param {boolean} muted - True jika ingin membisukan mic
   */
  setMuted(muted) {
    this.isMuted = muted
    if (this.inputGain && this.audioContext) {
      const ctx = this.audioContext
      this.inputGain.gain.setTargetAtTime(muted ? 0 : 1.0, ctx.currentTime, 0.02)
    }
  }

  /**
   * Mendapatkan data frekuensi real-time untuk visualizer
   * @param {Uint8Array} array - Target buffer array frekuensi
   */
  getFrequencyData(array) {
    if (this.analyser && this.isRunning) {
      this.analyser.getByteFrequencyData(array)
    }
  }

  /**
   * Mendapatkan data time-domain gelombang vokal (waveform)
   * @param {Uint8Array} array - Target buffer array gelombang
   */
  getTimeDomainData(array) {
    if (this.analyser && this.isRunning) {
      this.analyser.getByteTimeDomainData(array)
    }
  }

  /**
   * Menghentikan seluruh proses audio dan melepaskan mic
   */
  stop() {
    this.isRunning = false

    if (this.gateCheckInterval) {
      clearInterval(this.gateCheckInterval)
      this.gateCheckInterval = null
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
      this.mediaStream = null
    }

    if (this.audioContext) {
      try {
        this.audioContext.close()
      } catch { /* ignore */ }
      this.audioContext = null
    }

    if (this.virtualAudioEl) {
      this.virtualAudioEl.srcObject = null
      this.virtualAudioEl.remove()
      this.virtualAudioEl = null
    }
  }
}

// Instance singleton
export const audioEngine = new AudioEngine()
