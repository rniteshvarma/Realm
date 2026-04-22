// ═══════════════════════════════════════════════════════════
//  DEVICE TIER DETECTION — BRIEF 11, FIX A
//  Runs once at startup. ALL visual systems read from this.
//  Nothing overrides it.
//
//  Tier 3: High-end desktop (M4 Pro, RTX, etc.)
//  Tier 2: Mid-range (modern laptop, recent phone)
//  Tier 1: Low-end (older phones, budget laptops)
// ═══════════════════════════════════════════════════════════

export function getDeviceTier() {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
    const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info')
    const gpu = debugInfo
      ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
      : ''

    const isMobile    = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
    const isLowEndGPU = /mali|adreno [23]/i.test(gpu)
    const cores  = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4

    // Tier 3: High-end desktop (M4 Pro, RTX etc)
    if (!isMobile && cores >= 8 && memory >= 8) return 3

    // Tier 2: Mid-range (modern laptop, recent phone)
    if (!isLowEndGPU && cores >= 4 && memory >= 4) return 2

    // Tier 1: Low-end (older phones, budget laptops)
    return 1
  } catch {
    return 2  // safe fallback
  }
}

export const TIER = getDeviceTier()

// Settings matrix — every visual system reads from this
export const SETTINGS = {
  // Particle counts
  nebulaParticles:  [15000,  35000, 60000][TIER - 1],
  forgeParticles:   [50,     100,     300][TIER - 1],
  starfieldCount:   [250,    750,    1500][TIER - 1],

  // Pixel ratio cap
  pixelRatio: Math.min(
    typeof window !== 'undefined' ? window.devicePixelRatio : 2,
    [1.0, 1.5, 2.0][TIER - 1]
  ),

  // Geometry quality
  sphereSegments: [16, 32, 64][TIER - 1],
  tunnelSegments: [32, 48, 80][TIER - 1],

  // Post-processing
  bloomEnabled:   [false, true,  true ][TIER - 1],
  bloomIntensity: [0,     0.8,   1.4  ][TIER - 1],
  chromaticAberr: [false, false, true ][TIER - 1],

  // Animation
  useGPGPU:     [false, false, true][TIER - 1],
  particleFPS:  [20,    30,    60  ][TIER - 1],

  // Shader complexity
  noiseOctaves:   [2,     3,     5   ][TIER - 1],
  shadowsEnabled: [false, false, true][TIER - 1],

  // Convenience
  TIER,
}
