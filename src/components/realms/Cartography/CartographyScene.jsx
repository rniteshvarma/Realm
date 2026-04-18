// ═══════════════════════════════════════════════════════
//  CartographyScene — Realm III: THE CARTOGRAPHY
//  "WORLDS I HAVE BUILT."
//  Main orchestrator for the orbital-descent project journey
// ═══════════════════════════════════════════════════════

import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useStore } from '../../../store/useStore'
import { useCartographyAudio } from './useCartographyAudio'
import { PROJECTS, buildOrbitalPath, getProjectPhase } from './cartographyData'
import OrbSystem from './OrbSystem'
import InteriorWorld from './InteriorWorld'
import ProjectOverlay from './ProjectOverlay'

import starFieldVert from '../../../gl/shaders/starField.vert.glsl?raw'
import starFieldFrag from '../../../gl/shaders/starField.frag.glsl?raw'

import './Cartography.css'

// ═══════════════════════════════════════════════════════════════════════
//  STAR FIELD — Instanced Points
// ═══════════════════════════════════════════════════════════════════════
function StarField({ warpStrength, isMobile }) {
  const count   = isMobile ? 1000 : 3000
  const meshRef = useRef()

  const { positions, sizes, brightnesses, seeds } = useMemo(() => {
    const positions   = new Float32Array(count * 3)
    const sizes       = new Float32Array(count)
    const brightnesses= new Float32Array(count)
    const seeds       = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 300
      positions[i * 3 + 1] = (Math.random() - 0.5) * 300
      positions[i * 3 + 2] = -30 - Math.random() * 200
      sizes[i]       = 0.5 + Math.random() * 2.5
      brightnesses[i]= 0.3 + Math.random() * 0.7
      seeds[i]       = Math.random()
    }
    return { positions, sizes, brightnesses, seeds }
  }, [count])

  const uniforms = useMemo(() => ({
    uTime:         { value: 0 },
    uWarpStrength: { value: 0 },
    uWarpSeed:     { value: 0 },
  }), [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   starFieldVert,
    fragmentShader: starFieldFrag,
    uniforms,
    transparent:    true,
    blending:       THREE.AdditiveBlending,
    depthWrite:     false,
    vertexColors:   false,
  }), [uniforms])

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uWarpStrength.value += (warpStrength - uniforms.uWarpStrength.value) * 0.04
  })

  return (
    <points ref={meshRef} material={material}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize"    count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aBrightness" count={count} array={brightnesses} itemSize={1} />
        <bufferAttribute attach="attributes-uWarpSeed"   count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
    </points>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  SPACECRAFT — "YOU ARE HERE" marker
// ═══════════════════════════════════════════════════════════════════════
function Spacecraft({ visible, position }) {
  const meshRef = useRef()
  useFrame((state) => {
    if (!meshRef.current || !visible) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y += 0.008
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.06
  })
  if (!visible) return null
  return (
    <mesh ref={meshRef} position={position}>
      <coneGeometry args={[0.08, 0.25, 8]} />
      <meshStandardMaterial color="#C9A84C" emissive="#C9A84C" emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  GOLD THREAD — path line between orbs (final map)
// ═══════════════════════════════════════════════════════════════════════
function GoldThread({ path, visible, opacity }) {
  const matRef = useRef()
  const points = useMemo(() => {
    const pts = []
    for (let t = 0; t <= 50; t++) pts.push(path.getPoint(t / 50))
    return pts
  }, [path])
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points])

  useFrame(() => {
    if (matRef.current) {
      matRef.current.opacity += (visible ? opacity : 0 - matRef.current.opacity) * 0.03
    }
  })

  return (
    <line geometry={geo}>
      <lineBasicMaterial ref={matRef} color="#C9A84C" transparent opacity={0} linewidth={1} />
    </line>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  CAMERA CONTROLLER
// ═══════════════════════════════════════════════════════════════════════
function CameraController({ scrollProgress, currentProjectIndex, currentPhase }) {
  const { camera } = useThree()
  const lookTarget  = useRef(new THREE.Vector3(0, 0, -10))
  const pathsRef    = useRef([])

  // Build paths once
  useEffect(() => {
    const paths = []
    PROJECTS.forEach((proj, i) => {
      const prevOrb = i > 0 ? PROJECTS[i - 1].orbPosition : null
      paths.push(buildOrbitalPath(proj, prevOrb))
    })
    pathsRef.current = paths
  }, [])

  useFrame(() => {
    if (pathsRef.current.length === 0) return

    const numProjects = PROJECTS.length
    const zoneSize    = 1.0 / numProjects
    const projIdx     = Math.min(Math.floor(scrollProgress / zoneSize), numProjects - 1)
    const zoneProgress= (scrollProgress - projIdx * zoneSize) / zoneSize
    const path        = pathsRef.current[projIdx]
    if (!path) return

    const pt = path.getPoint(Math.min(zoneProgress, 0.99))
    camera.position.lerp(pt, 0.08)

    // Look at current orb center (damped)
    const proj = PROJECTS[projIdx]
    lookTarget.current.lerp(proj.orbPosition, 0.05)
    camera.lookAt(lookTarget.current)
  })

  return null
}

// ═══════════════════════════════════════════════════════════════════════
//  CHROMATIC ABERRATION CONTROLLER (post-processing)
// ═══════════════════════════════════════════════════════════════════════
function ChromaController({ phase, phaseProgress }) {
  const offsetRef = useRef({ x: 0.0, y: 0.0 })

  // Return a THREE.Vector2-like offset driven by descent phase
  const offset = useMemo(() => new THREE.Vector2(0, 0), [])

  useFrame(() => {
    let target = 0.0
    if (phase === 'descent') {
      // Spike at surface break (40-50% = descent 0-50%)
      if (phaseProgress < 0.5) {
        target = phaseProgress * 2 * 0.018 // ramp up
      } else {
        target = (1 - phaseProgress) * 2 * 0.018 // ramp down
      }
    }
    const current = offset.x
    const lerped  = current + (target - current) * 0.15
    offset.set(lerped, lerped * 0.3)
  })

  return (
    <EffectComposer>
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={offset}
      />
    </EffectComposer>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  ORBIT METADATA UI (HTML overlay — left side info during orbit)
// ═══════════════════════════════════════════════════════════════════════
function OrbitMetaUI({ project, visible, phaseProgress }) {
  const reveal = visible && phaseProgress > 0.1

  return (
    <div className={`orbit-meta ${reveal ? 'orbit-meta--visible' : ''}`}>
      <div className="orbit-meta__number" style={{ transitionDelay: '0ms' }}>
        0{project.index + 1}
      </div>
      <h2 className="orbit-meta__title" style={{ transitionDelay: '80ms' }}>
        {project.title}
      </h2>
      <p className="orbit-meta__role" style={{ transitionDelay: '160ms' }}>
        {project.role}
      </p>
      <p className="orbit-meta__year" style={{ transitionDelay: '240ms' }}>
        {project.year}
      </p>
      <div className="orbit-meta__tags" style={{ transitionDelay: '320ms' }}>
        {project.tags.map(t => <span key={t} className="orbit-tag">{t}</span>)}
      </div>
      <p className="orbit-meta__pull-quote" style={{ transitionDelay: '400ms' }}>
        {project.pullQuote}
      </p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  NARRATIVE SCROLL BLOCKS (HTML overlay — inside phase)
// ═══════════════════════════════════════════════════════════════════════
function NarrativeBlocks({ project, phase, phaseProgress }) {
  const inside = phase === 'inside'
  // Map phase progress to block triggers per brief spec
  const showA = inside && phaseProgress > 0.12
  const showB = inside && phaseProgress > 0.38
  const showC = inside && phaseProgress > 0.56
  const showD = inside && phaseProgress > 0.76
  const showCTA = inside && phaseProgress > 0.92

  // Count-up effect for metric
  const metricNum = useMemo(() => {
    if (!project?.metric) return ''
    // Strip non-digit for counting
    const digits = project.metric.replace(/[^\d.]/g, '')
    const suffix  = project.metric.replace(/[\d.]/g, '')
    return { digits: parseFloat(digits), suffix }
  }, [project])

  const [countedNum, setCountedNum] = useState(0)
  useEffect(() => {
    if (!showC || !metricNum.digits) return
    const start = performance.now()
    const dur   = 1500
    const tick  = (now) => {
      const p  = Math.min((now - start) / dur, 1)
      const ep = 1 - Math.pow(1 - p, 3) // ease out cubic
      setCountedNum(Math.round(ep * metricNum.digits))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [showC, metricNum])

  return (
    <div className="narrative-blocks">
      {/* BLOCK A — PROJECT VERB */}
      <div className={`narrative-block narrative-block--a ${showA ? 'visible' : ''}`}>
        {project?.verb}
      </div>

      {/* BLOCK B — CHALLENGE */}
      <div className={`narrative-block narrative-block--b ${showB ? 'visible' : ''}`}>
        {project?.challenge}
      </div>

      {/* BLOCK C — METRIC */}
      <div className={`narrative-block narrative-block--c ${showC ? 'visible' : ''}`}>
        <span className="narrative-metric">
          {countedNum}{metricNum.suffix}
        </span>
        <span className="narrative-metric-desc">{project?.metricDesc}</span>
      </div>

      {/* BLOCK D — REFLECTION */}
      <div className={`narrative-block narrative-block--d ${showD ? 'visible' : ''}`}>
        "{project?.reflection}"
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  ENTRY TITLE ANIMATION (HTML overlay — triggered once)
// ═══════════════════════════════════════════════════════════════════════
function EntryTitle({ visible, onComplete }) {
  const titleRef = useRef()
  const subRef   = useRef()

  useEffect(() => {
    if (!visible || !titleRef.current) return

    const letters = Array.from(titleRef.current.querySelectorAll('.entry-title__letter'))
    gsap.timeline({ onComplete })
      .fromTo(letters,
        { opacity: 0, scale: 0.4, filter: 'blur(12px)' },
        {
          opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 0.06, stagger: { from: 'center', amount: 0.8 },
          ease: 'power2.out'
        }
      )
      .fromTo(subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      )
      // Hold 1.2s then fracture + scatter
      .to([titleRef.current, subRef.current], {
        delay: 1.2,
        opacity: 0,
        filter: 'blur(8px)',
        y: -20,
        scale: 1.05,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.in',
      })
  }, [visible, onComplete])

  if (!visible) return null

  const title = 'III. THE CARTOGRAPHY'
  return (
    <div className="entry-title-container">
      <h1 ref={titleRef} className="entry-title">
        {title.split('').map((ch, i) => (
          <span key={i} className="entry-title__letter">{ch === ' ' ? '\u00A0' : ch}</span>
        ))}
      </h1>
      <p ref={subRef} className="entry-subtitle">WORLDS I HAVE BUILT.</p>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  TRANSIT CAPTION (between orbs)
// ═══════════════════════════════════════════════════════════════════════
function TransitCaption({ projectIndex, phase }) {
  const visible = phase === 'escape' && projectIndex < PROJECTS.length - 1
  const next    = PROJECTS[projectIndex + 1]
  return (
    <div className={`transit-caption ${visible ? 'visible' : ''}`}>
      {visible && next && (
        `PROJECT ${projectIndex + 1} OF ${PROJECTS.length} — ${next.title} AHEAD`
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  PERSISTENT UI
// ═══════════════════════════════════════════════════════════════════════
function PersistentUI({ scrollProgress, projectIndex, phase, totalProjects }) {
  const progressFrac = scrollProgress
  const dimmed = phase === 'inside' || phase === 'descent'

  return (
    <>
      {/* TOP LEFT — realm label */}
      <div className={`cartography-realm-label ${dimmed ? 'dimmed' : ''}`}>
        <div className="realm-label__title">III. THE CARTOGRAPHY</div>
        <div className="realm-label__world">
          WORLD {projectIndex + 1} / {totalProjects}
        </div>
      </div>

      {/* TOP RIGHT — vertical progress bar */}
      <div className="cartography-progress-bar">
        <span className="progress-label progress-label--top">START</span>
        <div className="progress-track">
          <div
            className="progress-dot"
            style={{ top: `${progressFrac * 100}%` }}
          />
        </div>
        <span className="progress-label progress-label--bottom">END</span>
      </div>

      {/* BOTTOM CENTER — scroll hint */}
      <div className={`scroll-hint ${['orbit', 'escape'].includes(phase) ? 'visible' : ''}`}>
        <span>{phase === 'orbit' ? 'SCROLL TO DESCEND' : 'SCROLL TO CONTINUE'}</span>
        <div className="scroll-hint__arrow" />
      </div>
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  3D SCENE INNER
// ═══════════════════════════════════════════════════════════════════════
function CartographyScene3D({
  scrollProgress,
  phase,
  phaseProgress,
  projectIndex,
  warpActive,
  finalMap,
  showSpacecraft,
  onReadMore,
  isMobile,
  mouseNDC,
}) {
  const paths = useMemo(() => {
    return PROJECTS.map((proj, i) => {
      const prevOrb = i > 0 ? PROJECTS[i - 1].orbPosition : null
      return buildOrbitalPath(proj, prevOrb)
    })
  }, [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 50]} fov={55} />
      <CameraController
        scrollProgress={scrollProgress}
        currentProjectIndex={projectIndex}
        currentPhase={phase}
      />

      {/* Star field */}
      <StarField warpStrength={warpActive ? 1 : 0} isMobile={isMobile} />

      {/* Fog for depth */}
      <fog attach="fog" color="#02040A" near={40} far={120} />

      {/* Ambient */}
      <ambientLight intensity={0.08} />
      <pointLight position={[0, 30, -20]} intensity={0.5} color="#3366ff" />

      {/* All orbs */}
      {PROJECTS.map((proj, i) => (
        <OrbSystem
          key={proj.id}
          project={proj}
          phase={i === projectIndex ? phase : 'idle'}
          phaseProgress={i === projectIndex ? phaseProgress : 0}
          mouseNDC={mouseNDC}
          isActive={i === projectIndex}
          isMobile={isMobile}
        />
      ))}

      {/* Active project interior */}
      <InteriorWorld
        project={PROJECTS[projectIndex]}
        phase={phase}
        phaseProgress={phaseProgress}
        onReadMore={onReadMore}
      />

      {/* Gold threads — final map */}
      {finalMap && paths.map((path, i) => (
        <GoldThread
          key={i}
          path={path}
          visible={finalMap}
          opacity={0.5}
        />
      ))}

      {/* Spacecraft */}
      <Spacecraft
        visible={finalMap || scrollProgress < 0.05}
        position={finalMap
          ? new THREE.Vector3(12, 4, -15)
          : PROJECTS[projectIndex]?.orbPosition.clone().add(new THREE.Vector3(6, 2, 8))
        }
      />

      {/* Post-processing */}
      {!isMobile && (
        <ChromaController phase={phase} phaseProgress={phaseProgress} />
      )}
    </>
  )
}

// ═══════════════════════════════════════════════════════════════════════
//  MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════
export default function CartographyScene() {
  const containerRef = useRef(null)
  const isMobile     = useStore(s => s.performanceLow)

  // Scroll state
  const [scrollProgress,  setScrollProgress]  = useState(0)
  const [phase,           setPhase]           = useState('approach')
  const [phaseProgress,   setPhaseProgress]   = useState(0)
  const [projectIndex,    setProjectIndex]    = useState(0)
  const [zoneProgress,    setZoneProgress]    = useState(0)

  // Derived states
  const [entryVisible,    setEntryVisible]    = useState(false)
  const [entryDone,       setEntryDone]       = useState(false)
  const [finalMap,        setFinalMap]        = useState(false)
  const [warpActive,      setWarpActive]      = useState(false)
  const [overlayProject,  setOverlayProject]  = useState(null)
  const [mouseNDC,        setMouseNDC]        = useState({ x: 0, y: 0 })

  // Audio
  useCartographyAudio({ phase, projectIndex, phaseProgress, zoneProgress })

  // ── Mouse tracking ─────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      setMouseNDC({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ── ScrollTrigger ──────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const trigger = ScrollTrigger.create({
      trigger:  containerRef.current,
      start:    'top top',
      end:      'bottom bottom',
      scrub:    1.5,
      onEnter:  () => setEntryVisible(true),
      onUpdate: (self) => {
        const p = self.progress
        setScrollProgress(p)

        const { projectIndex: pi, phase: ph, phaseProgress: pp, zoneProgress: zp }
          = getProjectPhase(p, PROJECTS.length)

        setProjectIndex(pi)
        setPhase(ph)
        setPhaseProgress(pp)
        setZoneProgress(zp)

        // Warp: escape phase
        setWarpActive(ph === 'escape')

        // Final map: after all projects completed
        setFinalMap(p > 0.97)
      }
    })

    return () => trigger.kill()
  }, [])

  const handleReadMore = useCallback(() => {
    setOverlayProject(PROJECTS[projectIndex])
  }, [projectIndex])

  const handleOverlayClose = useCallback(() => {
    setOverlayProject(null)
  }, [])

  return (
    <div ref={containerRef} className="cartography-scroll-space">
      {/* Sticky Canvas wrapper */}
      <div className="cartography-sticky">

        {/* ── 3D Canvas ── */}
        <Canvas
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={isMobile ? [1, 1] : [1, 1.5]}
          style={{ position: 'absolute', inset: 0, background: '#02040A' }}
        >
          <CartographyScene3D
            scrollProgress={scrollProgress}
            phase={phase}
            phaseProgress={phaseProgress}
            projectIndex={projectIndex}
            warpActive={warpActive}
            finalMap={finalMap}
            showSpacecraft={true}
            onReadMore={handleReadMore}
            isMobile={isMobile}
            mouseNDC={mouseNDC}
          />
        </Canvas>

        {/* ── HTML Overlays ── */}

        {/* Entry title animation */}
        {entryVisible && !entryDone && (
          <EntryTitle
            visible={entryVisible}
            onComplete={() => setEntryDone(true)}
          />
        )}

        {/* Orbit metadata — left panel */}
        <OrbitMetaUI
          project={PROJECTS[projectIndex]}
          visible={phase === 'orbit'}
          phaseProgress={phaseProgress}
        />

        {/* Narrative blocks — inside phase */}
        <NarrativeBlocks
          project={PROJECTS[projectIndex]}
          phase={phase}
          phaseProgress={phaseProgress}
        />

        {/* Transit caption */}
        <TransitCaption projectIndex={projectIndex} phase={phase} />

        {/* Final map text */}
        {finalMap && (
          <div className="final-map-text">
            EVERY WORLD BEGAN AS AN EMPTY CANVAS.
          </div>
        )}

        {/* Persistent UI */}
        <PersistentUI
          scrollProgress={scrollProgress}
          projectIndex={projectIndex}
          phase={phase}
          totalProjects={PROJECTS.length}
        />

        {/* READ MORE overlay */}
        {overlayProject && (
          <ProjectOverlay
            project={overlayProject}
            onClose={handleOverlayClose}
          />
        )}
      </div>
    </div>
  )
}
