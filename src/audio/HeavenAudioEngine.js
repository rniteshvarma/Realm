// ═══════════════════════════════════════════════════════════════════════
//  DEEP SPACE AMBIENCE — the voyage's soundtrack
//  Fully procedural (Web Audio, no files). Everything lives in one key
//  (D major) so nothing can clash:
//
//    PAD    warm, slowly breathing chord — drifts to a new chord per chapter
//    AIR    soft filtered "cosmic wind"
//    STARS  occasional glassy chimes from the D-major pentatonic scale
//    HALL   a dark, smooth stereo reverb that everything sits in
//
//  Loud transients, pure high sine tones, vibrato and raw white noise are
//  deliberately avoided — the old engine's sources of irritation.
// ═══════════════════════════════════════════════════════════════════════

const midi = (n) => 440 * Math.pow(2, (n - 69) / 12)

// D-major pentatonic (D E F# A B) — any two notes sound good together
const PENTA = [62, 64, 66, 69, 71]

// Chapter moods: chord (MIDI notes), pad brightness (lowpass Hz),
// star density (chimes per minute) and star register (octave shift)
const MOODS = {
  0:  { chord: [50, 57, 62, 64, 69],  bright: 650,  stars: 6,  oct: 12 }, // Singularity — open D
  1:  { chord: [50, 57, 64, 66, 73],  bright: 1100, stars: 10, oct: 12 }, // First Light — Dmaj9
  2:  { chord: [47, 54, 62, 64, 69],  bright: 900,  stars: 9,  oct: 12 }, // Accretion — Bm11
  3:  { chord: [43, 50, 57, 59, 66],  bright: 1000, stars: 12, oct: 12 }, // Ring Dive — Gmaj9
  4:  { chord: [45, 52, 59, 61, 64],  bright: 1250, stars: 11, oct: 12 }, // Gravity Assist — Asus2/add6
  5:  { chord: [40, 47, 54, 55, 62],  bright: 950,  stars: 8,  oct: 12 }, // Cartography — Em9
  6:  { chord: [42, 49, 52, 57, 61],  bright: 800,  stars: 13, oct: 12 }, // Stellar Nursery — F#m7
  7:  { chord: [43, 50, 52, 57, 59],  bright: 1150, stars: 7,  oct: 12 }, // Pulsar — G6/9
  8:  { chord: [50, 57, 64, 66, 73],  bright: 1400, stars: 14, oct: 24 }, // Dyson Swarm — Dmaj9 (lifted)
  9:  { chord: [47, 54, 59, 61, 62],  bright: 520,  stars: 4,  oct: 12 }, // Event Horizon — Bm(add9), dark
  10: { chord: [43, 50, 57, 62, 66],  bright: 700,  stars: 5,  oct: 12 }, // Transcendence — Gmaj9, wide
  11: { chord: [50, 57, 62, 66, 69],  bright: 1500, stars: 12, oct: 24 }, // Ascension — D, resolved & airy
}

// Cartography: each world gets its own colour, still inside the key
const WORLD_CHORDS = [
  [50, 57, 64, 66, 69], // Dadd9
  [47, 54, 59, 62, 66], // Bm7
  [43, 50, 55, 59, 64], // Gadd6
  [45, 52, 57, 61, 64], // A
]

const MASTER_LEVEL = 0.5

class HeavenAudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.reverbNode = null      // send: anything connected here gets the hall
    this.analyser = null
    this.oscillators = []       // kept for API compatibility (unused by callers now)
    this._initialized = false
    this._running = false
    this._voices = []
    this._padFilter = null
    this._airFilter = null
    this._starTimer = null
    this._mood = MOODS[0]
    this._realm = 0
    this._onVisibility = null
  }

  // ── Context: create/resume synchronously inside a user gesture (iOS) ──
  unlock() {
    if (!this.ctx) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      this.ctx = new Ctx({ latencyHint: 'playback' })
      this._buildMasterChain()
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
  }

  _buildMasterChain() {
    const ctx = this.ctx
    this.masterGain = ctx.createGain()
    this.masterGain.gain.value = 0

    // Gentle glue + tame anything sharp
    const tone = ctx.createBiquadFilter()
    tone.type = 'lowpass'
    tone.frequency.value = 6500
    tone.Q.value = 0.5
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -20
    comp.knee.value = 18
    comp.ratio.value = 3
    comp.attack.value = 0.02
    comp.release.value = 0.4

    this.masterGain.connect(tone)
    tone.connect(comp)
    comp.connect(ctx.destination)

    this.analyser = ctx.createAnalyser()
    this.analyser.fftSize = 256
    comp.connect(this.analyser)
  }

  // Dark, smooth stereo hall: decaying noise, low-passed sample by sample
  _buildReverb() {
    const ctx = this.ctx
    const seconds = 5.5
    const len = Math.floor(ctx.sampleRate * seconds)
    const pre = Math.floor(ctx.sampleRate * 0.03)
    const ir = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c)
      let lp = 0
      for (let i = pre; i < len; i++) {
        const t = (i - pre) / (len - pre)
        const white = Math.random() * 2 - 1
        // One-pole lowpass that darkens as the tail decays
        const k = 0.35 - 0.3 * t
        lp += (white - lp) * k
        d[i] = lp * Math.pow(1 - t, 3) * 1.6
      }
    }
    const conv = ctx.createConvolver()
    conv.buffer = ir
    const wet = ctx.createGain()
    wet.gain.value = 0.85
    conv.connect(wet)
    wet.connect(this.masterGain)
    this.reverbNode = conv
  }

  // ── PAD: per voice, two slightly detuned oscillators → shared lowpass ──
  _buildPad() {
    const ctx = this.ctx
    const padBus = ctx.createGain()
    padBus.gain.value = 0.11

    this._padFilter = ctx.createBiquadFilter()
    this._padFilter.type = 'lowpass'
    this._padFilter.frequency.value = this._mood.bright
    this._padFilter.Q.value = 0.7
    // Very slow "breathing" of the brightness
    const breath = ctx.createOscillator()
    breath.frequency.value = 0.045
    const breathAmt = ctx.createGain()
    breathAmt.gain.value = 180
    breath.connect(breathAmt)
    breathAmt.connect(this._padFilter.frequency)
    breath.start()

    padBus.connect(this._padFilter)
    const dry = ctx.createGain()
    dry.gain.value = 0.55
    const send = ctx.createGain()
    send.gain.value = 0.6
    this._padFilter.connect(dry)
    this._padFilter.connect(send)
    dry.connect(this.masterGain)
    send.connect(this.reverbNode)

    this._voices = this._mood.chord.map((note, i) => {
      const f = midi(note)
      const a = ctx.createOscillator()
      const b = ctx.createOscillator()
      a.type = 'triangle'
      b.type = 'sawtooth'
      a.frequency.value = f
      b.frequency.value = f
      a.detune.value = -5
      b.detune.value = 6
      const bGain = ctx.createGain()
      bGain.gain.value = 0.18          // a little saw for warmth, mostly triangle
      const vGain = ctx.createGain()
      // Lower voices a touch louder; each voice swells on its own slow cycle
      const level = (i === 0 ? 0.55 : 0.42) / (1 + i * 0.12)
      vGain.gain.value = level
      const swell = ctx.createOscillator()
      swell.frequency.value = 0.03 + i * 0.013
      const swellAmt = ctx.createGain()
      swellAmt.gain.value = level * 0.35
      swell.connect(swellAmt)
      swellAmt.connect(vGain.gain)

      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null
      a.connect(vGain)
      b.connect(bGain)
      bGain.connect(vGain)
      if (pan) {
        pan.pan.value = (i / (this._mood.chord.length - 1) - 0.5) * 0.7
        vGain.connect(pan)
        pan.connect(padBus)
      } else {
        vGain.connect(padBus)
      }
      a.start(); b.start(); swell.start()
      this.oscillators.push(a, b, swell)
      return { a, b }
    })
  }

  // ── AIR: looped brown noise through a drifting lowpass ──
  _buildAir() {
    const ctx = this.ctx
    const len = ctx.sampleRate * 8
    const buf = ctx.createBuffer(2, len, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c)
      let last = 0
      for (let i = 0; i < len; i++) {
        last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02
        d[i] = last * 3.2
      }
      // Crossfade the loop seam
      const fade = Math.floor(ctx.sampleRate * 0.5)
      for (let i = 0; i < fade; i++) {
        const t = i / fade
        d[i] = d[i] * t + d[len - fade + i] * (1 - t)
      }
    }
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    src.loopStart = 0.5
    src.loopEnd = 8 - 0.5

    this._airFilter = ctx.createBiquadFilter()
    this._airFilter.type = 'lowpass'
    this._airFilter.frequency.value = 420
    this._airFilter.Q.value = 0.4
    const drift = ctx.createOscillator()
    drift.frequency.value = 0.06
    const driftAmt = ctx.createGain()
    driftAmt.gain.value = 160
    drift.connect(driftAmt)
    driftAmt.connect(this._airFilter.frequency)

    const g = ctx.createGain()
    g.gain.value = 0.05
    src.connect(this._airFilter)
    this._airFilter.connect(g)
    g.connect(this.masterGain)
    const send = ctx.createGain()
    send.gain.value = 0.3
    g.connect(send)
    send.connect(this.reverbNode)
    src.start()
    drift.start()
    this.oscillators.push(drift)
    this._airSource = src
  }

  // ── STARS: a glassy FM chime ──
  _chime(note, { level = 0.03, pan = (Math.random() - 0.5) * 1.2, decay = 4.5, when = 0 } = {}) {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime + 0.02 + when
    const f = midi(note)
    const car = ctx.createOscillator()
    const mod = ctx.createOscillator()
    const modAmt = ctx.createGain()
    car.type = 'sine'
    mod.type = 'sine'
    car.frequency.value = f
    mod.frequency.value = f * 3.01          // inharmonic-ish → glass / bell
    modAmt.gain.setValueAtTime(f * 1.4, t)
    modAmt.gain.exponentialRampToValueAtTime(f * 0.02, t + decay * 0.6)
    mod.connect(modAmt)
    modAmt.connect(car.frequency)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(level, t + 0.015)
    env.gain.exponentialRampToValueAtTime(0.0001, t + decay)

    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null
    car.connect(env)
    const out = p || env
    if (p) { p.pan.value = Math.max(-1, Math.min(1, pan)); env.connect(p) }
    const dry = ctx.createGain()
    dry.gain.value = 0.35
    out.connect(dry)
    dry.connect(this.masterGain)
    out.connect(this.reverbNode)

    car.start(t); mod.start(t)
    car.stop(t + decay + 0.1); mod.stop(t + decay + 0.1)
  }

  _scheduleStars() {
    clearTimeout(this._starTimer)
    if (!this._running) return
    const perMinute = Math.max(1, this._mood.stars)
    // Poisson-ish spacing so it never feels like a metronome
    const gap = (60 / perMinute) * (0.4 + Math.random() * 1.2)
    this._starTimer = setTimeout(() => {
      if (this._running && document.visibilityState === 'visible') {
        const note = PENTA[(Math.random() * PENTA.length) | 0] + this._mood.oct
        this._chime(note, { level: 0.018 + Math.random() * 0.016 })
        // Occasionally a soft answering note a fifth or octave up
        if (Math.random() < 0.25) this._chime(note + (Math.random() < 0.5 ? 7 : 12), { level: 0.012, when: 0.35 })
      }
      this._scheduleStars()
    }, gap * 1000)
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────
  async init() {
    this.unlock()
    if (!this.ctx || this._initialized) return
    this._initialized = true
    this._buildReverb()
    this._buildPad()
    this._buildAir()

    // Save battery: suspend while the tab is hidden
    this._onVisibility = () => {
      if (!this.ctx) return
      if (document.visibilityState === 'hidden') this.ctx.suspend().catch(() => {})
      else if (this._running) this.ctx.resume().catch(() => {})
    }
    document.addEventListener('visibilitychange', this._onVisibility)
  }

  async start() {
    await this.init()
    if (!this.ctx) return
    if (this.ctx.state === 'suspended') await this.ctx.resume().catch(() => {})
    this._running = true
    clearTimeout(this._suspendTimer)
    this.fadeIn(4)
    this._scheduleStars()
  }

  stop() {
    this._running = false
    clearTimeout(this._starTimer)
    if (!this.ctx || !this.masterGain) return
    this.fadeOut(1.5)
    // Fully idle the audio thread once silent
    clearTimeout(this._suspendTimer)
    this._suspendTimer = setTimeout(() => {
      if (!this._running) this.ctx?.suspend().catch(() => {})
    }, 1800)
  }

  fadeIn(duration = 3) {
    if (!this.masterGain) return
    const g = this.masterGain.gain
    const now = this.ctx.currentTime
    g.cancelScheduledValues(now)
    g.setValueAtTime(g.value, now)
    g.linearRampToValueAtTime(MASTER_LEVEL, now + duration)
  }

  fadeOut(duration = 2) {
    if (!this.masterGain) return
    const g = this.masterGain.gain
    const now = this.ctx.currentTime
    g.cancelScheduledValues(now)
    g.setValueAtTime(g.value, now)
    g.linearRampToValueAtTime(0, now + duration)
  }

  // Glide every pad voice to a new chord (slow, so it never jumps)
  _setChord(chord, glide = 5) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._voices.forEach((v, i) => {
      const f = midi(chord[i % chord.length])
      ;[v.a, v.b].forEach((osc) => {
        osc.frequency.cancelScheduledValues(now)
        osc.frequency.setValueAtTime(osc.frequency.value, now)
        osc.frequency.setTargetAtTime(f, now, glide / 3)
      })
    })
  }

  _setBrightness(hz, time = 4) {
    if (!this._padFilter) return
    const now = this.ctx.currentTime
    const fq = this._padFilter.frequency
    fq.cancelScheduledValues(now)
    fq.setValueAtTime(fq.value, now)
    fq.setTargetAtTime(hz, now, time / 3)
  }

  // Chapter changed → new mood
  shiftToRealm(realmIndex) {
    this._realm = realmIndex
    this._mood = MOODS[realmIndex] ?? MOODS[0]
    if (!this.ctx || !this._running) return
    this._setChord(this._mood.chord)
    this._setBrightness(this._mood.bright)
    // A single soft chime marks the arrival in a new chapter
    this._chime(PENTA[realmIndex % PENTA.length] + this._mood.oct, { level: 0.022, decay: 5.5, pan: 0 })
  }

  // ── Cartography hooks ─────────────────────────────────────────────────
  setWorld(index) {
    if (!this._running) return
    this._setChord(WORLD_CHORDS[index % WORLD_CHORDS.length], 3.5)
  }

  resetWorld() {
    if (!this._running) return
    this._setChord(this._mood.chord, 4)
    this._setBrightness(this._mood.bright, 3)
  }

  // 0..1 — the pad opens up as something approaches
  swell(amount) {
    if (!this._running || !this._padFilter) return
    this._setBrightness(this._mood.bright + amount * 900, 0.8)
  }

  // Soft airy whoosh (low-passed, never hissy)
  whoosh({ level = 0.08, duration = 1.4 } = {}) {
    if (!this.ctx || !this._running) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const len = Math.floor(ctx.sampleRate * duration)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    let last = 0
    for (let i = 0; i < len; i++) { last = (last + 0.04 * (Math.random() * 2 - 1)) / 1.04; d[i] = last * 3 }
    const src = ctx.createBufferSource()
    src.buffer = buf
    const f = ctx.createBiquadFilter()
    f.type = 'lowpass'
    f.Q.value = 0.8
    f.frequency.setValueAtTime(1600, t)
    f.frequency.exponentialRampToValueAtTime(140, t + duration)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.0001, t)
    g.gain.exponentialRampToValueAtTime(level, t + duration * 0.25)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    src.connect(f); f.connect(g)
    g.connect(this.masterGain); g.connect(this.reverbNode)
    src.start(t)
  }

  // A gentle cluster of stars (e.g. the Cartography final map)
  chord(notes = [74, 78, 81, 85], { spread = 0.22, level = 0.02 } = {}) {
    if (!this._running) return
    notes.forEach((n, i) => this._chime(n, { level, when: i * spread, decay: 6, pan: (i / (notes.length - 1) - 0.5) }))
  }

  // ── Event Horizon: a deep, cinematic fall ────────────────────────────
  cross() {
    if (!this.ctx || !this._running) return
    const ctx = this.ctx
    const t = ctx.currentTime
    // Low sine dropping away
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(146.8, t)                 // D3
    o.frequency.exponentialRampToValueAtTime(36.7, t + 2.6) // → D1
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.0001, t)
    og.gain.exponentialRampToValueAtTime(0.16, t + 0.6)
    og.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
    o.connect(og); og.connect(this.masterGain); og.connect(this.reverbNode)
    o.start(t); o.stop(t + 3.3)
    // Rising wind that's sucked in
    this.whoosh({ level: 0.12, duration: 2.4 })
    // The pad darkens to almost nothing, then the arrival chord blooms
    this._setBrightness(220, 1.2)
    setTimeout(() => {
      if (!this._running) return
      this._setBrightness((MOODS[10] ?? this._mood).bright, 3)
      this.chord([62, 69, 74, 78], { spread: 0.3, level: 0.022 })
    }, 2600)
  }

  // Backwards-compatible names used elsewhere
  triggerGlassShatter() { this.cross() }
  postBreakAmbience() {}
  triggerMirrorChorus() {}

  // Soft UI chime; any pitch is snapped into the pentatonic scale
  triggerHoverPing(pitch = 880) {
    if (!this._running) return
    const n = Math.round(69 + 12 * Math.log2(pitch / 440))
    const pc = ((n % 12) + 12) % 12
    const scale = [2, 4, 6, 9, 11]
    const snapped = n - pc + scale.reduce((best, s) => (Math.abs(s - pc) < Math.abs(best - pc) ? s : best), scale[0])
    this._chime(snapped, { level: 0.02, decay: 2.5 })
  }

  clearExtraLayers() {}

  getAnalyser() {
    return this.analyser
  }

  dispose() {
    clearTimeout(this._starTimer)
    clearTimeout(this._suspendTimer)
    if (this._onVisibility) document.removeEventListener('visibilitychange', this._onVisibility)
    this.oscillators.forEach((o) => { try { o.stop() } catch (_) {} })
    this.oscillators = []
    this._voices = []
    try { this._airSource?.stop() } catch (_) {}
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
    this._initialized = false
    this._running = false
  }
}

// Singleton instance shared across the app
const heavenEngine = new HeavenAudioEngine()
export default heavenEngine

// Dev-only handle for inspecting levels from the console
if (import.meta.env?.DEV && typeof window !== 'undefined') window.__ambience = heavenEngine
