import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../store/useStore'
import { CHAPTERS, TOTAL_CHAPTERS, chapterFor } from './chapters'
import './voyage.css'

// ═══════════════════════════════════════════════════════════════════════
//  MISSION HUD — the one piece of chrome every chapter shares.
//  Bottom-left: chapter index, name and mission-clock stamp. Text swaps
//  with a short "decode" scramble when the chapter changes.
// ═══════════════════════════════════════════════════════════════════════

const GLYPHS = '01<>/\\|=+*#%ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function useDecoded(text, duration = 520) {
  const [out, setOut] = useState(text)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const reveal = Math.floor(t * text.length)
      let s = ''
      for (let i = 0; i < text.length; i++) {
        const ch = text[i]
        s += i < reveal || ch === ' ' ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]
      }
      setOut(s)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, duration])
  return out
}

export default function MissionHUD() {
  const realm = useStore((s) => s.realm)
  const chapter = chapterFor(realm) ?? CHAPTERS[0]
  const index = String(chapter.realm).padStart(2, '0')
  const name = useDecoded(chapter.name)
  const stamp = useDecoded(chapter.stamp, 380)
  const barRef = useRef(null)

  // Whole-voyage progress line. Scroll extent is measured only on resize /
  // refresh (reading scrollHeight every frame forces layout); the bar is
  // updated on scroll with a direct DOM write — no React re-render.
  useEffect(() => {
    let max = 1
    let raf = 0
    const measure = () => { max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight) }
    const paint = () => {
      raf = 0
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, window.scrollY / max)})`
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(paint) }
    measure(); paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', measure)
    ScrollTrigger.addEventListener('refresh', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', measure)
      ScrollTrigger.removeEventListener('refresh', measure)
    }
  }, [])

  return (
    <div className="mission-hud" aria-live="polite">
      <div className="mission-hud__row">
        <span className="mission-hud__index">{index}</span>
        <span className="mission-hud__total">/ {String(TOTAL_CHAPTERS).padStart(2, '0')}</span>
        <span className="mission-hud__stamp">{stamp}</span>
      </div>
      <div className="mission-hud__name">{name}</div>
      <div className="mission-hud__track"><div ref={barRef} className="mission-hud__bar" /></div>
    </div>
  )
}
