// ── STAR FIELD FRAGMENT SHADER ──

varying float vBrightness;
varying float vWarp;

void main() {
  // Round star disc
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // Static star: soft circular glow
  float star = 1.0 - smoothstep(0.0, 0.5, d);
  star = pow(star, 2.5) * vBrightness;

  // Warp: elongated streak (horizontal streak on the gl_PointCoord plane)
  // When warpStrength is high, stars become horizontal streaks
  float warpStar = (1.0 - smoothstep(0.0, 0.5, abs(uv.y))) // narrow vertical
                 * (1.0 - smoothstep(0.0, 0.5, abs(uv.x) * (1.0 - vWarp * 0.9)));
  warpStar *= vBrightness;

  float brightness = mix(star, warpStar, vWarp);

  // Color — slightly warm white for near stars, blue for far
  vec3 color = mix(vec3(0.85, 0.90, 1.00), vec3(1.00, 0.98, 0.92), vBrightness);

  // Warp color shift — cyan tinge during warp
  color = mix(color, vec3(0.60, 0.90, 1.00), vWarp * 0.6);

  gl_FragColor = vec4(color * brightness, brightness);
}
