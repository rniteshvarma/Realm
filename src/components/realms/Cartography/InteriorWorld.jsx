// ═══════════════════════════════════════════════════════
//  InteriorWorld — Per-project interior environment
//  Background biome shader + evidence planes + narrative
// ═══════════════════════════════════════════════════════

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

import neuralGridFrag       from '../../../gl/shaders/interiorNeuralGrid.frag.glsl?raw'
import liquidMetalFrag      from '../../../gl/shaders/interiorLiquidMetal.frag.glsl?raw'
import digitalGardenFrag    from '../../../gl/shaders/interiorDigitalGarden.frag.glsl?raw'
import frequencyRoomFrag    from '../../../gl/shaders/interiorFrequencyRoom.frag.glsl?raw'
import archiveWithinFrag    from '../../../gl/shaders/interiorArchiveWithin.frag.glsl?raw'

const INTERIOR_SHADERS = {
  neuralGrid:     neuralGridFrag,
  liquidMetal:    liquidMetalFrag,
  digitalGarden:  digitalGardenFrag,
  frequencyRoom:  frequencyRoomFrag,
  archiveWithin:  archiveWithinFrag,
}

const SHARED_INTERIOR_VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// ── Background biome fullscreen plane ──────────────────────────────────
function BiomeBackground({ interiorType, visible }) {
  const { viewport } = useThree()
  const matRef = useRef()

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  }), [])

  const fragShader = INTERIOR_SHADERS[interiorType] || neuralGridFrag

  useFrame((state) => {
    if (matRef.current) uniforms.uTime.value = state.clock.elapsedTime
  })

  if (!visible) return null

  return (
    <mesh position={[0, 0, -3]} renderOrder={-1}>
      <planeGeometry args={[viewport.width * 2.5, viewport.height * 2.5, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={SHARED_INTERIOR_VERT}
        fragmentShader={fragShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

// ── Gold frame for evidence planes (memoized geometry) ─────────────────
function EvidenceFrame({ position, rotation, hovered }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.82, 1.12)), [])
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: '#C9A84C', transparent: true, opacity: 0.3 }), [])

  useFrame(() => {
    if (mat) mat.opacity = hovered ? 0.8 : 0.3
  })

  return <lineSegments position={position} rotation={rotation} geometry={geo} material={mat} />
}

// ── Evidence plane (project screenshot with scanline idle) ─────────────
function EvidencePlane({ position, rotation, color, label, visible }) {
  const meshRef     = useRef()
  const [hovered, setHovered] = useState(false)
  const matRef        = useRef()
  const hoveredPos    = useMemo(() => new THREE.Vector3(position[0], position[1], position[2] + 1.2), [position])
  const defaultPos    = useMemo(() => new THREE.Vector3(...position), [position])
  const hoveredScale  = useMemo(() => new THREE.Vector3(1.4, 1.4, 1.4), [])
  const defaultScale  = useMemo(() => new THREE.Vector3(1, 1, 1), [])

  useFrame((state) => {
    if (!meshRef.current || !visible) return
    const t = state.clock.elapsedTime

    if (hovered) {
      meshRef.current.position.lerp(hoveredPos, 0.08)
      meshRef.current.rotation.y += (0 - meshRef.current.rotation.y) * 0.1
      meshRef.current.scale.lerp(hoveredScale, 0.08)
    } else {
      meshRef.current.position.lerp(defaultPos, 0.06)
      meshRef.current.scale.lerp(defaultScale, 0.06)
    }

    if (matRef.current) {
      matRef.current.uniforms.uTime.value = t
    }
  })

  const scanlineUniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), [color])

  const scanlineVertShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  const scanlineFragShader = `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      // Scanline
      float scanline = sin(vUv.y * 120.0 - uTime * 0.3) * 0.03 + 0.97;
      // Vignette
      float vignette = 1.0 - length(vUv - 0.5) * 1.2;
      vignette = clamp(vignette, 0.3, 1.0);
      // Base color (simulated screenshot)
      vec3 col = uColor * scanline * vignette;
      // Subtle grid
      float gx = step(0.98, fract(vUv.x * 20.0));
      float gy = step(0.98, fract(vUv.y * 14.0));
      col = mix(col, col * 0.7, max(gx, gy) * 0.5);
      gl_FragColor = vec4(col, 0.92);
    }
  `

  if (!visible) return null

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[1.8, 1.1, 1, 1]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={scanlineVertShader}
          fragmentShader={scanlineFragShader}
          uniforms={scanlineUniforms}
          transparent
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>
      {/* Thin gold frame */}
      <EvidenceFrame position={position} rotation={rotation} hovered={hovered} />
    </group>
  )
}

// ── CTA Diamond geometry ────────────────────────────────────────────────
function CTADiamond({ position, label, visible, onClick }) {
  const meshRef  = useRef()
  const ringRef  = useRef()
  const [hovered, setHovered] = useState(false)
  const glowRef  = useRef(0)

  const geo = useMemo(() => {
    // Octahedron = diamond shape
    return new THREE.OctahedronGeometry(0.18, 0)
  }, [])

  useFrame((state) => {
    if (!meshRef.current || !visible) return
    const t = state.clock.elapsedTime
    meshRef.current.rotation.y += 0.012
    meshRef.current.rotation.x = Math.sin(t * 0.5) * 0.15

    // Glow on hover
    const targetGlow = hovered ? 1 : 0
    glowRef.current += (targetGlow - glowRef.current) * 0.08
    if (meshRef.current.material) {
      meshRef.current.material.emissiveIntensity = glowRef.current * 1.5
    }

    // Ring pulse
    if (ringRef.current) {
      const ringScale = hovered ? 1 + Math.sin(t * 4) * 0.06 : 0
      ringRef.current.scale.setScalar(ringScale + (hovered ? 1 : 0))
      ringRef.current.material.opacity = hovered ? 0.6 : 0
    }
  })

  if (!visible) return null

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        geometry={geo}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <meshStandardMaterial
          color="#C9A84C"
          emissive="#C9A84C"
          emissiveIntensity={0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      {/* Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.28, 32]} />
        <meshBasicMaterial color="#C9A84C" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

// ══════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════════════════
export default function InteriorWorld({ project, phase, phaseProgress, onReadMore }) {
  const groupRef = useRef()
  const visible  = phase === 'inside' || phase === 'escape'

  // Evidence plane configs — 4 planes at various z-depths + rotations
  const evidencePlanes = useMemo(() => [
    { position: [-2.0,  0.5, -1.5], rotation: [0,  0.15, 0.05], color: adjustColor(project.orbColor2) },
    { position: [ 1.8,  0.2, -2.5], rotation: [0, -0.20, -0.03], color: adjustColor(project.orbColor1) },
    { position: [-1.2, -0.8, -3.5], rotation: [0.05, 0.10, 0], color: adjustColor(project.orbColor2) },
    { position: [ 0.5,  1.1, -2.0], rotation: [-0.05, -0.15, 0.06], color: adjustColor(project.orbColor1) },
  ], [project])

  // CTA visibility at 83%+ of inside phase
  const ctaVisible = visible && phaseProgress > 0.92

  // Group visibility toggle at exact surface break
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.visible = visible
  })

  // Narrative block progress helpers
  const blockA = visible && phaseProgress > 0.12 // 62% zone = 12% inside phase
  const blockB = visible && phaseProgress > 0.38 // 68%
  const blockC = visible && phaseProgress > 0.56 // 74%
  const blockD = visible && phaseProgress > 0.76 // 80%

  return (
    <group ref={groupRef} visible={visible}>
      {/* Background biome shader */}
      <BiomeBackground interiorType={project.interiorType} visible={visible} />

      {/* Evidence planes */}
      {evidencePlanes.map((p, i) => (
        <EvidencePlane
          key={i}
          position={p.position}
          rotation={p.rotation}
          color={p.color}
          label={`${project.title} — IMG ${i + 1}`}
          visible={visible && phaseProgress > 0.05}
        />
      ))}

      {/* CTA diamonds */}
      <CTADiamond
        position={[-0.6, -1.2, -1.8]}
        label="VIEW LIVE"
        visible={ctaVisible}
        onClick={() => window.open(project.liveUrl, '_blank')}
      />
      <CTADiamond
        position={[0.6, -1.2, -1.8]}
        label="READ MORE"
        visible={ctaVisible}
        onClick={onReadMore}
      />

      {/* Point light inside */}
      <pointLight position={[0, 1, -1]} intensity={1.5} color={project.orbColor2} distance={8} />
      <ambientLight intensity={0.3} />
    </group>
  )
}

// Helper: darken/brighten THREE.Color to hex string for plane material
function adjustColor(color) {
  const c = color.clone().multiplyScalar(0.5)
  return `#${c.getHexString()}`
}
