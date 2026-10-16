import { useEffect } from 'react'
import Lenis from 'lenis'

let lenisInstance = null

export const useScroll = () => {
  useEffect(() => {
    // Respect reduced-motion: keep native scrolling, no smoothing layer.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    })

    // We will let App.jsx handle the RAF for better GSAP integration
    return () => {
      lenisInstance?.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisInstance
}

export const getLenis = () => lenisInstance
