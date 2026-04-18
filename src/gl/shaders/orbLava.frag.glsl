// ── ORB SURFACE: MOLTEN LAVA ──
// Slow churning lava-lamp noise with hot cores

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep red / dark
uniform vec3 uColor2;  // bright orange / yellow

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

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  float t = uTime * uSpeed * 0.15; // slow, viscous movement
  vec2 uv = vUv;

  // Domain-warped lava noise
  vec2 q = vec2(fbm(uv + vec2(0.0, 0.0) + t),
                fbm(uv + vec2(5.2, 1.3) + t * 0.9));

  vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.4));

  float f = fbm(uv + 4.0 * r + t);
  f = f * 0.5 + 0.5;

  // Color based on "temperature"
  vec3 coldRock = uColor1 * 0.15;          // near black
  vec3 coolLava = uColor1;                 // dark red
  vec3 hotLava  = uColor2;                 // bright orange
  vec3 hotCore  = vec3(1.0, 0.95, 0.6);   // yellow-white hot center

  vec3 col = coldRock;
  col = mix(col, coolLava, smoothstep(0.2, 0.45, f));
  col = mix(col, hotLava,  smoothstep(0.45, 0.70, f));
  col = mix(col, hotCore,  smoothstep(0.72, 0.88, f));

  // Emissive glow on hot spots
  col += hotCore * smoothstep(0.80, 1.0, f) * 0.8;

  // Rim atmosphere — molten red
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 2.5);
  col += vec3(1.0, 0.3, 0.0) * rim * 0.7;

  gl_FragColor = vec4(col, 1.0);
}
