// runeEtching.glsl — Myth Engine monolith surfaces
// Moving rune/circuit patterns illuminating from within, like light engraving

uniform float uTime;
uniform float uGlow;     // 0-1, increases when monolith is active
uniform vec3 uRuneColor; // gold or teal depending on monolith

varying vec2 vUv;

// Simple hash for pseudo-random circuit patterns
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Circuit line pattern
float circuit(vec2 uv, float scale) {
  uv *= scale;
  vec2 id = floor(uv);
  vec2 gv = fract(uv);
  
  float h = hash(id);
  float h2 = hash(id + vec2(1.0, 0.0));
  float h3 = hash(id + vec2(0.0, 1.0));
  
  // Horizontal lines
  float hLine = smoothstep(0.02, 0.0, abs(gv.y - 0.5)) * step(h, 0.6);
  // Vertical lines
  float vLine = smoothstep(0.02, 0.0, abs(gv.x - 0.5)) * step(h2, 0.5);
  // Node dots at junctions
  float node = smoothstep(0.08, 0.0, length(gv - 0.5)) * step(h3, 0.3);
  
  return max(max(hLine, vLine), node);
}

// Rune-like shapes
float rune(vec2 uv) {
  // Scrolling rune field
  uv.y -= uTime * 0.08;
  uv.x += sin(uv.y * 3.0) * 0.02;
  
  float c1 = circuit(uv, 8.0);
  float c2 = circuit(uv * 1.3 + vec2(2.7, 1.1), 5.0) * 0.6;
  float c3 = circuit(uv * 0.7 + vec2(0.4, 2.3), 12.0) * 0.4;
  
  return max(max(c1, c2), c3);
}

void main() {
  vec2 uv = vUv;
  
  float runePattern = rune(uv);
  
  // Active glow pulse
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  float intensity = runePattern * (0.3 + uGlow * 0.7 + pulse * uGlow * 0.3);
  
  // Base: dark obsidian
  vec3 base = vec3(0.02, 0.02, 0.025);
  vec3 color = base + uRuneColor * intensity;
  
  // Edge rim light
  float rim = (1.0 - smoothstep(0.0, 0.08, uv.x)) +
              (1.0 - smoothstep(0.92, 1.0, uv.x)) +
              (1.0 - smoothstep(0.0, 0.05, uv.y)) +
              (1.0 - smoothstep(0.95, 1.0, uv.y));
  color += uRuneColor * rim * 0.08 * (uGlow + 0.2);
  
  gl_FragColor = vec4(color, 1.0);
}
