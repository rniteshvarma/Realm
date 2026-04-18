import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useStore } from '../../../store/useStore'

import vertShader from '../../../gl/shaders/iridescent.vert.glsl?raw' // simple pass-through
import fragShader from '../../../gl/shaders/voidFractal.frag.glsl?raw'
import './RealmIX.css'

function FractalBackground() {
  const matRef = useRef()
  const mouse = useStore(state => state.mouse)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), [])

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime
      
      // Smoothly move mouse uniform
      matRef.current.uniforms.uMouse.value.x += (mouse.x - matRef.current.uniforms.uMouse.value.x) * 0.05
      matRef.current.uniforms.uMouse.value.y += (mouse.y - matRef.current.uniforms.uMouse.value.y) * 0.05
    }
  })

  useEffect(() => {
    const handleResize = () => {
      if(matRef.current) {
         matRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

export default function RealmIXScene() {
  const containerRef = useRef(null)
  const performanceLow = useStore(s => s.performanceLow)

  useEffect(() => {
    // Grand fade in for the hidden realm
    gsap.fromTo(containerRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 4, ease: 'power2.inOut' }
    )
  }, [])

  return (
    <div className="realm-ix-container" ref={containerRef}>
      <Canvas gl={{ antialias: false, alpha: false }} dpr={[1, performanceLow ? 1 : 2]}>
        <OrthographicCamera makeDefault position={[0, 0, 1]} left={-1} right={1} top={1} bottom={-1} near={0.1} far={10} /> 
        <FractalBackground />
      </Canvas>

      <div className="realm-ix-content">
        <h1 className="realm-ix-title">IX</h1>
        <p className="realm-ix-text">
          ALL SIGNALS FOUND.<br />
          THE HEAVEN WITHIN THE DARK.
        </p>
      </div>

      <div className="realm-ix-footer">
        A HIDDEN LAYER — EXPLORED BY YOU.
      </div>
    </div>
  )
}
