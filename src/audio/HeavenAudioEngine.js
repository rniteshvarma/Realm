// ═══════════════════════════════════════════════════════
//  HEAVEN AUDIO ENGINE — REALM V2
//  "A choir that forgot it was human. A machine learning to feel peace."
//  Fully procedural — NO audio files required.
// ═══════════════════════════════════════════════════════

class HeavenAudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.oscillators = []
    this.reverbNode = null
    this.analyser = null
    this._initialized = false
    this._running = false
  }

  _createContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0 // start silent, fade in
      this.masterGain.connect(this.ctx.destination)

      // AnalyserNode — feeds the AudioVisualizer UI
      this.analyser = this.ctx.createAnalyser()
      this.analyser.fftSize = 256
      this.masterGain.connect(this.analyser)
    }
  }

  async buildReverb() {
    // Convolution reverb — simulate a massive cathedral/nebula space
    const length = this.ctx.sampleRate * 6 // 6-second reverb tail
    const impulse = this.ctx.createBuffer(2, length, this.ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = impulse.getChannelData(c)
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.5)
      }
    }
    const convolver = this.ctx.createConvolver()
    convolver.buffer = impulse
    convolver.connect(this.masterGain)
    this.reverbNode = convolver
    return convolver
  }

  createHeavenLayer() {
    if (!this.reverbNode) return

    // Sub-bass layer removed to ensure absolute silence and prevent hardware vibration

    // ── Layer 2: Choir pad — 5 detuned sine waves ──
    const choirFreqs = [220, 277.18, 329.63, 440, 554.37] // A3 chord
    choirFreqs.forEach((freq, i) => {
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq + (Math.random() * 4 - 2) // slight detune
      const lfo = this.ctx.createOscillator() // vibrato
      lfo.frequency.value = 0.3 + i * 0.07
      const lfoGain = this.ctx.createGain()
      lfoGain.gain.value = 1.2
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)
      const g = this.ctx.createGain()
      g.gain.value = 0.018
      osc.connect(g)
      g.connect(this.reverbNode)
      osc.start()
      lfo.start()
      this.oscillators.push(osc, lfo)
    })

    // ── Layer 3: Crystalline high shimmer (heaven bells) ──
    const shimmer = this.ctx.createOscillator()
    shimmer.type = 'triangle'
    shimmer.frequency.value = 1318.5 // E6
    const shimmerLFO = this.ctx.createOscillator()
    shimmerLFO.frequency.value = 0.12
    const shimmerLFOGain = this.ctx.createGain()
    shimmerLFOGain.gain.value = 0.006
    shimmerLFO.connect(shimmerLFOGain)
    shimmerLFOGain.connect(shimmer.frequency)
    const shimmerGain = this.ctx.createGain()
    shimmerGain.gain.value = 0.00 // Mutated: High pitch triangle wave sounds like buzzing to some users
    shimmer.connect(shimmerGain)
    shimmerGain.connect(this.reverbNode)
    shimmer.start()
    shimmerLFO.start()
    this.oscillators.push(shimmer, shimmerLFO)
  }

  fadeIn(duration = 3) {
    if (!this.masterGain) return
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(0.7, this.ctx.currentTime + duration)
  }

  fadeOut(duration = 2) {
    if (!this.masterGain) return
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration)
  }

  // Realm-reactive: shift the chord voicing based on current realm
  shiftToRealm(realmIndex) {
    if (!this.ctx || !this._running) return

    // If we are moving past the Signal realm (6), clear the glass shatter ambience
    if (realmIndex > 6) {
      this.clearExtraLayers()
    }

    const realmFreqMap = {
      0: 55,      // Gate — deep sub
      1: 65.41,   // Manifesto — C2, grounded
      2: 73.42,   // Arsenal — D2, ascending
      3: 82.41,   // Archive — E2, mysterious
      4: 87.31,   // Signal — F2, resolving
      5: 98,      // Echo — G2, ethereal
      6: 110,     // Frequency — A2, resonant
      7: 123.47,  // Myth — B2, sacred
      8: 130.81,  // Transcendence — C3, complete
    }
    const targetFreq = realmFreqMap[realmIndex] ?? 55
    if (this.oscillators[0]) {
      this.oscillators[0].frequency.cancelScheduledValues(this.ctx.currentTime)
      this.oscillators[0].frequency.setValueAtTime(
        this.oscillators[0].frequency.value, 
        this.ctx.currentTime
      )
      this.oscillators[0].frequency.linearRampToValueAtTime(
        targetFreq,
        this.ctx.currentTime + 2
      )
    }
  }

  // Safely ramp down and remove any oscillators beyond the core choir/sub layers
  clearExtraLayers() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    // The first 12 oscillators are the core layers (sub + choir + LFOs)
    // Any index >= 12 (or specific shimmer refs) should be cleared
    this.oscillators.forEach((osc, i) => {
      if (i >= 12) {
        try {
          // If it has a gain node, ramp it down (would require tracking gain nodes too)
          // Since we mostly use direct connects or local gains, we'll just stop them with a fade out
          // Actually, many oscillators here don't have their own gain ref in the array.
          // For now, let's just stop them after a short ramp if possible.
          osc.stop(now + 2)
        } catch (_) {}
      }
    })
    // Filter out stopped oscillators eventually, but for now we just prevent new ones from stacking
  }

  // Returns the AnalyserNode for the visualizer
  getAnalyser() {
    return this.analyser
  }

  async init() {
    this._createContext()
    if (this._initialized) return
    this._initialized = true
    await this.buildReverb()
    this.createHeavenLayer()
  }

  async start() {
    await this.init()
    if (this.ctx.state === 'suspended') {
      await this.ctx.resume()
    }
    this._running = true
    this.fadeIn(3)
  }

  stop() {
    this._running = false
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime)
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2)
    }
  }

  // ── REALM 4: THE LOOKING GLASS AUDIO FX ──
  
  triggerMirrorChorus() {
    if (!this.ctx || !this._running || !this.oscillators.length) return
    // A2, C#3, E3, A3
    const aMajor7Freqs = [110, 138.59, 164.81, 220]
    
    // Smoothly transition the choir to this chord
    for (let i = 0; i < Math.min(aMajor7Freqs.length, 5); i++) {
        // Our oscillators array holds [osc, lfo, osc, lfo...] except index 0 is sub.
        // Let's target the choir oscillators reliably.
        const oscIdx = 1 + (i * 2) // skip sub (0), then take every 2nd (since it's osc, lfo)
        if (this.oscillators[oscIdx]) {
            const osc = this.oscillators[oscIdx]
            osc.frequency.cancelScheduledValues(this.ctx.currentTime)
            osc.frequency.setValueAtTime(osc.frequency.value, this.ctx.currentTime)
            osc.frequency.linearRampToValueAtTime(aMajor7Freqs[i] || 220, this.ctx.currentTime + 2.5)
        }
    }
  }

  triggerGlassShatter() {
    if (!this.ctx) return
    const bufferSize = this.ctx.sampleRate * 0.8
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 0.3)
    }
    const source = this.ctx.createBufferSource()
    source.buffer = buffer
    
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3200
    filter.Q.value = 0.8
    
    const gain = this.ctx.createGain()
    gain.gain.value = 0.4
    
    source.connect(filter)
    filter.connect(gain)
    
    // Connect to reverb if available, else master
    if (this.reverbNode) gain.connect(this.reverbNode)
    else gain.connect(this.masterGain)
    
    source.start()
  }

  postBreakAmbience() {
    if (!this.ctx || !this._running) return
    
    // Increase shimmer (which are the last two in the array if sub=1, choir=10, shimmer=2 -> array length 13)
    const shimmerGain = this.ctx.createGain() // No, we need to access the existing shimmer gain.
    // Instead of rebuilding the graph, let's just create a new ambient drone layered on top 
    // to represent the "singing glass shards".
    
    const shimmer = this.ctx.createOscillator()
    shimmer.type = 'triangle'
    shimmer.frequency.value = 2637 // E7
    const shimmerGain2 = this.ctx.createGain()
    shimmerGain2.gain.value = 0
    shimmer.connect(shimmerGain2)
    
    if (this.reverbNode) shimmerGain2.connect(this.reverbNode)
    else shimmerGain2.connect(this.masterGain)
    
    shimmer.start()
    shimmerGain2.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 3)
    
    this.oscillators.push(shimmer)
  }

  triggerHoverPing(pitch) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = pitch
    
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0, this.ctx.currentTime)
    gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25)
    
    osc.connect(gain)
    if (this.reverbNode) gain.connect(this.reverbNode)
    else gain.connect(this.masterGain)
    
    osc.start()
    osc.stop(this.ctx.currentTime + 0.3)
  }

  dispose() {
    this.oscillators.forEach(o => {
      try { o.stop() } catch (_) {}
    })
    this.oscillators = []
    if (this.ctx) {
      this.ctx.close()
      this.ctx = null
    }
    this._initialized = false
    this._running = false
  }
}

// Singleton instance shared across the app
const heavenEngine = new HeavenAudioEngine()
export default heavenEngine
