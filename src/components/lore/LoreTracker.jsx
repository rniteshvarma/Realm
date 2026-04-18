import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useStore } from '../../store/useStore'
import './LoreTracker.css'

export default function LoreTracker() {
  const loreEggs = useStore(s => s.loreEggs)
  const allEggsFound = useStore(s => s.allEggsFound)
  const containerRef = useRef(null)
  
  // Convert object { patient: true, morse: false, ... } to ordered array for rendering
  const eggs = [
    { id: 'patient',     label: 'THE FIRST WORD',      found: loreEggs.patient },
    { id: 'morse',       label: 'THE HIDDEN SIGNAL',   found: loreEggs.morse },
    { id: 'ninth-stone', label: 'THE NINTH STONE',     found: loreEggs['ninth-stone'] },
    { id: 'freq-ghost',  label: 'THE ENDLESS FREQ',    found: loreEggs['freq-ghost'] },
    { id: 'observer',    label: 'THE OBSERVER',        found: loreEggs.observer },
  ]
  const foundCount = eggs.filter(e => e.found).length

  // Animate pulse when a new egg is found
  useEffect(() => {
    if (foundCount > 0 && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { scale: 1.05, boxShadow: '0 0 15px rgba(201, 168, 76, 0.4)' },
        { scale: 1, boxShadow: '0 0 0px rgba(201, 168, 76, 0)', duration: 0.8, ease: 'power2.out' }
      )
    }
  }, [foundCount])

  // Don't show if zero eggs found to keep it mysteriously hidden initially
  // OR show it but keep it very dim
  if (foundCount === 0) return null

  return (
    <div className={`lore-tracker ${allEggsFound ? 'all-found' : ''}`} ref={containerRef}>
      <div className="lore-header">
        <span className="lore-title">ANOMALIES</span>
        <span className="lore-count">[{foundCount}/5]</span>
      </div>
      
      <div className="lore-grid">
        {eggs.map((egg, i) => (
          <div 
            key={egg.id} 
            className={`lore-node ${egg.found ? 'found' : 'missing'}`}
            title={egg.found ? egg.label : '???'}
          >
            {/* Geometric representation per egg */}
            <svg viewBox="0 0 24 24" className="lore-icon">
              {egg.found ? (
                <>
                  <circle cx="12" cy="12" r="10" className="lore-outer" />
                  <circle cx="12" cy="12" r="3" className="lore-core" />
                </>
              ) : (
                <circle cx="12" cy="12" r="2" className="lore-dot" />
              )}
            </svg>
          </div>
        ))}
      </div>

      {allEggsFound && (
        <div className="lore-unlocked">REALM IX UNLOCKED</div>
      )}
    </div>
  )
}
