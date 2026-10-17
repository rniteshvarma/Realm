import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import VoyageCanvas from '../VoyageCanvas'
import { useSectionProgress, damp } from '../useSectionProgress'
import Beats, { stepsOf } from '../Beats'
import { glowTexture } from './Accretion'
import { ADDITIVE } from '../blend'
import '../voyage.css'
import './DysonSwarm.css'

// ═══════════════════════════════════════════════════════════════════════
//  08 · DYSON SWARM — what I'm building now
//  A star is just energy. Scroll, and hexagonal collectors spiral in from
//  orbit and lock into a shell around it — each wave is something being
//  built right now. At full enclosure the lattice ignites.
// ═══════════════════════════════════════════════════════════════════════

const BEATS = [
  { at: 0.00, side: 'center', kicker: 'T+NOW · WHAT I’M BUILDING', title: 'DYSON SWARM', xl: true,
    body: 'A star is just energy. A world is what you build around it.' },
  { at: 0.10, side: 'left', kicker: 'WAVE I · AI COPILOTS', title: 'Machines that answer back',
    body: 'A real-time copilot that reads live factory data and answers operators in plain language.' },
  { at: 0.27, side: 'left', kicker: 'WAVE II · AUTONOMOUS AGENTS', title: 'Agents that act, not just answer',
    body: 'Agents that query production data and trigger machine-level actions end to end — built on RAG and a custom MCP layer.' },
  { at: 0.44, side: 'left', kicker: 'WAVE III · RULE ENGINE', title: 'Systems that react on their own',
    body: 'An event-driven rule engine across APIs, webhooks and Kafka, wiring cross-system workflows together.',
    metric: '+13% OEE · 30% more units' },
  { at: 0.61, side: 'left', kicker: 'WAVE IV · LOGISTICS', title: 'Fleets that find their way',
    body: 'Real-time GPS and IoT routing for dairy supply chains — factories, warehouses and fleets on one map.',
    metric: '+18% fleet utilisation' },
  { at: 0.78, side: 'left', kicker: 'WAVE V · SPEED', title: 'Idea to demo in 2–3 days',
    body: 'Lovable, Claude, v0 and Cursor turn a customer conversation into something they can click before the week is out.' },
  { at: 0.93, side: 'low', kicker: 'ENCLOSURE COMPLETE', title: 'I don’t manage products. I build worlds.' },
]

const R = 6.2
const ASSEMBLE_START = 0.08
const ASSEMBLE_END = 0.9

const STAR_VERT = /* glsl */`
  varying vec3 vP; varying vec3 vN;
  void main() { vP = position; vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`
const STAR_FRAG = /* glsl */`
  uniform float uTime;
  varying vec3 vP; varying vec3 vN;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) { vec3 i = floor(p), f = fract(p); vec3 u = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), u.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), u.x), u.y),
               mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), u.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), u.x), u.y), u.z); }
  float fbm(vec3 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.1; a *= 0.5; } return v; }
  void main() {
    vec3 n = normalize(vP);
    float g = fbm(n * 6.0 + vec3(0.0, uTime * 0.15, uTime * 0.07));
    float cells = fbm(n * 22.0 - uTime * 0.2);
    vec3 col = mix(vec3(1.0, 0.55, 0.15), vec3(1.0, 0.95, 0.8), smoothstep(0.35, 0.75, g));
    col *= 0.75 + cells * 0.55;
    float limb = pow(abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 0.45);
    gl_FragColor = vec4(col * (0.55 + 0.75 * limb) * 1.6, 1.0);
  }
`

function fibonacciSphere(n) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = golden * i
    pts.push(new THREE.Vector3(Math.cos(th) * r, y, Math.sin(th) * r))
  }
  return pts
}

function Swarm({ progress, readoutRef }) {
  const low = useStore.getState().performanceLow
  const N = low ? 420 : 960
  const meshRef = useRef()
  const coronaRef = useRef()
  const leakRef = useRef()
  const beamRefs = useRef([])
  const p = useRef(0)
  const starUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])

  const panels = useMemo(() => {
    const slots = fibonacciSphere(N)
    // Build order: sweep from the equator outward in a spiral, so the shell
    // visibly closes toward the poles
    const order = slots.map((s, i) => ({ s, i, key: Math.abs(s.y) + ((Math.atan2(s.z, s.x) + Math.PI) / (Math.PI * 2)) * 0.08 }))
      .sort((a, b) => a.key - b.key)
    return order.map(({ s }, k) => {
      const orbitR = 14 + Math.random() * 16
      const incl = (Math.random() - 0.5) * 0.9
      const phase = Math.random() * Math.PI * 2
      const start = ASSEMBLE_START + (k / N) * (ASSEMBLE_END - ASSEMBLE_START - 0.04)
      return { slot: s.clone().multiplyScalar(R), normal: s.clone(), orbitR, incl, phase, start }
    })
  }, [N])

  const geo = useMemo(() => {
    // Flat hexagonal collector, a little thicker at the rim
    const g = new THREE.CylinderGeometry(0.42, 0.42, 0.06, 6, 1)
    g.rotateX(Math.PI / 2)
    return g
  }, [])
  const tmp = useMemo(() => ({
    m: new THREE.Matrix4(), q: new THREE.Quaternion(), pos: new THREE.Vector3(), orbit: new THREE.Vector3(),
    s: new THREE.Vector3(1, 1, 1), z: new THREE.Vector3(0, 0, 1), color: new THREE.Color(),
  }), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    p.current = damp(p.current, progress.current, 3.5, delta)
    starUniforms.uTime.value = t
    const mesh = meshRef.current
    if (!mesh) return

    let docked = 0
    const ignite = THREE.MathUtils.smoothstep(p.current, 0.9, 0.97)
    for (let i = 0; i < panels.length; i++) {
      const pn = panels[i]
      const k = THREE.MathUtils.clamp((p.current - pn.start) / 0.06, 0, 1)
      const e = k * k * (3 - 2 * k)
      // Parked in a tilted orbit, then spiralling in to its slot
      const a = pn.phase + t * (0.6 / Math.sqrt(pn.orbitR)) * 3
      tmp.orbit.set(Math.cos(a) * pn.orbitR, Math.sin(a) * pn.orbitR * pn.incl, Math.sin(a) * pn.orbitR)
      tmp.pos.copy(tmp.orbit).lerp(pn.slot, e)
      // lift along the way so arrivals arc instead of cutting straight
      tmp.pos.addScaledVector(pn.normal, Math.sin(e * Math.PI) * 2.2)
      tmp.q.setFromUnitVectors(tmp.z, pn.normal)
      const sc = 0.55 + e * 0.45
      tmp.s.set(sc, sc, sc)
      tmp.m.compose(tmp.pos, tmp.q, tmp.s)
      mesh.setMatrixAt(i, tmp.m)
      if (k >= 1) docked++
      // Fresh arrivals flash gold; the finished lattice glows
      const arrive = k >= 1 ? Math.exp(-(p.current - pn.start - 0.06) * 60) : 0
      const glow = Math.max(arrive, ignite * (0.6 + 0.4 * Math.sin(t * 2 + i * 0.37)))
      tmp.color.setRGB(0.16 + glow * 1.0, 0.13 + glow * 0.7, 0.1 + glow * 0.3)
      mesh.setColorAt(i, tmp.color)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true

    const cover = docked / panels.length
    // Egg 3 · THE CLOSED SHELL — reach full enclosure
    if (cover >= 0.999 && !useStore.getState().loreEggs['freq-ghost']) useStore.getState().discoverEgg('freq-ghost')
    if (readoutRef.current) readoutRef.current.textContent = `${Math.round(cover * 100).toString().padStart(2, '0')}%`
    // The star's glow is swallowed as the shell closes; light leaks through
    if (coronaRef.current) coronaRef.current.material.opacity = 0.85 * (1 - cover * 0.85)
    if (leakRef.current) leakRef.current.material.opacity = 0.25 + ignite * 0.5
    beamRefs.current.forEach((b) => {
      if (!b) return
      b.material.opacity = ignite * (0.55 + 0.15 * Math.sin(t * 6))
      b.scale.set(1, 1 + ignite * 0.4, 1)
    })

    // Slow orbiting camera
    const cam = state.camera
    const yaw = t * 0.05 + p.current * 1.6
    const dist = THREE.MathUtils.lerp(30, 19, THREE.MathUtils.smoothstep(p.current, 0, 0.5))
    cam.position.set(Math.sin(yaw) * dist, 4 + Math.sin(p.current * 3) * 3, Math.cos(yaw) * dist)
    cam.lookAt(0, 0, 0)
  })

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={180} distance={60} color="#ffd9a0" />
      <directionalLight position={[20, 14, 10]} intensity={0.4} color="#cfe4ff" />

      {/* The star */}
      <mesh>
        <sphereGeometry args={[R * 0.62, 96, 96]} />
        <shaderMaterial vertexShader={STAR_VERT} fragmentShader={STAR_FRAG} uniforms={starUniforms} toneMapped={false} />
      </mesh>
      <sprite ref={coronaRef} scale={[R * 4.2, R * 4.2, 1]}>
        <spriteMaterial map={glowTexture()} color="#ffb347" transparent opacity={0.85}
          {...ADDITIVE} depthWrite={false} toneMapped={false} />
      </sprite>
      <sprite ref={leakRef} scale={[R * 2.6, R * 2.6, 1]} renderOrder={2}>
        <spriteMaterial map={glowTexture()} color="#ffd27a" transparent opacity={0.25} depthTest={false}
          {...ADDITIVE} depthWrite={false} toneMapped={false} />
      </sprite>

      {/* Collectors */}
      <instancedMesh ref={meshRef} args={[geo, null, N]} frustumCulled={false}>
        <meshStandardMaterial metalness={0.85} roughness={0.32} color="#ffffff"
          emissive="#C9A84C" emissiveIntensity={0.08} />
      </instancedMesh>

      {/* Harvested power: polar beams at full enclosure */}
      {[1, -1].map((dir, i) => (
        <mesh key={i} ref={(m) => (beamRefs.current[i] = m)} position={[0, dir * (R + 9), 0]} rotation={[dir > 0 ? 0 : Math.PI, 0, 0]}>
          <coneGeometry args={[0.9, 18, 32, 1, true]} />
          <meshBasicMaterial color="#ffe2a8" transparent opacity={0} {...ADDITIVE}
            depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
    </>
  )
}

export default function DysonSwarm() {
  const ref = useRef(null)
  const readoutRef = useRef(null)
  const { progress, step } = useSectionProgress(ref, { steps: stepsOf(BEATS) })

  return (
    <div className="v-chapter" ref={ref}>
      <div className="v-sticky">
        <div className="v-canvas">
          <VoyageCanvas maxDpr={1.5} gl={{ alpha: true, antialias: true }}
            camera={{ fov: 50, near: 0.1, far: 300, position: [0, 4, 30] }}>
            <Swarm progress={progress} readoutRef={readoutRef} />
          </VoyageCanvas>
        </div>
        <div className="dyson-readout" aria-hidden="true">
          <span className="dyson-readout__label">ENCLOSURE</span>
          <span className="dyson-readout__value" ref={readoutRef}>00%</span>
        </div>
        <Beats beats={BEATS} step={step} />
      </div>
    </div>
  )
}
