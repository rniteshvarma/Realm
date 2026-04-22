import React, { Suspense, lazy, useEffect, useRef, Component } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from './store/useStore'
import { useScroll, getLenis } from './hooks/useScroll'
import { useCursor } from './hooks/useCursor'
import { useSound } from './hooks/useSound'
import CustomCursor from './components/cursor/CustomCursor'
import LoadingRitual from './components/loader/LoadingRitual'
import AudioVisualizer from './audio/AudioVisualizer'
import ConstellationNav from './components/constellation/ConstellationNav'
import LoreTracker from './components/lore/LoreTracker'

import './styles/layout.css'

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger)

// Error Boundary for the immersive realms
class RealmErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error("Realm Error Caught:", error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', background: '#0D1B2A', color: '#C9A84C',
          zIndex: 9999, fontFamily: 'monospace', padding: '2rem', textAlign: 'center'
        }}>
          <h2>REALM CRASH</h2>
          <p style={{ margin: '1rem 0', opacity: 0.8 }}>{this.state.error?.toString()}</p>
          <pre style={{ 
            fontSize: '0.7rem', maxHeight: '30vh', overflow: 'auto', 
            background: 'rgba(0,0,0,0.5)', padding: '1rem', textAlign: 'left' 
          }}>
            {this.state.error?.stack}
          </pre>
          <button onClick={() => window.location.reload()} style={{
            background: '#C9A84C', color: 'black', border: 'none', padding: '0.8rem 1.5rem', marginTop: '2rem', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', letterSpacing: '0.1em'
          }}>REBOOT SEQUENCE</button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── REALM ORDER (BRIEF 11) ────────────────────────────────────────────────
// 0: THE GATE         — LoadingRitual (not in scroll stack)
// 1: THE MANIFESTO    — HeroScene
// 2: THE FORGE        — ArsenalScene
// 3: THE CARTOGRAPHY  — CartographyScene
// 4: THE NEBULA       — NebulaScene
// 5: THE FREQUENCY    — FrequencyScene
// 6: THE LOOKING GLASS — SignalScene

// Lazy load Realms
const HeroScene        = lazy(() => import('./components/realms/Manifesto/HeroScene'))
const ArsenalScene     = lazy(() => import('./components/realms/Arsenal/ArsenalScene'))
const CartographyScene = lazy(() => import('./components/realms/Cartography/CartographyScene'))
const NebulaScene      = lazy(() => import('./components/realms/Nebula/NebulaScene'))
const FrequencyScene   = lazy(() => import('./components/realms/Frequency/FrequencyScene'))
const SignalScene      = lazy(() => import('./components/realms/Signal/SignalScene'))
const TranscendenceScene = lazy(() => import('./components/realms/Transcendence/TranscendenceScene'))
const AscensionScene = lazy(() => import('./components/realms/Ascension/AscensionScene'))

// Preload next realm when current becomes visible
function usePreloadWhenVisible(sectionRef, importFn) {
  useEffect(() => {
    if (!sectionRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { importFn(); observer.disconnect() } },
      { rootMargin: '100px' }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])
}

function App() {
  const isLoading      = useStore((s) => s.isLoading)
  const currentRealm   = useStore((s) => s.realm)
  const signalShattered = useStore((s) => s.signalShattered)
  const soundEnabled   = useStore((s) => s.soundEnabled)
  const toggleSound    = useStore((s) => s.toggleSound)
  const containerRef   = useRef(null)

  // Preload refs for adjacent realm chunks
  const realm2Ref = useRef(null)  // preload Cartography while in Forge
  const realm3Ref = useRef(null)  // preload Nebula while in Cartography
  const realm4Ref = useRef(null)  // preload Frequency while in Nebula
  const realm5Ref = useRef(null)  // preload Looking Glass while in Frequency

  usePreloadWhenVisible(realm2Ref, () => import('./components/realms/Cartography/CartographyScene'))
  usePreloadWhenVisible(realm3Ref, () => import('./components/realms/Nebula/NebulaScene'))
  usePreloadWhenVisible(realm4Ref, () => import('./components/realms/Frequency/FrequencyScene'))
  usePreloadWhenVisible(realm5Ref, () => import('./components/realms/Signal/SignalScene'))

  // ── HOOKS — ORDER IS CRITICAL ──
  useSound()
  useScroll()
  useCursor()

  useEffect(() => {
    if (isLoading) return
    const lenis = getLenis()

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Auto-detect low-performance devices
    const isMobileString = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isSmallScreen  = window.innerWidth < 1024
    const lowCores  = navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4
    const lowMemory = navigator.deviceMemory && navigator.deviceMemory < 4
    const isLowPerf = prefersReducedMotion || isMobileString || (isSmallScreen && lowCores) || lowMemory || lowCores

    if (isLowPerf) {
      useStore.getState().setPerformanceLow(true)
      useStore.getState().setQuality('LOW')
    }

    // Sync ScrollTrigger with Lenis — exact config from BRIEF 11
    if (lenis && !prefersReducedMotion) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)  // critical for smoothness
    } else if (lenis && prefersReducedMotion) {
      lenis.destroy()
    }

    // ── Update Current Realm via ScrollTrigger ───────────────────────
    // We use a robust intersection-like check via ScrollTrigger
    const sections = gsap.utils.toArray('.realm-section')
    sections.forEach((section, i) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => {
          const r = i + 1
          useStore.getState().setRealm(r)
          useStore.getState().markRealmVisited(r)
        },
        onEnterBack: () => {
          const r = i + 1
          useStore.getState().setRealm(r)
          useStore.getState().markRealmVisited(r)
        },
      })
    })

    // Initial refresh once everything is rendered
    setTimeout(() => ScrollTrigger.refresh(), 500)

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isLoading])

  // Refresh ScrollTrigger whenever currentRealm changes to account for new pins/spacers
  useEffect(() => {
    if (!isLoading) {
      ScrollTrigger.refresh()
      // Sometimes one refresh isn't enough for nested pins
      const timer = setTimeout(() => ScrollTrigger.refresh(), 200)
      return () => clearTimeout(timer)
    }
  }, [currentRealm, isLoading])

  return (
    <>
      <CustomCursor />
      
      {/* PERSISTENT UI */}
      <div className="persistent-ui">
        <AudioVisualizer enabled={soundEnabled} onToggle={toggleSound} />
      </div>

      {/* CONSTELLATION NAV — 7 nodes once loaded */}
      {!isLoading && <ConstellationNav />}

      {/* LORE TRACKER */}
      {!isLoading && <LoreTracker />}

      {/* WARP OVERLAY — for constellation nav warp transitions */}
      <div className="warp-overlay" id="warp-overlay" />
      
      {isLoading && <LoadingRitual />}

      {!isLoading && (
        <main className="experience-container" ref={containerRef}>
          <RealmErrorBoundary>
            {/* REALM I: THE MANIFESTO */}
            <section className="realm-section realm-1" data-realm="1">
              <Suspense fallback={<div className="realm-loader-placeholder" />}>
                <HeroScene />
              </Suspense>
            </section>
            
            {/* REALM II: THE FORGE */}
            <section className="realm-section realm-2" data-realm="2" ref={realm2Ref}>
              <Suspense fallback={<div className="realm-loader-placeholder" />}>
                <ArsenalScene />
              </Suspense>
            </section>

            {/* REALM III: THE CARTOGRAPHY */}
            <section className="realm-section realm-3" data-realm="3" ref={realm3Ref}>
              <Suspense fallback={<div className="realm-loader-placeholder" />}>
                <CartographyScene />
              </Suspense>
            </section>

            {/* REALM IV: THE NEBULA */}
            <section className="realm-section realm-4" data-realm="4" ref={realm4Ref}>
              <Suspense fallback={<div className="realm-loader-placeholder" />}>
                <NebulaScene />
              </Suspense>
            </section>

            {/* REALM V: THE FREQUENCY */}
            <section className="realm-section realm-5" data-realm="5" ref={realm5Ref}>
              <Suspense fallback={<div className="realm-loader-placeholder" />}>
                <FrequencyScene />
              </Suspense>
            </section>

            {/* REALM VI: THE LOOKING GLASS */}
            <section className="realm-section realm-6" data-realm="6">
              <Suspense fallback={<div className="realm-loader-placeholder" />}>
                <SignalScene />
              </Suspense>
            </section>

            {/* REALM VII: TRANSCENDENCE */}
            <section 
              className={`realm-section realm-7 ${!signalShattered ? 'locked-section' : ''}`} 
              data-realm="7"
            >
              {signalShattered && (
                <Suspense fallback={<div className="realm-loader-placeholder" />}>
                  <TranscendenceScene />
                </Suspense>
              )}
            </section>

            {/* REALM VIII: ASCENSION */}
            <section 
              className={`realm-section realm-8 ${!signalShattered ? 'locked-section' : ''}`} 
              data-realm="8"
            >
              {signalShattered && (
                <Suspense fallback={<div className="realm-loader-placeholder" />}>
                  <AscensionScene />
                </Suspense>
              )}
            </section>
          </RealmErrorBoundary>
        </main>
      )}
    </>
  )
}

export default App
