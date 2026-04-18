// ── Floor Hex Grid Shader — THE SÉANCE ─────────────────────────────────
// FIX 2: Replace warm wood grain with obsidian hex grid.
// Base: --heaven-deep dark (#040608 → vec3(0.04,0.06,0.10))
// Grid lines: --neural teal (#00F5FF) — matches Realm 2 Forge + Realm 6 Frequency.
// Very dim — this is a floor, not a wall.

uniform float uTime;
varying vec2 vUv;

// Hex grid helpers — same logic as The Forge containment walls
vec4 hexCoords(vec2 uv) {
  vec2 r = vec2(1.0, 1.732);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  float x = atan(gv.x, gv.y);
  float y = 0.5 - length(gv);
  vec2 id = uv - gv;
  return vec4(x, y, id.x, id.y);
}

float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.732))), p.x);
}

void main() {
  vec2 uv = vUv * 12.0;
  vec4 hc = hexCoords(uv);
  float d = hexDist(hc.xy);
  float edge = smoothstep(0.46, 0.5, d);

  // Per-cell pulse — faint, slow
  float pulse = sin(uTime * 0.4 + hc.z * 0.3) * 0.5 + 0.5;

  // --neural (#00F5FF) grid lines, very dim — floor not ceiling
  vec3 gridCol = vec3(0.0, 0.961, 1.0) * edge * pulse * 0.055;

  // --heaven-deep dark base
  vec3 base = vec3(0.04, 0.06, 0.10);

  gl_FragColor = vec4(base + gridCol, 1.0);
}
