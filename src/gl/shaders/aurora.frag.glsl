// aurora.glsl — Myth Engine ceiling
// Flowing curtains of violet, gold, and teal light (vertex shader noise)

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Smooth noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(i,             vec2(127.1,311.7))) * 43758.5);
  float b = fract(sin(dot(i + vec2(1,0), vec2(127.1,311.7))) * 43758.5);
  float c = fract(sin(dot(i + vec2(0,1), vec2(127.1,311.7))) * 43758.5);
  float d = fract(sin(dot(i + vec2(1,1), vec2(127.1,311.7))) * 43758.5);
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  
  // Time-driven flow
  float t = uTime * 0.3;
  
  // Aurora curtain shape — vertical bands flowing horizontally
  float curtain = fbm(vec2(uv.x * 3.0 + t * 0.5, uv.y * 0.5));
  curtain += fbm(vec2(uv.x * 2.0 - t * 0.3, uv.y * 1.0 + t * 0.1)) * 0.5;
  
  // Fade at edges (curtain hangs from top)
  float fade = smoothstep(1.0, 0.3, uv.y) * smoothstep(0.0, 0.1, uv.y);
  curtain *= fade;
  
  // Three aurora colors
  vec3 violet = vec3(0.706, 0.310, 0.910);   // #B44FE8
  vec3 gold   = vec3(0.788, 0.659, 0.298);   // #C9A84C  
  vec3 teal   = vec3(0.310, 0.671, 0.910);   // #4FABE8
  
  // Horizontal color shift based on noise patterns
  float band1 = fbm(vec2(uv.x * 2.0, t));
  float band2 = fbm(vec2(uv.x * 1.5 + 1.7, t * 0.7));
  
  vec3 color = mix(violet, teal, band1);
  color = mix(color, gold, band2 * 0.4);
  color *= curtain * 1.5;
  
  // Very dark base
  vec3 dark = vec3(0.0, 0.0, 0.01);
  color = mix(dark, color, curtain);
  
  gl_FragColor = vec4(color, curtain + 0.02);
}
