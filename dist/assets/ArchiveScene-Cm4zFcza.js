import{r as s,y as a,x as h,v as n,z as j,u as g,K as d,s as v,V as x}from"./index-DBOsFBil.js";import{P}from"./PerspectiveCamera-D6Div83k.js";import"./Fbo-Dc-_Sk56.js";const A=`varying vec2 vUv;
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
`,T=`uniform float uTime;
uniform float uHover;
uniform vec2 uResolution;

varying vec2 vUv;

// Simple 2D noise for the ripple distortion
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = vUv;
    
    // Create a distortion effect based on distance to center and time, amplified by hover
    vec2 center = vec2(0.5);
    float dist = distance(uv, center);
    
    float ripple = sin(dist * 20.0 - uTime * 5.0) * 0.05 * uHover;
    uv += normalize(uv - center) * ripple;

    // Base color for the portal, slightly metallic dark
    vec3 color = vec3(0.05, 0.05, 0.08);

    // Edge glowing
    float glow = smoothstep(0.5, 0.3, dist);
    color = mix(color, vec3(0.2, 0.2, 0.3), glow * 0.5);
    
    // Add some noise
    color += random(uv * 100.0 + uTime) * 0.03;

    gl_FragColor = vec4(color, 1.0);
}
`;function u({position:o,type:e}){const r=s.useRef(),t=s.useRef(),[c,l]=s.useState(!1),f=s.useMemo(()=>({uTime:{value:0},uHover:{value:0},uResolution:{value:new x(window.innerWidth,window.innerHeight)}}),[]);v(i=>{t.current&&(t.current.uniforms.uTime.value=i.clock.elapsedTime,t.current.uniforms.uHover.value+=(c?1:0-t.current.uniforms.uHover.value)*.1)}),v(i=>{r.current&&(r.current.position.y=o[1]+Math.sin(i.clock.elapsedTime+o[0])*.2)});const p=a(i=>i.setActiveProject),m=a(i=>i.activeProject);return n.jsxs("mesh",{ref:r,position:o,onPointerOver:()=>l(!0),onPointerOut:()=>l(!1),onClick:i=>{i.stopPropagation(),p({id:e,title:e,position:o})},visible:!m||m.id===e,children:[n.jsx("planeGeometry",{args:[3,2,32,32]}),n.jsx("shaderMaterial",{ref:t,vertexShader:A,fragmentShader:T,uniforms:f,transparent:!0})]})}function w(){const{camera:o}=g(),e=a(c=>c.activeProject),r=s.useRef(new d(0,0,5)),t=s.useRef(new d(0,0,0));return v((c,l)=>{e?(r.current.set(e.position[0],e.position[1],e.position[2]+1.5),t.current.set(e.position[0],e.position[1],e.position[2])):(r.current.set(0,0,5),t.current.set(0,0,0)),o.position.lerp(r.current,.1)}),n.jsx(P,{makeDefault:!0,position:[0,0,5],fov:45})}function C(){const o=s.useRef(null),e=a(t=>t.activeProject),r=a(t=>t.setActiveProject);return s.useEffect(()=>{const t=h.timeline({scrollTrigger:{trigger:o.current,start:"top bottom",end:"bottom top",scrub:!0}});return()=>t.kill()},[]),n.jsxs("div",{className:"archive-container",ref:o,children:[n.jsx("h2",{className:`archive-title ${e?"hidden":""}`,children:"THE ARCHIVE"}),n.jsx("div",{className:"archive-canvas-wrapper",children:n.jsxs(j,{dpr:[1,2],children:[n.jsx(w,{}),n.jsx("ambientLight",{intensity:.5}),n.jsx(u,{position:[-4,1,-2],type:"Project ALPHA"}),n.jsx(u,{position:[4,-1,-3],type:"Project BETA"}),n.jsx(u,{position:[0,-3,-5],type:"Project GAMMA"})]})}),e&&n.jsx("button",{className:"portal-close-btn",onClick:()=>r(null),children:"CLOSE"})]})}export{C as default};
