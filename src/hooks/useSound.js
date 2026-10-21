import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import heavenEngine from '../audio/HeavenAudioEngine'

// ═══════════════════════════════════════════════════════
//  useSound — wires the ambience engine to the sound toggle
//  and gives each chapter its own mood.
// ═══════════════════════════════════════════════════════

export const useSound = () => {
  const soundEnabled = useStore((s) => s.soundEnabled)
  const realm = useStore((s) => s.realm)

  useEffect(() => {
    if (soundEnabled) {
      heavenEngine.shiftToRealm(useStore.getState().realm)
      heavenEngine.start()
    } else {
      heavenEngine.stop()
    }
  }, [soundEnabled])

  // Each chapter shifts the chord and colour
  useEffect(() => {
    if (soundEnabled) heavenEngine.shiftToRealm(realm)
  }, [realm, soundEnabled])

  useEffect(() => () => heavenEngine.dispose(), [])
}
