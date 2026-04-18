import { useEffect, useRef, useCallback } from 'react'
import heavenEngine from './HeavenAudioEngine'

// ═══════════════════════════════════════════════════════
//  AUDIO VISUALIZER — Oscilloscope-style waveform UI
//  40×20px canvas. Responds to Web Audio AnalyserNode.
//  Labels: "SIGNAL" (off) / "CHOIR" (on)
// ═══════════════════════════════════════════════════════

export default function AudioVisualizer({ enabled, onToggle }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height
    ctx.clearRect(0, 0, W, H)

    const analyser = heavenEngine.getAnalyser?.()

    if (enabled && analyser) {
      // Live waveform from analyser
      const bufLen = analyser.frequencyBinCount
      const dataArr = new Uint8Array(bufLen)
      analyser.getByteTimeDomainData(dataArr)

      ctx.strokeStyle = '#00F5FF' // --neural
      ctx.lineWidth = 1.5
      ctx.shadowBlur = 4
      ctx.shadowColor = '#00F5FF'
      ctx.beginPath()

      const sliceW = W / bufLen
      let x = 0
      for (let i = 0; i < bufLen; i++) {
        const v = dataArr[i] / 128.0
        const y = (v * H) / 2
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
        x += sliceW
      }
      ctx.stroke()
    } else {
      // Flatline with subtle breathing pulse when off
      const t = Date.now() / 1000
      const pulse = Math.sin(t * 1.2) * 1.5

      ctx.strokeStyle = 'rgba(240,240,240,0.25)' // ghost dim
      ctx.lineWidth = 1
      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.moveTo(0, H / 2 + pulse)
      ctx.lineTo(W, H / 2 + pulse)
      ctx.stroke()
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [enabled])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  return (
    <button
      className={`audio-visualizer-btn ${enabled ? 'active' : ''}`}
      onClick={onToggle}
      title={enabled ? 'CHOIR — click to silence' : 'SIGNAL — click to activate'}
      aria-label={enabled ? 'Audio on — click to turn off' : 'Audio off — click to turn on'}
      data-cursor="hover-link"
    >
      <canvas
        ref={canvasRef}
        width={40}
        height={20}
        className="audio-visualizer-canvas"
      />
      <span className="audio-visualizer-label">
        {enabled ? 'CHOIR' : 'SIGNAL'}
      </span>
    </button>
  )
}
