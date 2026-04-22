// asteroid.vert.glsl — Realm VIII: The Boneyard
// Passthrough vertex shader with world-space outputs for asteroid fragment

varying vec3 vNormal;
varying vec3 vWorldPos;
varying vec2 vUv;

void main() {
  vUv        = uv;
  vNormal    = normalize(normalMatrix * normal);
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorldPos  = world.xyz;
  gl_Position = projectionMatrix * viewMatrix * world;
}
