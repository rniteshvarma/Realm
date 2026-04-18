// ── Math utilities ──────────────────────────────────────
export const lerp = (a, b, t) => a + (b - a) * t

export const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

export const map = (v, inMin, inMax, outMin, outMax) =>
  outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin)

export const damp = (a, b, lambda, dt) =>
  lerp(a, b, 1 - Math.exp(-lambda * dt))

export const norm = (v, min, max) => (v - min) / (max - min)

export const randBetween = (min, max) =>
  Math.random() * (max - min) + min

export const randSign = () => (Math.random() > 0.5 ? 1 : -1)

export const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const easeOutExpo = (t) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
