import { useEffect, useRef } from 'react'
import { useStore } from '../../store/useStore'
import { useRealmActive } from '../../hooks/useRealmActive'
import { useSectionProgress } from '../useSectionProgress'
import Beats, { stepsOf } from '../Beats'
import '../voyage.css'
import './Pulsar.css'

// ═══════════════════════════════════════════════════════════════════════
//  07 · PULSAR — how I work
//  A neutron star sweeps its beams across the dark. Every pulse that
//  reaches us is stacked into a ridgeline plot (the famous CP1919 chart).
//  As you scroll, the pulse profile reshapes itself into each step of the
//  process: noise → signals → one peak → structure → release + echo.
// ═══════════════════════════════════════════════════════════════════════

const STEPS = ['PERCEIVE', 'RESEARCH', 'SYNTHESIZE', 'BUILD', 'RELEASE']

const BEATS = [
  { at: 0.00, side: 'center', kicker: 'T+EVERY DAY · HOW I WORK', title: 'PULSAR', xl: true,
    body: 'A neutron star spins hundreds of times a second and still keeps perfect time. Process is what makes speed repeatable.' },
  { at: 0.10, side: 'left', kicker: 'STEP I · PERCEIVE', title: 'Listen to the noise',
    body: 'Every product starts in the room where the problem lives — long before anything looks like a signal.' },
  { at: 0.28, side: 'left', kicker: 'STEP II · RESEARCH', title: 'Find the signals',
    body: 'Data tells you what. Users tell you why. Several peaks — none of them the answer yet.' },
  { at: 0.46, side: 'left', kicker: 'STEP III · SYNTHESIZE', title: 'One clear peak',
    body: 'The hard part: throw away 80% of what you learned and keep the one thread that actually matters.' },
  { at: 0.64, side: 'left', kicker: 'STEP IV · BUILD', title: 'Give it structure',
    body: 'Prototype in days, then build it properly — with the engineers, not just for them.' },
  { at: 0.82, side: 'left', kicker: 'STEP V · RELEASE', title: 'Ship, then listen for the echo',
    body: 'A release is a hypothesis. The users show you exactly which parts were wrong. And then you go again.' },
]

// Deterministic pseudo-random
const rnd = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x) }
const gauss = (x, mu, s) => Math.exp(-((x - mu) * (x - mu)) / (2 * s * s))

// Pulse profile for one step; x in [-1, 1] across the row, `row` seeds variety
function profile(step, x, row, t) {
  const n = (k) => rnd(row * 13.37 + k)
  const jitter = (rnd(Math.floor(x * 60) + row * 91.7) - 0.5)
  switch (step) {
    case 0: { // PERCEIVE — low, restless noise
      let v = 0
      for (let k = 0; k < 7; k++) v += gauss(x, (n(k) - 0.5) * 1.2, 0.04 + n(k + 9) * 0.05) * (0.15 + n(k + 3) * 0.25)
      return v + Math.abs(jitter) * 0.12
    }
    case 1: { // RESEARCH — three distinct peaks drifting
      return gauss(x, -0.38 + (n(1) - 0.5) * 0.08, 0.06) * (0.55 + n(2) * 0.3)
        + gauss(x, 0.02 + (n(3) - 0.5) * 0.08, 0.05) * (0.7 + n(4) * 0.3)
        + gauss(x, 0.4 + (n(5) - 0.5) * 0.08, 0.06) * (0.5 + n(6) * 0.3)
        + Math.abs(jitter) * 0.08
    }
    case 2: { // SYNTHESIZE — one tall, clean peak
      return gauss(x, 0, 0.07 + n(1) * 0.02) * (1.15 + n(2) * 0.25) + gauss(x, 0, 0.22) * 0.18 + Math.abs(jitter) * 0.05
    }
    case 3: { // BUILD — blocky, stepped structure
      const blocks = [-0.36, -0.18, 0, 0.18, 0.36]
      let v = 0
      blocks.forEach((b, k) => {
        const h = 0.25 + 0.55 * (1 - Math.abs(b) * 1.6) + n(k) * 0.1
        v = Math.max(v, Math.abs(x - b) < 0.085 ? h : 0)
      })
      return v * 0.95 + Math.abs(jitter) * 0.04
    }
    default: { // RELEASE — the peak, and echoes rippling outward
      const ring = Math.sin(Math.abs(x) * 26 - t * 4 - row * 0.4) * 0.5 + 0.5
      return gauss(x, 0, 0.05) * 1.35 + ring * gauss(x, 0, 0.45) * 0.28 + Math.abs(jitter) * 0.05
    }
  }
}

export default function Pulsar() {
  const ref = useRef(null)
  const canvasRef = useRef(null)
  const active = useRealmActive()
  const activeRef = useRef(active)
  activeRef.current = active
  const { progress, step } = useSectionProgress(ref, { steps: stepsOf(BEATS) })
  const starRef = useRef({ x: 0, y: 0 })
  const tapsRef = useRef(0)

  // Egg 2 · THE HIDDEN SIGNAL — tap the neutron star three times
  const onCanvasClick = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - r.left - starRef.current.x
    const dy = e.clientY - r.top - starRef.current.y
    if (Math.hypot(dx, dy) > 48) return
    tapsRef.current += 1
    if (tapsRef.current >= 3) useStore.getState().discoverEgg('morse')
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const low = useStore.getState().performanceLow
    const ROWS = low ? 34 : 54
    const SAMPLES = low ? 110 : 180
    let w = 0, h = 0, dpr = 1
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.75)
      w = canvas.clientWidth; h = canvas.clientHeight
      canvas.width = w * dpr; canvas.height = h * dpr
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0
    let p = 0
    let pulses = 0          // count of beam crossings (rows scroll on each)
    let lastBeamSide = 0
    let flash = 0
    const start = performance.now()
    let last = start

    const draw = (now) => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      if (!activeRef.current) return
      const t = (now - start) / 1000
      // Frame-rate independent easing (same feel at 30, 60 or 120Hz)
      p += (progress.current - p) * (1 - Math.exp(-dt * 5))

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)

      const mobile = w < 768
      // ── Layout: pulsar above, plot below/right ──
      const plotW = mobile ? w * 0.86 : Math.min(w * 0.42, 620)
      const plotCx = mobile ? w / 2 : w * 0.64
      const plotTop = mobile ? h * 0.17 : h * 0.3
      const plotBottom = mobile ? h * 0.56 : h * 0.86
      const rowGap = (plotBottom - plotTop) / ROWS
      const amp = rowGap * 7.5

      const starX = plotCx
      const starY = mobile ? h * 0.08 : h * 0.15
      starRef.current.x = starX
      starRef.current.y = starY

      // ── Beams: two opposite cones sweeping (lighthouse) ──
      const spin = t * 1.6 + p * 6
      const beamSide = Math.sign(Math.sin(spin))
      if (beamSide !== lastBeamSide) { pulses++; flash = 1; lastBeamSide = beamSide }
      flash *= Math.exp(-dt * 6)

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      for (let k = 0; k < 2; k++) {
        const a = spin + k * Math.PI
        const len = Math.hypot(w, h)
        const spread = 0.06
        const g = ctx.createRadialGradient(starX, starY, 0, starX, starY, len * 0.6)
        g.addColorStop(0, 'rgba(207,228,255,0.38)')
        g.addColorStop(0.35, 'rgba(207,228,255,0.07)')
        g.addColorStop(1, 'rgba(207,228,255,0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.moveTo(starX, starY)
        ctx.lineTo(starX + Math.cos(a - spread) * len, starY + Math.sin(a - spread) * len)
        ctx.lineTo(starX + Math.cos(a + spread) * len, starY + Math.sin(a + spread) * len)
        ctx.closePath()
        ctx.fill()
      }
      // Neutron star core + halo
      const halo = ctx.createRadialGradient(starX, starY, 0, starX, starY, 60 + flash * 50)
      halo.addColorStop(0, `rgba(255,255,255,${0.95})`)
      halo.addColorStop(0.08, `rgba(220,235,255,${0.8})`)
      halo.addColorStop(0.3, `rgba(150,190,255,${0.2 + flash * 0.25})`)
      halo.addColorStop(1, 'rgba(120,160,255,0)')
      ctx.fillStyle = halo
      ctx.beginPath(); ctx.arc(starX, starY, 60 + flash * 50, 0, Math.PI * 2); ctx.fill()
      ctx.restore()

      // ── Ridgeline plot (back rows first, each occludes the one behind) ──
      const stepF = Math.min(p * 5.55 - 0.55, 4.999)
      const s0 = Math.max(0, Math.floor(stepF))
      const s1 = Math.min(4, s0 + 1)
      const blend = stepF < 0 ? 0 : (() => { const f = stepF - s0; return f < 0.6 ? 0 : (f - 0.6) / 0.4 })()
      const x0 = plotCx - plotW / 2

      for (let r = 0; r < ROWS; r++) {
        const rowId = r + pulses        // rows shift up as new pulses land
        const baseY = plotTop + r * rowGap
        const isNewest = r === ROWS - 1
        ctx.beginPath()
        ctx.moveTo(x0, baseY)
        for (let i = 0; i <= SAMPLES; i++) {
          const x = (i / SAMPLES) * 2 - 1
          const env = Math.pow(1 - Math.min(1, Math.abs(x)), 0.6)   // taper to the edges
          let v = profile(s0, x, rowId, t)
          if (blend > 0) v = v * (1 - blend) + profile(s1, x, rowId, t) * blend
          const y = baseY - v * amp * env
          ctx.lineTo(x0 + (i / SAMPLES) * plotW, y)
        }
        // Fill beneath the line in black so it hides rows behind (the CP1919 look)
        ctx.lineTo(x0 + plotW, baseY + 2)
        ctx.lineTo(x0, baseY + 2)
        ctx.closePath()
        ctx.fillStyle = '#000'
        ctx.fill()
        const fade = 0.35 + 0.65 * (r / ROWS)
        ctx.strokeStyle = isNewest
          ? `rgba(255, 214, 140, ${0.75 + flash * 0.25})`
          : `rgba(236, 242, 255, ${fade * 0.85})`
        ctx.lineWidth = isNewest ? 1.6 : 1.1
        ctx.stroke()
      }

      // Axis caption
      ctx.fillStyle = 'rgba(240,240,240,0.35)'
      ctx.font = '10px "DM Mono", monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`PSR · PROCESS · ${STEPS[Math.max(0, Math.round(stepF < 0 ? 0 : stepF))]}`, plotCx, plotBottom + 26)
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [progress])

  return (
    <div className="v-chapter" ref={ref}>
      <div className="v-sticky pulsar-sticky">
        <canvas ref={canvasRef} className="pulsar-canvas" onClick={onCanvasClick} />
        <div className="pulsar-steps" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className={`pulsar-step ${step - 1 === i ? 'is-on' : step - 1 > i ? 'is-done' : ''}`}>{s}</span>
          ))}
        </div>
        <Beats beats={BEATS} step={step} />
      </div>
    </div>
  )
}
