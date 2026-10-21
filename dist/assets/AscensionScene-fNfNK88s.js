import{r as t,a6 as E,j as e,b as g,t as N,a1 as I,a5 as S}from"./index-EHYa12sO.js";import{V as T}from"./VoyageCanvas-XSA0YfCj.js";const M=`precision highp float;
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
`;S.registerPlugin(E);function R(){const l=t.useRef(),i=t.useMemo(()=>new I,[]),d=t.useMemo(()=>{const r=[];for(let o=0;o<1e3;o++){const s=(Math.random()-.5)*15,u=Math.random()*40-20,p=(Math.random()-.5)*15,c=.02+Math.random()*.08,m=.5+Math.random()*2;r.push({x:s,y:u,z:p,s:c,speed:m})}return r},[]);return g((r,o)=>{d.forEach((s,u)=>{s.y+=o*s.speed,s.y>20&&(s.y=-20),i.position.set(s.x,s.y,s.z),i.scale.setScalar(s.s),i.updateMatrix(),l.current.setMatrixAt(u,i.matrix)}),l.current.instanceMatrix.needsUpdate=!0}),e.jsxs("instancedMesh",{ref:l,args:[null,null,1e3],children:[e.jsx("sphereGeometry",{args:[1,8,8]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})}function y(){const n=t.useRef();return g(l=>{n.current&&(n.current.uniforms.uTime.value=l.clock.getElapsedTime())}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],children:[e.jsx("cylinderGeometry",{args:[10,10,60,32,1,!0]}),e.jsx("shaderMaterial",{ref:n,fragmentShader:M,vertexShader:`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,uniforms:{uTime:{value:0}},side:N})]})}function x({type:n,label:l,url:i,color:d}){const r=t.useRef(),[o,s]=t.useState(!1);g(p=>{const c=p.clock.getElapsedTime();r.current.rotation.y=c*.5,r.current.rotation.z=c*.3;const m=4,a=c*.2+(n==="circle"?0:n==="triangle"?2.1:4.2);r.current.position.x=Math.cos(a)*m,r.current.position.z=Math.sin(a)*m,r.current.position.y=Math.sin(c*.5+a)*.5});const u=()=>{i.startsWith("mailto")?window.location.href=i:window.open(i,"_blank")};return e.jsxs("group",{onPointerOver:()=>s(!0),onPointerOut:()=>s(!1),onClick:u,children:[e.jsxs("mesh",{ref:r,scale:o?1.4:1,children:[n==="circle"&&e.jsx("sphereGeometry",{args:[.6,32,32]}),n==="triangle"&&e.jsx("octahedronGeometry",{args:[.7]}),n==="square"&&e.jsx("boxGeometry",{args:[.8,.8,.8]}),e.jsx("meshStandardMaterial",{color:d,emissive:d,emissiveIntensity:o?2:.8,wireframe:!o})]}),o&&e.jsx("group",{position:[0,1.2,0]})]})}function A(){return e.jsxs(e.Fragment,{children:[e.jsx("color",{attach:"background",args:["#000000"]}),e.jsx("fog",{attach:"fog",args:["#000000",5,25]}),e.jsx("spotLight",{position:[0,-10,0],angle:.15,penumbra:1,intensity:5,color:"#ffffff","target-position":[0,20,0]}),e.jsx(y,{}),e.jsx(R,{}),e.jsxs("group",{position:[0,0,0],children:[e.jsx(x,{type:"circle",label:"EMAIL",url:"mailto:hello@niteshvarma.com",color:"#ffffff"}),e.jsx(x,{type:"triangle",label:"LINKEDIN",url:"https://linkedin.com/in/niteshvarma",color:"#00F5FF"}),e.jsx(x,{type:"square",label:"RESUME",url:"/resume.pdf",color:"#C9A84C"})]})]})}function O(){const n=t.useRef(null),l=t.useRef(null),[i,d]=t.useState(0),[r,o]=t.useState(!1),[s,u]=t.useState(-1),[p,c]=t.useState(!1),m=t.useRef([]),v=["THE HORIZON WAS NEVER THE END.","BUT REALM IS STILL GROWING.","IT IS A LIVING DOCUMENT.","A SIGNAL STILL BEING SENT.","NITESH VARMA","PRODUCT BUILDER · CO-FOUNDER","IF YOU FELT SOMETHING — LET'S BUILD SOMETHING."];return t.useEffect(()=>{const a=E.create({trigger:n.current,start:"top top",end:"bottom bottom",onUpdate:h=>{d(h.progress)}}),f=requestAnimationFrame(()=>{var h,j;a.refresh(),(j=(h=a.vars).onUpdate)==null||j.call(h,a)});return()=>{cancelAnimationFrame(f),a.kill()}},[]),t.useEffect(()=>{if(i>.05&&!r){o(!0),c(!0),setTimeout(()=>c(!1),1200);let a=1500;v.forEach((f,h)=>{m.current.push(setTimeout(()=>u(h),a)),a+=h===4?3500:3e3})}},[i>.05,r]),t.useEffect(()=>()=>m.current.forEach(clearTimeout),[]),e.jsx("div",{className:"realm-chapter",ref:n,children:e.jsxs("div",{className:`ascension-realm ${i>.01?"visible":""}`,ref:l,children:[e.jsx("div",{className:`white-out-flash ${p?"active":""}`}),e.jsx("div",{className:"ascension-canvas-container",children:e.jsx(T,{camera:{position:[0,5,15],fov:45},maxDpr:1.5,children:e.jsx(A,{})})}),e.jsxs("div",{className:"ascension-ui",children:[v.map((a,f)=>e.jsx("div",{className:`ascension-line line-${f} ${s>=f?"active":""}`,children:a},f)),e.jsxs("nav",{className:`ascension-contact ${s>=v.length-1?"active":""}`,"aria-label":"Contact",children:[e.jsx("a",{href:"mailto:hello@niteshvarma.com",children:"EMAIL"}),e.jsx("span",{"aria-hidden":"true",children:"·"}),e.jsx("a",{href:"https://linkedin.com/in/niteshvarma",target:"_blank",rel:"noopener noreferrer",children:"LINKEDIN"})]})]}),e.jsxs("div",{className:"realm-signature",children:[e.jsxs("div",{className:"sig-left",children:["REALM v2.0 — BUILT IN THE DARK — ",new Date().getFullYear(),e.jsx("span",{className:"pulsing-dot"})]}),e.jsx("div",{className:"sig-right",title:"This entire experience was hand-coded. No templates. No drag-and-drop. Every frame is intentional.",children:"[ INTENTIONALITY ]"})]})]})})}export{O as default};
