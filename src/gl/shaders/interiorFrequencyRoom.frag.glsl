// ── INTERIOR BIOME: FREQUENCY ROOM ──
// 3D oscilloscope waveforms exploded in space — teal + ultraviolet

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2((uv.x - 0.5) * ar, uv.y - 0.5);

  // Background
  vec3 bgDeep = vec3(0.01, 0.03, 0.08);
  vec3 col = bgDeep;

  // Draw waveform layers — each at a different Y offset and frequency
  vec3 teal    = vec3(0.00, 0.85, 0.80);
  vec3 uv_color= vec3(0.55, 0.00, 1.00); // ultraviolet
  vec3 cyan    = vec3(0.20, 1.00, 0.90);
  vec3 white   = vec3(0.90, 0.95, 1.00);

  float waveSum = 0.0;
  float glowSum = 0.0;

  // 7 oscilloscope lines at different frequencies + phases
  for (int i = 0; i < 7; i++) {
    float fi = float(i);

    float yOffset   = -0.35 + fi * 0.12;
    float freq1     = 3.0 + fi * 1.7;
    float freq2     = 7.0 + fi * 2.3;
    float speed1    = 0.8 + fi * 0.3;
    float speed2    = 1.3 + fi * 0.2;
    float amplitude = 0.04 + fi * 0.005;

    // Compound waveform: two sine waves beating together
    float wave = sin(suv.x * freq1 + t * speed1) * amplitude
               + sin(suv.x * freq2 - t * speed2 + fi * 1.1) * amplitude * 0.5;

    float dy = suv.y - yOffset - wave;

    float lineW = 0.004;
    float glowW = 0.025;
    float line = 1.0 - smoothstep(0.0, lineW, abs(dy));
    float glow = 1.0 - smoothstep(0.0, glowW, abs(dy));

    // Alternate color between teal and ultraviolet
    vec3 waveColor = mix(teal, uv_color, fi / 7.0);
    vec3 glowColor = mix(cyan, uv_color * 0.5, fi / 7.0);

    col += waveColor * line * 1.5;
    col += glowColor * glow * 0.15;

    waveSum += line;
    glowSum += glow;
  }

  // Lissajous figure overlay — infinity loop shape in center
  float lx = sin(t * 2.0) * 0.25;
  float ly = sin(t * 1.0 + 1.5708) * 0.12;
  vec2 lissPos = vec2(lx, ly);
  float lissD = length(suv - lissPos);
  float lissCursor = 1.0 - smoothstep(0.0, 0.008, lissD);
  float lissGlow   = 1.0 - smoothstep(0.0, 0.04, lissD);
  col += white * lissCursor * 2.0;
  col += cyan  * lissGlow   * 0.4;

  // Frequency grid — thin horizontal reference lines
  float gridY = mod(uv.y * 10.0, 1.0);
  float gridLine = 1.0 - smoothstep(0.0, 0.01, abs(gridY - 0.5));
  col += vec3(0.02, 0.05, 0.10) * gridLine;

  // Vertical scan line (moving)
  float scanX = fract(t * 0.3) * ar - ar * 0.5;
  float scanD = abs(suv.x - scanX);
  float scanLine = (1.0 - smoothstep(0.0, 0.003, scanD)) * 0.3;
  col += teal * scanLine;
  col += teal * (1.0 - smoothstep(0.0, 0.05, scanD)) * 0.05;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.3;
  col *= clamp(vignette, 0.0, 1.0);

  // CRT scanline texture
  float scanRow = sin(uv.y * uResolution.y * 1.5 + t * 0.5) * 0.015;
  col -= scanRow;

  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
}
