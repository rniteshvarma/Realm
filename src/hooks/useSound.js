import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import heavenEngine from '../audio/HeavenAudioEngine'

// ═══════════════════════════════════════════════════════
//  useSound — Wires the HeavenAudioEngine to the sound toggle
// ═══════════════════════════════════════════════════════

export const useSound = () => {
  const soundEnabled = useStore((s) => s.soundEnabled)
  const setSoundEnabled = useStore((s) => s.setSoundEnabled)
  const realm = useStore((s) => s.realm)
  const prevRealmRef = useRef(realm)

  useEffect(() => {
    // Requirement: Absolute silence when scrolling past Realm II unless manually overridden.
    if (realm > 2 && prevRealmRef.current <= 2) {
      if (soundEnabled) {
        setSoundEnabled(false)
      }
    }
    prevRealmRef.current = realm
  }, [realm, soundEnabled, setSoundEnabled])

  useEffect(() => {
    if (soundEnabled) {
      heavenEngine.start()
      heavenEngine.shiftToRealm(realm)
    } else {
      heavenEngine.stop()
    }
  }, [soundEnabled])

  // Sync engine state to scroll/realm
  useEffect(() => {
    if (soundEnabled) {
      heavenEngine.shiftToRealm(realm)
    }
  }, [realm, soundEnabled])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      heavenEngine.dispose()
    }
  }, [])
}
