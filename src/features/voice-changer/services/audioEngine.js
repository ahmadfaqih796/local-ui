import { JunglePitchShifter } from './pitchShifter'

/**
 * Mesin Audio Real-time Web Audio API
 * Didesain khusus dengan:
 * 1. Pitch Shifter Granular Sinkron (Jungle Algorithm - Chris Rogers & Chris Wilson / Google)
 *    Equal-Power Crossfade & Synchronized Dual-Delay untuk suara jernih bebas klik & bebas kresek.
 * 2. Dedicated Bypass untuk Mode Normal (Zero Delay & Bit-Perfect Studio Sound).
 * 3. Balanced Ring Modulator untuk Efek Robot Futuristik yang jelas dan tidak berdengung.
 * 4. Dynamics Compressor Studio Limiter (Mencegah distorsi pecah/clipping).
 * 5. Automatic Noise Gate (Menahan bocoran suara ruangan dan desis mikrofon).
 * 6. Isolasi Jalur 1-Arah Otomatis ke VB-CABLE Input (Meeting).
 */

class AudioEngine {
  constructor() {
    this.audioContext = null
    this.mediaStream = null
    this.sourceNode = null

    // Node Noise Gate
    this.gateGain = null
    this.gateAnalyser = null
    this.gateThreshold = 0.018
    this.isGateOpen = true
    this.gateCheckInterval = null

    // Node Input & Filter Studio EQ
    this.inputGain = null
    this.highPassFilter = null
    this.lowPassFilter = null
    this.bassFilter = null
    this.trebleFilter = null
    this.formantF1 = null
    this.formantF2 = null

    // Node Pitch Shifter
    this.pitchShifter = null
    this.dryGain = null
    this.pitchMixGain = null
    this.pitchSumGain = null

    // Node Efek Robot (Balanced Modulator)
    this.robotOsc = null
    this.robotOscGain = null
    this.robotModNode = null
    this.robotBandFilter = null
    this.robotDryGain = null
    this.robotWetGain = null
    this.robotOutputGain = null

    // Node Efek Echo / Ruang
    this.echoDelay = null
    this.echoFeedback = null
    this.echoWetGain = null

    // Node Efek Distorsi / Saturasi
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

    // 2. High-Pass Filter (Memotong dengung getaran meja & sub-bass)
    this.highPassFilter = ctx.createBiquadFilter()
    this.highPassFilter.type = 'highpass'
    this.highPassFilter.frequency.setValueAtTime(80, ctx.currentTime)

    // 3. Low-Pass Filter (Memotong desis frekuensi ultra-tinggi)
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

    // 6. Formant Filter F1 (Peaking 1200Hz - Vokal Tengah / Tenggorokan)
    this.formantF1 = ctx.createBiquadFilter()
    this.formantF1.type = 'peaking'
    this.formantF1.frequency.setValueAtTime(1200, ctx.currentTime)
    this.formantF1.Q.setValueAtTime(1.4, ctx.currentTime)
    this.formantF1.gain.setValueAtTime(0, ctx.currentTime)

    // 7. Formant Filter F2 (Peaking 2600Hz - Kelembutan / Artikulasi Vokal)
    this.formantF2 = ctx.createBiquadFilter()
    this.formantF2.type = 'peaking'
    this.formantF2.frequency.setValueAtTime(2600, ctx.currentTime)
    this.formantF2.Q.setValueAtTime(1.6, ctx.currentTime)
    this.formantF2.gain.setValueAtTime(0, ctx.currentTime)

    // 8. Pitch Shifter (Jungle Synchronized Granular)
    this.pitchShifter = new JunglePitchShifter(ctx)

    this.dryGain = ctx.createGain()
    this.pitchMixGain = ctx.createGain()
    this.pitchSumGain = ctx.createGain()

    this.dryGain.gain.setValueAtTime(1.0, ctx.currentTime)
    this.pitchMixGain.gain.setValueAtTime(0.0, ctx.currentTime)
    this.pitchSumGain.gain.setValueAtTime(1.0, ctx.currentTime)

    this.dryGain.connect(this.pitchSumGain)
    this.pitchShifter.output.connect(this.pitchMixGain)
    this.pitchMixGain.connect(this.pitchSumGain)

    // 9. Robot Modulator (Balanced Modulator / Ring Modulator)
    this._setupRobotModulator(ctx)

    // 10. Echo / Ruangan (Reverb Delay)
    this.echoDelay = ctx.createDelay(1.0)
    this.echoDelay.delayTime.setValueAtTime(0.08, ctx.currentTime) // 80ms slapback
    this.echoFeedback = ctx.createGain()
    this.echoFeedback.gain.setValueAtTime(0.12, ctx.currentTime)
    this.echoWetGain = ctx.createGain()
    this.echoWetGain.gain.setValueAtTime(0, ctx.currentTime)

    this.echoDelay.connect(this.echoFeedback)
    this.echoFeedback.connect(this.echoDelay)
    this.echoDelay.connect(this.echoWetGain)

    // 11. WaveShaper Distorsi / Saturasi Halus
    this.waveShaper = ctx.createWaveShaper()
    this.waveShaper.curve = null
    this.waveShaper.oversample = '2x'

    // 12. DYNAMICS COMPRESSOR (Studio Limiter anti-kresek / anti-pecah)
    this.compressor = ctx.createDynamicsCompressor()
    this.compressor.threshold.setValueAtTime(-14, ctx.currentTime)
    this.compressor.knee.setValueAtTime(8, ctx.currentTime)
    this.compressor.ratio.setValueAtTime(4.5, ctx.currentTime)
    this.compressor.attack.setValueAtTime(0.003, ctx.currentTime)
    this.compressor.release.setValueAtTime(0.10, ctx.currentTime)

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

    // Hubungkan Rantai Suara Lengkap
    this.sourceNode.connect(this.gateAnalyser)
    this.sourceNode.connect(this.gateGain)
    this.gateGain.connect(this.inputGain)

    this.inputGain.connect(this.highPassFilter)
    this.highPassFilter.connect(this.lowPassFilter)
    this.lowPassFilter.connect(this.bassFilter)
    this.bassFilter.connect(this.trebleFilter)
    this.trebleFilter.connect(this.formantF1)
    this.formantF1.connect(this.formantF2)

    // Formant F2 terhubung ke jalur Dry dan Pitch Shifter
    this.formantF2.connect(this.dryGain)
    this.formantF2.connect(this.pitchShifter.input)

    // Pitch Sum -> Robot Modulator
    this.pitchSumGain.connect(this.robotDryGain)
    this.pitchSumGain.connect(this.robotModNode)

    // Robot Output -> WaveShaper & Echo
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
   * Menyiapkan Balanced Ring Modulator untuk Efek Robot Futuristik
   * @private
   */
  _setupRobotModulator(ctx) {
    this.robotOsc = ctx.createOscillator()
    this.robotOsc.type = 'sine'
    this.robotOsc.frequency.setValueAtTime(48, ctx.currentTime)

    this.robotOscGain = ctx.createGain()
    this.robotOscGain.gain.setValueAtTime(1.0, ctx.currentTime)
    this.robotOsc.connect(this.robotOscGain)

    this.robotModNode = ctx.createGain()
    this.robotModNode.gain.setValueAtTime(0.0, ctx.currentTime)
    this.robotOscGain.connect(this.robotModNode.gain)

    // Filter potong sub-bass modulasi agar tidak berdengung
    this.robotBandFilter = ctx.createBiquadFilter()
    this.robotBandFilter.type = 'highpass'
    this.robotBandFilter.frequency.setValueAtTime(160, ctx.currentTime)

    this.robotDryGain = ctx.createGain()
    this.robotWetGain = ctx.createGain()
    this.robotOutputGain = ctx.createGain()

    this.robotDryGain.gain.setValueAtTime(1.0, ctx.currentTime)
    this.robotWetGain.gain.setValueAtTime(0.0, ctx.currentTime)
    this.robotOutputGain.gain.setValueAtTime(1.0, ctx.currentTime)

    this.robotModNode.connect(this.robotBandFilter)
    this.robotBandFilter.connect(this.robotWetGain)

    this.robotDryGain.connect(this.robotOutputGain)
    this.robotWetGain.connect(this.robotOutputGain)

    this.robotOsc.start(0)
  }

  /**
   * Membuat kurva transfer distorsi saturasi halus (anti-clipping)
   * @private
   */
  _makeDistortionCurve(amount) {
    if (!amount || amount <= 0.001) {
      return null
    }
    const n = 2048
    const curve = new Float32Array(n)
    const drive = 1 + amount * 3.5
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1
      curve[i] = Math.tanh(x * drive) / Math.tanh(drive)
    }
    return curve
  }

  /**
   * Loop Noise Gate otomatis
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
          this.gateGain.gain.setTargetAtTime(0.0, ctx.currentTime, 0.04)
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
    const rampTime = 0.02

    this.currentParams = params

    // 1. Pitch Shifter Routing
    const semitones = params.pitchSemitones ?? 0
    if (Math.abs(semitones) < 0.1) {
      // Bypass 100% jika semitone 0 (Normal Studio Clean)
      this.dryGain.gain.setTargetAtTime(1.0, t, rampTime)
      this.pitchMixGain.gain.setTargetAtTime(0.0, t, rampTime)
      if (this.pitchShifter) {
        this.pitchShifter.setPitchSemitones(0)
      }
    } else {
      // Alihkan ke Pitch Shifter
      this.dryGain.gain.setTargetAtTime(0.0, t, rampTime)
      this.pitchMixGain.gain.setTargetAtTime(1.0, t, rampTime)
      if (this.pitchShifter) {
        this.pitchShifter.setPitchSemitones(semitones)
      }
    }

    // 2. Filter Frekuensi
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

    // 3. Efek Robot
    if (params.robotMix !== undefined && this.robotWetGain && this.robotDryGain) {
      const rMix = params.robotMix
      this.robotWetGain.gain.setTargetAtTime(rMix * 0.9, t, rampTime)
      this.robotDryGain.gain.setTargetAtTime(1.0 - rMix * 0.5, t, rampTime)
    }
    if (params.robotFreq !== undefined && this.robotOsc) {
      this.robotOsc.frequency.setTargetAtTime(params.robotFreq, t, rampTime)
    }

    // 4. Efek Echo / Pantulan
    if (params.echoMix !== undefined && this.echoWetGain) {
      this.echoWetGain.gain.setTargetAtTime(params.echoMix, t, rampTime)
    }

    // 5. Efek Distorsi Saturasi
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

    if (this.pitchShifter) {
      this.pitchShifter.stop()
      this.pitchShifter = null
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
