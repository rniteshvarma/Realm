// forgeBlobFrag.glsl — Lit material for morphing blob
uniform vec3 uColor;
uniform float uEmissiveIntensity;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
  float diff = max(dot(normalize(vNormal), lightDir), 0.0);
  vec3 emissive = uColor * uEmissiveIntensity;
  vec3 col = uColor * (diff * 0.5 + 0.3) + emissive;
  gl_FragColor = vec4(col, 1.0);
}
