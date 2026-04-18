// ── INTERIOR BIOME: THE ARCHIVE WITHIN ──
// Floating code glyphs in slow rotation — amber + dark red-black

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float hash1(float n) { return fract(sin(n) * 43758.5453123); }
vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),
                        dot(p, vec2(269.5, 183.3)))) * 43758.5453123);
}

// Draw a single glyph as a series of line segments approximating letters
float glyph(vec2 uv, int glyphId) {
  float g = 0.0;
  float w = 0.012;

  if (glyphId == 0) {
    // "{" bracket
    g += 1.0 - smoothstep(0.0, w, length(uv - vec2(0.0, 0.3)));
    g += 1.0 - smoothstep(0.0, w * 0.5, abs(uv.x + 0.2) + max(0.0, abs(uv.y) - 0.25));
  } else if (glyphId == 1) {
    // "/" slash
    float d = abs((uv.x + uv.y * 0.5) / 1.118);
    g += 1.0 - smoothstep(0.0, w, d) * step(-0.3, uv.y) * step(uv.y, 0.3);
    g = 1.0 - smoothstep(0.0, w, d);
  } else if (glyphId == 2) {
    // "0" zero
    float ring = abs(length(uv * vec2(1.0, 1.6)) - 0.28);
    g = 1.0 - smoothstep(0.0, w, ring);
  } else if (glyphId == 3) {
    // "|" pipe
    g = 1.0 - smoothstep(0.0, w, abs(uv.x));
  } else if (glyphId == 4) {
    // ">" chevron
    float d1 = abs(uv.x - abs(uv.y) * 0.8);
    g = 1.0 - smoothstep(0.0, w, d1);
  } else {
    // "-" dash
    float d = max(abs(uv.y), abs(uv.x) - 0.3);
    g = 1.0 - smoothstep(0.0, w, d);
  }
  return clamp(g, 0.0, 1.0);
}

float glyphAt(vec2 uv, vec2 center, float size, int id, float alpha) {
  vec2 local = (uv - center) / size;
  if (abs(local.x) > 0.5 || abs(local.y) > 0.5) return 0.0;
  return glyph(local, id) * alpha;
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2(uv.x * ar, uv.y);
  float t = uTime;

  // Background — very dark red-brown
  vec3 bgColor  = vec3(0.04, 0.01, 0.01);
  vec3 midColor = vec3(0.08, 0.03, 0.02);

  float bgN = fract(sin(dot(floor(uv * 50.0), vec2(12.9, 78.2))) * 4375.8);
  vec3 col = mix(bgColor, midColor, bgN * 0.3);

  // Amber glow from center — like an old lamp in a library
  float lampDist = length(uv - vec2(0.5));
  vec3 ambientGlow = vec3(0.9, 0.5, 0.1) * (0.04 / (lampDist * lampDist + 0.1));
  col += ambientGlow * 0.5;

  // Drifting glyph particles — 40 floating code characters
  vec3 glyphColor = vec3(0.9, 0.55, 0.1);   // amber
  vec3 glyphDim   = vec3(0.35, 0.15, 0.02); // dim orange

  for (int i = 0; i < 40; i++) {
    float fi = float(i);
    vec2 seed = hash2(vec2(fi, 0.0));

    // Non-uniform floating speed and drift direction
    float speed  = 0.005 + seed.x * 0.012;
    float drift  = (seed.y - 0.5) * 0.002;
    float yPhase = t * speed + seed.x * 7.3;

    // Wrap position
    float px = mod(seed.x * ar + drift * t, ar);
    float py = 1.0 - mod(yPhase, 1.0); // fall upward

    // Slow orbital rotation per glyph in local space
    float rotAngle = t * (0.1 + seed.x * 0.2) + seed.y * 6.28;
    vec2 offset = vec2(cos(rotAngle), sin(rotAngle)) * 0.003 * fi;
    vec2 glyphPos = vec2(px, py) + offset;

    // Fade in / out with distance from center
    float distCenter = length(vec2(px / ar, py) - 0.5);
    float alpha = (1.0 - smoothstep(0.2, 0.5, distCenter)) * (0.4 + seed.y * 0.6);

    // Choose glyph type
    int glyphId = int(mod(fi * 3.7, 6.0));

    float size = 0.02 + seed.x * 0.025;
    float g = glyphAt(suv, glyphPos, size, glyphId, alpha);

    vec3 gc = mix(glyphDim, glyphColor, alpha);
    col += gc * g;
    // Glow halo
    float haloDist = length(suv - glyphPos);
    col += glyphColor * (1.0 - smoothstep(0.0, 0.05, haloDist)) * alpha * 0.15;
  }

  // Horizontal depth lines — like shelves in a library
  for (int k = 0; k < 5; k++) {
    float fy = 0.2 + float(k) * 0.16;
    float lineY = abs(uv.y - fy);
    float shelf = (1.0 - smoothstep(0.0, 0.003, lineY)) * 0.2;
    col += vec3(0.3, 0.12, 0.02) * shelf;
  }

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.6;
  col *= clamp(vignette, 0.0, 1.0);

  // Film grain
  float grain = hash1(uv.x * 1097.3 + uv.y * 863.2 + t * 97.1) * 0.05;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
