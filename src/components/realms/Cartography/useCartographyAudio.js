// ═══════════════════════════════════════════════════════
//  useCartographyAudio — All Realm 3 audio management
//  Wraps HeavenAudioEngine for Cartography-specific sounds
// ═══════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react'
import heavenEngine from '../../../audio/HeavenAudioEngine'

// Project frequencies as specified in BRIEF 4
const PROJECT_FREQUENCIES = [174, 285, 396, 417, 528]

// Interior ambient layer descriptors
const INTERIOR_AMBIENTS = [
  { type: 'arpeggio', note: 174,  vol: 0.03  }, // Project 1: 16th arpeggio
  { type: 'pad',      note: 285,  vol: 0.025 }, // Project 2: slow pad
  { type: 'pulse',    note: 396,  vol: 0.02  }, // Project 3: 0.5Hz LFO
  { type: 'shimmer',  note: 2000, vol: 0.015 }, // Project 4: high shimmer
  { type: 'sub',      note: 40,   vol: 0.018 }, // Project 5: sub warmth
]

function getCtx() {
  return heavenEngine.ctx
}

// ── Descent whoosh: filtered noise sweep 4kHz → 100Hz, 600ms ──────────
function playDescentWhoosh() {
  const ctx = getCtx()
  if (!ctx) return

  const bufferLen = ctx.sampleRate * 0.65
  const buf = ctx.createBuffer(1, bufferLen, ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufferLen; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferLen, 1.2)
  }
  const src = ctx.createBufferSource()
  src.buffer = buf

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(4000, ctx.currentTime)
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.6)
  filter.Q.value = 1.5

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.3, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.65)

  src.connect(filter)
  filter.connect(gain)
  if (heavenEngine.reverbNode) gain.connect(heavenEngine.reverbNode)
  else gain.connect(ctx.destination)

  src.start()
}

// ── Project approach tone: fade in as we near the orb ─────────────────
function createApproachOscillator(frequency) {
  const ctx = getCtx()
  if (!ctx) return null

  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = frequency

  const gain = ctx.createGain()
  gain.gain.value = 0

  osc.connect(gain)
  if (heavenEngine.reverbNode) gain.connect(heavenEngine.reverbNode)
  else gain.connect(heavenEngine.masterGain || ctx.destination)

  osc.start()
  return { osc, gain }
}

// ── Interior ambient layer — unique per project ────────────────────────
function createInteriorLayer(projectIndex) {
  const ctx = getCtx()
  if (!ctx) return null

  const config = INTERIOR_AMBIENTS[projectIndex]
  if (!config) return null

  const gain = ctx.createGain()
  gain.gain.value = 0

  const nodes = []

  if (config.type === 'arpeggio') {
    // 16th note arpeggio — root + fifth, sine oscillators
    const root  = ctx.createOscillator()
    const fifth = ctx.createOscillator()
    root.type   = 'sine'
    fifth.type  = 'sine'
    root.frequency.value  = config.note
    fifth.frequency.value = config.note * 1.5 // fifth
    // LFO to gate the arpeggio
    const arpeggioLFO = ctx.createOscillator()
    arpeggioLFO.type = 'square'
    arpeggioLFO.frequency.value = 4 // 16th notes at 60bpm ~ 4Hz
    const arpeggioGain = ctx.createGain()
    arpeggioGain.gain.value = 0.5
    arpeggioLFO.connect(arpeggioGain)
    arpeggioGain.connect(root.frequency)
    root.connect(gain); fifth.connect(gain)
    root.start(); fifth.start(); arpeggioLFO.start()
    nodes.push(root, fifth, arpeggioLFO)

  } else if (config.type === 'pad') {
    // Soft major7th chord — 4 triangle oscillators
    const chord = [1, 1.25, 1.5, 1.875] // root, M3, P5, M7
    chord.forEach(ratio => {
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.value = config.note * ratio
      osc.connect(gain)
      osc.start()
      nodes.push(osc)
    })

  } else if (config.type === 'pulse') {
    // Single sine note with 0.5Hz LFO on gain
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = config.note
    const lfo = ctx.createOscillator()
    lfo.type = 'sine'
    lfo.frequency.value = 0.5
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.5
    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)
    osc.connect(gain)
    osc.start(); lfo.start()
    nodes.push(osc, lfo)

  } else if (config.type === 'shimmer') {
    // High freq triangle with vibrato
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = config.note
    const vib = ctx.createOscillator()
    vib.type = 'sine'
    vib.frequency.value = 5.5
    const vibGain = ctx.createGain()
    vibGain.gain.value = 20
    vib.connect(vibGain)
    vibGain.connect(osc.frequency)
    osc.connect(gain)
    osc.start(); vib.start()
    nodes.push(osc, vib)

  } else if (config.type === 'sub') {
    // Sub bass sine — barely audible
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = config.note
    osc.connect(gain)
    osc.start()
    nodes.push(osc)
  }

  if (heavenEngine.reverbNode) gain.connect(heavenEngine.reverbNode)
  else gain.connect(heavenEngine.masterGain || ctx.destination)

  return { gain, nodes, config }
}

// ══════════════════════════════════════════════════════════
//  MAIN HOOK
// ══════════════════════════════════════════════════════════
export function useCartographyAudio({ phase, projectIndex, phaseProgress, zoneProgress }) {
  const approachOscRef  = useRef(null) // { osc, gain }
  const interiorLayerRef = useRef(null) // { gain, nodes }
  const prevPhaseRef    = useRef(null)
  const prevProjectRef  = useRef(-1)
  const entryChorused   = useRef(false)

  // ── Entry: wide choir voicing ──────────────────────────────────
  useEffect(() => {
    if (!heavenEngine.ctx || !heavenEngine._running) return
    if (entryChorused.current) return
    entryChorused.current = true

    // Drive reverb to a vast 5s tail by re-running buildReverb
    // (engine exposes reverb rebuild — we shift oscillators to wide voicing)
    // Spread the existing choir across 2 octaves
    const ctx = heavenEngine.ctx
    if (!ctx) return
    const wideFreqs = [110, 165, 220, 330, 440, 660, 880]
    for (let i = 0; i < Math.min(wideFreqs.length, 12); i++) {
      // oscillators[1,3,5,7,9,11] are choir oscs (even-indexed after sub)
      const oscIdx = 1 + (i * 2)
      const osc = heavenEngine.oscillators[oscIdx]
      if (osc && osc.frequency) {
        osc.frequency.cancelScheduledValues(ctx.currentTime)
        osc.frequency.setValueAtTime(osc.frequency.value, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(wideFreqs[i] || 220, ctx.currentTime + 4)
      }
    }
  }, [])

  // ── Approach: project frequency rises as we near ───────────────
  const handleApproach = useCallback((projIdx, progress) => {
    const ctx = getCtx()
    if (!ctx) return

    // Ensure we have an approach osc for this project
    if (prevProjectRef.current !== projIdx) {
      // Tear down old
      if (approachOscRef.current) {
        const { gain, osc } = approachOscRef.current
        gain.gain.cancelScheduledValues(ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        setTimeout(() => { try { osc.stop() } catch(_) {} }, 600)
        approachOscRef.current = null
      }
      prevProjectRef.current = projIdx
      approachOscRef.current = createApproachOscillator(PROJECT_FREQUENCIES[projIdx])
    }

    // Ramp volume proportional to approach progress
    if (approachOscRef.current) {
      const targetVol = progress * 0.12
      approachOscRef.current.gain.gain.cancelScheduledValues(ctx.currentTime)
      approachOscRef.current.gain.gain.setValueAtTime(
        approachOscRef.current.gain.gain.value, ctx.currentTime
      )
      approachOscRef.current.gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.1)
    }
  }, [])

  // ── Descent: whoosh ────────────────────────────────────────────
  const descWhooshFired = useRef(false)
  const handleDescent = useCallback((progress) => {
    if (progress > 0.02 && !descWhooshFired.current) {
      descWhooshFired.current = true
      playDescentWhoosh()
    }
  }, [])

  // ── Interior: per-project ambient layer ───────────────────────
  const handleInteriorEnter = useCallback((projIdx) => {
    const ctx = getCtx()
    if (!ctx) return

    // Fade down approach osc
    if (approachOscRef.current) {
      approachOscRef.current.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
    }

    // Build interior layer
    if (interiorLayerRef.current) {
      // Already running — fade it up
      interiorLayerRef.current.gain.gain.cancelScheduledValues(ctx.currentTime)
      interiorLayerRef.current.gain.gain.linearRampToValueAtTime(
        interiorLayerRef.current.config.vol, ctx.currentTime + 1.5
      )
      return
    }
    const layer = createInteriorLayer(projIdx)
    if (layer) {
      interiorLayerRef.current = layer
      layer.gain.gain.linearRampToValueAtTime(layer.config.vol, ctx.currentTime + 2.0)
    }
  }, [])

  // ── Escape: tear down interior, swell choir ────────────────────
  const handleEscape = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    descWhooshFired.current = false

    if (interiorLayerRef.current) {
      interiorLayerRef.current.gain.gain.cancelScheduledValues(ctx.currentTime)
      interiorLayerRef.current.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4)
      const nodes = interiorLayerRef.current.nodes
      setTimeout(() => {
        nodes.forEach(n => { try { n.stop() } catch (_) {} })
      }, 500)
      interiorLayerRef.current = null
    }

    // Choir brief swell × 1.3
    if (heavenEngine.masterGain) {
      const mg = heavenEngine.masterGain.gain
      const current = mg.value
      mg.cancelScheduledValues(ctx.currentTime)
      mg.setValueAtTime(current, ctx.currentTime)
      mg.linearRampToValueAtTime(current * 1.3, ctx.currentTime + 0.4)
      mg.linearRampToValueAtTime(current,       ctx.currentTime + 1.4)
    }
  }, [])

  // ── Final map: all frequencies simultaneously ─────────────────
  const finalMapFired = useRef(false)
  const handleFinalMap = useCallback(() => {
    if (finalMapFired.current) return
    finalMapFired.current = true
    const ctx = getCtx()
    if (!ctx) return

    PROJECT_FREQUENCIES.forEach(freq => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const gain = ctx.createGain()
      gain.gain.value = 0
      osc.connect(gain)
      if (heavenEngine.reverbNode) gain.connect(heavenEngine.reverbNode)
      else gain.connect(ctx.destination)
      osc.start()
      gain.gain.linearRampToValueAtTime(0.008, ctx.currentTime + 3)
      // Fade out after 30s
      gain.gain.setValueAtTime(0.008, ctx.currentTime + 30)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 35)
      setTimeout(() => { try { osc.stop() } catch(_) {} }, 36000)
    })
  }, [])

  // ── Master dispatcher: phase changes ──────────────────────────
  useEffect(() => {
    const ctx = getCtx()
    if (!ctx || !heavenEngine._running) return

    if (prevPhaseRef.current !== phase) {
      if (phase === 'escape') handleEscape()
      prevPhaseRef.current = phase
    }

    if (phase === 'approach') {
      handleApproach(projectIndex, phaseProgress)
    } else if (phase === 'descent') {
      handleDescent(phaseProgress)
    } else if (phase === 'inside') {
      handleInteriorEnter(projectIndex)
    }
  }, [phase, projectIndex, phaseProgress, handleApproach, handleDescent, handleInteriorEnter, handleEscape])

  // ── Final map trigger at end of realm ─────────────────────────
  useEffect(() => {
    if (phase === 'escape' && projectIndex === 4 && phaseProgress > 0.6) {
      handleFinalMap()
    }
  }, [phase, projectIndex, phaseProgress, handleFinalMap])

  // ── Cleanup on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (approachOscRef.current) {
        try { approachOscRef.current.osc.stop() } catch (_) {}
      }
      if (interiorLayerRef.current) {
        interiorLayerRef.current.nodes.forEach(n => { try { n.stop() } catch (_) {} })
      }
    }
  }, [])

  return { playDescentWhoosh }
}
