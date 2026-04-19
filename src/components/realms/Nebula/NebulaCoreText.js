/**
 * NebulaCoreText.js — Realm 5: The Nebula
 *
 * All utilities for generating particle target positions:
 *   - Text → particles (offscreen canvas sampling)
 *   - Sigil → particles (vesica piscis geometry)
 *   - Nebula cloud → particles (3-region gaussian distribution)
 */

// ─────────────────────────────────────────────────────────────
// TEXT EXTRACTION
// ─────────────────────────────────────────────────────────────

/**
 * Renders text to an offscreen canvas with letter-spacing,
 * samples bright pixels every 3px, and maps them to 3D world coords.
 * Returns a Float32Array of [x,y,z, x,y,z, ...] with exactly `count` entries.
 */
export async function extractTextPositions(
  text,
  font,
  fontSize,
  targetCount,
  canvasWidth = 1400,
  canvasHeight = 400,
  letterSpacingEm = 0.15
) {
  // Ensure font is loaded before sampling
  try {
    await document.fonts.load(`bold ${fontSize}px "${font}"`)
  } catch (e) {
    // silently continue — font may already be available
  }

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${fontSize}px "${font}"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  // Apply letter spacing by rendering character-by-character
  const letterSpacing = fontSize * letterSpacingEm
  const chars = text.split('')

  // Measure total width including letter spacing
  let totalWidth = 0
  const charWidths = chars.map(c => {
    const w = ctx.measureText(c).width
    totalWidth += w + letterSpacing
    return w
  })
  totalWidth -= letterSpacing // no trailing space

  let startX = canvasWidth / 2 - totalWidth / 2
  const midY = canvasHeight / 2

  chars.forEach((c, i) => {
    ctx.fillText(c, startX + charWidths[i] / 2, midY)
    startX += charWidths[i] + letterSpacing
  })

  // Sample bright pixels
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const pixels = imageData.data
  const rawPositions = []

  for (let y = 0; y < canvasHeight; y += 3) {
    for (let x = 0; x < canvasWidth; x += 3) {
      const i = (y * canvasWidth + x) * 4
      const brightness = pixels[i] / 255
      if (brightness > 0.5) {
        rawPositions.push({
          x: (x / canvasWidth - 0.5) * 16,
          y: -(y / canvasHeight - 0.5) * 5,
          z: (Math.random() - 0.5) * 0.4
        })
      }
    }
  }

  return samplePositions(rawPositions, targetCount)
}

/**
 * Multi-line text extraction for the manifesto.
 * Returns positions for each word separately so the vertex shader
 * can use aPhase to reveal them sequentially (left-to-right).
 */
export async function extractManifestoPositions(
  text,
  font,
  fontSize,
  targetCount,
  canvasWidth = 1800,
  canvasHeight = 360
) {
  await document.fonts.load(`bold ${fontSize}px "${font}"`).catch(() => {})

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${fontSize}px "${font}"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const letterSpacing = fontSize * 0.15
  const words = text.split(' ')

  // First pass: measure each word + spacing
  const wordMeta = []
  let totalWidth = 0
  words.forEach((w, wi) => {
    const chars = w.split('')
    let wordW = 0
    const cws = chars.map(c => {
      const cw = ctx.measureText(c).width
      wordW += cw + letterSpacing
      return cw
    })
    wordW -= letterSpacing
    wordMeta.push({ word: w, chars, charWidths: cws, width: wordW })
    totalWidth += wordW + (wi < words.length - 1 ? ctx.measureText(' ').width * 1.5 : 0)
  })

  // Second pass: render with word positions tracked
  let curX = canvasWidth / 2 - totalWidth / 2
  const wordRanges = [] // { minX, maxX } in pixel space

  words.forEach((w, wi) => {
    const meta = wordMeta[wi]
    const wordStartX = curX
    meta.chars.forEach((c, ci) => {
      ctx.fillText(c, curX + meta.charWidths[ci] / 2, canvasHeight / 2)
      curX += meta.charWidths[ci] + letterSpacing
    })
    wordRanges.push({
      minX: wordStartX / canvasWidth,
      maxX: curX / canvasWidth
    })
    curX += ctx.measureText(' ').width * 1.5 // word gap
  })

  // Sample pixels and tag each with word index based on X position
  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const pixels = imageData.data
  const rawPositions = []

  for (let y = 0; y < canvasHeight; y += 3) {
    for (let x = 0; x < canvasWidth; x += 3) {
      const i = (y * canvasWidth + x) * 4
      const brightness = pixels[i] / 255
      if (brightness > 0.5) {
        const nx = x / canvasWidth
        // Determine which word this pixel belongs to
        let wordIdx = 0
        for (let wi = 0; wi < wordRanges.length; wi++) {
          if (nx >= wordRanges[wi].minX && nx <= wordRanges[wi].maxX) {
            wordIdx = wi
            break
          }
        }
        // Phase = word index / (words.length) → [0, 0.8]
        const phaseFromWord = (wordIdx / words.length) * 0.8

        rawPositions.push({
          x: (x / canvasWidth - 0.5) * 16,
          y: -(y / canvasHeight - 0.5) * 5,
          z: (Math.random() - 0.5) * 0.4,
          wordPhase: phaseFromWord
        })
      }
    }
  }

  return sampleManifestoPositions(rawPositions, targetCount)
}

function sampleManifestoPositions(positions, count) {
  const result = []
  const phases = []
  if (positions.length === 0) {
    for (let i = 0; i < count; i++) {
      result.push(gaussRandom() * 2, gaussRandom() * 2, gaussRandom() * 2)
      phases.push(0)
    }
    return { positions: new Float32Array(result), phases: new Float32Array(phases) }
  }
  const step = positions.length / count
  for (let i = 0; i < count; i++) {
    const src = positions[Math.floor(i * step) % positions.length]
    result.push(
      src.x + (Math.random() - 0.5) * 0.05,
      src.y + (Math.random() - 0.5) * 0.05,
      src.z
    )
    phases.push(src.wordPhase)
  }
  return {
    positions: new Float32Array(result),
    phases: new Float32Array(phases)
  }
}

// ─────────────────────────────────────────────────────────────
// SIGIL EXTRACTION (Vesica Piscis)
// ─────────────────────────────────────────────────────────────

/**
 * Generates positions for the vesica piscis sigil —
 * two overlapping circles, left circle teal, right circle purple,
 * intersection gold. Returns a Float32Array of [x,y,z, ...].
 */
export function extractSigilPositions(count) {
  const positions = []
  const r = 2.0
  const offset = 1.0

  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2
    const isLeft = i < count / 2
    const cx = isLeft ? -offset : offset
    positions.push({
      x: Math.cos(t) * r + cx,
      y: Math.sin(t) * r,
      z: (Math.random() - 0.5) * 0.3
    })
  }

  return positionsToFloat32(positions)
}

// ─────────────────────────────────────────────────────────────
// NEBULA CLOUD GENERATION
// ─────────────────────────────────────────────────────────────

/**
 * Distributes particles across three overlapping density regions
 * to create a realistic nebula cloud with a bright core
 * bleeding out into wispy tendrils.
 */
export function generateNebulaPositions(count) {
  const positions = []

  for (let i = 0; i < count; i++) {
    const region = Math.random()
    let x, y, z

    if (region < 0.5) {
      // Dense core — tight gaussian
      x = gaussRandom() * 4
      y = gaussRandom() * 2
      z = gaussRandom() * 3
    } else if (region < 0.8) {
      // Mid cloud — wider spread
      x = gaussRandom() * 8
      y = gaussRandom() * 4
      z = gaussRandom() * 5
    } else {
      // Wispy tendrils — spherical, very spread
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = 8 + Math.random() * 6
      x = r * Math.sin(phi) * Math.cos(theta)
      y = r * Math.cos(phi) * 0.4 // flat disc
      z = r * Math.sin(phi) * Math.sin(theta)
    }

    positions.push({ x, y, z })
  }

  return positionsToFloat32(positions)
}

/**
 * Generates nebula particle colors based on region:
 *   Core: neural teal + sacred gold
 *   Mid: plasma purple + aurora-1 violet
 *   Tendrils: aurora-2 blue + heaven-deep
 */
export function generateNebulaColors(count) {
  const colors = new Float32Array(count * 3)

  // Palette
  const neural   = [0.000, 0.961, 1.000]  // #00F5FF
  const sacred   = [0.788, 0.659, 0.298]  // #C9A84C
  const plasma   = [0.482, 0.184, 0.745]  // #7B2FBE
  const aurora1  = [0.706, 0.310, 0.910]  // #B44FE8
  const aurora2  = [0.310, 0.671, 0.910]  // #4FABE8
  const heavenD  = [0.051, 0.106, 0.165]  // #0D1B2A

  for (let i = 0; i < count; i++) {
    const region = Math.random()
    const t = Math.random()
    let r, g, b

    if (region < 0.5) {
      // Core: teal ↔ gold mix
      r = neural[0] * (1 - t) + sacred[0] * t
      g = neural[1] * (1 - t) + sacred[1] * t
      b = neural[2] * (1 - t) + sacred[2] * t
    } else if (region < 0.8) {
      // Mid: plasma ↔ aurora-1
      r = plasma[0] * (1 - t) + aurora1[0] * t
      g = plasma[1] * (1 - t) + aurora1[1] * t
      b = plasma[2] * (1 - t) + aurora1[2] * t
    } else {
      // Tendrils: aurora-2 ↔ heaven-deep
      r = aurora2[0] * (1 - t) + heavenD[0] * t
      g = aurora2[1] * (1 - t) + heavenD[1] * t
      b = aurora2[2] * (1 - t) + heavenD[2] * t
    }

    colors[i * 3]     = r
    colors[i * 3 + 1] = g
    colors[i * 3 + 2] = b
  }

  return colors
}

// ─────────────────────────────────────────────────────────────
// MORPH COLOR GENERATORS
// ─────────────────────────────────────────────────────────────

export function morphColors(count, type) {
  const colors = new Float32Array(count * 3)

  const palettes = {
    name:      [[0.941, 0.941, 0.941], [0.788, 0.659, 0.298]], // ghost + sacred gold
    title:     [[0.941, 0.941, 0.941], [0.000, 0.961, 1.000]], // ghost + neural teal
    manifesto: [[0.788, 0.659, 0.298], [1.000, 0.820, 0.400]], // sacred gold (bright)
    word1:     [[0.482, 0.184, 0.745], [0.600, 0.300, 0.900]], // plasma purple
    word2:     [[0.000, 0.961, 1.000], [0.200, 0.800, 1.000]], // neural teal
    word3:     [[0.706, 0.310, 0.910], [0.850, 0.500, 1.000]], // aurora-1 violet
    sigil:     null // handled specially below
  }

  if (type === 'sigil') {
    // Left circle: teal, right circle: purple, intersection: gold
    for (let i = 0; i < count; i++) {
      const t = i / count
      let r, g, b
      if (t < 0.33) {
        r = 0.000; g = 0.961; b = 1.000 // neural teal
      } else if (t < 0.66) {
        r = 0.788; g = 0.659; b = 0.298 // sacred gold
      } else {
        r = 0.482; g = 0.184; b = 0.745 // plasma purple
      }
      colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b
    }
    return colors
  }

  const [c1, c2] = palettes[type] || palettes.name
  for (let i = 0; i < count; i++) {
    const t = Math.random()
    colors[i * 3]     = c1[0] * (1 - t) + c2[0] * t
    colors[i * 3 + 1] = c1[1] * (1 - t) + c2[1] * t
    colors[i * 3 + 2] = c1[2] * (1 - t) + c2[2] * t
  }
  return colors
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function gaussRandom() {
  const u = 1 - Math.random()
  const v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function samplePositions(positions, count) {
  const result = []
  if (positions.length === 0) {
    for (let i = 0; i < count; i++) {
      result.push({ x: gaussRandom() * 3, y: gaussRandom() * 2, z: gaussRandom() * 3 })
    }
    return positionsToFloat32(result)
  }
  const step = positions.length / count
  for (let i = 0; i < count; i++) {
    const src = positions[Math.floor(i * step) % positions.length]
    result.push({
      x: src.x + (Math.random() - 0.5) * 0.05,
      y: src.y + (Math.random() - 0.5) * 0.05,
      z: src.z
    })
  }
  return positionsToFloat32(result)
}

function positionsToFloat32(positions) {
  const arr = new Float32Array(positions.length * 3)
  positions.forEach((p, i) => {
    arr[i * 3]     = p.x
    arr[i * 3 + 1] = p.y
    arr[i * 3 + 2] = p.z
  })
  return arr
}
