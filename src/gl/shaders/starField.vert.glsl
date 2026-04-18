// ── STAR FIELD VERTEX SHADER ──
// pos → each vertex is a star point. warpMode stretches them to lines.

attribute float aSize;
attribute float aBrightness;

uniform float uTime;
uniform float uWarpStrength; // 0 = static points, 1 = full warp lines
uniform float uWarpSeed;    // per-star variation

varying float vBrightness;
varying float vWarp;

void main() {
  vBrightness = aBrightness;
  vWarp = uWarpStrength;

  vec3 pos = position;

  // Warp: streak stars backward along Z
  if (uWarpStrength > 0.0) {
    float stretch = uWarpStrength * 3.0;
    pos.z -= stretch * (0.5 + uWarpSeed * 0.5);
  }

  // Twinkle — subtle position jitter
  float twinkle = sin(uTime * (1.5 + aBrightness * 2.0) + uWarpSeed * 6.28) * 0.002;
  pos.x += twinkle;
  pos.y += twinkle * 0.7;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPosition.z) * (uWarpStrength > 0.5 ? 0.5 : 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
