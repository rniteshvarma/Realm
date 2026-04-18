uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Utility to generate procedural noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

// Simplex noise implementation structure
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractional Brownian Motion (fbm) for domain warping
float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Parallax mouse effect pushing coordinates
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    
    vec2 mouseEffect = (uMouse - 0.5) * 0.5;
    st += mouseEffect;

    // Time variation
    float t = uTime * 0.2;

    // Domain warping
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*t);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*t );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*t);

    float f = fbm(st+r);

    // Color mixing based on design system
    // --void: #000000
    // --plasma: #7B2FBE (electric purple)
    // --neural: #00F5FF (neon teal)
    // --burn: #FF2D2D (bleeding red)
    
    vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.482, 0.184, 0.745), clamp((f*f)*4.0,0.0,1.0));
    color = mix(color, vec3(0.0, 0.96, 1.0), clamp(length(q),0.0,1.0));
    color = mix(color, vec3(1.0, 0.176, 0.176), clamp(length(r.x),0.0,1.0));

    // Darken outer edges
    float vignette = length(vUv - 0.5);
    color *= smoothstep(0.8, 0.2, vignette);

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}

