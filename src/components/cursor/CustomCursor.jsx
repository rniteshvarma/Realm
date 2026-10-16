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

    let seen = false
    const onMouseMove = (e) => {
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY
      if (orb.style.opacity) { orb.style.opacity = ''; ring.style.opacity = '' }
      if (!seen) {
        // Snap the trailing ring on first move so it doesn't fly in from 0,0
        seen = true
        ringPosRef.current.x = e.clientX
        ringPosRef.current.y = e.clientY
        // data-attributes survive React re-rendering className
        orb.dataset.ready = ''
        ring.dataset.ready = ''
      }
    }

    const onMouseDown = () => {
      ring.dataset.active = ''
    }
    const onMouseUp = () => {
      delete ring.dataset.active
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // Global hover detection for interactive elements
    const SELECTOR = 'a, button, [data-cursor], [data-cursor-drag]'
    const onOver = (e) => {
      const el = e.target.closest?.(SELECTOR)
      if (el) {
        const type = (el.dataset.cursorDrag !== undefined || el.dataset.cursor === 'hover-drag') ? 'hover-drag' : 'hover-link'
        useStore.getState().setCursorState(type)
      } else {
        // Recover if the hovered element unmounted without firing mouseout
        const cur = useStore.getState().cursorState
        if (cur === 'hover-link' || cur === 'hover-drag') useStore.getState().setCursorState('default')
      }
    }
    const onOut = (e) => {
      const el = e.target.closest?.(SELECTOR)
      // Ignore moves between children of the same interactive element
      if (el && !el.contains(e.relatedTarget)) useStore.getState().setCursorState('default')
    }
    // Hide the custom cursor when the pointer leaves the window
    const onLeaveWindow = (e) => {
      if (!e.relatedTarget) { orb.style.opacity = '0'; ring.style.opacity = '0' }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.addEventListener('mouseout', onLeaveWindow)

    let last = performance.now()
    const animate = (now) => {
      // Frame-rate independent smoothing (same feel at 60Hz and 120Hz)
      const dt = Math.min((now - last) / 16.667, 4)
      last = now
      const k = 1 - Math.pow(1 - 0.12, dt)

      // Orb follows cursor exactly with a pulsing scale
      const pulse = 1 + Math.sin(now * 0.005) * 0.05
      orb.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${pulse})`

      // Ring follows with lerp (trailing)
      ringPosRef.current.x = lerp(ringPosRef.current.x, posRef.current.x, k)
      ringPosRef.current.y = lerp(ringPosRef.current.y, posRef.current.y, k)
      ring.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0)`

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.removeEventListener('mouseout', onLeaveWindow)
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
