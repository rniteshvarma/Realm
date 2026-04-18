// ── Presence Particle Fragment Shader — THE SÉANCE ─────────────────────
// FIX 8: Exact REALM palette — 4-stop cycle adds --aurora-1 for richness.
//
//   --plasma  #7B2FBE = vec3(0.482, 0.184, 0.745)
//   --sacred  #C9A84C = vec3(0.788, 0.659, 0.298)
//   --neural  #00F5FF = vec3(0.0,   0.961, 1.0)
//   --aurora-1 #B44FE8 = vec3(0.706, 0.310, 0.910)
//
// Cycle: plasma → sacred → neural → aurora → plasma (loop)
// Connects to Gate sigil colors AND Myth Engine aurora ceiling.

uniform float uTime;
varying float vLife;
varying float vAlpha;

void main() {
  // Soft circle
  float d     = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = (1.0 - d * 2.0) * 0.75 * vAlpha;

  // Exact REALM palette (FIX 8)
  vec3 plasma = vec3(0.482, 0.184, 0.745); // --plasma  #7B2FBE
  vec3 sacred = vec3(0.788, 0.659, 0.298); // --sacred  #C9A84C
  vec3 neural = vec3(0.0,   0.961, 1.0);   // --neural  #00F5FF
  vec3 aurora = vec3(0.706, 0.310, 0.910); // --aurora-1 #B44FE8

  // 4-stop cycle
  vec3 col;
  if (vLife < 0.25)
    col = mix(plasma, sacred, vLife / 0.25);
  else if (vLife < 0.50)
    col = mix(sacred, neural, (vLife - 0.25) / 0.25);
  else if (vLife < 0.75)
    col = mix(neural, aurora, (vLife - 0.50) / 0.25);
  else
    col = mix(aurora, plasma, (vLife - 0.75) / 0.25);

  // Boost brightness — additive blending benefits from this
  col *= 1.3;

  gl_FragColor = vec4(col, alpha);
}
