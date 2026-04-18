/**
 * THE FORGE — Realm II
 * A vast dark chamber where skills exist as raw, unstable energies.
 * Complete rebuild per BRIEF 5.md
 */

import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import { getLenis } from '../../../hooks/useScroll'
import './Arsenal.css'

import containmentVert from '../../../gl/shaders/containmentField.vert.glsl?raw'
import containmentFrag from '../../../gl/shaders/containmentField.frag.glsl?raw'
import blobVert from '../../../gl/shaders/forgeBlob.vert.glsl?raw'
import blobFrag from '../../../gl/shaders/forgeBlobFrag.frag.glsl?raw'
import voronoiFrag from '../../../gl/shaders/voronoiSphere.frag.glsl?raw'

// ─── Discipline data ────────────────────────────────────────────────────────
const DISCIPLINES = [
  {
    id: 'design',
    name: 'DESIGN',
    description: 'Building interfaces where every pixel has a reason to exist.',
    depth: '5 years crafting visual systems',
    color: new THREE.Color(0x7B2FBE),     // plasma purple
    baseFreq: 196,  // G3
    position: new THREE.Vector3(-10, -1.5, 4),
    nodeType: 'blob',
    skills: [
      { name: 'UI/UX Design', desc: 'Designing experiences that feel inevitable', level: 'FLUENT', related: ['Design Systems', 'Motion Design'] },
      { name: 'Design Systems', desc: 'Building languages the whole team can speak', level: 'MASTER', related: ['UI/UX Design', 'Typography'] },
      { name: 'Typography', desc: 'Treating type as a first-class design material', level: 'FLUENT', related: ['Design Systems', 'Brand Identity'] },
      { name: 'Motion Design', desc: 'Making transitions that teach the interface', level: 'CAPABLE', related: ['UI/UX Design', 'Design Systems'] },
      { name: 'Brand Identity', desc: 'Giving products a voice they carry everywhere', level: 'CAPABLE', related: ['Typography', 'UI/UX Design'] },
    ],
  },
  {
    id: 'engineering',
    name: 'ENGINEERING',
    description: 'Writing code that performs, scales, and ages well.',
    depth: '6 years building production systems',
    color: new THREE.Color(0x00F5FF),     // neural teal
    baseFreq: 220,  // A3
    position: new THREE.Vector3(10, 2.0, 0),
    nodeType: 'rings',
    skills: [
      { name: 'React', desc: 'Components as the atomic unit of thought', level: 'MASTER', related: ['TypeScript', 'Performance'] },
      { name: 'Three.js', desc: 'Turning math into light people can touch', level: 'FLUENT', related: ['WebGL/GLSL', 'React'] },
      { name: 'WebGL/GLSL', desc: 'Writing directly to the GPU in its own language', level: 'FLUENT', related: ['Three.js', 'Creative Tech'] },
      { name: 'Node.js', desc: 'APIs that communicate what they mean', level: 'FLUENT', related: ['REST APIs', 'TypeScript'] },
      { name: 'TypeScript', desc: 'Types as documentation that never goes stale', level: 'MASTER', related: ['React', 'Node.js'] },
      { name: 'REST APIs', desc: 'Contracts between systems that hold under pressure', level: 'FLUENT', related: ['Node.js', 'Performance'] },
      { name: 'Performance', desc: 'The 60fps imperative — no frame goes wasted', level: 'CAPABLE', related: ['React', 'WebGL/GLSL'] },
    ],
  },
  {
    id: 'creative',
    name: 'CREATIVE TECH',
    description: 'Making code behave like art and art behave like code.',
    depth: '4 years in generative territory',
    color: new THREE.Color(0xC9A84C),     // gold
    baseFreq: 246.94, // B3
    position: new THREE.Vector3(0, 5.0, -8),
    nodeType: 'fractal',
    skills: [
      { name: 'Generative Art', desc: 'Algorithms that make decisions I would not', level: 'FLUENT', related: ['WebGL/GLSL', 'Creative Coding'] },
      { name: 'WebGL Shaders', desc: 'Painting with math on silicon canvases', level: 'FLUENT', related: ['Generative Art', 'Real-time 3D'] },
      { name: 'Creative Coding', desc: 'Tools as medium; output as artifact', level: 'MASTER', related: ['Generative Art', 'Interactive Installs'] },
      { name: 'Real-time 3D', desc: 'Worlds that exist only while you watch', level: 'FLUENT', related: ['WebGL Shaders', 'Three.js'] },
      { name: 'Interactive Installs', desc: 'Spaces that respond to presence', level: 'CAPABLE', related: ['Creative Coding', 'Real-time 3D'] },
    ],
  },
  {
    id: 'strategy',
    name: 'STRATEGY',
    description: 'Connecting what users need to what products can become.',
    depth: '4 years thinking in systems',
    color: new THREE.Color(0xF0EDE8),     // ghost white
    baseFreq: 261.63, // C4
    position: new THREE.Vector3(-8, -3.0, -6),
    nodeType: 'voronoi',
    skills: [
      { name: 'Product Thinking', desc: 'Asking what the problem is before solving it', level: 'FLUENT', related: ['User Research', 'Prototyping'] },
      { name: 'User Research', desc: 'Listening for the need behind the request', level: 'CAPABLE', related: ['Product Thinking', 'Workshop Lead'] },
      { name: 'Prototyping', desc: 'Making assumptions tangible before they cost you', level: 'FLUENT', related: ['Product Thinking', 'Creative Direction'] },
      { name: 'Creative Direction', desc: 'Holding the vision while others build', level: 'CAPABLE', related: ['Prototyping', 'Product Thinking'] },
      { name: 'Workshop Lead', desc: 'Designing sessions where alignment actually happens', level: 'CAPABLE', related: ['User Research', 'Creative Direction'] },
    ],
  },
  {
    id: 'craft',
    name: 'CRAFT',
    description: 'The instruments — chosen with care, wielded with precision.',
    depth: 'Sharp tools, daily practice',
    color: new THREE.Color(0xC8A97E),     // amber/silver mix
    baseFreq: 293.66, // D4
    position: new THREE.Vector3(8, -4.0, -4),
    nodeType: 'shards',
    skills: [
      { name: 'Figma', desc: 'Where ideas become decisions become handoffs', level: 'MASTER', related: ['Design Systems', 'Prototyping'] },
      { name: 'Blender', desc: 'Sculpting forms that live in 3D space', level: 'CAPABLE', related: ['Three.js', 'Real-time 3D'] },
      { name: 'GSAP', desc: 'Animation that means something, every frame', level: 'MASTER', related: ['Motion Design', 'React'] },
      { name: 'Git', desc: 'History as a first draft, not an archive', level: 'FLUENT', related: ['Node.js', 'TypeScript'] },
      { name: 'Photoshop', desc: 'Pixel-level decisions when they matter', level: 'FLUENT', related: ['Brand Identity', 'UI/UX Design'] },
      { name: 'Premiere', desc: 'Story told through the cut', level: 'CAPABLE', related: ['Motion Design', 'Creative Direction'] },
    ],
  },
]

// ─── Audio Engine ────────────────────────────────────────────────────────────
function createForgeAudio() {
  let ctx = null
  let masterGain = null
  let ambientOsc = null
  let lfoNode = null

  function init() {
    if (ctx) return
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.0
    masterGain.connect(ctx.destination)
  }

  function startAmbience() {
    init()
    if (ambientOsc) return
    // Sub bass
    ambientOsc = ctx.createOscillator()
    ambientOsc.type = 'sine'
    ambientOsc.frequency.value = 40
    const subGain = ctx.createGain()
    subGain.gain.value = 0.03
    ambientOsc.connect(subGain)
    // LFO breathing
    lfoNode = ctx.createOscillator()
    lfoNode.frequency.value = 0.5
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 0.08
    lfoNode.connect(lfoGain)
    lfoGain.connect(subGain.gain)
    subGain.connect(masterGain)
    ambientOsc.start()
    lfoNode.start()
    masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 2)
  }

  function electricArc() {
    if (!ctx) return
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.08, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 4000
    filter.Q.value = 2.0
    const vol = ctx.createGain()
    vol.gain.value = 0.08
    const pan = ctx.createStereoPanner()
    pan.pan.value = (Math.random() - 0.5)
    src.connect(filter).connect(vol).connect(pan).connect(masterGain)
    src.start()
  }

  function igniteNode(baseFreq) {
    if (!ctx) return
    // Impact
    const imp = ctx.createOscillator()
    imp.type = 'sine'
    imp.frequency.value = 80
    const impGain = ctx.createGain()
    impGain.gain.setValueAtTime(0.25, ctx.currentTime)
    impGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
    imp.connect(impGain).connect(masterGain)
    imp.start(); imp.stop(ctx.currentTime + 0.22)

    // Harmonic ring
    const ratios = [1, 1.5, 2, 3, 4]
    ratios.forEach(r => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = baseFreq * r
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime + 0.02)
      g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.04)
      g.gain.setValueAtTime(0.06, ctx.currentTime + 0.64)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.04)
      osc.connect(g).connect(masterGain)
      osc.start(); osc.stop(ctx.currentTime + 1.1)
    })

    // Shimmer
    const shim = ctx.createOscillator()
    shim.type = 'triangle'
    shim.frequency.value = 2000
    const shimGain = ctx.createGain()
    shimGain.gain.setValueAtTime(0.12, ctx.currentTime)
    shimGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
    const shimFilter = ctx.createBiquadFilter()
    shimFilter.type = 'bandpass'
    shimFilter.frequency.value = 2250
    shimFilter.Q.value = 2
    shim.connect(shimFilter).connect(shimGain).connect(masterGain)
    shim.start(); shim.stop(ctx.currentTime + 0.35)
  }

  function skillHover(baseFreq) {
    if (!ctx) return
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 880 * (1 + (baseFreq / 300 - 0.6) * 0.2)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0.025, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
    osc.connect(g).connect(masterGain)
    osc.start(); osc.stop(ctx.currentTime + 0.05)
  }

  function skillClick() {
    if (!ctx) return
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
    const src = ctx.createBufferSource()
    src.buffer = buf
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 3000
    filter.Q.value = 4.0
    const vol = ctx.createGain()
    vol.gain.value = 0.12
    src.connect(filter).connect(vol).connect(masterGain)
    src.start()
  }

  function triggerConvergence() {
    if (!ctx) return
    DISCIPLINES.forEach((d, i) => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = d.baseFreq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, ctx.currentTime)
      g.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 1.5)
      g.gain.setValueAtTime(0.04, ctx.currentTime + 1.5)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.0)
      osc.connect(g).connect(masterGain)
      osc.start(); osc.stop(ctx.currentTime + 4.1)
    })
    // C7 shimmer
    const shim = ctx.createOscillator()
    shim.type = 'triangle'
    shim.frequency.value = 2093
    const shimG = ctx.createGain()
    shimG.gain.setValueAtTime(0, ctx.currentTime + 1.5)
    shimG.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 2.5)
    shimG.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5)
    shim.connect(shimG).connect(masterGain)
    shim.start(); shim.stop(ctx.currentTime + 4.6)
  }

  function dragNode(freq, velocity) {
    if (!ctx) return null
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq + velocity * 8
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, ctx.currentTime)
    g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.05)
    osc.connect(g).connect(masterGain)
    osc.start()
    return { osc, gain: g }
  }

  function releaseNode(tone) {
    if (!tone || !ctx) return
    tone.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05)
    tone.osc.stop(ctx.currentTime + 0.25)
    // Thwack
    const t = ctx.createOscillator()
    t.frequency.value = 80
    const tg = ctx.createGain()
    tg.gain.setValueAtTime(0.1, ctx.currentTime)
    tg.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
    t.connect(tg).connect(masterGain)
    t.start(); t.stop(ctx.currentTime + 0.12)
  }

  function exitNode(d, stagger) {
    if (!ctx) return
    setTimeout(() => {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(d.baseFreq, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(d.baseFreq * 1.1, ctx.currentTime + 0.4)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.05, ctx.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.connect(g).connect(masterGain)
      osc.start(); osc.stop(ctx.currentTime + 0.45)
    }, stagger)
  }

  function stopAll() {
    if (!ctx) return
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2)
  }

  return { startAmbience, electricArc, igniteNode, skillHover, skillClick, triggerConvergence, dragNode, releaseNode, exitNode, stopAll }
}

// ─── Waveform Proficiency Canvas ────────────────────────────────────────────
function WaveformIndicator({ level }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const tRef = useRef(0)

  const params = useMemo(() => {
    switch (level) {
      case 'MASTER':   return { amp: 18, noise: 0.05, speed: 1.5 }
      case 'FLUENT':   return { amp: 12, noise: 0.2,  speed: 1.2 }
      case 'CAPABLE':  return { amp: 7,  noise: 0.5,  speed: 0.9 }
      case 'LEARNING': return { amp: 3,  noise: 1.0,  speed: 0.7 }
      default:         return { amp: 10, noise: 0.3,  speed: 1.0 }
    }
  }, [level])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width, H = canvas.height
    const draw = () => {
      tRef.current += 0.02
      ctx.clearRect(0, 0, W, H)
      ctx.beginPath()
      ctx.strokeStyle = '#C9A84C'
      ctx.lineWidth = 1.5
      for (let x = 0; x < W; x++) {
        const nx = x / W
        const noise = (Math.random() - 0.5) * params.noise * params.amp
        const y = H / 2 + Math.sin(nx * Math.PI * 4 + tRef.current * params.speed) * params.amp + noise
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [params])

  return <canvas ref={canvasRef} width={120} height={24} style={{ display: 'block' }} />
}

// ─── Skill Tooltip ───────────────────────────────────────────────────────────
function SkillTooltip({ skill, x, y, visible }) {
  return (
    <div
      className={`forge-skill-tooltip ${visible ? 'visible' : ''}`}
      style={{ left: x + 16, top: y - 20 }}
    >
      <div className="forge-tooltip-header">◈ {skill?.name}</div>
      <div className="forge-tooltip-divider" />
      <div className="forge-tooltip-desc">{skill?.desc}</div>
      <div className="forge-tooltip-wave">
        <WaveformIndicator level={skill?.level} />
        <span className="forge-tooltip-level">{skill?.level}</span>
      </div>
    </div>
  )
}

// ─── Spring Physics ──────────────────────────────────────────────────────────
class SpringNode {
  constructor(mesh, homePosition) {
    this.mesh = mesh
    this.home = homePosition.clone()
    this.velocity = new THREE.Vector3()
    this.stiffness = 0.08
    this.damping = 0.75
    this.isDragging = false
  }
  update() {
    if (this.isDragging) return
    const displacement = new THREE.Vector3().subVectors(this.home, this.mesh.position)
    this.velocity.add(displacement.multiplyScalar(this.stiffness))
    this.velocity.multiplyScalar(this.damping)
    this.mesh.position.add(this.velocity)
  }
}

// ─── GPGPU-lite Particle System ──────────────────────────────────────────────
const PARTICLE_COUNT = 3000
function createParticleSystem(scene) {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const velocities = new Float32Array(PARTICLE_COUNT * 3)
  const colors = new Float32Array(PARTICLE_COUNT * 3)

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i*3]   = (Math.random() - 0.5) * 40
    positions[i*3+1] = (Math.random() - 0.5) * 20
    positions[i*3+2] = (Math.random() - 0.5) * 40
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const mat = new THREE.PointsMaterial({
    size: 0.06,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })

  const points = new THREE.Points(geo, mat)
  scene.add(points)

  const teal = new THREE.Color(0x00F5FF)
  const gold = new THREE.Color(0xC9A84C)
  const tmp = new THREE.Color()

  // Curl noise helpers
  function hash(p) {
    let s = Math.sin(p * 127.1) * 43758.5453123
    return s - Math.floor(s)
  }
  function noise1(x, y, z) {
    return (hash(x * 1.1 + y * 31.4 + z * 7.3) - 0.5) * 2
  }
  function curlX(x, y, z, e) {
    return (noise1(x, y+e, z) - noise1(x, y-e, z) -
            noise1(x, y, z+e) + noise1(x, y, z-e)) / (2*e)
  }
  function curlY(x, y, z, e) {
    return (noise1(x, y, z+e) - noise1(x, y, z-e) -
            noise1(x+e, y, z) + noise1(x-e, y, z)) / (2*e)
  }
  function curlZ(x, y, z, e) {
    return (noise1(x+e, y, z) - noise1(x-e, y, z) -
            noise1(x, y+e, z) + noise1(x, y-e, z)) / (2*e)
  }

  let time = 0
  const attractors = Array(5).fill(null).map(() => ({ pos: new THREE.Vector3(), strength: 0 }))

  function update(delta, attrData) {
    time += delta
    attrData.forEach((a, i) => {
      attractors[i].pos.copy(a.pos)
      attractors[i].strength = a.strength
    })

    const posArr = geo.attributes.position.array
    const colArr = geo.attributes.color.array

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i*3, iy = i*3+1, iz = i*3+2
      let px = posArr[ix], py = posArr[iy], pz = posArr[iz]
      const e = 0.1, s = 0.3 + time * 0.08
      let vx = curlX(px*s, py*s, pz*s, e) * 0.02
      let vy = curlY(px*s, py*s, pz*s, e) * 0.02
      let vz = curlZ(px*s, py*s, pz*s, e) * 0.02

      for (let j = 0; j < 5; j++) {
        const dx = attractors[j].pos.x - px
        const dy = attractors[j].pos.y - py
        const dz = attractors[j].pos.z - pz
        const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
        if (dist < 8.0 && attractors[j].strength > 0) {
          const f = (1.0 - dist/8.0) * 0.08 * attractors[j].strength / Math.max(dist, 0.1)
          vx += dx * f; vy += dy * f; vz += dz * f
        }
      }

      velocities[ix] = vx; velocities[iy] = vy; velocities[iz] = vz
      px += vx; py += vy; pz += vz
      // Wrap
      posArr[ix]  = ((px + 20) % 40) - 20
      posArr[iy]  = ((py + 10) % 20) - 10
      posArr[iz]  = ((pz + 20) % 40) - 20

      const speed = Math.sqrt(vx*vx + vy*vy + vz*vz)
      const t2 = Math.min(speed / 0.05, 1)
      tmp.lerpColors(gold, teal, t2)
      colArr[ix] = tmp.r; colArr[iy] = tmp.g; colArr[iz] = tmp.b
    }
    geo.attributes.position.needsUpdate = true
    geo.attributes.color.needsUpdate = true
    return PARTICLE_COUNT
  }

  function dispose() { scene.remove(points); geo.dispose(); mat.dispose() }

  return { points, update, dispose, count: PARTICLE_COUNT }
}

// ─── Fractal Geometry helper ──────────────────────────────────────────────────
function buildFractalGeometry(depth = 2) {
  const verts = []
  function tetra(p0, p1, p2, p3, d) {
    if (d === 0) {
      const ps = [p0, p1, p2, p3]
      const faces = [[0,1,2],[0,1,3],[0,2,3],[1,2,3]]
      faces.forEach(f => f.forEach(fi => { const v = ps[fi]; verts.push(v.x, v.y, v.z) }))
      return
    }
    const m01 = new THREE.Vector3().addVectors(p0, p1).multiplyScalar(0.5)
    const m02 = new THREE.Vector3().addVectors(p0, p2).multiplyScalar(0.5)
    const m03 = new THREE.Vector3().addVectors(p0, p3).multiplyScalar(0.5)
    const m12 = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
    const m13 = new THREE.Vector3().addVectors(p1, p3).multiplyScalar(0.5)
    const m23 = new THREE.Vector3().addVectors(p2, p3).multiplyScalar(0.5)
    tetra(p0, m01, m02, m03, d-1)
    tetra(p1, m01, m12, m13, d-1)
    tetra(p2, m02, m12, m23, d-1)
    tetra(p3, m03, m13, m23, d-1)
  }
  const s = 1.5
  tetra(
    new THREE.Vector3(s, s, s),
    new THREE.Vector3(-s,-s, s),
    new THREE.Vector3(-s, s,-s),
    new THREE.Vector3(s,-s,-s),
    depth
  )
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.computeVertexNormals()
  return geo
}

// ─── THREE Scene Component ───────────────────────────────────────────────────
function ForgeScene({
  scrollProgress, activeNode, onParticleCount,
  visitedNodes, convergenceActive, freeForgActive,
  onNodeActivate, dragEnabled, audioRef
}) {
  const { scene, camera, gl } = useThree()
  const nodeGroupsRef = useRef([])
  const wallsRef = useRef([])
  const wallMatsRef = useRef([])
  const arcLinesRef = useRef([])
  const ceilArcsRef = useRef([])
  const particleSystemRef = useRef(null)
  const connectionArcsRef = useRef([])
  const springsRef = useRef([])
  const draggedRef = useRef(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const pointerRef = useRef(new THREE.Vector2())
  const timeRef = useRef(0)
  const lastArcTime = useRef(0)
  const nodeHomesRef = useRef(DISCIPLINES.map(d => d.position.clone()))
  const nodeScalesRef = useRef(DISCIPLINES.map(() => 1.0))
  const eRef = useRef({ emissive: DISCIPLINES.map(() => 1.0) })
  const targetCamPosRef = useRef(new THREE.Vector3(0, 3, 18))
  const targetLookAtRef = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAtRef = useRef(new THREE.Vector3(0, 0, 0))

  // ── Build scene once ──
  useEffect(() => {
    scene.background = new THREE.Color(0x050810)
    scene.fog = new THREE.FogExp2(0x050810, 0.02)

    // Lighting
    const ambLight = new THREE.AmbientLight(0x111122, 0.3)
    scene.add(ambLight)
    const pointA = new THREE.PointLight(0x00F5FF, 0.5, 30)
    pointA.position.set(0, 8, 0)
    scene.add(pointA)

    // ── Containment walls ──
    const wallConfigs = [
      { pos: [0, 0, -30], rot: [0, 0, 0],           color: [0.0, 0.96, 1.0]   }, // teal  — back
      { pos: [0, 0,  30], rot: [0, Math.PI, 0],     color: [0.63, 0.41, 0.97] }, // violet — front
      { pos: [-30, 0, 0], rot: [0, Math.PI/2, 0],   color: [0.79, 0.66, 0.3]  }, // gold   — left
      { pos: [ 30, 0, 0], rot: [0, -Math.PI/2, 0],  color: [0.94, 0.93, 0.91] }, // ghost  — right
    ]
    wallConfigs.forEach(wc => {
      const geo = new THREE.PlaneGeometry(40, 40, 1, 1)
      const mat = new THREE.ShaderMaterial({
        vertexShader: containmentVert,
        fragmentShader: containmentFrag,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Vector3(...wc.color) },
          uRippleOrigin: { value: new THREE.Vector2(0.5, 0.5) },
          uRippleTime: { value: -99 },
          uPulseSync: { value: 0 },
        },
        transparent: true,
        side: THREE.FrontSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(...wc.pos)
      mesh.rotation.set(...wc.rot)
      scene.add(mesh)
      wallsRef.current.push(mesh)
      wallMatsRef.current.push(mat)
    })

    // ── Obsidian floor ──
    const floorGeo = new THREE.PlaneGeometry(80, 80)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x050810, roughness: 0.1, metalness: 0.9,
      envMapIntensity: 0.4,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -5
    scene.add(floor)
    // ── Shared Sprite Gradient ──
    const gradCanvas = document.createElement('canvas')
    gradCanvas.width = 128
    gradCanvas.height = 128
    const gCtx = gradCanvas.getContext('2d')
    const gradient = gCtx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    gCtx.fillStyle = gradient
    gCtx.fillRect(0, 0, 128, 128)
    const glowTexture = new THREE.CanvasTexture(gradCanvas)

    // ── Forge Nodes ──
    DISCIPLINES.forEach((disc, i) => {
      const group = new THREE.Group()
      group.position.copy(disc.position)
      scene.add(group)

      let coreMesh
      const emissiveColor = disc.color.clone()

      if (disc.nodeType === 'blob') {
        // Icosahedron with custom morph shader
        const geo = new THREE.IcosahedronGeometry(1.5, 4)
        const mat = new THREE.ShaderMaterial({
          vertexShader: blobVert,
          fragmentShader: blobFrag,
          uniforms: {
            uTime: { value: 0 },
            uScale: { value: 1.0 },
            uColor: { value: disc.color },
            uEmissiveIntensity: { value: 0.3 },
          },
        })
        coreMesh = new THREE.Mesh(geo, mat)
        group.add(coreMesh)

      } else if (disc.nodeType === 'rings') {
        // Dark core + nested wireframe rings
        const coreGeo = new THREE.SphereGeometry(0.8, 16, 16)
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x050810, metalness: 1, roughness: 0.2 })
        coreMesh = new THREE.Mesh(coreGeo, coreMat)
        group.add(coreMesh)
        const ringData = [
          { r: 1.4, tube: 0.05, rx: 0, ry: 0, rz: 0, speed: 1.2 },
          { r: 1.8, tube: 0.04, rx: 1, ry: 0, rz: 0, speed: -0.8 },
          { r: 1.3, tube: 0.04, rx: 0, ry: 1, rz: 0, speed: 1.5 },
          { r: 1.6, tube: 0.03, rx: 0.5, ry: 0.5, rz: 0, speed: -1.1 },
        ]
        ringData.forEach(rd => {
          const rGeo = new THREE.TorusGeometry(rd.r, rd.tube, 8, 48)
          const rMat = new THREE.MeshStandardMaterial({
            color: disc.color, emissive: disc.color, emissiveIntensity: 0.8,
            wireframe: true,
          })
          const ring = new THREE.Mesh(rGeo, rMat)
          ring.rotation.set(rd.rx, rd.ry, rd.rz)
          ring.userData.speed = rd.speed
          group.add(ring)
        })

      } else if (disc.nodeType === 'fractal') {
        const geo = buildFractalGeometry(2)
        const mat = new THREE.MeshStandardMaterial({
          color: disc.color, emissive: disc.color, emissiveIntensity: 0.4,
          wireframe: false, side: THREE.DoubleSide,
        })
        coreMesh = new THREE.Mesh(geo, mat)
        group.add(coreMesh)
        // Saturn ring of orbiting particles
        const ringBuf = new Float32Array(80 * 3)
        for (let j = 0; j < 80; j++) {
          const angle = (j / 80) * Math.PI * 2
          const r = 2.5 + Math.random() * 0.5
          ringBuf[j*3] = Math.cos(angle)*r
          ringBuf[j*3+1] = (Math.random()-0.5)*0.2
          ringBuf[j*3+2] = Math.sin(angle)*r
        }
        const rGeo = new THREE.BufferGeometry()
        rGeo.setAttribute('position', new THREE.BufferAttribute(ringBuf, 3))
        const rMat = new THREE.PointsMaterial({ color: disc.color, size: 0.06, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending })
        const rPoints = new THREE.Points(rGeo, rMat)
        group.add(rPoints)

      } else if (disc.nodeType === 'voronoi') {
        const geo = new THREE.SphereGeometry(1.5, 64, 64)
        const mat = new THREE.ShaderMaterial({
          vertexShader: `
            varying vec2 vUv; varying vec3 vNormal;
            void main() { vUv = uv; vNormal = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
          `,
          fragmentShader: voronoiFrag,
          uniforms: {
            uTime: { value: 0 },
            uColor: { value: disc.color },
            uEmissiveIntensity: { value: 0.3 },
          },
        })
        coreMesh = new THREE.Mesh(geo, mat)
        group.add(coreMesh)

      } else if (disc.nodeType === 'shards') {
        // Cluster of different primitives orbiting center
        const shardGeos = [
          new THREE.BoxGeometry(0.4, 0.4, 0.4),
          new THREE.ConeGeometry(0.25, 0.6, 6),
          new THREE.CylinderGeometry(0.15, 0.15, 0.6, 8),
          new THREE.RingGeometry(0.3, 0.5, 12),
          new THREE.OctahedronGeometry(0.35),
        ]
        const shardMat = new THREE.MeshStandardMaterial({ color: disc.color, emissive: disc.color, emissiveIntensity: 0.5 })
        shardGeos.forEach((sg, si) => {
          const shard = new THREE.Mesh(sg, shardMat.clone())
          const angle = (si / shardGeos.length) * Math.PI * 2
          const r = 0.8 + si * 0.25
          shard.position.set(Math.cos(angle)*r, (si-2)*0.3, Math.sin(angle)*r)
          shard.userData.orbitRadius = r
          shard.userData.orbitSpeed = 0.4 + si * 0.1
          shard.userData.orbitAngle = angle
          group.add(shard)
        })
        coreMesh = group.children[0]
      }

      // Halo glow sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: glowTexture,
        color: disc.color,
        transparent: true,
        opacity: 0.35, // bumped slightly to compensate for gradient falloff
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const sprite = new THREE.Sprite(spriteMat)
      sprite.scale.set(6, 6, 1)
      group.add(sprite)
      group.userData.haloMat = spriteMat

      // Skill child particles (hidden until ignition)
      const childGroup = new THREE.Group()
      childGroup.visible = false
      disc.skills.forEach((skill, si) => {
        const dir = new THREE.Vector3(
          (Math.random()-0.5)*2,
          (Math.random()-0.5)*2,
          (Math.random()-0.5)*2
        ).normalize()
        const radius = 5 + Math.random() * 3
        const particleMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 8, 8),
          new THREE.MeshStandardMaterial({ color: disc.color, emissive: disc.color, emissiveIntensity: 1.0 })
        )
        particleMesh.position.copy(dir.multiplyScalar(radius))
        particleMesh.userData.skill = skill
        particleMesh.userData.dir = dir.clone()
        particleMesh.userData.radius = radius
        particleMesh.userData.homePos = particleMesh.position.clone()
        particleMesh.userData.disciplineColor = disc.color
        particleMesh.userData.disciplineBaseFreq = disc.baseFreq
        particleMesh.userData.isSkillParticle = true

        // Gold ring (hidden)
        const ringGeo = new THREE.RingGeometry(0.22, 0.28, 32)
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xC9A84C, transparent: true, opacity: 0,
          side: THREE.DoubleSide, depthWrite: false
        })
        const goldRing = new THREE.Mesh(ringGeo, ringMat)
        goldRing.userData.isGoldRing = true
        particleMesh.add(goldRing)

        childGroup.add(particleMesh)
      })
      group.add(childGroup)
      group.userData.childGroup = childGroup
      group.userData.isNode = true
      group.userData.disciplineIndex = i
      group.userData.disc = disc
      group.userData.ignited = false
      group.userData.emissiveBase = 1.0
      nodeGroupsRef.current.push(group)

      // Spring physics
      const spring = new SpringNode(group, disc.position.clone())
      springsRef.current.push(spring)
    })

    // ── Connection arcs (drawn after ignition, hidden initially) ──
    DISCIPLINES.forEach((_, i) => {
      const ni = (i + 1) % DISCIPLINES.length
      const pts = []
      for (let j = 0; j <= 32; j++) {
        const t = j / 32
        const a = DISCIPLINES[i].position.clone()
        const b = DISCIPLINES[ni].position.clone()
        const mid = a.clone().lerp(b, 0.5)
        mid.y += 2
        pts.push(new THREE.QuadraticBezierCurve3(a, mid, b).getPoint(t))
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({
        color: 0xC9A84C, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const line = new THREE.Line(geo, mat)
      scene.add(line)
      connectionArcsRef.current.push({ line, mat })
    })

    // ── Particle system ──
    particleSystemRef.current = createParticleSystem(scene)

    // Set initial camera
    camera.position.set(0, 2, 12)
    camera.lookAt(0, 0, 0)

    return () => {
      particleSystemRef.current?.dispose()
      scene.clear()
    }
  }, []) // eslint-disable-line

  // ── Frame loop ──
  useFrame((state, delta) => {
    timeRef.current += delta
    const t = timeRef.current
    const sp = scrollProgress.current ?? 0

    // Update containment walls
    wallMatsRef.current.forEach(m => {
      m.uniforms.uTime.value = t
      const convergeSyncVal = convergenceActive.current ? Math.min((t - (convergenceActive.current || t)) / 2, 1) : 0
      m.uniforms.uPulseSync.value = convergeSyncVal
    })

    // Ceiling arcs
    if (t - lastArcTime.current > 0.2 + Math.random() * 0.15) {
      lastArcTime.current = t
      const x1 = (Math.random()-0.5)*30, z1 = (Math.random()-0.5)*30
      const x2 = x1 + (Math.random()-0.5)*8, z2 = z1 + (Math.random()-0.5)*8
      const pts = [new THREE.Vector3(x1, 30, z1), new THREE.Vector3(x2, 30, z2)]
      const geo = new THREE.BufferGeometry().setFromPoints(pts)
      const mat = new THREE.LineBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 1, blending: THREE.AdditiveBlending })
      const arc = new THREE.Line(geo, mat)
      scene.add(arc)
      ceilArcsRef.current.push({ arc, born: t })
      // if (audioRef.current) audioRef.current.electricArc() // Audio disabled per request
    }
    // Remove old ceiling arcs
    ceilArcsRef.current = ceilArcsRef.current.filter(({ arc, born }) => {
      if (t - born > 0.12) { scene.remove(arc); arc.geometry.dispose(); return false }
      return true
    })

    // ── Node animations ──
    const attractorData = DISCIPLINES.map((_, i) => ({
      pos: nodeGroupsRef.current[i]?.position ?? DISCIPLINES[i].position,
      strength: visitedNodes.current?.has(i) ? 0.3 : 0,
    }))

    nodeGroupsRef.current.forEach((group, i) => {
      if (!group) return
      const disc = DISCIPLINES[i]
      const bobY = disc.position.y + Math.sin(t * 0.5 + i * 1.3) * 0.3
      if (!springsRef.current[i].isDragging) {
        group.position.y = bobY
      }

      // Slow drift attract/repel
      const driftPhase = Math.sin(t / 8 + i * 1.2) * 0.3
      if (!springsRef.current[i].isDragging && !freeForgActive.current) {
        group.position.x = disc.position.x + driftPhase * 0.5
      }

      springsRef.current[i].update()

      // Rotate inner rings (engineering node)
      if (disc.nodeType === 'rings') {
        group.children.forEach(child => {
          if (child.userData.speed) child.rotation.z += delta * child.userData.speed
        })
      }
      // Rotate fractal node
      if (disc.nodeType === 'fractal') {
        group.rotation.y += delta * 0.2
        group.rotation.x += delta * 0.05
      }
      // Orbit shards
      if (disc.nodeType === 'shards') {
        group.children.forEach(child => {
          if (child.userData.orbitSpeed != null) {
            child.userData.orbitAngle += delta * child.userData.orbitSpeed
            const r = child.userData.orbitRadius
            child.position.x = Math.cos(child.userData.orbitAngle) * r
            child.position.z = Math.sin(child.userData.orbitAngle) * r
            child.rotation.x += delta
            child.rotation.y += delta * 0.7
          }
        })
      }
      // Blob / voronoi time uniforms
      group.children.forEach(child => {
        if (child.material?.uniforms?.uTime) child.material.uniforms.uTime.value = t
      })

      // Halo glow pulsing
      if (group.userData.haloMat) {
        const baseOpacity = visitedNodes.current?.has(i) ? 0.28 : 0.15
        group.userData.haloMat.opacity = baseOpacity + Math.sin(t * 1.5 + i) * 0.05
      }
    })

    // ── Camera control ──
    const stage1End = 0.20
    const stageBreaks = [0.20, 0.36, 0.52, 0.64, 0.76, 0.88]

    if (sp < stage1End) {
      // Gathering — pull back
      targetCamPosRef.current.set(0, 5, 25)
      targetLookAtRef.current.set(0, 0, 0)
    } else if (sp < 0.88) {
      // Ignition — approach each node
      for (let i = 0; i < 5; i++) {
        const start = stageBreaks[i]
        const end = stageBreaks[i+1]
        if (sp >= start && sp < end) {
          const t2 = (sp - start) / (end - start)
          const disc = DISCIPLINES[i]
          
          targetCamPosRef.current.copy(disc.position).add(new THREE.Vector3(-4, 1.5, 9))
          targetLookAtRef.current.copy(disc.position)

          // Trigger ignition at 15% approach
          if (t2 > 0.15 && !nodeGroupsRef.current[i]?.userData.ignited) {
            nodeGroupsRef.current[i].userData.ignited = true
            onNodeActivate(i)
          }
          break
        }
      }
    } else {
      // Convergence — pull back to overview
      targetCamPosRef.current.set(0, 6, 28)
      targetLookAtRef.current.set(0, 0, 0)
    }

    // Smoothly interpolate camera position and look target
    camera.position.lerp(targetCamPosRef.current, delta * 1.5)
    currentLookAtRef.current.lerp(targetLookAtRef.current, delta * 2.0)
    camera.lookAt(currentLookAtRef.current)

    // Update particles
    if (particleSystemRef.current) {
      const count = particleSystemRef.current.update(delta, attractorData)
      if (onParticleCount) onParticleCount(count)
    }
  })

  // ── Drag pointer events ──
  useEffect(() => {
    const canvas = gl.domElement
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      if (draggedRef.current && freeForgActive.current) {
        const spring = springsRef.current[draggedRef.current.index]
        raycasterRef.current.setFromCamera(pointerRef.current, camera)
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -draggedRef.current.group.position.z)
        const target = new THREE.Vector3()
        raycasterRef.current.ray.intersectPlane(plane, target)
        if (target) draggedRef.current.group.position.set(target.x, target.y, draggedRef.current.group.position.z)
      }
    }
    const onPointerDown = (e) => {
      if (!freeForgActive.current) return
      const rect = canvas.getBoundingClientRect()
      pointerRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      raycasterRef.current.setFromCamera(pointerRef.current, camera)
      const allMeshes = nodeGroupsRef.current.map(g => g).filter(Boolean)
      const hits = raycasterRef.current.intersectObjects(allMeshes, true)
      if (hits.length > 0) {
        let g = hits[0].object
        while (g.parent && !g.userData.isNode) g = g.parent
        if (g.userData.isNode) {
          const idx = g.userData.disciplineIndex
          springsRef.current[idx].isDragging = true
          draggedRef.current = { group: g, index: idx }
          const tone = audioRef.current?.dragNode(DISCIPLINES[idx].baseFreq, 0)
          g.userData.dragTone = tone
        }
      }
    }
    const onPointerUp = () => {
      if (draggedRef.current) {
        const idx = draggedRef.current.index
        springsRef.current[idx].isDragging = false
        audioRef.current?.releaseNode(draggedRef.current.group.userData.dragTone)
        draggedRef.current = null
      }
    }
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointerup', onPointerUp)
    return () => {
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
    }
  }, [gl, camera, freeForgActive]) // eslint-disable-line

  // ── Ignition Effect (called from parent) ──
  useEffect(() => {
    const handleIgnition = (e) => {
      const i = e.detail.index
      const group = nodeGroupsRef.current[i]
      if (!group) return
      const disc = DISCIPLINES[i]

      // Immediate explosion scale
      gsap.to(group.scale, {
        x: 3.0, y: 3.0, z: 3.0, duration: 0.3,
        ease: 'cubic-bezier(0.34,1.56,0.64,1)',
        onComplete: () => {
          gsap.to(group.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.4 })
        }
      })
      // Show child particles
      const childGroup = group.userData.childGroup
      childGroup.visible = true
      childGroup.children.forEach((pm, pi) => {
        const homePos = pm.userData.homePos.clone()
        pm.position.set(0, 0, 0)
        gsap.to(pm.position, {
          x: homePos.x, y: homePos.y, z: homePos.z,
          delay: pi * 0.01, duration: 0.6, ease: 'power2.out'
        })
        // Label fade-in delay handled below as CSS
        pm.userData.labelVisible = true
      })
      // Brighten nearest wall
      if (wallMatsRef.current[0]) {
        gsap.to(wallMatsRef.current[0].uniforms.uPulseSync, { value: 0.5, duration: 0.4, yoyo: true, repeat: 1 })
      }
    }
    window.addEventListener('forge:ignite', handleIgnition)
    return () => window.removeEventListener('forge:ignite', handleIgnition)
  }, [])

  // ── Handle leaving a discipline (retract) ──
  useEffect(() => {
    const handleRetract = (e) => {
      const i = e.detail.index
      const group = nodeGroupsRef.current[i]
      if (!group) return
      const childGroup = group.userData.childGroup
      childGroup.children.forEach((pm, pi) => {
        gsap.to(pm.position, {
          x: 0, y: 0, z: 0,
          delay: pi * 0.008, duration: 0.5, ease: 'power2.in',
          onComplete: () => { if (pi === childGroup.children.length - 1) childGroup.visible = false }
        })
      })
      gsap.to(group.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.6, ease: 'back.out(1.7)' })
      // Permanently brighter
      eRef.current.emissive[i] = 1.8
      group.userData.haloMat && (group.userData.haloMat.opacity = 0.25)

      // Draw connection arc to next node
      if (connectionArcsRef.current[i]) {
        gsap.to(connectionArcsRef.current[i].mat, { opacity: 0.5, duration: 0.8 })
      }
    }
    window.addEventListener('forge:retract', handleRetract)
    return () => window.removeEventListener('forge:retract', handleRetract)
  }, [])

  // ── Convergence ──
  useEffect(() => {
    const handleConvergence = () => {
      const center = new THREE.Vector3(0, 0, 0)
      nodeGroupsRef.current.forEach((group, i) => {
        if (!group) return
        const offset = new THREE.Vector3(
          Math.cos(i / 5 * Math.PI * 2) * 4.5,
          0,
          Math.sin(i / 5 * Math.PI * 2) * 4.5
        )
        gsap.to(group.position, {
          x: center.x + offset.x, y: center.y + offset.y, z: center.z + offset.z,
          duration: 2.5, ease: 'power2.inOut'
        })
        springsRef.current[i].home.copy(center).add(offset)
      })
      connectionArcsRef.current.forEach(({ mat }) => {
        gsap.to(mat, { opacity: 0.8, duration: 1 })
      })
    }

    const handleExit = () => {
      nodeGroupsRef.current.forEach((group, i) => {
        if (!group) return
        gsap.to(group.position, {
          y: 40, duration: 0.8 + i * 0.1, ease: 'power2.in', delay: i * 0.1,
        })
      })
      if (particleSystemRef.current) {
        // Drain upward — done via attractor at ceiling
      }
      wallMatsRef.current.forEach(m => {
        gsap.to(m.uniforms.uPulseSync, { value: 0, duration: 1.2 })
      })
    }

    window.addEventListener('forge:convergence', handleConvergence)
    window.addEventListener('forge:exit', handleExit)
    return () => {
      window.removeEventListener('forge:convergence', handleConvergence)
      window.removeEventListener('forge:exit', handleExit)
    }
  }, [])

  return null
}

// ─── Main Exported Component ──────────────────────────────────────────────────
export default function ArsenalScene() {
  const containerRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const activeNodeRef = useRef(-1)
  const visitedNodesRef = useRef(new Set())
  const convergenceActiveRef = useRef(null)
  const freeForgActiveRef = useRef(false)
  const audioRef = useRef(createForgeAudio())
  const [particleCount, setParticleCount] = useState(0)
  const [activeDisc, setActiveDisc] = useState(null)
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [visitedSet, setVisitedSet] = useState(new Set())
  const [convergenceText, setConvergenceText] = useState({ line1: false, line2: false })
  const [showFreeForge, setShowFreeForge] = useState(false)
  const [showApproachPrompt, setShowApproachPrompt] = useState(false)
  const canvasRef = useRef(null)
  const raycasterRef = useRef(new THREE.Raycaster())
  const pointerNDCRef = useRef(new THREE.Vector2())

  // ── Scroll orchestration ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=6000',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          const sp = self.progress
          scrollProgressRef.current = sp

          // Stage 1 — show approach prompt
          if (sp < 0.2) {
            setShowApproachPrompt(true)
            setActiveDisc(null)
          } else {
            setShowApproachPrompt(false)
          }

          // Stage 2 — per-discipline approach
          const stageBreaks = [0.20, 0.36, 0.52, 0.64, 0.76, 0.88]
          let activeIdx = -1
          for (let i = 0; i < 5; i++) {
            if (sp >= stageBreaks[i] && sp < stageBreaks[i+1]) {
              activeIdx = i
              break
            }
          }
          if (activeIdx !== activeNodeRef.current) {
            // Leaving prev
            if (activeNodeRef.current >= 0) {
              window.dispatchEvent(new CustomEvent('forge:retract', { detail: { index: activeNodeRef.current } }))
            }
            activeNodeRef.current = activeIdx
            if (activeIdx >= 0) {
              setActiveDisc(DISCIPLINES[activeIdx])
            } else {
              setActiveDisc(null)
            }
          }

          // Stage 3 — convergence (only after ALL 5 nodes visited)
          const allVisited = visitedNodesRef.current.size >= 5
          if (sp >= 0.88 && !convergenceActiveRef.current && allVisited) {
            convergenceActiveRef.current = performance.now()
            setActiveDisc(null)          // clear discipline title
            activeNodeRef.current = -1   // reset active track
            window.dispatchEvent(new CustomEvent('forge:convergence'))
            audioRef.current?.triggerConvergence()
            // Text timing — staggered after convergence node movement
            setTimeout(() => setConvergenceText(t => ({ ...t, line1: true })), 2500)
            setTimeout(() => setConvergenceText(t => ({ ...t, line2: true })), 4500)
          }

          // Free Forge stage
          if (sp >= 0.92 && allVisited && !freeForgActiveRef.current) {
            freeForgActiveRef.current = true
            setShowFreeForge(true)
          }

          // Exit
          if (sp >= 0.98) {
            window.dispatchEvent(new CustomEvent('forge:exit'))
          }
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  // ── Ignition trigger ──
  const handleNodeActivate = useCallback((i) => {
    if (visitedNodesRef.current.has(i)) return
    visitedNodesRef.current.add(i)
    setVisitedSet(new Set(visitedNodesRef.current))
    window.dispatchEvent(new CustomEvent('forge:ignite', { detail: { index: i } }))
    audioRef.current?.igniteNode(DISCIPLINES[i].baseFreq)
    // start ambience on first activation
    try { audioRef.current?.startAmbience() } catch(e) {}
  }, [])

  // ── Skill particle hover / click (CSS computed from canvas position) ──
  const handleCanvasMouseMove = useCallback((e) => {
    setTooltipPos({ x: e.clientX, y: e.clientY })
  }, [])

  // Entry ambience on first scroll
  const ambienceStarted = useRef(false)
  useEffect(() => {
    const tryStart = () => {
      if (ambienceStarted.current) return
      ambienceStarted.current = true
      try { audioRef.current?.startAmbience() } catch (e) {}
    }
    document.addEventListener('pointerdown', tryStart, { once: true })
    return () => document.removeEventListener('pointerdown', tryStart)
  }, [])

  // Convergence text animation helper
  const convergenceLine1 = 'YOUR DISCIPLINES DON\'T COMPETE.'
  const convergenceLine2 = 'THEY CONSPIRE.'

  return (
    <div className="forge-container" ref={containerRef}>
      {/* ── THREE Canvas ── */}
      <Canvas
        ref={canvasRef}
        onMouseMove={handleCanvasMouseMove}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={Math.min(window.devicePixelRatio, 2)}
      >
        <ForgeScene
          scrollProgress={scrollProgressRef}
          activeNode={activeNodeRef}
          onParticleCount={setParticleCount}
          visitedNodes={visitedNodesRef}
          convergenceActive={convergenceActiveRef}
          freeForgActive={freeForgActiveRef}
          onNodeActivate={handleNodeActivate}
          dragEnabled={freeForgActiveRef}
          audioRef={audioRef}
        />
      </Canvas>

      {/* ── Persistent UI ── */}
      {/* TOP LEFT — realm label */}
      <div className="forge-realm-label">
        <span className="forge-realm-num">II. THE FORGE</span>
        {activeDisc && (
          <span className="forge-active-disc">
            &#91;&nbsp;{activeDisc.name}&nbsp;&#93; — ACTIVE
          </span>
        )}
      </div>

      {/* BOTTOM LEFT — discipline progress dots */}
      <div className="forge-progress-dots">
        {DISCIPLINES.map((d, i) => (
          <div
            key={d.id}
            className={`forge-dot ${visitedSet.has(i) ? 'visited' : ''} ${activeDisc?.id === d.id ? 'active' : ''}`}
            title={d.name}
          />
        ))}
      </div>

      {/* BOTTOM RIGHT — particle count easter egg */}
      <div className="forge-particle-count">
        PARTICLES: {particleCount.toLocaleString()}
      </div>

      {/* APPROACH PROMPT */}
      {showApproachPrompt && (
        <div className="forge-approach-prompt">
          APPROACH A DISCIPLINE.
        </div>
      )}

      {/* DISCIPLINE TITLE — while active */}
      {activeDisc && (
        <div className="forge-discipline-overlay">
          <h2 className="forge-disc-title">
            {activeDisc.name.split('').map((ch, ci) => (
              <span key={ci} className="forge-letter" style={{ animationDelay: `${ci * 0.06}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </h2>
          <p className="forge-disc-desc">{activeDisc.description}</p>
          <p className="forge-disc-depth">{activeDisc.depth}</p>
        </div>
      )}

      {/* CONVERGENCE TEXT */}
      {convergenceText.line1 && (
        <div className="forge-convergence-text">
          <div className={`forge-conv-line ${convergenceText.line1 ? 'reveal' : ''}`}>
            {convergenceLine1.split('').map((ch, ci) => (
              <span key={ci} className="forge-conv-letter" style={{ animationDelay: `${ci * 0.04}s` }}>
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            ))}
          </div>
          {convergenceText.line2 && (
            <div className="forge-conv-line reveal" style={{ animationDelay: '0.3s' }}>
              {convergenceLine2.split('').map((ch, ci) => (
                <span key={ci} className="forge-conv-letter" style={{ animationDelay: `${ci * 0.06 + 0.3}s` }}>
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FREE FORGE PROMPT */}
      {showFreeForge && (
        <div className="forge-freeforge-prompt">
          DRAG ANYTHING. SEE WHAT HOLDS.
        </div>
      )}

      {/* SKILL TOOLTIP */}
      {hoveredSkill && (
        <SkillTooltip
          skill={hoveredSkill}
          x={tooltipPos.x}
          y={tooltipPos.y}
          visible={!!hoveredSkill}
        />
      )}
    </div>
  )
}
