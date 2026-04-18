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

// Lazy load Realms
const HeroScene       = lazy(() => import('./components/realms/Manifesto/HeroScene'))
const ArsenalScene    = lazy(() => import('./components/realms/Arsenal/ArsenalScene'))
const ArchiveScene    = lazy(() => import('./components/realms/Archive/ArchiveScene'))
const SignalScene     = lazy(() => import('./components/realms/Signal/SignalScene'))
const EchoChamber     = lazy(() => import('./components/realms/EchoChamber/EchoChamberScene'))
const FrequencyScene  = lazy(() => import('./components/realms/Frequency/FrequencyScene'))
const MythEngine      = lazy(() => import('./components/realms/MythEngine/MythEngineScene'))
const Transcendence   = lazy(() => import('./components/realms/Transcendence/TranscendenceScene'))
const RealmIX         = lazy(() => import('./components/realms/RealmIX/RealmIXScene'))

function App() {
  const isLoading     = useStore((s) => s.isLoading)
  const realm         = useStore((s) => s.realm)
  const soundEnabled  = useStore((s) => s.soundEnabled)
  const toggleSound   = useStore((s) => s.toggleSound)
  const realmIXUnlocked = useStore((s) => s.realmIXUnlocked)
  const containerRef  = useRef(null)
  
  // ── HOOKS — ORDER IS CRITICAL ──
  useSound()
  useScroll()
  useCursor()

  useEffect(() => {
    if (isLoading) return
    const lenis = getLenis()

    // Reduced motion & performance check
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Auto-detect potentially low performance devices
    const isMobile = /Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 1024
    if (prefersReducedMotion || isMobile) {
      useStore.getState().setPerformanceLow(true)
    }
    
    // Sync ScrollTrigger with Lenis
    if (lenis && !prefersReducedMotion) {
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    } else if (lenis && prefersReducedMotion) {
      // Disable smooth scroll if reduced motion is preferred
      lenis.destroy()
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [isLoading])

  return (
    <>
      <CustomCursor />
      
      {/* PERSISTENT UI */}
      <div className="persistent-ui">
        <AudioVisualizer enabled={soundEnabled} onToggle={toggleSound} />
      </div>

      {/* CONSTELLATION NAV — always visible once loaded */}
      {!isLoading && <ConstellationNav />}

      {/* LORE TRACKER — tracks 5 easter eggs */}
      {!isLoading && <LoreTracker />}

      {/* WARP OVERLAY — for constellation nav warp transitions */}
      <div className="warp-overlay" id="warp-overlay" />
      
      {isLoading && <LoadingRitual />}

      {!isLoading && (
        <main className="experience-container" ref={containerRef}>
          <RealmErrorBoundary>
            <Suspense fallback={<div style={{height: '100vh', width: '100vw', background: 'var(--void)'}} />}>
              
              {/* REALM 1: THE MANIFESTO */}
              <section className="realm-section realm-1" data-realm="1">
                <HeroScene />
              </section>
              
              {/* REALM 2: THE ARSENAL */}
              <section className="realm-section realm-2" data-realm="2">
                <ArsenalScene />
              </section>

              {/* REALM 3: THE ARCHIVE */}
              <section className="realm-section realm-3" data-realm="3">
                <ArchiveScene />
              </section>

              {/* REALM 4: THE SIGNAL */}
              <section className="realm-section realm-4" data-realm="4">
                <SignalScene />
              </section>

              {/* REALM 5: ECHO CHAMBER */}
              <section className="realm-section realm-5" data-realm="5">
                <EchoChamber />
              </section>

              {/* REALM 6: THE FREQUENCY */}
              <section className="realm-section realm-6" data-realm="6">
                <FrequencyScene />
              </section>

              {/* REALM 7: MYTH ENGINE */}
              <section className="realm-section realm-7" data-realm="7">
                <MythEngine />
              </section>

              {/* REALM 8: TRANSCENDENCE */}
              <section className="realm-section realm-8" data-realm="8">
                <Transcendence />
              </section>

              {/* REALM IX: HIDDEN — unlocked when all 5 eggs found */}
              {realmIXUnlocked && (
                <section className="realm-section realm-ix" data-realm="9">
                  <RealmIX />
                </section>
              )}

            </Suspense>
          </RealmErrorBoundary>
        </main>
      )}
    </>
  )
}

export default App
