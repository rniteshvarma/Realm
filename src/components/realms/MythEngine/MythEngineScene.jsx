import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Text, Reflector } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../../store/useStore'
import { sfxEasterEgg, sfxSacredReveal } from '../../../audio/SFXLibrary'

import runeVert from '../../../gl/shaders/iridescent.vert.glsl?raw'
import runeFrag from '../../../gl/shaders/runeEtching.frag.glsl?raw'
import auroraFrag from '../../../gl/shaders/aurora.frag.glsl?raw'
import './MythEngine.css'

// ── 8 influences ──────────────────────────────────────────────────────
const INFLUENCES = [
  { title: 'Dieter Rams',           quote: '"Good design is as little design as possible."',  sub: 'Pioneered functional beauty. Showed me restraint is a power, not a limitation.' },
  { title: 'The Matrix (1999)',      quote: '"There is no spoon."',                           sub: 'A world inside a machine. Made me ask what reality a designer constructs.' },
  { title: 'Naoki Urasawa',         quote: '"Tension lives in the pause."',                  sub: 'Taught me that silence, white space, and waiting are narrative tools.' },
  { title: 'Brutalist Architecture', quote: '"Truth to materials."',                          sub: 'Honesty of structure. What you see IS what holds it together.' },
  { title: 'Richard Feynman',        quote: '"If you can\'t explain it simply, you don\'t understand it."', sub: 'Clarity as the ultimate form of intelligence.' },
  { title: 'Hayao Miyazaki',         quote: '"Always remember to breathe."',                 sub: 'Showed me that wonder is a design principle. The world can always feel alive.' },
  { title: 'Paul Graham',            quote: '"Make something people want."',                  sub: 'Stripped away vanity. Reminded me that the user is the only audience.' },
  { title: 'My Own Curiosity',       quote: '"What if?"',                                    sub: 'The question that started every project worth making.' },
]

// ── Monolith with rune shader ──────────────────────────────────────────
function Monolith({ influence, angle, radius, isActive, onClick }) {
  const meshRef  = useRef()
  const matRef   = useRef()
  const groupRef = useRef()
  const [split, setSplit] = useState(false)
  const [leftHalf, rightHalf] = [useRef(), useRef()]

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uGlow: { value: 0.0 },
    uRuneColor: { value: new THREE.Color('#C9A84C') },
  }), [])

  // Position in circle
  const x = Math.sin(angle) * radius
  const z = Math.cos(angle) * radius

  useFrame((state) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime
    // Smooth glow transition
    const target = isActive ? 1.0 : 0.0
    matRef.current.uniforms.uGlow.value +=
      (target - matRef.current.uniforms.uGlow.value) * 0.06

    // Face inward always
    if (meshRef.current) {
      meshRef.current.lookAt(0, meshRef.current.position.y, 0)
    }
  })

  const handleClick = () => {
    if (split) return
    setSplit(true)
    onClick()
    // Animate split
    gsap.to(leftHalf.current?.position, { x: -1.2, duration: 0.6, ease: 'power2.out' })
    gsap.to(rightHalf.current?.position, { x: 1.2, duration: 0.6, ease: 'power2.out' })
    setTimeout(() => {
      setSplit(false)
      gsap.to(leftHalf.current?.position, { x: 0, duration: 0.5, ease: 'back.out(1.5)' })
      gsap.to(rightHalf.current?.position, { x: 0, duration: 0.5, ease: 'back.out(1.5)' })
    }, 3000)
  }

  return (
    <group ref={meshRef} position={[x, 0, z]} onClick={handleClick}>
      {/* Left half */}
      <group ref={leftHalf} position={[0, 0, 0]}>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[1, 8, 0.6]} />
          <shaderMaterial
            ref={matRef}
            vertexShader={runeVert}
            fragmentShader={runeFrag}
            uniforms={uniforms}
          />
        </mesh>
      </group>
      {/* Right half */}
      <group ref={rightHalf} position={[0, 0, 0]}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[1, 8, 0.6]} />
          <shaderMaterial
            vertexShader={runeVert}
            fragmentShader={runeFrag}
            uniforms={uniforms}
          />
        </mesh>
      </group>

      {/* Label at base */}
      {isActive && (
        <Text
          position={[0, -5, 0.5]}
          fontSize={0.3}
          color="#C9A84C"
          anchorX="center"
          maxWidth={4}
          textAlign="center"
        >
          {influence.title}
        </Text>
      )}
    </group>
  )
}

// ── Metatron's Cube center ─────────────────────────────────────────────
function MetatronCenter({ onClickCube }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.003
    groupRef.current.rotation.x += 0.001
    groupRef.current.rotation.z += 0.0015
  })

  // Build Metatron's Cube from line segments
  const lines = useMemo(() => {
    const r = 2
    const pts = []
    // Outer hexagon
    for (let i = 0; i < 6; i++) {
      const a0 = (i / 6) * Math.PI * 2
      const a1 = ((i + 1) / 6) * Math.PI * 2
      pts.push([r * Math.cos(a0), r * Math.sin(a0), 0, r * Math.cos(a1), r * Math.sin(a1), 0])
    }
    // Inner star of David
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      pts.push([0, 0, 0, r * Math.cos(a), r * Math.sin(a), 0])
    }
    // Triangle 1
    for (let i = 0; i < 3; i++) {
      const a0 = (i / 3) * Math.PI * 2
      const a1 = ((i + 1) / 3) * Math.PI * 2
      pts.push([r * Math.cos(a0), r * Math.sin(a0), 0, r * Math.cos(a1), r * Math.sin(a1), 0])
    }
    // Triangle 2 (inverted)
    for (let i = 0; i < 3; i++) {
      const a0 = (i / 3) * Math.PI * 2 + Math.PI / 3
      const a1 = ((i + 1) / 3) * Math.PI * 2 + Math.PI / 3
      pts.push([r * Math.cos(a0), r * Math.sin(a0), 0, r * Math.cos(a1), r * Math.sin(a1), 0])
    }
    return pts
  }, [])

  return (
    <group
      ref={groupRef}
      position={[0, 1, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClickCube}
    >
      {lines.map((pts, i) => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute([pts[0], pts[1], pts[2], pts[3], pts[4], pts[5]], 3))
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial
              color={hovered ? '#FFFFFF' : '#C9A84C'}
              linewidth={hovered ? 2 : 1}
            />
          </line>
        )
      })}
    </group>
  )
}

// ── Aurora ceiling ─────────────────────────────────────────────────────
function AuroraCeiling() {
  const matRef = useRef()
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  }), [])

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh position={[0, 20, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={runeVert}
        fragmentShader={auroraFrag}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ── Ninth Stone (Egg 3) ────────────────────────────────────────────────
function NinthStone({ visible }) {
  const meshRef = useRef()
  const txtRef  = useRef()

  useEffect(() => {
    if (!meshRef.current) return
    if (visible) {
      gsap.fromTo(meshRef.current.position, { y: -10 }, { y: 0, duration: 1.2, ease: 'power2.out' })
    } else if (meshRef.current.position.y > -9) {
      gsap.to(meshRef.current.position, { y: -12, duration: 1.5, ease: 'power2.in' })
    }
  }, [visible])

  return (
    <group ref={meshRef} position={[0, -12, 0]}>
      <mesh>
        <boxGeometry args={[2, 8, 0.8]} />
        <meshStandardMaterial metalness={1} roughness={0} color="#888" envMapIntensity={3} />
      </mesh>
      {visible && (
        <>
          <Text position={[0, 2, 0.5]} fontSize={0.4} color="#FFFFFF" anchorX="center">
            NITESH VARMA
          </Text>
          <Text position={[0, 1.2, 0.5]} fontSize={0.25} color="#C9A84C" anchorX="center">
            THE NINTH INFLUENCE
          </Text>
          <Text position={[0, 0.4, 0.5]} fontSize={0.2} color="rgba(240,240,240,0.5)" anchorX="center" maxWidth={3} textAlign="center">
            {`YOU BECAME\nWHAT YOU CONSUMED.`}
          </Text>
        </>
      )}
    </group>
  )
}

// ── Scene camera that circles the monoliths on scroll ─────────────────
function CircleCamera({ scrollProgress }) {
  const { camera } = useThree()
  const radius = 14

  useFrame(() => {
    const angle = scrollProgress * Math.PI * 2
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    camera.position.x += (x - camera.position.x) * 0.05
    camera.position.z += (z - camera.position.z) * 0.05
    camera.position.y += (2 - camera.position.y) * 0.05
    camera.lookAt(0, 1, 0)
  })

  return null
}

// ── Main scene content ─────────────────────────────────────────────────
function MythScene({ scrollProgress, activeMonolith, onMonolithClick, ninthVisible, onCubeClick }) {
  const activeIdx = Math.floor(scrollProgress * INFLUENCES.length) % INFLUENCES.length

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 14]} fov={65} />
      <CircleCamera scrollProgress={scrollProgress} />
      <ambientLight intensity={0.1} color="#0D1B2A" />
      <pointLight position={[0, 10, 0]} color="#C9A84C" intensity={2} />
      <spotLight position={[0, 20, 0]} angle={0.8} penumbra={0.5} intensity={1} color="#B44FE8" />
      <fog attach="fog" color="#010208" near={20} far={80} />

      <AuroraCeiling />

      {/* Mirror floor */}
      <Reflector
        position={[0, -4, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        args={[80, 80]}
        mirror={0.7}
        mixBlur={4}
        mixStrength={1}
        blur={[300, 100]}
      >
        {(Material, props) => (
          <Material color="#050505" metalness={0.9} roughness={0.1} {...props} />
        )}
      </Reflector>

      {/* 8 Monoliths in a circle */}
      {INFLUENCES.map((inf, i) => (
        <Monolith
          key={i}
          influence={inf}
          angle={(i / INFLUENCES.length) * Math.PI * 2}
          radius={10}
          isActive={i === activeIdx}
          onClick={() => onMonolithClick(i)}
        />
      ))}

      {/* Metatron's Cube center */}
      <MetatronCenter onClickCube={onCubeClick} />

      {/* Ninth Stone (Egg 3) */}
      <NinthStone visible={ninthVisible} />
    </>
  )
}

export default function MythEngineScene() {
  const containerRef  = useRef(null)
  const [scrollProg, setScrollProg]     = useState(0)
  const [activeMonolith, setActive]     = useState(null)
  const [ninthVisible, setNinth]        = useState(false)
  const discoverEgg = useStore(s => s.discoverEgg)
  const egg3Found = useRef(false)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=400vh',
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => setScrollProg(self.progress),
    })
    return () => trigger.kill()
  }, [])

  const handleCubeClick = () => {
    // Egg 3: THE NINTH STONE
    if (!egg3Found.current) {
      egg3Found.current = true
      discoverEgg('ninth-stone')
      sfxEasterEgg()
    }
    setNinth(true)
    setTimeout(() => setNinth(false), 5500)
  }

  const activeIdx = Math.floor(scrollProg * INFLUENCES.length) % INFLUENCES.length
  const inf = INFLUENCES[activeIdx]

  return (
    <div className="myth-engine" ref={containerRef}>
      <div className="myth-header">
        <span className="myth-label">VII — MYTH ENGINE</span>
        <span className="myth-sub">INFLUENCES / DNA / WHAT MADE ME</span>
      </div>

      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <MythScene
          scrollProgress={scrollProg}
          activeMonolith={activeMonolith}
          onMonolithClick={setActive}
          ninthVisible={ninthVisible}
          onCubeClick={handleCubeClick}
        />
      </Canvas>

      {/* Active monolith detail card */}
      {activeMonolith !== null && (
        <div className="myth-detail-card" onClick={() => setActive(null)}>
          <div className="myth-card-inner">
            <button className="myth-card-close">✕</button>
            <h3 className="myth-card-title">{INFLUENCES[activeMonolith].title}</h3>
            <blockquote className="myth-card-quote">{INFLUENCES[activeMonolith].quote}</blockquote>
            <p className="myth-card-sub">{INFLUENCES[activeMonolith].sub}</p>
          </div>
        </div>
      )}

      {/* Current monolith label */}
      <div className="myth-current">
        <span className="myth-count">{String(activeIdx + 1).padStart(2, '0')} / 08</span>
        <span className="myth-name">{inf.title}</span>
      </div>

      <div className="myth-hint">SCROLL TO WALK THE CIRCLE · CLICK MONOLITH TO OPEN · CLICK CENTER FOR THE MYTH</div>
    </div>
  )
}
