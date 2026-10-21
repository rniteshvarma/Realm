import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import VoyageCanvas from '../VoyageCanvas'
import { useSectionProgress, damp } from '../useSectionProgress'
import Beats, { stepsOf } from '../Beats'
import { glowTexture } from './Accretion'
import { makePlanetMaterial } from './planetMaterial'
import { LABEL_FONT, LABEL_CHARS } from '../labelFont'
import { ADDITIVE } from '../blend'
import '../voyage.css'

// ═══════════════════════════════════════════════════════════════════════
//  04 · GRAVITY ASSIST — career trajectory
//  Spacecraft don't reach the outer planets on fuel alone; they borrow
//  speed from every world they pass. One world per role. The probe hooks
//  around each, drawing a gold Voyager-style trail; at the end the camera
//  pulls back to show the whole route.
// ═══════════════════════════════════════════════════════════════════════

const WORLDS = [
  { key: 'techomega', year: '2019', name: 'TECHOMEGA', r: 2.4, at: 0.14,
    mat: { a: '#1d6b6b', b: '#7fd1c4', c: '#e6fff8', atmo: '#7fffe0', bands: 6, turb: 5, seed: 1 } },
  { key: 'bight', year: '2020', name: 'BIGHT', r: 3.0, at: 0.32,
    mat: { a: '#0b2a6b', b: '#2f7fd8', c: '#cfe4ff', atmo: '#66aaff', bands: 4, turb: 7, seed: 2 } },
  { key: 'ibm', year: '2021', name: 'IBM', r: 5.2, at: 0.50, ring: true,
    mat: { a: '#13245a', b: '#4b6cc9', c: '#d6e2ff', atmo: '#8fb0ff', bands: 22, turb: 2, seed: 3 } },
  { key: 'searce', year: '2022', name: 'SEARCE', r: 3.6, at: 0.68,
    mat: { a: '#8fa6b8', b: '#eef4fa', c: '#ffffff', atmo: '#dff0ff', bands: 9, turb: 6, seed: 4 } },
  { key: 'wavefuel', year: '2023 →', name: 'WAVEFUEL', r: 4.4, at: 0.86, moons: 3,
    mat: { a: '#6b4a12', b: '#C9A84C', c: '#fff1c9', atmo: '#ffd27a', bands: 12, turb: 4, seed: 5, glow: 0.12 } },
]

const BEATS = [
  { at: 0.00, side: 'center', kicker: 'T+2019 · CAREER TRAJECTORY', title: 'GRAVITY ASSIST', xl: true,
    body: 'Spacecraft don’t reach the outer planets on fuel alone. They borrow speed from every world they pass.' },
  { at: 0.07, side: 'left', kicker: 'T+2019 · STOCKHOLM · TECHOMEGA', title: 'First mission command',
    body: 'My first project to lead: a medical e-commerce platform. Turning clinical workflows into specs engineers could ship — on schedule.',
    metric: 'Project Manager · Healthcare commerce' },
  { at: 0.25, side: 'left', kicker: 'T+2020 · HYDERABAD · BIGHT', title: 'My first world from zero',
    body: 'A learning platform for universities, built 0→1 from user research. The first time the roadmap was mine.',
    metric: 'Product Manager · 3+ university pilots' },
  { at: 0.43, side: 'left', kicker: 'T+2021 · IBM · FOR AT&T', title: 'Gravity at scale',
    body: 'Twenty-plus engineers, ten workstreams, one rhythm. Dashboards that removed status meetings instead of adding them.',
    metric: 'Project Manager · −30% manual status reviews' },
  { at: 0.61, side: 'left', kicker: 'T+2022 · SEARCE', title: 'Moving worlds to the cloud',
    body: 'Fifteen-plus enterprise migrations across AWS, GCP and Kubernetes — and a full year without a single client escalation.',
    metric: 'Technical PM · 15+ migrations · 0 escalations' },
  { at: 0.79, side: 'left', kicker: 'T+2023 → NOW · WAVEFUEL', title: 'The world I co-founded',
    body: 'Lighthouse — an AI + IoT platform that lets factories talk back. Eleven deployments later, Wavefuel was acquired by Varsun E-Technologies.',
    metric: 'Co-founder · Senior PM · Acquired' },
  { at: 0.94, side: 'low', kicker: 'TRAJECTORY COMPLETE', title: 'Every slingshot borrowed momentum from the last.' },
]

// Lay the worlds out on a gentle zig-zag and build a path that hooks
// around the far side of each one (a slingshot), then flies on.
function buildRoute() {
  const centers = WORLDS.map((w, k) => new THREE.Vector3(k * 38, (k % 2 ? 2 : -2), k % 2 ? 16 : -16))
  const pts = [new THREE.Vector3(-46, 10, 30), new THREE.Vector3(-20, 2, 8)]
  const periIndex = []
  centers.forEach((c, k) => {
    const s = k % 2 ? 1 : -1      // which side we swing around
    const R = WORLDS[k].r
    pts.push(c.clone().add(new THREE.Vector3(-R * 2.6, 0.6, -s * R * 1.2)))
    periIndex.push(pts.length)
    pts.push(c.clone().add(new THREE.Vector3(0, 0, -s * R * 1.55)))
    pts.push(c.clone().add(new THREE.Vector3(R * 2.4, -0.6, -s * R * 0.4)))
  })
  pts.push(centers[centers.length - 1].clone().add(new THREE.Vector3(30, 8, 10)))
  pts.push(centers[centers.length - 1].clone().add(new THREE.Vector3(70, 18, 26)))
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal')
  const n = pts.length - 1
  // Control point i sits at t = i / n for CatmullRomCurve3.getPoint
  const periT = periIndex.map((i) => i / n)
  return { curve, centers, periT }
}

// Scroll progress → curve parameter, so each periapsis lands on its beat
function progressToT(p, periT) {
  const keys = [[0, 0], ...WORLDS.map((w, k) => [w.at, periT[k]]), [1, 1]]
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, t0] = keys[i], [p1, t1] = keys[i + 1]
    if (p <= p1) return THREE.MathUtils.lerp(t0, t1, (p - p0) / (p1 - p0))
  }
  return 1
}

const TRAIL_SAMPLES = 1600

function Route({ progress }) {
  const { curve, centers, periT } = useMemo(buildRoute, [])
  const p = useRef(0)
  const shipRef = useRef()
  const trailRef = useRef()
  const lookRef = useRef(new THREE.Vector3())
  const labelRefs = useRef([])
  const moonRefs = useRef([])
  const beaconRef = useRef()

  const materials = useMemo(() => WORLDS.map((w) => makePlanetMaterial(w.mat)), [])

  const trail = useMemo(() => {
    const pts = curve.getPoints(TRAIL_SAMPLES)
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    g.setDrawRange(0, 0)
    return g
  }, [curve])
  const ghost = useMemo(() => new THREE.BufferGeometry().setFromPoints(curve.getPoints(600)), [curve])

  const tmp = useMemo(() => ({
    pos: new THREE.Vector3(), tan: new THREE.Vector3(), cam: new THREE.Vector3(),
    back: new THREE.Vector3(), side: new THREE.Vector3(), up: new THREE.Vector3(),
    over: new THREE.Vector3(), ahead: new THREE.Vector3(), mid: new THREE.Vector3(76, 0, 0),
    shipLook: new THREE.Vector3(),
  }), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    p.current = damp(p.current, progress.current, 3.5, delta)
    const u = THREE.MathUtils.clamp(progressToT(p.current, periT), 0, 0.999)

    materials.forEach((m) => (m.uniforms.uTime.value = t))
    curve.getPoint(u, tmp.pos)
    curve.getTangent(u, tmp.tan)

    // Probe
    if (shipRef.current) {
      shipRef.current.position.copy(tmp.pos)
      shipRef.current.lookAt(tmp.shipLook.copy(tmp.pos).add(tmp.tan))
    }
    trail.setDrawRange(0, Math.floor(u * TRAIL_SAMPLES))

    // Nearest world → how much to frame it
    let nearK = 0, nearD = Infinity
    centers.forEach((c, k) => { const d = c.distanceTo(tmp.pos); if (d < nearD) { nearD = d; nearK = k } })
    const frame = 1 - THREE.MathUtils.smoothstep(nearD, WORLDS[nearK].r * 2, WORLDS[nearK].r * 6)

    // Chase camera; pull out wider at each flyby; full overview at the end
    const overview = THREE.MathUtils.smoothstep(p.current, 0.9, 0.98)
    tmp.back.copy(tmp.tan).multiplyScalar(-(9 + frame * 6))
    tmp.side.set(-tmp.tan.z, 0, tmp.tan.x).multiplyScalar(frame * 7)
    tmp.cam.copy(tmp.pos).add(tmp.back).add(tmp.side).add(tmp.up.set(0, 3.2 + frame * 3, 0))
    // Back off further on narrow screens so the whole route fits
    const fit = THREE.MathUtils.clamp(1.45 / state.camera.aspect, 1, 2.6)
    tmp.cam.lerp(tmp.over.set(76, 120 * fit, 120 * fit), overview)
    state.camera.position.lerp(tmp.cam, 1 - Math.exp(-delta * 4))

    tmp.ahead.copy(tmp.pos).addScaledVector(tmp.tan, 10)
      .lerp(centers[nearK], frame * 0.55).lerp(tmp.mid, overview)
    lookRef.current.lerp(tmp.ahead, 1 - Math.exp(-delta * 4))
    state.camera.lookAt(lookRef.current)

    // Year labels appear for the overview
    labelRefs.current.forEach((l) => { if (l) l.fillOpacity = overview })

    // Wavefuel's moons (products) and the acquisition beacon
    moonRefs.current.forEach((m, i) => {
      if (!m) return
      const a = t * (0.5 + i * 0.22) + i * 2.1
      const rr = WORLDS[4].r * (1.7 + i * 0.45)
      m.position.set(Math.cos(a) * rr, Math.sin(a * 0.7) * 0.6, Math.sin(a) * rr)
    })
    if (beaconRef.current) {
      const k = (t * 0.45) % 1
      beaconRef.current.scale.setScalar(WORLDS[4].r * (1.2 + k * 2.2))
      beaconRef.current.material.opacity = (1 - k) * 0.45
    }
  })

  return (
    <>
      <ambientLight intensity={0.05} />

      {/* Planned route (faint) and flown route (gold) */}
      <line geometry={ghost}>
        <lineBasicMaterial color="#cfe4ff" transparent opacity={0.08} />
      </line>
      <line geometry={trail}>
        <lineBasicMaterial color="#ffd27a" transparent opacity={0.95} {...ADDITIVE} toneMapped={false} />
      </line>

      {WORLDS.map((w, k) => (
        <group key={w.key} position={centers[k]}>
          <mesh material={materials[k]}>
            <sphereGeometry args={[w.r, 64, 64]} />
          </mesh>
          <sprite scale={[w.r * 3.4, w.r * 3.4, 1]}>
            <spriteMaterial map={glowTexture()} color={w.mat.atmo} transparent opacity={0.22}
              {...ADDITIVE} depthWrite={false} toneMapped={false} />
          </sprite>
          {w.ring && (
            <mesh rotation={[Math.PI / 2.3, 0.2, 0]}>
              <ringGeometry args={[w.r * 1.35, w.r * 2.1, 96]} />
              <meshBasicMaterial color="#9fb6ff" transparent opacity={0.22} side={THREE.DoubleSide} depthWrite={false} />
            </mesh>
          )}
          {w.moons && Array.from({ length: w.moons }).map((_, i) => (
            <mesh key={i} ref={(m) => (moonRefs.current[i] = m)}>
              <sphereGeometry args={[0.35 + i * 0.08, 24, 24]} />
              <meshBasicMaterial color={['#fff1c9', '#cfe4ff', '#ffd27a'][i]} toneMapped={false} />
            </mesh>
          ))}
          {w.key === 'wavefuel' && (
            <mesh ref={beaconRef} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.98, 1, 128]} />
              <meshBasicMaterial color="#ffd27a" transparent opacity={0.4} side={THREE.DoubleSide}
                depthWrite={false} toneMapped={false} />
            </mesh>
          )}
          <Suspense fallback={null}>
          <Billboard position={[0, w.r + 3.5, 0]}>
            <Text ref={(m) => (labelRefs.current[k] = m)} font={LABEL_FONT} characters={LABEL_CHARS}
              fontSize={3.2} color="#f4f1ea" anchorX="center"
              letterSpacing={0.12} fillOpacity={0}>
              {`${w.year}  ${w.name}`}
            </Text>
          </Billboard>
          </Suspense>
        </group>
      ))}

      {/* The probe */}
      <group ref={shipRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.28, 1.1, 12]} />
          <meshBasicMaterial color="#fff6e6" toneMapped={false} />
        </mesh>
        <sprite position={[0, 0, -0.7]} scale={[2.6, 2.6, 1]}>
          <spriteMaterial map={glowTexture()} color="#ffcf7a" transparent {...ADDITIVE}
            depthWrite={false} toneMapped={false} />
        </sprite>
      </group>
    </>
  )
}

export default function GravityAssist() {
  const ref = useRef(null)
  const { progress, step } = useSectionProgress(ref, { steps: stepsOf(BEATS) })

  return (
    <div className="v-chapter" ref={ref}>
      <div className="v-sticky">
        <div className="v-canvas">
          <VoyageCanvas maxDpr={1.5} gl={{ alpha: true, antialias: true }}
            camera={{ fov: 55, near: 0.1, far: 800, position: [-60, 20, 50] }}>
            <Route progress={progress} />
          </VoyageCanvas>
        </div>
        <Beats beats={BEATS} step={step} />
      </div>
    </div>
  )
}
