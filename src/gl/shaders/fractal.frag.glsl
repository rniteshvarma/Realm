precision highp float;

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= uResolution.x / uResolution.y;
    
    // Zoom and pan
    float zoom = 0.5 + 0.5 * sin(uTime * 0.2);
    uv *= zoom;
    uv += vec2(-0.5, 0.0);
    
    vec2 c = uv;
    vec2 z = vec2(0.0);
    float iter = 0.0;
    const float maxIter = 64.0;
    
    for(float i = 0.0; i < maxIter; i++) {
        z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
        if(length(z) > 4.0) break;
        iter++;
    }
    
    float f = iter / maxIter;
    
    // Color mapping
    vec3 color = vec3(0.0);
    if(iter < maxIter) {
        color = vec3(0.1, 0.8, 0.5) * f + vec3(0.0, 0.2, 0.1) * (1.0 - f);
        color += 0.2 * sin(vec3(1.0, 2.0, 3.0) * f * 10.0 + uTime);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
