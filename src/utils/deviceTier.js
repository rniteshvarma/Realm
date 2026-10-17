// ═══════════════════════════════════════════════════════════
//  DEVICE CAPABILITIES — runs once at startup.
//  Every visual system reads from here so the whole voyage scales
//  together on phones, older laptops and high-end desktops.
//
//  Tier 3: High-end desktop · Tier 2: modern laptop / recent phone
//  Tier 1: low-end (older phones, budget laptops)
// ═══════════════════════════════════════════════════════════

function probe() {
  const result = { webgl: false, webgl2: false, gpu: '' }
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (gl) {
      result.webgl = true
      result.webgl2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      result.gpu = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)).toLowerCase() : ''
      // Release the probe context right away (browsers cap live contexts)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  } catch { /* no WebGL */ }
  return result
}

const caps = typeof window !== 'undefined' ? probe() : { webgl: true, webgl2: true, gpu: '' }

const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
// iPadOS reports as Mac; detect touch Macs too
const isTouchMac = /Macintosh/.test(ua) && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1
export const IS_MOBILE = /android|iphone|ipad|ipod|mobile/i.test(ua) || isTouchMac
export const PREFERS_REDUCED_MOTION = typeof window !== 'undefined'
  && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const HAS_WEBGL = caps.webgl2   // three r168 renders with WebGL2 only

export function getDeviceTier() {
  const isLowEndGPU = /mali|adreno [2345]|powervr|swiftshader|llvmpipe|software/i.test(caps.gpu)
  const cores  = navigator.hardwareConcurrency || 4
  const memory = navigator.deviceMemory || 4
  if (!HAS_WEBGL || isLowEndGPU) return 1
  if (!IS_MOBILE && cores >= 8 && memory >= 8) return 3
  if (cores >= 4 && memory >= 4) return 2
  return 1
}

export const TIER = typeof window !== 'undefined' ? getDeviceTier() : 2

// "Low" mode: phones, tier-1 hardware or reduced-motion visitors
export const IS_LOW = IS_MOBILE || TIER === 1 || PREFERS_REDUCED_MOTION

// Max device-pixel-ratio a canvas may use on this device
export const MAX_DPR = Math.min(
  typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1,
  IS_LOW ? 1.25 : TIER === 3 ? 1.75 : 1.5
)

// Settings matrix — every visual system reads from this
export const SETTINGS = {
  nebulaParticles:  [15000,  35000, 60000][TIER - 1],
  forgeParticles:   [50,     100,     300][TIER - 1],
  starfieldCount:   [250,    750,    1500][TIER - 1],
  pixelRatio: MAX_DPR,
  sphereSegments: [16, 32, 64][TIER - 1],
  tunnelSegments: [32, 48, 80][TIER - 1],
  bloomEnabled:   [false, true,  true ][TIER - 1],
  bloomIntensity: [0,     0.8,   1.4  ][TIER - 1],
  chromaticAberr: [false, false, true ][TIER - 1],
  useGPGPU:     [false, false, true][TIER - 1],
  particleFPS:  [20,    30,    60  ][TIER - 1],
  noiseOctaves:   [2,     3,     5   ][TIER - 1],
  shadowsEnabled: [false, false, true][TIER - 1],
  TIER,
}
