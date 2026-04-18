// ── INTERIOR BIOME: LIQUID METAL ──
// Churning metallic fluid — silver/gunmetal with gold veins

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.1;
    a *= 0.5;
  }
  return v;
}

// Specular reflections of an imaginary light source
float specular(vec2 uv, vec2 lightPos, float roughness) {
  vec2 toLight = normalize(lightPos - uv);
  float d = length(lightPos - uv);
  float spec = pow(max(0.0, 1.0 - d * roughness), 8.0);
  return spec;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12; // slow, viscous

  // Domain-warped fluid surface
  vec2 q = vec2(fbm(uv * 3.0 + t),
                fbm(uv * 3.0 + vec2(3.7, 1.9) + t * 0.8));

  vec2 r = vec2(fbm(uv * 2.5 + 1.5 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv * 2.5 + 1.5 * q + vec2(8.3, 2.8) + t * 0.3));

  float f = fbm(uv * 2.0 + 2.0 * r + t);
  f = f * 0.5 + 0.5;

  // Metallic color palette
  vec3 gunmetal = vec3(0.10, 0.11, 0.13);
  vec3 silver   = vec3(0.70, 0.72, 0.75);
  vec3 chrome   = vec3(0.85, 0.87, 0.90);
  vec3 gold     = vec3(0.85, 0.72, 0.25);
  vec3 deepMetal= vec3(0.04, 0.05, 0.06);

  vec3 col = mix(deepMetal, gunmetal, smoothstep(0.0, 0.4, f));
  col = mix(col, silver,   smoothstep(0.4, 0.65, f));
  col = mix(col, chrome,   smoothstep(0.65, 0.85, f));

  // Gold veins — narrow threshold bands of gold
  float vein1 = 1.0 - smoothstep(0.0, 0.015, abs(f - 0.38));
  float vein2 = 1.0 - smoothstep(0.0, 0.020, abs(f - 0.52));
  float vein3 = 1.0 - smoothstep(0.0, 0.012, abs(f - 0.66));
  float veins = max(vein1, max(vein2, vein3));

  col = mix(col, gold, veins * 1.5);
  col += gold * veins * 0.5; // emissive bleeding

  // Moving specular highlights from shifting virtual lights
  vec2 light1 = vec2(0.3 + sin(t * 0.7) * 0.3, 0.6 + cos(t * 0.5) * 0.2);
  vec2 light2 = vec2(0.7 + cos(t * 0.4) * 0.2, 0.3 + sin(t * 0.6) * 0.3);
  float spec1 = specular(uv, light1, 3.0);
  float spec2 = specular(uv, light2, 4.0);
  col += chrome * (spec1 * 0.6 + spec2 * 0.4);

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.2;
  col *= clamp(vignette, 0.2, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
