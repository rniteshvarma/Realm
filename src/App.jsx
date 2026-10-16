import React, { Suspense, lazy, useEffect, useRef, useState, Component } from 'react'
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
import { RealmActiveContext } from './hooks/useRealmActive'

import './styles/layout.css'

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger)
// Mobile browsers fire resize when the address bar shows/hides — refreshing
// every pin on that causes visible jumps mid-scroll.
ScrollTrigger.config({ ignoreMobileResize: true })

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

// Lazy load Realms (import fns kept so chunks can be warmed ahead of time)
const importHero          = () => import('./components/realms/Manifesto/HeroScene')
const importArsenal       = () => import('./components/realms/Arsenal/ArsenalScene')
const importCartography   = () => import('./components/realms/Cartography/CartographyScene')
const importNebula        = () => import('./components/realms/Nebula/NebulaScene')
const importFrequency     = () => import('./components/realms/Frequency/FrequencyScene')
const importSignal        = () => import('./components/realms/Signal/SignalScene')
const importTranscendence = () => import('./components/realms/Transcendence/TranscendenceScene')
const importAscension     = () => import('./components/realms/Ascension/AscensionScene')

const HeroScene          = lazy(importHero)
const ArsenalScene       = lazy(importArsenal)
const CartographyScene   = lazy(importCartography)
const NebulaScene        = lazy(importNebula)
const FrequencyScene     = lazy(importFrequency)
const SignalScene        = lazy(importSignal)
const TranscendenceScene = lazy(importTranscendence)
const AscensionScene     = lazy(importAscension)

// Warm the first two realms while the loading ritual plays so the hero
// is ready the instant the visitor clicks in (no black frame).
importHero()
importArsenal()

// ── Realm section ────────────────────────────────────────────────────
// Section heights are pre-allocated in layout.css, so scenes can mount late
// without shifting anything. A scene mounts once it's within two viewports
// (and its chunk is warmed a little earlier), then stays mounted. While the
// section is off screen its canvases pause via RealmActiveContext.
function RealmSection({ realm, className = '', importFn, children }) {
  const ref = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [active, setActive]   = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const warm = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { importFn?.(); warm.disconnect() }
    }, { rootMargin: '400% 0px' })
    const mount = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setMounted(true)
    }, { rootMargin: '200% 0px' })
    const live = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting)
    }, { rootMargin: '25% 0px' })
    warm.observe(el); mount.observe(el); live.observe(el)
    return () => { warm.disconnect(); mount.disconnect(); live.disconnect() }
  }, [importFn])

  return (
    <section ref={ref} className={`realm-section realm-${realm} ${className}`} data-realm={realm}>
      <RealmActiveContext.Provider value={active}>
        {mounted && (
          <Suspense fallback={<div className="realm-loader-placeholder" />}>
            {children}
          </Suspense>
        )}
      </RealmActiveContext.Provider>
    </section>
  )
}

function App() {
  const isLoading      = useStore((s) => s.isLoading)
  const currentRealm   = useStore((s) => s.realm)
  const signalShattered = useStore((s) => s.signalShattered)
  const soundEnabled   = useStore((s) => s.soundEnabled)
  const toggleSound    = useStore((s) => s.toggleSound)

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
    const raf = (time) => lenis?.raf(time * 1000)
    let offScroll = null
    if (lenis) {
      offScroll = lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)  // critical for smoothness
    }

    // ── Update Current Realm via ScrollTrigger ───────────────────────
    const sections = gsap.utils.toArray('.realm-section')
    const realmTriggers = sections.map((section) => {
      const r = Number(section.dataset.realm)
      const enter = () => {
        useStore.getState().setRealm(r)
        useStore.getState().markRealmVisited(r)
      }
      return ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: enter,
        onEnterBack: enter,
      })
    })

    // Re-measure once fonts have settled (headline metrics change)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      offScroll?.()
      realmTriggers.forEach(t => t.kill())
    }
  }, [isLoading])

  // Realms VII/VIII un-hide after the glass breaks → page grows, re-measure.
  useEffect(() => {
    if (!signalShattered) return
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [signalShattered])

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
        <main className="experience-container">
          <RealmErrorBoundary>
            <RealmSection realm={1} importFn={importHero}>
              <HeroScene />
            </RealmSection>

            <RealmSection realm={2} importFn={importArsenal}>
              <ArsenalScene />
            </RealmSection>

            <RealmSection realm={3} importFn={importCartography}>
              <CartographyScene />
            </RealmSection>

            <RealmSection realm={4} importFn={importNebula}>
              <NebulaScene />
            </RealmSection>

            <RealmSection realm={5} importFn={importFrequency}>
              <FrequencyScene />
            </RealmSection>

            <RealmSection realm={6} importFn={importSignal}>
              <SignalScene />
            </RealmSection>

            {/* REALM VII: TRANSCENDENCE — unlocked by breaking the glass */}
            <RealmSection
              realm={7}
              className={!signalShattered ? 'locked-section' : ''}
              importFn={signalShattered ? importTranscendence : undefined}
            >
              {signalShattered && <TranscendenceScene />}
            </RealmSection>

            {/* REALM VIII: ASCENSION */}
            <RealmSection
              realm={8}
              className={!signalShattered ? 'locked-section' : ''}
              importFn={signalShattered ? importAscension : undefined}
            >
              {signalShattered && <AscensionScene />}
            </RealmSection>
          </RealmErrorBoundary>
        </main>
      )}
    </>
  )
}

export default App
