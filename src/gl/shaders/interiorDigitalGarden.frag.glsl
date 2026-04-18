// ── INTERIOR BIOME: DIGITAL GARDEN ──
// Bioluminescent seeds that grow branching trees — deep green + gold glow

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash2(i).x;
  float b = hash2(i + vec2(1,0)).x;
  float c = hash2(i + vec2(0,1)).x;
  float d = hash2(i + vec2(1,1)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Segment distance — for drawing branch lines
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// A single tree branch contribution at a given scale
float branch(vec2 uv, vec2 root, float angle, float length, float gen, float t, float seed) {
  if (gen > 3.0) return 0.0;

  vec2 tip = root + vec2(sin(angle), cos(angle)) * length;

  // Grow animation — tip starts at root, moves outward
  float growTime = clamp(t - seed * 2.0 - gen * 0.8, 0.0, 1.0);
  vec2 animTip = mix(root, tip, growTime);

  float d = sdSegment(uv, root, animTip);
  float lineWidth = 0.005 * (1.0 + 0.5 / (gen + 1.0));
  float line = 1.0 - smoothstep(0.0, lineWidth, d);

  // Glow
  float glow = 1.0 - smoothstep(0.0, lineWidth * 4.0, d);

  return line * 0.8 + glow * 0.3;
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2(uv.x * ar, uv.y);
  float t = uTime * 0.5;

  // Background — deep forest void
  vec3 bgDark  = vec3(0.01, 0.04, 0.02);
  vec3 bgMid   = vec3(0.02, 0.07, 0.03);
  float bgNoise = noise(suv * 3.0 + t * 0.05) * 0.5 + 0.5;
  vec3 col = mix(bgDark, bgMid, bgNoise);

  // Ground mist
  float mist = smoothstep(0.85, 1.0, uv.y);
  col = mix(col, vec3(0.03, 0.12, 0.06), mist * 0.5);

  // Tree colors
  vec3 branchColor = vec3(0.05, 0.35, 0.12);
  vec3 glowColor   = vec3(0.40, 0.90, 0.30); // bioluminescent green
  vec3 tipGlow     = vec3(1.00, 0.85, 0.20); // gold at growth tips

  // Draw N trees from grid roots
  float treeMask = 0.0;
  float treeglow = 0.0;

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 seed2 = hash2(vec2(fi, 0.0));

    // Root positions scattered across lower half
    vec2 root = vec2(seed2.x * ar, 0.75 + seed2.y * 0.2);
    float treeSeed = hash1(fi * 13.7);

    // Main trunk angle (mostly upward)
    float angle = -1.5708 + (seed2.x - 0.5) * 0.8; // ~90° ± variance

    float len1 = 0.08 + seed2.y * 0.06;
    float b1 = branch(suv, root, angle, len1, 0.0, t, treeSeed);
    treeMask += b1;

    // Level 1 branches
    vec2 trunk_tip = root + vec2(sin(angle), cos(angle)) * len1;
    float bAngle1L = angle - 0.4 - seed2.x * 0.3;
    float bAngle1R = angle + 0.4 + seed2.y * 0.3;
    float len2 = len1 * 0.65;

    float b2L = branch(suv, trunk_tip, bAngle1L, len2, 1.0, t, treeSeed + 0.3);
    float b2R = branch(suv, trunk_tip, bAngle1R, len2, 1.0, t, treeSeed + 0.6);
    treeMask += b2L + b2R;

    // Level 2
    vec2 tipL = trunk_tip + vec2(sin(bAngle1L), cos(bAngle1L)) * len2;
    vec2 tipR = trunk_tip + vec2(sin(bAngle1R), cos(bAngle1R)) * len2;
    float len3 = len2 * 0.6;

    treeMask += branch(suv, tipL, bAngle1L - 0.35, len3, 2.0, t, treeSeed + 0.1);
    treeMask += branch(suv, tipL, bAngle1L + 0.25, len3, 2.0, t, treeSeed + 0.2);
    treeMask += branch(suv, tipR, bAngle1R - 0.25, len3, 2.0, t, treeSeed + 0.4);
    treeMask += branch(suv, tipR, bAngle1R + 0.35, len3, 2.0, t, treeSeed + 0.5);

    // Bioluminescent spots at tips
    float spotR = 0.006;
    float totalGrowth = clamp(t - treeSeed * 2.0 - 2.4, 0.0, 1.0);
    treeglow += totalGrowth * (1.0 - smoothstep(0.0, spotR, length(suv - tipL)));
    treeglow += totalGrowth * (1.0 - smoothstep(0.0, spotR, length(suv - tipR)));
  }

  treeMask = clamp(treeMask, 0.0, 1.0);
  treeglow = clamp(treeglow, 0.0, 1.0);

  col = mix(col, branchColor, treeMask * 0.6);
  col += glowColor * treeMask * 0.8;
  col += tipGlow * treeglow * 3.0;

  // Floating dust particles
  float dust = 0.0;
  for (int j = 0; j < 20; j++) {
    float fj = float(j);
    vec2 dSeed = hash2(vec2(fj * 7.3, 1.0));
    vec2 dPos = fract(dSeed + vec2(0.0, t * (0.01 + dSeed.x * 0.03)));
    dPos.x *= ar;
    float dDist = length(suv - dPos);
    dust += (1.0 - smoothstep(0.0, 0.004, dDist)) * dSeed.y;
  }
  col += tipGlow * dust * 1.5;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.4;
  col *= clamp(vignette, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
