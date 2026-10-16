uniform float uTime;
uniform float uProgress;
uniform float uPixelRatio;

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
  
  vec4 mvPosition = modelViewMatrix * vec4(finalPos, 1.0);
  
  // Size attenuation (DPR-aware so the name reads on retina screens)
  gl_PointSize = (28.0 * aRandom + 22.0) * uPixelRatio * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
