// ── ORB SURFACE: LIVING CIRCUIT BOARD ──
// Animated PCB trace lines with traveling signal pulses

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // dark green / PCB background
uniform vec3 uColor2;  // bright green / gold trace

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

// Grid-aligned trace network
float trace(vec2 uv, float gridSize) {
  vec2 cell = floor(uv * gridSize);
  vec2 local = fract(uv * gridSize);

  // Decide if this cell has a horizontal or vertical trace based on hash
  vec2 h = hash2(cell);

  float traceH = 0.0;
  float traceV = 0.0;

  // Horizontal traces in alternating cells
  if (h.x > 0.35) {
    traceH = 1.0 - smoothstep(0.0, 0.06, abs(local.y - 0.5));
  }
  // Vertical traces in other cells
  if (h.y > 0.35) {
    traceV = 1.0 - smoothstep(0.0, 0.06, abs(local.x - 0.5));
  }

  return max(traceH, traceV);
}

// Signal pulse traveling along a trace
float pulse(vec2 uv, float gridSize, float t) {
  vec2 cell = floor(uv * gridSize);
  vec2 local = fract(uv * gridSize);
  vec2 h = hash2(cell);

  // Pulse travels from 0 to 1 along the trace, seeded per cell
  float speed = 0.8 + h.x * 1.5;
  float phase = h.y * 6.28;
  float pos = fract(t * speed * uSpeed + phase);

  float pulseH = 0.0;
  float pulseV = 0.0;

  if (h.x > 0.35) {
    // Horizontal pulse
    float onTrace = 1.0 - smoothstep(0.0, 0.08, abs(local.y - 0.5));
    float hit = 1.0 - smoothstep(0.0, 0.18, abs(local.x - pos));
    pulseH = onTrace * hit;
  }
  if (h.y > 0.35) {
    // Vertical pulse
    float onTrace = 1.0 - smoothstep(0.0, 0.08, abs(local.x - 0.5));
    float hit = 1.0 - smoothstep(0.0, 0.18, abs(local.y - pos));
    pulseV = onTrace * hit;
  }

  return max(pulseH, pulseV);
}

// Node/via intersection dot
float node(vec2 uv, float gridSize) {
  vec2 local = fract(uv * gridSize);
  vec2 h = hash2(floor(uv * gridSize));
  if (h.x * h.y > 0.5) {
    return 1.0 - smoothstep(0.08, 0.14, length(local - 0.5));
  }
  return 0.0;
}

void main() {
  float t = uTime * 0.5;
  vec2 uv = vUv;

  // Multi-scale circuit grid
  float coarse = trace(uv, 5.0);
  float medium = trace(uv, 12.0);
  float fine   = trace(uv, 24.0);

  float traces = max(coarse * 1.0, max(medium * 0.7, fine * 0.4));

  // Pulses on each scale
  float pulseC = pulse(uv, 5.0,  t);
  float pulseM = pulse(uv, 12.0, t + 1.3);
  float pulseF = pulse(uv, 24.0, t + 2.7);
  float pulses = max(pulseC, max(pulseM * 0.8, pulseF * 0.6));

  // Circuit nodes
  float nodes = max(node(uv, 5.0), node(uv, 12.0));

  // PCB substrate texture — subtle noise
  vec2 h2 = hash2(floor(uv * 80.0));
  float substrate = h2.x * 0.04;

  // Color assembly
  vec3 background = uColor1 * (0.15 + substrate);
  vec3 traceColor = mix(uColor2, vec3(0.4, 0.9, 0.3), 0.5);
  vec3 pulseColor = vec3(1.0, 1.0, 0.5); // gold pulse
  vec3 nodeColor  = vec3(0.8, 0.7, 0.2); // gold nodes

  vec3 col = background;
  col = mix(col, traceColor, traces * 0.7);
  col = mix(col, pulseColor, pulses);
  col += nodeColor * nodes * 0.8;

  // Emissive glow on active traces
  col += traceColor * traces * 0.1;
  col += pulseColor * pulses * 0.8;

  // Rim glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  col += uColor2 * rim * 0.4;

  gl_FragColor = vec4(col, 1.0);
}
