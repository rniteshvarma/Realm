// voidFractal.frag.glsl — Realm IX infinite zoom
// Mandelic / Julia hybrid zoom with gold/black palette
// Designed for the hidden final phase.

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

// Palette: endless gold bleeding into pitch black
vec3 palette(float t) {
  vec3 a = vec3(0.0, 0.0, 0.0);       // Pitch black
  vec3 b = vec3(0.788, 0.659, 0.298); // Gold #C9A84C
  vec3 c = vec3(1.0, 1.0, 1.0);       // White core
  vec3 d = vec3(0.2, 0.1, 0.0);       // Burned shadows
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
  vec2 uv0 = uv;

  // Infinite zoom effect
  float zoom = exp(-uTime * 0.2); 
  uv *= zoom;
  
  // Mouse slight parallax pan
  uv += (uMouse - 0.5) * 0.5 * zoom;

  // Fractal iteration
  vec3 finalColor = vec3(0.0);
  
  for(float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;
    
    // Smooth geometric folding
    float d = length(uv) * exp(-length(uv0));
    
    vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.4);
    
    d = sin(d * 8.0 + uTime) / 8.0;
    d = abs(d);
    
    // High contrast glow
    d = pow(0.01 / d, 1.2);
    
    finalColor += col * d;
  }
  
  // Deep vignette
  float vignette = smoothstep(1.5, 0.1, length(uv0));
  finalColor *= vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
