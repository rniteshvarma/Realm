import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Reflector as ThreeReflector } from 'three/examples/jsm/objects/Reflector'

import { useStore } from '../../../store/useStore'
import { getLenis } from '../../../hooks/useScroll'
import { SETTINGS } from '../../../utils/deviceTier'
import heavenEngine from '../../../audio/HeavenAudioEngine'
import { generateShards } from './FractureGenerator'
import { OrigamiCrane, NavigationCompass, CodeFragment } from './Objects'

import mirrorDistortionFrag from '../../../gl/shaders/mirrorDistortion.frag.glsl?raw'
import mirrorDistortionVert from '../../../gl/shaders/mirrorDistortion.vert.glsl?raw'
import './Signal.css'

function GlassDustParticles() {
  const performanceLow = useStore(state => state.performanceLow)
  const count = performanceLow ? 60 : 200
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
      uHandIntensity: { value: 0 },
      uOpacity: { value: 1.0 }
    },
    vertexShader: mirrorDistortionVert,
    fragmentShader: mirrorDistortionFrag,
  }), [])

  // Initialize Three.js Reflector
  useEffect(() => {
    if (!mirrorWrapperRef.current) return
    const geo = new THREE.PlaneGeometry(3, 5)
    
    const performanceLow = useStore.getState().performanceLow
    
    // Create the raw 3JS Reflector
    const mirror = new ThreeReflector(geo, {
      clipBias: 0.003,
      textureWidth: window.innerWidth * (performanceLow ? 0.5 : window.devicePixelRatio),
      textureHeight: window.innerHeight * (performanceLow ? 0.5 : window.devicePixelRatio),
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
                 <GlassShard key={idx} shard={s} customMaterial={customMaterial} />
             ))}
          </group>
        )}
    </group>
  )
}

// ── Individual Shard Component ──
function GlassShard({ shard, customMaterial }) {
    const meshRef = useRef()
    
    // Create unique uniforms for this shard, but share the texture and time references
    const uniforms = useMemo(() => ({
        uTime: customMaterial.uniforms.uTime,
        tDiffuse: customMaterial.uniforms.tDiffuse,
        uClarity: customMaterial.uniforms.uClarity,
        uHandPos: customMaterial.uniforms.uHandPos,
        uHandIntensity: customMaterial.uniforms.uHandIntensity,
        uOpacity: { value: 0.9 }
    }), [customMaterial])

    useEffect(() => {
        if (!meshRef.current) return
        
        // Animation
        const cx = shard.centroid.x
        const cy = shard.centroid.y
        const force = 1.0 + Math.random() * 2

        gsap.to(meshRef.current.position, {
            x: meshRef.current.position.x + cx * force,
            y: meshRef.current.position.y + cy * force - (3 + Math.random()*2),
            z: meshRef.current.position.z + (Math.random()*2 + 1),
            duration: 1.2 + Math.random() * 0.8,
            ease: 'power3.out'
        })

        gsap.to(meshRef.current.rotation, {
            x: Math.random() * Math.PI * 4,
            y: Math.random() * Math.PI * 4,
            z: Math.random() * Math.PI * 4,
            duration: 1.5,
            ease: 'power2.out'
        })

        // Fade out unique uniform
        gsap.to(uniforms.uOpacity, {
            value: 0,
            duration: 1.0,
            delay: 0.5 + Math.random()*0.5,
            onComplete: () => {
                if (meshRef.current) meshRef.current.visible = false
            }
        })
    }, [shard, uniforms])

    return (
        <mesh 
          ref={meshRef}
          geometry={shard.geometry} 
          position={[shard.centroid.x, shard.centroid.y, 0]}
        >
            <shaderMaterial 
                attach="material"
                uniforms={uniforms}
                vertexShader={customMaterial.vertexShader}
                fragmentShader={customMaterial.fragmentShader}
                transparent
            />
        </mesh>
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
           />
           {/* Wrap the compass in pointer events */}
           <group 
             onPointerOver={() => handleHover('B', true)}
             onPointerOut={() => handleHover('B', false)}
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
  const setSignalShattered = useStore(s => s.setSignalShattered)
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
    setSignalShattered(true)
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
      
      {/* REALM LABEL */}
      <div className="signal-realm-label">
        VI. THE LOOKING GLASS
      </div>

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



      {/* ── 3D Context ── */}
      <Canvas
        gl={{ antialias: SETTINGS.TIER >= 2, alpha: false, powerPreference: 'high-performance', stencil: false }}
        dpr={[0.85, SETTINGS.pixelRatio]}
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
