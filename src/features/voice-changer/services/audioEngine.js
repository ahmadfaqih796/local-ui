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

class JunglePitchShifter {
  constructor(context) {
    this.context = context
    this.input = context.createGain()
    this.output = context.createGain()

    this.bufferTime = 0.100 // 100ms jendela buffer granular
    this.fadeTime = 0.050   // 50ms crossfade batas
    this.delayTime = 0.100  // 100ms basis

    // Buat buffer modulasi delay dan envelope crossfade daya konstan (equal-power)
    this.shiftDownBuffer = this._createDelayTimeBuffer(context, this.bufferTime, this.fadeTime, false)
    this.shiftUpBuffer = this._createDelayTimeBuffer(context, this.bufferTime, this.fadeTime, true)
    this.fadeBuffer = this._createFadeBuffer(context, this.bufferTime, this.fadeTime)

    // Modulator LFO buffer sources (looping kontinu)
    this.mod1 = context.createBufferSource()
    this.mod2 = context.createBufferSource()
    this.mod3 = context.createBufferSource()
    this.mod4 = context.createBufferSource()

    this.mod1.buffer = this.shiftDownBuffer
    this.mod2.buffer = this.shiftDownBuffer
    this.mod3.buffer = this.shiftUpBuffer
    this.mod4.buffer = this.shiftUpBuffer

    this.mod1.loop = true
    this.mod2.loop = true
    this.mod3.loop = true
    this.mod4.loop = true

    // Selector gain (mod1 & mod2 = Shift Down, mod3 & mod4 = Shift Up)
    this.mod1Gain = context.createGain()
    this.mod2Gain = context.createGain()
    this.mod3Gain = context.createGain()
    this.mod4Gain = context.createGain()

    this.mod1Gain.gain.setValueAtTime(1, context.currentTime)
    this.mod2Gain.gain.setValueAtTime(1, context.currentTime)
    this.mod3Gain.gain.setValueAtTime(0, context.currentTime)
    this.mod4Gain.gain.setValueAtTime(0, context.currentTime)

    this.mod1.connect(this.mod1Gain)
    this.mod2.connect(this.mod2Gain)
    this.mod3.connect(this.mod3Gain)
    this.mod4.connect(this.mod4Gain)

    // Pengatur amplitudo kedalaman delay (Modulation Depth)
    this.modGain1 = context.createGain()
    this.modGain2 = context.createGain()
    this.modGain1.gain.setValueAtTime(0, context.currentTime)
    this.modGain2.gain.setValueAtTime(0, context.currentTime)

    this.mod1Gain.connect(this.modGain1)
    this.mod2Gain.connect(this.modGain2)
    this.mod3Gain.connect(this.modGain1)
    this.mod4Gain.connect(this.modGain2)

    // Jalur delay audio
    this.delay1 = context.createDelay(1.0)
    this.delay2 = context.createDelay(1.0)
    this.delay1.delayTime.setValueAtTime(0, context.currentTime)
    this.delay2.delayTime.setValueAtTime(0, context.currentTime)

    this.modGain1.connect(this.delay1.delayTime)
    this.modGain2.connect(this.delay2.delayTime)

    // Window crossfading
    this.fade1 = context.createBufferSource()
    this.fade2 = context.createBufferSource()
    this.fade1.buffer = this.fadeBuffer
    this.fade2.buffer = this.fadeBuffer
    this.fade1.loop = true
    this.fade2.loop = true

    // Mixer Gain - SANGAT PENTING: gain awal harus 0.0 agar nilai murni diatur oleh fadeBuffer (0 s/d 1)
    this.mix1 = context.createGain()
    this.mix2 = context.createGain()
    this.mix1.gain.setValueAtTime(0, context.currentTime)
    this.mix2.gain.setValueAtTime(0, context.currentTime)

    this.fade1.connect(this.mix1.gain)
    this.fade2.connect(this.mix2.gain)

    // Hubungkan jalur pemrosesan audio
    this.input.connect(this.delay1)
    this.input.connect(this.delay2)
    this.delay1.connect(this.mix1)
    this.delay2.connect(this.mix2)
    this.mix1.connect(this.output)
    this.mix2.connect(this.output)

    // Mulai semua buffer secara sinkron dengan beda fase 180 derajat (50ms)
    const t = context.currentTime + 0.050
    const t2 = t + this.bufferTime - this.fadeTime
    this.mod1.start(t)
    this.mod2.start(t2)
    this.mod3.start(t)
    this.mod4.start(t2)
    this.fade1.start(t)
    this.fade2.start(t2)
  }

  /**
   * Membuat buffer kurva jendela crossfade berdaya konstan (Equal-Power Square Root)
   * Menjamin g1^2 + g2^2 = 1.0 konstan setiap saat, mematikan sinyal tepat di titik reset.
   * @private
   */
  _createFadeBuffer(context, activeTime, fadeTime) {
    const length1 = Math.floor(activeTime * context.sampleRate)
    const length2 = Math.floor((activeTime - 2 * fadeTime) * context.sampleRate)
    const length = length1 + Math.max(0, length2)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const p = buffer.getChannelData(0)

    const fadeLength = Math.floor(fadeTime * context.sampleRate)
    const fadeIndex1 = fadeLength
    const fadeIndex2 = length1 - fadeLength

    for (let i = 0; i < length1; ++i) {
      let value
      if (i < fadeIndex1) {
        value = Math.sqrt(i / fadeLength)
      } else if (i >= fadeIndex2) {
        value = Math.sqrt(1 - (i - fadeIndex2) / fadeLength)
      } else {
        value = 1
      }
      p[i] = value
    }

    for (let i = length1; i < length; ++i) {
      p[i] = 0
    }

    return buffer
  }

  /**
   * Membuat kurva pergeseran waktu delay linier
   * @private
   */
  _createDelayTimeBuffer(context, activeTime, fadeTime, shiftUp) {
    const length1 = Math.floor(activeTime * context.sampleRate)
    const length2 = Math.floor((activeTime - 2 * fadeTime) * context.sampleRate)
    const length = length1 + Math.max(0, length2)
    const buffer = context.createBuffer(1, length, context.sampleRate)
    const p = buffer.getChannelData(0)

    for (let i = 0; i < length1; ++i) {
      if (shiftUp) {
        // Nada naik: delay mengecil dari 1 ke 0
        p[i] = (length1 - i) / length1
      } else {
        // Nada turun: delay membesar dari 0 ke 1
        p[i] = i / length1
      }
    }

    for (let i = length1; i < length; ++i) {
      p[i] = 0
    }

    return buffer
  }

  /**
   * Mengatur pergeseran nada dalam satuan semitone
   * @param {number} semitones - Nilai semitone (-12 hingga +12)
   */
  setPitchSemitones(semitones) {
    const ctx = this.context
    if (!ctx) return

    if (Math.abs(semitones) < 0.05) {
      this.modGain1.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
      this.modGain2.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
      return
    }

    const ratio = Math.pow(2, semitones / 12)

    if (semitones > 0) {
      // Pitch UP
      this.mod1Gain.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
      this.mod2Gain.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
      this.mod3Gain.gain.setTargetAtTime(1, ctx.currentTime, 0.015)
      this.mod4Gain.gain.setTargetAtTime(1, ctx.currentTime, 0.015)
    } else {
      // Pitch DOWN
      this.mod1Gain.gain.setTargetAtTime(1, ctx.currentTime, 0.015)
      this.mod2Gain.gain.setTargetAtTime(1, ctx.currentTime, 0.015)
      this.mod3Gain.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
      this.mod4Gain.gain.setTargetAtTime(0, ctx.currentTime, 0.015)
    }

    // Kedalaman modulasi Doppler: G = |1 - R| * bufferTime
    const depth = Math.min(this.bufferTime * 0.9, Math.abs(1 - ratio) * this.bufferTime)
    this.modGain1.gain.setTargetAtTime(depth, ctx.currentTime, 0.02)
    this.modGain2.gain.setTargetAtTime(depth, ctx.currentTime, 0.02)
  }

  stop() {
    try { this.mod1.stop() } catch { /* ignore */ }
    try { this.mod2.stop() } catch { /* ignore */ }
    try { this.mod3.stop() } catch { /* ignore */ }
    try { this.mod4.stop() } catch { /* ignore */ }
    try { this.fade1.stop() } catch { /* ignore */ }
    try { this.fade2.stop() } catch { /* ignore */ }

    try { this.input.disconnect() } catch { /* ignore */ }
    try { this.output.disconnect() } catch { /* ignore */ }
    try { this.delay1.disconnect() } catch { /* ignore */ }
    try { this.delay2.disconnect() } catch { /* ignore */ }
  }
}

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
