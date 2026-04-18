// ═══════════════════════════════════════════════════════
//  ProjectOverlay — READ MORE frosted glass case study
//  Slides up from bottom, 5 horizontal panels, 3D world runs behind
// ═══════════════════════════════════════════════════════

import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'

const PANEL_TITLES = ['THE BRIEF', 'THE PROCESS', 'THE SOLUTION', 'THE IMPACT', 'THE LEARNING']
const PANEL_KEYS   = ['brief', 'process', 'solution', 'impact', 'learning']

export default function ProjectOverlay({ project, onClose }) {
  const overlayRef  = useRef()
  const contentRef  = useRef()
  const [panelIdx, setPanelIdx] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const touchStartX = useRef(null)

  // Slide in on mount
  useEffect(() => {
    if (!overlayRef.current) return
    gsap.fromTo(overlayRef.current,
      { y: '100%', opacity: 0 },
      { y: '0%', opacity: 1, duration: 0.6, ease: 'power3.out' }
    )
  }, [])

  const close = useCallback(() => {
    if (isClosing) return
    setIsClosing(true)
    gsap.to(overlayRef.current, {
      y: '100%',
      opacity: 0,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: onClose,
    })
  }, [isClosing, onClose])

  const nextPanel = useCallback(() => {
    if (panelIdx < PANEL_TITLES.length - 1) setPanelIdx(p => p + 1)
  }, [panelIdx])

  const prevPanel = useCallback(() => {
    if (panelIdx > 0) setPanelIdx(p => p - 1)
  }, [panelIdx])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') nextPanel()
      if (e.key === 'ArrowLeft')  prevPanel()
      if (e.key === 'Escape')     close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nextPanel, prevPanel, close])

  // Touch swipe
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx < -50) nextPanel()
    if (dx >  50) prevPanel()
    touchStartX.current = null
  }

  // Animate panel transition
  useEffect(() => {
    if (!contentRef.current) return
    gsap.fromTo(contentRef.current,
      { x: 30, opacity: 0 },
      { x: 0,  opacity: 1, duration: 0.4, ease: 'power2.out' }
    )
  }, [panelIdx])

  const panels = project?.panels || {}
  const currentKey   = PANEL_KEYS[panelIdx]
  const currentTitle = PANEL_TITLES[panelIdx]
  const currentText  = panels[currentKey] || '[PLACEHOLDER: Fill case study content]'

  return (
    <div
      ref={overlayRef}
      className="project-overlay"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ transform: 'translateY(100%)' }}
    >
      {/* Frosted glass background */}
      <div className="project-overlay__glass" />

      {/* Close button — rotating X */}
      <button
        className="project-overlay__close"
        onClick={close}
        aria-label="Close case study"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="20" y1="4" x2="4" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      <div className="project-overlay__inner">
        {/* Left panel — pinned project info */}
        <div className="project-overlay__left">
          <div className="overlay-project-number">0{(project?.index ?? 0) + 1}</div>
          <h2 className="overlay-project-title">{project?.title}</h2>
          <p className="overlay-project-role">{project?.role}</p>
          <p className="overlay-project-year">{project?.year}</p>
          <div className="overlay-project-tags">
            {(project?.tags || []).map(tag => (
              <span key={tag} className="overlay-tag">{tag}</span>
            ))}
          </div>

          {/* Panel navigation dots */}
          <div className="overlay-dots">
            {PANEL_TITLES.map((_, i) => (
              <button
                key={i}
                className={`overlay-dot ${i === panelIdx ? 'active' : ''}`}
                onClick={() => setPanelIdx(i)}
                aria-label={`Go to ${PANEL_TITLES[i]}`}
              />
            ))}
          </div>
        </div>

        {/* Right panel — scrolling case study */}
        <div className="project-overlay__right">
          <div ref={contentRef} className="overlay-panel">
            <div className="overlay-panel__header">
              <span className="overlay-panel__number">0{panelIdx + 1} / 0{PANEL_TITLES.length}</span>
              <h3 className="overlay-panel__title">{currentTitle}</h3>
            </div>
            <p className="overlay-panel__body">{currentText}</p>

            {/* Metric callout in impact panel */}
            {currentKey === 'impact' && project?.metric && (
              <div className="overlay-metric">
                <span className="overlay-metric__number">{project.metric}</span>
                <span className="overlay-metric__desc">{project.metricDesc}</span>
              </div>
            )}
          </div>

          {/* Navigation arrows */}
          <div className="overlay-nav">
            <button
              className={`overlay-nav__btn overlay-nav__btn--prev ${panelIdx === 0 ? 'disabled' : ''}`}
              onClick={prevPanel}
              disabled={panelIdx === 0}
              aria-label="Previous panel"
            >
              ←
            </button>
            <span className="overlay-nav__label">{currentTitle}</span>
            <button
              className={`overlay-nav__btn overlay-nav__btn--next ${panelIdx === PANEL_TITLES.length - 1 ? 'disabled' : ''}`}
              onClick={nextPanel}
              disabled={panelIdx === PANEL_TITLES.length - 1}
              aria-label="Next panel"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
