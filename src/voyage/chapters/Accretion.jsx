import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import VoyageCanvas from '../VoyageCanvas'
import { useSectionProgress, damp } from '../useSectionProgress'
import Beats, { stepsOf } from '../Beats'
import { ADDITIVE } from '../blend'
import '../voyage.css'

// ═══════════════════════════════════════════════════════════════════════
//  02 · ACCRETION — origins & education
//  A protoplanetary disk on real (Keplerian) orbits. Scroll and the dust
//  in each lane collides, flashes and clumps into a body — one world per
//  formative chapter, leaving clean ring gaps behind.
// ═══════════════════════════════════════════════════════════════════════

const BEATS = [
  { at: 0.00, side: 'center', kicker: 'T+2013 · BEFORE THE SHAPE', title: 'ACCRETION', xl: true,
    body: 'Everything starts as dust.' },
  { at: 0.10, side: 'left', kicker: 'T+2013 · HYDERABAD',
    title: 'Loose particles',
    body: 'Four years of computer science. Logic, code and curiosity — orbiting, colliding, not yet holding together.',
    metric: 'B.Tech · Computer Science' },
  { at: 0.30, side: 'right', kicker: 'T+2017 · 7,000 KM NORTH',
    title: 'Gravity pulled',
    body: 'A master’s in software engineering in Sweden. Where I learned why some systems hold together and most quietly fall apart.',
    metric: 'MSc · Software Engineering · Sweden' },
  { at: 0.50, side: 'left', kicker: 'T+2018 · STOCKHOLM',
    title: 'The first law of models',
    body: 'Inside an AI research lab, studying what makes machine learning work. The answer was rarely the model — it was the data feeding it.',
    metric: 'AI / ML research' },
  { at: 0.70, side: 'right', kicker: 'T+2019 · STOCKHOLM',
    title: 'Feel it in the hand',
    body: 'Shipping production React taught me what no spec can: how a product actually feels to the person using it.',
    metric: 'Engineering → product' },
  { at: 0.88, side: 'low', kicker: 'CORE FORMED',
    title: 'Enough mass to hold a shape.' },
]

// One forming world per formative beat: [orbit radius, capture start, colour]
const WORLDS = [
  { r: 4.2,  start: 0.10, color: '#ffd98a' },
  { r: 6.8,  start: 0.30, color: '#9cc8ff' },
  { r: 9.4,  start: 0.50, color: '#e8b27a' },
  { r: 12.2, start: 0.70, color: '#cfe4ff' },
]
const LANE = 0.9
const CAPTURE_SPAN = 0.16

const VERT = /* glsl */`
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform vec4  uWorldR;      // orbit radius per world
  uniform vec4  uWorldPhase;  // starting angle per world
  attribute vec4 aOrbit;      // r0, angle0, height, seed
  attribute vec2 aCapture;    // world index (-1 = free), capture time
  varying vec3  vColor;
  varying float vAlpha;

  float omega(float r) { return 1.6 * pow(r, -1.5); }

  void main() {
    float r = aOrbit.x, a0 = aOrbit.y, h = aOrbit.z, seed = aOrbit.w;
    float a = a0 + uTime * omega(r);
    vec3 free = vec3(cos(a) * r, h * (0.3 + r * 0.04), sin(a) * r);

    vec3 pos = free;
    float flash = 0.0;
    float captured = 0.0;
    vec3 col = mix(vec3(1.0, 0.86, 0.6), vec3(0.62, 0.74, 1.0), smoothstep(3.0, 14.0, r));
    col = mix(col, vec3(0.55, 0.42, 0.3), step(0.8, fract(seed * 13.7)) * 0.6);

    if (aCapture.x >= 0.0) {
      int k = int(aCapture.x);
      float wr = k == 0 ? uWorldR.x : k == 1 ? uWorldR.y : k == 2 ? uWorldR.z : uWorldR.w;
      float wp = k == 0 ? uWorldPhase.x : k == 1 ? uWorldPhase.y : k == 2 ? uWorldPhase.z : uWorldPhase.w;
      float wa = wp + uTime * omega(wr);
      vec3 world = vec3(cos(wa) * wr, 0.0, sin(wa) * wr);
      // Spiral in: angular catch-up then radial collapse onto the body
      float c = smoothstep(aCapture.y, aCapture.y + 0.05, uProgress);
      captured = c;
      vec3 shell = normalize(vec3(fract(seed * 91.3) - 0.5, fract(seed * 47.1) - 0.5, fract(seed * 23.9) - 0.5) + 1e-3)
                   * (0.18 + 0.32 * fract(seed * 7.3));
      pos = mix(free, world + shell, c * c * (3.0 - 2.0 * c));
      // Collision flash right at the moment of capture
      float dt = (uProgress - aCapture.y - 0.03) / 0.012;
      flash = exp(-dt * dt);
    }

    // Random sparkle of colliding grains
    float tw = pow(fract(sin(seed * 997.0 + floor(uTime * 4.0 + seed * 9.0)) * 43758.5), 60.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (0.7 + fract(seed * 5.1) * 1.4) * (1.0 + flash * 5.0 + tw * 3.0) * (1.0 - captured * 0.45);
    gl_PointSize = min(size * uPixelRatio * (34.0 / -mv.z), (3.5 + flash * 10.0) * uPixelRatio);
    vColor = col + flash * vec3(1.4, 1.1, 0.8) + tw * 0.8;
    vAlpha = (0.22 + 0.4 * fract(seed * 3.3)) * (1.0 - captured * 0.5) + flash * 0.8;
  }
`
const FRAG = /* glsl */`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`

function Disk({ progress }) {
  const low = useStore.getState().performanceLow
  const count = low ? 9000 : 26000
  const phases = useMemo(() => WORLDS.map((_, i) => i * 1.7 + 0.4), [])

  const geometry = useMemo(() => {
    const orbit = new Float32Array(count * 4)
    const capture = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      // Denser toward the star, out to the frost line and beyond
      const r = 2.8 + Math.pow(Math.random(), 0.85) * 13.0
      const seed = Math.random()
      orbit.set([r, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 2.0 * Math.random(), seed], i * 4)
      let w = -1, t = 0
      WORLDS.forEach((world, k) => {
        if (Math.abs(r - world.r) < LANE) { w = k; t = world.start + Math.random() * CAPTURE_SPAN }
      })
      capture.set([w, t], i * 2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 4))
    g.setAttribute('aCapture', new THREE.BufferAttribute(capture, 2))
    return g
  }, [count])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uWorldR: { value: new THREE.Vector4(...WORLDS.map((w) => w.r)) },
    uWorldPhase: { value: new THREE.Vector4(...phases) },
  }), [phases])

  const worldRefs = useRef([])
  const starRef = useRef()

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    uniforms.uProgress.value = damp(uniforms.uProgress.value, progress.current, 5, delta)
    const p = uniforms.uProgress.value

    // Solid bodies grow as their lane is swept up
    WORLDS.forEach((w, k) => {
      const m = worldRefs.current[k]
      if (!m) return
      const a = phases[k] + t * 1.6 * Math.pow(w.r, -1.5)
      m.position.set(Math.cos(a) * w.r, 0, Math.sin(a) * w.r)
      const grown = THREE.MathUtils.smoothstep(p, w.start + 0.02, w.start + CAPTURE_SPAN + 0.05)
      m.scale.setScalar(0.001 + grown * (0.42 + k * 0.04))
    })
    if (starRef.current) starRef.current.scale.setScalar(1 + Math.sin(t * 2.3) * 0.04)

    // Camera: top-down at first, tilting toward the disk plane, slow orbit
    const cam = state.camera
    const tilt = THREE.MathUtils.lerp(1.25, 0.32, p)
    const dist = THREE.MathUtils.lerp(30, 21, p)
    const yaw = -0.6 + p * 1.4 + t * 0.02
    cam.position.set(Math.sin(yaw) * Math.cos(tilt) * dist, Math.sin(tilt) * dist, Math.cos(yaw) * Math.cos(tilt) * dist)
    cam.lookAt(0, 0, 0)
  })

  return (
    <>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms}
          transparent depthWrite={false} {...ADDITIVE} />
      </points>

      {/* Protostar */}
      <group ref={starRef}>
        <mesh>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshBasicMaterial color="#fff6e6" toneMapped={false} />
        </mesh>
        <sprite scale={[7, 7, 1]}>
          <spriteMaterial map={glowTexture()} color="#ffd28a" transparent opacity={0.9}
            {...ADDITIVE} depthWrite={false} toneMapped={false} />
        </sprite>
        <sprite scale={[22, 22, 1]}>
          <spriteMaterial map={glowTexture()} color="#C9A84C" transparent opacity={0.25}
            {...ADDITIVE} depthWrite={false} toneMapped={false} />
        </sprite>
      </group>

      {WORLDS.map((w, k) => (
        <mesh key={k} ref={(m) => (worldRefs.current[k] = m)} scale={0.001}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={w.color} emissive={w.color} emissiveIntensity={0.35} roughness={0.7} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 0]} intensity={60} distance={40} color="#ffe2a8" />
      <ambientLight intensity={0.05} />
    </>
  )
}

// Soft radial glow texture, cached
let _glow = null
export function glowTexture() {
  if (_glow) return _glow
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.2, 'rgba(255,255,255,0.45)')
  grd.addColorStop(0.5, 'rgba(255,255,255,0.1)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 128, 128)
  _glow = new THREE.CanvasTexture(c)
  return _glow
}

export default function Accretion() {
  const ref = useRef(null)
  const { progress, step } = useSectionProgress(ref, { steps: stepsOf(BEATS) })

  return (
    <div className="v-chapter" ref={ref}>
      <div className="v-sticky">
        <div className="v-canvas">
          <VoyageCanvas maxDpr={1.5} gl={{ alpha: true, antialias: false }}
            camera={{ fov: 50, position: [0, 30, 10] }}>
            <Disk progress={progress} />
          </VoyageCanvas>
        </div>
        <Beats beats={BEATS} step={step} />
      </div>
    </div>
  )
}
