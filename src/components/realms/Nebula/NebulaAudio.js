/**
 * NebulaAudio.js — Realm 5: The Nebula
 * All Web Audio API. All procedurally generated. No audio files.
 *
 * Architecture:
 *   - Nebula hum: 3 oscillators (55/82/110 Hz) with convolution reverb
 *   - Per-morph collapse sounds (unique signature per act)
 *   - Supernova: sub-bass hit + noise burst + shimmer rise + 2s silence
 *   - Star field: hum fades in 4s after supernova silence
 */

export class NebulaAudio {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.humGain = null
    this.humOscillators = []
    this.convolver = null
    this.initialized = false
    this._currentMorph = -1
    this._humFadeTimeout = null
  }

  // ──────────────────────────────────────────────────────────
  // INIT
  // ──────────────────────────────────────────────────────────

  async init() {
    if (this.initialized) return
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      if (this.ctx.state === 'suspended') await this.ctx.resume()

      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.85
      this.masterGain.connect(this.ctx.destination)

      // Build reverb
      this.convolver = this._makeReverb(8.0)
      const reverbGain = this.ctx.createGain()
      reverbGain.gain.value = 0.4
      this.convolver.connect(reverbGain)
      reverbGain.connect(this.masterGain)

      // Build hum
      this._buildHum()

      this.initialized = true
    } catch (e) {
      console.warn('[NebulaAudio] init failed:', e)
    }
  }

  // ──────────────────────────────────────────────────────────
  // HUM
  // ──────────────────────────────────────────────────────────

  _buildHum() {
    const freqs = [55, 82, 110]
    this.humGain = this.ctx.createGain()
    this.humGain.gain.value = 0.015
    this.humGain.connect(this.masterGain)
    this.humGain.connect(this.convolver)

    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(this.humGain)
      osc.start()
      this.humOscillators.push(osc)
    })
  }

  setHumVolume(vol, rampTime = 0.5) {
    if (!this.initialized || !this.humGain) return
    this.humGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.humGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + rampTime)
  }

  // ──────────────────────────────────────────────────────────
  // CONVOLUTION REVERB (procedural impulse response)
  // ──────────────────────────────────────────────────────────

  _makeReverb(durationSecs) {
    const sampleRate = this.ctx.sampleRate
    const length = Math.floor(sampleRate * durationSecs)
    const impulse = this.ctx.createBuffer(2, length, sampleRate)

    for (let c = 0; c < 2; c++) {
      const channel = impulse.getChannelData(c)
      for (let i = 0; i < length; i++) {
        const t = i / length
        // Exponential decay with random noise
        channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.5)
      }
    }

    const conv = this.ctx.createConvolver()
    conv.buffer = impulse
    return conv
  }

  // ──────────────────────────────────────────────────────────
  // PER-MORPH COLLAPSE SOUNDS
  // ──────────────────────────────────────────────────────────

  triggerMorph(morphIndex) {
    if (!this.initialized || this._currentMorph === morphIndex) return
    this._currentMorph = morphIndex
    const now = this.ctx.currentTime

    switch (morphIndex) {
      case 1: this._morphSound_Name(now); break
      case 2: this._morphSound_Title(now); break
      case 3: this._morphSound_Manifesto(now); break
      case 4: this._morphSound_ThreeWords(now); break
      case 5: this._morphSound_Sigil(now); break
    }
  }

  // Morph 1 — NAME: sine sweep 80→400Hz, 1.2s
  _morphSound_Name(now) {
    const g = this._gain(0.08, now)
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(80, now)
    osc.frequency.exponentialRampToValueAtTime(400, now + 1.2)
    g.gain.setValueAtTime(0.08, now)
    g.gain.linearRampToValueAtTime(0, now + 1.8)
    osc.connect(g); g.connect(this.masterGain)
    osc.start(now); osc.stop(now + 1.8)
    // Hold tone after fully formed
    this._holdTone(now + 1.4, 220, 'sine', 0.04, 2.0)
  }

  // Morph 2 — TITLE: triangle wave chord 220+330Hz
  _morphSound_Title(now) {
    const freqs = [220, 330]
    freqs.forEach((f, i) => {
      const g = this._gain(0.05, now)
      const osc = this.ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.05, now + 0.3)
      g.gain.linearRampToValueAtTime(0, now + 1.5)
      osc.connect(g); g.connect(this.masterGain); g.connect(this.convolver)
      osc.start(now + i * 0.08); osc.stop(now + 2)
    })
    this._holdTone(now + 0.8, 330, 'triangle', 0.03, 2.5)
  }

  // Morph 3 — MANIFESTO: pentatonic ascending note per word
  _morphSound_Manifesto(now) {
    const pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]
    pentatonic.forEach((f, i) => {
      const delay = i * 0.25
      const g = this._gain(0.06, now + delay)
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, now + delay)
      g.gain.linearRampToValueAtTime(0.06, now + delay + 0.05)
      g.gain.linearRampToValueAtTime(0, now + delay + 0.4)
      osc.connect(g); g.connect(this.masterGain)
      osc.start(now + delay); osc.stop(now + delay + 0.5)
    })
    this._holdTone(now + 1.5, 440, 'sine', 0.05, 3.0)
  }

  // Morph 4 — THREE WORDS: three separate stabs
  _morphSound_ThreeWords(now) {
    const stabs = [
      { t: 0,    freq: 180, col: 'sawtooth' },
      { t: 0.8,  freq: 240, col: 'square' },
      { t: 1.6,  freq: 300, col: 'triangle' }
    ]
    stabs.forEach(({ t, freq: f, col }) => {
      const g = this._gain(0.07, now + t)
      const osc = this.ctx.createOscillator()
      osc.type = col
      osc.frequency.value = f
      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 800
      g.gain.setValueAtTime(0.07, now + t)
      g.gain.linearRampToValueAtTime(0, now + t + 0.3)
      osc.connect(filter); filter.connect(g); g.connect(this.masterGain)
      osc.start(now + t); osc.stop(now + t + 0.35)
    })
  }

  // Morph 5 — SIGIL: long slow chord swell (all palette tones)
  _morphSound_Sigil(now) {
    const chord = [55, 82.5, 110, 138.6, 165, 220]
    chord.forEach((f, i) => {
      const g = this._gain(0, now)
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(0.03, now + 2.0 + i * 0.3)
      g.gain.linearRampToValueAtTime(0, now + 6.0)
      osc.connect(g); g.connect(this.masterGain); g.connect(this.convolver)
      osc.start(now); osc.stop(now + 7)
    })
  }

  // Sustained resonant tone (used during hold state)
  _holdTone(startTime, freq, type, vol, duration) {
    const g = this._gain(0, startTime)
    const osc = this.ctx.createOscillator()
    osc.type = type
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, startTime)
    g.gain.linearRampToValueAtTime(vol, startTime + 0.1)
    g.gain.linearRampToValueAtTime(0, startTime + duration)
    osc.connect(g); g.connect(this.masterGain); g.connect(this.convolver)
    osc.start(startTime); osc.stop(startTime + duration + 0.1)
  }

  // ──────────────────────────────────────────────────────────
  // SUPERNOVA
  // ──────────────────────────────────────────────────────────

  triggerSupernova() {
    if (!this.initialized) return
    const now = this.ctx.currentTime

    // 1. Fade out hum immediately
    this.setHumVolume(0, 0.2)

    // 2. Sub-bass hit (40Hz) — felt physically
    const subG = this._gain(0.4, now)
    const subOsc = this.ctx.createOscillator()
    subOsc.type = 'sine'
    subOsc.frequency.value = 40
    subG.gain.setValueAtTime(0.4, now)
    subG.gain.exponentialRampToValueAtTime(0.001, now + 2.0)
    subOsc.connect(subG); subG.connect(this.masterGain)
    subOsc.start(now); subOsc.stop(now + 2.1)

    // 3. White noise burst (0.3s, high-passed at 200Hz)
    const noiseBuffer = this._makeNoise(0.4)
    const noiseSource = this.ctx.createBufferSource()
    noiseSource.buffer = noiseBuffer
    const hp = this.ctx.createBiquadFilter()
    hp.type = 'highpass'
    hp.frequency.value = 200
    const noiseG = this._gain(0, now)
    noiseG.gain.setValueAtTime(0.25, now)
    noiseG.gain.linearRampToValueAtTime(0, now + 0.3)
    noiseSource.connect(hp); hp.connect(noiseG); noiseG.connect(this.masterGain)
    noiseSource.start(now); noiseSource.stop(now + 0.4)

    // 4. Shimmer rise 2000→4000Hz over 1.5s
    const shimG = this._gain(0.08, now + 0.1)
    const shimOsc = this.ctx.createOscillator()
    shimOsc.type = 'triangle'
    shimOsc.frequency.setValueAtTime(2000, now + 0.1)
    shimOsc.frequency.exponentialRampToValueAtTime(4000, now + 1.6)
    shimG.gain.setValueAtTime(0.08, now + 0.1)
    shimG.gain.linearRampToValueAtTime(0, now + 1.8)
    shimOsc.connect(shimG); shimG.connect(this.masterGain)
    shimOsc.start(now + 0.1); shimOsc.stop(now + 1.9)

    // 5. 2s silence, then star field hum fades back in
    if (this._humFadeTimeout) clearTimeout(this._humFadeTimeout)
    this._humFadeTimeout = setTimeout(() => {
      // Silence for 2 full seconds after shimmer
      setTimeout(() => {
        this.setHumVolume(0.015, 4.0) // 4s fade back in
      }, 2000)
    }, 1800)
  }

  // ──────────────────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────────────────

  _gain(initialValue, startTime) {
    const g = this.ctx.createGain()
    g.gain.setValueAtTime(initialValue, startTime)
    return g
  }

  _makeNoise(durationSecs) {
    const sr = this.ctx.sampleRate
    const len = Math.floor(sr * durationSecs)
    const buf = this.ctx.createBuffer(1, len, sr)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  destroy() {
    this.humOscillators.forEach(o => { try { o.stop(); o.disconnect() } catch (e) {} })
    this.humOscillators = []
    if (this._humFadeTimeout) clearTimeout(this._humFadeTimeout)
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
    this.initialized = false
  }
}
