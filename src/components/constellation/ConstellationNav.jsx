import { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { useStore } from '../../store/useStore'
import { getLenis } from '../../hooks/useScroll'

// ═══════════════════════════════════════════════════════
//  CONSTELLATION NAV — "Navigate by starlight"
//  Fixed 140×140 canvas, bottom-right.
//  7 organic star positions representing each Realm.
// ═══════════════════════════════════════════════════════

// Hand-crafted organic constellation positions (like Orion's Belt)
// Each: [x, y, mass (node size), name, realm index]
const STARS = [
  { x: 60,  y: 12,  mass: 4.5, name: 'THE GATE',          realm: 0 },
  { x: 22,  y: 30,  mass: 4,   name: 'THE MANIFESTO',     realm: 1 },
  { x: 95,  y: 38,  mass: 4.5, name: 'THE FORGE',         realm: 2 },
  { x: 42,  y: 60,  mass: 3.5, name: 'THE CARTOGRAPHY',   realm: 3 },
  { x: 82,  y: 72,  mass: 4,   name: 'THE NEBULA',        realm: 4 },
  { x: 28,  y: 90,  mass: 4.5, name: 'THE FREQUENCY',     realm: 5 },
  { x: 65,  y: 112, mass: 5,   name: 'THE LOOKING GLASS', realm: 6 },
  { x: 45,  y: 135, mass: 4,   name: 'TRANSCENDENCE',     realm: 7 },
  { x: 75,  y: 160, mass: 4.5, name: 'ASCENSION',         realm: 8 },
]

// Find realm section by data-realm attribute and scroll to it
function scrollToRealm(realmIndex) {
  const warpOverlay = document.getElementById('warp-overlay')
  const lenis = getLenis()
  
  // Warp-speed streak effect
  if (warpOverlay) {
    gsap.timeline()
      .to(warpOverlay, { opacity: 1, duration: 0.1 })
      .to(warpOverlay, { opacity: 0, duration: 0.4, delay: 0.15 })
  }

  const target = document.querySelector(`[data-realm="${realmIndex}"]`)
  if (target) {
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.5, easing: (t) => Math.min(1, 1.001 * t) }) // custom ease for warp
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

export default function ConstellationNav() {
  const canvasRef    = useRef(null)
  const rafRef       = useRef(null)
  const rotAngle     = useRef(0)
  const hoveredStar  = useRef(null)
  const tooltipRef   = useRef(null)

  const realm         = useStore(s => s.realm)
  const visitedRealms = useStore(s => s.visitedRealms)
  const allEggsFound  = useStore(s => s.allEggsFound)
  const markRealmVisited = useStore(s => s.markRealmVisited)

  // Removed redundant IntersectionObserver — App.jsx ScrollTrigger is now source of truth

  const getTransformedStars = useCallback((angle) => {
    const cx = 60, cy = 60
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return STARS.map(s => ({
      ...s,
      rx: cx + (s.x - cx) * cos - (s.y - cy) * sin,
      ry: cy + (s.x - cx) * sin + (s.y - cy) * cos,
    }))
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { width, height } = canvas

    ctx.clearRect(0, 0, width, height)
    rotAngle.current += 0.0035  // 0.2°/sec → radians per frame

    const stars = getTransformedStars(rotAngle.current)
    const currentRealm = useStore.getState().realm
    const visited = useStore.getState().visitedRealms

    // ── Draw connecting lines between visited nodes ──
    ctx.save()
    stars.forEach((a, i) => {
      stars.forEach((b, j) => {
        if (j <= i) return
        const aVisited = visited.has(a.realm)
        const bVisited = visited.has(b.realm)
        if (!aVisited || !bVisited) return
        // Only connect close stars (within 60px of each other)
        const dist = Math.hypot(a.rx - b.rx, a.ry - b.ry)
        if (dist > 65) return

        const isHov = hoveredStar.current === a.realm || hoveredStar.current === b.realm
        ctx.strokeStyle = isHov
          ? 'rgba(201, 168, 76, 0.5)'
          : 'rgba(201, 168, 76, 0.12)'
        ctx.lineWidth = isHov ? 1.2 : 0.5
        ctx.beginPath()
        ctx.moveTo(a.rx, a.ry)
        ctx.lineTo(b.rx, b.ry)
        ctx.stroke()
      })
    })
    ctx.restore()

    // ── Draw stars ──
    stars.forEach(star => {
      const isCurrent  = star.realm === currentRealm
      const isVisited  = visited.has(star.realm)
      const isHovered  = hoveredStar.current === star.realm

      const r = star.mass + (isCurrent ? 2 : 0) + (isHovered ? 1.5 : 0)

      ctx.save()

      if (isCurrent) {
        // Pulsing ring
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.004)
        ctx.beginPath()
        ctx.arc(star.rx, star.ry, r + 5 + pulse * 3, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(240, 240, 240, ${0.15 + pulse * 0.2})`
        ctx.lineWidth = 0.8
        ctx.stroke()

        // Core: glowing white
        ctx.beginPath()
        ctx.arc(star.rx, star.ry, r, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.shadowBlur = 12
        ctx.shadowColor = '#ffffff'
        ctx.fill()

      } else if (isVisited) {
        // Dim gold
        ctx.beginPath()
        ctx.arc(star.rx, star.ry, r, 0, Math.PI * 2)
        ctx.fillStyle = isHovered ? '#C9A84C' : 'rgba(201, 168, 76, 0.55)'
        ctx.shadowBlur = isHovered ? 10 : 4
        ctx.shadowColor = '#C9A84C'
        ctx.fill()

      } else {
        // Unvisited: ghost white dot
        ctx.beginPath()
        ctx.arc(star.rx, star.ry, star.mass * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(240,240,240,0.12)'
        ctx.fill()
      }

      ctx.restore()
    })

    rafRef.current = requestAnimationFrame(draw)
  }, [getTransformedStars])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  // ── Mouse events ──
  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    const stars = getTransformedStars(rotAngle.current)
    let found = null
    for (const star of stars) {
      const dist = Math.hypot(mx - star.rx, my - star.ry)
      if (dist < star.mass + 6) { found = star.realm; break }
    }
    hoveredStar.current = found

    // Tooltip
    if (tooltipRef.current) {
      if (found !== null) {
        const s = stars.find(st => st.realm === found)
        tooltipRef.current.textContent = s?.name ?? ''
        tooltipRef.current.style.opacity = '1'
        tooltipRef.current.style.left = `${e.clientX + 12}px`
        tooltipRef.current.style.top  = `${e.clientY - 20}px`
      } else {
        tooltipRef.current.style.opacity = '0'
      }
    }
  }, [getTransformedStars])

  const handleClick = useCallback((e) => {
    if (hoveredStar.current === null) return
    markRealmVisited(hoveredStar.current)
    scrollToRealm(hoveredStar.current)
  }, [markRealmVisited])

  const handleMouseLeave = useCallback(() => {
    hoveredStar.current = null
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        width={140}
        height={185}
        className="constellation-nav"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        title="Constellation Navigation"
        aria-label="Navigate between realms"
      />
      <div ref={tooltipRef} className="constellation-tooltip" />
    </>
  )
}
