precision highp float;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = vUv;
    uv.y -= uTime * 0.05; // slow upward drift
    
    // Circuit/Nerve pattern
    float pattern = 0.0;
    vec2 grid = fract(uv * vec2(10.0, 20.0)) - 0.5;
    vec2 id = floor(uv * vec2(10.0, 20.0));
    
    float h = hash(id);
    if (h > 0.7) {
        float line = smoothstep(0.02, 0.0, abs(grid.x) - 0.01) + smoothstep(0.02, 0.0, abs(grid.y) - 0.01);
        pattern = line * h * (0.5 + 0.5 * sin(uTime + h * 10.0));
    }
    
    vec3 color = mix(vec3(0.02, 0.02, 0.05), vec3(0.788, 0.659, 0.298), pattern * 0.4);
    gl_FragColor = vec4(color, 1.0);
}
