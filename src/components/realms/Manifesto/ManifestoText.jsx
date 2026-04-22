import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function ManifestoText() {
  const word3Ref = useRef(null)

  useEffect(() => {
    // Advanced shatter effect for word 3
    if (!word3Ref.current) return
    const chars = word3Ref.current.children
    
    const onMouseEnter = () => {
      gsap.to(chars, {
        y: () => (Math.random() - 0.5) * 40,
        x: () => (Math.random() - 0.5) * 40,
        rotateZ: () => (Math.random() - 0.5) * 45,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.02
      })
    }

    const onMouseLeave = () => {
      gsap.to(chars, {
        y: 0,
        x: 0,
        rotateZ: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.02
      })
    }

    const el = word3Ref.current
    el.addEventListener('mouseenter', onMouseEnter)
    el.addEventListener('mouseleave', onMouseLeave)

    return () => {
      el.removeEventListener('mouseenter', onMouseEnter)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <h1 className="manifesto-headline">
      <div className="word-row">
        <span className="word word-1" data-cursor="hover-drag">I</span>
        <span className="word word-1" data-cursor="hover-drag">DON'T</span>
        <span className="word word-2" data-cursor="hover-drag">MANAGE</span>
        <span className="word word-2" data-cursor="hover-drag">PRODUCTS.</span>
      </div>
      <div className="word-row">
        <span className="word word-1" data-cursor="hover-drag">I</span>
        <span className="word word-1" data-cursor="hover-drag">BUILD</span>
        <span className="word word-3 shattered" ref={word3Ref} data-cursor="hover-drag">
          {'WORLDS'.split('').map((char, i) => (
            <span key={i} style={{ display: 'inline-block' }}>{char}</span>
          ))}
        </span>
        <span className="word word-4" data-cursor="hover-drag">.</span>
      </div>
    </h1>
  )
}
