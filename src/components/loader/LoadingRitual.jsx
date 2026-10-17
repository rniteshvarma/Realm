import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useStore } from '../../store/useStore'
import ParticleText from './ParticleText'
import './LoadingRitual.css'

// ── Egg 5: THE OBSERVER — wait 33s before clicking ──────────────
const EGG5_TIMEOUT = 33000

export default function LoadingRitual() {
  const containerRef  = useRef(null)
  const counterRef    = useRef(null)
  const wordmarkRef   = useRef(null)
  const sigilRef      = useRef(null)
  const [complete, setComplete]       = useState(false)
  const [showWordmark, setShowWordmark] = useState(false)
  const [egg5Active, setEgg5Active]   = useState(false)
  const { setReady, setLoadProgress, discoverEgg } = useStore()
  const egg5TimerRef  = useRef(null)
  const egg5FoundRef  = useRef(false)
  const wordmarkShownRef = useRef(false)
  // Singularity choreography (read by the particle shader every frame)
  const phaseRef = useRef({ collapse: 0, bang: 0 })
  const pointRef = useRef(null)
  const flashRef = useRef(null)
  const [collapsed, setCollapsed] = useState(false)

  // Dev shortcut: ?skip jumps straight past the ritual
  useEffect(() => {
    if (import.meta.env.DEV && new URLSearchParams(location.search).has('skip')) {
      useStore.getState().setBigBang()
      setReady()
    }
  }, [setReady])

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => setComplete(true)
    })

    const updateCounter = (val) => {
      setLoadProgress(val)
      if (counterRef.current) {
        counterRef.current.innerText = `${Math.floor(val)}%`
      }
      // At 60%, reveal REALM wordmark letter-by-letter
      if (val >= 60 && !wordmarkShownRef.current) {
        wordmarkShownRef.current = true
        setShowWordmark(true)
      }
    }

    tl.to({ val: 0 }, {
      val: 33, duration: 1.5, ease: 'power2.inOut',
      onUpdate: function() { updateCounter(this.targets()[0].val) }
    })
    .to({ val: 33 }, {
      val: 66, duration: 1.2, ease: 'power3.inOut', delay: 0.5,
      onUpdate: function() { updateCounter(this.targets()[0].val) }
    })
    .to({ val: 66 }, {
      val: 88, duration: 2.0, ease: 'steps(5)', delay: 0.8,
      onUpdate: function() { updateCounter(this.targets()[0].val) }
    })
    .to({ val: 88 }, {
      val: 100, duration: 0.8, ease: 'power4.out',
      onUpdate: function() { updateCounter(this.targets()[0].val) }
    })

    return () => tl.kill()
  }, [setLoadProgress])

  // Animate wordmark in letter by letter
  useEffect(() => {
    if (!showWordmark || !wordmarkRef.current) return
    const letters = wordmarkRef.current.querySelectorAll('.wordmark-letter')
    gsap.fromTo(letters, 
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
    )
  }, [showWordmark])

  // The name holds for a beat, then spirals into one burning point
  useEffect(() => {
    if (!complete) return
    const t = setTimeout(() => {
      phaseRef.current.collapse = 1
      setCollapsed(true)
    }, 2600)
    return () => clearTimeout(t)
  }, [complete])

  // Egg 5 — start 33s idle timer when completion screen shows
  useEffect(() => {
    if (!complete) return
    egg5TimerRef.current = setTimeout(() => {
      if (!egg5FoundRef.current) {
        setEgg5Active(true)
      }
    }, EGG5_TIMEOUT)
    return () => clearTimeout(egg5TimerRef.current)
  }, [complete])

  // Egg 5 — animate sigil reappearing
  useEffect(() => {
    if (!egg5Active || !sigilRef.current) return
    gsap.fromTo(sigilRef.current,
      { opacity: 0, rotate: 0 },
      { opacity: 0.35, rotate: 360, duration: 6, ease: 'none', repeat: 0,
        onComplete: () => gsap.to(sigilRef.current, { opacity: 0, duration: 2 })
      }
    )
  }, [egg5Active])

  const handleEnter = () => {
    if (containerRef.current.dataset.exiting) return
    containerRef.current.dataset.exiting = 'true'

    // If they hovered the egg before clicking, discover it
    if (egg5Active && !egg5FoundRef.current) {
      egg5FoundRef.current = true
      discoverEgg('observer')
    }

    clearTimeout(egg5TimerRef.current)
    // The overlay unmounts under the pointer without a mouseout — reset the cursor
    useStore.getState().setCursorState('default')

    // ── BIG BANG ──
    // Everything is pulled into the point, then detonates outward. The
    // persistent starfield behind the loader takes over the same motion.
    phaseRef.current.collapse = 1
    setCollapsed(true)
    useStore.getState().setBigBang()
    const tl = gsap.timeline()
    tl.to(phaseRef.current, { bang: 1, duration: 1.6, ease: 'power2.in' }, 0.15)
    if (pointRef.current) {
      tl.to(pointRef.current, { scale: 14, opacity: 0, duration: 0.7, ease: 'expo.out' }, 0.1)
    }
    if (flashRef.current) {
      tl.fromTo(flashRef.current, { opacity: 0 }, { opacity: 1, duration: 0.18, ease: 'power2.out' }, 0.12)
        .to(flashRef.current, { opacity: 0, duration: 1.1, ease: 'power2.out' }, 0.32)
    }
    // Fallback in case the tween is interrupted; setReady is idempotent.
    const fallback = setTimeout(() => setReady(), 2200)
    tl.to(containerRef.current, {
      backgroundColor: 'rgba(0,0,0,0)', opacity: 0, duration: 1.1, ease: 'power2.inOut',
      onComplete: () => { clearTimeout(fallback); setReady() }
    }, 0.55)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleEnter() }
  }

  return (
    <div className="loading-ritual" ref={containerRef}>
      <div className="loading-ritual__content">
        {!complete ? (
          <>
            <div className="loading-ritual__sigil">
              <svg viewBox="0 0 120 120" className="sigil-svg">
                {/* Gold outer ring */}
                <circle cx="60" cy="60" r="55" className="sigil-ring-outer" />
                <path className="sigil-path" d="M60 15 Q 85 60 60 105 Q 35 60 60 15" />
                <circle cx="60" cy="60" r="12" className="sigil-core" />
              </svg>
            </div>
            <div className="loading-ritual__counter" ref={counterRef}>0%</div>
            {showWordmark && (
              <div className="loading-ritual__wordmark" ref={wordmarkRef}>
                {'REALM'.split('').map((l, i) => (
                  <span key={i} className="wordmark-letter">{l}</span>
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className="loading-ritual__completion"
            onClick={handleEnter}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Enter the experience"
          >
            {/* Egg 5: sigil ghost behind particles */}
            {egg5Active && (
              <div ref={sigilRef} className="loading-ritual__ghost-sigil" style={{ pointerEvents: 'auto' }}>
                <svg viewBox="0 0 120 120" className="sigil-svg sigil-ghost">
                  <circle cx="60" cy="60" r="55" className="sigil-ring-outer" />
                  <path className="sigil-path" d="M60 15 Q 85 60 60 105 Q 35 60 60 15" />
                  <circle cx="60" cy="60" r="12" className="sigil-core" />
                </svg>
              </div>
            )}
            <div className="loading-ritual__particles-behind" style={{ pointerEvents: 'none', zIndex: 0 }}>
              <ParticleText text="NITESH VARMA" phase={phaseRef} />
            </div>
            <div
              ref={pointRef}
              className={`singularity-point ${collapsed ? 'is-on' : ''}`}
              aria-hidden="true"
            />
            <span className="loading-ritual__enter" aria-hidden="true">
              {collapsed ? '[ TOUCH THE SINGULARITY ]' : '[ CLICK TO INITIATE ]'}
            </span>
            <div className="loading-ritual__wordmark wordmark-completion" aria-hidden="true">
              {'REALM'.split('').map((l, i) => (
                <span key={i} className="wordmark-letter">{l}</span>
              ))}
            </div>
            <div className="click-overlay" data-cursor="true" />
          </div>
        )}
      </div>
      
      <div ref={flashRef} className="big-bang-flash" aria-hidden="true" />

      <div className="loading-ritual__sound-hint">
        <span className="icon">◈</span>
        <span>SOUND OFF BY DEFAULT</span>
      </div>
    </div>
  )
}
