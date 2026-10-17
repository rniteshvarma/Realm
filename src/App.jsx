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
import UniverseBackdrop from './voyage/UniverseBackdrop'
import MissionHUD from './voyage/MissionHUD'

import './styles/layout.css'
import './voyage/voyage.css'   // after layout.css so voyage rules win ties

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

// A failing chapter shouldn't take the whole voyage down with it
class ChapterBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error, info) { console.error('Chapter failed:', error, info) }
  render() {
    if (this.state.failed) {
      return <div className="chapter-fallback">SIGNAL LOST · THIS CHAPTER COULDN’T RENDER</div>
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

// Lazy load chapters (import fns kept so chunks can be warmed ahead of time)
const importFirstLight    = () => import('./voyage/chapters/FirstLight')
const importAccretion     = () => import('./voyage/chapters/Accretion')
const importRingDive      = () => import('./voyage/chapters/RingDive')
const importGravityAssist = () => import('./voyage/chapters/GravityAssist')
const importCartography   = () => import('./components/realms/Cartography/CartographyScene')
const importNursery       = () => import('./voyage/chapters/StellarNursery')
const importPulsar        = () => import('./voyage/chapters/Pulsar')
const importDyson         = () => import('./voyage/chapters/DysonSwarm')
const importEventHorizon  = () => import('./voyage/chapters/EventHorizon')
const importTranscendence = () => import('./components/realms/Transcendence/TranscendenceScene')
const importAscension     = () => import('./components/realms/Ascension/AscensionScene')

const FirstLight         = lazy(importFirstLight)
const Accretion          = lazy(importAccretion)
const RingDive           = lazy(importRingDive)
const GravityAssist      = lazy(importGravityAssist)
const CartographyScene   = lazy(importCartography)
const StellarNursery     = lazy(importNursery)
const Pulsar             = lazy(importPulsar)
const DysonSwarm         = lazy(importDyson)
const EventHorizon       = lazy(importEventHorizon)
const TranscendenceScene = lazy(importTranscendence)
const AscensionScene     = lazy(importAscension)

// Warm the first two chapters while the loading ritual plays so the hero
// is ready the instant the visitor touches the Singularity.
importFirstLight()
importAccretion()

// ── Realm section ────────────────────────────────────────────────────
// Section heights are pre-allocated in layout.css, so scenes can mount and
// unmount freely without shifting anything. A chapter mounts when it comes
// within ~1.5 viewports and unmounts again once it is more than ~3.5
// viewports away (hysteresis avoids flicker). That keeps only 2–3 WebGL
// contexts alive at a time — essential on phones, which drop contexts and
// memory aggressively. While mounted but off screen, canvases pause via
// RealmActiveContext.
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
    const near = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setMounted(true)
    }, { rootMargin: '150% 0px' })
    const far = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) setMounted(false)
    }, { rootMargin: '350% 0px' })
    const live = new IntersectionObserver(([e]) => {
      setActive(e.isIntersecting)
    }, { rootMargin: '25% 0px' })
    warm.observe(el); near.observe(el); far.observe(el); live.observe(el)
    return () => { warm.disconnect(); near.disconnect(); far.disconnect(); live.disconnect() }
  }, [importFn])

  return (
    <section ref={ref} className={`realm-section realm-${realm} ${className}`} data-realm={realm}>
      <RealmActiveContext.Provider value={active}>
        {mounted && (
          <ChapterBoundary>
            <Suspense fallback={<div className="realm-loader-placeholder" />}>
              {children}
            </Suspense>
          </ChapterBoundary>
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

    // Sync ScrollTrigger with Lenis — exact config from BRIEF 11
    const raf = (time) => lenis?.raf(time * 1000)
    let offScroll = null
    if (lenis) {
      offScroll = lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)  // critical for smoothness
    }

    // Re-measure once fonts have settled (headline metrics change)
    document.fonts?.ready.then(() => ScrollTrigger.refresh())

    return () => {
      gsap.ticker.remove(raf)
      offScroll?.()
    }
  }, [isLoading])

  // Which chapter is on screen (rebuilt when VII/VIII… unlock)
  useEffect(() => {
    if (isLoading) return
    // ── Update Current Realm via ScrollTrigger ───────────────────────
    // Locked (display:none) chapters sit at 0px and would steal the realm
    const sections = gsap.utils.toArray('.realm-section').filter((el) => el.offsetHeight > 0)
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

    return () => realmTriggers.forEach(t => t.kill())
  }, [isLoading, signalShattered])

  // Realms VII/VIII un-hide after the glass breaks → page grows, re-measure.
  useEffect(() => {
    if (!signalShattered) return
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [signalShattered])

  return (
    <>
      {/* One persistent universe behind every chapter */}
      <UniverseBackdrop />
      <CustomCursor />
      
      {/* PERSISTENT UI */}
      <div className="persistent-ui">
        <AudioVisualizer enabled={soundEnabled} onToggle={toggleSound} />
      </div>

      {/* CONSTELLATION NAV — 7 nodes once loaded */}
      {!isLoading && <ConstellationNav />}

      {/* MISSION HUD — chapter, clock, voyage progress */}
      {!isLoading && <MissionHUD />}

      {/* LORE TRACKER */}
      {!isLoading && <LoreTracker />}

      {/* WARP OVERLAY — for constellation nav warp transitions */}
      <div className="warp-overlay" id="warp-overlay" />
      
      {isLoading && <LoadingRitual />}

      {!isLoading && (
        <main className="experience-container">
          <RealmErrorBoundary>
            <RealmSection realm={1} importFn={importFirstLight}><FirstLight /></RealmSection>
            <RealmSection realm={2} importFn={importAccretion}><Accretion /></RealmSection>
            <RealmSection realm={3} importFn={importRingDive}><RingDive /></RealmSection>
            <RealmSection realm={4} importFn={importGravityAssist}><GravityAssist /></RealmSection>
            <RealmSection realm={5} importFn={importCartography}><CartographyScene /></RealmSection>
            <RealmSection realm={6} importFn={importNursery}><StellarNursery /></RealmSection>
            <RealmSection realm={7} importFn={importPulsar}><Pulsar /></RealmSection>
            <RealmSection realm={8} importFn={importDyson}><DysonSwarm /></RealmSection>
            <RealmSection realm={9} importFn={importEventHorizon}><EventHorizon /></RealmSection>

            {/* Unlocked by crossing the event horizon */}
            <RealmSection
              realm={10}
              className={!signalShattered ? 'locked-section' : ''}
              importFn={signalShattered ? importTranscendence : undefined}
            >
              {signalShattered && <TranscendenceScene />}
            </RealmSection>
            <RealmSection
              realm={11}
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
