import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reflector as ThreeReflector } from 'three/examples/jsm/objects/Reflector'

import { useStore } from '../../../store/useStore'
import { getLenis } from '../../../hooks/useScroll'
import heavenEngine from '../../../audio/HeavenAudioEngine'
import { generateShards } from './FractureGenerator'
import { OrigamiCrane, NavigationCompass, CodeFragment } from './Objects'

import mirrorDistortionFrag from '../../../gl/shaders/mirrorDistortion.frag.glsl?raw'
import mirrorDistortionVert from '../../../gl/shaders/mirrorDistortion.vert.glsl?raw'
import './Signal.css'

// ── Floating Dust Particles ──
function GlassDustParticles() {
  const count = 200
  const meshRef = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 4
    }
    return pos
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
        const time = state.clock.elapsedTime
        meshRef.current.rotation.y = time * 0.05
        meshRef.current.position.y = Math.sin(time * 0.2) * 0.5
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#FFFFFF" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

function InnerRoom() {
  return (
    <group>
      {/* Dark Room Walls */}
      <mesh position={[0, 5, -10]}>
        <boxGeometry args={[20, 10, 20]} />
        <meshBasicMaterial color="#080C14" side={THREE.BackSide} />
      </mesh>
      
      {/* Floor Reflector (subtle fogged reflection) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#05080E" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[0, 10, 5]} intensity={0.5} color="#C9A84C" />
      <spotLight 
        position={[0, 10, -6]} 
        target-position={[0, 0, -6]}
        angle={0.4} 
        penumbra={0.8} 
        intensity={2} 
        color="#FFFFFF" 
        distance={20}
      />

      <GlassDustParticles />
    </group>
  )
}

// ── The Mirror Logic ──
function TheLookingGlass({ scrollProgress, shatterTriggered, onMirrorClick }) {
  const groupRef = useRef()
  const mirrorWrapperRef = useRef()
  const shardGroupRef = useRef()
  
  const [shards, setShards] = useState([])
  const [mirrorBroken, setMirrorBroken] = useState(false)
  const hoverState = useRef(false)
  const handPos = useRef(new THREE.Vector2(0.5, 0.45))
  
  const { gl, scene, camera } = useThree()
  
  // Custom Shader for the mirror
  const customMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      tDiffuse: { value: null },
      uClarity: { value: 0 },
      uHandPos: { value: handPos.current },
      uHandIntensity: { value: 0 }
    },
    vertexShader: mirrorDistortionVert,
    fragmentShader: mirrorDistortionFrag,
  }), [])

  // Initialize Three.js Reflector
  useEffect(() => {
    if (!mirrorWrapperRef.current) return
    const geo = new THREE.PlaneGeometry(3, 5)
    
    // Create the raw 3JS Reflector
    const mirror = new ThreeReflector(geo, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * window.devicePixelRatio,
      textureHeight: window.innerHeight * window.devicePixelRatio,
      color: 0x889999
    })
    
    // Hijack its render target texture into our custom shader
    customMaterial.uniforms.tDiffuse.value = mirror.getRenderTarget().texture
    // We bind the reflector's internal uniform updates
    const originalBeforeRender = mirror.onBeforeRender.bind(mirror)
    
    mirror.onBeforeRender = (renderer, scene, camera) => {
        // Run standard reflector update
        originalBeforeRender(renderer, scene, camera)
        // Ensure our material receives texture
        customMaterial.uniforms.tDiffuse.value = mirror.getRenderTarget().texture
    }
    
    mirror.material = customMaterial
    mirrorWrapperRef.current.add(mirror)
    
    return () => {
       mirrorWrapperRef.current?.remove(mirror)
       mirror.dispose()
       geo.dispose()
    }
  }, [customMaterial])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    customMaterial.uniforms.uTime.value = t
    
    // Clarity tied to approach
    // Base clarity 0.0 at 0 scroll -> 1.0 at 0.9 scroll
    const clarity = Math.min(scrollProgress / 0.9, 1.0)
    customMaterial.uniforms.uClarity.value = clarity

    // Handprint intensity triggers at 90%
    if (scrollProgress >= 0.9 && !mirrorBroken) {
        customMaterial.uniforms.uHandIntensity.value += (1.0 - customMaterial.uniforms.uHandIntensity.value) * 0.05
    } else {
        customMaterial.uniforms.uHandIntensity.value += (0.0 - customMaterial.uniforms.uHandIntensity.value) * 0.1
    }
  })

  useEffect(() => {
    if (shatterTriggered && !mirrorBroken) {
       setMirrorBroken(true)
       
       // Hide standard mirror
       if (mirrorWrapperRef.current) {
           mirrorWrapperRef.current.visible = false
       }

       // Generate shards and push to state
       const rawShards = generateShards(3, 5, 6, 8) // 48 shards
       setShards(rawShards)

       // Animate shards
       setTimeout(() => {
           const shardMeshes = shardGroupRef.current?.children || []
           shardMeshes.forEach((mesh) => {
              // Explosion vector based on centroid relative to center
              const cx = mesh.userData.centroid.x
              const cy = mesh.userData.centroid.y
              const force = 1.0 + Math.random() * 2

              gsap.to(mesh.position, {
                  x: mesh.position.x + cx * force,
                  y: mesh.position.y + cy * force - (3 + Math.random()*2), // gravity
                  z: mesh.position.z + (Math.random()*2 + 1), // blast forward toward camera
                  duration: 1.2 + Math.random() * 0.8,
                  ease: 'power3.out'
              })

              gsap.to(mesh.rotation, {
                  x: Math.random() * Math.PI * 4,
                  y: Math.random() * Math.PI * 4,
                  z: Math.random() * Math.PI * 4,
                  duration: 1.5,
                  ease: 'power2.out'
              })

              // Fade out
              gsap.to(mesh.material, {
                  opacity: 0,
                  duration: 1.0,
                  delay: 0.5 + Math.random()*0.5,
                  onComplete: () => {
                      mesh.visible = false
                  }
              })
           })
       }, 50)
    }
  }, [shatterTriggered, mirrorBroken])

  return (
    <group ref={groupRef} position={[0, 2.8, -8]}>
       {/* Intact Mirror Wrapper */}
       <group 
         ref={mirrorWrapperRef} 
         onClick={scrollProgress >= 0.9 ? onMirrorClick : null}
         onPointerOver={() => hoverState.current = true}
         onPointerOut={() => hoverState.current = false}
       />

       {/* Shattered Pieces */}
       {shards.length > 0 && (
         <group ref={shardGroupRef}>
            {shards.map((s, idx) => (
                <mesh 
                  key={idx} 
                  geometry={s.geometry} 
                  position={[s.centroid.x, s.centroid.y, 0]}
                  userData={{ centroid: s.centroid }}
                >
                   {/* Shards hold a static copy of the reflective material */}
                   <primitive object={customMaterial.clone()} attach="material" transparent opacity={0.9} />
                </mesh>
            ))}
         </group>
       )}
    </group>
  )
}

// ── Contact Objects Post-Shatter ──
function EmergedObjects({ visible }) {
    const groupRef = useRef()
    const [hoveredA, setHoverA] = useState(false)
    const [hoveredB, setHoverB] = useState(false)
    const [hoveredC, setHoverC] = useState(false)
    const discoverEgg = useStore(s => s.discoverEgg)
    const compassClicks = useRef(0)

    useEffect(() => {
        if (visible && groupRef.current) {
            gsap.fromTo(groupRef.current.position, 
               { z: -15 }, 
               { z: -5, duration: 4, ease: 'power2.out' }
            )
            gsap.fromTo(groupRef.current,
               { opacity: 0 }, // won't work on group directly without deep traversal, but we can animate scale or just let it fly from dark fog
               { duration: 1 }
            )
        }
    }, [visible])

    const handleHover = (id, state) => {
        if(state) {
            if (id === 'A') heavenEngine.triggerHoverPing(528)
            if (id === 'B') heavenEngine.triggerHoverPing(396)
            if (id === 'C') heavenEngine.triggerHoverPing(639)
        }
        if (id === 'A') setHoverA(state)
        if (id === 'B') setHoverB(state)
        if (id === 'C') setHoverC(state)
    }

    const explodeAndOpen = (url) => {
        // visual explosion placeholder, opens links
        window.open(url, '_blank')
    }

    const handleCompassClick = () => {
        compassClicks.current += 1
        if (compassClicks.current >= 3) {
            discoverEgg('morse') // Triggering Egg 2
            heavenEngine.triggerHoverPing(800) // special high ping
        }
    }

    if (!visible) return null

    return (
        <group ref={groupRef} position={[0, 2.5, -5]}>
           <OrigamiCrane 
             position={[-2.5, 0, 0]} 
             hovered={hoveredA} 
             rotationOffset={Math.PI / 4}
             onClick={() => explodeAndOpen('mailto:rniteshvarma@gmail.com')} 
           />
           {/* Wrap the compass in pointer events */}
           <group 
             onPointerOver={() => handleHover('B', true)}
             onPointerOut={() => handleHover('B', false)}
             onClick={handleCompassClick}
           >
             <NavigationCompass 
               position={[0, 0, 0]} 
               hovered={hoveredB} 
               rotationOffset={0}
             />
           </group>

           {/* Code plane */}
           <group
             onPointerOver={() => handleHover('C', true)}
             onPointerOut={() => handleHover('C', false)}
             onClick={() => explodeAndOpen('https://github.com/rniteshvarma')}
           >
             <CodeFragment 
               position={[2.5, 0, 0]} 
               hovered={hoveredC} 
               rotationOffset={-Math.PI / 4}
             />
           </group>
           
           {/* Same for Crane */}
           <mesh position={[-2.5, 0, 0]} visible={false}
             onPointerOver={() => handleHover('A', true)}
             onPointerOut={() => handleHover('A', false)}
           >
              <sphereGeometry args={[1]} />
              <meshBasicMaterial />
           </mesh>
        </group>
    )
}

// ── Main Scene ──
export default function SignalScene() {
  const containerRef = useRef(null)
  const setCursorState = useStore(s => s.setCursorState)
  
  const [scrollProgress, setScrollProgress] = useState(0)
  const [shattered, setShattered] = useState(false)
  const [objectsVisible, setObjectsVisible] = useState(false)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=400vh',
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress
        setScrollProgress(p)

        const lenis = getLenis()
        if (p >= 0.9 && !shattered) {
            // Prevent fast scrolls from bleeding into the next section before locking
            const maxPos = self.start + (self.end - self.start) * 0.9
            if (self.scroll() > maxPos) {
                if (lenis) {
                    lenis.scrollTo(maxPos, { immediate: true })
                } else {
                    window.scrollTo(0, maxPos)
                }
            }
            // Lock Scroll
            if (lenis) lenis.stop()
            setCursorState('hover-glass') // trigger hand cursor
        }
      }
    })
    return () => trigger.kill()
  }, [setCursorState, shattered])

  const handleShatter = () => {
    if (shattered) return
    setShattered(true)
    setCursorState('default')
    
    // Audio Triggers
    heavenEngine.triggerGlassShatter()
    heavenEngine.postBreakAmbience()

    // Unlock flow
    setTimeout(() => {
        setObjectsVisible(true)
        const lenis = getLenis()
        if (lenis) lenis.start()
    }, 1800)
  }

  // Audio initializer on entry
  useEffect(() => {
      // Setup the looking glass choir on mount
      heavenEngine.triggerMirrorChorus()
  }, [])

  return (
    <div className="signal-realm" ref={containerRef}>
      
      {/* ── Floating HTML Overlay Text ── */}
      <div className="approach-text-container">
         <div className={`approach-line ${scrollProgress > 0.15 && scrollProgress < 0.35 ? 'visible' : ''}`}>
             YOU'VE SEEN THE WORK.
         </div>
         <div className={`approach-line ${scrollProgress > 0.35 && scrollProgress < 0.55 ? 'visible' : ''}`}>
             YOU'VE FELT THE THOUGHT.
         </div>
         <div className={`approach-line ${scrollProgress > 0.55 && scrollProgress < 0.75 ? 'visible' : ''}`}>
             NOW YOU KNOW WHO BUILT THIS.
         </div>
         <div className={`approach-line come-closer ${scrollProgress > 0.75 && !shattered ? 'visible scaling' : ''}`}>
             COME CLOSER.
         </div>
      </div>

      <div className={`shatter-prompt ${scrollProgress >= 0.9 && !shattered ? 'visible' : ''}`}>
         BREAK THE GLASS TO MOVE FORWARD.
      </div>

      {objectsVisible && (
         <div className="floor-inscription">
            EVERY GREAT COLLABORATION BEGINS WITH HELLO.
         </div>
      )}

      {objectsVisible && (
         <div className="looking-glass-footer">
            REALM IV — THE LOOKING GLASS — {new Date().getFullYear()} — HAND-CODED IN THE DARK
         </div>
      )}

      {/* ── 3D Context ── */}
      <Canvas
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ position: 'absolute', inset: 0 }}
      >
        <PerspectiveCamera makeDefault position={[0, 2.5, 0]} fov={60} />
        <fog attach="fog" color="#080C14" near={2} far={20} />
        
        <InnerRoom />
        
        <TheLookingGlass 
           scrollProgress={scrollProgress} 
           shatterTriggered={shattered}
           onMirrorClick={handleShatter}
        />

        <EmergedObjects visible={objectsVisible} />
      </Canvas>
    </div>
  )
}
