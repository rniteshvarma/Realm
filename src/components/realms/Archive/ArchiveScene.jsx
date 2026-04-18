import { useRef, useEffect, useState, useMemo } from 'react'
import { gsap } from 'gsap'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../../store/useStore'

import vertShader from '../../../gl/shaders/portal.vert.glsl?raw'
import fragShader from '../../../gl/shaders/portal.frag.glsl?raw'

import './Archive.css'

function PortalMesh({ position, type }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const [hovered, setHovered] = useState(false)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      materialRef.current.uniforms.uHover.value += 
        (hovered ? 1.0 : 0.0 - materialRef.current.uniforms.uHover.value) * 0.1
    }
  })

  // Float animation
  useFrame((state) => {
    if (meshRef.current) {
        meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2
    }
  })

  // State integration
  const setActiveProject = useStore(s => s.setActiveProject)
  const activeProject = useStore(s => s.activeProject)

  return (
    <mesh 
       ref={meshRef} 
       position={position}
       onPointerOver={() => setHovered(true)}
       onPointerOut={() => setHovered(false)}
       onClick={(e) => {
         e.stopPropagation()
         setActiveProject({ id: type, title: type, position })
       }}
       visible={!activeProject || activeProject.id === type}
    >
      <planeGeometry args={[3, 2, 32, 32]} />
      <shaderMaterial
         ref={materialRef}
         vertexShader={vertShader}
         fragmentShader={fragShader}
         uniforms={uniforms}
         transparent
      />
    </mesh>
  )
}

function ControlledCamera() {
  const { camera } = useThree()
  const activeProject = useStore(s => s.activeProject)
  const targetPos = useRef(new THREE.Vector3(0, 0, 5))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    if (activeProject) {
      // Zoom in
      targetPos.current.set(
        activeProject.position[0],
        activeProject.position[1],
        activeProject.position[2] + 1.5
      )
      targetLookAt.current.set(
        activeProject.position[0],
        activeProject.position[1],
        activeProject.position[2]
      )
    } else {
      // Return to overview
      targetPos.current.set(0, 0, 5)
      targetLookAt.current.set(0, 0, 0)
    }

    camera.position.lerp(targetPos.current, 0.1)
    // We don't use lookAt directly to keep FOV control clean
  })

  return <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
}

export default function ArchiveScene() {
  const containerRef = useRef(null)
  const activeProject = useStore(s => s.activeProject)
  const setActiveProject = useStore(s => s.setActiveProject)

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
    <div className="archive-container" ref={containerRef}>
      <h2 className={`archive-title ${activeProject ? 'hidden' : ''}`}>THE ARCHIVE</h2>
      
      <div className="archive-canvas-wrapper">
         <Canvas dpr={[1, 2]}>
            <ControlledCamera />
            <ambientLight intensity={0.5} />
            <PortalMesh position={[-4, 1, -2]} type="OBLIVION OS" />
            <PortalMesh position={[4, -1, -3]} type="NEURAL DRIFT" />
            <PortalMesh position={[0, -3, -5]} type="PULSE ENGINE" />
         </Canvas>
      </div>

      {/* Close button for fly-in */}
      {activeProject && (
        <button 
          className="portal-close-btn"
          onClick={() => setActiveProject(null)}
          data-cursor="hover-link"
        >
          BACK TO VOID
        </button>
      )}

      {/* Detail overlay - slides in when clicking a portal */}
      <div className={`project-detail-overlay ${activeProject ? 'visible' : ''}`}>
         <div className="project-detail-content">
            {activeProject && (
              <>
                <h1 className="detail-title">{activeProject.title}</h1>
                <p className="detail-role">CREATIVE TECHNOLOGY — EXPERIMENTAL CASE STUDY</p>
                <div className="detail-description" style={{ color: 'var(--ghost)', opacity: 0.6, maxWidth: '600px', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '2rem', fontFamily: 'var(--font-mono)' }}>
                  A journey into deconstructed interfaces and generative systems. 
                  Built with WebGL, custom GLSL shaders, and React Three Fiber to explore the intersection of human and machine perception.
                </div>
                <div className="detail-gallery">
                  <div className="gallery-item" data-cursor="hover-drag">VISUAL DATA 01</div>
                  <div className="gallery-item" data-cursor="hover-drag">VISUAL DATA 02</div>
                  <div className="gallery-item" data-cursor="hover-drag">VISUAL DATA 03</div>
                </div>
              </>
            )}
         </div>
      </div>
    </div>
  )
}
