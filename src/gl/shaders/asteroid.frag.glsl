// asteroid.frag.glsl — Realm VIII: The Boneyard
// PBR-style asteroid material: Voronoi rock fractures, magma veins,
// ice patches, rim lighting, proximity-driven text glow.

precision highp float;

uniform float uTime;
uniform vec3  uLightDir;
uniform vec3  uGlowColor;    // --neural teal (#00F5FF)
uniform vec3  uVeinColor;    // --sacred gold (#C9A84C)
uniform float uTextGlow;     // 0.0 → 1.0, proximity-driven
uniform float uSeed;

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

// ── Utility ─────────────────────────────────────────────────────────

float hash1(float n) { return fract(sin(n) * 43758.5453123); }

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)),
           dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash1(dot(i, vec2(1.0, 57.0)));
  float b = hash1(dot(i + vec2(1,0), vec2(1.0, 57.0)));
  float c = hash1(dot(i + vec2(0,1), vec2(1.0, 57.0)));
  float d = hash1(dot(i + vec2(1,1), vec2(1.0, 57.0)));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// ── Voronoi for rock fracture pattern ─────────────────────────────

vec2 voronoi(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float minDist   = 8.0;
  vec2  minPoint  = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point    = hash2(i + neighbor);
      vec2 diff     = neighbor + point - f;
      float d       = length(diff);
      if (d < minDist) {
        minDist  = d;
        minPoint = point;
      }
    }
  }
  return vec2(minDist, minPoint.x);
}

// ── Main ─────────────────────────────────────────────────────────

void main() {
  // BASE ROCK TEXTURE
  vec2 vor       = voronoi(vUv * 8.0 + uSeed);
  float fractures = smoothstep(0.06, 0.12, vor.x);

  float roughness = noise(vUv * 12.0) * 0.5
                  + noise(vUv * 24.0) * 0.3
                  + noise(vUv * 48.0) * 0.2;

  vec3 rockDark  = vec3(0.11, 0.08, 0.06);   // #1C1410
  vec3 rockLight = vec3(0.29, 0.22, 0.16);   // #4A3828
  vec3 baseColor = mix(rockDark, rockLight, roughness);
  baseColor     *= mix(0.7, 1.0, fractures);

  // MAGMA VEINS — gold seams
  float veinMask = 1.0 - smoothstep(0.02, 0.06, vor.x);
  float veinGlow = sin(uTime * 0.8 + vor.y * 6.28) * 0.3 + 0.7;
  vec3  veinCol  = uVeinColor * veinMask * veinGlow * 0.4;

  // ICE PATCHES — aurora-2 facets
  float iceMask  = step(0.85, noise(vUv * 6.0 + uSeed));
  vec3  iceCol   = vec3(0.31, 0.67, 0.91) * iceMask * 0.3;

  // DIFFUSE LIGHTING
  float NdotL  = max(0.0, dot(normalize(vNormal), normalize(uLightDir)));
  float ambient = 0.12;
  float diffuse = NdotL * 0.7 + ambient;

  // RIM LIGHT — teal edge
  vec3  viewDir = normalize(-vWorldPos);
  float rim     = pow(1.0 - max(0.0, dot(normalize(vNormal), viewDir)), 3.0);
  vec3  rimCol  = vec3(0.0, 0.96, 1.0) * rim * 0.15;

  // TEXT GLOW — proximity-activated etching
  float textPattern = step(0.7, noise(vUv * 20.0 + uSeed));
  vec3  textGlowCol = uGlowColor * textPattern * uTextGlow * 1.8;

  // COMBINE
  vec3 col = baseColor * diffuse
           + veinCol
           + iceCol
           + rimCol
           + textGlowCol;

  gl_FragColor = vec4(col, 1.0);
}
