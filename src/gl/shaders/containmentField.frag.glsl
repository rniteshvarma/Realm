// containmentField.frag.glsl — Forge chamber boundary walls
uniform float uTime;
uniform vec3 uColor;
uniform vec2 uRippleOrigin;
uniform float uRippleTime;
uniform float uPulseSync;
varying vec2 vUv;

float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
}

vec4 hexCoords(vec2 uv) {
  vec2 r = vec2(1.0, 1.73);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  return vec4(gv.x, gv.y,
    round(uv.x - gv.x), round(uv.y - gv.y));
}

void main() {
  vec2 uv = vUv * 20.0;
  vec4 hc = hexCoords(uv);
  float d = hexDist(hc.xy);

  // Only the hex EDGE LINE is visible — interior is completely transparent
  float edgeWidth = 0.02;
  float edge = smoothstep(0.5 - edgeWidth, 0.5, d);

  float pulse = sin(uTime * 0.8 + hc.z * 0.5 + hc.w * 0.3) * 0.5 + 0.5;
  float syncPulse = mix(pulse, sin(uTime * 6.28) * 0.5 + 0.5, uPulseSync);

  // Ripple on wall impact
  float rippleDist = distance(vUv, uRippleOrigin);
  float rippleAge = uTime - uRippleTime;
  float rippleWave = sin(rippleDist * 30.0 - rippleAge * 8.0)
                    * exp(-rippleDist * 4.0) * exp(-rippleAge * 2.0);
  float ripple = max(0.0, rippleWave) * (1.0 - smoothstep(0.0, 3.0, rippleAge));

  // Edge-only emission — zero alpha in hex interior
  float lineAlpha = edge * syncPulse * 0.35 + ripple * edge * 0.5;
  vec3 col = uColor * (0.12 + syncPulse * 0.1 + ripple * 0.3);

  gl_FragColor = vec4(col, lineAlpha);
}
