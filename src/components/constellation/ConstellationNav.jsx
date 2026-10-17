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
  { x: 60, y: 8,   mass: 4.5, name: 'THE SINGULARITY',  realm: 0 },
  { x: 30, y: 22,  mass: 4,   name: 'FIRST LIGHT',      realm: 1 },
  { x: 84, y: 30,  mass: 3.5, name: 'ACCRETION',        realm: 2 },
  { x: 50, y: 48,  mass: 4,   name: 'THE RING DIVE',    realm: 3 },
  { x: 98, y: 58,  mass: 4.5, name: 'GRAVITY ASSIST',   realm: 4 },
  { x: 26, y: 70,  mass: 4.5, name: 'THE CARTOGRAPHY',  realm: 5 },
  { x: 70, y: 82,  mass: 3.5, name: 'STELLAR NURSERY',  realm: 6 },
  { x: 38, y: 100, mass: 4,   name: 'PULSAR',           realm: 7 },
  { x: 92, y: 108, mass: 4.5, name: 'DYSON SWARM',      realm: 8 },
  { x: 58, y: 124, mass: 5,   name: 'EVENT HORIZON',    realm: 9 },
  { x: 30, y: 144, mass: 4,   name: 'TRANSCENDENCE',    realm: 10 },
  { x: 80, y: 160, mass: 4.5, name: 'ASCENSION',        realm: 11 },
]

// Logical canvas size (CSS px). The star map spans ~120×150, so pivot the
// gentle sway around its centre and pad the canvas so nothing clips.
const NAV_W = 150
const NAV_H = 190
const PIVOT_X = 60
const PIVOT_Y = 86
const OFFSET_X = NAV_W / 2 - PIVOT_X
const OFFSET_Y = NAV_H / 2 - PIVOT_Y

const isLockedRealm = (realm) =>
  realm >= 10 && !useStore.getState().signalShattered

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

  // Realm 0 (the Gate) has no section — it means "back to the top"
  const target = realmIndex === 0
    ? 0
    : document.querySelector(`[data-realm="${realmIndex}"]`)
  if (target === null) return
  if (lenis) {
    lenis.start() // the Looking Glass may have paused scrolling
    lenis.scrollTo(target, {
      duration: 1.6,
      easing: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
      force: true,
    })
  } else if (target === 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

export default function ConstellationNav() {
  const canvasRef    = useRef(null)
  const rafRef       = useRef(null)
  const rotAngle     = useRef(0)
  const hoveredStar  = useRef(null)
  const tooltipRef   = useRef(null)

  const markRealmVisited = useStore(s => s.markRealmVisited)

  // Removed redundant IntersectionObserver — App.jsx ScrollTrigger is now source of truth

  const getTransformedStars = useCallback((angle) => {
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    return STARS.map(s => ({
      ...s,
      rx: OFFSET_X + PIVOT_X + (s.x - PIVOT_X) * cos - (s.y - PIVOT_Y) * sin,
      ry: OFFSET_Y + PIVOT_Y + (s.x - PIVOT_X) * sin + (s.y - PIVOT_Y) * cos,
    }))
  }, [])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // HiDPI: backing store is scaled, drawing stays in CSS px
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    if (canvas.width !== NAV_W * dpr) {
      canvas.width = NAV_W * dpr
      canvas.height = NAV_H * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, NAV_W, NAV_H)

    // Slow, bounded sway (a full spin pushed stars off the canvas)
    rotAngle.current = Math.sin(performance.now() * 0.00015) * 0.14

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
      if (isLockedRealm(star.realm) && !isCurrent) {
        ctx.beginPath()
        ctx.arc(star.rx, star.ry, star.mass * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(240,240,240,0.06)'
        ctx.fill()
        return
      }
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

  // ── Pointer events ──
  // CSS size can shrink on mobile, so map client coords back to NAV space.
  const hitTest = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const mx = (clientX - rect.left) * (NAV_W / rect.width)
    const my = (clientY - rect.top) * (NAV_H / rect.height)
    const stars = getTransformedStars(rotAngle.current)
    let best = null, bestDist = Infinity
    for (const star of stars) {
      if (isLockedRealm(star.realm)) continue
      const dist = Math.hypot(mx - star.rx, my - star.ry)
      if (dist < star.mass + 8 && dist < bestDist) { best = star; bestDist = dist }
    }
    return best
  }, [getTransformedStars])

  const handleMouseMove = useCallback((e) => {
    const star = hitTest(e.clientX, e.clientY)
    hoveredStar.current = star ? star.realm : null

    const tip = tooltipRef.current
    if (!tip) return
    if (star) {
      tip.textContent = star.name
      tip.style.opacity = '1'
      // Canvas lives in the bottom-right corner → show the label to the left
      tip.style.left = `${e.clientX - 12}px`
      tip.style.top  = `${e.clientY - 20}px`
    } else {
      tip.style.opacity = '0'
    }
  }, [hitTest])

  const handleClick = useCallback((e) => {
    // Touch has no hover, so resolve the star from the tap position
    const star = hitTest(e.clientX, e.clientY)
    if (!star) return
    markRealmVisited(star.realm)
    scrollToRealm(star.realm)
  }, [hitTest, markRealmVisited])

  const handleMouseLeave = useCallback(() => {
    hoveredStar.current = null
    if (tooltipRef.current) tooltipRef.current.style.opacity = '0'
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        width={NAV_W}
        height={NAV_H}
        className="constellation-nav"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        aria-label="Navigate between realms"
      />
      <div ref={tooltipRef} className="constellation-tooltip" />
    </>
  )
}
