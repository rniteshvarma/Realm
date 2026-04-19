import { useRef, useState, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'

import NebulaParticles from './NebulaParticles'
import './Nebula.css'

// ─────────────────────────────────────────────────────────────
// INNER — inside Canvas context so PostFX refs can be captured
// ─────────────────────────────────────────────────────────────

function NebulaInner({ containerRef, onActChange }) {
  return (
    <>
      <color attach="background" args={['#000000']} />
      
      <NebulaParticles 
        containerRef={containerRef} 
        bloomRef={null} 
        chromaticRef={null}
        onActChange={onActChange}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN SCENE ROOT 
// ─────────────────────────────────────────────────────────────

export default function NebulaScene() {
  const containerRef = useRef(null)
  const [activeAct, setActiveAct] = useState(0)

  const handleActChange = useCallback((act) => {
    setActiveAct(act)
  }, [])

  const ACT_LABELS = [
    'ENTRY', 'NAME', 'TITLE', 'MANIFESTO', 'WORDS', 'SIGIL', 'SUPERNOVA', 'SILENCE'
  ]

  return (
    <div className="nebula-scene" ref={containerRef}>
      
      {/* Sticky canvas that stays pinned for 600vh */}
      <div className="nebula-canvas-sticky">
        <Canvas 
          camera={{ position: [0, 2, 18], fov: 60, near: 0.1, far: 500 }}
          gl={{ 
            antialias: false, 
            alpha: false, 
            powerPreference: 'high-performance',
            stencil: false
          }}
          dpr={[1, Math.min(window.devicePixelRatio, 2)]}
          frameloop="always"
        >
          <NebulaInner 
            containerRef={containerRef} 
            onActChange={handleActChange} 
          />
        </Canvas>

        {/* Persistent UI Overlay */}
        <div className="nebula-realm-label" aria-hidden="true">
          V. THE NEBULA
        </div>

        <div className="nebula-act-dots" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i} 
              className={`nebula-act-dot ${activeAct >= i ? 'nebula-act-dot--filled' : ''}`}
              title={ACT_LABELS[i]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
