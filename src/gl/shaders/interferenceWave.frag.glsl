// interferenceWave.glsl — Echo Chamber sphere inner surface
// Standing wave moiré: two sine wave sources creating interference patterns
// Colors: prussian blue (#0D1B2A) with gold (#C9A84C) wave crests

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec2 uv = vUv;
  
  // Two wave source positions
  vec2 src1 = vec2(0.3, 0.3);
  vec2 src2 = vec2(0.7, 0.65);
  
  float d1 = distance(uv, src1);
  float d2 = distance(uv, src2);
  
  // Wave equations for each source
  float wave1 = sin(d1 * 30.0 - uTime * 1.2);
  float wave2 = sin(d2 * 25.0 - uTime * 0.9);
  
  // Interference: sum of waves → moiré pattern
  float interference = wave1 + wave2;
  
  // Normalize to 0-1
  float normalized = (interference + 2.0) / 4.0;
  
  // Crest detection
  float crest = smoothstep(0.65, 0.9, normalized);
  float trough = 1.0 - smoothstep(0.1, 0.35, normalized);
  
  // Prussian blue base
  vec3 base   = vec3(0.051, 0.106, 0.165);    // #0D1B2A
  // Gold crests
  vec3 gold   = vec3(0.788, 0.659, 0.298);    // #C9A84C
  // Aurora teal troughs
  vec3 teal   = vec3(0.0, 0.447, 0.502);
  
  vec3 color = base;
  color = mix(color, teal, trough * 0.3);
  color = mix(color, gold, crest * 0.7);
  
  // Add shimmer based on time
  float shimmer = sin(uTime * 3.0 + uv.x * 10.0 + uv.y * 8.0) * 0.04;
  color += shimmer;
  
  gl_FragColor = vec4(color, 1.0);
}
