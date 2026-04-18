import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { lerp } from '../../utils/math'
import './CustomCursor.css'

export default function CustomCursor() {
  const orbRef = useRef(null)
  const ringRef = useRef(null)
  const posRef = useRef({ x: -100, y: -100 })
  const ringPosRef = useRef({ x: -100, y: -100 })
  const cursorState = useStore((s) => s.cursorState)
  const rafRef = useRef(null)

  useEffect(() => {
    // Hide on mobile (coarse pointer = touch)
    if (window.matchMedia('(pointer: coarse)').matches) return

    const orb = orbRef.current
    const ring = ringRef.current

    const onMouseMove = (e) => {
      posRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseDown = () => {
      ring.classList.add('cursor--active')
    }
    const onMouseUp = () => {
      ring.classList.remove('cursor--active')
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // Global hover detection for interactive elements
    const addHover = () => useStore.getState().setCursorState('hover-link')
    const removeHover = () => useStore.getState().setCursorState('default')

    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('a, button, [data-cursor], [data-cursor-drag]')
      if (el) {
        const type = el.dataset.cursorDrag ? 'hover-drag' : 'hover-link'
        useStore.getState().setCursorState(type)
      }
    })
    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('a, button, [data-cursor], [data-cursor-drag]')
      if (el) useStore.getState().setCursorState('default')
    })

    const animate = () => {
      // Orb follows cursor exactly with a pulsing scale
      const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.05
      orb.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) scale(${pulse})`
 
      // Ring follows with lerp (trailing)
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, 0.08)
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, 0.08)
      ring.style.transform = `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px)`
 
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <>
      {/* Dot — exact cursor position */}
      <div
        ref={orbRef}
        className={`cursor-orb cursor-orb--${cursorState}`}
        aria-hidden="true"
      />
      {/* Trailing ring */}
      <div
        ref={ringRef}
        className={`cursor-ring cursor-ring--${cursorState}`}
        aria-hidden="true"
      >
        {cursorState === 'hover-link' && (
          <span className="cursor-ring__label">VIEW</span>
        )}
      </div>
    </>
  )
}
