import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../../store/useStore'
import heavenEngine from '../../../audio/HeavenAudioEngine'
import { sfxSacredReveal } from '../../../audio/SFXLibrary'
import './Frequency.css'

// ── 5 creative process segments ───────────────────────────────────────
const SEGMENTS = [
  {
    name: 'PERCEIVE',
    desc: 'I absorb without judgment.\nEverything is signal — conversation,\nfriction, silence. The problem\nreveals itself if you listen.',
    colorA: new THREE.Color('#3B0080'),   // ultraviolet
    colorB: new THREE.Color('#4B0082'),   // deep indigo
  },
  {
    name: 'RESEARCH',
    desc: 'I map the territory.\nWho has walked here before?\nWhat constraints are real\nversus inherited?',
    colorA: new THREE.Color('#4B0082'),
    colorB: new THREE.Color('#00AAFF'),   // electric blue
  },
  {
    name: 'SYNTHESIZE',
    desc: 'Disparate signals collapse\ninto a single idea.\nThis is where the work\nactually begins.',
    colorA: new THREE.Color('#00AAFF'),
    colorB: new THREE.Color('#00F5FF'),   // teal
  },
  {
    name: 'BUILD',
    desc: 'The prototype is the argument.\nI make things to think.\nEvery commit is a hypothesis\nwaiting to be disproven.',
    colorA: new THREE.Color('#00F5FF'),
    colorB: new THREE.Color('#C9A84C'),   // gold
  },
  {
    name: 'RELEASE',
    desc: 'Letting go is a skill.\nThe work becomes itself\nwhen it meets the world.\nI stay curious about what\nit becomes without me.',
    colorA: new THREE.Color('#C9A84C'),
    colorB: new THREE.Color('#FFFFFF'),   // pure white → dissolves
  },
]

// ── Composite waveform mesh ────────────────────────────────────────────
function WaveformMesh({ scrollProgress }) {
  const meshRef  = useRef()
  const matRef   = useRef()
  const countRef = 2000

  const positions = useMemo(() => {
    const pos = new Float32Array(countRef * 3)
    for (let i = 0; i < countRef; i++) {
      pos[i * 3 + 0] = (i / countRef) * 200 - 20    // x: spread across horizon
      pos[i * 3 + 1] = 0
      pos[i * 3 + 2] = 0
    }
    return pos
  }, [])

  const segIdx = Math.min(Math.floor(scrollProgress * 5), 4)
  const seg    = SEGMENTS[segIdx]
  const nextSeg = SEGMENTS[Math.min(segIdx + 1, 4)]
  const t       = (scrollProgress * 5) % 1

  const color = seg.colorA.clone().lerp(nextSeg.colorA, t * 0.5)

  useFrame((state) => {
    const geo  = meshRef.current?.geometry
    if (!geo) return
    const pos  = geo.attributes.position.array
    const time = state.clock.elapsedTime

    for (let i = 0; i < countRef; i++) {
      const x  = (i / countRef) * Math.PI * 12
      const sp = scrollProgress * 5
      // Multi-frequency composite wave
      const y =
        Math.sin(x * 1.0 - time * 1.2) * 2.5 +
        Math.sin(x * 2.3 - time * 0.8) * 1.2 +
        Math.sin(x * 0.5 - time * 0.5) * 3.5 * Math.min(sp / 4, 1) +
        Math.sin(x * 4.1 - time * 1.8) * 0.5
      pos[i * 3 + 1] = y + 3   // float above floor plane
    }
    geo.attributes.position.needsUpdate = true
    if (matRef.current) matRef.current.color = color
  })

  return (
    <line ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={countRef}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial ref={matRef} color={color} linewidth={2} />
    </line>
  )
}

// ── Hex floor ground plane ─────────────────────────────────────────────
function HexFloor({ scrollProgress }) {
  const meshRef = useRef()
  const matRef  = useRef()
  const segIdx  = Math.min(Math.floor(scrollProgress * 5), 4)
  const seg     = SEGMENTS[segIdx]

  useFrame((state) => {
    if (matRef.current) {
      const t = state.clock.elapsedTime
      // Animate hex grid brightness in time
      matRef.current.emissive = seg.colorA.clone().multiplyScalar(
        0.08 + Math.abs(Math.sin(t * 1.5)) * 0.05
      )
    }
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <planeGeometry args={[200, 200, 60, 60]} />
      <meshStandardMaterial
        ref={matRef}
        color="#050510"
        roughness={0.9}
        emissive={seg.colorA}
        emissiveIntensity={0.12}
        wireframe
        opacity={0.3}
        transparent
      />
    </mesh>
  )
}

// ── Camera that travels forward on scroll ──────────────────────────────
function TravelCamera({ scrollProgress }) {
  const { camera } = useThree()

  useFrame(() => {
    const targetZ = -scrollProgress * 160 + 15
    camera.position.z += (targetZ - camera.position.z) * 0.06
    camera.lookAt(camera.position.x, 2, camera.position.z - 50)
  })

  return null
}

// ── Segment label floating in 3D ──────────────────────────────────────
function SegmentLabel({ segment, index, scrollProgress }) {
  const visible = Math.abs(scrollProgress * 5 - index) < 0.7
  const z = -index * 32 + 8

  return (
    <group position={[0, 8, z]} visible={visible}>
      <Text
        fontSize={2.5}
        color={segment.colorB.getStyle()}
        anchorX="center"
        anchorY="top"
        font={undefined}
        letterSpacing={0.08}
      >
        {segment.name}
      </Text>
      <Text
        fontSize={0.45}
        color="#F0F0F0"
        anchorX="center"
        anchorY="top"
        position={[0, -3.5, 0]}
        maxWidth={14}
        textAlign="center"
        fillOpacity={0.6}
      >
        {segment.desc}
      </Text>
    </group>
  )
}

// ── Main scene ─────────────────────────────────────────────────────────
function FreqScene({ scrollProgress }) {
  const segIdx = Math.min(Math.floor(scrollProgress * 5), 4)
  const seg    = SEGMENTS[segIdx]

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={70} />
      <TravelCamera scrollProgress={scrollProgress} />
      <ambientLight intensity={0.15} color="#0D1B2A" />
      <pointLight position={[0, 20, 0]} color="#C9A84C" intensity={1.5} />
      <pointLight position={[0, 5, -80]} color={seg.colorA.getStyle()} intensity={2} />
      <fog attach="fog" color="#050510" near={30} far={180} />

      <HexFloor scrollProgress={scrollProgress} />
      <WaveformMesh scrollProgress={scrollProgress} />

      {SEGMENTS.map((s, i) => (
        <SegmentLabel key={i} segment={s} index={i} scrollProgress={scrollProgress} />
      ))}
    </>
  )
}

// ── Resonance microphone feature ───────────────────────────────────────
function ResonanceBtn({ onActivate, active }) {
  return (
    <button
      className={`resonance-btn ${active ? 'active' : ''}`}
      onClick={onActivate}
      data-cursor="hover-link"
    >
      <span className="resonance-icon">◎</span>
      <span>{active ? 'YOU ARE NOW PART OF THIS SIGNAL' : 'RESONATE WITH ME'}</span>
    </button>
  )
}

export default function FrequencyScene() {
  const containerRef   = useRef(null)
  const [scrollProg, setScrollProg] = useState(0)
  const [micActive, setMicActive]   = useState(false)
  const [micDenied, setMicDenied]   = useState(false)
  const discoverEgg = useStore(s => s.discoverEgg)
  const egg4Ref = useRef(false)
  const fullScrollRef = useRef(false)

  // Scroll-driven progress 0→1 across the pinned section
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=500vh',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        setScrollProg(self.progress)

        // Egg 4: complete full scroll without stopping
        if (self.progress > 0.98 && !egg4Ref.current) {
          egg4Ref.current = true
          fullScrollRef.current = true
          discoverEgg('freq-ghost')
          sfxSacredReveal()
        }
      }
    })
    return () => trigger.kill()
  }, [discoverEgg])

  const handleResonate = async () => {
    if (micDenied) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setMicActive(true)
      // Use mic input to drive Web Audio analyser
      const micCtx = new AudioContext()
      const src = micCtx.createMediaStreamSource(stream)
      const analyser = micCtx.createAnalyser()
      src.connect(analyser)
      setTimeout(() => {
        setMicActive(false)
        stream.getTracks().forEach(t => t.stop())
        micCtx.close()
      }, 5000)
    } catch {
      setMicDenied(true)
    }
  }

  const segIdx = Math.min(Math.floor(scrollProg * 5), 4)
  const seg    = SEGMENTS[segIdx]

  return (
    <div className="frequency-realm" ref={containerRef}>
      <div className="freq-header">
        <span className="freq-label">VI — THE FREQUENCY</span>
        <span className="freq-sub">PROCESS / HOW I WORK</span>
      </div>

      {/* Segment progress indicator */}
      <div className="freq-progress">
        {SEGMENTS.map((s, i) => (
          <div
            key={i}
            className={`freq-progress-node ${i === segIdx ? 'active' : i < segIdx ? 'done' : ''}`}
          >
            <span>{s.name}</span>
          </div>
        ))}
      </div>

      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <FreqScene scrollProgress={scrollProg} />
      </Canvas>

      {!micDenied && (
        <ResonanceBtn onActivate={handleResonate} active={micActive} />
      )}
    </div>
  )
}
