varying vec2 vUv;
varying vec3 vNormal;

uniform float uTime;

void main() {
    vUv = uv;
    vNormal = normal;

    // A subtle breathing effect on the vertex level to give the portal life
    vec3 updatedPosition = position;
    updatedPosition.z += sin(position.x * 2.0 + uTime * 2.0) * 0.05;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(updatedPosition, 1.0);
}
