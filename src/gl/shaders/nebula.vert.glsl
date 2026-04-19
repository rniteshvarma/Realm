// nebula.vert.glsl — Realm 5: The Nebula
// Particle morph vertex shader
// Staggered easeInOutCubic lerp between nebula home and morph target

attribute vec3 aCurrentPos;    // nebula home position
attribute vec3 aTargetPos;     // current morph target
attribute vec3 aColor;
attribute float aSize;
attribute float aPhase;        // [0,1] stagger offset per particle
attribute vec3 aVelocity;      // random unit vector for supernova

uniform float uMorphProgress;  // 0.0 → nebula, 1.0 → formed target
uniform float uTime;
uniform float uPixelRatio;
uniform float uSupernovaProgress; // 0.0 → 1.0 during explosion
uniform float uDebriseDecay;      // 1.0=full, 0.0=settled (debris phase)

varying vec3 vColor;
varying float vAlpha;

float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

void main() {
  // ── STAGGERED MORPH ─────────────────────────────────────
  // Each particle arrives at a slightly different time
  float staggeredProgress = clamp(
    (uMorphProgress - aPhase * 0.3) / 0.7,
    0.0, 1.0
  );
  float eased = easeInOutCubic(staggeredProgress);

  // Interpolate nebula home → target shape
  vec3 pos = mix(aCurrentPos, aTargetPos, eased);

  // ── SHIMMER ─────────────────────────────────────────────
  // Particles shimmer more when in nebula state (eased=0)
  float shimmer = sin(uTime * 2.0 + aPhase * 6.28318)
                  * (1.0 - eased) * 0.08;
  pos.x += shimmer;
  pos.y += shimmer * 0.7;

  // ── SUPERNOVA EXPLOSION ─────────────────────────────────
  if (uSupernovaProgress > 0.0) {
    float sp = clamp(uSupernovaProgress, 0.0, 1.0);

    // Each particle flies in its own direction with slight Z-toward-camera bias
    vec3 explodeDir = normalize(aVelocity + vec3(0.0, 0.0, 0.35));
    float speed = 2.0 + length(aVelocity) * 8.0;

    // Momentum decays (particles slow after initial burst)
    float decay = 1.0 - sp * 0.65;
    pos += explodeDir * speed * sp * decay * uDebriseDecay;
  }

  // ── COLOR ────────────────────────────────────────────────
  vColor = aColor;

  // ── ALPHA ────────────────────────────────────────────────
  // Fade in as particle arrives at target; supernova alpha fade
  float baseAlpha = eased * 0.85 + 0.15;
  if (uSupernovaProgress > 0.8) {
    baseAlpha *= 1.0 - (uSupernovaProgress - 0.8) * 2.5; // fade out
    baseAlpha = max(baseAlpha, 0.05);
  }
  vAlpha = clamp(baseAlpha, 0.0, 1.0);

  // ── SIZE ─────────────────────────────────────────────────
  // Larger when fully formed, smaller in nebula cloud
  float sz = aSize * (0.4 + eased * 0.6);

  // Particles rushing toward camera swell in size during supernova
  if (uSupernovaProgress > 0.0) {
    float camward = max(0.0, aVelocity.z);
    sz += camward * uSupernovaProgress * 10.0;
  }

  vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = sz * uPixelRatio * (200.0 / max(-mvPos.z, 0.001));
  gl_PointSize = clamp(gl_PointSize, 0.5, 64.0);
  gl_Position = projectionMatrix * mvPos;
}
