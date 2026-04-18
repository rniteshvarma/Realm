import { useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import { lerp } from '../utils/math'

export const useCursor = () => {
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const rafRef = useRef(null)
  const setMouse = useStore((s) => s.setMouse)

  useEffect(() => {
    const onMove = (e) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
      setMouse(e.clientX / window.innerWidth, e.clientY / window.innerHeight)
    }

    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.1)
      pos.current.y = lerp(pos.current.y, target.current.y, 0.1)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [setMouse])

  return { pos, target }
}
