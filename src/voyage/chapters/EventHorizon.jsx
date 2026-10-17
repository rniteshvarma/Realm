import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../store/useStore'
import { getLenis } from '../../hooks/useScroll'
import VoyageCanvas from '../VoyageCanvas'
import heavenEngine from '../../audio/HeavenAudioEngine'
import { damp } from '../useSectionProgress'
import '../voyage.css'
import './EventHorizon.css'

// ═══════════════════════════════════════════════════════════════════════
//  09 · EVENT HORIZON — the turning point
//  The whole sky bends. A black hole grows at the centre and lenses every
//  star (and every world you passed) into an Einstein ring. At the edge,
//  the scroll stops: cross the horizon to go on.
// ═══════════════════════════════════════════════════════════════════════

const LINES = [
  { from: 0.10, to: 0.30, text: 'YOU’VE SEEN THE WORK.' },
  { from: 0.30, to: 0.50, text: 'YOU’VE FELT THE THOUGHT.' },
  { from: 0.50, to: 0.72, text: 'NOW YOU KNOW WHO BUILT THIS.' },
]
const LOCK_AT = 0.9

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`
const FRAG = /* glsl */`
  precision highp float;
  uniform vec2 uRes; uniform float uTime; uniform float uMass; uniform float uFall; uniform vec2 uOffset;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p = p*2.03 + 7.7; a *= 0.5; } return v; }

  vec3 stars(vec2 p, float scale) {
    vec2 g = p * scale; vec2 id = floor(g), f = fract(g) - 0.5;
    float h = hash(id);
    if (h < 0.83) return vec3(0.0);
    vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float d = length(f - o * 0.7);
    vec3 tint = mix(vec3(0.8, 0.88, 1.0), vec3(1.0, 0.86, 0.66), hash(id + 1.3));
    return tint * smoothstep(0.07, 0.0, d) * (h - 0.83) * 7.0;
  }

  // The sky behind the hole: stars, a galactic band, and the worlds you passed
  vec3 sky(vec2 q) {
    vec3 c = stars(q, 30.0) * 1.3 + stars(q + 13.1, 62.0) * 0.9 + stars(q - 5.3, 120.0) * 0.6 + stars(q + 2.2, 220.0) * 0.4;
    float band = exp(-pow((q.y + q.x * 0.35) * 2.2, 2.0));
    float n = fbm(q * 3.0 + vec2(uTime * 0.01, 0.0));
    c += mix(vec3(0.07, 0.1, 0.22), vec3(0.5, 0.34, 0.14), n) * band * n * 1.6;
    // Remembered worlds (gold, ice, teal, blue) — they smear into arcs
    vec2 W[4]; W[0] = vec2(-0.55, 0.22); W[1] = vec2(0.48, -0.18); W[2] = vec2(0.12, 0.42); W[3] = vec2(-0.25, -0.38);
    vec3 C[4]; C[0] = vec3(1.0, 0.8, 0.4); C[1] = vec3(0.75, 0.88, 1.0); C[2] = vec3(0.5, 0.95, 0.85); C[3] = vec3(0.35, 0.55, 1.0);
    for (int i = 0; i < 4; i++) {
      float d = length(q - W[i]);
      c += C[i] * (exp(-d * d * 2600.0) * 1.6 + exp(-d * d * 120.0) * 0.12);
    }
    return c;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec2 c = uOffset * 0.04;
    // Falling in: space spirals and stretches toward the centre
    vec2 d = p - c;
    float r = length(d);
    float swirl = uFall * uFall * 6.0 / (r + 0.15);
    d = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * d;
    d *= 1.0 + uFall * uFall * 4.0;
    r = length(d);

    float thetaE = 0.03 + uMass * 0.2;          // Einstein radius
    float shadow = thetaE * 0.78;               // photon capture radius
    vec2 src = c + d - d * (thetaE * thetaE) / (r * r + 1e-5);
    vec3 col = sky(src);

    // Photon ring + soft glow at the edge of the shadow
    // Thin photon ring, brighter on the approaching side (Doppler beaming)
    float ang = atan(d.y, d.x);
    float beam = 0.35 + 0.65 * pow(0.5 + 0.5 * cos(ang - 2.4 + uTime * 0.05), 2.0);
    float ring = exp(-pow((r - shadow * 1.03) / (0.0025 + thetaE * 0.012), 2.0));
    col += vec3(1.0, 0.86, 0.58) * ring * beam * (0.9 + 0.8 * uMass);
    col += vec3(1.0, 0.75, 0.4) * exp(-pow((r - shadow) / (thetaE * 0.6), 2.0)) * 0.08 * uMass;

    // The horizon itself
    col *= smoothstep(shadow * 0.96, shadow * 1.02, r);

    // Crossing: everything goes white then black
    col = mix(col, vec3(1.0, 0.96, 0.9), smoothstep(0.55, 0.8, uFall) * (1.0 - smoothstep(0.85, 1.0, uFall)));
    col *= 1.0 - smoothstep(0.92, 1.0, uFall);

    float v = smoothstep(1.3, 0.3, length(p));
    gl_FragColor = vec4(col * v, 1.0);
  }
`

function Lens({ progress, fall }) {
  const { size } = useThree()
  const mass = useRef(0)
  const offset = useRef(new THREE.Vector2())
  const uniforms = useMemo(() => ({
    uRes: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uMass: { value: 0 },
    uFall: { value: 0 }, uOffset: { value: new THREE.Vector2() },
  }), [])
  useFrame((state, delta) => {
    uniforms.uRes.value.set(size.width, size.height)
    uniforms.uTime.value = state.clock.elapsedTime
    mass.current = damp(mass.current, THREE.MathUtils.smoothstep(progress.current, 0.02, LOCK_AT), 3, delta)
    uniforms.uMass.value = mass.current
    uniforms.uFall.value = fall.current
    offset.current.lerp(state.pointer, 1 - Math.exp(-delta * 2))
    uniforms.uOffset.value.copy(offset.current)
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  )
}

export default function EventHorizon() {
  const ref = useRef(null)
  const progress = useRef(0)
  const fall = useRef(0)
  // Which text line is showing — changes a handful of times, not per frame
  const [stage, setStage] = useState(-1)
  const stageRef = useRef(-1)
  const introRef = useRef(null)
  const [locked, setLocked] = useState(false)
  const lockedRef = useRef(false)
  const crossedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        progress.current = self.progress
        const pr = self.progress
        if (introRef.current) introRef.current.style.opacity = String(Math.max(0, 1 - pr * 12))
        let sIdx = -1
        LINES.forEach((l, i) => { if (pr >= l.from && pr < l.to) sIdx = i })
        if (pr >= 0.72) sIdx = LINES.length
        if (sIdx !== stageRef.current) { stageRef.current = sIdx; setStage(sIdx) }
        // Already crossed (maybe this chapter was remounted): never lock again
        if (crossedRef.current || useStore.getState().signalShattered) return
        const lenis = getLenis()
        if (self.progress >= LOCK_AT && !lockedRef.current) {
          lockedRef.current = true
          setLocked(true)
          // Don't let a fast fling carry past the edge
          const maxPos = self.start + (self.end - self.start) * LOCK_AT
          if (self.scroll() > maxPos) lenis ? lenis.scrollTo(maxPos, { immediate: true }) : window.scrollTo(0, maxPos)
          lenis?.stop()
        } else if (self.progress < LOCK_AT - 0.05 && lockedRef.current) {
          // Left via the constellation nav — release
          lockedRef.current = false
          setLocked(false)
        }
      },
    })
    // Sync immediately when mounted mid-chapter
    const syncRaf = requestAnimationFrame(() => { st.refresh(); st.vars.onUpdate?.(st) })
    return () => {
      cancelAnimationFrame(syncRaf)
      st.kill()
      // Never leave the page frozen if we unmount while holding the lock
      if (lockedRef.current) getLenis()?.start()
    }
  }, [])

  // Keyboard users: move focus to the horizon when it becomes the only way on
  const crossBtnRef = useRef(null)
  useEffect(() => {
    if (locked) crossBtnRef.current?.focus({ preventScroll: true })
  }, [locked])

  const cross = () => {
    if (!lockedRef.current || crossedRef.current) return
    crossedRef.current = true
    setLocked(false)
    heavenEngine.triggerGlassShatter?.()
    gsap.to(fall, {
      current: 1, duration: 2.4, ease: 'power2.in',
      onComplete: () => {
        useStore.getState().setSignalShattered(true)
        // Let App re-measure with Transcendence unlocked, then arrive there
        const arrive = (tries = 0) => {
          const target = document.querySelector('[data-realm="10"]')
          if (!target || target.offsetHeight === 0) {
            if (tries < 30) requestAnimationFrame(() => arrive(tries + 1))
            return
          }
          ScrollTrigger.refresh()
          const lenis = getLenis()
          lenis?.start()
          const top = target.getBoundingClientRect().top + window.scrollY
          if (lenis) lenis.scrollTo(top, { immediate: true, force: true })
          window.scrollTo(0, top)
          setTimeout(() => { fall.current = 0 }, 400)
        }
        requestAnimationFrame(() => arrive())
      },
    })
  }

  const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cross() } }

  return (
    <div className="v-chapter" ref={ref}>
      <div className="v-sticky">
        <div className="v-canvas">
          <VoyageCanvas maxDpr={1.25} gl={{ alpha: false, antialias: false }} camera={{ position: [0, 0, 1] }}>
            <Lens progress={progress} fall={fall} />
          </VoyageCanvas>
        </div>

        <div className="eh-intro" ref={introRef}>
          <span className="v-kicker">T+? · THE TURNING POINT</span>
          <h2 className="v-title v-title--xl">EVENT HORIZON</h2>
        </div>

        <div className="eh-lines">
          {LINES.map((l, i) => (
            <div key={l.text} className={`eh-line ${stage === i ? 'is-on' : ''}`}>{l.text}</div>
          ))}
          <div className={`eh-line eh-line--gold ${stage === LINES.length && !crossedRef.current ? 'is-on' : ''}`}>COME CLOSER.</div>
        </div>

        <button
          ref={crossBtnRef}
          type="button"
          className={`eh-cross ${locked ? 'is-on' : ''}`}
          onClick={cross}
          onKeyDown={onKey}
          data-cursor="true"
          aria-label="Cross the event horizon"
          tabIndex={locked ? 0 : -1}
        />
        <div className={`eh-prompt ${locked ? 'is-on' : ''}`}>CLICK THE HORIZON TO CROSS</div>
      </div>
    </div>
  )
}
