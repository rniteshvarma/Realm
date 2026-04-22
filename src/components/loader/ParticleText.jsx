import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

import vertShader from '../../gl/shaders/particles.vert.glsl?raw'
import fragShader from '../../gl/shaders/particles.frag.glsl?raw'

function Particles({ text }) {
  const pointsRef = useRef()
  const materialRef = useRef()
  const performanceLow = useStore(state => state.performanceLow)

  // 1. Create a canvas texture for the text
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')
    
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    ctx.fillStyle = 'white'
    ctx.font = 'bold 120px "Space Grotesk", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text.toUpperCase(), canvas.width / 2, canvas.height / 2)
    
    return new THREE.CanvasTexture(canvas)
  }, [text])

  // 2. Sample the texture to generate particles
  const { positions, uvs, originalPositions, randoms } = useMemo(() => {
    const canvas = texture.image
    const ctx = canvas.getContext('2d')
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    
    // Scale down particles for performance
    const step = performanceLow ? 8 : 4
    const count = (canvas.width / step) * (canvas.height / step)
    
    const positions = new Float32Array(count * 3)
    const uvs = new Float32Array(count * 2)
    const originalPositions = new Float32Array(count * 3)
    const randoms = new Float32Array(count)

    let idx = 0
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        // Check if pixel is "white" (part of text)
        const i = (y * canvas.width + x) * 4
        if (imgData[i] > 128) {
          // Map x,y to normalized device coordinates, then scale
          const px = (x / canvas.width - 0.5) * 20
          const py = -(y / canvas.height - 0.5) * 10
          
          positions[idx * 3] = 0 // Start all particles at center (0,0,0) for the explosion
          positions[idx * 3 + 1] = 0
          positions[idx * 3 + 2] = 0

          originalPositions[idx * 3] = px
          originalPositions[idx * 3 + 1] = py
          originalPositions[idx * 3 + 2] = (Math.random() - 0.5) * 2

          uvs[idx * 2] = x / canvas.width
          uvs[idx * 2 + 1] = 1 - (y / canvas.height) // Flip Y

          randoms[idx] = Math.random()
          idx++
        }
      }
    }

    // Slice to actual particle count
    return {
      positions: positions.slice(0, idx * 3),
      uvs: uvs.slice(0, idx * 2),
      originalPositions: originalPositions.slice(0, idx * 3),
      randoms: randoms.slice(0, idx)
    }
  }, [texture])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 }, // 0 = exploded, 1 = assembled text
  }), [])

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
      // Animate progress smoothly towards 1
      materialRef.current.uniforms.uProgress.value += (1.0 - materialRef.current.uniforms.uProgress.value) * 0.02
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-uv"
          count={uvs.length / 2}
          array={uvs}
          itemSize={2}
        />
        <bufferAttribute
          attach="attributes-aOriginalPosition"
          count={originalPositions.length / 3}
          array={originalPositions}
          itemSize={3}
        />
         <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertShader}
        fragmentShader={fragShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default function ParticleTextComponent({ text }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }} 
        style={{ pointerEvents: 'none' }}
        gl={{ antialias: false }}
        dpr={useStore.getState().performanceLow ? 1 : Math.min(window.devicePixelRatio, 2)}
      >
        <Particles text={text} />
      </Canvas>
    </div>
  )
}
