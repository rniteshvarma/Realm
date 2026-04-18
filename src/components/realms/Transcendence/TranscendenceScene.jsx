import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Instances, Instance } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useStore } from '../../../store/useStore'
import './Transcendence.css'

// ── Upward particle instanced mesh ────────────────────────────────────
const PARTICLE_COUNT = 1200

function ParticleField() {
  const ref = useRef()

  const particles = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      position: [
        (Math.random() - 0.5) * 16,
        Math.random() * 80 - 10,
        (Math.random() - 0.5) * 16,
      ],
      speed: 0.02 + Math.random() * 0.06,
      scale: 0.03 + Math.random() * 0.08,
      isGold: Math.random() > 0.45,
    }))
  }, [])

  useFrame((state, delta) => {
    // Particles drift upward; we handle in Instance position via groups
    if (ref.current) {
      ref.current.rotation.y += delta * 0.01
    }
  })

  return (
    <group ref={ref}>
      <Instances limit={PARTICLE_COUNT} range={PARTICLE_COUNT}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial />
        {particles.map((p, i) => (
          <FloatingParticle key={i} {...p} index={i} />
        ))}
      </Instances>
    </group>
  )
}

function FloatingParticle({ position, speed, scale, isGold, index }) {
  const ref     = useRef()
  const yStart  = useRef(position[1])
  const color   = isGold ? '#C9A84C' : '#F0F0F0'

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    // Drift upward and loop
    const y = ((yStart.current + t * speed * 30) % 90) - 10
    ref.current.position.set(
      position[0] + Math.sin(t * 0.3 + index) * 0.3,
      y,
      position[2] + Math.cos(t * 0.2 + index) * 0.2
    )
    ref.current.scale.setScalar(scale)
    ref.current.color.set(color)
  })

  return <Instance ref={ref} position={position} scale={scale} color={color} />
}

// ── Volumetric light shaft (layered additive planes) ──────────────────
function LightShaft() {
  const planes = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      y: i * 12 + 5,
      opacity: 0.03 - i * 0.003,
    })),
  [])

  return (
    <group>
      {planes.map((p, i) => (
        <mesh key={i} position={[0, p.y, 0]} rotation={[0, i * 0.3, 0]}>
          <cylinderGeometry args={[3 + i * 0.5, 2, 12, 32, 1, true]} />
          <meshBasicMaterial
            color="#C9A84C"
            transparent
            opacity={p.opacity}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
      {/* Central spot light beam */}
      <spotLight
        position={[0, 100, 0]}
        angle={0.15}
        penumbra={0.8}
        intensity={3}
        color="#FFF8E0"
        target-position={[0, 0, 0]}
      />
    </group>
  )
}

// ── Three orbiting portal shapes ──────────────────────────────────────
function PortalOrbit({ type, orbitAngle }) {
  const ref = useRef()

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + orbitAngle
    const r = 4.5
    ref.current.position.x = Math.cos(t * 0.4) * r
    ref.current.position.z = Math.sin(t * 0.4) * r
    ref.current.position.y = Math.sin(t * 0.6 + orbitAngle) * 0.8
    ref.current.rotation.y += 0.015
    ref.current.rotation.x += 0.008
  })

  const color = '#C9A84C'
  return (
    <group ref={ref}>
      {type === 'circle' && (
        <mesh>
          <torusGeometry args={[0.6, 0.05, 16, 64]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      )}
      {type === 'triangle' && (
        <mesh>
          <coneGeometry args={[0.65, 0.9, 3]} />
          <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.3} />
        </mesh>
      )}
      {type === 'square' && (
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.05]} />
          <meshStandardMaterial color={color} wireframe emissive={color} emissiveIntensity={0.3} />
        </mesh>
      )}
    </group>
  )
}

function TranscendScene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 22]} fov={55} />
      <ambientLight intensity={0.05} />
      <pointLight position={[0, 5, 0]} color="#C9A84C" intensity={1.5} />
      <fog attach="fog" color="#000005" near={20} far={90} />

      <LightShaft />
      <ParticleField />

      <PortalOrbit type="circle"   orbitAngle={0} />
      <PortalOrbit type="triangle" orbitAngle={(Math.PI * 2) / 3} />
      <PortalOrbit type="square"   orbitAngle={(Math.PI * 4) / 3} />
    </>
  )
}

// ── Text sequence auto-play ────────────────────────────────────────────
const TEXT_LINES = [
  { text: 'YOU HAVE REACHED THE END OF REALM.', delay: 0,   size: 'sm' },
  { text: 'BUT REALM HAS NO END.',               delay: 1.5, size: 'sm' },
  { text: 'IT IS A LIVING DOCUMENT.',             delay: 3,   size: 'sm' },
  { text: 'A SIGNAL STILL BEING SENT.',           delay: 4.5, size: 'sm' },
  { text: 'NITESH VARMA',                          delay: 6.5, size: 'lg' },
  { text: 'CREATIVE TECHNOLOGIST',                 delay: 7.5, size: 'xs' },
  { text: 'IF YOU FELT SOMETHING — LET\'S BUILD SOMETHING.', delay: 9.5, size: 'md' },
]

export default function TranscendenceScene() {
  const containerRef   = useRef(null)
  const [visibleLines, setVisibleLines] = useState([])
  const [portalsVisible, setPortals] = useState(false)
  const [sigReveal, setSigReveal] = useState(false)
  const hasStarted = useRef(false)

  // Intersection observer to trigger sequence
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasStarted.current) {
        hasStarted.current = true
        // Reveal text lines one by one
        TEXT_LINES.forEach((line, i) => {
          setTimeout(() => {
            setVisibleLines(prev => [...prev, i])
          }, line.delay * 1000)
        })
        // Portals appear after text sequence
        setTimeout(() => setPortals(true), 12000)
      }
    }, { threshold: 0.4 })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="transcendence" ref={containerRef}>

      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <TranscendScene />
      </Canvas>

      {/* Text sequence overlay */}
      <div className="transcend-text">
        {TEXT_LINES.map((line, i) => (
          <p
            key={i}
            className={`transcend-line size-${line.size} ${visibleLines.includes(i) ? 'visible' : ''}`}
          >
            {line.text}
          </p>
        ))}
      </div>

      {/* Three portal CTAs */}
      {portalsVisible && (
        <div className="transcend-portals">
          <PortalCTA
            type="circle"
            label="INITIATE"
            detail="rniteshvarma@gmail.com"
            href="mailto:rniteshvarma@gmail.com"
          />
          <PortalCTA
            type="triangle"
            label="CONNECT"
            detail="linkedin.com/in/niteshvarma"
            href="https://www.linkedin.com/in/niteshvarma/"
            external
          />
          <PortalCTA
            type="square"
            label="DOSSIER"
            detail="DOWNLOAD CV"
            href="#"
          />
        </div>
      )}

      {/* REALM Signature */}
      <div className="realm-signature">
        <button
          className="sig-dot"
          onClick={() => setSigReveal(r => !r)}
          aria-label="About REALM"
        />
        {sigReveal ? (
          <span className="sig-reveal">
            This entire experience was hand-coded.
            No templates. No drag-and-drop.
            Every frame is intentional.
          </span>
        ) : (
          <span>REALM v2.0 — BUILT IN THE DARK — 2026</span>
        )}
      </div>
    </div>
  )
}

function PortalCTA({ type, label, detail, href, external }) {
  const [hovered, setHovered] = useState(false)

  const shapes = {
    circle:   '◯',
    triangle: '△',
    square:   '□',
  }

  return (
    <a
      href={href}
      className={`portal-cta portal-${type} ${hovered ? 'hovered' : ''}`}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor="hover-link"
    >
      <span className="portal-shape">{shapes[type]}</span>
      <span className="portal-label">{label}</span>
      {hovered && <span className="portal-detail">{detail}</span>}
    </a>
  )
}
