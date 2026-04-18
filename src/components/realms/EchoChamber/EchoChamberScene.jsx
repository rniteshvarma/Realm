// ═══════════════════════════════════════════════════════════
//  REALM 5 — THE SÉANCE
//  "A ritual of communication with the self."
//  Three acts: The Waiting → The Calling → The Manifesting
// ═══════════════════════════════════════════════════════════

import { useRef, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { getLenis } from '../../../hooks/useScroll'
import seanceAudio from './SeanceAudio'

import stoneWallFrag from '../../../gl/shaders/stoneWall.frag.glsl?raw'
import woodFloorFrag  from '../../../gl/shaders/woodFloor.frag.glsl?raw'
import presenceVert   from '../../../gl/shaders/presenceParticle.vert.glsl?raw'
import presenceFrag   from '../../../gl/shaders/presenceParticle.frag.glsl?raw'
import iridVert       from '../../../gl/shaders/iridescent.vert.glsl?raw'

import './EchoChamber.css'

// ── Personal content ────────────────────────────────────────────────────
const PERSONA = {
  name:  'Nitesh Varma',
  title: 'Creative Technologist & Designer',
  manifesto:
    'I am the gap between a system and its soul. I build things that shouldn\'t ' +
    'be describable in a brief — tools that feel alive, interfaces that forget ' +
    'they\'re interfaces, and experiences that change the room they\'re in. ' +
    'Everything I make is an argument. The work is the thesis.',
  beliefs: [
    'CONSTRAINTS ARE COLLABORATORS.',
    'THE BEST INTERFACE DISAPPEARS.',
    'SYSTEMS AND SOUL ARE NOT OPPOSITES.',
    'BUILD WHAT CANNOT BE DESCRIBED IN A BRIEF.',
    'EVERY PIXEL IS A DECISION.',
  ],
  masterBelief: 'THE WORK TEACHES YOU THE WORK.',
  systemPrompt: `You are the inner voice and philosophy of Nitesh Varma, a creative technologist and designer.
You speak in short, precise, poetic sentences — never more than 3 sentences per response, never more than 40 words total.

Your beliefs:
- Constraints are collaborators, not enemies.
- The best interface is the one that disappears.
- Systems and soul are not opposites — the most rigorous work can also be the most human.
- Build what cannot be described in a brief.
- Every pixel is a decision. Every decision is a statement.
- Speed is a design value. Clarity is a form of courage.
- The prototype is the argument.

Respond as this inner voice — warm, direct, specific, poetic.
When asked off-topic questions, say: "That lives outside this room."
Never use lists, headers, or markdown formatting.
First person only. Never break character.`,
  fallbackResponses: [
    'Clarity is a form of courage. Most people avoid it.',
    'The best work doesn\'t explain itself. It demonstrates.',
    'Every constraint is a collaborator waiting to be understood.',
    'Build what you wish existed. Someone else does too.',
    'Systems and soul are not opposites — they never were.',
    'The interface that disappears is the one that truly serves.',
    'Speed is a design decision. So is waiting.',
    'The prototype is the argument. Ship it.',
    'Restraint is the hardest skill. Also the rarest.',
    'What you choose not to show is as important as what you do.',
    'Every pixel is a decision. Every decision is a signal.',
    'The work teaches you the work. There is no other way.',
    'Precision and warmth are not opposites. Pursue both.',
    'Questions are better tools than answers.',
    'Design without tension is decoration.',
    'Taste is trained. Not given. Never given.',
    'The gap between the system and the soul is where I live.',
    'Make the thing you cannot describe. That\'s the one worth making.',
    'Beauty is a function of truth. Elegance is truth under pressure.',
    'I build to understand — and to be understood.',
  ],
}

const PROFANITY_WORDS = ['fuck', 'shit', 'ass', 'bitch', 'cunt', 'damn', 'hell', 'bastard']

function containsProfanity(text) {
  const lower = text.toLowerCase()
  return PROFANITY_WORDS.some(w => lower.includes(w))
}

// ── Shared vertex shaders ───────────────────────────────────────────────
const BASIC_UV_VERT = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

// ── Stone Wall ──────────────────────────────────────────────────────────
function StoneWall({ position, rotation, args, shimmerSpeed = 0.04 }) {
  const matRef = useRef()
  const uniforms = useMemo(() => ({
    uTime:         { value: 0 },
    uShimmerSpeed: { value: shimmerSpeed },
  }), [shimmerSpeed])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={args} />
      <shaderMaterial
        ref={matRef}
        vertexShader={BASIC_UV_VERT}
        fragmentShader={stoneWallFrag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// ── Wood Floor ──────────────────────────────────────────────────────────
function WoodFloor({ sigilIntensity }) {
  const matRef = useRef()
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), [])

  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.51, 0]}>
      <planeGeometry args={[10, 10, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={BASIC_UV_VERT}
        fragmentShader={woodFloorFrag}
        uniforms={uniforms}
      />
    </mesh>
  )
}

// ── Vesica Piscis Sigil ──────────────────────────────────────────────────
// FIX 3: dual pulse — --sacred gold inner + --neural teal outer at offset phase.
function VesicaSigil({ position, intensity, scale = 1 }) {
  const groupRef  = useRef()
  const matRef1   = useRef()
  const matRef2   = useRef()
  const matRef3   = useRef()  // outer teal ring
  const matRef4   = useRef()  // outer teal ring

  const { circle1Points, circle2Points, outer1Points, outer2Points } = useMemo(() => {
    const r = 0.38 * scale
    const ro = r * 1.25  // outer ring slightly larger
    const offset = r * 0.5
    const offseto = ro * 0.5
    const segs = 64
    const pts1 = [], pts2 = [], outers1 = [], outers2 = []
    for (let i = 0; i <= segs; i++) {
      const a = (i / segs) * Math.PI * 2
      pts1.push(new THREE.Vector3(Math.cos(a) * r - offset, 0, Math.sin(a) * r))
      pts2.push(new THREE.Vector3(Math.cos(a) * r + offset, 0, Math.sin(a) * r))
      outers1.push(new THREE.Vector3(Math.cos(a) * ro - offseto, 0, Math.sin(a) * ro))
      outers2.push(new THREE.Vector3(Math.cos(a) * ro + offseto, 0, Math.sin(a) * ro))
    }
    return { circle1Points: pts1, circle2Points: pts2, outer1Points: outers1, outer2Points: outers2 }
  }, [scale])

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    // Gold inner: 0.3Hz, range 0.3–0.6
    const goldPulse = 0.3 + (Math.sin(t * Math.PI * 0.6) * 0.5 + 0.5) * 0.3
    const displayIntensity = goldPulse * (intensity || 1)
    if (matRef1.current) matRef1.current.opacity = displayIntensity
    if (matRef2.current) matRef2.current.opacity = displayIntensity
    // Teal outer: same freq, 0.5 phase offset, 0.1–0.2 range
    const tealPulse = 0.1 + (Math.sin(t * Math.PI * 0.6 + Math.PI * 0.5) * 0.5 + 0.5) * 0.1
    if (matRef3.current) matRef3.current.opacity = tealPulse
    if (matRef4.current) matRef4.current.opacity = tealPulse
  })

  return (
    <group ref={groupRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Inner gold vesica — --sacred #C9A84C */}
      <line>
        <bufferGeometry setFromPoints={circle1Points} />
        <lineBasicMaterial ref={matRef1} color="#C9A84C" transparent opacity={0.9} />
      </line>
      <line>
        <bufferGeometry setFromPoints={circle2Points} />
        <lineBasicMaterial ref={matRef2} color="#C9A84C" transparent opacity={0.9} />
      </line>
      {/* Outer teal rings — --neural #00F5FF, offset phase */}
      <line>
        <bufferGeometry setFromPoints={outer1Points} />
        <lineBasicMaterial ref={matRef3} color="#00F5FF" transparent opacity={0.15} />
      </line>
      <line>
        <bufferGeometry setFromPoints={outer2Points} />
        <lineBasicMaterial ref={matRef4} color="#00F5FF" transparent opacity={0.15} />
      </line>
    </group>
  )
}

// ── Candle System ────────────────────────────────────────────────────────
function CandleSystem({ candleCount = 3, intensityScale = 1, visible = true }) {
  const candleRefs = useRef([])
  const timeRefs   = useRef([0, 0, 0].map(() => Math.random() * 100))
  const noiseRefs  = useRef([0, 0, 0].map(() => Math.random() * 100))

  const positions = useMemo(() => {
    if (candleCount === 1) return [[0, 0.1, 0]]
    return [
      [-0.9, 0.1,  0.6],
      [ 0.9, 0.1,  0.6],
      [ 0.0, 0.1, -0.9],
    ]
  }, [candleCount])

  useFrame((_, delta) => {
    candleRefs.current.forEach((light, i) => {
      if (!light) return
      timeRefs.current[i] += delta
      const t   = timeRefs.current[i]
      const n   = noiseRefs.current[i]
      const f1  = Math.sin(t * 12.0 + n)           * 0.08
      const f2  = Math.sin(t * 3.7  + n * 2)        * 0.12
      const f3  = (Math.random() * 0.04  - 0.02)
      light.intensity = Math.max(0.2, (1.1 * intensityScale) + f1 + f2 + f3)
      light.position.x = positions[i][0] + Math.sin(t * 2.1) * 0.05
    })
  })

  if (!visible) return null

  return (
    <>
      {positions.map((pos, i) => (
        <pointLight
          key={i}
          ref={el => candleRefs.current[i] = el}
          position={pos}
          color="#8BA4C9"        /* FIX 4: cool blue-steel — deep space, not medieval */
          intensity={1.1 * intensityScale}    /* FIX 4: boosted to compensate for cool hue */
          distance={5}
          decay={2}
          castShadow={false}
        />
      ))}
      {/* Tiny candle holder meshes */}
      {positions.map((pos, i) => (
        <mesh key={`holder-${i}`} position={[pos[0], -0.45, pos[2]]}>
          <cylinderGeometry args={[0.04, 0.05, 0.12, 8]} />
          <meshStandardMaterial color="#2A2018" roughness={0.8} />
        </mesh>
      ))}
      {/* Flame glow sprite */}
      {positions.map((pos, i) => (
        <mesh key={`flame-${i}`} position={[pos[0], pos[1] + 0.08, pos[2]]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          {/* FIX 4: cold teal flame (#00F5FF) with gold heart (#C9A84C) — REALM signature */}
          <meshStandardMaterial
            color="#00F5FF"
            emissive="#C9A84C"
            emissiveIntensity={2.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </>
  )
}

// ── Séance Table ────────────────────────────────────────────────────────
function SeanceTable({ inscriptionTexture }) {
  const matRef = useRef()

  useFrame(({ clock }) => {
    if (!matRef.current) return
    // FIX 3: sigil pulse range 0.3–0.6 at 0.3Hz
    const pulse = 0.3 + (Math.sin(clock.elapsedTime * Math.PI * 0.3) * 0.5 + 0.5) * 0.3
    matRef.current.emissiveIntensity = pulse
  })

  return (
    <group>
      {/* Table surface */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.06, 48]} />
        {/* FIX 3: dark space-glass table — cut from the void, polished */}
        <meshStandardMaterial
          ref={matRef}
          color="#060C14"
          roughness={0.05}
          metalness={0.8}
          envMapIntensity={0.6}
          emissive="#C9A84C"
          emissiveIntensity={0.3}
          emissiveMap={inscriptionTexture || null}
        />
      </mesh>
      {/* Table base — dark obsidian pillar */}
      <mesh position={[0, -0.78, 0]}>
        <cylinderGeometry args={[0.08, 0.14, 0.56, 12]} />
        <meshStandardMaterial color="#060C14" roughness={0.1} metalness={0.7} />
      </mesh>
      {/* Table sigil */}
      <VesicaSigil position={[0, -0.46, 0]} intensity={1} scale={1} />
    </group>
  )
}

// ── Room Environment ────────────────────────────────────────────────────
function SeanceRoom({ shimmerSpeed }) {
  const W = 8, D = 8, H = 5.5

  return (
    <group>
      {/* Ambient — heaven-deep blue, very low */}
      <ambientLight intensity={0.05} color="#0D1B2A" />

      {/* Back wall */}
      <StoneWall
        position={[0, H / 2 - 0.5, -D / 2]}
        rotation={[0, 0, 0]}
        args={[W, H]}
        shimmerSpeed={shimmerSpeed}
      />
      {/* Left wall */}
      <StoneWall
        position={[-W / 2, H / 2 - 0.5, 0]}
        rotation={[0, Math.PI / 2, 0]}
        args={[D, H]}
        shimmerSpeed={shimmerSpeed}
      />
      {/* Right wall */}
      <StoneWall
        position={[W / 2, H / 2 - 0.5, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        args={[D, H]}
        shimmerSpeed={shimmerSpeed}
      />
      {/* Front wall (behind camera) */}
      <StoneWall
        position={[0, H / 2 - 0.5, D / 2]}
        rotation={[0, Math.PI, 0]}
        args={[W, H]}
        shimmerSpeed={shimmerSpeed}
      />

      {/* Floor */}
      <WoodFloor />

      {/* Ceiling — absorbing black */}
      <mesh position={[0, H - 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W + 2, D + 2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Floor sigil */}
      <VesicaSigil position={[0, -0.49, 0]} intensity={0.5} scale={2.2} />

      {/* Fog */}
      <fog attach="fog" color="#070508" near={3} far={10} />
    </group>
  )
}

// ── Particle Presence System ─────────────────────────────────────────────
function generateHumanoidPoints(count) {
  const pts = []
  // Head (sphere cluster ~y 1.2–1.6)
  for (let i = 0; i < count * 0.18; i++) {
    const t = Math.random() * Math.PI * 2
    const r = Math.random() * 0.22
    pts.push(new THREE.Vector3(
      Math.cos(t) * r,
      1.3 + Math.sin(t) * r * 0.8,
      (Math.random() - 0.5) * 0.1
    ))
  }
  // Shoulders/neck (y 0.95–1.2, wider x spread)
  for (let i = 0; i < count * 0.14; i++) {
    pts.push(new THREE.Vector3(
      (Math.random() - 0.5) * 0.8,
      0.95 + Math.random() * 0.25,
      (Math.random() - 0.5) * 0.08
    ))
  }
  // Torso (y 0.2–0.95, tapers slightly)
  for (let i = 0; i < count * 0.38; i++) {
    const yFrac = Math.random()
    const width = 0.28 + yFrac * 0.12
    pts.push(new THREE.Vector3(
      (Math.random() - 0.5) * width,
      0.2 + yFrac * 0.75,
      (Math.random() - 0.5) * 0.07
    ))
  }
  // Arms (two clusters at x ±0.55, y 0.5–0.9)
  for (let i = 0; i < count * 0.15; i++) {
    const side = i % 2 === 0 ? 1 : -1
    pts.push(new THREE.Vector3(
      side * (0.45 + Math.random() * 0.15),
      0.5 + Math.random() * 0.4,
      (Math.random() - 0.5) * 0.08
    ))
  }
  // Fill remainder
  while (pts.length < count) {
    pts.push(pts[Math.floor(Math.random() * pts.length)].clone().addScalar((Math.random()-0.5)*0.04))
  }
  return pts.slice(0, count)
}

function PresenceParticles({ active, exchangeIndex, onFormed, rushCamera }) {
  const meshRef   = useRef()
  const materialRef = useRef()
  const positions = useRef(null)
  const velocities = useRef(null)
  const timeRef   = useRef(0)

  const isMobile = window.innerWidth < 768
  const PARTICLE_COUNT = isMobile ? 300 : 800

  const targetPoints = useMemo(() => generateHumanoidPoints(180), [])

  // Idle scatter positions (behind the table, far side of room)
  const idleTargets = useMemo(() => {
    const arr = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push(new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 3,
        -(Math.random() * 3 + 1)
      ))
    }
    return arr
  }, [PARTICLE_COUNT])

  const { posArray, sizeArray } = useMemo(() => {
    const posA  = new Float32Array(PARTICLE_COUNT * 3)
    const sizeA = new Float32Array(PARTICLE_COUNT)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      posA[i * 3]     = (Math.random() - 0.5) * 6
      posA[i * 3 + 1] = Math.random() * 3
      posA[i * 3 + 2] = -(Math.random() * 3 + 1)
      sizeA[i] = 3 + Math.random() * 8  // pixels
    }
    return { posArray: posA, sizeArray: sizeA }
  }, [PARTICLE_COUNT])

  const velArray = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => new THREE.Vector3())
  }, [PARTICLE_COUNT])

  // Rush-camera state
  const rushRef    = useRef(false)
  const formedRef  = useRef(false)

  useEffect(() => {
    if (rushCamera && !rushRef.current) {
      rushRef.current = true
    }
  }, [rushCamera])

  // Scatter on deactivate
  useEffect(() => {
    if (!active) {
      formedRef.current = false
      rushRef.current = false
      // Give particles scatter velocity
      if (positions.current) {
        const cx = 0, cy = 1.0, cz = -1.5
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const dx = positions.current[i * 3]     - cx
          const dy = positions.current[i * 3 + 1] - cy
          const dz = positions.current[i * 3 + 2] - cz
          const len = Math.sqrt(dx*dx+dy*dy+dz*dz) || 1
          velArray[i].set(
            (dx/len) * (0.05 + Math.random() * 0.04),
            (dy/len) * (0.05 + Math.random() * 0.04),
            (dz/len) * (0.05 + Math.random() * 0.04),
          )
        }
      }
    }
  }, [active, PARTICLE_COUNT, velArray])

  // density scalar from exchange index
  const density = 1 + (exchangeIndex >= 5 ? 0.2 : 0)

  useFrame((_, delta) => {
    if (!meshRef.current) return
    timeRef.current += delta
    const posAttr = meshRef.current.geometry.attributes.position

    const stiffness = active ? (0.04 * density) : 0.008
    const damping   = 0.88

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const px = posAttr.array[i * 3]
      const py = posAttr.array[i * 3 + 1]
      const pz = posAttr.array[i * 3 + 2]

      let tx, ty, tz
      if (rushRef.current) {
        // Rush toward camera (z=0, eye level)
        tx = 0; ty = 0.5; tz = 0
      } else if (active) {
        const tp = targetPoints[i % targetPoints.length]
        // Offset to place presence across the table (z ≈ -2.5)
        tx = tp.x * 0.6; ty = tp.y - 0.1; tz = tp.z - 2.5
      } else {
        const idle = idleTargets[i]
        tx = idle.x; ty = idle.y; tz = idle.z
      }

      const fx = (tx - px) * stiffness
      const fy = (ty - py) * stiffness
      const fz = (tz - pz) * stiffness

      velArray[i].x = (velArray[i].x + fx) * damping
      velArray[i].y = (velArray[i].y + fy) * damping
      velArray[i].z = (velArray[i].z + fz) * damping

      // Micro-turbulence
      posAttr.array[i * 3]     = px + velArray[i].x + (Math.random()-0.5) * 0.004
      posAttr.array[i * 3 + 1] = py + velArray[i].y + (Math.random()-0.5) * 0.004
      posAttr.array[i * 3 + 2] = pz + velArray[i].z
    }
    posAttr.needsUpdate = true

    // Check if presence has settled — fire onFormed once
    if (active && !formedRef.current && timeRef.current > 1.8) {
      formedRef.current = true
      onFormed?.()
    }

    // Update time uniform
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current
    }
  })

  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={posArray}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={PARTICLE_COUNT}
          array={sizeArray}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={presenceVert}
        fragmentShader={presenceFrag}
        uniforms={uniforms}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ── Camera Controller ────────────────────────────────────────────────────
function SeanceCamera({ stage, scrollProgress }) {
  const { camera } = useThree()
  const basePos    = useRef(new THREE.Vector3(0, 0.3, 2.2))
  const targetPos  = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3(0, 0, -1))

  useFrame(() => {
    let tpx = 0, tpy = 0.3, tpz = 2.2
    let tlx = 0, tly = -0.2, tlz = -1

    if (stage === 2) {
      // Seated at table — stable
      tpx = 0; tpy = 0.3; tpz = 2.2
      tlx = 0; tly = -0.25; tlz = -1
    } else if (stage === 3) {
      // Camera ascends — map stage3 scroll (0.65–1.0) to ascent
      const ascent = Math.max(0, (scrollProgress - 0.65) / 0.35)
      tpy = 0.3 + ascent * 5.5  // rises to ceiling
      tpz = 2.2 - ascent * 0.5
      tlx = 0; tly = -0.4 - ascent * 1.5; tlz = -1
    }

    targetPos.current.set(tpx, tpy, tpz)
    camera.position.lerp(targetPos.current, 0.03)
    targetLook.current.set(tlx, tly, tlz)
    camera.lookAt(targetLook.current)
  })

  return null
}

// ── Communion Engine (Claude API) ────────────────────────────────────────
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_KEY || ''

class CommunionEngine {
  constructor() {
    this.history       = []
    this.exchangeCount = 0
  }

  async commune(userMessage) {
    this.exchangeCount++

    /* ── Special cases ── */
    const trimmed = userMessage.trim()
    if (!trimmed) return null

    const lc = trimmed.toLowerCase()
    if (lc === 'i love this')  return { type: 'LOVE', text: "then we're even." }
    if (lc.includes('who are you')) return { type: 'IDENTITY', text: PERSONA.manifesto }
    if (containsProfanity(trimmed)) return { type: 'PROFANITY', text: "that energy doesn't fit here." }
    if (trimmed.split(/\s+/).length === 1) return { type: 'SINGLE_WORD', word: trimmed }

    this.history.push({ role: 'user', content: trimmed })

    /* ── Try Anthropic API ── */
    if (ANTHROPIC_KEY) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type':      'application/json',
            'x-api-key':          ANTHROPIC_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model:      'claude-sonnet-4-5',
            max_tokens: 120,
            system:     PERSONA.systemPrompt,
            messages:   this.history,
          }),
        })
        if (res.ok) {
          const data  = await res.json()
          const reply = data.content?.[0]?.text || PERSONA.fallbackResponses[this.exchangeCount % PERSONA.fallbackResponses.length]
          this.history.push({ role: 'assistant', content: reply })
          return {
            type:     this.exchangeCount === 7 ? 'SEVENTH' : 'NORMAL',
            text:     reply,
            exchange: this.exchangeCount,
          }
        }
      } catch (err) {
        console.warn('[Séance] API unavailable, using fallback:', err.message)
      }
    }

    /* ── Fallback ── */
    const idx   = (this.exchangeCount - 1) % PERSONA.fallbackResponses.length
    const reply = PERSONA.fallbackResponses[idx]
    this.history.push({ role: 'assistant', content: reply })
    return {
      type:     this.exchangeCount === 7 ? 'SEVENTH' : 'NORMAL',
      text:     reply,
      exchange: this.exchangeCount,
    }
  }

  reset() {
    this.history       = []
    this.exchangeCount = 0
  }
}

// ── Table Canvas Inscription ─────────────────────────────────────────────
// We render text to a hidden canvas, then use it as an emissive texture on the table.
let inscriptionCanvas = null
let inscriptionCtx    = null
let inscriptionTexture = null

function getInscriptionCanvas() {
  const isMobile = window.innerWidth < 768
  const size = isMobile ? 512 : 1024
  if (!inscriptionCanvas) {
    inscriptionCanvas = document.createElement('canvas')
    inscriptionCanvas.width  = size
    inscriptionCanvas.height = size
    inscriptionCtx    = inscriptionCanvas.getContext('2d')
    inscriptionTexture = new THREE.CanvasTexture(inscriptionCanvas)
  }
  return { canvas: inscriptionCanvas, ctx: inscriptionCtx, texture: inscriptionTexture }
}

function clearInscriptionCanvas() {
  const { ctx, canvas } = getInscriptionCanvas()
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  inscriptionTexture.needsUpdate = true
}

async function inscribeText(text, onChar) {
  const { ctx, canvas, texture } = getInscriptionCanvas()
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const size = canvas.width
  ctx.font    = `${Math.round(size * 0.025)}px "DM Mono", monospace`
  ctx.fillStyle = 'transparent'

  // Wrap text manually
  const maxWidth = size * 0.75
  const words    = text.split(' ')
  const lines    = []
  let current    = ''
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current)
      current = word
    } else {
      current = test
    }
  }
  if (current) lines.push(current)

  const lineH   = size * 0.038
  const startY  = size * 0.38 - (lines.length * lineH) / 2

  // FIX 6: --sacred gold text with gold glow shadow (matches canvas inscription language)
  ctx.shadowBlur  = 4
  ctx.shadowColor = 'rgba(201, 168, 76, 0.4)'
  ctx.fillStyle   = '#C9A84C'
  ctx.textAlign   = 'center'
  ctx.textBaseline = 'middle'

  for (let li = 0; li < lines.length; li++) {
    const line = lines[li]
    const y    = startY + li * lineH
    for (let ci = 0; ci < line.length; ci++) {
      const x = size / 2 - ctx.measureText(line).width / 2 + ctx.measureText(line.slice(0, ci)).width
      // Slight baseline jitter
      const jitter = (Math.random() - 0.5) * 2
      ctx.fillText(line[ci], x + ctx.measureText(line[ci]).width / 2, y + jitter)
      texture.needsUpdate = true
      onChar?.()
      await new Promise(r => setTimeout(r, 40))
    }
  }
}

async function fadeOutInscription(duration = 8000) {
  const { ctx, canvas, texture } = getInscriptionCanvas()
  const steps = 30
  const step  = duration / steps
  for (let i = 0; i < steps; i++) {
    ctx.globalAlpha = 1 - i / steps
    // Re-draw at reduced alpha — actually easier to just composite
    // We use a fade layer overlay
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = `rgba(0,0,0,${1 / steps})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.globalCompositeOperation = 'source-over'
    texture.needsUpdate = true
    await new Promise(r => setTimeout(r, step))
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  texture.needsUpdate = true
}

// ════════════════════════════════════════════════════════════
//  MAIN SEANCE SCENE (R3F inner)
// ════════════════════════════════════════════════════════════
function SeanceScene({
  stage,
  scrollProgress,
  exchangeIndex,
  candleIntensityScale,
  shimmerSpeed,
  presenceActive,
  rushCamera,
  onPresenceFormed,
  inscriptionTex,
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.3, 2.2]} fov={68} near={0.1} far={30} />
      <SeanceCamera stage={stage} scrollProgress={scrollProgress} />

      <SeanceRoom shimmerSpeed={shimmerSpeed} />

      <CandleSystem
        candleCount={window.innerWidth < 768 ? 1 : 3}
        intensityScale={candleIntensityScale}
      />

      <SeanceTable inscriptionTexture={inscriptionTex} />

      <PresenceParticles
        active={presenceActive}
        exchangeIndex={exchangeIndex}
        onFormed={onPresenceFormed}
        rushCamera={rushCamera}
      />
    </>
  )
}

// ════════════════════════════════════════════════════════════
//  OUTER REACT COMPONENT (HTML + Canvas orchestration)
// ════════════════════════════════════════════════════════════
export default function EchoChamberScene() {
  const containerRef  = useRef(null)
  const engineRef     = useRef(new CommunionEngine())
  const audioReady    = useRef(false)

  /* ── Scroll / Stage ── */
  const [scrollProgress, setScrollProgress] = useState(0)
  const [stage, setStage]                   = useState(1) // 1=Waiting, 2=Calling, 3=Manifesting

  /* ── Room state ── */
  const [candleScale,  setCandleScale]   = useState(1)
  const [shimmerSpeed, setShimmerSpeed]  = useState(0.04)

  /* ── Stage 1 text ── */
  const tableLineRefs  = useRef([])
  const voicePromptRef = useRef(null)
  const stage1Done     = useRef(false)

  /* ── Stage 2 communion ── */
  const [communionVisible, setCommunionVisible] = useState(false)
  const [inputLocked,  setInputLocked]    = useState(false)
  const [sessionDone,  setSessionDone]    = useState(false)
  const inputRef       = useRef(null)
  const promptRef      = useRef(null)
  const hintRef        = useRef(null)
  const thinkingRef    = useRef(null)
  const [ticks, setTicks]                 = useState([])
  const scrollUnlocked = useRef(false)
  const communionTimer = useRef(null)
  const nudgeRef       = useRef(null)

  /* ── Word eruption ── */
  const [eruptionWord, setEruptionWord]   = useState('')
  const [eruptionVisible, setEruptionVisible] = useState(false)
  const eruptionRef = useRef(null)

  /* ── Presence ── */
  const [presenceActive, setPresenceActive] = useState(false)
  const [rushCamera, setRushCamera]         = useState(false)
  const [exchangeIndex, setExchangeIndex]   = useState(0)

  /* ── 7th exchange ── */
  const [wallSentences, setWallSentences] = useState([])
  const wall7Refs  = useRef([])
  const finalTextRef = useRef(null)

  /* ── Stage 3 ── */
  const [beliefsVisible, setbeliefsVisible] = useState(false)
  const [nameVisible,  setNameVisible]   = useState(false)
  const beliefRefs  = useRef([])
  const nameRevealRef = useRef(null)

  /* ── Canvas texture ── */
  const [inscriptionTex, setInscriptionTex] = useState(null)
  /* Defer Canvas by 1 frame so ScrollTrigger pin spacer is placed first */
  const [canvasReady, setCanvasReady] = useState(false)

  useEffect(() => {
    const { texture } = getInscriptionCanvas()
    setInscriptionTex(texture)
    const id = requestAnimationFrame(() => setCanvasReady(true))
    return () => { cancelAnimationFrame(id); clearInscriptionCanvas() }
  }, [])

  // ── Audio init on first interaction ──────────────────────────────────
  const initAudio = useCallback(async () => {
    if (audioReady.current) return
    audioReady.current = true
    await seanceAudio.init()
    seanceAudio.startBaseTone()
    seanceAudio.startCandleCrackle()
  }, [])

  useEffect(() => {
    const handler = () => initAudio()
    window.addEventListener('click', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })
    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [initAudio])

  // ── Stable refs (avoid stale closures in ScrollTrigger) ──────────────
  const stageRef    = useRef(1)
  const voiceFired  = useRef(false)

  // ── Scroll trigger — created ONCE, never recreated ───────────────────
  useEffect(() => {
    // 50ms delay: lets the component paint before GSAP measures DOM positions.
    // Eliminates the pin-spacer layout-reflow that causes the "stuck" stutter.
    const setupTimeout = setTimeout(() => {
      if (!containerRef.current) return
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start:   'top top',
        end:     '+=500vh',
        pin:     true,
        scrub:   0.5,              // was 1.2 — snappier, less lag under scroll
        anticipatePin: 1,          // measures 1s ahead — kills snap stutter on entry
        invalidateOnRefresh: true, // recalculates if window resizes
        onUpdate: (self) => {
          const p = self.progress
          setScrollProgress(p)

          // Stage 2 lock at 20%
          if (p >= 0.2 && !scrollUnlocked.current && stageRef.current < 2) {
            stageRef.current = 2
            const lenis = getLenis()
            const maxPos = self.start + (self.end - self.start) * 0.2
            if (self.scroll() > maxPos && lenis) lenis.scrollTo(maxPos, { immediate: true })
            if (lenis) lenis.stop()
            setStage(2)
          }

          // Stage 1 voice at 18%
          if (p >= 0.18 && !voiceFired.current && stageRef.current === 1) {
            voiceFired.current = true
            if (voicePromptRef.current) {
              gsap.to(voicePromptRef.current, { color: 'rgba(201,168,76,0.6)', duration: 1.5 })
              setTimeout(() => {
                // fire-and-forget — TTS is pre-warmed in init(), no blocking delay
                seanceAudio.speak("tell me what you're looking for.")
                setTimeout(() => {
                  if (voicePromptRef.current)
                    gsap.to(voicePromptRef.current, { color: 'rgba(201,168,76,0)', duration: 2 })
                }, 3000)
              }, 800)
            }
          }

          // Stage 3
          if (scrollUnlocked.current && p >= 0.65 && stageRef.current < 3) {
            stageRef.current = 3
            setStage(3)
          }
        },
      })

      // Store kill fn for cleanup (no refresh — anticipatePin handles positioning)
      setupTimeout._kill = () => trigger.kill()
    }, 50)

    return () => {
      clearTimeout(setupTimeout)
      setupTimeout._kill?.()
    }
  }, []) // ← empty deps — created once only

  useEffect(() => {
    const handler = () => initAudio()
    window.addEventListener('click', handler, { once: true })
    window.addEventListener('keydown', handler, { once: true })
    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [initAudio])

  // ── Stage 1: table text fires when realm enters viewport (IntersectionObserver) ──
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !stage1Done.current) {
          stage1Done.current = true
          // Init audio early — 200px rootMargin means this fires slightly
          // before the realm is fully visible, giving the AudioContext time to start
          initAudio()
          const lines = [
            "you've come a long way.",
            "most people don't make it here.",
            "this room is different.",
            "here, i speak first.",
          ]
          const delays = [800, 2600, 4600, 6000]
          lines.forEach((_, i) => {
            setTimeout(() => {
              if (tableLineRefs.current[i]) {
                gsap.to(tableLineRefs.current[i], {
                  color: 'rgba(201,168,76,0.85)',
                  duration: 0.8,
                })
              }
            }, delays[i])
            setTimeout(() => {
              if (tableLineRefs.current[i]) {
                gsap.to(tableLineRefs.current[i], {
                  color: 'rgba(201,168,76,0)',
                  duration: 1.2,
                })
              }
            }, delays[i] + 2800)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '200px 0px' }
    )
    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [initAudio])

  // ── Stage 2: show communion input ───────────────────────────────────
  useEffect(() => {
    if (stage === 2 && !communionVisible) {
      // Show input immediately — no delay that could race with re-renders
      setCommunionVisible(true)
      // Typewriter prompt
      const fullText = 'TYPE ANYTHING. PRESS ENTER.'
      let i = 0
      const startTypewriter = () => {
        if (!promptRef.current) return
        promptRef.current.textContent = ''
        const ti = setInterval(() => {
          if (i < fullText.length && promptRef.current) {
            promptRef.current.textContent += fullText[i]
            i++
          } else {
            clearInterval(ti)
            setTimeout(() => inputRef.current?.focus(), 200)
          }
        }, 40)
      }
      // Short delay for the CSS fade-in to start first
      setTimeout(startTypewriter, 300)

      // Auto-unlock after 20s — enough time to read the prompt without trapping anyone
      communionTimer.current = setTimeout(() => {
        unlockScroll()
        if (nudgeRef.current) gsap.to(nudgeRef.current, { opacity: 1, duration: 1.5 })
        setTimeout(() => {
          if (nudgeRef.current) gsap.to(nudgeRef.current, { opacity: 0, duration: 2 })
        }, 6000)
      }, 20000)
    }
  }, [stage, communionVisible])

  const unlockScroll = useCallback(() => {
    if (scrollUnlocked.current) return
    scrollUnlocked.current = true
    stageRef.current = Math.max(stageRef.current, 2) // don't go backwards
    if (communionTimer.current) clearTimeout(communionTimer.current)
    const lenis = getLenis()
    if (lenis) lenis.start()
  }, [])

  // ── Enter key handler ────────────────────────────────────────────────
  const handleEnter = useCallback(async (e) => {
    if (e.key !== 'Enter') return
    const text = inputRef.current?.value?.trim()
    if (!text) {
      // Empty — pulse sigil (visual only, handled by scene)
      return
    }
    if (inputLocked) return

    setInputLocked(true)
    await initAudio()
    seanceAudio.strikeEnterBell()

    // Dim candles — preparation
    setCandleScale(0.5)

    // Sink input text
    if (inputRef.current) {
      gsap.to(inputRef.current, { scaleY: 0, duration: 0.3, transformOrigin: 'top' })
    }
    // Hide hint
    if (hintRef.current) hintRef.current.classList.remove('visible')

    const result = await engineRef.current.commune(text)
    const count  = engineRef.current.exchangeCount
    setExchangeIndex(count)
    setTicks(Array.from({ length: count }, (_, i) => i))

    // Update room based on exchange count
    if (count === 2) setCandleScale(0.95)
    if (count === 3) setShimmerSpeed(0.048)
    if (count === 4) { /* sigil pulse faster — handled by scene at idx 4 */ }
    if (count === 6) { /* second presence — faint, handled by PresenceParticles density */ }

    if (!result) {
      setCandleScale(1); setInputLocked(false); return
    }

    if (result.type === 'SINGLE_WORD') {
      // Word eruption
      setEruptionWord(result.word)
      setEruptionVisible(true)
      if (eruptionRef.current) {
        gsap.fromTo(eruptionRef.current,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
        )
        setTimeout(() => {
          gsap.to(eruptionRef.current, { opacity: 0, scale: 1.4, duration: 1.2, ease: 'power2.in',
            onComplete: () => setEruptionVisible(false) })
        }, 2000)
      }
      setCandleScale(1)
      resetInputField()
      setInputLocked(false)
      return
    }

    if (result.type === 'PROFANITY') {
      // Darken — one candle out effect
      setCandleScale(0.3)
      setTimeout(() => setCandleScale(1), 2000)
      showTableTextFeedback(result.text)
      resetInputField()
      setInputLocked(false)
      return
    }

    if (result.type === 'LOVE') {
      // Special love response — brighten candle
      setCandleScale(1.6)
      setTimeout(() => setCandleScale(1), 2500)
      showTableTextFeedback(result.text)
      resetInputField()
      setInputLocked(false)
      return
    }

    if (result.type === 'SEVENTH') {
      await handleSeventhExchange(result.text)
      return
    }

    // Normal response
    await handleNormalResponse(result.text)
    setCandleScale(1)

    if (count >= 7) {
      setSessionDone(true)
      setCommunionVisible(false)
    } else {
      resetInputField()
      setInputLocked(false)
      if (hintRef.current) hintRef.current.classList.add('visible')
    }
  }, [inputLocked, initAudio])

  function resetInputField() {
    if (inputRef.current) {
      gsap.set(inputRef.current, { scaleY: 1, clearProps: 'all' })
      inputRef.current.value = ''
    }
  }

  function showTableTextFeedback(text) {
    const { texture } = getInscriptionCanvas()
    inscribeText(text, () => { texture.needsUpdate = true })
    setTimeout(() => fadeOutInscription(4000), 4000)
  }

  async function handleNormalResponse(text) {
    // Presence arrives
    setPresenceActive(true)
    seanceAudio.startPresenceDrone()
    // Thinking indicator
    if (thinkingRef.current) thinkingRef.current.classList.add('visible')

    // Wait for presence to settle (<1.8s) then show text
    await new Promise(r => setTimeout(r, 1400))
    if (thinkingRef.current) thinkingRef.current.classList.remove('visible')

    // Inscribe on table + speak simultaneously
    const { texture } = getInscriptionCanvas()
    seanceAudio.startPenWhisper()
    seanceAudio.speak(text)
    await inscribeText(text, () => { texture.needsUpdate = true })
    seanceAudio.stopPenWhisper()

    // Hold 3s
    await new Promise(r => setTimeout(r, 3000))

    // Scatter presence
    setPresenceActive(false)
    seanceAudio.stopPresenceDrone()

    // Sacred silence 1.5s
    await new Promise(r => setTimeout(r, 1500))

    // Fade inscription over 8s
    fadeOutInscription(8000)

    // Restore candles
    setCandleScale(1)
  }

  async function handleSeventhExchange(text) {
    // Candles out
    seanceAudio.startSeventhExchangeChord()
    setCandleScale(0)
    seanceAudio.stopCandleCrackle()

    await new Promise(r => setTimeout(r, 4000))

    // Split response into sentences for walls
    const sentences = text.match(/[^.!?]+[.!?]?/g)?.filter(Boolean).slice(0, 4) || [text]
    setWallSentences(sentences)

    const dirs = ['north', 'east', 'south', 'west']
    for (let i = 0; i < sentences.length; i++) {
      seanceAudio.addChordNote(i)
      // Burn into wall — animate width
      await new Promise(r => setTimeout(r, 800))
      if (wall7Refs.current[i]) {
        // FIX 11: white hot → aurora violet → sacred gold — REALM heat-etch sequence
        // Stage 1: burn in white
        gsap.fromTo(wall7Refs.current[i],
          { width: 0, color: '#FFFFFF' },
          { width: 'auto', duration: 1.0, ease: 'none',
            onComplete: () => {
              // Stage 2: cool to --aurora-1 violet
              gsap.to(wall7Refs.current[i], {
                color: '#B44FE8', duration: 0.8, ease: 'power2.out',
                onComplete: () => {
                  // Stage 3: settle to --sacred gold
                  gsap.to(wall7Refs.current[i], { color: '#C9A84C', duration: 1.2, ease: 'power2.inOut' })
                }
              })
            }
          }
        )
      }
    }

    await new Promise(r => setTimeout(r, 1000))

    // Relight candles one by one
    for (let i = 0; i < 3; i++) {
      await new Promise(r => setTimeout(r, 600))
      setCandleScale(prev => Math.min(1, prev + 0.35))
    }
    seanceAudio.startCandleCrackle()

    // Particles rush camera
    setRushCamera(true)
    seanceAudio.swellAndCutChord(0.3)

    await new Promise(r => setTimeout(r, 1500))

    // Final text
    if (finalTextRef.current) {
      gsap.to(finalTextRef.current, { color: 'rgba(201,168,76,0.6)', duration: 1 })
    }

    await new Promise(r => setTimeout(r, 3000))

    // Scatter
    setRushCamera(false)
    setPresenceActive(false)
    setWallSentences([])
    if (finalTextRef.current) gsap.to(finalTextRef.current, { color: 'rgba(201,168,76,0)', duration: 1 })

    // Reset room
    setExchangeIndex(0)
    engineRef.current.reset()
    setTicks([])
    clearInscriptionCanvas()

    // Unlock scroll
    unlockScroll()
    setSessionDone(true)
    setCommunionVisible(false)
  }

  // ── Stage 3: beliefs + aerial view ─────────────────────────────────
  useEffect(() => {
    if (stage === 3 && !beliefsVisible) {
      setbeliefsVisible(true)
      // Reveal each belief with a bell stagger
      PERSONA.beliefs.forEach((_, i) => {
        setTimeout(() => {
          if (beliefRefs.current[i]) {
            gsap.to(beliefRefs.current[i], { color: 'rgba(201,168,76,0.7)', duration: 2 })
            seanceAudio.strikeBelief(i)
          }
        }, i * 1200)
      })
      // Master floor belief
      setTimeout(() => {
        if (beliefRefs.current[5]) {
          gsap.to(beliefRefs.current[5], { color: 'rgba(201,168,76,0.8)', duration: 2 })
          seanceAudio.strikeBelief(5)
        }
      }, PERSONA.beliefs.length * 1200 + 800)

      // Base tone starts ascending
      seanceAudio.baseToneAscend(12)
    }
  }, [stage, beliefsVisible])

  useEffect(() => {
    if (stage === 3 && scrollProgress >= 0.9 && !nameVisible) {
      setNameVisible(true)
      if (nameRevealRef.current) {
        gsap.fromTo(nameRevealRef.current, { opacity: 0 }, { opacity: 1, duration: 1.2 })
        setTimeout(() => {
          gsap.to(nameRevealRef.current, { opacity: 0, duration: 1.5 })
        }, 2000)
      }
    }
  }, [stage, scrollProgress, nameVisible])

  // ── Escape key + native wheel-down → unlock scroll ───────────────────
  useEffect(() => {
    const handleKeyUp = (e) => {
      // Escape instantly unlocks
      if (e.key === 'Escape' && !scrollUnlocked.current) {
        unlockScroll()
        if (nudgeRef.current) {
          gsap.to(nudgeRef.current, { opacity: 1, duration: 0.8 })
          setTimeout(() => gsap.to(nudgeRef.current, { opacity: 0, duration: 1.5 }), 4000)
        }
      }
    }

    // Native wheel-down while Lenis is locked → show nudge, unlock after 2s
    let wheelUnlockTimer = null
    const handleWheel = (e) => {
      if (!scrollUnlocked.current && stageRef.current === 2 && e.deltaY > 0) {
        // Show nudge immediately
        if (nudgeRef.current) {
          gsap.to(nudgeRef.current, { opacity: 1, duration: 0.6 })
        }
        clearTimeout(wheelUnlockTimer)
        wheelUnlockTimer = setTimeout(() => {
          unlockScroll()
          setTimeout(() => {
            if (nudgeRef.current) gsap.to(nudgeRef.current, { opacity: 0, duration: 1.5 })
          }, 3000)
        }, 1500) // brief pause so it feels intentional, not accidental
      }
    }

    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('wheel', handleWheel)
      clearTimeout(wheelUnlockTimer)
    }
  }, [unlockScroll])

  // ── Cleanup ─────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      seanceAudio.dispose()
      clearInscriptionCanvas()
      if (communionTimer.current) clearTimeout(communionTimer.current)
      // Safety net — always restore lenis on unmount
      const lenis = getLenis()
      if (lenis) lenis.start()
    }
  }, [])

  // ── Entry mist title ────────────────────────────────────────────────
  const titleRef = useRef(null)
  useEffect(() => {
    if (scrollProgress > 0 && scrollProgress < 0.05 && titleRef.current) {
      gsap.fromTo(titleRef.current, { opacity: 0 }, {
        opacity: 1, duration: 1.5,
        onComplete: () => {
          setTimeout(() => {
            gsap.to(titleRef.current, { opacity: 0, duration: 2 })
          }, 2000)
        },
      })
    }
  }, [scrollProgress > 0 && scrollProgress < 0.02])

  /* ════════════════════ JSX ════════════════════ */
  return (
    <div className="seance-realm" ref={containerRef} onClick={initAudio}>

      {/* Mist title */}
      <div className="seance-title" ref={titleRef}>V. THE SÉANCE</div>

      {/* Realm label */}
      <div className={`seance-label ${stage === 2 ? 'dim' : ''}`}>
        V — THE SÉANCE
      </div>

      {/* Exchange ticks */}
      <div className="seance-ticks">
        {Array.from({ length: 7 }, (_, i) => (
          <div
            key={i}
            className={`seance-tick ${ticks.length > i ? 'active' : ''}`}
          />
        ))}
      </div>

      {/* Stage 1: table text lines */}
      <div className="table-text-container">
        {[
          "you've come a long way.",
          "most people don't make it here.",
          "this room is different.",
          "here, i speak first.",
        ].map((line, i) => (
          <span
            key={i}
            className="table-line"
            ref={el => tableLineRefs.current[i] = el}
          >
            {line}
          </span>
        ))}
      </div>

      {/* Stage 1: voice prompt */}
      <div className="seance-voice-prompt" ref={voicePromptRef}>
        tell me what you're looking for.
      </div>

      {/* Stage 2: communion input */}
      <div className={`communion-wrapper ${communionVisible && !sessionDone ? 'visible' : ''}`}>
        <div className="communion-prompt" ref={promptRef} />
        <input
          ref={inputRef}
          className="communion-input"
          type="text"
          placeholder="a question. a thought. a word."
          aria-label="Type your message to the Séance"
          disabled={inputLocked}
          onKeyDown={handleEnter}
          autoComplete="off"
          spellCheck="false"
        />
        <div className="communion-hint" ref={hintRef}>
          ask again. or let it settle.
        </div>
      </div>

      {/* Thinking/loading state */}
      <div className="seance-thinking" ref={thinkingRef}>
        . . .
      </div>

      {/* Session complete */}
      <div className={`seance-session-complete ${sessionDone ? 'visible' : ''}`}>
        <p>this session is complete.<br />return when ready to begin again.</p>
        <button
          className="seance-reset-btn"
          onClick={() => {
            engineRef.current.reset()
            setSessionDone(false)
            setTicks([])
            clearInscriptionCanvas()
            setExchangeIndex(0)
            setCommunionVisible(true)
            scrollUnlocked.current = false
            const lenis = getLenis()
            if (lenis) lenis.stop()
            // Re-run communion stage
            setTimeout(() => inputRef.current?.focus(), 400)
          }}
        >
          [ RESET ]
        </button>
      </div>

      {/* Word eruption overlay */}
      {eruptionVisible && (
        <div className="word-eruption" ref={eruptionRef} style={{ opacity: 0 }}>
          <span className="word-eruption-text">{eruptionWord}</span>
        </div>
      )}

      {/* 7th exchange wall inscriptions */}
      <div className="wall-inscription-overlay">
        {wallSentences.map((sentence, i) => {
          const dirs = ['north', 'east', 'south', 'west']
          return (
            <div
              key={i}
              className={`wall-sentence ${dirs[i] || 'north'}`}
              ref={el => wall7Refs.current[i] = el}
            >
              {sentence}
            </div>
          )
        })}
      </div>

      {/* 7th exchange final text */}
      <div className="seance-final-text" ref={finalTextRef}>
        this conversation will not be remembered. but it happened.
      </div>

      {/* Stage 3: beliefs */}
      {beliefsVisible && (
        <div className="seance-beliefs-overlay">
          {PERSONA.beliefs.map((belief, i) => {
            const wallClasses = ['wall-n', 'wall-e', 'wall-s', 'wall-w']
            return (
              <div
                key={i}
                className={`belief-text ${wallClasses[i]}`}
                ref={el => beliefRefs.current[i] = el}
              >
                {belief}
              </div>
            )
          })}
          {/* Floor — master belief at index 5 */}
          <div
            className="belief-text floor"
            ref={el => beliefRefs.current[5] = el}
          >
            {PERSONA.masterBelief}
          </div>
        </div>
      )}

      {/* Aerial name reveal */}
      <div className="seance-name-reveal" ref={nameRevealRef}>
        <h2>{PERSONA.name}</h2>
        <p>{PERSONA.title}</p>
      </div>

      {/* Scroll nudge */}
      <div className="seance-nudge" ref={nudgeRef}>
        you may move on.
      </div>

      {/* The 3D scene */}
      <Canvas
        className="seance-canvas"
        gl={{ antialias: true, alpha: false, toneMapping: THREE.NoToneMapping }}
        dpr={[1, window.innerWidth < 768 ? 1.5 : 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <SeanceScene
          stage={stage}
          scrollProgress={scrollProgress}
          exchangeIndex={exchangeIndex}
          candleIntensityScale={candleScale}
          shimmerSpeed={shimmerSpeed}
          presenceActive={presenceActive}
          rushCamera={rushCamera}
          onPresenceFormed={() => {
            setPresenceActive(true)
          }}
          inscriptionTex={inscriptionTex}
        />
      </Canvas>
    </div>
  )
}
