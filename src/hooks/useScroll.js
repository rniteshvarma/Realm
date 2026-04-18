import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useStore } from '../store/useStore'

let lenisInstance = null

export const useScroll = () => {
  const rafRef = useRef(null)

  useEffect(() => {
    lenisInstance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    // We will let App.jsx handle the RAF for better GSAP integration
    return () => {
      lenisInstance.destroy()
      lenisInstance = null
    }
  }, [])

  return lenisInstance
}

export const getLenis = () => lenisInstance
