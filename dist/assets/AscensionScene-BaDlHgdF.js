import{r as t,a6 as E,j as e,b as g,t as N,a1 as I,a5 as S}from"./index-DYzImh_6.js";import{V as T}from"./VoyageCanvas-s5Au4dfH.js";const M=`precision highp float;
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
`;S.registerPlugin(E);function y(){const o=t.useRef(),c=t.useMemo(()=>new I,[]),m=t.useMemo(()=>{const a=[];for(let i=0;i<1e3;i++){const s=(Math.random()-.5)*15,d=Math.random()*40-20,f=(Math.random()-.5)*15,l=.02+Math.random()*.08,h=.5+Math.random()*2;a.push({x:s,y:d,z:f,s:l,speed:h})}return a},[]);return g((a,i)=>{m.forEach((s,d)=>{s.y+=i*s.speed,s.y>20&&(s.y=-20),c.position.set(s.x,s.y,s.z),c.scale.setScalar(s.s),c.updateMatrix(),o.current.setMatrixAt(d,c.matrix)}),o.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:o,args:[null,null,1e3],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})}function R(){const n=t.useRef();return g(o=>{n.current&&(n.current.uniforms.uTime.value=o.clock.getElapsedTime())}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[10,10,60,32,1,!0]}),e.jsx("shaderMaterial",{ref:n,fragmentShader:M,vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,uniforms:{uTime:{value:0}},side:N})]})}function x({type:n,label:o,url:c,color:m}){const a=t.useRef(),[i,s]=t.useState(!1);g(f=>{const l=f.clock.getElapsedTime();a.current.rotation.y=l*.5,a.current.rotation.z=l*.3;const h=4,r=l*.2+(n==="circle"?0:n==="triangle"?2.1:4.2);a.current.position.x=Math.cos(r)*h,a.current.position.z=Math.sin(r)*h,a.current.position.y=Math.sin(l*.5+r)*.5});const d=()=>{c.startsWith("mailto")?window.location.href=c:window.open(c,"_blank")};return e.jsxs("group",{onPointerOver:()=>s(!0),onPointerOut:()=>s(!1),onClick:d,children:[e.jsxs("mesh",{ref:a,scale:i?1.4:1,children:[n==="circle"&&e.jsx("sphereGeometry",{args:[.6,32,32]}),n==="triangle"&&e.jsx("octahedronGeometry",{args:[.7]}),n==="square"&&e.jsx("boxGeometry",{args:[.8,.8,.8]}),e.jsx("meshStandardMaterial",{color:m,emissive:m,emissiveIntensity:i?2:.8,wireframe:!i})]}),i&&e.jsx("group",{position:[0,1.2,0]})]})}function A(){return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#000000"]}),e.jsx("fog",{attach:"fog",args:["#000000",5,25]}),e.jsx("spotLight",{position:[0,-10,0],angle:.15,penumbra:1,intensity:5,color:"#ffffff","target-position":[0,20,0]}),e.jsx(R,{}),e.jsx(y,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsx(x,{type:"circle",label:"EMAIL",url:"mailto:hello@niteshvarma.com",color:"#ffffff"}),e.jsx(x,{type:"triangle",label:"LINKEDIN",url:"https://linkedin.com/in/niteshvarma",color:"#00F5FF"}),e.jsx(x,{type:"square",label:"RESUME",url:"/resume.pdf",color:"#C9A84C"})]})]})}function O(){const n=t.useRef(null),[o,c]=t.useState(0),[m,a]=t.useState(!1),[i,s]=t.useState(-1),[d,f]=t.useState(!1),l=t.useRef([]),h=["THE HORIZON WAS NEVER THE END.","BUT REALM IS STILL GROWING.","IT IS A LIVING DOCUMENT.","A SIGNAL STILL BEING SENT.","NITESH VARMA","PRODUCT BUILDER · CO-FOUNDER","IF YOU FELT SOMETHING — LET'S BUILD SOMETHING."];return t.useEffect(()=>{const u=n.current,r=E.create({trigger:u,start:"top top",end:()=>`+=${u.parentElement.offsetHeight-u.offsetHeight}`,invalidateOnRefresh:!0,pin:!0,scrub:1,onUpdate:v=>{c(v.progress)}}),p=requestAnimationFrame(()=>{var v,j;r.refresh(),(j=(v=r.vars).onUpdate)==null||j.call(v,r)});return()=>{cancelAnimationFrame(p),r.kill()}},[]),t.useEffect(()=>{if(o>.05&&!m){a(!0),f(!0),setTimeout(()=>f(!1),1200);let u=1500;h.forEach((r,p)=>{l.current.push(setTimeout(()=>s(p),u)),u+=p===4?3500:3e3})}},[o>.05,m]),t.useEffect(()=>()=>l.current.forEach(clearTimeout),[]),e.jsxs("div",{className:`ascension-realm ${o>.01?"visible":""}`,ref:n,children:[e.jsx("div",{className:`white-out-flash ${d?"active":""}`}),e.jsx("div",{className:"ascension-canvas-container",children:e.jsx(T,{camera:{position:[0,5,15],fov:45},maxDpr:1.5,children:e.jsx(A,{})})}),e.jsxs("div",{className:"ascension-ui",children:[h.map((u,r)=>e.jsx("div",{className:`ascension-line line-${r} ${i>=r?"active":""}`,children:u},r)),e.jsxs("nav",{className:`ascension-contact ${i>=h.length-1?"active":""}`,"aria-label":"Contact",children:[e.jsx("a",{href:"mailto:hello@niteshvarma.com",children:"EMAIL"}),e.jsx("span",{"aria-hidden":"true",children:"·"}),e.jsx("a",{href:"https://linkedin.com/in/niteshvarma",target:"_blank",rel:"noopener noreferrer",children:"LINKEDIN"})]})]}),e.jsxs("div",{className:"realm-signature",children:[e.jsxs("div",{className:"sig-left",children:["REALM v2.0 — BUILT IN THE DARK — ",new Date().getFullYear(),e.jsx("span",{className:"pulsing-dot"})]}),e.jsx("div",{className:"sig-right",title:"This entire experience was hand-coded. No templates. No drag-and-drop. Every frame is intentional.",children:"[ INTENTIONALITY ]"})]})]})}export{O as default};
