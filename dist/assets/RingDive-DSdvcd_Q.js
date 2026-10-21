import{r as d,j as e,u as S,c as g,b as T,C as b,B as k,d as A,I as E,M as I,Q as P,E as N,e as x}from"./index-EHYa12sO.js";import{V as D}from"./VoyageCanvas-XSA0YfCj.js";import{u as L,d as G}from"./useSectionProgress-ayEFJUV8.js";import{s as B,B as U}from"./Beats-CzKm5iZ1.js";import{A as w,g as z}from"./Accretion-Bqy7U2KF.js";import{B as F}from"./Billboard-Dy9eO-GB.js";import{T as O}from"./Text-BwKYpmFi.js";const h=[{name:"PRODUCT & STRATEGY",r0:14.6,r1:16.4,tint:"#f3e6c8",skills:["0→1 Products","Customer Discovery","User Research","Roadmaps","OKRs","A/B Testing","UX"]},{name:"TECHNICAL",r0:12,r1:13.8,tint:"#cfe4ff",skills:["LLMs & RAG","AI Agents","MCP","APIs & Data Models","AWS / GCP","Real-time Analytics","React"]},{name:"EXECUTION & GTM",r0:9.9,r1:11.3,tint:"#e6c27a",skills:["Go-to-Market","Unit Economics","Cross-functional Leadership","Stakeholders","Agile / SAFe"]},{name:"TOOLKIT",r0:8,r1:9.3,tint:"#bcd7f5",skills:["Cursor","Claude","Lovable","v0","Figma","Notion","JIRA"]}],C=[{at:0,side:"center",kicker:"T+2017 · WHAT I PICKED UP ALONG THE WAY",title:"THE RING DIVE",xl:!0,body:"Every skill is a fragment of ice in orbit. Small alone. A system together."},{at:.14,side:"left",kicker:"BAND I · PRODUCT & STRATEGY",title:"What’s worth building",body:"Discovery, research and the discipline of saying no. The outer ring — everything else orbits inside it.",metric:h[0].skills.join(" · ")},{at:.35,side:"left",kicker:"BAND II · TECHNICAL",title:"Close to the metal",body:"LLMs, RAG, agents, APIs, cloud. Technical enough to argue system design with the people who build it.",metric:h[1].skills.join(" · ")},{at:.56,side:"left",kicker:"BAND III · EXECUTION & GTM",title:"Into the world",body:"Leadership across teams, go-to-market, unit economics. Shipping is a team sport with a scoreboard.",metric:h[2].skills.join(" · ")},{at:.76,side:"left",kicker:"BAND IV · TOOLKIT",title:"Idea to demo in days",body:"The fastest path from a hunch to something a customer can actually touch.",metric:h[3].skills.join(" · ")},{at:.93,side:"low",kicker:"RING PLANE CLEARED",title:"Small fragments. One system."}],M=[[0,34,15,-.4],[.12,22,5,.2],[.16,15.5,.55,.55],[.34,15.5,.45,1.55],[.38,12.9,.5,1.75],[.55,12.9,.45,2.75],[.59,10.6,.5,2.95],[.75,10.6,.45,3.9],[.79,8.65,.5,4.1],[.92,8.65,.45,5],[1,26,9,5.6]],W=[[.75,1.5],[1.95,2.7],[3.15,3.85],[4.3,4.95]];function _(m){let s=0;for(;s<M.length-2&&m>M[s+1][0];)s++;const o=M[s],n=M[s+1],l=x.smoothstep(m,o[0],n[0]);return[1,2,3].map(u=>x.lerp(o[u],n[u],l))}const V=`
  varying vec3 vN; varying vec3 vP; varying vec3 vW;
  void main() {
    vN = normalize(normalMatrix * normal);
    vP = position;
    vW = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,H=`
  uniform float uTime;
  uniform vec3 uSun;
  varying vec3 vN; varying vec3 vP; varying vec3 vW;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p *= 2.1; a *= 0.5; } return v; }
  void main() {
    vec3 n = normalize(vP);
    float lat = n.y;
    float lon = atan(n.z, n.x);
    float turb = fbm(vec2(lon * 2.0 + uTime * 0.02, lat * 9.0));
    float bands = sin(lat * 26.0 + turb * 3.2) * 0.5 + 0.5;
    vec3 c1 = vec3(0.93, 0.83, 0.62), c2 = vec3(0.66, 0.5, 0.32), c3 = vec3(0.98, 0.94, 0.85);
    vec3 col = mix(c2, c1, bands);
    col = mix(col, c3, smoothstep(0.75, 0.95, fbm(vec2(lon * 4.0, lat * 20.0) + uTime * 0.03)) * 0.4);
    // Storm
    float storm = smoothstep(0.16, 0.0, length(vec2((lon - 0.6) * 0.6, lat + 0.22)));
    col = mix(col, vec3(0.82, 0.42, 0.24), storm * 0.7);
    float diff = clamp(dot(normalize(vN), normalize(uSun)), 0.0, 1.0);
    float rim = pow(1.0 - abs(dot(normalize(vN), normalize(cameraPosition - vW))), 3.0);
    vec3 lit = col * (0.04 + diff * 1.05) + vec3(1.0, 0.85, 0.55) * rim * 0.35 * (0.3 + diff);
    gl_FragColor = vec4(lit, 1.0);
  }
`,K=`
  uniform float uTime; uniform float uPixelRatio;
  attribute vec3 aRing; // radius, angle, seed
  attribute vec3 aColor;
  varying vec3 vColor; varying float vA;
  void main() {
    float r = aRing.x;
    float a = aRing.y + uTime * 2.2 * pow(r, -1.5);
    vec3 p = vec3(cos(a) * r, (fract(aRing.z * 37.0) - 0.5) * 0.08, sin(a) * r);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min((0.6 + fract(aRing.z * 13.0)) * uPixelRatio * (18.0 / -mv.z), 4.0 * uPixelRatio);
    vColor = aColor;
    vA = 0.35 + 0.5 * fract(aRing.z * 7.0);
  }
`,X=`
  varying vec3 vColor; varying float vA;
  void main() { float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vColor, smoothstep(0.5, 0.0, d) * vA); }
`;function Y({low:m}){const s=d.useMemo(()=>{const a=m?16e3:52e3,i=new Float32Array(a*3),t=new Float32Array(a*3),r=new b;for(let f=0;f<a;f++){const p=h[Math.random()*h.length|0];let v=p.r0+Math.random()*(p.r1-p.r0);v+=Math.sin(v*9)*.06,i.set([v,Math.random()*Math.PI*2,Math.random()],f*3),r.set(p.tint).multiplyScalar(.55+Math.random()*.45),t.set([r.r,r.g,r.b],f*3)}const c=new k;return c.setAttribute("position",new A(new Float32Array(a*3),3)),c.setAttribute("aRing",new A(i,3)),c.setAttribute("aColor",new A(t,3)),c},[m]),o=d.useMemo(()=>({uTime:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)}}),[]),n=d.useMemo(()=>new E(1,0),[]),l=d.useRef([]),u=d.useMemo(()=>h.map(a=>{const i=m?160:520,t=[],r=new I,c=new P,f=new g,p=new g;for(let v=0;v<i;v++){const R=a.r0+Math.random()*(a.r1-a.r0),j=Math.random()*Math.PI*2;p.set(Math.cos(j)*R,(Math.random()-.5)*.25,Math.sin(j)*R),c.setFromEuler(new N(Math.random()*6,Math.random()*6,Math.random()*6));const y=.02+Math.pow(Math.random(),4)*.11;f.set(y,y*(.6+Math.random()*.8),y),t.push(r.compose(p,c,f).clone())}return t}),[m]);return T((a,i)=>{o.uTime.value=a.clock.elapsedTime,l.current.forEach((t,r)=>{t&&(t.rotation.y+=i*2.2*Math.pow((h[r].r0+h[r].r1)/2,-1.5))})}),e.jsxs(e.Fragment,{children:[e.jsx("points",{geometry:s,frustumCulled:!1,children:e.jsx("shaderMaterial",{vertexShader:K,fragmentShader:X,uniforms:o,transparent:!0,depthWrite:!1,...w})}),h.map((a,i)=>e.jsx("group",{ref:t=>l.current[i]=t,children:e.jsx("instancedMesh",{args:[n,null,u[i].length],onUpdate:t=>{u[i].forEach((r,c)=>t.setMatrixAt(c,r)),t.instanceMatrix.needsUpdate=!0},children:e.jsx("meshStandardMaterial",{color:a.tint,roughness:.55,metalness:.05,flatShading:!0})})},a.name))]})}function Q(){const m=d.useMemo(()=>h.flatMap((o,n)=>o.skills.map((l,u)=>{const[a,i]=W[n],t=a+(u+.5)/o.skills.length*(i-a),r=(o.r0+o.r1)/2+(u%2?.55:-.55);return{name:l,bi:n,pos:new g(Math.cos(t)*r,.28+u%3*.1,Math.sin(t)*r)}})),[]),s=d.useRef(m.map(()=>({})));return T(({camera:o})=>{m.forEach((n,l)=>{const{label:u,glow:a,core:i}=s.current[l],t=o.position.distanceTo(n.pos),r=1-x.smoothstep(t,2.4,8),c=x.smoothstep(t,.8,1.8),f=r*c;u&&(u.fillOpacity=(.12+r*.88)*c),a&&(a.material.opacity=.1+f*.7,a.scale.setScalar(.3+f*.7)),i&&i.scale.setScalar((.03+f*.03)*c+.001)})}),m.map((o,n)=>e.jsx("group",{position:o.pos,children:e.jsxs(F,{children:[e.jsx(O,{ref:l=>{s.current[n]&&(s.current[n].label=l)},fontSize:.14,color:"#f4f1ea",anchorX:"center",anchorY:"bottom",position:[0,.12,0],letterSpacing:.12,fillOpacity:.2,outlineWidth:.004,outlineColor:"#000",children:o.name.toUpperCase()}),e.jsx("sprite",{ref:l=>{s.current[n]&&(s.current[n].glow=l)},scale:.5,children:e.jsx("spriteMaterial",{map:z(),color:h[o.bi].tint,transparent:!0,opacity:.2,...w,depthWrite:!1,toneMapped:!1})}),e.jsxs("mesh",{ref:l=>{s.current[n]&&(s.current[n].core=l)},scale:.04,children:[e.jsx("icosahedronGeometry",{args:[1,0]}),e.jsx("meshBasicMaterial",{color:"#ffffff",toneMapped:!1})]})]})},o.name))}function q({progress:m}){const s=S.getState().performanceLow,o=d.useRef(0),n=d.useRef(new g),l=d.useRef(new g),u=d.useMemo(()=>({uTime:{value:0},uSun:{value:new g(1,.35,.55)}}),[]);return T((a,i)=>{o.current=G(o.current,m.current,4,i),u.uTime.value=a.clock.elapsedTime;const[t,r,c]=_(o.current),f=a.camera;f.position.set(Math.cos(c)*t,r,Math.sin(c)*t);const p=1-x.smoothstep(r,1.2,6);l.current.set(Math.cos(c+.5)*(t-.6),.12,Math.sin(c+.5)*(t-.6)).multiplyScalar(p),n.current.lerp(l.current,1-Math.exp(-i*5)),f.lookAt(n.current)}),e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.08}),e.jsx("directionalLight",{position:[30,10,18],intensity:2.2,color:"#fff1d6"}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[6,96,96]}),e.jsx("shaderMaterial",{vertexShader:V,fragmentShader:H,uniforms:u})]}),e.jsxs("group",{rotation:[0,0,0],children:[e.jsx(Y,{low:s}),e.jsx(Q,{})]})]})}function re(){const m=d.useRef(null),{progress:s,step:o}=L(m,{steps:B(C)});return e.jsx("div",{className:"v-chapter",ref:m,children:e.jsxs("div",{className:"v-sticky",children:[e.jsx("div",{className:"v-canvas",children:e.jsx(D,{maxDpr:1.5,gl:{alpha:!0,antialias:!0},camera:{fov:58,near:.05,far:300,position:[0,15,34]},children:e.jsx(q,{progress:s})})}),e.jsx(U,{beats:C,step:o})]})})}export{re as default};
