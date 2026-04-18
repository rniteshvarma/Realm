// voronoiSphere.frag.glsl — Strategy node surface (Voronoi cells)
uniform float uTime;
uniform vec3 uColor;
uniform float uEmissiveIntensity;
varying vec2 vUv;
varying vec3 vNormal;

vec2 hash22(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.xx + p.yx) * p.xy);
}

float voronoi(vec2 uv, float t) {
  vec2 i = floor(uv);
  vec2 f = fract(uv);
  float minDist = 1.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash22(i + neighbor);
      point = 0.5 + 0.5 * sin(t * 0.6 + 6.283 * point);
      float dist = length(neighbor + point - f);
      minDist = min(minDist, dist);
    }
  }
  return minDist;
}

void main() {
  vec2 uv = vUv * 5.0;
  float v = voronoi(uv, uTime);
  float cellLine = smoothstep(0.05, 0.15, v);
  vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
  float diff = max(dot(normalize(vNormal), lightDir), 0.0);
  vec3 col = mix(vec3(0.02), uColor, cellLine) * (diff * 0.5 + 0.3);
  col += uColor * uEmissiveIntensity * cellLine;
  gl_FragColor = vec4(col, 1.0);
}
