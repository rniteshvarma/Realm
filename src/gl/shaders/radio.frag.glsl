uniform float uTime;
uniform vec2 uResolution;
uniform float uPulseSpeed;
uniform float uInverted;   // 0.0 = normal, 1.0 = morse-inverted (Egg 2)

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy / uResolution.xy;
    st = st * 2.0 - 1.0;
    st.x *= uResolution.x / uResolution.y;

    float d = length(st);
    
    // Wave calculations
    float wave = sin(d * 20.0 - uTime * uPulseSpeed);
    
    // Smooth the wave for cleaner rings
    float wavePeak = smoothstep(0.8, 1.0, wave);
    float waveTrough = 1.0 - smoothstep(-1.0, -0.5, wave);
    
    // Add noise interference
    float noise = random(st * 100.0 + uTime * 0.1) * 0.15;
    
    // Center glow + wave intensity + falloff
    float glow = 0.1 / (d * d + 0.1);
    float finalWave = wavePeak * glow;
    
    // Dark Heaven palette — gold crests, warm decay
    // Peak color: gold (#C9A84C)
    vec3 goldColor = vec3(0.788, 0.659, 0.298);
    // Trough / body: warm white fading to void
    vec3 ghostColor = vec3(0.94, 0.94, 0.94);
    
    // Blend: gold at crests, near-white in body, dark in troughs
    vec3 color = mix(ghostColor * 0.15, goldColor, wavePeak) * glow;
    color += goldColor * 0.4 * noise * glow;

    // Morse inversion (Egg 2) — inverts to show hidden pattern
    if (uInverted > 0.5) {
        float morse = step(0.6, abs(sin(d * 8.0 - uTime * 0.5)));
        vec3 morseColor = vec3(0.788, 0.659, 0.298) * morse * (1.0 - d * 0.5);
        color = morseColor;
    }
    
    // Vignette
    color *= smoothstep(2.0, 0.0, d);

    gl_FragColor = vec4(color, 1.0);
}
