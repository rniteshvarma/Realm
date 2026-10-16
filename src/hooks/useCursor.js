import { useEffect } from 'react'
import { useStore } from '../store/useStore'

// Tracks the pointer in normalised (0–1) coordinates. Batched to one store
// write per animation frame so a fast mouse doesn't flood subscribers.
export const useCursor = () => {
  useEffect(() => {
    let raf = 0
    let x = 0.5, y = 0.5

    const flush = () => {
      raf = 0
      useStore.getState().setMouse(x, y)
    }
    const onMove = (e) => {
      x = e.clientX / window.innerWidth
      y = e.clientY / window.innerHeight
      if (!raf) raf = requestAnimationFrame(flush)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])
}
