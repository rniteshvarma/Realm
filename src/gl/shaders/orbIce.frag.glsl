// ── ORB SURFACE: ICE CRYSTAL LATTICE ──
// Faceted, refracting, with hexagonal lattice and sparkle

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // pale ice blue
uniform vec3 uColor2;  // deep crystal cyan

// Hexagonal tiling
vec2 hexCoord(vec2 uv, float scale) {
  uv *= scale;
  vec2 s = vec2(1.0, 1.732);
  vec2 a = mod(uv, s) - s * 0.5;
  vec2 b = mod(uv + s * 0.5, s) - s * 0.5;
  return dot(a, a) < dot(b, b) ? a : b;
}

float hexDist(vec2 h) {
  h = abs(h);
  return max(dot(h, normalize(vec2(1.0, 1.732))), h.x);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash2(i), vec2(1.0));
  float b = dot(hash2(i + vec2(1,0)), vec2(1.0));
  float c = dot(hash2(i + vec2(0,1)), vec2(1.0));
  float d = dot(hash2(i + vec2(1,1)), vec2(1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  float t = uTime * uSpeed * 0.1;
  vec2 uv = vUv;

  // Slowly shifting hex lattice — subtle drift
  vec2 drift = vec2(t * 0.03, t * 0.02);
  vec2 h6  = hexCoord(uv + drift, 6.0);
  vec2 h12 = hexCoord(uv * 1.8 - drift * 0.5, 10.0);

  float d6  = hexDist(h6);
  float d12 = hexDist(h12);

  // Cell edges — the "crystal facets"
  float edge6  = 1.0 - smoothstep(0.38, 0.48, d6);
  float edge12 = 1.0 - smoothstep(0.35, 0.44, d12);

  // Per-cell shimmer — different facet brightness
  float cellId = dot(hash2(floor(uv * 6.0 + drift)), vec2(1.0));
  float facet  = smoothstep(-0.3, 1.0, cellId);

  // Base crystal color
  vec3 base = mix(uColor1, uColor2, facet * 0.6 + d12 * 0.4);

  // Edge highlight — white frost
  vec3 frostWhite = vec3(0.9, 0.97, 1.0);
  base = mix(base, frostWhite * 1.2, edge6 * 0.8);
  base = mix(base, frostWhite, edge12 * 0.5);

  // Sparkle points — random high-frequency twinkle
  float sparkNoise = noise(uv * 40.0 + t * 2.0);
  float sparkle = pow(max(0.0, sparkNoise), 14.0);
  base += frostWhite * sparkle * 3.0;

  // Interior glow — slightly warmer center
  vec2 center = uv - 0.5;
  float glow = 1.0 - length(center) * 1.8;
  glow = clamp(glow, 0.0, 1.0);
  base += uColor2 * glow * 0.25;

  // Refraction shimmer — time-based hue shift at edges
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  // Rainbow rim — iridescent crystal edges
  float hueShift = sin(rim * 6.0 + t * 2.0) * 0.5 + 0.5;
  vec3 rainbowRim = mix(vec3(0.4, 0.8, 1.0), vec3(0.9, 0.6, 1.0), hueShift);
  base += rainbowRim * rim * 0.6;

  gl_FragColor = vec4(base, 1.0);
}
