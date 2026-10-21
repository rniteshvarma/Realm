import { preloadFont } from 'troika-three-text'

// ═══════════════════════════════════════════════════════════════════════
//  3D label font — bundled locally (DM Mono, SIL OFL; see public/fonts).
//  drei's <Text> otherwise resolves glyphs from a CDN on every visit, and
//  while it waits it suspends the *whole* 3D scene — planets and all.
//  We preload it during the loading ritual so labels are ready instantly.
// ═══════════════════════════════════════════════════════════════════════

export const LABEL_FONT = '/fonts/DMMono-Medium.ttf'
// Every glyph the 3D labels use (uppercase copy, digits, a few symbols)
export const LABEL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 →&/·-+.,:'

let started = false
export function preloadLabelFont() {
  if (started) return
  started = true
  try {
    preloadFont({ font: LABEL_FONT, characters: LABEL_CHARS }, () => {})
  } catch { /* labels will load on demand */ }
}
