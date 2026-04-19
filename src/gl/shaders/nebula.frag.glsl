// nebula.frag.glsl — Realm 5: The Nebula
// Soft circular particle with additive glow falloff

varying vec3 vColor;
varying float vAlpha;

void main() {
  // Distance from particle center (gl_PointCoord goes 0→1)
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // Discard outside the circle
  if (d > 0.5) discard;

  // Soft glowing edge — not a hard circle
  float alpha = (1.0 - d * 2.0);
  alpha = pow(alpha, 1.5); // sharpen center glow
  alpha *= vAlpha;

  // Bright core — true star-like glow
  float core = max(0.0, 1.0 - d * 4.0);
  vec3 col = vColor + core * vColor * 0.6;

  gl_FragColor = vec4(col, alpha * 0.9);
}
