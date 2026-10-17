import * as THREE from 'three'

// Additive glow for transparent (alpha) canvases: adds light to colour but
// leaves the canvas alpha untouched, so the shared starfield behind the
// chapter still shows through instead of being carved into dark discs.
export const ADDITIVE = {
  blending: THREE.CustomBlending,
  blendEquation: THREE.AddEquation,
  blendSrc: THREE.SrcAlphaFactor,
  blendDst: THREE.OneFactor,
  blendSrcAlpha: THREE.ZeroFactor,
  blendDstAlpha: THREE.OneFactor,
}
