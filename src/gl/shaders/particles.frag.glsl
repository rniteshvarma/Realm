varying float vRandom;
varying vec2 vUv;

void main() {
  // Make particles circular
  float dist = distance(gl_PointCoord, vec2(0.5));
  if (dist > 0.5) discard;

  // Inner glow effect
  float alpha = smoothstep(0.5, 0.1, dist);
  
  // High-intensity palette for maximum visibility on black
  vec3 color = mix(vec3(0.98, 0.98, 1.0), vec3(0.0, 0.9, 1.0), vRandom * 0.4);

  gl_FragColor = vec4(color, alpha * (0.6 + vRandom * 0.4));
}
