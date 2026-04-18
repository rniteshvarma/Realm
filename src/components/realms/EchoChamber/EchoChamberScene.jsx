import { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Text } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useStore } from '../../../store/useStore'

import interferenceVert from '../../../gl/shaders/iridescent.vert.glsl?raw'
import interferenceFrag from '../../../gl/shaders/interferenceWave.frag.glsl?raw'

import './EchoChamber.css'

// ── Text fragments floating inside the sphere ─────────────────────────
const THOUGHTS = [
  "the space between decisions is where character lives",
  "systems thinking is just empathy at scale",
  "every constraint is a disguised collaborator",
  "the prototype is the argument",
  "beauty is a function of truth",
  "speed is a design decision",
  "clarity is a form of courage",
  "taste is trained, not given",
  "the work teaches you the work",
  "questions are better tools than answers",
  "design without tension is decoration",
  "restraint is the hardest skill",
  "what you don't show is as important as what you do",
  "the best interface is none at all",
  "build the thing you wish existed",
]

function TextFragment({ text, position, delay }) {
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const basePos = useMemo(() => new THREE.Vector3(...position), [position])
  const vel = useRef(new THREE.Vector3(
    (Math.random() - 0.5) * 0.002,
    (Math.random() - 0.5) * 0.002,
    (Math.random() - 0.5) * 0.001
  ))

  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime + delay

    if (hovered) {
      // Float toward camera
      ref.current.position.lerp(
        new THREE.Vector3(
          basePos.x * 0.4,
          basePos.y * 0.4,
          basePos.z * 0.4
        ), 0.08
      )
      ref.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1)
    } else {
      // Gentle drift and rotation
      ref.current.position.x = basePos.x + Math.sin(t * 0.4) * 2
      ref.current.position.y = basePos.y + Math.cos(t * 0.3) * 1.5
      ref.current.position.z = basePos.z + Math.sin(t * 0.25) * 1
      ref.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
    }
    ref.current.lookAt(state.camera.position)
  })

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={hovered ? 0.7 : 0.5}
      color={hovered ? '#C9A84C' : '#F0F0F0'}
      anchorX="center"
      anchorY="middle"
      maxWidth={8}
      textAlign="center"
      font={undefined}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      fillOpacity={hovered ? 1.0 : 0.55}
    >
      {text}
    </Text>
  )
}

// ── Inner sphere with interference wave shader ─────────────────────────
function InterferenceSphere() {
  const matRef = useRef()
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  }), [])

  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh>
      <sphereGeometry args={[50, 64, 64]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={interferenceVert}
        fragmentShader={interferenceFrag}
        uniforms={uniforms}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// ── Central morphing orb ───────────────────────────────────────────────
function CentralOrb({ onOrbClick }) {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    // Gentle morphing via position & scale oscillation
    meshRef.current.scale.x = 1 + Math.sin(t * 0.7) * 0.08
    meshRef.current.scale.y = 1 + Math.cos(t * 0.5) * 0.06
    meshRef.current.scale.z = 1 + Math.sin(t * 0.9) * 0.07
    meshRef.current.rotation.y += 0.003
    meshRef.current.rotation.x += 0.001
  })

  const handleClick = () => {
    if (clicked) return
    setClicked(true)
    onOrbClick()
    setTimeout(() => setClicked(false), 4000)
  }

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <sphereGeometry args={[1.8, 64, 64]} />
      <meshStandardMaterial
        color={hovered ? '#C9A84C' : '#888'}
        metalness={1.0}
        roughness={0.0}
        envMapIntensity={2}
      />
    </mesh>
  )
}

// ── Camera with mouse parallax ─────────────────────────────────────────
function ParallaxCamera() {
  const { camera } = useThree()
  const mouse = useStore(s => s.mouse)

  useFrame(() => {
    camera.position.x += ((mouse.x - 0.5) * 6 - camera.position.x) * 0.04
    camera.position.y += (-(mouse.y - 0.5) * 4 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ── Main scene ─────────────────────────────────────────────────────────
function EchoScene({ bioVisible }) {
  const fragments = useMemo(() => THOUGHTS.map((text, i) => {
    const phi   = Math.acos(-1 + (2 * i) / THOUGHTS.length)
    const theta = Math.sqrt(THOUGHTS.length * Math.PI) * phi
    const r = 28
    return {
      text,
      position: [
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      ],
      delay: i * 0.5
    }
  }), [])

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={65} />
      <ParallaxCamera />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} color="#C9A84C" intensity={2} distance={30} />
      <pointLight position={[0, 20, -10]} color="#4FABE8" intensity={0.8} />

      <InterferenceSphere />

      <CentralOrb onOrbClick={() => {}} />

      {!bioVisible && fragments.map((f, i) => (
        <TextFragment key={i} text={f.text} position={f.position} delay={f.delay} />
      ))}

      {bioVisible && (
        <Text
          position={[0, 0, 10]}
          fontSize={0.6}
          color="#C9A84C"
          anchorX="center"
          anchorY="middle"
          maxWidth={12}
          textAlign="center"
        >
          {`A creator who believes the act of making\nis itself a form of thinking.\nEvery project is an argument.\nEvery decision, a signal.\nI build to understand — and to be understood.`}
        </Text>
      )}
    </>
  )
}

export default function EchoChamberScene() {
  const containerRef = useRef(null)
  const [bioVisible, setBioVisible] = useState(false)

  const handleOrbClick = () => {
    setBioVisible(true)
    setTimeout(() => setBioVisible(false), 4000)
  }

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    })
    return () => tl.kill()
  }, [])

  return (
    <div className="echo-chamber" ref={containerRef}>
      <div className="echo-header">
        <span className="echo-label">V — ECHO CHAMBER</span>
        <span className="echo-sub">PHILOSOPHY / THINKING / WRITING</span>
      </div>

      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 2]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <EchoScene bioVisible={bioVisible} />
      </Canvas>

      <div className="echo-hint">
        <span>CLICK THE ORB TO HEAR THE FULL SIGNAL</span>
      </div>
    </div>
  )
}
