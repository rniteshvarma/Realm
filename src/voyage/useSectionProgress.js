import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Scroll progress (0→1) of a tall "sticky" section: starts when its top hits
// the viewport top, ends when its bottom hits the viewport bottom.
//
// Returns a ref that 3D code reads every frame (no React re-render per
// scroll tick) and, if `steps` is given, a React state index that only
// changes when the visitor crosses a step boundary — cheap for HUD/text.
export function useSectionProgress(ref, { steps = null, onUpdate } = {}) {
  const progress = useRef(0)
  const [step, setStep] = useState(0)
  const stepRef = useRef(0)
  const onUpdateRef = useRef(onUpdate)
  onUpdateRef.current = onUpdate

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = (p) => {
      progress.current = p
      onUpdateRef.current?.(p)
      if (steps) {
        let s = 0
        for (let i = 0; i < steps.length; i++) if (p >= steps[i]) s = i
        if (s !== stepRef.current) { stepRef.current = s; setStep(s) }
      }
    }
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => apply(self.progress),
    })
    // Chapters mount mid-scroll (jumps, fast flings, remounts): sync to the
    // real position immediately instead of waiting for the next scroll event
    apply(st.progress)
    const raf = requestAnimationFrame(() => { st.refresh(); apply(st.progress) })
    return () => { cancelAnimationFrame(raf); st.kill() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { progress, step }
}

// Frame-rate independent damping toward a target (for useFrame loops)
export const damp = (current, target, lambda, delta) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta))
