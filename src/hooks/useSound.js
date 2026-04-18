import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import heavenEngine from '../audio/HeavenAudioEngine'

// ═══════════════════════════════════════════════════════
//  useSound — Wires the HeavenAudioEngine to the sound toggle
// ═══════════════════════════════════════════════════════

export const useSound = () => {
  const soundEnabled = useStore((s) => s.soundEnabled)
  const realm = useStore((s) => s.realm)

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
