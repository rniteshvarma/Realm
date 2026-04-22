// ═══════════════════════════════════════════════════════
//  SFX LIBRARY — REALM V2
//  All sound effects generated procedurally — no files needed.
// ═══════════════════════════════════════════════════════

import heavenEngine from './HeavenAudioEngine'

function getCtx() {
  return heavenEngine.ctx
}

// ── Realm Transition: descending glissando of bell tones ──────────────
export function sfxRealmTransition() {
  const ctx = getCtx()
  if (!ctx) return

  const freqs = [1760, 1318.5, 987.77, 659.25, 440]
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.08)
    gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.08)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.08 + 0.4)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.08)
    osc.stop(ctx.currentTime + i * 0.08 + 0.5)
  })
}

// ── Hover Ping: 20ms sine at 880Hz ────────────────────────────────────
export function sfxHoverPing() {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0.03, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.02)
}

// ── Portal Enter: choir "ahh" swell — filter sweep 200Hz → 4kHz ───────
export function sfxPortalEnter() {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.value = 110

  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(200, ctx.currentTime)
  filter.frequency.linearRampToValueAtTime(4000, ctx.currentTime + 0.8)
  filter.Q.value = 5

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8)

  // Add reverb smear
  if (heavenEngine.reverbNode) {
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(heavenEngine.reverbNode)
  } else {
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
  }

  osc.start()
  osc.stop(ctx.currentTime + 0.9)
}

// ── Sacred Geometry Reveal: 528Hz (love frequency) — holds 1.2s ───────
export function sfxSacredReveal() {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 528 // love frequency

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.3)
  gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.2)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.8)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 1.9)
}

// ── Easter Egg Discovery: crystalline 3-note arpeggio (E-G#-B) ────────
export function sfxEasterEgg() {
  const ctx = getCtx()
  if (!ctx) return

  const notes = [659.25, 830.61, 987.77] // E5, G#5, B5
  notes.forEach((f, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'triangle'
    osc.frequency.value = f
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12)
    gain.gain.linearRampToValueAtTime(0.07, ctx.currentTime + i * 0.12 + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.12 + 0.5)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(ctx.currentTime + i * 0.12)
    osc.stop(ctx.currentTime + i * 0.12 + 0.6)
  })
}

// ── Typewriter / Decode Tick: soft 1200Hz tick per character ──────────
export function sfxTypeTick() {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 1200
  gain.gain.setValueAtTime(0.015, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.04)
}

// ── Warp Transition: upward whoosh (pitch rise + white noise) ─────────
export function sfxWarpUp() {
  const ctx = getCtx()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(80, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5)
  gain.gain.setValueAtTime(0.1, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.55)
}

// ── Realm VIII (Boneyard) SFX ──────────────────────────────────────────

// Monolith shatter entry: white noise burst + sub-bass thud + micro-clicks
export function sfxBoneyardShatter() {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime

  // White noise 200ms
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const n = ctx.createBufferSource()
  n.buffer = buf
  const ng = ctx.createGain()
  ng.gain.setValueAtTime(0.3, now)
  ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
  n.connect(ng)
  ng.connect(ctx.destination)
  n.start(now)

  // Sub-bass thud 60Hz, 800ms decay
  const sub = ctx.createOscillator()
  const sg = ctx.createGain()
  sub.frequency.value = 60
  sg.gain.setValueAtTime(0.4, now + 0.05)
  sg.gain.exponentialRampToValueAtTime(0.0001, now + 0.85)
  sub.connect(sg)
  sg.connect(ctx.destination)
  sub.start(now + 0.05)
  sub.stop(now + 0.9)

  // 8 staggered micro-clicks (fragment impacts) 1200Hz, 30ms each
  for (let i = 0; i < 8; i++) {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 1200 + Math.random() * 400
    const offset = 0.05 + i * 0.04 + Math.random() * 0.03
    g.gain.setValueAtTime(0.04, now + offset)
    g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.03)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(now + offset)
    osc.stop(now + offset + 0.04)
  }
}

// Proximity ping triggered by approaching an asteroid
// freq varies by rock size: large=220Hz, small=880Hz
export function sfxBoneyardProximityPing(freq = 440, pan = 0) {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const panner = ctx.createStereoPanner()
  osc.type = 'sine'
  osc.frequency.value = Math.max(80, Math.min(2000, freq))
  panner.pan.value = Math.max(-1, Math.min(1, pan))
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.06, now + 0.08)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.48)
  osc.connect(g)
  g.connect(panner)
  panner.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.5)
}

// Monument rock approach chord: 110+165+220Hz, 2s fadein, 4s fadeout
export function sfxBoneyardMonumentChord() {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime
  ;[110, 165, 220].forEach(freq => {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(0.05, now + 2)
    g.gain.setValueAtTime(0.05, now + 5)
    g.gain.linearRampToValueAtTime(0, now + 9)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 10)
  })
}

// ── Realm IX (Singularity) SFX ────────────────────────────────────────

// Text reveal tones (textIndex 0–3)
export function sfxSingularityTextReveal(textIndex = 0) {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime

  const events = [
    { freq: 528, dur: 4.0, vol: 0.08 },   // Name: love frequency
    { freq: 396, dur: 2.0, vol: 0.06 },   // Title: minor
    { freq: null, dur: 3.0, vol: 0.05 },  // Manifesto: chord
    { freq: 174, dur: 0.5, vol: 0.12 },   // One word: depth charge
  ]
  const ev = events[textIndex % 4]
  if (!ev) return

  if (ev.freq === null) {
    // Solfeggio chord: 396 + 528 + 639
    ;[396, 528, 639].forEach(f => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = f
      g.gain.setValueAtTime(0, now)
      g.gain.linearRampToValueAtTime(ev.vol, now + 0.3)
      g.gain.setValueAtTime(ev.vol, now + ev.dur)
      g.gain.linearRampToValueAtTime(0, now + ev.dur + 1)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + ev.dur + 1.5)
    })
  } else {
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = ev.freq
    g.gain.setValueAtTime(0, now)
    g.gain.linearRampToValueAtTime(ev.vol, now + 0.3)
    g.gain.setValueAtTime(ev.vol, now + ev.dur)
    g.gain.linearRampToValueAtTime(0, now + ev.dur + 0.5)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + ev.dur + 1)
  }
}

// Exit gold point: pure 432Hz — the harmony frequency, 600ms
export function sfxSingularityExitTone() {
  const ctx = getCtx()
  if (!ctx) return
  const now = ctx.currentTime

  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = 432
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(0.15, now + 0.15)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)
  osc.connect(g)
  g.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + 0.65)
}
