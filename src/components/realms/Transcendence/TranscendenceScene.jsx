import { useRef, useEffect, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useStore } from '../../../store/useStore'
import singularityFrag from '../../../gl/shaders/singularity.frag.glsl?raw'
import './Transcendence.css'

function SingularityEffect({ scrollProgress }) {
  const meshRef = useRef()
  const { size } = useThree()
  
  // Use a ref for uniforms to ensure they are persistent across renders
  const uniforms = useRef({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uOrbitAngle: { value: 0 },
    uCameraDistance: { value: 30 },
    uCameraHeight: { value: 6 },
    uSuckIn: { value: 0 },
    uDiskFade: { value: 1.0 },
  }).current

  useEffect(() => {
    uniforms.uResolution.value.set(size.width, size.height)
  }, [size, uniforms])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    uniforms.uTime.value = t
    uniforms.uOrbitAngle.value = t * 0.15 
    
    const suckIn = Math.max(0, (scrollProgress - 0.75) / 0.25)
    uniforms.uSuckIn.value = THREE.MathUtils.lerp(uniforms.uSuckIn.value, suckIn, 0.05)
    uniforms.uDiskFade.value = 1.0 - Math.pow(uniforms.uSuckIn.value, 4)
    
    const targetDist = 30 - scrollProgress * 24
    uniforms.uCameraDistance.value = THREE.MathUtils.lerp(uniforms.uCameraDistance.value, targetDist, 0.05)
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        fragmentShader={singularityFrag}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

function TranscendenceParticles() {
  const count = 150
  const meshRef = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 20
    }
    return pos
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.02
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.1) * 2
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#C9A84C" transparent opacity={0.3} sizeAttenuation />
    </points>
  )
}

export default function TranscendenceScene() {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=300vh',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setScrollProgress(self.progress)
      }
    })
    return () => trigger.kill()
  }, [])

  return (
    <div className="transcendence-realm" ref={containerRef}>
      <div className="transcendence-canvas-container">
        <Canvas>
          <SingularityEffect scrollProgress={scrollProgress} />
          <TranscendenceParticles />
        </Canvas>
      </div>

      <div className="transcendence-content">
        <div className="transcendence-header" style={{ opacity: 1 - scrollProgress * 1.5 }}>
          <span className="trans-label">REALM COMPLETE</span>
          <h1 className="trans-title">TRANSCENDENCE</h1>
        </div>
      </div>

      <footer className="trans-footer">
        REALM v2.0 — {new Date().getFullYear()} — END OF TRANSMISSION
      </footer>
    </div>
  )
}
