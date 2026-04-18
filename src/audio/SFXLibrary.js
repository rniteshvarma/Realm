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
