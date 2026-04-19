// ═══════════════════════════════════════════════════════════
//  SÉANCE AUDIO ENGINE — REALM 5
//  "The voice inside the walls. The bell that summons nothing."
//  Fully procedural Web Audio API — zero audio files.
// ═══════════════════════════════════════════════════════════

class SeanceAudio {
  constructor() {
    this.ctx         = null
    this.masterGain  = null
    this.reverbNode  = null
    this._baseTone   = null
    this._baseToneGain = null
    this._crackleTimeout = null
    this._presenceDroneGains = []
    this._presenceDrones     = []
    this._penOsc    = null
    this._penGain   = null
    this._subBass   = null
    this._subBassGain = null
    this._chordOscs  = []
    this._chordGains = []
    this._initialized = false
  }

  // ── Bootstrap ─────────────────────────────────────────────────────────
  _ensureCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.6
      this.masterGain.connect(this.ctx.destination)
    }
  }

  async _buildReverb(decaySeconds = 8) {
    const length  = Math.floor(this.ctx.sampleRate * decaySeconds)
    const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c)
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.2)
      }
    }
    const conv = this.ctx.createConvolver()
    conv.buffer = impulse
    conv.connect(this.masterGain)
    this.reverbNode = conv
  }

  async init() {
    if (this._initialized) {
      if (this.ctx.state === 'suspended') await this.ctx.resume()
      return
    }
    this._ensureCtx()
    if (this.ctx.state === 'suspended') await this.ctx.resume()

    // Build reverb off the critical path — runs during browser idle time
    // so it never freezes the scroll-in animation
    const buildLazy = () => this._buildReverb(10)
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(buildLazy, { timeout: 3000 })
    } else {
      setTimeout(buildLazy, 500)
    }

    // Pre-warm Web Speech API now (silent utterance) so the TTS engine
    // is already loaded when we call speak() at 18% scroll
    if (typeof window.speechSynthesis !== 'undefined') {
      const warmup = new SpeechSynthesisUtterance('')
      warmup.volume = 0
      window.speechSynthesis.speak(warmup)

      // Pre-cache the voices list so getVoices() is instant later
      const loadVoices = () => { this._cachedVoices = window.speechSynthesis.getVoices() }
      loadVoices()
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }
    }

    this._initialized = true
  }

  // ── 174 Hz foundation tone ────────────────────────────────────────────
  startBaseTone() {
    if (!this.ctx || this._baseTone) return
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 174
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 3)
    osc.connect(gain)
    gain.connect(this.reverbNode)
    osc.start()
    this._baseTone     = osc
    this._baseToneGain = gain
  }

  stopBaseTone(fadeDuration = 3) {
    if (!this._baseTone) return
    const now = this.ctx.currentTime
    this._baseToneGain.gain.cancelScheduledValues(now)
    this._baseToneGain.gain.setValueAtTime(this._baseToneGain.gain.value, now)
    this._baseToneGain.gain.linearRampToValueAtTime(0, now + fadeDuration)
    setTimeout(() => { try { this._baseTone.stop() } catch (_) {} ; this._baseTone = null }, fadeDuration * 1000 + 100)
  }

  // Stage 3: pitch rises 174→220 Hz over ascent (12s)
  baseToneAscend(duration = 12) {
    if (!this._baseTone) return
    const now = this.ctx.currentTime
    this._baseTone.frequency.cancelScheduledValues(now)
    this._baseTone.frequency.setValueAtTime(this._baseTone.frequency.value, now)
    this._baseTone.frequency.linearRampToValueAtTime(220, now + duration)
  }

  // ── Candle Crackle ────────────────────────────────────────────────────
  _fireCrackle() {
    if (!this.ctx || !this._crackleActive) return

    const duration    = 0.02 + Math.random() * 0.05  // 20-70ms
    const bufSize     = Math.floor(this.ctx.sampleRate * duration)
    const buf         = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate)
    const d           = buf.getChannelData(0)
    // Pink-ish noise burst
    let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0
    for (let i = 0; i < bufSize; i++) {
      const white = Math.random() * 2 - 1
      b0 = 0.99886*b0 + white*0.0555179; b1 = 0.99332*b1 + white*0.0750759
      b2 = 0.96900*b2 + white*0.1538520; b3 = 0.86650*b3 + white*0.3104856
      b4 = 0.55000*b4 + white*0.5329522; b5 = -0.7616*b5 - white*0.0168980
      d[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362)*0.11
      b6 = white * 0.115926
    }

    const src    = this.ctx.createBufferSource()
    src.buffer   = buf
    const hp     = this.ctx.createBiquadFilter()
    hp.type      = 'highpass'
    hp.frequency.value = 900
    const gain   = this.ctx.createGain()
    gain.gain.value = 0.015
    const pan    = this.ctx.createStereoPanner()
    pan.pan.value = (Math.random() - 0.5) * 1.2

    src.connect(hp)
    hp.connect(gain)
    gain.connect(pan)
    pan.connect(this.masterGain)
    src.start()

    const next = 300 + Math.random() * 1700  // 0.3–2s
    this._crackleTimeout = setTimeout(() => this._fireCrackle(), next)
  }

  startCandleCrackle() {
    this._crackleActive = true
    this._fireCrackle()
  }

  stopCandleCrackle() {
    this._crackleActive = false
    if (this._crackleTimeout) clearTimeout(this._crackleTimeout)
  }

  // ── Bell strike (Enter key) ───────────────────────────────────────────
  strikeEnterBell() {
    if (!this.ctx) return
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = 522  // close to 528Hz love frequency

    const now = this.ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.18, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.0)

    // Small second harmonic for warmth
    const osc2  = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.value = 1044
    gain2.gain.setValueAtTime(0, now)
    gain2.gain.linearRampToValueAtTime(0.03, now + 0.01)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.5)

    osc.connect(gain); osc2.connect(gain2)
    if (this.reverbNode) {
      gain.connect(this.reverbNode)
      gain2.connect(this.reverbNode)
    } else {
      gain.connect(this.masterGain)
      gain2.connect(this.masterGain)
    }
    osc.start(); osc2.start()
    osc.stop(now + 3.2); osc2.stop(now + 2.0)
  }

  // ── Presence drone (particles forming) ──────────────────────────────
  startPresenceDrone() {
    if (!this.ctx || this._presenceDrones.length > 0) return
    const freqs   = [174, 261, 392]
    freqs.forEach(freq => {
      const osc  = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq + (Math.random() * 3 - 1.5)
      gain.gain.setValueAtTime(0, this.ctx.currentTime)
      osc.connect(gain)
      if (this.reverbNode) gain.connect(this.reverbNode)
      else gain.connect(this.masterGain)
      osc.start()
      this._presenceDrones.push(osc)
      this._presenceDroneGains.push(gain)
    })
    // Fade in over 1.6s
    this._presenceDroneGains.forEach(g => {
      g.gain.linearRampToValueAtTime(0.05, this.ctx.currentTime + 1.6)
    })
  }

  stopPresenceDrone() {
    if (!this.ctx || this._presenceDrones.length === 0) return
    const now = this.ctx.currentTime
    this._presenceDroneGains.forEach(g => {
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      // Reverse-reverb: fast pull-back
      g.gain.linearRampToValueAtTime(0, now + 0.2)
    })
    setTimeout(() => {
      this._presenceDrones.forEach(o => { try { o.stop() } catch(_){} })
      this._presenceDrones = []
      this._presenceDroneGains = []
    }, 400)
  }

  // ── Pen-on-paper whisper (inscription drawing) ──────────────────────
  startPenWhisper() {
    if (!this.ctx || this._penOsc) return
    const bufSize = this.ctx.sampleRate * 2
    const buf     = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate)
    const d       = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1

    const src  = this.ctx.createBufferSource()
    src.buffer = buf
    src.loop   = true

    const lo   = this.ctx.createBiquadFilter()
    lo.type    = 'highpass'
    lo.frequency.value = 3000

    const hi   = this.ctx.createBiquadFilter()
    hi.type    = 'lowpass'
    hi.frequency.value = 8000

    const gain = this.ctx.createGain()
    gain.gain.value = 0.008

    src.connect(lo); lo.connect(hi); hi.connect(gain)
    gain.connect(this.masterGain)
    src.start()
    this._penOsc  = src
    this._penGain = gain
  }

  stopPenWhisper() {
    if (!this._penOsc) return
    try { this._penOsc.stop() } catch(_) {}
    this._penOsc  = null
    this._penGain = null
  }

  // ── 7th Exchange: candles-out sub-bass + 4-note chord ───────────────
  startSeventhExchangeChord() {
    if (!this.ctx) return

    // Sub bass pulse
    const sub  = this.ctx.createOscillator()
    const subG = this.ctx.createGain()
    sub.type = 'sine'
    sub.frequency.value = 240 // Shifted to 240Hz to eliminate all low-frequency vibration
    subG.gain.value = 0.04
    sub.connect(subG)
    subG.connect(this.masterGain)
    sub.start()
    this._subBass     = sub
    this._subBassGain = subG

    // 4-note chord — added one wall at a time via addChordNote()
    this._chordFreqs = [174, 261, 392, 523]
    this._chordOscs  = []
    this._chordGains = []
  }

  addChordNote(noteIndex) {
    if (!this.ctx || !this._chordFreqs) return
    const freq = this._chordFreqs[noteIndex]
    if (!freq) return
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.03, this.ctx.currentTime + 0.5)
    osc.connect(gain)
    if (this.reverbNode) gain.connect(this.reverbNode)
    else gain.connect(this.masterGain)
    osc.start()
    this._chordOscs.push(osc)
    this._chordGains.push(gain)
  }

  // Swell all chord notes to 0.15, then cut to 0 (the big moment)
  swellAndCutChord(swellDuration = 0.3) {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._chordGains.forEach(g => {
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(g.gain.value, now)
      g.gain.linearRampToValueAtTime(0.15, now + swellDuration)
      g.gain.linearRampToValueAtTime(0, now + swellDuration + 0.05)
    })
    if (this._subBassGain) {
      this._subBassGain.gain.linearRampToValueAtTime(0, now + swellDuration + 0.5)
    }
    setTimeout(() => {
      this._chordOscs.forEach(o => { try { o.stop() } catch(_){} })
      if (this._subBass) { try { this._subBass.stop() } catch(_){} }
      this._chordOscs  = []
      this._chordGains = []
      this._subBass = null
    }, (swellDuration + 1) * 1000)
  }

  // ── Wall belief bell (Stage 3) ────────────────────────────────────────
  strikeBelief(wallIndex) {
    // Pentatonic from 392Hz (G4): G, A, B, D, E
    const pentatonic = [392, 440, 494, 587.33, 659.25]
    const freq = pentatonic[wallIndex % pentatonic.length]
    if (!this.ctx) return
    const osc  = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = freq
    const now = this.ctx.currentTime
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.12, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0)
    osc.connect(gain)
    if (this.reverbNode) gain.connect(this.reverbNode)
    else gain.connect(this.masterGain)
    osc.start(); osc.stop(now + 2.2)
  }

  // ── Web Speech API with reverb routing ──────────────────────────────
  async speak(text) {
    if (typeof window.speechSynthesis === 'undefined') return

    // Cancel any queued speech
    window.speechSynthesis.cancel()

    const utterance  = new SpeechSynthesisUtterance(text)
    utterance.rate   = 0.82
    utterance.pitch  = 0.72
    utterance.volume = 1.0

    // Use pre-cached voices — no blocking getVoices() call at speak time
    const voices = this._cachedVoices || window.speechSynthesis.getVoices()
    const preferred = voices.find(v =>
      v.name.toLowerCase().includes('daniel') ||
      v.name.toLowerCase().includes('alex')   ||
      v.name.toLowerCase().includes('george') ||
      v.lang === 'en-GB'
    )
    if (preferred) utterance.voice = preferred

    window.speechSynthesis.speak(utterance)
    return new Promise(resolve => {
      utterance.onend = resolve
      utterance.onerror = resolve
    })
  }

  silenceVoice() {
    if (typeof window.speechSynthesis !== 'undefined') {
      window.speechSynthesis.cancel()
    }
  }

  // ── Cleanup ───────────────────────────────────────────────────────────
  dispose() {
    this.stopCandleCrackle()
    this.stopPresenceDrone()
    this.stopPenWhisper()
    this.stopBaseTone(0.1)
    this.silenceVoice()
    if (this._subBass)     { try { this._subBass.stop() }    catch(_){} }
    if (this._chordOscs)   this._chordOscs.forEach(o => { try { o.stop() } catch(_){} })
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
    this._initialized = false
  }
}

export default new SeanceAudio()
