uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;
uniform float uCollapse;
uniform float uBang;

attribute vec3 aOriginalPosition;
attribute float aRandom;

varying float vRandom;
varying vec2 vUv;

void main() {
  vRandom = aRandom;
  vUv = uv;

  // Explosion effect based on time and random
  vec3 explodedPos = position + vec3(
    sin(aRandom * 10.0 + uTime) * (1.0 - uProgress) * 20.0 * aRandom,
    cos(aRandom * 10.0 + uTime) * (1.0 - uProgress) * 20.0 * aRandom,
    sin(aRandom * 5.0) * (1.0 - uProgress) * 15.0
  );

  // Smoothly lerp towards original ordered text position
  vec3 finalPos = mix(explodedPos, aOriginalPosition, uProgress);

  // Slight floaty movement even when assembled
  finalPos.x += sin(uTime * 2.0 + aOriginalPosition.y) * 0.1 * uProgress;
  finalPos.y += cos(uTime * 1.5 + aOriginalPosition.x) * 0.1 * uProgress;
  
  // Singularity: spiral every particle into one burning point
  float c = smoothstep(0.0, 1.0, uCollapse);
  float ang = c * (2.5 + aRandom * 4.0);
  mat2 rot = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
  finalPos.xy = rot * finalPos.xy;
  finalPos *= (1.0 - c);

  // Big Bang: blast outward along a per-particle direction
  vec3 dir = normalize(vec3(aOriginalPosition.xy + vec3(aRandom - 0.5).xy * 4.0, (aRandom - 0.5) * 6.0) + 0.0001);
  finalPos += dir * uBang * uBang * (40.0 + 90.0 * aRandom);

  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);

  // Size attenuation (DPR-aware so the name reads on retina screens)
  gl_PointSize = (28.0 * aRandom + 22.0) * (1.0 + uBang * 2.5) * uPixelRatio * (1.0 / max(-mvPosition.z, 0.5));
  gl_Position = projectionMatrix * mvPosition;
}
