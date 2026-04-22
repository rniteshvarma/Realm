uniform float uTime;
uniform sampler2D tDiffuse; 
uniform float uClarity; // 0.0 (distorted) to 1.0 (clear)
uniform vec2 uHandPos; // normalized handprint position
uniform float uHandIntensity; // bloom intensity
uniform float uOpacity; 
varying vec2 vUv;

void main() {
    float time = uTime * 0.8;
    
    // Idle state: mercury distortion
    float pulse = sin(time) * 0.003;
    float ripple = sin(vUv.y * 12.0 + time * 1.5) * 0.002;
    
    // As uClarity approaches 1.0, distortion approaches 0
    float distortionLevel = 1.0 - uClarity;
    vec2 distorted = vUv + vec2(ripple, pulse) * distortionLevel;
    
    // Heat/Handprint Bloom 
    float distToHand = distance(distorted, uHandPos);
    float handInfluence = smoothstep(0.2, 0.0, distToHand) * uHandIntensity;
    
    // Invert distortion near handprint to make it crystal clear there
    distorted = mix(distorted, vUv, handInfluence);

    vec4 reflection = texture2D(tDiffuse, distorted);
    vec4 tint = vec4(0.85, 0.90, 1.0, 1.0); // cool silver tint
    
    // Vignette
    float vignette = smoothstep(0.0, 0.5, distance(vUv, vec2(0.5)) * 1.4);
    
    vec4 baseColor = mix(reflection * tint, vec4(0.03, 0.04, 0.08, 1.0), vignette * 0.6);
    
    // Add golden bloom from handprint
    vec3 gold = vec3(0.788, 0.659, 0.298); // #C9A84C
    vec4 finalColor = baseColor + vec4(gold * handInfluence * 1.5, 0.0);
    
    gl_FragColor = vec4(finalColor.rgb, finalColor.a * uOpacity);
}
