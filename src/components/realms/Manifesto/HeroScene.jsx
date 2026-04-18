import { useEffect, useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useStore } from '../../../store/useStore'

import vertShader from '../../../gl/shaders/iridescent.vert.glsl?raw'
import fragShader from '../../../gl/shaders/iridescent.frag.glsl?raw'
import ManifestoText from './ManifestoText'
import './Manifesto.css'

// ── Metatron's Cube SVG paths (sacred geometry) ──────────────────────
function MetatronsCube() {
  // Flower of Life + connecting lines approximation
  const r = 50  // radius of each circle
  const cx = 200, cy = 200  // center
  const circles = [
    [cx, cy],
    [cx + r, cy],
    [cx - r, cy],
    [cx + r/2, cy + r * Math.sqrt(3)/2],
    [cx - r/2, cy + r * Math.sqrt(3)/2],
    [cx + r/2, cy - r * Math.sqrt(3)/2],
    [cx - r/2, cy - r * Math.sqrt(3)/2],
  ]
  // Lines connecting all circle centers (Metatron's Cube)
  const lines = []
  circles.forEach((a, i) => {
    circles.forEach((b, j) => {
      if (j > i) {
        lines.push(<line key={`${i}-${j}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />)
      }
    })
  })
  return (
    <svg viewBox="0 0 400 400" className="metatron-svg">
      {circles.map((c, i) => (
        <circle key={i} cx={c[0]} cy={c[1]} r={r} />
      ))}
      <circle cx={cx} cy={cy} r={r * 2} />
      {lines}
    </svg>
  )
}

function IridescentBackground() {
  const materialRef = useRef()
  const mouse = useStore(state => state.mouse)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uMouse.value.x += (mouse.x - materialRef.current.uniforms.uMouse.value.x) * 0.05
      materialRef.current.uniforms.uMouse.value.y += (mouse.y - materialRef.current.uniforms.uMouse.value.y) * 0.05
    }
  })

  useEffect(() => {
    const handleResize = () => {
      if(materialRef.current) {
         materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

// ── Egg 1: THE FIRST WORD ─────────────────────────────────────────────
// If user doesn't move mouse for 12s → "PATIENT" ghost word appears
const EGG1_IDLE_MS = 12000

function useEgg1(ghostRef, discoverEgg) {
  const timerRef    = useRef(null)
  const foundRef    = useRef(false)
  const fadeOutRef  = useRef(null)

  useEffect(() => {
    const resetTimer = () => {
      clearTimeout(timerRef.current)
      // If ghost is visible, hide it
      if (ghostRef.current) {
        gsap.to(ghostRef.current, { opacity: 0, duration: 0.5 })
      }
      timerRef.current = setTimeout(() => {
        if (!ghostRef.current) return
        gsap.to(ghostRef.current, { opacity: 1, duration: 0.8 })
        // Auto-fade after 3s
        fadeOutRef.current = setTimeout(() => {
          gsap.to(ghostRef.current, { opacity: 0, duration: 0.8 })
        }, 3000)
      }, EGG1_IDLE_MS)
    }

    window.addEventListener('mousemove', resetTimer)
    resetTimer()
    return () => {
      window.removeEventListener('mousemove', resetTimer)
      clearTimeout(timerRef.current)
      clearTimeout(fadeOutRef.current)
    }
  }, [ghostRef])

  const handleGhostHover = () => {
    if (!foundRef.current) {
      foundRef.current = true
      discoverEgg('patient')
    }
  }

  return { handleGhostHover }
}

export default function HeroScene() {
  const performanceLow = useStore(state => state.performanceLow)
  const discoverEgg    = useStore(state => state.discoverEgg)
  const ghostRef       = useRef(null)
  const { handleGhostHover } = useEgg1(ghostRef, discoverEgg)

  return (
    <div className="manifesto-realm">
      {/* Metatron's Cube watermark */}
      <div className="manifesto-metatron">
        <MetatronsCube />
      </div>

      {/* Egg 1: Ghost PATIENT word */}
      <div
        ref={ghostRef}
        className="manifesto-ghost-word"
        onMouseEnter={handleGhostHover}
      >
        PATIENT
      </div>

      <div className="manifesto-canvas-wrapper">
        <Canvas gl={{ antialias: true, alpha: false }} dpr={[1, performanceLow ? 1 : 2]}>
          <OrthographicCamera makeDefault position={[0, 0, 1]} left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} /> 
          <IridescentBackground />
          
          {!performanceLow && (
            <EffectComposer multisampling={0}>
              <Bloom 
                intensity={1.2} 
                luminanceThreshold={0.2} 
                luminanceSmoothing={0.9} 
                blendFunction={BlendFunction.SCREEN} 
              />
              <ChromaticAberration 
                offset={[0.002, 0.002]} 
                blendFunction={BlendFunction.NORMAL} 
              />
            </EffectComposer>
          )}
        </Canvas>
      </div>

      <div className="manifesto-content layer-content">
        <ManifestoText />
        <div className="scroll-hint">
            <div className="waveform-line"></div>
        </div>
      </div>
    </div>
  )
}
