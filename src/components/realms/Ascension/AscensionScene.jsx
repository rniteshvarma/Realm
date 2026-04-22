import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../../store/useStore'
import ascensionWallsFrag from '../../../gl/shaders/ascensionWalls.frag.glsl?raw'
import './Ascension.css'

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger)

// ── Ascension Particles (Upward Drift) ──
function AscensionParticles() {
  const count = 1000
  const meshRef = useRef()
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 15
      const y = Math.random() * 40 - 20
      const z = (Math.random() - 0.5) * 15
      const s = 0.02 + Math.random() * 0.08
      const speed = 0.5 + Math.random() * 2.0
      temp.push({ x, y, z, s, speed })
    }
    return temp
  }, [])

  useFrame((state, delta) => {
    particles.forEach((p, i) => {
      p.y += delta * p.speed
      if (p.y > 20) p.y = -20
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#C9A84C" transparent opacity={0.6} />
    </instancedMesh>
  )
}

// ── Ascension Shaft Walls ──
function AscensionShaft() {
  const materialRef = useRef()
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[10, 10, 60, 32, 1, true]} />
      <shaderMaterial 
        ref={materialRef}
        fragmentShader={ascensionWallsFrag}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// ── Ascension Portals ──
function Portal({ type, label, url, color }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    meshRef.current.rotation.y = t * 0.5
    meshRef.current.rotation.z = t * 0.3
    
    // Lazy orbit
    const orbitRadius = 4
    const speed = 0.2
    const angle = t * speed + (type === 'circle' ? 0 : type === 'triangle' ? 2.1 : 4.2)
    meshRef.current.position.x = Math.cos(angle) * orbitRadius
    meshRef.current.position.z = Math.sin(angle) * orbitRadius
    meshRef.current.position.y = Math.sin(t * 0.5 + angle) * 0.5
  })

  const handleClick = () => {
    if (url.startsWith('mailto')) {
      window.location.href = url
    } else {
      window.open(url, '_blank')
    }
  }

  return (
    <group 
      onPointerOver={() => setHovered(true)} 
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <mesh ref={meshRef} scale={hovered ? 1.4 : 1.0}>
        {type === 'circle' && <sphereGeometry args={[0.6, 32, 32]} />}
        {type === 'triangle' && <octahedronGeometry args={[0.7]} />}
        {type === 'square' && <boxGeometry args={[0.8, 0.8, 0.8]} />}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 2.0 : 0.8}
          wireframe={!hovered}
        />
      </mesh>
      {hovered && (
        <group position={[0, 1.2, 0]}>
           {/* Label overlay could be added here or via DOM */}
        </group>
      )}
    </group>
  )
}

// ── Ascension Environment ──
function AscensionEnvironment() {
  return (
    <>
      <color attach="background" args={['#000000']} />
      <fog attach="fog" args={['#000000', 5, 25]} />
      
      <spotLight 
        position={[0, -10, 0]} 
        angle={0.15} 
        penumbra={1} 
        intensity={5} 
        color="#ffffff" 
        target-position={[0, 20, 0]} 
      />
      
      <AscensionShaft />
      <AscensionParticles />
      
      <group position={[0, 0, 0]}>
        <Portal type="circle" label="EMAIL" url="mailto:hello@niteshvarma.com" color="#ffffff" />
        <Portal type="triangle" label="LINKEDIN" url="https://linkedin.com/in/niteshvarma" color="#00F5FF" />
        <Portal type="square" label="RESUME" url="/resume.pdf" color="#C9A84C" />
      </group>
    </>
  )
}

export default function AscensionScene() {
  const containerRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [showSequence, setShowSequence] = useState(false)
  const [lineIndex, setLineIndex] = useState(-1)
  const [whiteOut, setWhiteOut] = useState(false)
  const lines = [
    "YOU HAVE REACHED THE END OF REALM.",
    "BUT REALM IS STILL GROWING.",
    "IT IS A LIVING DOCUMENT.",
    "A SIGNAL STILL BEING SENT.",
    "NITESH VARMA",
    "CREATIVE TECHNOLOGIST & DESIGNER",
    "IF YOU FELT SOMETHING — LET'S BUILD SOMETHING."
  ]

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

  useEffect(() => {
    if (scrollProgress > 0.05 && !showSequence) {
      setShowSequence(true)
      setWhiteOut(true)
      setTimeout(() => setWhiteOut(false), 1200)

      let delay = 1500
      lines.forEach((_, i) => {
        setTimeout(() => setLineIndex(i), delay)
        delay += (i === 4 ? 3500 : 3000)
      });
    }
  }, [scrollProgress > 0.05, showSequence])

  return (
    <div className={`ascension-realm ${scrollProgress > 0.01 ? 'visible' : ''}`} ref={containerRef}>
      <div className={`white-out-flash ${whiteOut ? 'active' : ''}`} />
      
      <div className="ascension-canvas-container">
        <Canvas camera={{ position: [0, 5, 15], fov: 45 }}>
          <AscensionEnvironment />
        </Canvas>
      </div>

      <div className="ascension-ui">
        {lines.map((line, i) => (
          <div 
            key={i} 
            className={`ascension-line line-${i} ${lineIndex >= i ? 'active' : ''}`}
          >
            {line}
          </div>
        ))}
      </div>

      <div className="realm-signature">
        <div className="sig-left">
          REALM v2.0 — BUILT IN THE DARK — 2024
          <span className="pulsing-dot" />
        </div>
        <div className="sig-right" title="This entire experience was hand-coded. No templates. No drag-and-drop. Every frame is intentional.">
           [ INTENTIONALITY ]
        </div>
      </div>
    </div>
  )
}
