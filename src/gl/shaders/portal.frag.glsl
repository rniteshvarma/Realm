uniform float uTime;
uniform float uHover;
uniform vec2 uResolution;

varying vec2 vUv;

// Pseudo-random noise
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

// 1D noise for rays
float noise1D(float x) {
    float i = floor(x);
    float f = fract(x);
    float u = f * f * (3.0 - 2.0 * f);
    return mix(hash(vec2(i, 0.0)), hash(vec2(i + 1.0, 0.0)), u);
}

void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    
    // Ripple effect on hover
    float ripple = sin(dist * 30.0 - uTime * 8.0) * 0.03 * uHover;
    uv += normalize(toCenter) * ripple;
    
    // Base color
    vec3 color = vec3(0.02, 0.03, 0.05);

    // ── Wireframe Borders ──
    // Creating a grid/wireframe edge
    float edgeThickness = 0.02;
    float mx = min(uv.x, 1.0 - uv.x);
    float my = min(uv.y, 1.0 - uv.y);
    float edgeDist = min(mx, my);
    float border = smoothstep(edgeThickness, 0.0, edgeDist);
    
    // Add grid lines interior
    float gridX = step(0.95, fract(uv.x * 10.0));
    float gridY = step(0.95, fract(uv.y * 10.0));
    float grid = max(gridX, gridY) * 0.1;

    // ── Golden God-rays ──
    float angle = atan(toCenter.y, toCenter.x);
    // Animated rays rotating
    float rayNoise = noise1D(angle * 5.0 + uTime * 0.5) * noise1D(angle * 12.0 - uTime * 0.3);
    // Confine to center
    float rayIntensity = rayNoise * smoothstep(0.5, 0.0, dist);
    
    // Colors
    vec3 gold = vec3(0.788, 0.659, 0.298); // #C9A84C
    vec3 wireframeColor = mix(vec3(0.2), gold, uHover);
    
    color += wireframeColor * border;
    color += wireframeColor * grid;
    color += gold * rayIntensity * (0.5 + uHover * 1.5);

    gl_FragColor = vec4(color, 0.9);
}
