import * as THREE from 'three'

// Shared procedural planet shader: bands + turbulence + terminator + rim.
// Every world in the voyage uses it with its own palette so they read as
// one universe.
const VERT = /* glsl */`
  varying vec3 vN; varying vec3 vP; varying vec3 vW;
  void main() {
    vN = normalize(normalMatrix * normal);
    vP = position;
    vW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const FRAG = /* glsl */`
  uniform float uTime;
  uniform vec3 uSun;          // world-space sun position
  uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uAtmo;
  uniform float uBands; uniform float uTurb; uniform float uSeed; uniform float uGlow;
  varying vec3 vN; varying vec3 vP; varying vec3 vW;
  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); vec3 u = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), u.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), u.x), u.y),
               mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), u.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), u.x), u.y), u.z);
  }
  float fbm(vec3 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.07; a *= 0.5; } return v; }
  void main() {
    vec3 n = normalize(vP);
    float t = fbm(n * 3.0 + vec3(uSeed, uTime * 0.02, 0.0));
    float bands = sin(n.y * uBands + t * uTurb) * 0.5 + 0.5;
    vec3 col = mix(uA, uB, bands);
    col = mix(col, uC, smoothstep(0.55, 0.8, fbm(n * 7.0 + uSeed + uTime * 0.01)) * 0.55);
    vec3 N = normalize(vN);
    vec3 L = normalize(uSun - vW);
    vec3 V = normalize(cameraPosition - vW);
    float diff = clamp(dot(normalize((viewMatrix * vec4(L, 0.0)).xyz), N), 0.0, 1.0);
    float rim = pow(1.0 - abs(dot(N, normalize((viewMatrix * vec4(V, 0.0)).xyz))), 2.5);
    vec3 lit = col * (0.05 + diff * 1.1) + uAtmo * rim * (0.25 + diff * 0.9) + col * uGlow;
    gl_FragColor = vec4(lit, 1.0);
  }
`

export function makePlanetMaterial({ a, b, c, atmo, bands = 14, turb = 3, seed = 1, glow = 0 }) {
  return new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uSun: { value: new THREE.Vector3(-200, 60, 120) },
      uA: { value: new THREE.Color(a) }, uB: { value: new THREE.Color(b) }, uC: { value: new THREE.Color(c) },
      uAtmo: { value: new THREE.Color(atmo) },
      uBands: { value: bands }, uTurb: { value: turb }, uSeed: { value: seed }, uGlow: { value: glow },
    },
  })
}
