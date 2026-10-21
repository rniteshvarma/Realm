// ═══════════════════════════════════════════════════════
//  useCartographyAudio — sound for The Cartography
//  Drives the shared ambience engine instead of adding its own raw tones,
//  so everything stays in key:
//    approach → the pad opens up as the world nears
//    descent  → a soft whoosh through the atmosphere
//    inside   → the chord shifts to that world's colour
//    escape   → back to the chapter chord
//    final map→ a gentle cluster of star chimes
// ═══════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'
import heavenEngine from '../../../audio/HeavenAudioEngine'

export function useCartographyAudio({ phase, projectIndex, phaseProgress }) {
  const prevPhase = useRef(null)
  const prevProject = useRef(-1)
  const lastSwell = useRef(-1)
  const finalFired = useRef(false)

  useEffect(() => {
    if (!heavenEngine._running) return

    const phaseChanged = prevPhase.current !== phase || prevProject.current !== projectIndex
    prevPhase.current = phase
    prevProject.current = projectIndex

    if (phase === 'approach') {
      // Throttle: only re-target the filter when the amount changes noticeably
      const amt = Math.round(phaseProgress * 10) / 10
      if (amt !== lastSwell.current) {
        lastSwell.current = amt
        heavenEngine.swell(amt)
      }
    } else if (phaseChanged) {
      lastSwell.current = -1
      if (phase === 'descent') heavenEngine.whoosh({ level: 0.07, duration: 1.6 })
      if (phase === 'inside') heavenEngine.setWorld(projectIndex)
      if (phase === 'escape') heavenEngine.resetWorld()
    }

    if (phase === 'escape' && phaseProgress > 0.6 && !finalFired.current && projectIndex >= 3) {
      finalFired.current = true
      heavenEngine.chord([74, 78, 81, 83, 86], { spread: 0.28, level: 0.018 })
    }
  }, [phase, projectIndex, phaseProgress])

  // Leaving the chapter: hand the mood back to the engine
  useEffect(() => () => heavenEngine.resetWorld(), [])
}
