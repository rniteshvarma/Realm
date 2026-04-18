// ── ORB SURFACE: OCEAN ──
// Deep teal / dark blue with wave displacement + foam crests

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep ocean blue
uniform vec3 uColor2;  // teal / cyan

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

float wave(vec2 uv, float freq, float speed, float amp) {
  return amp * sin(uv.x * freq + uTime * speed * uSpeed)
           * cos(uv.y * freq * 0.7 + uTime * speed * 0.6 * uSpeed);
}

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;

  // Wave displacement — stacked sine waves at multiple scales
  float h = 0.0;
  h += wave(uv, 6.0,  0.8,  0.12);
  h += wave(uv, 13.0, 1.3,  0.06);
  h += wave(uv, 28.0, 2.1,  0.03);
  h += wave(uv, 52.0, 3.5,  0.015);
  h = h * 0.5 + 0.5; // normalize to [0,1]

  // Deep vs shallow coloring
  vec3 deep  = uColor1 * 0.4;
  vec3 mid   = uColor1;
  vec3 crest = uColor2;
  vec3 foam  = vec3(0.85, 0.95, 1.0);

  vec3 col = mix(deep, mid, h);
  col = mix(col, crest, smoothstep(0.65, 0.75, h));
  // Foam on peaks
  float foamMask = smoothstep(0.78, 0.90, h);
  float foamNoise = noise(uv * 20.0 + vec2(t * 0.5, 0.0)) * 0.5 + 0.5;
  col = mix(col, foam, foamMask * foamNoise * 1.3);

  // Subsurface scattering — brighten edges lit by center
  float sss = max(0.0, dot(vNormal, normalize(vec3(0.3, 0.5, 0.8))));
  col += uColor2 * sss * 0.2;

  // Rim glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 4.0);
  col += uColor2 * rim * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
