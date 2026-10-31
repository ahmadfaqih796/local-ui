/**
 * Pitch Shifter Granular Sinkron (Jungle Algorithm - Chris Rogers & Chris Wilson / Google)
 * Menggunakan Equal-Power Crossfade & Synchronized Dual-Delay untuk suara jernih bebas klik & bebas kresek.
 */
export class JunglePitchShifter {
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

    // Mixer Gain - gain awal 0.0 agar nilai murni diatur oleh fadeBuffer (0 s/d 1)
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

