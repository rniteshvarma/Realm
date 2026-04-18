import { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, PerspectiveCamera, MeshDistortMaterial, View } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import * as THREE from 'three'
import * as Matter from 'matter-js'
import { useStore } from '../../../store/useStore'

import './Arsenal.css'
import fractalFrag from '../../../gl/shaders/fractal.frag.glsl?raw'

function SkillObject({ children, color, initialPos = [0, 0, 0] }) {
  const meshRef = useRef()
  const mouse = useStore((s) => s.mouse)
  
  // Physics setup
  const engine = useMemo(() => Matter.Engine.create({ gravity: { x: 0, y: 0 } }), [])
  const body = useMemo(() => {
    const b = Matter.Bodies.circle(0, 0, 20, { 
      frictionAir: 0.1,
      restitution: 0.8
    })
    Matter.Composite.add(engine.world, b)
    return b
  }, [engine])

  useFrame((state, delta) => {
    // 1. Calculate repulsion
    // Map mouse (0-1) to physics space (roughly -200 to 200)
    const mx = (mouse.x - 0.5) * 400
    const my = (mouse.y - 0.5) * 400
    
    const dx = body.position.x - mx
    const dy = body.position.y - my
    const dist = Math.sqrt(dx * dx + dy * dy)
    
    if (dist < 100) {
      const force = (1 - dist / 100) * 0.02
      Matter.Body.applyForce(body, body.position, { x: dx * force, y: dy * force })
    }

    // 2. Attraction to origin
    const ax = -body.position.x * 0.005
    const ay = -body.position.y * 0.005
    Matter.Body.applyForce(body, body.position, { x: ax, y: ay })

    // 3. Update physics with safety cap to prevent NaN explosions on frame lag
    const step = Math.min(delta, 0.05) * 1000
    Matter.Engine.update(engine, step)

    // 4. Map to 3D (scale physics pixels to 3D units)
    if (meshRef.current) {
      meshRef.current.position.x = initialPos[0] + body.position.x * 0.01
      meshRef.current.position.y = initialPos[1] - body.position.y * 0.01
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  return <group ref={meshRef}>{children}</group>
}

export default function ArsenalScene() {
  const containerRef = useRef(null)
  const tunnelRef = useRef(null)
  const view1Ref = useRef(null)
  const view2Ref = useRef(null)
  const view3Ref = useRef(null)
  const view4Ref = useRef(null)

  useEffect(() => {
    // 1. PIN AND ROTATE logic remained same
    const pinTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=4000',
        pin: true,
        scrub: 1,
        anticipatePin: 1
      }
    })

    pinTl.to(containerRef.current, {
      rotationZ: -90,
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.inOut'
    })

    pinTl.to(tunnelRef.current, {
      xPercent: -75, // 0 to -75 for 4 segments
      duration: 3,
      ease: 'none'
    })

    pinTl.to(containerRef.current, {
      rotationZ: 0,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    })

    return () => pinTl.kill()
  }, [])

  return (
    <div className="arsenal-container layer-base" ref={containerRef}>
      {/* Root Canvas for all Arsenal segments */}
      <Canvas 
        className="arsenal-canvas-root"
        eventSource={containerRef}
        style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
        dpr={[1, 2]}
      >
        <View track={view1Ref}>
           <PerspectiveCamera makeDefault position={[0,0,5]} />
           <ambientLight intensity={0.5} />
           <directionalLight position={[10,10,10]} intensity={2} />
           <SkillObject>
             <mesh>
               <icosahedronGeometry args={[1.5, 0]} />
               <meshStandardMaterial color="#00F5FF" wireframe />
             </mesh>
           </SkillObject>
        </View>

        <View track={view2Ref}>
           <PerspectiveCamera makeDefault position={[0,0,5]} />
           <ambientLight intensity={0.5} />
           <directionalLight position={[10,10,10]} intensity={1} />
           <SkillObject>
             <mesh>
               <torusKnotGeometry args={[1, 0.3, 100, 16]} />
               <MeshDistortMaterial color="#7B2FBE" speed={2} distort={0.4} />
             </mesh>
           </SkillObject>
        </View>

        <View track={view3Ref}>
           <PerspectiveCamera makeDefault position={[0,0,5]} />
           <ambientLight intensity={0.5} />
           <directionalLight position={[10,10,10]} intensity={1.5} />
           <SkillObject>
              <mesh>
                <planeGeometry args={[4, 4, 32, 32]} />
                <shaderMaterial 
                  fragmentShader={fractalFrag}
                  vertexShader={`
                    varying vec2 vUv;
                    void main() {
                      vUv = uv;
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                  `}
                  uniforms={{
                    uTime: { value: 0 },
                    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
                  }}
                />
              </mesh>
           </SkillObject>
        </View>

        <View track={view4Ref}>
           <PerspectiveCamera makeDefault position={[0,0,5]} />
           <ambientLight intensity={0.5} />
           <directionalLight position={[10,10,10]} intensity={1.5} />
           <SkillObject>
             <mesh>
               <sphereGeometry args={[1.2, 64, 64]} />
               <MeshDistortMaterial color="#FF2D2D" speed={4} distort={0.6} radius={1} />
             </mesh>
           </SkillObject>
        </View>
        <View.Port />
      </Canvas>

      <div className="arsenal-tunnel" ref={tunnelRef}>
        <div className="tunnel-segment">
           <h2 className="skill-title" data-cursor="hover-drag">DESIGN SYSTEMS</h2>
           <div className="skill-canvas" ref={view1Ref}></div>
           <div className="skill-tooltip">TOKENS / FIGMA / ACCESSIBILITY</div>
        </div>

        <div className="tunnel-segment">
           <h2 className="skill-title" data-cursor="hover-drag">MOTION & ANIMATION</h2>
           <div className="skill-canvas" ref={view2Ref}></div>
           <div className="skill-tooltip">GSAP / SPRING / FRAMER</div>
        </div>

        <div className="tunnel-segment">
           <h2 className="skill-title" data-cursor="hover-drag">ENGINEERING</h2>
           <div className="skill-canvas" ref={view3Ref}></div>
           <div className="skill-tooltip">REACT / NODE / TYPESCRIPT</div>
        </div>

        <div className="tunnel-segment">
           <h2 className="skill-title" data-cursor="hover-drag">CREATIVE TECH</h2>
           <div className="skill-canvas" ref={view4Ref}></div>
           <div className="skill-tooltip">WEBGL / SHADERS / THREE.JS</div>
        </div>
      </div>
    </div>
  )
}
