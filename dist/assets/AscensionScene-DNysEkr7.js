import{r as t,c as E,S as j,j as e,C as I,a as x,ac as N,U as S,g as T}from"./index-kBNIGw7Z.js";const M=`precision highp float;
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
`;T.registerPlugin(j);function R(){const o=t.useRef(),c=t.useMemo(()=>new S,[]),d=t.useMemo(()=>{const r=[];for(let i=0;i<1e3;i++){const s=(Math.random()-.5)*15,u=Math.random()*40-20,m=(Math.random()-.5)*15,l=.02+Math.random()*.08,h=.5+Math.random()*2;r.push({x:s,y:u,z:m,s:l,speed:h})}return r},[]);return x((r,i)=>{d.forEach((s,u)=>{s.y+=i*s.speed,s.y>20&&(s.y=-20),c.position.set(s.x,s.y,s.z),c.scale.setScalar(s.s),c.updateMatrix(),o.current.setMatrixAt(u,c.matrix)}),o.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:o,args:[null,null,1e3],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})}function y(){const n=t.useRef();return x(o=>{n.current&&(n.current.uniforms.uTime.value=o.clock.getElapsedTime())}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[10,10,60,32,1,!0]}),e.jsx("shaderMaterial",{ref:n,fragmentShader:M,vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,uniforms:{uTime:{value:0}},side:N})]})}function g({type:n,label:o,url:c,color:d}){const r=t.useRef(),[i,s]=t.useState(!1);x(m=>{const l=m.clock.getElapsedTime();r.current.rotation.y=l*.5,r.current.rotation.z=l*.3;const h=4,a=l*.2+(n==="circle"?0:n==="triangle"?2.1:4.2);r.current.position.x=Math.cos(a)*h,r.current.position.z=Math.sin(a)*h,r.current.position.y=Math.sin(l*.5+a)*.5});const u=()=>{c.startsWith("mailto")?window.location.href=c:window.open(c,"_blank")};return e.jsxs("group",{onPointerOver:()=>s(!0),onPointerOut:()=>s(!1),onClick:u,children:[e.jsxs("mesh",{ref:r,scale:i?1.4:1,children:[n==="circle"&&e.jsx("sphereGeometry",{args:[.6,32,32]}),n==="triangle"&&e.jsx("octahedronGeometry",{args:[.7]}),n==="square"&&e.jsx("boxGeometry",{args:[.8,.8,.8]}),e.jsx("meshStandardMaterial",{color:d,emissive:d,emissiveIntensity:i?2:.8,wireframe:!i})]}),i&&e.jsx("group",{position:[0,1.2,0]})]})}function A(){return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#000000"]}),e.jsx("fog",{attach:"fog",args:["#000000",5,25]}),e.jsx("spotLight",{position:[0,-10,0],angle:.15,penumbra:1,intensity:5,color:"#ffffff","target-position":[0,20,0]}),e.jsx(y,{}),e.jsx(R,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsx(g,{type:"circle",label:"EMAIL",url:"mailto:hello@niteshvarma.com",color:"#ffffff"}),e.jsx(g,{type:"triangle",label:"LINKEDIN",url:"https://linkedin.com/in/niteshvarma",color:"#00F5FF"}),e.jsx(g,{type:"square",label:"RESUME",url:"/resume.pdf",color:"#C9A84C"})]})]})}function b(){const n=t.useRef(null),[o,c]=t.useState(0),d=E(),[r,i]=t.useState(!1),[s,u]=t.useState(-1),[m,l]=t.useState(!1),h=t.useRef([]),p=["YOU HAVE REACHED THE END OF REALM.","BUT REALM IS STILL GROWING.","IT IS A LIVING DOCUMENT.","A SIGNAL STILL BEING SENT.","NITESH VARMA","CREATIVE TECHNOLOGIST & DESIGNER","IF YOU FELT SOMETHING — LET'S BUILD SOMETHING."];return t.useEffect(()=>{const a=n.current,f=j.create({trigger:a,start:"top top",end:()=>`+=${a.parentElement.offsetHeight-a.offsetHeight}`,invalidateOnRefresh:!0,pin:!0,scrub:1,onUpdate:v=>{c(v.progress)}});return()=>f.kill()},[]),t.useEffect(()=>{if(o>.05&&!r){i(!0),l(!0),setTimeout(()=>l(!1),1200);let a=1500;p.forEach((f,v)=>{h.current.push(setTimeout(()=>u(v),a)),a+=v===4?3500:3e3})}},[o>.05,r]),t.useEffect(()=>()=>h.current.forEach(clearTimeout),[]),e.jsxs("div",{className:`ascension-realm ${o>.01?"visible":""}`,ref:n,children:[e.jsx("div",{className:`white-out-flash ${m?"active":""}`}),e.jsx("div",{className:"ascension-canvas-container",children:e.jsx(I,{camera:{position:[0,5,15],fov:45},frameloop:d,dpr:[1,1.5],children:e.jsx(A,{})})}),e.jsxs("div",{className:"ascension-ui",children:[p.map((a,f)=>e.jsx("div",{className:`ascension-line line-${f} ${s>=f?"active":""}`,children:a},f)),e.jsxs("nav",{className:`ascension-contact ${s>=p.length-1?"active":""}`,"aria-label":"Contact",children:[e.jsx("a",{href:"mailto:hello@niteshvarma.com",children:"EMAIL"}),e.jsx("span",{"aria-hidden":"true",children:"·"}),e.jsx("a",{href:"https://linkedin.com/in/niteshvarma",target:"_blank",rel:"noopener noreferrer",children:"LINKEDIN"})]})]}),e.jsxs("div",{className:"realm-signature",children:[e.jsxs("div",{className:"sig-left",children:["REALM v2.0 — BUILT IN THE DARK — ",new Date().getFullYear(),e.jsx("span",{className:"pulsing-dot"})]}),e.jsx("div",{className:"sig-right",title:"This entire experience was hand-coded. No templates. No drag-and-drop. Every frame is intentional.",children:"[ INTENTIONALITY ]"})]})]})}export{b as default};
