import { useCallback, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { useRealmFrameloop } from '../hooks/useRealmActive'
import { HAS_WEBGL, MAX_DPR, IS_LOW } from '../utils/deviceTier'

// ═══════════════════════════════════════════════════════════════════════
//  VoyageCanvas — every chapter's <Canvas>, made device-aware:
//  • pauses its render loop while the chapter is off screen
//  • starts at a resolution the device can afford and adapts live: if the
//    frame rate drops it lowers resolution, if there's headroom it raises
//    it again (never above the device cap)
//  • renders nothing when WebGL2 isn't available (the story text still shows)
//  • survives a lost GPU context (mobile browsers drop them under pressure)
// ═══════════════════════════════════════════════════════════════════════

export default function VoyageCanvas({ children, maxDpr = 1.5, minDpr = 0.6, gl, ...props }) {
  const frameloop = useRealmFrameloop()
  const cap = Math.min(maxDpr, MAX_DPR)
  const [dpr, setDpr] = useState(IS_LOW ? Math.min(cap, 1) : cap)

  const onCreated = useCallback(({ gl: renderer }) => {
    const el = renderer.domElement
    el.addEventListener('webglcontextlost', (e) => e.preventDefault(), false)
  }, [])

  if (!HAS_WEBGL) return null

  return (
    <Canvas
      frameloop={frameloop}
      dpr={dpr}
      gl={{ powerPreference: 'high-performance', failIfMajorPerformanceCaveat: false, ...gl }}
      onCreated={onCreated}
      {...props}
    >
      <PerformanceMonitor
        bounds={(refreshRate) => (refreshRate > 90 ? [50, 90] : [45, 60])}
        flipflops={4}
        onDecline={() => setDpr((d) => Math.max(minDpr, +(d * 0.8).toFixed(2)))}
        onIncline={() => setDpr((d) => Math.min(cap, +(d * 1.1).toFixed(2)))}
      />
      {children}
    </Canvas>
  )
}
