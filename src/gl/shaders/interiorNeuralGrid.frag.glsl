// ── INTERIOR BIOME: NEURAL GRID ──
// Deep blue hexagonal grid with neural pulse propagation

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

// Hexagonal distance and cell
vec4 hexInfo(vec2 uv) {
  vec2 s = vec2(1.0, 1.732050808);
  vec4 b = floor(vec4(uv, uv - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 p = vec4(uv - b.xy * s, uv - (b.zw + 0.5) * s);
  vec4 c = dot(p.xy, p.xy) < dot(p.zw, p.zw) ? vec4(p.xy, b.xy) : vec4(p.zw, b.zw);
  return vec4(c.xy, c.zw);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float ar = uResolution.x / uResolution.y;
  vec2 scaledUv = vec2(uv.x * ar, uv.y) * 8.0;

  // Hex grid
  vec4 hex = hexInfo(scaledUv);
  vec2 localPos  = hex.xy;
  vec2 cellIndex = hex.zw;

  float distToCenter = length(localPos);
  float hexEdge = 1.0 - smoothstep(0.35, 0.48, distToCenter);

  // Per-cell unique seed
  float cellSeed = fract(sin(dot(cellIndex, vec2(12.9898, 78.233))) * 43758.5453);

  // Pulse wave from center — ripple outward
  float distFromOrigin = length(cellIndex / 8.0 - vec2(0.5 * ar / 8.0, 0.5));
  float pulsePhase = t * 1.5 - distFromOrigin * 12.0 + cellSeed * 6.28;
  float pulse = sin(pulsePhase) * 0.5 + 0.5;
  pulse = pow(pulse, 4.0);

  // Synaptic firing — random snap activations
  float firePhase = fract(t * (0.3 + cellSeed * 0.7) + cellSeed);
  float fire = firePhase > 0.92 ? pow((firePhase - 0.92) / 0.08, 2.0) : 0.0;
  fire = clamp(fire * (1.0 - (firePhase > 0.96 ? (firePhase - 0.96) / 0.04 : 0.0)), 0.0, 1.0);

  // Branch connections — thin lines between hex centers
  float branch = 0.0;
  float lineW = 0.025;
  // Check for near-horizontal connection
  branch = max(branch, 1.0 - smoothstep(lineW, lineW * 1.5, abs(localPos.y)) * step(abs(localPos.x), 0.5));

  // Colors
  vec3 bgColor     = vec3(0.01, 0.03, 0.10);
  vec3 gridColor   = vec3(0.05, 0.18, 0.55);
  vec3 pulseColor  = vec3(0.10, 0.50, 1.00);
  vec3 fireColor   = vec3(0.70, 0.90, 1.00);
  vec3 branchColor = vec3(0.04, 0.12, 0.40);

  vec3 col = bgColor;

  // Hex cell fill — dim gradient
  col += gridColor * (0.2 + 0.1 * sin(distToCenter * 8.0 + t));

  // Edge lines
  col = mix(col, gridColor * 1.5, (1.0 - hexEdge) * 0.7);

  // Pulse wave
  col += pulseColor * pulse * hexEdge * 0.6;

  // Synaptic flash
  col += fireColor * fire * 2.0;

  // Branch lines
  col += branchColor * branch * 0.5;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.5;
  vignette = clamp(vignette, 0.0, 1.0);
  col *= vignette;

  // Scanline
  float scanline = sin(uv.y * uResolution.y * 0.5) * 0.03;
  col -= scanline;

  gl_FragColor = vec4(col, 1.0);
}
