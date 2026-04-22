/**
 * NebulaParticles.jsx — Realm 5: The Nebula
 *
 * ARCHITECTURE:
 *   - Geometry pre-filled with nebula positions + colors in useMemo
 *     → visible from frame 1, React StrictMode safe
 *   - Async text extraction populates targetsRef (no geometry writes on init)
 *   - Scroll state machine inline in useEffect (no closure bugs)
 *   - Camera waypoints + mouse parallax in useFrame
 */

import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../../store/useStore'
import { SETTINGS } from '../../../utils/deviceTier'

import {
  extractTextPositions,
  extractManifestoPositions,
  extractSigilPositions,
  generateNebulaPositions,
  generateNebulaColors,
  morphColors
} from './NebulaCoreText'

import { NebulaAudio } from './NebulaAudio'

gsap.registerPlugin(ScrollTrigger)

// ─────────────────────────────────────────────────────────────
// Inline GLSL — avoids any ?raw / assetsInclude ambiguity
// ─────────────────────────────────────────────────────────────

const VERT = /* glsl */`
  // 'position' is automatically provided by ShaderMaterial
  attribute vec3  aTargetPos;
  attribute vec3  aColor;
  attribute float aSize;
  attribute float aPhase;
  attribute vec3  aVelocity;

  uniform float uMorphProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSupernovaProgress;
  uniform float uDebrisDecay;

  varying vec3  vColor;
  varying float vAlpha;

  float easeInOutCubic(float t) {
    return t < 0.5
      ? 4.0 * t * t * t
      : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
  }

  void main() {
    float staggered = clamp(
      (uMorphProgress - aPhase * 0.3) / 0.7,
      0.0, 1.0
    );
    float eased = easeInOutCubic(staggered);

    vec3 pos = mix(position, aTargetPos, eased);

    // Shimmer — alive in nebula state
    float shimmer = sin(uTime * 2.0 + aPhase * 6.28318)
                    * (1.0 - eased) * 0.08;
    pos.x += shimmer;
    pos.y += shimmer * 0.7;

    // Supernova explosion
    if (uSupernovaProgress > 0.0) {
      float sp  = clamp(uSupernovaProgress, 0.0, 1.0);
      vec3  dir = normalize(aVelocity + vec3(0.0, 0.0, 0.35));
      float spd = 2.0 + length(aVelocity) * 8.0;
      float dec = 1.0 - sp * 0.65;
      pos += dir * spd * sp * dec * uDebrisDecay;
    }

    vColor = aColor;

    float baseAlpha = eased * 0.85 + 0.15;
    if (uSupernovaProgress > 0.8) {
      baseAlpha *= 1.0 - (uSupernovaProgress - 0.8) * 2.5;
      baseAlpha  = max(baseAlpha, 0.05);
    }
    vAlpha = clamp(baseAlpha, 0.0, 1.0);

    float sz = aSize * (0.4 + eased * 0.6);
    if (uSupernovaProgress > 0.0) {
      sz += max(0.0, aVelocity.z) * uSupernovaProgress * 10.0;
    }

    vec4 mvPos  = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = clamp(sz * uPixelRatio * (200.0 / max(-mvPos.z, 0.001)), 0.5, 64.0);
    gl_Position  = projectionMatrix * mvPos;
  }
`

const FRAG = /* glsl */`
  varying vec3  vColor;
  varying float vAlpha;

  void main() {
    vec2  uv = gl_PointCoord - 0.5;
    float d  = length(uv);
    if (d > 0.5) discard;

    float alpha = pow(1.0 - d * 2.0, 1.5) * vAlpha;
    float core  = max(0.0, 1.0 - d * 4.0);
    vec3  col   = vColor + core * vColor * 0.6;

    gl_FragColor = vec4(col, alpha * 0.9);
  }
`

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const WAYPOINTS = [
  { s: 0.00, p: [0,  2,   18] },
  { s: 0.15, p: [0,  0,   10] },
  { s: 0.30, p: [-1.5, 1,  9] },
  { s: 0.45, p: [0, -0.5, 11] },
  { s: 0.58, p: [0,  0,    8] },
  { s: 0.72, p: [0,  0,   12] },
  { s: 0.85, p: [0,  0,   30] },
  { s: 1.00, p: [0,  0,   30] },
]

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function NebulaParticles({ containerRef, bloomRef, chromaticRef, onActChange }) {
  const { camera } = useThree()

  const performanceLow = useStore(s => s.performanceLow)

  const COUNT = useMemo(() => SETTINGS.nebulaParticles, [])

  // ─────────────────────────────────────────────────────────
  // GEOMETRY — pre-filled synchronously in useMemo
  // (React StrictMode safe: no disposal in child effects)
  // ─────────────────────────────────────────────────────────
  const geometry = useMemo(() => {
    const nebPos    = generateNebulaPositions(COUNT)        // Float32Array, 3*COUNT
    const nebColors = generateNebulaColors(COUNT)           // Float32Array, 3*COUNT

    const phases    = new Float32Array(COUNT)
    const sizes     = new Float32Array(COUNT)
    const velocity  = new Float32Array(COUNT * 3)

    for (let i = 0; i < COUNT; i++) {
      phases[i] = Math.random()
      sizes[i]  = 1.2 + Math.random() * 2.2
      const theta = Math.random() * Math.PI * 2
      const phi   = Math.acos(2 * Math.random() - 1)
      velocity[i * 3]     = Math.sin(phi) * Math.cos(theta)
      velocity[i * 3 + 1] = Math.sin(phi) * Math.sin(theta)
      velocity[i * 3 + 2] = Math.cos(phi)
    }

    // Target starts equal to nebula home (so uMorphProgress=0 shows nebula)
    const target = new Float32Array(nebPos)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position',    new THREE.BufferAttribute(nebPos,    3))
    geo.setAttribute('aTargetPos',  new THREE.BufferAttribute(target,    3))
    geo.setAttribute('aColor',      new THREE.BufferAttribute(nebColors, 3))
    geo.setAttribute('aSize',       new THREE.BufferAttribute(sizes,     1))
    geo.setAttribute('aPhase',      new THREE.BufferAttribute(phases,    1))
    geo.setAttribute('aVelocity',   new THREE.BufferAttribute(velocity,  3))

    return geo
  }, [COUNT])

  // ─────────────────────────────────────────────────────────
  // MATERIAL — created once, never disposed in child effects
  // ─────────────────────────────────────────────────────────
  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms: {
      uMorphProgress:     { value: 0.0 },
      uTime:              { value: 0.0 },
      uPixelRatio:        { value: performanceLow ? 1 : Math.min(window.devicePixelRatio, 2) },
      uSupernovaProgress: { value: 0.0 },
      uDebrisDecay:       { value: 1.0 }
    },
    transparent: true,
    depthWrite:  false,
    depthTest:   false,
    blending:    THREE.AdditiveBlending
  }), [])

  // ─────────────────────────────────────────────────────────
  // REFS — runtime state (no re-renders)
  // ─────────────────────────────────────────────────────────
  const pointsRef       = useRef()
  const targetsRef      = useRef({ nebula: null })
  const nebulaColorsRef = useRef(null)
  const manifestoPhases = useRef(null)
  const lastTargetKey   = useRef('')
  const currentActRef   = useRef(-1)
  const supernovaFired  = useRef(false)
  const inSigilHold     = useRef(false)
  const sigilRotY       = useRef(0)
  const nebulaRotY      = useRef(0)

  const targetCamPos = useRef(new THREE.Vector3(0, 2, 18))
  const mouseOff     = useRef(new THREE.Vector2(0, 0))
  const mouseTgt     = useRef(new THREE.Vector2(0, 0))

  const audio = useRef(null)

  // ─────────────────────────────────────────────────────────
  // EFFECT — async extraction + scroll trigger
  // (does NOT write to geometry on init — useMemo handles that)
  // ─────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    if (!audio.current) audio.current = new NebulaAudio()

    // Store nebula color reference (for restoring during act 0)
    nebulaColorsRef.current = geometry.getAttribute('aColor').array.slice()
    // Store nebula positions for target switching
    targetsRef.current.nebula = geometry.getAttribute('position').array.slice()

    // ── Helper: update aTargetPos + aColor ───────────────
    function applyTarget(key, colorKey) {
      if (lastTargetKey.current === key) return
      lastTargetKey.current = key

      const tgt = targetsRef.current[key]
      if (!tgt) return // not loaded yet — try again on next scroll update

      const tgtAttr = geometry.getAttribute('aTargetPos')
      tgtAttr.array.set(tgt)
      tgtAttr.needsUpdate = true

      let newColors
      if (colorKey === 'nebula') {
        newColors = nebulaColorsRef.current
      } else {
        newColors = morphColors(COUNT, colorKey)
      }
      const colAttr = geometry.getAttribute('aColor')
      colAttr.array.set(newColors)
      colAttr.needsUpdate = true

      if (key === 'manifesto' && manifestoPhases.current) {
        const phaseAttr = geometry.getAttribute('aPhase')
        phaseAttr.array.set(manifestoPhases.current)
        phaseAttr.needsUpdate = true
      }
    }

    // ── Camera waypoint ──────────────────────────────────
    function setCam(p) {
      let from = WAYPOINTS[0], to = WAYPOINTS[WAYPOINTS.length - 1]
      for (let i = 0; i < WAYPOINTS.length - 1; i++) {
        if (p >= WAYPOINTS[i].s && p <= WAYPOINTS[i + 1].s) {
          from = WAYPOINTS[i]; to = WAYPOINTS[i + 1]; break
        }
      }
      const span = to.s - from.s
      const t    = span > 0 ? (p - from.s) / span : 0
      const eT   = t * t * (3 - 2 * t)
      targetCamPos.current.set(
        THREE.MathUtils.lerp(from.p[0], to.p[0], eT),
        THREE.MathUtils.lerp(from.p[1], to.p[1], eT),
        THREE.MathUtils.lerp(from.p[2], to.p[2], eT)
      )
    }

    // ── Bloom ────────────────────────────────────────────
    function bloom(val) {
      if (bloomRef?.current?.intensity != null) {
        bloomRef.current.intensity = THREE.MathUtils.lerp(bloomRef.current.intensity, val, 0.08)
      }
    }

    // ── SCROLL STATE MACHINE ─────────────────────────────
    function onProgress(p) {
      let act = 0, morphP = 0

      if (p < 0.15) {
        act = 0; morphP = 0
        applyTarget('nebula', 'nebula')
        bloom(0.8); setCam(p)

      } else if (p < 0.22) {
        act = 1; morphP = (p - 0.15) / 0.07
        applyTarget('name', 'name')
        bloom(THREE.MathUtils.lerp(1.4, 1.8, morphP)); setCam(p)

      } else if (p < 0.27) {
        act = 1; morphP = 1.0
        applyTarget('name', 'name')
        bloom(1.8); setCam(p)

      } else if (p < 0.30) {
        act = 1; morphP = 1.0 - (p - 0.27) / 0.03
        applyTarget('name', 'name')
        bloom(1.8); setCam(p)

      } else if (p < 0.37) {
        act = 2; morphP = (p - 0.30) / 0.07
        applyTarget('title', 'title')
        bloom(THREE.MathUtils.lerp(1.4, 1.8, morphP)); setCam(p)

      } else if (p < 0.42) {
        act = 2; morphP = 1.0
        applyTarget('title', 'title')
        bloom(1.8); setCam(p)

      } else if (p < 0.45) {
        act = 2; morphP = 1.0 - (p - 0.42) / 0.03
        applyTarget('title', 'title')
        bloom(1.6); setCam(p)

      } else if (p < 0.51) {
        act = 3; morphP = (p - 0.45) / 0.06
        applyTarget('manifesto', 'manifesto')
        bloom(THREE.MathUtils.lerp(1.6, 2.4, morphP)); setCam(p)

      } else if (p < 0.55) {
        act = 3; morphP = 1.0
        applyTarget('manifesto', 'manifesto')
        bloom(2.4); setCam(p)

      } else if (p < 0.58) {
        act = 3; morphP = 1.0 - (p - 0.55) / 0.03
        applyTarget('manifesto', 'manifesto')
        bloom(2.0); setCam(p)

      } else if (p < 0.63) {
        act = 4
        const lp = (p - 0.58) / 0.05
        morphP = lp < 0.7 ? lp / 0.7 : 1.0 - (lp - 0.7) / 0.3
        applyTarget('word1', 'word1')
        bloom(2.0); setCam(p)

      } else if (p < 0.67) {
        act = 4
        const lp = (p - 0.63) / 0.04
        morphP = lp < 0.6 ? lp / 0.6 : 1.0 - (lp - 0.6) / 0.4
        applyTarget('word2', 'word2')
        bloom(2.0); setCam(p)

      } else if (p < 0.72) {
        act = 4
        const lp = (p - 0.67) / 0.05
        morphP = lp < 0.6 ? lp / 0.6 : 1.0 - (lp - 0.6) / 0.4
        applyTarget('word3', 'word3')
        bloom(2.0); setCam(p)

      } else if (p < 0.77) {
        act = 5; morphP = (p - 0.72) / 0.05
        inSigilHold.current = false
        applyTarget('sigil', 'sigil')
        bloom(THREE.MathUtils.lerp(1.8, 2.2, morphP)); setCam(p)

      } else if (p < 0.83) {
        act = 5; morphP = 1.0
        inSigilHold.current = true
        applyTarget('sigil', 'sigil')
        bloom(2.2); setCam(p)

      } else if (p < 0.85) {
        act = 5; morphP = 1.0
        inSigilHold.current = false
        bloom(THREE.MathUtils.lerp(2.2, 3.0, (p - 0.83) / 0.02)); setCam(p)

      } else if (p < 0.90) {
        act = 6
        const sp = (p - 0.85) / 0.05
        if (!supernovaFired.current) {
          supernovaFired.current = true
          audio.current?.triggerSupernova()
          if (chromaticRef?.current) {
            chromaticRef.current.offset.set(0.003, 0.003)
            setTimeout(() => { chromaticRef.current?.offset.set(0.0005, 0.0005) }, 300)
          }
        }
        material.uniforms.uSupernovaProgress.value = sp
        material.uniforms.uDebrisDecay.value       = 1.0
        material.uniforms.uMorphProgress.value     = 0
        bloom(THREE.MathUtils.lerp(3.0, 1.2, sp)); setCam(p)
        if (act !== currentActRef.current) { currentActRef.current = act; onActChange?.(act) }
        return

      } else if (p < 0.96) {
        act = 6
        const dp = (p - 0.90) / 0.06
        material.uniforms.uSupernovaProgress.value = 1.0
        material.uniforms.uDebrisDecay.value       = Math.max(0.05, 1.0 - dp * 0.9)
        material.uniforms.uMorphProgress.value     = 0
        bloom(THREE.MathUtils.lerp(1.2, 0.8, dp)); setCam(p)
        if (act !== currentActRef.current) { currentActRef.current = act; onActChange?.(act) }
        return

        act = 7
        material.uniforms.uSupernovaProgress.value = 1.0
        material.uniforms.uDebrisDecay.value       = 0.04
        material.uniforms.uMorphProgress.value     = 0
        bloom(0.8); setCam(p)
        if (act !== currentActRef.current) { currentActRef.current = act; onActChange?.(act) }
        return
      }

      if (act !== currentActRef.current) {
        currentActRef.current = act
        if (act >= 1 && act <= 5) {
          if (!audio.current?.initialized) initAudio()
          audio.current?.triggerMorph(act)
        }
        onActChange?.(act)
      }

      material.uniforms.uMorphProgress.value     = Math.max(0, Math.min(1, morphP))
      material.uniforms.uSupernovaProgress.value = 0
      material.uniforms.uDebrisDecay.value       = 1.0
    }

    // ── ScrollTrigger ─────────────────────────────────────
    let st = null
    if (containerRef?.current) {
      st = ScrollTrigger.create({
        trigger: containerRef.current,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   1.5,
        onUpdate: (self) => { if (!cancelled) onProgress(self.progress) }
      })
    }

    // ── Mouse ─────────────────────────────────────────────
    const onMouse = (e) => {
      mouseTgt.current.set(
        (e.clientX / window.innerWidth  - 0.5) * 2,
       -(e.clientY / window.innerHeight - 0.5) * 2
      )
    }
    window.addEventListener('mousemove', onMouse)

    // Audio init is now handled contextually in onProgress to avoid global buzz
    const initAudio = async () => {
      if (audio.current && !audio.current.initialized) {
        await audio.current.init().catch(() => {})
      }
    }

    // ── Async text extraction ─────────────────────────────
    ;(async () => {
      try {
        targetsRef.current.name = await extractTextPositions(
          'NITESH VARMA', 'Bebas Neue', 280, COUNT, 1400, 400)
        if (cancelled) return

        targetsRef.current.title = await extractTextPositions(
          'PRODUCT MANAGER', 'Bebas Neue', 200, COUNT, 1400, 400)
        if (cancelled) return

        const mf = await extractManifestoPositions(
          'I BUILD WORLDS FROM NOTHING', 'Bebas Neue', 160, COUNT, 1800, 360)
        if (cancelled) return
        targetsRef.current.manifesto = mf.positions
        manifestoPhases.current      = mf.phases

        targetsRef.current.word1 = await extractTextPositions(
          'BUILDER', 'Bebas Neue', 220, COUNT, 1400, 400)
        if (cancelled) return
        targetsRef.current.word2 = await extractTextPositions(
          'SYSTEMS', 'Bebas Neue', 220, COUNT, 1400, 400)
        if (cancelled) return
        targetsRef.current.word3 = await extractTextPositions(
          'HUMAN', 'Bebas Neue', 220, COUNT, 1400, 400)
        if (cancelled) return

        targetsRef.current.sigil = extractSigilPositions(COUNT)
      } catch (err) {
        console.warn('[NebulaParticles] extraction error:', err)
      }
    })()

    return () => {
      cancelled = true
      window.removeEventListener('mousemove', onMouse)
      document.removeEventListener('click',  initAudio)
      document.removeEventListener('scroll', initAudio)
      st?.kill()
      audio.current?.destroy()
      audio.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [COUNT, geometry, material])

  // ── USE FRAME ─────────────────────────────────────────────
  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.getElapsedTime()

    // Mouse parallax
    mouseOff.current.x = THREE.MathUtils.lerp(mouseOff.current.x, mouseTgt.current.x * 0.3, 0.03)
    mouseOff.current.y = THREE.MathUtils.lerp(mouseOff.current.y, mouseTgt.current.y * 0.3, 0.03)

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamPos.current.x + mouseOff.current.x, 0.04)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCamPos.current.y + mouseOff.current.y, 0.04)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamPos.current.z, 0.04)
    camera.lookAt(0, 0, 0)

    if (!pointsRef.current) return

    if (inSigilHold.current) {
      sigilRotY.current      += 0.002
      pointsRef.current.rotation.y = sigilRotY.current
    } else if (material.uniforms.uMorphProgress.value < 0.1) {
      nebulaRotY.current     += 0.000262
      pointsRef.current.rotation.y = nebulaRotY.current
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />
}
