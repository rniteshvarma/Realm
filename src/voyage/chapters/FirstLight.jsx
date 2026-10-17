import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import VoyageCanvas from '../VoyageCanvas'
import { useSectionProgress } from '../useSectionProgress'
import '../voyage.css'
import './FirstLight.css'

// ═══════════════════════════════════════════════════════════════════════
//  01 · FIRST LIGHT — who you are
//  The oldest light in the universe (a Mollweide-projected cosmic
//  microwave background) behind a headline written in starlight. The
//  cursor is an invisible mass: stars bend around it into an Einstein ring.
// ═══════════════════════════════════════════════════════════════════════

const FRAG = /* glsl */`
  precision highp float;
  uniform vec2  uRes;
  uniform vec2  uMouse;     // aspect-corrected, centred
  uniform float uTime;
  uniform float uIntro;     // 0 → 1 after the Big Bang
  uniform float uScroll;    // 0 → 1 as you leave the chapter
  uniform float uLens;      // lens strength (0 on touch / until the pointer moves)
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }

  // One layer of hashed stars
  vec3 stars(vec2 p, float scale, float t) {
    vec2 g = p * scale;
    vec2 id = floor(g), f = fract(g) - 0.5;
    float h = hash(id);
    if (h < 0.86) return vec3(0.0);
    vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float d = length(f - o * 0.7);
    float tw = 0.65 + 0.35 * sin(t * (1.0 + h * 3.0) + h * 40.0);
    float core = smoothstep(0.06, 0.0, d) * tw;
    vec3 tint = mix(vec3(0.82, 0.9, 1.0), vec3(1.0, 0.9, 0.72), hash(id + 1.3));
    return tint * core * (h - 0.86) * 9.0;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    // Flying forward as you scroll away
    p *= 1.0 - uScroll * 0.45;

    // ── Gravitational lens around the cursor (thin-lens mapping) ──
    vec2 d = p - uMouse;
    float r2 = dot(d, d) + 1e-4;
    float thetaE = 0.075 * uLens;
    vec2 src = p - d * (thetaE * thetaE) / r2;
    float ring = exp(-pow((sqrt(r2) - thetaE) / 0.006, 2.0)) * uLens;

    // ── Stars (three depths), sampled through the lens ──
    vec3 col = vec3(0.0);
    col += stars(src, 38.0, uTime) * 0.9;
    col += stars(src + 11.3, 70.0, uTime * 1.3) * 0.6;
    col += stars(src - 4.7, 130.0, uTime * 0.7) * 0.4;

    // ── Cosmic microwave background, Mollweide ellipse ──
    float ang = uTime * 0.012;
    mat2 R = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 q = R * src * vec2(1.0, 1.0);
    vec2 e = p / vec2(0.95, 0.475);              // 2:1 ellipse
    float inside = 1.0 - smoothstep(0.96, 1.0, length(e));
    float rim = smoothstep(0.9, 1.0, length(e)) * inside;
    float n = fbm(q * 7.0 + vec2(uTime * 0.01, 0.0)) * 0.7 + fbm(q * 19.0) * 0.3;
    vec3 cold = vec3(0.05, 0.14, 0.42);
    vec3 warm = vec3(0.86, 0.52, 0.18);
    vec3 cmb = mix(cold, warm, smoothstep(0.32, 0.7, n));
    cmb = mix(cmb, vec3(1.0, 0.86, 0.55), smoothstep(0.72, 0.85, n) * 0.6);
    col += cmb * inside * 0.16 + vec3(0.79, 0.66, 0.3) * rim * 0.12;

    // Einstein ring + faint halo of the invisible mass
    col += vec3(1.0, 0.92, 0.75) * ring * 0.55;

    // Vignette
    float v = smoothstep(1.25, 0.25, length(p * vec2(0.8, 1.0)));
    col *= v;

    float alpha = clamp(uIntro, 0.0, 1.0);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`

const VERT = /* glsl */`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`

function CosmicField({ progress }) {
  const { size } = useThree()
  const mouse = useRef(new THREE.Vector2(0, 0))
  const coarse = useMemo(() => window.matchMedia('(pointer: coarse)').matches, [])
  const uniforms = useMemo(() => ({
    uRes: { value: new THREE.Vector2(1, 1) },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uTime: { value: 0 },
    uIntro: { value: 0 },
    uScroll: { value: 0 },
    uLens: { value: 0 },
  }), [])
  const lensTarget = useRef(0)

  useEffect(() => {
    const onMove = (e) => {
      if (!coarse) lensTarget.current = 1
      const aspect = window.innerWidth / window.innerHeight
      mouse.current.set((e.clientX / window.innerWidth - 0.5) * aspect, 0.5 - e.clientY / window.innerHeight)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state, delta) => {
    uniforms.uRes.value.set(size.width, size.height)
    uniforms.uTime.value = state.clock.elapsedTime
    uniforms.uMouse.value.lerp(mouse.current, 1 - Math.exp(-delta * 8))
    uniforms.uLens.value += (lensTarget.current - uniforms.uLens.value) * (1 - Math.exp(-delta * 3))
    // Fade in behind the Big Bang streaks
    if (useStore.getState().bigBang) uniforms.uIntro.value = Math.min(1, uniforms.uIntro.value + delta / 2.4)
    uniforms.uScroll.value += (progress.current - uniforms.uScroll.value) * (1 - Math.exp(-delta * 6))
  })

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={VERT} fragmentShader={FRAG} uniforms={uniforms}
        transparent depthWrite={false} depthTest={false} />
    </mesh>
  )
}

// Headline "written in starlight": each letter ignites from a point of light
function StarlightLine({ text, delay }) {
  let i = 0
  return (
    <span className="fl-line">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="fl-word">
          {word.split('').map((ch) => {
            const d = delay + (i++) * 0.045
            return <span key={i} className="fl-letter" style={{ animationDelay: `${d}s` }}>{ch}</span>
          })}
        </span>
      ))}
    </span>
  )
}

// Egg 1 · THE FIRST WORD — be still for 12s and a ghost word surfaces in
// the oldest light. Touch or hover it while it's there.
function useGhostWord() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    let t = 0, hide = 0
    const arm = () => {
      clearTimeout(t)
      t = setTimeout(() => {
        setShown(true)
        hide = setTimeout(() => { hide = 0; setShown(false); arm() }, 4500)
      }, 12000)
    }
    const onMove = () => { if (!hide) arm() }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchstart', onMove, { passive: true })
    arm()
    return () => {
      clearTimeout(t); clearTimeout(hide)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchstart', onMove)
    }
  }, [])
  const discover = () => { if (shown) useStore.getState().discoverEgg('patient') }
  return { shown, discover }
}

export default function FirstLight() {
  const ref = useRef(null)
  const contentRef = useRef(null)
  const ghost = useGhostWord()
  const bigBang = useStore((s) => s.bigBang)

  // Text drifts toward the viewer and dissolves as you leave
  const { progress } = useSectionProgress(ref, {
    onUpdate: (p) => {
      const el = contentRef.current
      if (!el) return
      // transform + opacity only: compositor-friendly on every device
      el.style.transform = `translate3d(0, ${-p * 6}vh, 0) scale(${1 + p * 0.35})`
      el.style.opacity = String(Math.max(0, 1 - p * 1.6))
    },
  })

  return (
    <div className="v-chapter first-light" ref={ref}>
      <div className="v-sticky">
        <div className="v-canvas">
          <VoyageCanvas maxDpr={1.25}
            gl={{ alpha: true, antialias: false, premultipliedAlpha: true }}
            camera={{ position: [0, 0, 1] }}
          >
            <CosmicField progress={progress} />
          </VoyageCanvas>
        </div>

        <div className="fl-content" ref={contentRef}>
          {bigBang && (
            <>
              <span className="fl-kicker">◈ FIRST LIGHT · 380,000 YEARS AFTER</span>
              <h1 className="fl-headline">
                <StarlightLine text="I DON'T MANAGE PRODUCTS." delay={1.4} />
                <StarlightLine text="I BUILD WORLDS." delay={2.5} />
              </h1>
              <p className="fl-sub">Product builder · Co-founder · 7 years across two continents</p>
            </>
          )}
        </div>

        <button
          type="button"
          className={`fl-ghost ${ghost.shown ? 'is-on' : ''}`}
          onMouseEnter={ghost.discover}
          onClick={ghost.discover}
          tabIndex={ghost.shown ? 0 : -1}
          aria-hidden={!ghost.shown}
        >
          PATIENT
        </button>

        <div className="v-cue fl-cue">SCROLL · BEGIN THE VOYAGE</div>
      </div>
    </div>
  )
}
