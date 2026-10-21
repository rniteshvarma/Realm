import { Suspense, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, Text } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import VoyageCanvas from '../VoyageCanvas'
import { useSectionProgress, damp } from '../useSectionProgress'
import Beats, { stepsOf } from '../Beats'
import { glowTexture } from './Accretion'
import { LABEL_FONT, LABEL_CHARS } from '../labelFont'
import { ADDITIVE } from '../blend'
import '../voyage.css'

// ═══════════════════════════════════════════════════════════════════════
//  03 · THE RING DIVE — skills
//  A gas giant with four ring bands, one per discipline. The camera dives
//  from orbit to skim the ring plane, threading band by band; skill-tagged
//  ice chunks flare as you pass them.
// ═══════════════════════════════════════════════════════════════════════

const BANDS = [
  { name: 'PRODUCT & STRATEGY', r0: 14.6, r1: 16.4, tint: '#f3e6c8',
    skills: ['0→1 Products', 'Customer Discovery', 'User Research', 'Roadmaps', 'OKRs', 'A/B Testing', 'UX'] },
  { name: 'TECHNICAL', r0: 12.0, r1: 13.8, tint: '#cfe4ff',
    skills: ['LLMs & RAG', 'AI Agents', 'MCP', 'APIs & Data Models', 'AWS / GCP', 'Real-time Analytics', 'React'] },
  { name: 'EXECUTION & GTM', r0: 9.9, r1: 11.3, tint: '#e6c27a',
    skills: ['Go-to-Market', 'Unit Economics', 'Cross-functional Leadership', 'Stakeholders', 'Agile / SAFe'] },
  { name: 'TOOLKIT', r0: 8.0, r1: 9.3, tint: '#bcd7f5',
    skills: ['Cursor', 'Claude', 'Lovable', 'v0', 'Figma', 'Notion', 'JIRA'] },
]

const BEATS = [
  { at: 0.00, side: 'center', kicker: 'T+2017 · WHAT I PICKED UP ALONG THE WAY', title: 'THE RING DIVE', xl: true,
    body: 'Every skill is a fragment of ice in orbit. Small alone. A system together.' },
  { at: 0.14, side: 'left', kicker: 'BAND I · PRODUCT & STRATEGY', title: 'What’s worth building',
    body: 'Discovery, research and the discipline of saying no. The outer ring — everything else orbits inside it.',
    metric: BANDS[0].skills.join(' · ') },
  { at: 0.35, side: 'left', kicker: 'BAND II · TECHNICAL', title: 'Close to the metal',
    body: 'LLMs, RAG, agents, APIs, cloud. Technical enough to argue system design with the people who build it.',
    metric: BANDS[1].skills.join(' · ') },
  { at: 0.56, side: 'left', kicker: 'BAND III · EXECUTION & GTM', title: 'Into the world',
    body: 'Leadership across teams, go-to-market, unit economics. Shipping is a team sport with a scoreboard.',
    metric: BANDS[2].skills.join(' · ') },
  { at: 0.76, side: 'left', kicker: 'BAND IV · TOOLKIT', title: 'Idea to demo in days',
    body: 'The fastest path from a hunch to something a customer can actually touch.',
    metric: BANDS[3].skills.join(' · ') },
  { at: 0.93, side: 'low', kicker: 'RING PLANE CLEARED', title: 'Small fragments. One system.' },
]

// Camera keyframes: [progress, orbit radius, height, angle]
const CAM = [
  [0.00, 34, 15, -0.4],
  [0.12, 22, 5,  0.2],
  [0.16, 15.5, 0.55, 0.55],
  [0.34, 15.5, 0.45, 1.55],
  [0.38, 12.9, 0.5, 1.75],
  [0.55, 12.9, 0.45, 2.75],
  [0.59, 10.6, 0.5, 2.95],
  [0.75, 10.6, 0.45, 3.9],
  [0.79, 8.65, 0.5, 4.1],
  [0.92, 8.65, 0.45, 5.0],
  [1.00, 26, 9,   5.6],
]
// Where (angle) each band's skills sit along the flight path
const BAND_SPAN = [[0.75, 1.5], [1.95, 2.7], [3.15, 3.85], [4.3, 4.95]]

function sampleCam(p) {
  let i = 0
  while (i < CAM.length - 2 && p > CAM[i + 1][0]) i++
  const a = CAM[i], b = CAM[i + 1]
  const t = THREE.MathUtils.smoothstep(p, a[0], b[0])
  return [1, 2, 3].map((k) => THREE.MathUtils.lerp(a[k], b[k], t))
}

const PLANET_VERT = /* glsl */`
  varying vec3 vN; varying vec3 vP; varying vec3 vW;
  void main() {
    vN = normalize(normalMatrix * normal);
    vP = position;
    vW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const PLANET_FRAG = /* glsl */`
  uniform float uTime;
  uniform vec3 uSun;
  varying vec3 vN; varying vec3 vP; varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.1; a *= 0.5; } return v; }
  void main() {
    vec3 n = normalize(vP);
    float lat = n.y;
    float lon = atan(n.z, n.x);
    float turb = fbm(vec2(lon * 2.0 + uTime * 0.02, lat * 9.0));
    float bands = sin(lat * 26.0 + turb * 3.2) * 0.5 + 0.5;
    vec3 c1 = vec3(0.93, 0.83, 0.62), c2 = vec3(0.66, 0.5, 0.32), c3 = vec3(0.98, 0.94, 0.85);
    vec3 col = mix(c2, c1, bands);
    col = mix(col, c3, smoothstep(0.75, 0.95, fbm(vec2(lon * 4.0, lat * 20.0) + uTime * 0.03)) * 0.4);
    // Storm
    float storm = smoothstep(0.16, 0.0, length(vec2((lon - 0.6) * 0.6, lat + 0.22)));
    col = mix(col, vec3(0.82, 0.42, 0.24), storm * 0.7);
    float diff = clamp(dot(normalize(vN), normalize(uSun)), 0.0, 1.0);
    float rim = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vW))), 3.0);
    vec3 lit = col * (0.04 + diff * 1.05) + vec3(1.0, 0.85, 0.55) * rim * 0.35 * (0.3 + diff);
    gl_FragColor = vec4(lit, 1.0);
  }
`

const DUST_VERT = /* glsl */`
  uniform float uTime; uniform float uPixelRatio;
  attribute vec3 aRing; // radius, angle, seed
  attribute vec3 aColor;
  varying vec3 vColor; varying float vA;
  void main() {
    float r = aRing.x;
    float a = aRing.y + uTime * 2.2 * pow(r, -1.5);
    vec3 p = vec3(cos(a) * r, (fract(aRing.z * 37.0) - 0.5) * 0.08, sin(a) * r);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min((0.6 + fract(aRing.z * 13.0)) * uPixelRatio * (18.0 / -mv.z), 4.0 * uPixelRatio);
    vColor = aColor;
    vA = 0.35 + 0.5 * fract(aRing.z * 7.0);
  }
`
const DUST_FRAG = /* glsl */`
  varying vec3 vColor; varying float vA;
  void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d) * vA); }
`

function Rings({ low }) {
  const dust = useMemo(() => {
    const count = low ? 16000 : 52000
    const ring = new Float32Array(count * 3)
    const color = new Float32Array(count * 3)
    const c = new THREE.Color()
    for (let i = 0; i < count; i++) {
      const b = BANDS[(Math.random() * BANDS.length) | 0]
      // Uneven density inside a band — ringlets
      let r = b.r0 + Math.random() * (b.r1 - b.r0)
      r += Math.sin(r * 9.0) * 0.06
      ring.set([r, Math.random() * Math.PI * 2, Math.random()], i * 3)
      c.set(b.tint).multiplyScalar(0.55 + Math.random() * 0.45)
      color.set([c.r, c.g, c.b], i * 3)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    g.setAttribute('aRing', new THREE.BufferAttribute(ring, 3))
    g.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
    return g
  }, [low])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
  }), [])

  // Ice chunks: one InstancedMesh per band, each band turning at its own rate
  const chunkGeo = useMemo(() => new THREE.IcosahedronGeometry(1, 0), [])
  const bandRefs = useRef([])
  const bandMeshes = useMemo(() => BANDS.map((b) => {
    const n = low ? 160 : 520
    const mats = []
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3()
    for (let i = 0; i < n; i++) {
      const r = b.r0 + Math.random() * (b.r1 - b.r0)
      const a = Math.random() * Math.PI * 2
      p.set(Math.cos(a) * r, (Math.random() - 0.5) * 0.25, Math.sin(a) * r)
      q.setFromEuler(new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6))
      const k = 0.02 + Math.pow(Math.random(), 4) * 0.11
      s.set(k, k * (0.6 + Math.random() * 0.8), k)
      mats.push(m.compose(p, q, s).clone())
    }
    return mats
  }), [low])

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime
    bandRefs.current.forEach((g, i) => {
      if (g) g.rotation.y += delta * 2.2 * Math.pow((BANDS[i].r0 + BANDS[i].r1) / 2, -1.5)
    })
  })

  return (
    <>
      <points geometry={dust} frustumCulled={false}>
        <shaderMaterial vertexShader={DUST_VERT} fragmentShader={DUST_FRAG} uniforms={uniforms}
          transparent depthWrite={false} {...ADDITIVE} />
      </points>
      {BANDS.map((b, i) => (
        <group key={b.name} ref={(g) => (bandRefs.current[i] = g)}>
          <instancedMesh
            args={[chunkGeo, null, bandMeshes[i].length]}
            onUpdate={(mesh) => {
              bandMeshes[i].forEach((mat, k) => mesh.setMatrixAt(k, mat))
              mesh.instanceMatrix.needsUpdate = true
            }}
          >
            <meshStandardMaterial color={b.tint} roughness={0.55} metalness={0.05} flatShading />
          </instancedMesh>
        </group>
      ))}
    </>
  )
}

// Skill fragments sit on the flight path and flare as the camera passes
function SkillFragments() {
  const items = useMemo(() => BANDS.flatMap((b, bi) => b.skills.map((name, k) => {
    const [a0, a1] = BAND_SPAN[bi]
    const a = a0 + ((k + 0.5) / b.skills.length) * (a1 - a0)
    const r = (b.r0 + b.r1) / 2 + (k % 2 ? 0.55 : -0.55)
    return { name, bi, pos: new THREE.Vector3(Math.cos(a) * r, 0.28 + (k % 3) * 0.1, Math.sin(a) * r) }
  })), [])
  // Explicit refs per piece: { label, glow, core }
  const refs = useRef(items.map(() => ({})))

  useFrame(({ camera }) => {
    items.forEach((it, i) => {
      const { label, glow, core } = refs.current[i]
      const d = camera.position.distanceTo(it.pos)
      // Flare on approach, but fade out right before we fly through it
      const near = 1 - THREE.MathUtils.smoothstep(d, 2.4, 8)
      const tooClose = THREE.MathUtils.smoothstep(d, 0.8, 1.8)
      const a = near * tooClose
      if (label) label.fillOpacity = (0.12 + near * 0.88) * tooClose
      if (glow) { glow.material.opacity = (0.1 + a * 0.7); glow.scale.setScalar(0.3 + a * 0.7) }
      if (core) core.scale.setScalar((0.03 + a * 0.03) * tooClose + 0.001)
    })
  })

  return items.map((it, i) => (
    <group key={it.name} position={it.pos}>
      <Billboard>
        {/* Own Suspense: a label waiting on its font must never hide the scene */}
        <Suspense fallback={null}>
        <Text ref={(m) => { if (refs.current[i]) refs.current[i].label = m }} font={LABEL_FONT} characters={LABEL_CHARS}
          fontSize={0.14} color="#f4f1ea"
          anchorX="center" anchorY="bottom" position={[0, 0.12, 0]}
          letterSpacing={0.12} fillOpacity={0.2} outlineWidth={0.004} outlineColor="#000">
          {it.name.toUpperCase()}
        </Text>
        </Suspense>
        <sprite ref={(m) => { if (refs.current[i]) refs.current[i].glow = m }} scale={0.5}>
          <spriteMaterial map={glowTexture()} color={BANDS[it.bi].tint} transparent opacity={0.2}
            {...ADDITIVE} depthWrite={false} toneMapped={false} />
        </sprite>
        <mesh ref={(m) => { if (refs.current[i]) refs.current[i].core = m }} scale={0.04}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </Billboard>
    </group>
  ))
}

function Scene({ progress }) {
  const low = useStore.getState().performanceLow
  const p = useRef(0)
  const look = useRef(new THREE.Vector3())
  const ahead = useRef(new THREE.Vector3())
  const planetUniforms = useMemo(() => ({
    uTime: { value: 0 }, uSun: { value: new THREE.Vector3(1, 0.35, 0.55) },
  }), [])

  useFrame((state, delta) => {
    p.current = damp(p.current, progress.current, 4, delta)
    planetUniforms.uTime.value = state.clock.elapsedTime
    const [r, y, a] = sampleCam(p.current)
    const cam = state.camera
    cam.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
    // Look ahead along the orbit, slightly inward; up high, look at the planet
    const skim = 1 - THREE.MathUtils.smoothstep(y, 1.2, 6)
    ahead.current.set(Math.cos(a + 0.5) * (r - 0.6), 0.12, Math.sin(a + 0.5) * (r - 0.6)).multiplyScalar(skim)
    look.current.lerp(ahead.current, 1 - Math.exp(-delta * 5))
    cam.lookAt(look.current)
  })

  return (
    <>
      <ambientLight intensity={0.08} />
      <directionalLight position={[30, 10, 18]} intensity={2.2} color="#fff1d6" />
      <mesh>
        <sphereGeometry args={[6, 96, 96]} />
        <shaderMaterial vertexShader={PLANET_VERT} fragmentShader={PLANET_FRAG} uniforms={planetUniforms} />
      </mesh>
      <group rotation={[0.0, 0, 0]}>
        <Rings low={low} />
        <SkillFragments />
      </group>
    </>
  )
}

export default function RingDive() {
  const ref = useRef(null)
  const { progress, step } = useSectionProgress(ref, { steps: stepsOf(BEATS) })

  return (
    <div className="v-chapter" ref={ref}>
      <div className="v-sticky">
        <div className="v-canvas">
          <VoyageCanvas maxDpr={1.5} gl={{ alpha: true, antialias: true }}
            camera={{ fov: 58, near: 0.05, far: 300, position: [0, 15, 34] }}>
            <Scene progress={progress} />
          </VoyageCanvas>
        </div>
        <Beats beats={BEATS} step={step} />
      </div>
    </div>
  )
}
