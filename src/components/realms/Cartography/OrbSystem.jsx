// ═══════════════════════════════════════════════════════
//  OrbSystem — A single project planet with moons + glow
// ═══════════════════════════════════════════════════════

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

import orbSharedVert     from '../../../gl/shaders/orbShared.vert.glsl?raw'
import orbElectricFrag   from '../../../gl/shaders/orbElectric.frag.glsl?raw'
import orbOceanFrag      from '../../../gl/shaders/orbOcean.frag.glsl?raw'
import orbLavaFrag       from '../../../gl/shaders/orbLava.frag.glsl?raw'
import orbIceFrag        from '../../../gl/shaders/orbIce.frag.glsl?raw'
import orbCircuitFrag    from '../../../gl/shaders/orbCircuit.frag.glsl?raw'

const ORB_FRAG_SHADERS = {
  electric: orbElectricFrag,
  ocean:    orbOceanFrag,
  lava:     orbLavaFrag,
  ice:      orbIceFrag,
  circuit:  orbCircuitFrag,
}

// ── Moon builder: instanced mesh for performance ────────────────────────
function MoonSystem({ orbRadius, phase, isMobile }) {
  const moonCount = isMobile ? 2 : 4
  const meshRef   = useRef()
  const trailsRef = useRef([])

  // Moon orbit parameters
  const moons = useMemo(() => Array.from({ length: moonCount }, (_, i) => ({
    radius:    0.04 + Math.random() * 0.04,
    orbitR:    orbRadius * 1.6 + i * 0.3,
    speed:     0.4 + Math.random() * 0.6,
    axisX:     Math.random() * 0.6 - 0.3,
    axisY:     Math.random() * 0.3,
    phaseOff:  (i / moonCount) * Math.PI * 2,
  })), [orbRadius, moonCount])

  // Build instanced geometry on mount
  const geo = useMemo(() => new THREE.SphereGeometry(0.06, 8, 8), [])
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color: 0xccccdd,
    roughness: 0.8,
    metalness: 0.2,
  }), [])

  // Trail lines per moon
  const trailGeos = useMemo(() => moons.map((moon) => {
    const pts = []
    for (let t = 0; t <= 60; t++) {
      const angle = (t / 60) * Math.PI * 2 + moon.phaseOff
      const x = Math.cos(angle) * moon.orbitR
      const z = Math.sin(angle) * moon.orbitR
      const y = Math.sin(angle * moon.axisX + moon.phaseOff) * moon.orbitR * 0.2
      pts.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.BufferGeometry().setFromPoints(pts)
  }), [moons])

  const trailMats = useMemo(() => moons.map(() =>
    new THREE.LineBasicMaterial({
      color: 0x8899bb,
      transparent: true,
      opacity: 0.0,
    })
  ), [moons])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!meshRef.current) return

    const orbiting = phase === 'orbit'
    const approaching = phase === 'approach'

    moons.forEach((moon, i) => {
      const angle = t * moon.speed + moon.phaseOff
      const x = Math.cos(angle) * moon.orbitR
      const z = Math.sin(angle) * moon.orbitR
      const y = Math.sin(angle * moon.axisX + moon.phaseOff) * moon.orbitR * 0.2

      dummy.position.set(x, y, z)
      dummy.scale.setScalar(moon.radius / 0.06)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Trail opacity: visible in approach + orbit phases
      if (trailMats[i]) {
        const targetOpacity = (approaching || orbiting) ? 0.35 : 0.0
        trailMats[i].opacity += (targetOpacity - trailMats[i].opacity) * 0.03
      }
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geo, mat, moonCount]} />
      {trailGeos.map((geo, i) => (
        <line key={i} geometry={geo} material={trailMats[i]} />
      ))}
    </group>
  )
}



// ── Main Orb component ──────────────────────────────────────────────────
export default function OrbSystem({
  project,
  phase,
  phaseProgress,
  mouseNDC,
  isActive,
  isMobile,
}) {
  const groupRef  = useRef()
  const meshRef   = useRef()
  const matRef    = useRef()
  const targetScaleRef = useRef(1)

  const fragShader = ORB_FRAG_SHADERS[project.orbShader] || orbElectricFrag

  // Build shader material
  const uniforms = useMemo(() => ({
    uTime:   { value: 0 },
    uSpeed:  { value: 0.4 },
    uColor1: { value: project.orbColor1.clone() },
    uColor2: { value: project.orbColor2.clone() },
  }), [project])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   orbSharedVert,
    fragmentShader: fragShader,
    uniforms,
  }), [fragShader, uniforms])

  const segments = isMobile ? 32 : 64
  const geometry = useMemo(
    () => new THREE.SphereGeometry(project.orbRadius, segments, segments),
    [project.orbRadius, segments]
  )

  useFrame((state) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value  = t

    // Speed ramps up during approach
    const targetSpeed = phase === 'approach'
      ? 0.4 + phaseProgress * 0.8
      : phase === 'orbit' ? 1.2 : 0.4
    uniforms.uSpeed.value += (targetSpeed - uniforms.uSpeed.value) * 0.02

    if (!groupRef.current) return

    // Scale: shrink non-active orbs during descent/inside
    const wantScale = (!isActive && (phase === 'descent' || phase === 'inside'))
      ? 0.0 // hide entirely
      : 1.0
    targetScaleRef.current += (wantScale - targetScaleRef.current) * 0.04
    groupRef.current.scale.setScalar(targetScaleRef.current)

    // Parallax rotation on mouse during orbit
    if (meshRef.current && phase === 'orbit') {
      const targetRotY = mouseNDC.x * 0.4
      const targetRotX = -mouseNDC.y * 0.25
      meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05
      meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05
    }

    // Slow base rotation always
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  // Atmospheric haze ring
  const haloGeo = useMemo(() => new THREE.RingGeometry(
    project.orbRadius * 1.02,
    project.orbRadius * 1.18,
    64
  ), [project.orbRadius])
  const haloMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: project.orbColor2,
    transparent: true,
    opacity: 0.08,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }), [project.orbColor2])

  return (
    <group ref={groupRef} position={project.orbPosition}>
      {/* Core sphere */}
      <mesh ref={meshRef} geometry={geometry} material={material} />

      {/* Atmospheric haze ring */}
      <mesh geometry={haloGeo} material={haloMat} rotation={[Math.PI / 2, 0, 0]} />



      {/* Moon system */}
      {isActive && (
        <MoonSystem
          orbRadius={project.orbRadius}
          phase={phase}
          isMobile={isMobile}
        />
      )}

      {/* Title label — fades in on close approach */}
      {(phase === 'approach' && phaseProgress > 0.6) || phase === 'orbit'  ? (
        <Text
          position={[0, project.orbRadius + 0.4, 0]}
          fontSize={0.18}
          color="#C9A84C"
          anchorX="center"
          anchorY="bottom"
          fillOpacity={phase === 'orbit' ? 1 : phaseProgress * 2 - 1.2}
        >
          {project.title}
        </Text>
      ) : null}
    </group>
  )
}
