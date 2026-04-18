import{r as o,y as p,v as e,z as x,x as w,V as S,s as h}from"./index-DBOsFBil.js";import{O as j}from"./OrthographicCamera-BYzMkekO.js";import"./Fbo-Dc-_Sk56.js";const T=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,E=`uniform float uTime;
uniform vec2 uResolution;
uniform float uPulseSpeed;

varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st = st * 2.0 - 1.0;
    st.x *= uResolution.x/uResolution.y;

    float d = length(st);
    
    // Wave calculations
    float wave = sin(d * 20.0 - uTime * uPulseSpeed);
    
    // Smooth the wave for cleaner rings
    wave = smoothstep(0.8, 1.0, wave);
    
    // Add noise interference
    float noise = random(st * 100.0 + uTime * 0.1) * 0.15;
    
    // Center glow + wave intensity + falloff
    float glow = 0.1 / (d * d + 0.1);
    float finalWave = wave * glow;
    
    vec3 color = vec3(1.0) * (finalWave + noise);

    // Vignette
    color *= smoothstep(2.0, 0.0, d);

    gl_FragColor = vec4(color, 1.0);
}
`;function I({hoverState:s}){const r=o.useRef(),a=o.useMemo(()=>({uTime:{value:0},uResolution:{value:new S(window.innerWidth,window.innerHeight)},uPulseSpeed:{value:2}}),[]);return h(n=>{if(r.current){r.current.uniforms.uTime.value=n.clock.elapsedTime;const i=s?8:2;r.current.uniforms.uPulseSpeed.value+=(i-r.current.uniforms.uPulseSpeed.value)*.05}}),o.useEffect(()=>{const n=()=>{r.current&&r.current.uniforms.uResolution.value.set(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",n),()=>window.removeEventListener("resize",n)},[]),e.jsxs("mesh",{children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{ref:r,vertexShader:T,fragmentShader:E,uniforms:a,transparent:!0})]})}function d({position:s,type:r,hovered:a}){const n=o.useRef();return h((i,t)=>{n.current&&(n.current.rotation.y+=t*(a?4:1),n.current.rotation.x+=t*.5)}),e.jsxs("mesh",{ref:n,position:s,children:[r==="LinkedIn"&&e.jsx("octahedronGeometry",{args:[.4,0]}),r==="Twitter"&&e.jsx("torusGeometry",{args:[.3,.1,16,32]}),r==="GitHub"&&e.jsx("icosahedronGeometry",{args:[.4,0]}),e.jsx("meshStandardMaterial",{color:"#F0F0F0",wireframe:!0})]})}function L(){return e.jsx(j,{makeDefault:!0,position:[0,0,1],left:-1,right:1,top:1,bottom:-1,near:.1,far:10})}function k(){const[s,r]=o.useState(!1),[a,n]=o.useState(null),i=p(t=>t.performanceLow);return o.useEffect(()=>{const t=document.querySelector(".contact-email"),m="RNITESHVARMA@GMAIL.COM",g="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";let l=null;const u=v=>{let c=0;clearInterval(l),l=setInterval(()=>{v.target.innerText=v.target.innerText.split("").map((R,f)=>f<c?m[f]:g[Math.floor(Math.random()*26)]).join(""),c>=m.length&&clearInterval(l),c+=1/3},30)};return t&&(t.addEventListener("mouseenter",u),t.addEventListener("mouseleave",()=>r(!1)),u({target:t})),()=>{t&&(t.removeEventListener("mouseenter",u),t.removeEventListener("mouseleave",()=>r(!1))),clearInterval(l)}},[]),e.jsxs("div",{className:"signal-container",children:[e.jsx("div",{className:"signal-shader-wrapper",children:e.jsxs(x,{gl:{antialias:!1,alpha:!0},dpr:[1,i?1:2],children:[e.jsx(L,{}),e.jsx("ambientLight",{intensity:.5}),e.jsx(I,{hoverState:s}),e.jsx(d,{position:[-1.2,-.5,0],type:"LinkedIn",hovered:a==="LI"}),e.jsx(d,{position:[0,-.5,0],type:"Twitter",hovered:a==="TW"}),e.jsx(d,{position:[1.2,-.5,0],type:"GitHub",hovered:a==="GH"})]})}),e.jsxs("div",{className:"signal-content",children:[e.jsx("h2",{className:"signal-title",children:"TRANSMISSION"}),e.jsx("a",{href:"mailto:rniteshvarma@gmail.com",className:"contact-email","data-cursor":"hover-link",children:"RNITESHVARMA@GMAIL.COM"}),e.jsxs("div",{className:"social-links",children:[e.jsx("a",{href:"https://www.linkedin.com/in/niteshvarma/",target:"_blank",rel:"noopener noreferrer","data-cursor":"hover-link",onMouseEnter:()=>n("LI"),onMouseLeave:()=>n(null),children:"LINKEDIN"}),e.jsx("a",{href:"#","data-cursor":"hover-link",onMouseEnter:()=>n("TW"),onMouseLeave:()=>n(null),children:"TWITTER/X"}),e.jsx("a",{href:"#","data-cursor":"hover-link",onMouseEnter:()=>n("GH"),onMouseLeave:()=>n(null),children:"GITHUB"})]}),e.jsx("button",{className:"cta-initiate","data-cursor":"hover-link",onClick:()=>{w.to(".signal-shader-wrapper",{scale:1.5,opacity:0,duration:.5,ease:"power4.in"}),setTimeout(()=>window.location.href="mailto:rniteshvarma@gmail.com",500)},children:"INITIATE CONTACT"}),e.jsx("div",{className:"eof-marker",children:"[ EOF ]"})]})]})}export{k as default};
