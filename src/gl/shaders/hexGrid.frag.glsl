// hexGrid.glsl — The Frequency realm floor
// Audio-reactive hexagon grid — illuminates per spectrum analyzer data

uniform float uTime;
uniform vec2 uResolution;
uniform float uAnalyser[64];   // frequency bin data (0-1)
uniform vec3 uSegmentColor;    // current segment color interpolated per scroll

varying vec2 vUv;

// Hexagonal grid coordinate system
vec2 hexCenter(vec2 p, float s) {
  vec2 q = vec2(p.x / s, p.y / s);
  float col = floor(q.x);
  float row = floor(q.y);
  if (mod(col, 2.0) > 0.5) row -= 0.5;
  vec2 center = vec2(col * s, row * s);
  if (mod(col, 2.0) > 0.5) center.y += s * 0.5;
  return center;
}

float hexDist(vec2 p) {
  p = abs(p);
  float c = dot(p, normalize(vec2(1.0, 1.73)));
  c = max(c, p.x);
  return c;
}

void main() {
  vec2 uv = vUv;
  uv -= 0.5;
  uv.x *= uResolution.x / uResolution.y;
  
  float scale = 0.055;
  
  // Hex grid
  vec2 hUv = uv / scale;
  vec2 gv = fract(hUv) - 0.5;
  vec2 id = floor(hUv);
  
  // Hex shape
  float hd = hexDist(gv);
  float hexShape = 1.0 - step(0.44, hd);
  
  // Map hex cell to analyser bin
  float binIdx = mod(abs(id.x) + abs(id.y) * 7.0, 63.0);
  int iIdx = int(binIdx);
  float binVal = uAnalyser[iIdx];
  
  // Time-driven pulse for visual interest even without audio
  float idlePulse = sin(uTime * 1.5 + id.x * 0.4 + id.y * 0.6) * 0.5 + 0.5;
  float energy = max(binVal, idlePulse * 0.15);
  
  // Colors
  vec3 dark = vec3(0.02, 0.03, 0.06);
  vec3 lit  = uSegmentColor;
  
  // Edge glow
  float edge = smoothstep(0.40, 0.44, hd);
  vec3 edgeColor = lit * 0.2 * energy;
  
  vec3 color = mix(dark, lit * energy, hexShape);
  color = mix(color, edgeColor, edge * 0.5);
  
  // Scroll-based brightness
  float alpha = hexShape > 0.0 ? 1.0 : 0.0;
  
  gl_FragColor = vec4(color, alpha + edge * 0.3);
}
