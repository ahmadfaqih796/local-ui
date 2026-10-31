import { JunglePitchShifter } from './pitchShifter'

/**
 * Service Pemutar Uji Coba Audio Demo Sandbox (10 Detik Playground)
 * Merekam vokal mikrofon langsung di browser, memprosesnya dengan efek vokal
 * (Pitch Shift, Formant Shaping, EQ Bass/Treble, Robot Ring Modulator, Limiter),
 * dan memutarnya ke speaker/headphone pengguna secara instan tanpa perlu VB-Cable.
 */
class AudioDemoPlayer {
  constructor() {
    this.audioContext = null
    this.currentSource = null
    this.currentPitchShifter = null
    this.robotOsc = null
    this.isPlaying = false
    this.isRecording = false
    this.mediaRecorder = null
    this.recordTimer = null
  }

  /**
   * Menginisialisasi atau melanjutkan AudioContext
   * @private
   */
  _ensureContext() {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      this.audioContext = new AudioCtx({ latencyHint: 'interactive' })
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {})
    }
    return this.audioContext
  }

  /**
   * Merekam suara pengguna dari mikrofon selama durasi tertentu (5 - 10 detik)
   * @param {number} durationSeconds - Durasi rekam dalam detik (default: 5)
   * @param {Function} onProgress - Callback progres detik hitung mundur (remaining, total)
   * @returns {Promise<AudioBuffer>} Buffer audio hasil rekaman
   */
  async recordSample(durationSeconds = 5, onProgress = () => {}) {
    this.stop()
    const ctx = this._ensureContext()

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Browser Anda tidak mendukung perekaman mikrofon.')
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    })

    return new Promise((resolve, reject) => {
      try {
        let mimeType = 'audio/webm'
        if (typeof MediaRecorder.isTypeSupported === 'function') {
          if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
            mimeType = 'audio/webm;codecs=opus'
          } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
            mimeType = 'audio/ogg;codecs=opus'
          }
        }

        const recorder = new MediaRecorder(stream, { mimeType })
        this.mediaRecorder = recorder
        this.isRecording = true

        const chunks = []
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            chunks.push(e.data)
          }
        }

        let remaining = durationSeconds
        onProgress(remaining, durationSeconds)

        this.recordTimer = setInterval(() => {
          remaining -= 1
          onProgress(Math.max(0, remaining), durationSeconds)
          if (remaining <= 0) {
            clearInterval(this.recordTimer)
            this.recordTimer = null
            if (recorder.state === 'recording') {
              recorder.stop()
            }
          }
        }, 1000)

        recorder.onstop = async () => {
          this.isRecording = false
          // Segera matikan stream mikrofon agar tidak ada kebocoran
          stream.getTracks().forEach((track) => track.stop())

          try {
            const blob = new Blob(chunks, { type: mimeType })
            const arrayBuffer = await blob.arrayBuffer()
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer)
            resolve(audioBuffer)
          } catch (decodeErr) {
            reject(new Error(`Gagal memproses data audio rekaman: ${decodeErr.message}`))
          }
        }

        recorder.onerror = (err) => {
          this.isRecording = false
          stream.getTracks().forEach((track) => track.stop())
          reject(err)
        }

        recorder.start(100)
      } catch (err) {
        this.isRecording = false
        stream.getTracks().forEach((track) => track.stop())
        reject(err)
      }
    })
  }

  /**
   * Membuat audio sampel buatan (sintesis harmonik vokal)
   * Berguna saat mic tidak diizinkan atau ingin uji coba 1-klik instan
   * @returns {AudioBuffer}
   */
  generateSpeechSample() {
    const ctx = this._ensureContext()
    const sampleRate = ctx.sampleRate
    const duration = 4.0 // 4 detik
    const buffer = ctx.createBuffer(1, Math.floor(sampleRate * duration), sampleRate)
    const data = buffer.getChannelData(0)

    // Nada bicara vokal berirama (harmoni melodi vokal)
    const melody = [
      { f: 220, t: 0.8 }, // A3
      { f: 261, t: 0.8 }, // C4
      { f: 293, t: 0.8 }, // D4
      { f: 330, t: 1.6 }, // E4
    ]

    let sampleIdx = 0
    for (const note of melody) {
      const noteSamples = Math.floor(note.t * sampleRate)
      for (let i = 0; i < noteSamples && sampleIdx < data.length; i++, sampleIdx++) {
        const time = i / sampleRate
        // Envelope Attack & Decay
        const env = Math.sin((Math.PI * i) / noteSamples)
        // Harmoni formant kaya vokal (Sawtooth + Harmonics)
        const fundamental = Math.sin(2 * Math.PI * note.f * time)
        const h2 = 0.5 * Math.sin(2 * Math.PI * (note.f * 2) * time)
        const h3 = 0.3 * Math.sin(2 * Math.PI * (note.f * 3) * time)
        const h4 = 0.15 * Math.sin(2 * Math.PI * (note.f * 4) * time)
        data[sampleIdx] = (fundamental + h2 + h3 + h4) * env * 0.45
      }
    }

    return buffer
  }

  /**
   * Memainkan AudioBuffer dengan rantai efek vokal yang dipilih ke speaker/headphone
   * @param {AudioBuffer} audioBuffer - Buffer suara rekaman
   * @param {Object} params - Parameter efek vokal preset
   * @param {Function} onEnded - Callback saat audio selesai berputar
   */
  play(audioBuffer, params = {}, onEnded = () => {}) {
    this.stop()
    if (!audioBuffer) return

    const ctx = this._ensureContext()
    const t = ctx.currentTime

    // 1. Source Node dari AudioBuffer
    const source = ctx.createBufferSource()
    source.buffer = audioBuffer
    this.currentSource = source

    // 2. Highpass Filter
    const highPass = ctx.createBiquadFilter()
    highPass.type = 'highpass'
    highPass.frequency.setValueAtTime(params.highPassFreq ?? 80, t)

    // 3. Lowpass Filter
    const lowPass = ctx.createBiquadFilter()
    lowPass.type = 'lowpass'
    lowPass.frequency.setValueAtTime(params.lowPassFreq ?? 14000, t)

    // 4. Bass EQ
    const bass = ctx.createBiquadFilter()
    bass.type = 'lowshelf'
    bass.frequency.setValueAtTime(150, t)
    bass.gain.setValueAtTime(params.bassBoost ?? 0, t)

    // 5. Treble EQ
    const treble = ctx.createBiquadFilter()
    treble.type = 'highshelf'
    treble.frequency.setValueAtTime(4500, t)
    treble.gain.setValueAtTime(params.trebleBoost ?? 0, t)

    // 6. Formants F1 & F2
    const formantF1 = ctx.createBiquadFilter()
    formantF1.type = 'peaking'
    formantF1.frequency.setValueAtTime(1200, t)
    formantF1.Q.setValueAtTime(1.4, t)
    formantF1.gain.setValueAtTime(params.formantF1 ?? 0, t)

    const formantF2 = ctx.createBiquadFilter()
    formantF2.type = 'peaking'
    formantF2.frequency.setValueAtTime(2600, t)
    formantF2.Q.setValueAtTime(1.6, t)
    formantF2.gain.setValueAtTime(params.formantF2 ?? 0, t)

    // 7. Pitch Shifter Routing
    const semitones = params.pitchSemitones ?? 0
    let pitchNodeInput
    let pitchNodeOutput

    if (Math.abs(semitones) < 0.1) {
      // Normal Bypass
      const bypassGain = ctx.createGain()
      bypassGain.gain.setValueAtTime(1.0, t)
      pitchNodeInput = bypassGain
      pitchNodeOutput = bypassGain
    } else {
      const pitchShifter = new JunglePitchShifter(ctx)
      pitchShifter.setPitchSemitones(semitones)
      this.currentPitchShifter = pitchShifter
      pitchNodeInput = pitchShifter.input
      pitchNodeOutput = pitchShifter.output
    }

    // 8. Robot Ring Modulator (Opsional jika robotMix > 0)
    let robotOutputNode
    const robotMix = params.robotMix ?? 0

    if (robotMix > 0.05) {
      const robotCarrier = ctx.createOscillator()
      robotCarrier.type = 'sine'
      robotCarrier.frequency.setValueAtTime(params.robotFreq ?? 48, t)

      const robotModNode = ctx.createGain()
      robotModNode.gain.setValueAtTime(0.0, t)
      robotCarrier.connect(robotModNode.gain)

      const robotHighpass = ctx.createBiquadFilter()
      robotHighpass.type = 'highpass'
      robotHighpass.frequency.setValueAtTime(160, t)
      robotModNode.connect(robotHighpass)

      const wetGain = ctx.createGain()
      const dryGain = ctx.createGain()
      const mixSum = ctx.createGain()

      wetGain.gain.setValueAtTime(robotMix * 0.9, t)
      dryGain.gain.setValueAtTime(1.0 - robotMix * 0.5, t)

      robotHighpass.connect(wetGain)
      wetGain.connect(mixSum)
      dryGain.connect(mixSum)

      pitchNodeOutput.connect(robotModNode)
      pitchNodeOutput.connect(dryGain)

      robotCarrier.start(0)
      this.robotOsc = robotCarrier
      robotOutputNode = mixSum
    } else {
      robotOutputNode = pitchNodeOutput
    }

    // 9. Dynamics Compressor (Limiter)
    const compressor = ctx.createDynamicsCompressor()
    compressor.threshold.setValueAtTime(-14, t)
    compressor.knee.setValueAtTime(8, t)
    compressor.ratio.setValueAtTime(4.5, t)
    compressor.attack.setValueAtTime(0.003, t)
    compressor.release.setValueAtTime(0.10, t)

    // 10. Master Gain Output
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(1.1, t)

    // Sambungkan seluruh rantai audio
    source.connect(highPass)
    highPass.connect(lowPass)
    lowPass.connect(bass)
    bass.connect(treble)
    treble.connect(formantF1)
    formantF1.connect(formantF2)
    formantF2.connect(pitchNodeInput)
    robotOutputNode.connect(compressor)
    compressor.connect(masterGain)
    masterGain.connect(ctx.destination)

    this.isPlaying = true

    source.onended = () => {
      this.isPlaying = false
      if (this.currentPitchShifter) {
        this.currentPitchShifter.stop()
        this.currentPitchShifter = null
      }
      if (this.robotOsc) {
        try { this.robotOsc.stop() } catch { /* ignore */ }
        this.robotOsc = null
      }
      onEnded()
    }

    source.start(0)
  }

  /**
   * Menghentikan pemutaran audio demo saat ini
   */
  stop() {
    if (this.currentSource) {
      try { this.currentSource.stop() } catch { /* ignore */ }
      this.currentSource = null
    }
    if (this.currentPitchShifter) {
      try { this.currentPitchShifter.stop() } catch { /* ignore */ }
      this.currentPitchShifter = null
    }
    if (this.robotOsc) {
      try { this.robotOsc.stop() } catch { /* ignore */ }
      this.robotOsc = null
    }
    if (this.recordTimer) {
      clearInterval(this.recordTimer)
      this.recordTimer = null
    }
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      try { this.mediaRecorder.stop() } catch { /* ignore */ }
    }
    this.isPlaying = false
    this.isRecording = false
  }
}

// Instance singleton
export const audioDemoPlayer = new AudioDemoPlayer()
