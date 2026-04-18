// ── Presence Particle Vertex Shader — THE SÉANCE ───────────────────────
// Colour-cycling particles: violet → gold → teal.
// Size attenuation for depth.

uniform float uTime;
attribute float aSize;
varying float vLife;
varying float vAlpha;

void main() {
  // Life drives the colour cycle — unique per particle via position hash
  vLife = fract(uTime * 0.08 + position.x * 0.3 + position.y * 0.2);

  vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPos.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 32.0);
  gl_Position  = projectionMatrix * mvPos;

  // Fade based on distance (depth-based alpha)
  vAlpha = clamp(1.0 + mvPos.z * 0.08, 0.1, 1.0);
}
