import{r as s,R as Ae,V as pe,u as ge,g as J,S as Se,b as S,c as oe,j as M,C as De,d as Me,F as Ce,A as Pe,P as Ne,e as he,f as de,h as ie,i as Le,M as ne,k as ae,l as Ge,G as ye,I as Ie,m as me,T as Fe,D as xe,B as ue,n as fe,o as Re,p as Ee,q as ze,s as je,t as Ve,v as we,O as Ue,w as Be,x as qe,y as ke,Q as We,L as Te,z as be,a as Oe,E as _e,H as He}from"./index-CIeHNeq0.js";const Xe=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Ye=`// containmentField.frag.glsl — Forge chamber boundary walls
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
`,$e=`// forgeBlob.vert.glsl — Morphing organic blob for Design node
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
`,Qe=`// forgeBlobFrag.glsl — Lit material for morphing blob
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
`,Ze=`// voronoiSphere.frag.glsl — Strategy node surface (Voronoi cells)
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
`,k=[{id:"design",name:"DESIGN",description:"Building interfaces where every pixel has a reason to exist.",depth:"5 years crafting visual systems",color:new oe(8073150),baseFreq:196,position:new S(-10,-1.5,4),nodeType:"blob",skills:[{name:"UI/UX Design",desc:"Designing experiences that feel inevitable",level:"FLUENT",related:["Design Systems","Motion Design"]},{name:"Design Systems",desc:"Building languages the whole team can speak",level:"MASTER",related:["UI/UX Design","Typography"]},{name:"Typography",desc:"Treating type as a first-class design material",level:"FLUENT",related:["Design Systems","Brand Identity"]},{name:"Motion Design",desc:"Making transitions that teach the interface",level:"CAPABLE",related:["UI/UX Design","Design Systems"]},{name:"Brand Identity",desc:"Giving products a voice they carry everywhere",level:"CAPABLE",related:["Typography","UI/UX Design"]}]},{id:"engineering",name:"ENGINEERING",description:"Writing code that performs, scales, and ages well.",depth:"6 years building production systems",color:new oe(62975),baseFreq:220,position:new S(10,2,0),nodeType:"rings",skills:[{name:"React",desc:"Components as the atomic unit of thought",level:"MASTER",related:["TypeScript","Performance"]},{name:"Three.js",desc:"Turning math into light people can touch",level:"FLUENT",related:["WebGL/GLSL","React"]},{name:"WebGL/GLSL",desc:"Writing directly to the GPU in its own language",level:"FLUENT",related:["Three.js","Creative Tech"]},{name:"Node.js",desc:"APIs that communicate what they mean",level:"FLUENT",related:["REST APIs","TypeScript"]},{name:"TypeScript",desc:"Types as documentation that never goes stale",level:"MASTER",related:["React","Node.js"]},{name:"REST APIs",desc:"Contracts between systems that hold under pressure",level:"FLUENT",related:["Node.js","Performance"]},{name:"Performance",desc:"The 60fps imperative — no frame goes wasted",level:"CAPABLE",related:["React","WebGL/GLSL"]}]},{id:"creative",name:"CREATIVE TECH",description:"Making code behave like art and art behave like code.",depth:"4 years in generative territory",color:new oe(13215820),baseFreq:246.94,position:new S(0,5,-8),nodeType:"fractal",skills:[{name:"Generative Art",desc:"Algorithms that make decisions I would not",level:"FLUENT",related:["WebGL/GLSL","Creative Coding"]},{name:"WebGL Shaders",desc:"Painting with math on silicon canvases",level:"FLUENT",related:["Generative Art","Real-time 3D"]},{name:"Creative Coding",desc:"Tools as medium; output as artifact",level:"MASTER",related:["Generative Art","Interactive Installs"]},{name:"Real-time 3D",desc:"Worlds that exist only while you watch",level:"FLUENT",related:["WebGL Shaders","Three.js"]},{name:"Interactive Installs",desc:"Spaces that respond to presence",level:"CAPABLE",related:["Creative Coding","Real-time 3D"]}]},{id:"strategy",name:"STRATEGY",description:"Connecting what users need to what products can become.",depth:"4 years thinking in systems",color:new oe(15789544),baseFreq:261.63,position:new S(-8,-3,-6),nodeType:"voronoi",skills:[{name:"Product Thinking",desc:"Asking what the problem is before solving it",level:"FLUENT",related:["User Research","Prototyping"]},{name:"User Research",desc:"Listening for the need behind the request",level:"CAPABLE",related:["Product Thinking","Workshop Lead"]},{name:"Prototyping",desc:"Making assumptions tangible before they cost you",level:"FLUENT",related:["Product Thinking","Creative Direction"]},{name:"Creative Direction",desc:"Holding the vision while others build",level:"CAPABLE",related:["Prototyping","Product Thinking"]},{name:"Workshop Lead",desc:"Designing sessions where alignment actually happens",level:"CAPABLE",related:["User Research","Creative Direction"]}]},{id:"craft",name:"CRAFT",description:"The instruments — chosen with care, wielded with precision.",depth:"Sharp tools, daily practice",color:new oe(13150590),baseFreq:293.66,position:new S(8,-4,-4),nodeType:"shards",skills:[{name:"Figma",desc:"Where ideas become decisions become handoffs",level:"MASTER",related:["Design Systems","Prototyping"]},{name:"Blender",desc:"Sculpting forms that live in 3D space",level:"CAPABLE",related:["Three.js","Real-time 3D"]},{name:"GSAP",desc:"Animation that means something, every frame",level:"MASTER",related:["Motion Design","React"]},{name:"Git",desc:"History as a first draft, not an archive",level:"FLUENT",related:["Node.js","TypeScript"]},{name:"Photoshop",desc:"Pixel-level decisions when they matter",level:"FLUENT",related:["Brand Identity","UI/UX Design"]},{name:"Premiere",desc:"Story told through the cut",level:"CAPABLE",related:["Motion Design","Creative Direction"]}]}];function Je(){let e=null,v=null;function C(){e||(e=new(window.AudioContext||window.webkitAudioContext),v=e.createGain(),v.gain.value=0,v.connect(e.destination))}function b(){C(),v.gain.linearRampToValueAtTime(1,e.currentTime+2)}function N(){if(!e)return;const g=e.createBuffer(1,e.sampleRate*.08,e.sampleRate),c=g.getChannelData(0);for(let a=0;a<c.length;a++)c[a]=Math.random()*2-1;const i=e.createBufferSource();i.buffer=g;const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=4e3,p.Q.value=2;const D=e.createGain();D.gain.value=.08;const w=e.createStereoPanner();w.pan.value=Math.random()-.5,i.connect(p).connect(D).connect(w).connect(v),i.start()}function F(g){if(!e)return;const c=e.createOscillator();c.type="sine",c.frequency.value=80;const i=e.createGain();i.gain.setValueAtTime(.25,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.2),c.connect(i).connect(v),c.start(),c.stop(e.currentTime+.22),[1,1.5,2,3,4].forEach(y=>{const f=e.createOscillator();f.type="sine",f.frequency.value=g*y;const x=e.createGain();x.gain.setValueAtTime(0,e.currentTime+.02),x.gain.linearRampToValueAtTime(.06,e.currentTime+.04),x.gain.setValueAtTime(.06,e.currentTime+.64),x.gain.exponentialRampToValueAtTime(.001,e.currentTime+1.04),f.connect(x).connect(v),f.start(),f.stop(e.currentTime+1.1)});const D=e.createOscillator();D.type="triangle",D.frequency.value=2e3;const w=e.createGain();w.gain.setValueAtTime(.12,e.currentTime),w.gain.exponentialRampToValueAtTime(.001,e.currentTime+.3);const a=e.createBiquadFilter();a.type="bandpass",a.frequency.value=2250,a.Q.value=2,D.connect(a).connect(w).connect(v),D.start(),D.stop(e.currentTime+.35)}function A(g){if(!e)return;const c=e.createOscillator();c.type="sine",c.frequency.value=880*(1+(g/300-.6)*.2);const i=e.createGain();i.gain.setValueAtTime(.025,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.04),c.connect(i).connect(v),c.start(),c.stop(e.currentTime+.05)}function O(){if(!e)return;const g=e.createBuffer(1,Math.floor(e.sampleRate*.06),e.sampleRate),c=g.getChannelData(0);for(let w=0;w<c.length;w++)c[w]=Math.random()*2-1;const i=e.createBufferSource();i.buffer=g;const p=e.createBiquadFilter();p.type="bandpass",p.frequency.value=3e3,p.Q.value=4;const D=e.createGain();D.gain.value=.12,i.connect(p).connect(D).connect(v),i.start()}function q(){if(!e)return;k.forEach((i,p)=>{const D=e.createOscillator();D.type="sine",D.frequency.value=i.baseFreq;const w=e.createGain();w.gain.setValueAtTime(0,e.currentTime),w.gain.linearRampToValueAtTime(.04,e.currentTime+1.5),w.gain.setValueAtTime(.04,e.currentTime+1.5),w.gain.exponentialRampToValueAtTime(.001,e.currentTime+4),D.connect(w).connect(v),D.start(),D.stop(e.currentTime+4.1)});const g=e.createOscillator();g.type="triangle",g.frequency.value=2093;const c=e.createGain();c.gain.setValueAtTime(0,e.currentTime+1.5),c.gain.linearRampToValueAtTime(.03,e.currentTime+2.5),c.gain.exponentialRampToValueAtTime(.001,e.currentTime+4.5),g.connect(c).connect(v),g.start(),g.stop(e.currentTime+4.6)}function m(g,c){if(!e)return null;const i=e.createOscillator();i.type="sine",i.frequency.value=g+c*8;const p=e.createGain();return p.gain.setValueAtTime(0,e.currentTime),p.gain.linearRampToValueAtTime(.06,e.currentTime+.05),i.connect(p).connect(v),i.start(),{osc:i,gain:p}}function L(g){if(!g||!e)return;g.gain.gain.setTargetAtTime(0,e.currentTime,.05),g.osc.stop(e.currentTime+.25);const c=e.createOscillator();c.frequency.value=80;const i=e.createGain();i.gain.setValueAtTime(.1,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),c.connect(i).connect(v),c.start(),c.stop(e.currentTime+.12)}function G(g,c){e&&setTimeout(()=>{const i=e.createOscillator();i.type="sine",i.frequency.setValueAtTime(g.baseFreq,e.currentTime),i.frequency.linearRampToValueAtTime(g.baseFreq*1.1,e.currentTime+.4);const p=e.createGain();p.gain.setValueAtTime(.05,e.currentTime),p.gain.exponentialRampToValueAtTime(.001,e.currentTime+.4),i.connect(p).connect(v),i.start(),i.stop(e.currentTime+.45)},c)}function U(){e&&v.gain.linearRampToValueAtTime(0,e.currentTime+1.2)}return{startAmbience:b,electricArc:N,igniteNode:F,skillHover:A,skillClick:O,triggerConvergence:q,dragNode:m,releaseNode:L,exitNode:G,stopAll:U}}function Ke({level:e}){const v=s.useRef(null),C=s.useRef(null),b=s.useRef(0),N=s.useMemo(()=>{switch(e){case"MASTER":return{amp:18,noise:.05,speed:1.5};case"FLUENT":return{amp:12,noise:.2,speed:1.2};case"CAPABLE":return{amp:7,noise:.5,speed:.9};case"LEARNING":return{amp:3,noise:1,speed:.7};default:return{amp:10,noise:.3,speed:1}}},[e]);return s.useEffect(()=>{const F=v.current;if(!F)return;const A=F.getContext("2d"),O=F.width,q=F.height,m=()=>{b.current+=.02,A.clearRect(0,0,O,q),A.beginPath(),A.strokeStyle="#C9A84C",A.lineWidth=1.5;for(let L=0;L<O;L++){const G=L/O,U=(Math.random()-.5)*N.noise*N.amp,g=q/2+Math.sin(G*Math.PI*4+b.current*N.speed)*N.amp+U;L===0?A.moveTo(L,g):A.lineTo(L,g)}A.stroke(),C.current=requestAnimationFrame(m)};return m(),()=>cancelAnimationFrame(C.current)},[N]),M.jsx("canvas",{ref:v,width:120,height:24,style:{display:"block"}})}function et({skill:e,x:v,y:C,visible:b}){return M.jsxs("div",{className:`forge-skill-tooltip ${b?"visible":""}`,style:{left:v+16,top:C-20},children:[M.jsxs("div",{className:"forge-tooltip-header",children:["◈ ",e==null?void 0:e.name]}),M.jsx("div",{className:"forge-tooltip-divider"}),M.jsx("div",{className:"forge-tooltip-desc",children:e==null?void 0:e.desc}),M.jsxs("div",{className:"forge-tooltip-wave",children:[M.jsx(Ke,{level:e==null?void 0:e.level}),M.jsx("span",{className:"forge-tooltip-level",children:e==null?void 0:e.level})]})]})}class tt{constructor(v,C){this.mesh=v,this.home=C.clone(),this.velocity=new S,this.stiffness=.08,this.damping=.75,this.isDragging=!1}update(){if(this.isDragging)return;const v=new S().subVectors(this.home,this.mesh.position);this.velocity.add(v.multiplyScalar(this.stiffness)),this.velocity.multiplyScalar(this.damping),this.mesh.position.add(this.velocity)}}const se=0;function nt(e){const v=new Float32Array(se*3),C=new Float32Array(se*3),b=new Float32Array(se*3);for(let a=0;a<se;a++)v[a*3]=(Math.random()-.5)*40,v[a*3+1]=(Math.random()-.5)*20,v[a*3+2]=(Math.random()-.5)*40;const N=new ue;N.setAttribute("position",new fe(v,3)),N.setAttribute("color",new fe(b,3));const F=new Re({size:.06,vertexColors:!0,transparent:!0,opacity:.8,blending:ie,depthWrite:!1}),A=new Ee(N,F);e.add(A);const O=new oe(62975),q=new oe(13215820),m=new oe;function L(a){let y=Math.sin(a*127.1)*43758.5453123;return y-Math.floor(y)}function G(a,y,f){return(L(a*1.1+y*31.4+f*7.3)-.5)*2}function U(a,y,f,x){return(G(a,y+x,f)-G(a,y-x,f)-G(a,y,f+x)+G(a,y,f-x))/(2*x)}function g(a,y,f,x){return(G(a,y,f+x)-G(a,y,f-x)-G(a+x,y,f)+G(a-x,y,f))/(2*x)}function c(a,y,f,x){return(G(a+x,y,f)-G(a-x,y,f)-G(a,y+x,f)+G(a,y-x,f))/(2*x)}let i=0;const p=Array(5).fill(null).map(()=>({pos:new S,strength:0}));function D(a,y){i+=a,y.forEach((X,Q)=>{p[Q].pos.copy(X.pos),p[Q].strength=X.strength});const f=N.attributes.position.array,x=N.attributes.color.array;for(let X=0;X<se;X++){const Q=X*3,Z=X*3+1,K=X*3+2;let ee=f[Q],R=f[Z],T=f[K];const t=.1,n=.3+i*.08;let u=U(ee*n,R*n,T*n,t)*.02,d=g(ee*n,R*n,T*n,t)*.02,P=c(ee*n,R*n,T*n,t)*.02;for(let r=0;r<5;r++){const o=p[r].pos.x-ee,j=p[r].pos.y-R,h=p[r].pos.z-T,I=Math.sqrt(o*o+j*j+h*h);if(I<8&&p[r].strength>0){const E=(1-I/8)*.08*p[r].strength/Math.max(I,.1);u+=o*E,d+=j*E,P+=h*E}}C[Q]=u,C[Z]=d,C[K]=P,ee+=u,R+=d,T+=P,f[Q]=(ee+20)%40-20,f[Z]=(R+10)%20-10,f[K]=(T+20)%40-20;const z=Math.sqrt(u*u+d*d+P*P),l=Math.min(z/.05,1);m.lerpColors(q,O,l),x[Q]=m.r,x[Z]=m.g,x[K]=m.b}return N.attributes.position.needsUpdate=!0,N.attributes.color.needsUpdate=!0,se}function w(){e.remove(A),N.dispose(),F.dispose()}return{points:A,update:D,dispose:w,count:se}}function rt(e=2){const v=[];function C(F,A,O,q,m){if(m===0){const p=[F,A,O,q];[[0,1,2],[0,1,3],[0,2,3],[1,2,3]].forEach(w=>w.forEach(a=>{const y=p[a];v.push(y.x,y.y,y.z)}));return}const L=new S().addVectors(F,A).multiplyScalar(.5),G=new S().addVectors(F,O).multiplyScalar(.5),U=new S().addVectors(F,q).multiplyScalar(.5),g=new S().addVectors(A,O).multiplyScalar(.5),c=new S().addVectors(A,q).multiplyScalar(.5),i=new S().addVectors(O,q).multiplyScalar(.5);C(F,L,G,U,m-1),C(A,L,g,c,m-1),C(O,G,g,i,m-1),C(q,U,c,i,m-1)}const b=1.5;C(new S(b,b,b),new S(-b,-b,b),new S(-b,b,-b),new S(b,-b,-b),e);const N=new ue;return N.setAttribute("position",new _e(v,3)),N.computeVertexNormals(),N}function ot({scrollProgress:e,activeNode:v,onParticleCount:C,visitedNodes:b,convergenceActive:N,freeForgActive:F,onNodeActivate:A,dragEnabled:O,audioRef:q}){const{scene:m,camera:L,gl:G}=Me(),U=s.useRef([]),g=s.useRef([]),c=s.useRef([]);s.useRef([]);const i=s.useRef([]),p=s.useRef(null),D=s.useRef([]),w=s.useRef([]),a=s.useRef(null),y=s.useRef(new Ae),f=s.useRef(new pe),x=s.useRef(0),X=s.useRef(0);s.useRef(k.map(R=>R.position.clone())),s.useRef(k.map(()=>1));const Q=s.useRef({emissive:k.map(()=>1)}),Z=s.useRef(new S(0,3,18)),K=s.useRef(new S(0,0,0)),ee=s.useRef(new S(0,0,0));return s.useEffect(()=>{m.background=new oe(329744),m.fog=new Ce(329744,.02);const R=new Pe(1118498,.3);m.add(R);const T=new Ne(62975,.5,30);T.position.set(0,8,0),m.add(T),[{pos:[0,0,-30],rot:[0,0,0],color:[0,.96,1]},{pos:[0,0,30],rot:[0,Math.PI,0],color:[.63,.41,.97]},{pos:[-30,0,0],rot:[0,Math.PI/2,0],color:[.79,.66,.3]},{pos:[30,0,0],rot:[0,-Math.PI/2,0],color:[.94,.93,.91]}].forEach(o=>{const j=new he(40,40,1,1),h=new de({vertexShader:Xe,fragmentShader:Ye,uniforms:{uTime:{value:0},uColor:{value:new S(...o.color)},uRippleOrigin:{value:new pe(.5,.5)},uRippleTime:{value:-99},uPulseSync:{value:0}},transparent:!0,side:Le,depthWrite:!1,blending:ie}),I=new ne(j,h);I.position.set(...o.pos),I.rotation.set(...o.rot),m.add(I),g.current.push(I),c.current.push(h)});const n=new he(80,80),u=new ae({color:329744,roughness:.1,metalness:.9,envMapIntensity:.4}),d=new ne(n,u);d.rotation.x=-Math.PI/2,d.position.y=-5,m.add(d);const P=document.createElement("canvas");P.width=128,P.height=128;const z=P.getContext("2d"),l=z.createRadialGradient(64,64,0,64,64,64);l.addColorStop(0,"rgba(255, 255, 255, 1)"),l.addColorStop(1,"rgba(255, 255, 255, 0)"),z.fillStyle=l,z.fillRect(0,0,128,128);const r=new Ge(P);return k.forEach((o,j)=>{const h=new ye;h.position.copy(o.position),m.add(h);let I;if(o.color.clone(),o.nodeType==="blob"){const H=new Ie(1.5,4),Y=new de({vertexShader:$e,fragmentShader:Qe,uniforms:{uTime:{value:0},uScale:{value:1},uColor:{value:o.color},uEmissiveIntensity:{value:.3}}});I=new ne(H,Y),h.add(I)}else if(o.nodeType==="rings"){const H=new me(.8,16,16),Y=new ae({color:329744,metalness:1,roughness:.2});I=new ne(H,Y),h.add(I),[{r:1.4,tube:.05,rx:0,ry:0,rz:0,speed:1.2},{r:1.8,tube:.04,rx:1,ry:0,rz:0,speed:-.8},{r:1.3,tube:.04,rx:0,ry:1,rz:0,speed:1.5},{r:1.6,tube:.03,rx:.5,ry:.5,rz:0,speed:-1.1}].forEach(B=>{const V=new Fe(B.r,B.tube,8,48),re=new ae({color:o.color,emissive:o.color,emissiveIntensity:.8,wireframe:!0}),W=new ne(V,re);W.rotation.set(B.rx,B.ry,B.rz),W.userData.speed=B.speed,h.add(W)})}else if(o.nodeType==="fractal"){const H=rt(2),Y=new ae({color:o.color,emissive:o.color,emissiveIntensity:.4,wireframe:!1,side:xe});I=new ne(H,Y),h.add(I);const $=new Float32Array(80*3);for(let W=0;W<80;W++){const le=W/80*Math.PI*2,ve=2.5+Math.random()*.5;$[W*3]=Math.cos(le)*ve,$[W*3+1]=(Math.random()-.5)*.2,$[W*3+2]=Math.sin(le)*ve}const B=new ue;B.setAttribute("position",new fe($,3));const V=new Re({color:o.color,size:.06,transparent:!0,opacity:.7,blending:ie}),re=new Ee(B,V);h.add(re)}else if(o.nodeType==="voronoi"){const H=new me(1.5,64,64),Y=new de({vertexShader:`
            varying vec2 vUv; varying vec3 vNormal;
            void main() { vUv = uv; vNormal = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
          `,fragmentShader:Ze,uniforms:{uTime:{value:0},uColor:{value:o.color},uEmissiveIntensity:{value:.3}}});I=new ne(H,Y),h.add(I)}else if(o.nodeType==="shards"){const H=[new ze(.4,.4,.4),new je(.25,.6,6),new Ve(.15,.15,.6,8),new we(.3,.5,12),new Ue(.35)],Y=new ae({color:o.color,emissive:o.color,emissiveIntensity:.5});H.forEach(($,B)=>{const V=new ne($,Y.clone()),re=B/H.length*Math.PI*2,W=.8+B*.25;V.position.set(Math.cos(re)*W,(B-2)*.3,Math.sin(re)*W),V.userData.orbitRadius=W,V.userData.orbitSpeed=.4+B*.1,V.userData.orbitAngle=re,h.add(V)}),I=h.children[0]}const E=new Be({map:r,color:o.color,transparent:!0,opacity:.35,blending:ie,depthWrite:!1}),_=new qe(E);_.scale.set(6,6,1),h.add(_),h.userData.haloMat=E;const te=new ye;te.visible=!1,o.skills.forEach((H,Y)=>{const $=new S((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2).normalize(),B=5+Math.random()*3,V=new ne(new me(.12,8,8),new ae({color:o.color,emissive:o.color,emissiveIntensity:1}));V.position.copy($.multiplyScalar(B)),V.userData.skill=H,V.userData.dir=$.clone(),V.userData.radius=B,V.userData.homePos=V.position.clone(),V.userData.disciplineColor=o.color,V.userData.disciplineBaseFreq=o.baseFreq,V.userData.isSkillParticle=!0;const re=new we(.22,.28,32),W=new ke({color:13215820,transparent:!0,opacity:0,side:xe,depthWrite:!1}),le=new ne(re,W);le.userData.isGoldRing=!0,V.add(le),te.add(V)}),h.add(te),h.userData.childGroup=te,h.userData.isNode=!0,h.userData.disciplineIndex=j,h.userData.disc=o,h.userData.ignited=!1,h.userData.emissiveBase=1,U.current.push(h);const ce=new tt(h,o.position.clone());w.current.push(ce)}),k.forEach((o,j)=>{const h=(j+1)%k.length,I=[];for(let ce=0;ce<=32;ce++){const H=ce/32,Y=k[j].position.clone(),$=k[h].position.clone(),B=Y.clone().lerp($,.5);B.y+=2,I.push(new We(Y,B,$).getPoint(H))}const E=new ue().setFromPoints(I),_=new Te({color:13215820,transparent:!0,opacity:0,blending:ie,depthWrite:!1}),te=new be(E,_);m.add(te),D.current.push({line:te,mat:_})}),p.current=nt(m),L.position.set(0,2,12),L.lookAt(0,0,0),()=>{var o;(o=p.current)==null||o.dispose(),m.clear()}},[]),Oe((R,T)=>{var z;x.current+=T;const t=x.current,n=e.current??0;if(c.current.forEach(l=>{l.uniforms.uTime.value=t;const r=N.current?Math.min((t-(N.current||t))/2,1):0;l.uniforms.uPulseSync.value=r}),t-X.current>.2+Math.random()*.15){X.current=t;const l=(Math.random()-.5)*30,r=(Math.random()-.5)*30,o=l+(Math.random()-.5)*8,j=r+(Math.random()-.5)*8,h=[new S(l,30,r),new S(o,30,j)],I=new ue().setFromPoints(h),E=new Te({color:16777215,transparent:!0,opacity:1,blending:ie}),_=new be(I,E);m.add(_),i.current.push({arc:_,born:t})}i.current=i.current.filter(({arc:l,born:r})=>t-r>.12?(m.remove(l),l.geometry.dispose(),!1):!0);const u=k.map((l,r)=>{var o,j;return{pos:((o=U.current[r])==null?void 0:o.position)??k[r].position,strength:(j=b.current)!=null&&j.has(r)?.3:0}});U.current.forEach((l,r)=>{var I;if(!l)return;const o=k[r],j=o.position.y+Math.sin(t*.5+r*1.3)*.3;w.current[r].isDragging||(l.position.y=j);const h=Math.sin(t/8+r*1.2)*.3;if(!w.current[r].isDragging&&!F.current&&(l.position.x=o.position.x+h*.5),w.current[r].update(),o.nodeType==="rings"&&l.children.forEach(E=>{E.userData.speed&&(E.rotation.z+=T*E.userData.speed)}),o.nodeType==="fractal"&&(l.rotation.y+=T*.2,l.rotation.x+=T*.05),o.nodeType==="shards"&&l.children.forEach(E=>{if(E.userData.orbitSpeed!=null){E.userData.orbitAngle+=T*E.userData.orbitSpeed;const _=E.userData.orbitRadius;E.position.x=Math.cos(E.userData.orbitAngle)*_,E.position.z=Math.sin(E.userData.orbitAngle)*_,E.rotation.x+=T,E.rotation.y+=T*.7}}),l.children.forEach(E=>{var _,te;(te=(_=E.material)==null?void 0:_.uniforms)!=null&&te.uTime&&(E.material.uniforms.uTime.value=t)}),l.userData.haloMat){const E=(I=b.current)!=null&&I.has(r)?.28:.15;l.userData.haloMat.opacity=E+Math.sin(t*1.5+r)*.05}});const d=.2,P=[.2,.36,.52,.64,.76,.88];if(n<d)Z.current.set(0,5,25),K.current.set(0,0,0);else if(n<.88)for(let l=0;l<5;l++){const r=P[l],o=P[l+1];if(n>=r&&n<o){const j=(n-r)/(o-r),h=k[l];Z.current.copy(h.position).add(new S(-4,1.5,9)),K.current.copy(h.position),j>.15&&!((z=U.current[l])!=null&&z.userData.ignited)&&(U.current[l].userData.ignited=!0,A(l));break}}else Z.current.set(0,6,28),K.current.set(0,0,0);if(L.position.lerp(Z.current,T*1.5),ee.current.lerp(K.current,T*2),L.lookAt(ee.current),p.current){const l=p.current.update(T,u);C&&C(l)}}),s.useEffect(()=>{const R=G.domElement,T=u=>{const d=R.getBoundingClientRect();if(f.current.x=(u.clientX-d.left)/d.width*2-1,f.current.y=-((u.clientY-d.top)/d.height)*2+1,a.current&&F.current){w.current[a.current.index],y.current.setFromCamera(f.current,L);const P=new He(new S(0,0,1),-a.current.group.position.z),z=new S;y.current.ray.intersectPlane(P,z),z&&a.current.group.position.set(z.x,z.y,a.current.group.position.z)}},t=u=>{var l;if(!F.current)return;const d=R.getBoundingClientRect();f.current.x=(u.clientX-d.left)/d.width*2-1,f.current.y=-((u.clientY-d.top)/d.height)*2+1,y.current.setFromCamera(f.current,L);const P=U.current.map(r=>r).filter(Boolean),z=y.current.intersectObjects(P,!0);if(z.length>0){let r=z[0].object;for(;r.parent&&!r.userData.isNode;)r=r.parent;if(r.userData.isNode){const o=r.userData.disciplineIndex;w.current[o].isDragging=!0,a.current={group:r,index:o};const j=(l=q.current)==null?void 0:l.dragNode(k[o].baseFreq,0);r.userData.dragTone=j}}},n=()=>{var u;if(a.current){const d=a.current.index;w.current[d].isDragging=!1,(u=q.current)==null||u.releaseNode(a.current.group.userData.dragTone),a.current=null}};return R.addEventListener("pointermove",T),R.addEventListener("pointerdown",t),R.addEventListener("pointerup",n),()=>{R.removeEventListener("pointermove",T),R.removeEventListener("pointerdown",t),R.removeEventListener("pointerup",n)}},[G,L,F]),s.useEffect(()=>{const R=T=>{const t=T.detail.index,n=U.current[t];if(!n)return;J.to(n.scale,{x:3,y:3,z:3,duration:.3,ease:"cubic-bezier(0.34,1.56,0.64,1)",onComplete:()=>{J.to(n.scale,{x:1.4,y:1.4,z:1.4,duration:.4})}});const u=n.userData.childGroup;u.visible=!0,u.children.forEach((d,P)=>{const z=d.userData.homePos.clone();d.position.set(0,0,0),J.to(d.position,{x:z.x,y:z.y,z:z.z,delay:P*.01,duration:.6,ease:"power2.out"}),d.userData.labelVisible=!0}),c.current[0]&&J.to(c.current[0].uniforms.uPulseSync,{value:.5,duration:.4,yoyo:!0,repeat:1})};return window.addEventListener("forge:ignite",R),()=>window.removeEventListener("forge:ignite",R)},[]),s.useEffect(()=>{const R=T=>{const t=T.detail.index,n=U.current[t];if(!n)return;const u=n.userData.childGroup;u.children.forEach((d,P)=>{J.to(d.position,{x:0,y:0,z:0,delay:P*.008,duration:.5,ease:"power2.in",onComplete:()=>{P===u.children.length-1&&(u.visible=!1)}})}),J.to(n.scale,{x:1,y:1,z:1,duration:.6,ease:"back.out(1.7)"}),Q.current.emissive[t]=1.8,n.userData.haloMat&&(n.userData.haloMat.opacity=.25),D.current[t]&&J.to(D.current[t].mat,{opacity:.5,duration:.8})};return window.addEventListener("forge:retract",R),()=>window.removeEventListener("forge:retract",R)},[]),s.useEffect(()=>{const R=()=>{const t=new S(0,0,0);U.current.forEach((n,u)=>{if(!n)return;const d=new S(Math.cos(u/5*Math.PI*2)*4.5,0,Math.sin(u/5*Math.PI*2)*4.5);J.to(n.position,{x:t.x+d.x,y:t.y+d.y,z:t.z+d.z,duration:2.5,ease:"power2.inOut"}),w.current[u].home.copy(t).add(d)}),D.current.forEach(({mat:n})=>{J.to(n,{opacity:.8,duration:1})})},T=()=>{U.current.forEach((t,n)=>{t&&J.to(t.position,{y:40,duration:.8+n*.1,ease:"power2.in",delay:n*.1})}),p.current,c.current.forEach(t=>{J.to(t.uniforms.uPulseSync,{value:0,duration:1.2})})};return window.addEventListener("forge:convergence",R),window.addEventListener("forge:exit",T),()=>{window.removeEventListener("forge:convergence",R),window.removeEventListener("forge:exit",T)}},[]),null}function at(){const e=s.useRef(null),v=s.useRef(0),C=s.useRef(-1),b=s.useRef(new Set),N=s.useRef(null),F=s.useRef(!1),A=s.useRef(Je()),[O,q]=s.useState(0),[m,L]=s.useState(null),[G,U]=s.useState(null),[g,c]=s.useState({x:0,y:0}),[i,p]=s.useState(new Set),[D,w]=s.useState({line1:!1,line2:!1}),[a,y]=s.useState(!1),[f,x]=s.useState(!1),X=s.useRef(null);s.useRef(new Ae),s.useRef(new pe);const Q=ge(t=>t.realm),Z=ge(t=>t.soundEnabled);s.useEffect(()=>{var t,n;if(Q!==2||!Z)(t=A.current)!=null&&t.stopAll&&A.current.stopAll();else if((n=A.current)!=null&&n.startAmbience)try{A.current.startAmbience()}catch{}},[Q,Z]),s.useEffect(()=>{const t=J.context(()=>{Se.create({trigger:e.current,start:"top top",end:"+=6000",pin:!0,scrub:1,anticipatePin:1,onUpdate:n=>{var l;const u=n.progress;v.current=u,u<.2?(x(!0),L(null)):x(!1);const d=[.2,.36,.52,.64,.76,.88];let P=-1;for(let r=0;r<5;r++)if(u>=d[r]&&u<d[r+1]){P=r;break}P!==C.current&&(C.current>=0&&window.dispatchEvent(new CustomEvent("forge:retract",{detail:{index:C.current}})),C.current=P,P>=0?L(k[P]):L(null));const z=b.current.size>=5;u>=.88&&!N.current&&z&&(N.current=performance.now(),L(null),C.current=-1,window.dispatchEvent(new CustomEvent("forge:convergence")),(l=A.current)==null||l.triggerConvergence(),setTimeout(()=>w(r=>({...r,line1:!0})),2500),setTimeout(()=>w(r=>({...r,line2:!0})),4500)),u>=.92&&z&&!F.current&&(F.current=!0,y(!0)),u>=.98&&window.dispatchEvent(new CustomEvent("forge:exit"))}})},e);return()=>t.revert()},[]);const K=s.useCallback(t=>{var n,u;if(!b.current.has(t)){b.current.add(t),p(new Set(b.current)),window.dispatchEvent(new CustomEvent("forge:ignite",{detail:{index:t}})),(n=A.current)==null||n.igniteNode(k[t].baseFreq);try{(u=A.current)==null||u.startAmbience()}catch{}}},[]),ee=s.useCallback(t=>{c({x:t.clientX,y:t.clientY})},[]);return M.jsxs("div",{className:"forge-container",ref:e,children:[M.jsx(De,{ref:X,onMouseMove:ee,style:{position:"absolute",inset:0},gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},dpr:Math.min(window.devicePixelRatio,2),children:M.jsx(ot,{scrollProgress:v,activeNode:C,onParticleCount:q,visitedNodes:b,convergenceActive:N,freeForgActive:F,onNodeActivate:K,dragEnabled:F,audioRef:A})}),M.jsxs("div",{className:"forge-realm-label",children:[M.jsx("span",{className:"forge-realm-num",children:"II. THE FORGE"}),m&&M.jsxs("span",{className:"forge-active-disc",children:["[ ",m.name," ] — ACTIVE"]})]}),M.jsx("div",{className:"forge-progress-dots",children:k.map((t,n)=>M.jsx("div",{className:`forge-dot ${i.has(n)?"visited":""} ${(m==null?void 0:m.id)===t.id?"active":""}`,title:t.name},t.id))}),f&&M.jsx("div",{className:"forge-approach-prompt",children:"APPROACH A DISCIPLINE."}),m&&M.jsxs("div",{className:"forge-discipline-overlay",children:[M.jsx("h2",{className:"forge-disc-title",children:m.name.split("").map((t,n)=>M.jsx("span",{className:"forge-letter",style:{animationDelay:`${n*.06}s`},children:t===" "?" ":t},n))}),M.jsx("p",{className:"forge-disc-desc",children:m.description}),M.jsx("p",{className:"forge-disc-depth",children:m.depth})]}),D.line1&&M.jsxs("div",{className:"forge-convergence-text",children:[M.jsx("div",{className:`forge-conv-line ${D.line1?"reveal":""}`,children:"YOUR DISCIPLINES DON'T COMPETE.".split("").map((t,n)=>M.jsx("span",{className:"forge-conv-letter",style:{animationDelay:`${n*.04}s`},children:t===" "?" ":t},n))}),D.line2&&M.jsx("div",{className:"forge-conv-line reveal",style:{animationDelay:"0.3s"},children:"THEY CONSPIRE.".split("").map((t,n)=>M.jsx("span",{className:"forge-conv-letter",style:{animationDelay:`${n*.06+.3}s`},children:t===" "?" ":t},n))})]}),a&&M.jsx("div",{className:"forge-freeforge-prompt",children:"DRAG ANYTHING. SEE WHAT HOLDS."}),G&&M.jsx(et,{skill:G,x:g.x,y:g.y,visible:!!G})]})}export{at as default};
