// ── ORB SURFACE: ELECTRIC STORM ──
// Deep navy / electric blue with animated noise + lightning flashes

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep navy
uniform vec3 uColor2;  // electric blue

// Hash & noise
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    val += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return val;
}

// Lightning bolt: returns brightness along a jagged vertical line
float lightning(vec2 uv, float seed, float t) {
  float x = uv.x - (0.3 + seed * 0.4);
  float jitter = fbm(vec2(uv.y * 4.0 + seed * 10.0, t * 2.0), 3) * 0.15;
  float d = abs(x + jitter);
  float bolt = 1.0 - smoothstep(0.0, 0.025, d);
  // Flash envelope: sharp on, quick fade
  float flash = sin(t * 6.28 + seed * 7.3) * 0.5 + 0.5;
  flash = pow(flash, 8.0);
  return bolt * flash;
}

void main() {
  float t = uTime * uSpeed * 0.4;
  vec2 uv = vUv;

  // Cloud noise base
  float cloud = fbm(uv * 3.0 + vec2(t * 0.1, -t * 0.07), 5);
  cloud = cloud * 0.5 + 0.5;

  // Storm cell — brighter in the middle
  vec2 center = uv - 0.5;
  float stormCore = 1.0 - length(center) * 1.4;
  stormCore = clamp(stormCore, 0.0, 1.0);

  // Base planet color
  vec3 col = mix(uColor1, uColor2, cloud * stormCore + 0.1);

  // Add a swirling dark layer
  float swirl = fbm(uv * 2.0 + vec2(-t * 0.05, t * 0.08), 4);
  col = mix(col, uColor1 * 0.3, swirl * (1.0 - stormCore) * 0.6);

  // Lightning flashes — 3 bolts with different seeds
  float bolts = 0.0;
  bolts += lightning(uv, 0.1, t);
  bolts += lightning(uv, 0.55, t + 1.3);
  bolts += lightning(uv, 0.82, t + 2.7);
  bolts = clamp(bolts, 0.0, 1.0);
  col += vec3(0.6, 0.85, 1.0) * bolts * 2.0;

  // Edge atmosphere glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  col += uColor2 * rim * 0.8;

  // Slight emissive
  col += uColor2 * stormCore * 0.15;

  gl_FragColor = vec4(col, 1.0);
}
