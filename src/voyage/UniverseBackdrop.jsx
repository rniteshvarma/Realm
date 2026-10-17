import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useStore } from '../store/useStore'
import { getLenis } from '../hooks/useScroll'
import { SETTINGS, HAS_WEBGL, MAX_DPR, PREFERS_REDUCED_MOTION } from '../utils/deviceTier'

// ═══════════════════════════════════════════════════════════════════════
//  UNIVERSE BACKDROP
//  One persistent starfield behind every chapter, so the whole site reads
//  as a single flight. Scroll speed stretches stars into warp streaks; the
//  Big Bang (end of the loading ritual) blasts them outward from a point.
//  Chapters with their own opaque world pause it.
// ═══════════════════════════════════════════════════════════════════════

// Chapters that paint their own full-screen world (backdrop is hidden there)
const OPAQUE_REALMS = new Set([5, 9, 10, 11])

const DEPTH = 400

const VERT = /* glsl */`
  uniform float uTravel;
  uniform float uWarp;
  uniform float uExpand;
  uniform float uPixelRatio;
  attribute float aEnd;      // 0 = star head, 1 = streak tail
  attribute float aSize;
  attribute vec3  aColor;
  varying vec3  vColor;
  varying float vFade;

  void main() {
    vec3 p = position;
    // Endless forward travel: wrap stars through the depth range
    p.z = mod(p.z + uTravel, ${DEPTH.toFixed(1)}) - ${DEPTH.toFixed(1)};
    // Big Bang: everything starts at the singularity and rushes outward
    p.xy *= uExpand;
    // Warp: tail vertex trails behind along the flight axis
    p.z -= aEnd * uWarp * (8.0 + 30.0 * aSize);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(aSize * uPixelRatio * (220.0 / -mv.z), 7.0 * uPixelRatio);

    float depthFade = smoothstep(-${DEPTH.toFixed(1)}, -${(DEPTH * 0.6).toFixed(1)}, p.z);
    vFade = depthFade * mix(1.0, 0.0, aEnd * (1.0 - uWarp * 0.6));
    vColor = aColor;
  }
`

const POINT_FRAG = /* glsl */`
  varying vec3 vColor;
  varying float vFade;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vFade);
  }
`

const LINE_FRAG = /* glsl */`
  uniform float uWarp;
  varying vec3 vColor;
  varying float vFade;
  void main() {
    gl_FragColor = vec4(vColor, vFade * uWarp * 0.9);
  }
`

function buildStars(count) {
  const head = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const color = new Float32Array(count * 3)
  const palette = [
    new THREE.Color('#ffffff'), new THREE.Color('#cfe4ff'),
    new THREE.Color('#ffe7b8'), new THREE.Color('#C9A84C'),
  ]
  for (let i = 0; i < count; i++) {
    // Cylinder around the flight axis, leaving a clear tunnel in the middle
    const r = 6 + Math.pow(Math.random(), 0.6) * 120
    const a = Math.random() * Math.PI * 2
    head[i * 3] = Math.cos(a) * r
    head[i * 3 + 1] = Math.sin(a) * r
    head[i * 3 + 2] = -Math.random() * DEPTH
    size[i] = 0.6 + Math.pow(Math.random(), 4) * 2.6
    const c = palette[Math.random() < 0.82 ? (Math.random() < 0.6 ? 0 : 1) : (Math.random() < 0.7 ? 2 : 3)]
    color.set([c.r, c.g, c.b], i * 3)
  }
  return { head, size, color }
}

export default function UniverseBackdrop() {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!HAS_WEBGL) {
      document.documentElement.classList.add('no-webgl')
      return
    }
    const low = useStore.getState().performanceLow
    const count = low ? 1400 : SETTINGS.starfieldCount * 3

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' })
    } catch {
      document.documentElement.classList.add('no-webgl')
      return
    }
    renderer.domElement.addEventListener('webglcontextlost', (e) => e.preventDefault(), false)
    // Points are tiny; full retina resolution buys nothing but fill-rate
    const dpr = Math.min(MAX_DPR, low ? 1 : 1.25)
    renderer.setPixelRatio(dpr)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 1)
    host.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)

    const { head, size, color } = buildStars(count)
    const uniforms = {
      uTravel: { value: 0 },
      uWarp: { value: 0 },
      uExpand: { value: 0.0001 },
      uPixelRatio: { value: dpr },
    }

    // Star cores
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(head, 3))
    pGeo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    pGeo.setAttribute('aColor', new THREE.BufferAttribute(color, 3))
    pGeo.setAttribute('aEnd', new THREE.BufferAttribute(new Float32Array(count), 1))
    const pMat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: POINT_FRAG, uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const points = new THREE.Points(pGeo, pMat)
    points.frustumCulled = false
    scene.add(points)

    // Warp streaks (head→tail segment per star)
    const lPos = new Float32Array(count * 6)
    const lSize = new Float32Array(count * 2)
    const lColor = new Float32Array(count * 6)
    const lEnd = new Float32Array(count * 2)
    for (let i = 0; i < count; i++) {
      for (let k = 0; k < 2; k++) {
        lPos.set(head.subarray(i * 3, i * 3 + 3), (i * 2 + k) * 3)
        lColor.set(color.subarray(i * 3, i * 3 + 3), (i * 2 + k) * 3)
        lSize[i * 2 + k] = size[i]
        lEnd[i * 2 + k] = k
      }
    }
    const lGeo = new THREE.BufferGeometry()
    lGeo.setAttribute('position', new THREE.BufferAttribute(lPos, 3))
    lGeo.setAttribute('aSize', new THREE.BufferAttribute(lSize, 1))
    lGeo.setAttribute('aColor', new THREE.BufferAttribute(lColor, 3))
    lGeo.setAttribute('aEnd', new THREE.BufferAttribute(lEnd, 1))
    const lMat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: LINE_FRAG, uniforms,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })
    const lines = new THREE.LineSegments(lGeo, lMat)
    lines.frustumCulled = false
    scene.add(lines)

    // Pointer parallax
    const mouse = { x: 0, y: 0 }
    const onMove = (e) => {
      mouse.x = e.clientX / window.innerWidth - 0.5
      mouse.y = e.clientY / window.innerHeight - 0.5
    }
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('resize', onResize)

    let raf = 0
    let last = performance.now()
    let bangStart = null
    let warp = 0
    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now

      const { bigBang, realm } = useStore.getState()
      if (OPAQUE_REALMS.has(realm) || document.hidden) return

      // Big Bang: the visitor touched the Singularity
      if (bigBang && bangStart === null) bangStart = now
      const bangT = bangStart === null ? 0 : Math.min((now - bangStart) / 2600, 1)
      const expand = PREFERS_REDUCED_MOTION ? 1 : 1 - Math.pow(1 - bangT, 4)
      uniforms.uExpand.value = Math.max(0.0001, expand)

      // Scroll speed → warp. The bang itself starts at full warp.
      // Reduced-motion visitors get a calm, still sky.
      const v = PREFERS_REDUCED_MOTION ? 0 : Math.abs(getLenis()?.velocity ?? 0)
      const target = PREFERS_REDUCED_MOTION ? 0 : Math.max(Math.min(v / 45, 1), 1 - bangT)
      warp += (target - warp) * (1 - Math.exp(-6 * dt))
      uniforms.uWarp.value = warp
      uniforms.uTravel.value += dt * (4 + warp * 160)

      camera.position.x += (mouse.x * 3 - camera.position.x) * (1 - Math.exp(-2 * dt))
      camera.position.y += (-mouse.y * 2 - camera.position.y) * (1 - Math.exp(-2 * dt))
      camera.lookAt(0, 0, -100)
      renderer.render(scene, camera)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      pGeo.dispose(); lGeo.dispose(); pMat.dispose(); lMat.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={hostRef} className="universe-backdrop" aria-hidden="true" />
}
