import{r,c as Ce,R as be,V as de,b as ve,g as K,S as De,d as L,e as oe,j as C,C as Le,u as Pe,F as Ne,A as Fe,P as Ie,f as ye,h as me,i as ce,k as ze,M as te,l as ie,m as Ge,G as xe,I as Ve,n as pe,T as je,D as we,B as ue,o as fe,p as Se,q as Me,s as Be,t as Ue,v as qe,w as Te,O as Oe,x as We,y as ke,z as _e,Q as He,L as Ee,E as Ae,a as Qe,H as Ye,J as $e}from"./index-kBNIGw7Z.js";import{S as ge}from"./deviceTier-4wMGNzoE.js";const Xe=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Je=`// containmentField.frag.glsl — Forge chamber boundary walls
uniform float uTime;
uniform vec3 uColor;
uniform vec2 uRippleOrigin;
uniform float uRippleTime;
uniform float uPulseSync;
varying vec2 vUv;

float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.73))), p.x);
}

vec4 hexCoords(vec2 uv) {
  vec2 r = vec2(1.0, 1.73);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  return vec4(gv.x, gv.y,
    round(uv.x - gv.x), round(uv.y - gv.y));
}

void main() {
  vec2 uv = vUv * 20.0;
  vec4 hc = hexCoords(uv);
  float d = hexDist(hc.xy);

  // Only the hex EDGE LINE is visible — interior is completely transparent
  float edgeWidth = 0.02;
  float edge = smoothstep(0.5 - edgeWidth, 0.5, d);

  float pulse = sin(uTime * 0.8 + hc.z * 0.5 + hc.w * 0.3) * 0.5 + 0.5;
  float syncPulse = mix(pulse, sin(uTime * 6.28) * 0.5 + 0.5, uPulseSync);

  // Ripple on wall impact
  float rippleDist = distance(vUv, uRippleOrigin);
  float rippleAge = uTime - uRippleTime;
  float rippleWave = sin(rippleDist * 30.0 - rippleAge * 8.0)
                    * exp(-rippleDist * 4.0) * exp(-rippleAge * 2.0);
  float ripple = max(0.0, rippleWave) * (1.0 - smoothstep(0.0, 3.0, rippleAge));

  // Edge-only emission — zero alpha in hex interior
  float lineAlpha = edge * syncPulse * 0.35 + ripple * edge * 0.5;
  vec3 col = uColor * (0.12 + syncPulse * 0.1 + ripple * 0.3);

  gl_FragColor = vec4(col, lineAlpha);
}
`,Ke=`// forgeBlob.vert.glsl — Morphing organic blob for Design node
uniform float uTime;
uniform float uScale;
varying vec3 vNormal;
varying vec3 vWorldPos;

// Simplex-style noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

void main() {
  vec3 pos = position;
  float noise = snoise(pos * 1.2 + uTime * 0.4);
  pos += normal * noise * 0.3 * uScale;
  vNormal = normalize(normalMatrix * (normal + vec3(noise * 0.3)));
  vWorldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`,Ze=`// forgeBlobFrag.glsl — Lit material for morphing blob
uniform vec3 uColor;
uniform float uEmissiveIntensity;
varying vec3 vNormal;
varying vec3 vWorldPos;

void main() {
  vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
  float diff = max(dot(normalize(vNormal), lightDir), 0.0);
  vec3 emissive = uColor * uEmissiveIntensity;
  vec3 col = uColor * (diff * 0.5 + 0.3) + emissive;
  gl_FragColor = vec4(col, 1.0);
}
`,en=`// voronoiSphere.frag.glsl — Strategy node surface (Voronoi cells)
uniform float uTime;
uniform vec3 uColor;
uniform float uEmissiveIntensity;
varying vec2 vUv;
varying vec3 vNormal;

vec2 hash22(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.xx + p.yx) * p.xy);
}

float voronoi(vec2 uv, float t) {
  vec2 i = floor(uv);
  vec2 f = fract(uv);
  float minDist = 1.0;
  for (int x = -1; x <= 1; x++) {
    for (int y = -1; y <= 1; y++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash22(i + neighbor);
      point = 0.5 + 0.5 * sin(t * 0.6 + 6.283 * point);
      float dist = length(neighbor + point - f);
      minDist = min(minDist, dist);
    }
  }
  return minDist;
}

void main() {
  vec2 uv = vUv * 5.0;
  float v = voronoi(uv, uTime);
  float cellLine = smoothstep(0.05, 0.15, v);
  vec3 lightDir = normalize(vec3(1.0, 2.0, 1.0));
  float diff = max(dot(normalize(vNormal), lightDir), 0.0);
  vec3 col = mix(vec3(0.02), uColor, cellLine) * (diff * 0.5 + 0.3);
  col += uColor * uEmissiveIntensity * cellLine;
  gl_FragColor = vec4(col, 1.0);
}
`,O=[{id:"product",name:"PRODUCT",description:"Finding the exact intersection of what users need and what the business can sustain.",depth:"5 years steering vision",color:new oe(8073150),baseFreq:196,position:new L(-10,-1.5,4),nodeType:"blob",skills:[{name:"0 to 1 Launch",level:"MASTER"},{name:"Roadmap Strategy",level:"MASTER"},{name:"User Discovery",level:"FLUENT"},{name:"Go-to-Market",level:"CAPABLE"},{name:"Metrics & Analytics",level:"FLUENT"},{name:"Pricing Strategy",level:"CAPABLE"},{name:"Stakeholder Alignment",level:"MASTER"},{name:"B2B SaaS",level:"MASTER"},{name:"Hardware/IoT",level:"CAPABLE"},{name:"Growth Loops",level:"FLUENT"}]},{id:"engineering",name:"ENGINEERING",description:"I don't just write tickets. I write code. The prototype is the argument.",depth:"6 years shipping production systems",color:new oe(62975),baseFreq:220,position:new L(10,2,0),nodeType:"rings",skills:[{name:"React / Next.js",level:"MASTER"},{name:"TypeScript",level:"MASTER"},{name:"Node.js",level:"FLUENT"},{name:"Python",level:"FLUENT"},{name:"System Architecture",level:"FLUENT"},{name:"WebGL / Three.js",level:"CAPABLE"},{name:"AWS / GCP",level:"CAPABLE"},{name:"CI/CD Pipelines",level:"FLUENT"},{name:"Database Design",level:"FLUENT"},{name:"API Development",level:"MASTER"}]},{id:"ai-data",name:"AI & DATA",description:"Turning hype into actual utility. Making models solve real problems.",depth:"3 years integrating intelligence",color:new oe(13215820),baseFreq:246.94,position:new L(0,5,-8),nodeType:"fractal",skills:[{name:"LLM Orchestration",level:"FLUENT"},{name:"Prompt Engineering",level:"MASTER"},{name:"RAG Systems",level:"FLUENT"},{name:"Agentic Workflows",level:"CAPABLE"},{name:"Predictive Models",level:"CAPABLE"},{name:"Vector Databases",level:"FLUENT"},{name:"Data Pipelines",level:"FLUENT"},{name:"Computer Vision",level:"CAPABLE"},{name:"AI Ethics & Safety",level:"FLUENT"},{name:"Fine-tuning",level:"CAPABLE"}]},{id:"leadership",name:"LEADERSHIP",description:"Protecting the team's focus. Taking the blame. Passing the credit.",depth:"4 years scaling teams",color:new oe(15789544),baseFreq:261.63,position:new L(-8,-3,-6),nodeType:"voronoi",skills:[{name:"Agile Coaching",level:"MASTER"},{name:"Hiring & Scaling",level:"FLUENT"},{name:"Cross-functional Comms",level:"MASTER"},{name:"Conflict Resolution",level:"FLUENT"},{name:"Resource Planning",level:"FLUENT"},{name:"Vendor Management",level:"CAPABLE"},{name:"Process Design",level:"MASTER"},{name:"Performance Reviews",level:"CAPABLE"},{name:"Remote Team Culture",level:"FLUENT"},{name:"Budget Ownership",level:"CAPABLE"}]},{id:"craft",name:"CRAFT",description:"The tools of the trade. Mastered through daily repetition.",depth:"Sharp tools, daily practice",color:new oe(13150590),baseFreq:293.66,position:new L(8,-4,-4),nodeType:"shards",skills:[{name:"Figma",level:"MASTER"},{name:"Jira / Linear",level:"MASTER"},{name:"SQL",level:"FLUENT"},{name:"Mixpanel / Amplitude",level:"FLUENT"},{name:"Notion / Confluence",level:"MASTER"},{name:"Git",level:"MASTER"},{name:"Cursor / Copilot",level:"FLUENT"},{name:"Postman",level:"FLUENT"},{name:"Blender",level:"CAPABLE"},{name:"Photoshop",level:"FLUENT"}]}];function nn(){let e=null,f=null;function I(){e||(e=new(window.AudioContext||window.webkitAudioContext),f=e.createGain(),f.gain.value=0,f.connect(e.destination))}function V(){I(),f.gain.linearRampToValueAtTime(1,e.currentTime+2)}function P(){if(!e)return;const u=e.createBuffer(1,e.sampleRate*.08,e.sampleRate),g=u.getChannelData(0);for(let B=0;B<g.length;B++)g[B]=Math.random()*2-1;const a=e.createBufferSource();a.buffer=u;const E=e.createBiquadFilter();E.type="bandpass",E.frequency.value=4e3,E.Q.value=2;const T=e.createGain();T.gain.value=.08;const M=e.createStereoPanner();M.pan.value=Math.random()-.5,a.connect(E).connect(T).connect(M).connect(f),a.start()}function p(u){if(!e)return;const g=e.createOscillator();g.type="sine",g.frequency.value=80;const a=e.createGain();a.gain.setValueAtTime(.25,e.currentTime),a.gain.exponentialRampToValueAtTime(.001,e.currentTime+.2),g.connect(a).connect(f),g.start(),g.stop(e.currentTime+.22),[1,1.5,2,3,4].forEach(m=>{const w=e.createOscillator();w.type="sine",w.frequency.value=u*m;const d=e.createGain();d.gain.setValueAtTime(0,e.currentTime+.02),d.gain.linearRampToValueAtTime(.06,e.currentTime+.04),d.gain.setValueAtTime(.06,e.currentTime+.64),d.gain.exponentialRampToValueAtTime(.001,e.currentTime+1.04),w.connect(d).connect(f),w.start(),w.stop(e.currentTime+1.1)});const T=e.createOscillator();T.type="triangle",T.frequency.value=2e3;const M=e.createGain();M.gain.setValueAtTime(.12,e.currentTime),M.gain.exponentialRampToValueAtTime(.001,e.currentTime+.3);const B=e.createBiquadFilter();B.type="bandpass",B.frequency.value=2250,B.Q.value=2,T.connect(B).connect(M).connect(f),T.start(),T.stop(e.currentTime+.35)}function D(u){if(!e)return;const g=e.createOscillator();g.type="sine",g.frequency.value=880*(1+(u/300-.6)*.2);const a=e.createGain();a.gain.setValueAtTime(.025,e.currentTime),a.gain.exponentialRampToValueAtTime(.001,e.currentTime+.04),g.connect(a).connect(f),g.start(),g.stop(e.currentTime+.05)}function j(){if(!e)return;const u=e.createBuffer(1,Math.floor(e.sampleRate*.06),e.sampleRate),g=u.getChannelData(0);for(let M=0;M<g.length;M++)g[M]=Math.random()*2-1;const a=e.createBufferSource();a.buffer=u;const E=e.createBiquadFilter();E.type="bandpass",E.frequency.value=3e3,E.Q.value=4;const T=e.createGain();T.gain.value=.12,a.connect(E).connect(T).connect(f),a.start()}function N(){if(!e)return;O.forEach((a,E)=>{const T=e.createOscillator();T.type="sine",T.frequency.value=a.baseFreq;const M=e.createGain();M.gain.setValueAtTime(0,e.currentTime),M.gain.linearRampToValueAtTime(.04,e.currentTime+1.5),M.gain.setValueAtTime(.04,e.currentTime+1.5),M.gain.exponentialRampToValueAtTime(.001,e.currentTime+4),T.connect(M).connect(f),T.start(),T.stop(e.currentTime+4.1)});const u=e.createOscillator();u.type="triangle",u.frequency.value=2093;const g=e.createGain();g.gain.setValueAtTime(0,e.currentTime+1.5),g.gain.linearRampToValueAtTime(.03,e.currentTime+2.5),g.gain.exponentialRampToValueAtTime(.001,e.currentTime+4.5),u.connect(g).connect(f),u.start(),u.stop(e.currentTime+4.6)}function F(u,g){if(!e)return null;const a=e.createOscillator();a.type="sine",a.frequency.value=u+g*8;const E=e.createGain();return E.gain.setValueAtTime(0,e.currentTime),E.gain.linearRampToValueAtTime(.06,e.currentTime+.05),a.connect(E).connect(f),a.start(),{osc:a,gain:E}}function y(u){if(!u||!e)return;u.gain.gain.setTargetAtTime(0,e.currentTime,.05),u.osc.stop(e.currentTime+.25);const g=e.createOscillator();g.frequency.value=80;const a=e.createGain();a.gain.setValueAtTime(.1,e.currentTime),a.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),g.connect(a).connect(f),g.start(),g.stop(e.currentTime+.12)}function k(u,g){e&&setTimeout(()=>{const a=e.createOscillator();a.type="sine",a.frequency.setValueAtTime(u.baseFreq,e.currentTime),a.frequency.linearRampToValueAtTime(u.baseFreq*1.1,e.currentTime+.4);const E=e.createGain();E.gain.setValueAtTime(.05,e.currentTime),E.gain.exponentialRampToValueAtTime(.001,e.currentTime+.4),a.connect(E).connect(f),a.start(),a.stop(e.currentTime+.45)},g)}function R(){e&&f.gain.linearRampToValueAtTime(0,e.currentTime+1.2)}return{startAmbience:V,electricArc:P,igniteNode:p,skillHover:D,skillClick:j,triggerConvergence:N,dragNode:F,releaseNode:y,exitNode:k,stopAll:R}}function tn({level:e}){const f=r.useRef(null),I=r.useRef(null),V=r.useRef(0),P=r.useMemo(()=>{switch(e){case"MASTER":return{amp:18,noise:.05,speed:1.5};case"FLUENT":return{amp:12,noise:.2,speed:1.2};case"CAPABLE":return{amp:7,noise:.5,speed:.9};case"LEARNING":return{amp:3,noise:1,speed:.7};default:return{amp:10,noise:.3,speed:1}}},[e]);return r.useEffect(()=>{const p=f.current;if(!p)return;const D=p.getContext("2d"),j=p.width,N=p.height,F=()=>{V.current+=.02,D.clearRect(0,0,j,N),D.beginPath(),D.strokeStyle="#C9A84C",D.lineWidth=1.5;for(let y=0;y<j;y++){const k=y/j,R=(Math.random()-.5)*P.noise*P.amp,u=N/2+Math.sin(k*Math.PI*4+V.current*P.speed)*P.amp+R;y===0?D.moveTo(y,u):D.lineTo(y,u)}D.stroke(),I.current=requestAnimationFrame(F)};return F(),()=>cancelAnimationFrame(I.current)},[P]),C.jsx("canvas",{ref:f,width:120,height:24,style:{display:"block"}})}function rn({skill:e,x:f,y:I,visible:V}){return C.jsxs("div",{className:`forge-skill-tooltip ${V?"visible":""}`,style:{left:f+16,top:I-20},children:[C.jsxs("div",{className:"forge-tooltip-header",children:["◈ ",e==null?void 0:e.name]}),C.jsx("div",{className:"forge-tooltip-divider"}),C.jsx("div",{className:"forge-tooltip-desc",children:e==null?void 0:e.desc}),C.jsxs("div",{className:"forge-tooltip-wave",children:[C.jsx(tn,{level:e==null?void 0:e.level}),C.jsx("span",{className:"forge-tooltip-level",children:e==null?void 0:e.level})]})]})}class on{constructor(f,I){this.mesh=f,this.home=I.clone(),this.velocity=new L,this.stiffness=.08,this.damping=.75,this.isDragging=!1}update(){if(this.isDragging)return;const f=new L().subVectors(this.home,this.mesh.position);this.velocity.add(f.multiplyScalar(this.stiffness)),this.velocity.multiplyScalar(this.damping),this.mesh.position.add(this.velocity)}}function an(e){const f=ge.forgeParticles,I=new Float32Array(f*3),V=new Float32Array(f*3),P=new Float32Array(f*3);for(let m=0;m<f;m++)I[m*3]=(Math.random()-.5)*40,I[m*3+1]=(Math.random()-.5)*20,I[m*3+2]=(Math.random()-.5)*40;const p=new ue;p.setAttribute("position",new fe(I,3)),p.setAttribute("color",new fe(P,3));const D=new Se({size:.06,vertexColors:!0,transparent:!0,opacity:.8,blending:ce,depthWrite:!1}),j=new Me(p,D);e.add(j);const N=new oe(62975),F=new oe(13215820),y=new oe;function k(m){let w=Math.sin(m*127.1)*43758.5453123;return w-Math.floor(w)}function R(m,w,d){return(k(m*1.1+w*31.4+d*7.3)-.5)*2}function u(m,w,d,z){return(R(m,w+z,d)-R(m,w-z,d)-R(m,w,d+z)+R(m,w,d-z))/(2*z)}function g(m,w,d,z){return(R(m,w,d+z)-R(m,w,d-z)-R(m+z,w,d)+R(m-z,w,d))/(2*z)}function a(m,w,d,z){return(R(m+z,w,d)-R(m-z,w,d)-R(m,w+z,d)+R(m,w-z,d))/(2*z)}let E=0;const T=Array(5).fill(null).map(()=>({pos:new L,strength:0}));function M(m,w){E+=m,w.forEach((Q,X)=>{T[X].pos.copy(Q.pos),T[X].strength=Q.strength});const d=p.attributes.position.array,z=p.attributes.color.array;for(let Q=0;Q<f;Q++){const X=Q*3,J=Q*3+1,Z=Q*3+2;let ee=d[X],A=d[J],b=d[Z];const o=.1,s=.3+E*.08;let v=u(ee*s,A*s,b*s,o)*.02,x=g(ee*s,A*s,b*s,o)*.02,i=a(ee*s,A*s,b*s,o)*.02;for(let n=0;n<5;n++){const t=T[n].pos.x-ee,G=T[n].pos.y-A,h=T[n].pos.z-b,l=Math.sqrt(t*t+G*G+h*h);if(l<8&&T[n].strength>0){const W=(1-l/8)*.08*T[n].strength/Math.max(l,.1);v+=t*W,x+=G*W,i+=h*W}}V[X]=v,V[J]=x,V[Z]=i,ee+=v,A+=x,b+=i,d[X]=(ee+20)%40-20,d[J]=(A+10)%20-10,d[Z]=(b+20)%40-20;const S=Math.sqrt(v*v+x*x+i*i),c=Math.min(S/.05,1);y.lerpColors(F,N,c),z[X]=y.r,z[J]=y.g,z[Z]=y.b}return p.attributes.position.needsUpdate=!0,p.attributes.color.needsUpdate=!0,f}function B(){e.remove(j),p.dispose(),D.dispose()}return{points:j,update:M,dispose:B,count:f}}function sn(e=2,f=!1){const I=f?Math.max(1,e-1):e,V=[];function P(j,N,F,y,k){if(k===0){const M=[j,N,F,y];[[0,1,2],[0,1,3],[0,2,3],[1,2,3]].forEach(m=>m.forEach(w=>{const d=M[w];V.push(d.x,d.y,d.z)}));return}const R=new L().addVectors(j,N).multiplyScalar(.5),u=new L().addVectors(j,F).multiplyScalar(.5),g=new L().addVectors(j,y).multiplyScalar(.5),a=new L().addVectors(N,F).multiplyScalar(.5),E=new L().addVectors(N,y).multiplyScalar(.5),T=new L().addVectors(F,y).multiplyScalar(.5);P(j,R,u,g,k-1),P(N,R,a,E,k-1),P(F,u,a,T,k-1),P(y,g,E,T,k-1)}const p=1.5;P(new L(p,p,p),new L(-p,-p,p),new L(-p,p,-p),new L(p,-p,-p),I);const D=new ue;return D.setAttribute("position",new Ye(V,3)),D.computeVertexNormals(),D}function cn({scrollProgress:e,activeNode:f,onParticleCount:I,visitedNodes:V,convergenceActive:P,freeForgActive:p,onNodeActivate:D,dragEnabled:j,audioRef:N}){const{scene:F,camera:y,gl:k}=Pe(),R=ve(A=>A.performanceLow),u=r.useRef([]),g=r.useRef([]),a=r.useRef([]);r.useRef([]);const E=r.useRef([]),T=r.useRef(null),M=r.useRef([]),B=r.useRef([]),m=r.useRef(null),w=r.useRef(new be),d=r.useRef(new de),z=r.useRef(0),Q=r.useRef(0);r.useRef(O.map(A=>A.position.clone())),r.useRef(O.map(()=>1));const X=r.useRef({emissive:O.map(()=>1)}),J=r.useRef(new L(0,3,18)),Z=r.useRef(new L(0,0,0)),ee=r.useRef(new L(0,0,0));return r.useEffect(()=>{F.background=new oe(329744),F.fog=new Ne(329744,.02);const A=new Fe(1118498,.3);F.add(A);const b=new Ie(62975,.5,30);b.position.set(0,8,0),F.add(b),[{pos:[0,0,-30],rot:[0,0,0],color:[0,.96,1]},{pos:[0,0,30],rot:[0,Math.PI,0],color:[.63,.41,.97]},{pos:[-30,0,0],rot:[0,Math.PI/2,0],color:[.79,.66,.3]},{pos:[30,0,0],rot:[0,-Math.PI/2,0],color:[.94,.93,.91]}].forEach(t=>{const G=new ye(40,40,1,1),h=new me({vertexShader:Xe,fragmentShader:Je,uniforms:{uTime:{value:0},uColor:{value:new L(...t.color)},uRippleOrigin:{value:new de(.5,.5)},uRippleTime:{value:-99},uPulseSync:{value:0}},transparent:!0,side:ze,depthWrite:!1,blending:ce}),l=new te(G,h);l.position.set(...t.pos),l.rotation.set(...t.rot),F.add(l),g.current.push(l),a.current.push(h)});const s=new ye(80,80),v=new ie({color:329744,roughness:.1,metalness:.9,envMapIntensity:.4}),x=new te(s,v);x.rotation.x=-Math.PI/2,x.position.y=-5,F.add(x);const i=document.createElement("canvas");i.width=128,i.height=128;const S=i.getContext("2d"),c=S.createRadialGradient(64,64,0,64,64,64);c.addColorStop(0,"rgba(255, 255, 255, 1)"),c.addColorStop(1,"rgba(255, 255, 255, 0)"),S.fillStyle=c,S.fillRect(0,0,128,128);const n=new Ge(i);return O.forEach((t,G)=>{const h=new xe;h.position.copy(t.position),F.add(h);let l;if(t.color.clone(),t.nodeType==="blob"){const H=new Ve(1.5,R?2:4),Y=new me({vertexShader:Ke,fragmentShader:Ze,uniforms:{uTime:{value:0},uScale:{value:1},uColor:{value:t.color},uEmissiveIntensity:{value:.3}}});l=new te(H,Y),h.add(l)}else if(t.nodeType==="rings"){const H=new pe(.8,R?12:16,R?12:16),Y=new ie({color:329744,metalness:1,roughness:.2});l=new te(H,Y),h.add(l),[{r:1.4,tube:.05,rx:0,ry:0,rz:0,speed:1.2},{r:1.8,tube:.04,rx:1,ry:0,rz:0,speed:-.8},{r:1.3,tube:.04,rx:0,ry:1,rz:0,speed:1.5},{r:1.6,tube:.03,rx:.5,ry:.5,rz:0,speed:-1.1}].forEach(q=>{const U=new je(q.r,q.tube,8,R?32:48),re=new ie({color:t.color,emissive:t.color,emissiveIntensity:.8,wireframe:!0}),_=new te(U,re);_.rotation.set(q.rx,q.ry,q.rz),_.userData.speed=q.speed,h.add(_)})}else if(t.nodeType==="fractal"){const H=sn(2,R),Y=new ie({color:t.color,emissive:t.color,emissiveIntensity:.4,wireframe:!1,side:we});l=new te(H,Y),h.add(l);const $=new Float32Array(80*3);for(let _=0;_<80;_++){const le=_/80*Math.PI*2,he=2.5+Math.random()*.5;$[_*3]=Math.cos(le)*he,$[_*3+1]=(Math.random()-.5)*.2,$[_*3+2]=Math.sin(le)*he}const q=new ue;q.setAttribute("position",new fe($,3));const U=new Se({color:t.color,size:.06,transparent:!0,opacity:.7,blending:ce}),re=new Me(q,U);h.add(re)}else if(t.nodeType==="voronoi"){const H=new pe(1.5,R?32:64,R?32:64),Y=new me({vertexShader:`
            varying vec2 vUv; varying vec3 vNormal;
            void main() { vUv = uv; vNormal = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
          `,fragmentShader:en,uniforms:{uTime:{value:0},uColor:{value:t.color},uEmissiveIntensity:{value:.3}}});l=new te(H,Y),h.add(l)}else if(t.nodeType==="shards"){const H=[new Be(.4,.4,.4),new Ue(.25,.6,6),new qe(.15,.15,.6,8),new Te(.3,.5,12),new Oe(.35)],Y=new ie({color:t.color,emissive:t.color,emissiveIntensity:.5});H.forEach(($,q)=>{const U=new te($,Y.clone()),re=q/H.length*Math.PI*2,_=.8+q*.25;U.position.set(Math.cos(re)*_,(q-2)*.3,Math.sin(re)*_),U.userData.orbitRadius=_,U.userData.orbitSpeed=.4+q*.1,U.userData.orbitAngle=re,h.add(U)}),l=h.children[0]}const W=new We({map:n,color:t.color,transparent:!0,opacity:.35,blending:ce,depthWrite:!1}),ne=new ke(W);ne.scale.set(6,6,1),h.add(ne),h.userData.haloMat=W;const ae=new xe;ae.visible=!1,t.skills.forEach((H,Y)=>{const $=new L((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2).normalize(),q=5+Math.random()*3,U=new te(new pe(.12,R?4:8,R?4:8),new ie({color:t.color,emissive:t.color,emissiveIntensity:1}));U.position.copy($.multiplyScalar(q)),U.userData.skill=H,U.userData.dir=$.clone(),U.userData.radius=q,U.userData.homePos=U.position.clone(),U.userData.disciplineColor=t.color,U.userData.disciplineBaseFreq=t.baseFreq,U.userData.isSkillParticle=!0;const re=new Te(.22,.28,32),_=new _e({color:13215820,transparent:!0,opacity:0,side:we,depthWrite:!1}),le=new te(re,_);le.userData.isGoldRing=!0,U.add(le),ae.add(U)}),h.add(ae),h.userData.childGroup=ae,h.userData.isNode=!0,h.userData.disciplineIndex=G,h.userData.disc=t,h.userData.ignited=!1,h.userData.emissiveBase=1,u.current.push(h);const se=new on(h,t.position.clone());se.anchor=t.position.clone(),B.current.push(se)}),O.forEach((t,G)=>{const h=(G+1)%O.length,l=[];for(let se=0;se<=32;se++){const H=se/32,Y=O[G].position.clone(),$=O[h].position.clone(),q=Y.clone().lerp($,.5);q.y+=2,l.push(new He(Y,q,$).getPoint(H))}const W=new ue().setFromPoints(l),ne=new Ee({color:13215820,transparent:!0,opacity:0,blending:ce,depthWrite:!1}),ae=new Ae(W,ne);F.add(ae),M.current.push({line:ae,mat:ne})}),T.current=an(F),y.position.set(0,2,12),y.lookAt(0,0,0),()=>{var t;(t=T.current)==null||t.dispose(),F.clear(),u.current=[],B.current=[],a.current=[],E.current=[],M.current=[]}},[]),Qe((A,b)=>{var S;z.current+=b;const o=z.current,s=e.current??0;if(a.current.forEach(c=>{c.uniforms.uTime.value=o;const n=P.current?Math.min((performance.now()-P.current)/2e3,1):0;c.uniforms.uPulseSync.value=n}),o-Q.current>.2+Math.random()*.15){Q.current=o;const c=(Math.random()-.5)*30,n=(Math.random()-.5)*30,t=c+(Math.random()-.5)*8,G=n+(Math.random()-.5)*8,h=[new L(c,30,n),new L(t,30,G)],l=new ue().setFromPoints(h),W=new Ee({color:16777215,transparent:!0,opacity:1,blending:ce}),ne=new Ae(l,W);F.add(ne),E.current.push({arc:ne,born:o})}E.current=E.current.filter(({arc:c,born:n})=>o-n>.12?(F.remove(c),c.geometry.dispose(),!1):!0);const v=O.map((c,n)=>{var t,G;return{pos:((t=u.current[n])==null?void 0:t.position)??O[n].position,strength:(G=V.current)!=null&&G.has(n)?.3:0}});u.current.forEach((c,n)=>{var h;if(!c)return;const t=O[n],G=B.current[n];if(!G.isDragging){const l=Math.sin(o*.5+n*1.3)*.3,W=Math.sin(o/8+n*1.2)*.15;G.home.set(G.anchor.x+W,G.anchor.y+l,G.anchor.z)}if(G.update(),t.nodeType==="rings"&&c.children.forEach(l=>{l.userData.speed&&(l.rotation.z+=b*l.userData.speed)}),t.nodeType==="fractal"&&(c.rotation.y+=b*.2,c.rotation.x+=b*.05),t.nodeType==="shards"&&c.children.forEach(l=>{if(l.userData.orbitSpeed!=null){l.userData.orbitAngle+=b*l.userData.orbitSpeed;const W=l.userData.orbitRadius;l.position.x=Math.cos(l.userData.orbitAngle)*W,l.position.z=Math.sin(l.userData.orbitAngle)*W,l.rotation.x+=b,l.rotation.y+=b*.7}}),c.children.forEach(l=>{var W,ne;(ne=(W=l.material)==null?void 0:W.uniforms)!=null&&ne.uTime&&(l.material.uniforms.uTime.value=o)}),c.userData.haloMat){const l=(h=V.current)!=null&&h.has(n)?.28:.15;c.userData.haloMat.opacity=l+Math.sin(o*1.5+n)*.05}});const x=.2,i=[.2,.36,.52,.64,.76,.88];if(s<x)J.current.set(0,5,25),Z.current.set(0,0,0);else if(s<.88)for(let c=0;c<5;c++){const n=i[c],t=i[c+1];if(s>=n&&s<t){const G=(s-n)/(t-n),h=O[c];J.current.copy(h.position).add(new L(-4,1.5,9)),Z.current.copy(h.position),G>.15&&!((S=u.current[c])!=null&&S.userData.ignited)&&(u.current[c].userData.ignited=!0,D(c));break}}else J.current.set(0,6,28),Z.current.set(0,0,0);if(y.position.lerp(J.current,b*1.5),ee.current.lerp(Z.current,b*2),y.lookAt(ee.current),T.current){const c=T.current.update(b,v);I&&I(c)}}),r.useEffect(()=>{const A=k.domElement,b=v=>{const x=A.getBoundingClientRect();if(d.current.x=(v.clientX-x.left)/x.width*2-1,d.current.y=-((v.clientY-x.top)/x.height)*2+1,m.current&&p.current){B.current[m.current.index],w.current.setFromCamera(d.current,y);const i=new $e(new L(0,0,1),-m.current.group.position.z),S=new L;w.current.ray.intersectPlane(i,S),S&&m.current.group.position.set(S.x,S.y,m.current.group.position.z)}},o=v=>{var c;if(!p.current)return;const x=A.getBoundingClientRect();d.current.x=(v.clientX-x.left)/x.width*2-1,d.current.y=-((v.clientY-x.top)/x.height)*2+1,w.current.setFromCamera(d.current,y);const i=u.current.map(n=>n).filter(Boolean),S=w.current.intersectObjects(i,!0);if(S.length>0){let n=S[0].object;for(;n.parent&&!n.userData.isNode;)n=n.parent;if(n.userData.isNode){const t=n.userData.disciplineIndex;B.current[t].isDragging=!0,m.current={group:n,index:t};const G=(c=N.current)==null?void 0:c.dragNode(O[t].baseFreq,0);n.userData.dragTone=G}}},s=()=>{var v;if(m.current){const x=m.current.index;B.current[x].isDragging=!1,(v=N.current)==null||v.releaseNode(m.current.group.userData.dragTone),m.current=null}};return A.addEventListener("pointermove",b),A.addEventListener("pointerdown",o),A.addEventListener("pointerup",s),()=>{A.removeEventListener("pointermove",b),A.removeEventListener("pointerdown",o),A.removeEventListener("pointerup",s)}},[k,y,p]),r.useEffect(()=>{const A=b=>{const o=b.detail.index,s=u.current[o];if(!s)return;K.to(s.scale,{x:3,y:3,z:3,duration:.3,ease:"cubic-bezier(0.34,1.56,0.64,1)",onComplete:()=>{K.to(s.scale,{x:1.4,y:1.4,z:1.4,duration:.4})}});const v=s.userData.childGroup;v.visible=!0,v.children.forEach((x,i)=>{const S=x.userData.homePos.clone();x.position.set(0,0,0),K.to(x.position,{x:S.x,y:S.y,z:S.z,delay:i*.01,duration:.6,ease:"power2.out"}),x.userData.labelVisible=!0}),a.current[0]&&K.to(a.current[0].uniforms.uPulseSync,{value:.5,duration:.4,yoyo:!0,repeat:1})};return window.addEventListener("forge:ignite",A),()=>window.removeEventListener("forge:ignite",A)},[]),r.useEffect(()=>{const A=b=>{const o=b.detail.index,s=u.current[o];if(!s)return;const v=s.userData.childGroup;v.children.forEach((x,i)=>{K.to(x.position,{x:0,y:0,z:0,delay:i*.008,duration:.5,ease:"power2.in",onComplete:()=>{i===v.children.length-1&&(v.visible=!1)}})}),K.to(s.scale,{x:1,y:1,z:1,duration:.6,ease:"back.out(1.7)"}),X.current.emissive[o]=1.8,s.userData.haloMat&&(s.userData.haloMat.opacity=.25),M.current[o]&&K.to(M.current[o].mat,{opacity:.5,duration:.8})};return window.addEventListener("forge:retract",A),()=>window.removeEventListener("forge:retract",A)},[]),r.useEffect(()=>{const A=(i,S)=>{B.current.forEach((c,n)=>{const t=i(n);K.to(c.anchor,{...t,overwrite:!0,...S(n)})})},b=i=>({x:Math.cos(i/5*Math.PI*2)*4.5,y:0,z:Math.sin(i/5*Math.PI*2)*4.5}),o=()=>{A(b,()=>({duration:2.5,ease:"power2.inOut"})),M.current.forEach(({mat:i})=>{K.to(i,{opacity:.8,duration:1,overwrite:!0})})},s=()=>{A(i=>{const S=O[i].position;return{x:S.x,y:S.y,z:S.z}},()=>({duration:1.6,ease:"power2.inOut"})),M.current.forEach(({mat:i},S)=>{var n;const c=(n=V.current)==null?void 0:n.has(S);K.to(i,{opacity:c?.5:0,duration:.8,overwrite:!0})})},v=()=>{A(i=>({...b(i),y:40}),i=>({duration:.8+i*.1,ease:"power2.in",delay:i*.1})),a.current.forEach(i=>{K.to(i.uniforms.uPulseSync,{value:0,duration:1.2})})},x=()=>{A(b,()=>({duration:1.2,ease:"power2.out"}))};return window.addEventListener("forge:convergence",o),window.addEventListener("forge:diverge",s),window.addEventListener("forge:exit",v),window.addEventListener("forge:return",x),()=>{window.removeEventListener("forge:convergence",o),window.removeEventListener("forge:diverge",s),window.removeEventListener("forge:exit",v),window.removeEventListener("forge:return",x)}},[]),null}function Re({text:e,step:f,offset:I=0}){let V=0;const P=e.split(" ").map(p=>{const D={word:p,start:V};return V+=p.length+1,D});return C.jsx("div",{className:"forge-conv-line reveal",children:P.map(({word:p,start:D})=>C.jsx("span",{className:"forge-conv-word",children:p.split("").map((j,N)=>C.jsx("span",{className:"forge-conv-letter",style:{animationDelay:`${(D+N)*f+I}s`},children:j},N))},D))})}function mn(){const e=r.useRef(null),f=r.useRef(0),I=r.useRef(-1),V=r.useRef(new Set),P=r.useRef(null),p=r.useRef(!1),D=r.useRef(!1),j=r.useRef([]),N=r.useRef(nn()),F=Ce(),[y,k]=r.useState(null),[R,u]=r.useState(null),[g,a]=r.useState({x:0,y:0}),[E,T]=r.useState(new Set),[M,B]=r.useState({line1:!1,line2:!1}),[m,w]=r.useState(!1),[d,z]=r.useState(!1),Q=r.useRef(null);r.useRef(new be),r.useRef(new de);const X=ve(o=>o.realm),J=ve(o=>o.soundEnabled);r.useEffect(()=>{var o,s;if(X!==2||!J)(o=N.current)!=null&&o.stopAll&&N.current.stopAll();else if((s=N.current)!=null&&s.startAmbience)try{N.current.startAmbience()}catch{}},[X,J]),r.useEffect(()=>{const o=K.context(()=>{De.create({trigger:e.current,start:"top top",end:"+=6000",pin:!0,scrub:1,anticipatePin:1,onUpdate:s=>{var c;const v=s.progress;f.current=v,z(v<.2),v>=.88&&!P.current?(P.current=performance.now(),window.dispatchEvent(new CustomEvent("forge:convergence")),(c=N.current)==null||c.triggerConvergence(),j.current.push(setTimeout(()=>B(n=>({...n,line1:!0})),2500),setTimeout(()=>B(n=>({...n,line2:!0})),4500))):v<.87&&P.current&&(P.current=null,j.current.forEach(clearTimeout),j.current=[],B({line1:!1,line2:!1}),window.dispatchEvent(new CustomEvent("forge:diverge")));const x=[.2,.36,.52,.64,.76,.88];let i=-1;for(let n=0;n<5&&!P.current;n++)if(v>=x[n]&&v<x[n+1]){i=n;break}i!==I.current&&(I.current>=0&&window.dispatchEvent(new CustomEvent("forge:retract",{detail:{index:I.current}})),I.current=i,i>=0?k(O[i]):k(null));const S=v>=.92;S!==p.current&&(p.current=S,w(S)),v>=.98&&!D.current?(D.current=!0,window.dispatchEvent(new CustomEvent("forge:exit"))):v<.96&&D.current&&(D.current=!1,window.dispatchEvent(new CustomEvent("forge:return")))}})},e);return()=>{j.current.forEach(clearTimeout),o.revert()}},[]);const Z=r.useCallback(o=>{var s,v;if(!V.current.has(o)){V.current.add(o),T(new Set(V.current)),window.dispatchEvent(new CustomEvent("forge:ignite",{detail:{index:o}})),(s=N.current)==null||s.igniteNode(O[o].baseFreq);try{(v=N.current)==null||v.startAmbience()}catch{}}},[]),ee=r.useCallback(o=>{a({x:o.clientX,y:o.clientY})},[]);return C.jsxs("div",{className:"forge-container",ref:e,children:[C.jsx(Le,{ref:Q,onMouseMove:ee,style:{position:"absolute",inset:0},gl:{antialias:ge.TIER>=2,alpha:!1,powerPreference:"high-performance",stencil:!1},dpr:[.85,ge.pixelRatio],frameloop:F,children:C.jsx(cn,{scrollProgress:f,activeNode:I,visitedNodes:V,convergenceActive:P,freeForgActive:p,onNodeActivate:Z,dragEnabled:p,audioRef:N})}),C.jsxs("div",{className:"forge-realm-label",children:[C.jsx("span",{className:"forge-realm-num",children:"II. THE FORGE"}),y&&C.jsxs("span",{className:"forge-active-disc",children:["[ ",y.name," ] — ACTIVE"]})]}),C.jsx("div",{className:`forge-progress-dots ${E.size>=O.length?"all-visited":""}`,children:O.map((o,s)=>C.jsx("div",{className:`forge-dot ${E.has(s)?"visited":""} ${(y==null?void 0:y.id)===o.id?"active":""}`,title:o.name},o.id))}),d&&C.jsx("div",{className:"forge-approach-prompt",children:"APPROACH A DISCIPLINE."}),y&&C.jsxs("div",{className:"forge-discipline-overlay",children:[C.jsx("h2",{className:"forge-disc-title",children:y.name.split("").map((o,s)=>C.jsx("span",{className:"forge-letter",style:{animationDelay:`${s*.06}s`},children:o===" "?" ":o},s))}),C.jsx("p",{className:"forge-disc-desc",children:y.description}),C.jsx("p",{className:"forge-disc-depth",children:y.depth})]}),M.line1&&C.jsxs("div",{className:"forge-convergence-text",children:[C.jsx(Re,{text:"THE RAREST SKILL IS KNOWING WHAT TO BUILD.",step:.04}),M.line2&&C.jsx(Re,{text:"THE SECOND RAREST IS ACTUALLY BUILDING IT.",step:.06,offset:.3})]}),m&&C.jsx("div",{className:"forge-freeforge-prompt",children:"DRAG ANYTHING. SEE WHAT HOLDS."}),R&&C.jsx(rn,{skill:R,x:g.x,y:g.y,visible:!!R})]})}export{mn as default};
