// ── Stone Wall Shader — THE SÉANCE ─────────────────────────────────────
// Base: --heaven-deep (#0D1B2A) prussian blue-black.
// Shimmer: --neural (#00F5FF) teal — consistent with all other realms.
// Corners bleed --plasma (#7B2FBE) violet — matches Realm 1 + Realm 2.

uniform float uTime;
uniform float uShimmerSpeed;
varying vec2 vUv;
varying vec3 vWorldPos;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),           hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p  = p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  // Base stone texture — 3 octaves
  float n = noise(vUv * 8.0)  * 0.6 +
            noise(vUv * 16.0) * 0.3 +
            noise(vUv * 32.0) * 0.1;

  // Moisture shimmer — moves slowly upward
  float shimmer = noise(vUv * 20.0 + vec2(0.0, -uTime * uShimmerSpeed));
  shimmer = pow(shimmer, 6.0) * 0.12;

  // Crack / grain veins
  float crack = fbm(vUv * 6.0 + vec2(uTime * 0.003, 0.0));
  crack = smoothstep(0.55, 0.6, crack) * 0.04;

  // FIX 1: --heaven-deep (#0D1B2A) as the base stone color
  vec3 stone = vec3(0.051, 0.106, 0.165) + n * 0.03 - crack;

  // FIX 1: shimmer uses --neural teal (#00F5FF) — matches other realm glows
  vec3 shimmerCol = vec3(0.0, 0.961, 1.0);
  vec3 col = stone + shimmer * shimmerCol * 0.08;

  // FIX 1: --plasma (#7B2FBE) violet bleed in corners — same depth trick as Realm 1
  float cornerDist = length(vUv - 0.5) * 2.0;
  vec3 plasmaBleed = vec3(0.482, 0.184, 0.745);
  col += plasmaBleed * pow(cornerDist, 3.0) * 0.04;

  // Subtle edge darkening (SSAO-like vignette at wall corners)
  float edgeFade = smoothstep(0.0, 0.15, vUv.x) *
                   smoothstep(0.0, 0.15, 1.0 - vUv.x) *
                   smoothstep(0.0, 0.15, vUv.y) *
                   smoothstep(0.0, 0.15, 1.0 - vUv.y);
  col *= (0.65 + 0.35 * edgeFade);

  gl_FragColor = vec4(col, 1.0);
}
