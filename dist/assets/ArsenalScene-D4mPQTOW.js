import{r as c,R as xe,V as ue,g as J,S as be,b as C,c as ne,j as E,C as Ae,d as Ee,F as Re,A as Se,P as De,e as pe,f as ce,h as ae,i as Me,M as K,k as oe,l as Ce,G as ve,I as Pe,m as le,T as Ne,D as fe,B as ie,n as de,o as we,p as Te,q as Le,s as Ge,t as Ie,v as ge,O as Fe,w as ze,x as je,y as Ve,Q as Ue,L as he,z as ye,a as Be,E as qe,H as ke}from"./index-C6A6qjDW.js";const Oe=`varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,We=`// containmentField.frag.glsl — Forge chamber boundary walls
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
`,_e=`// forgeBlob.vert.glsl — Morphing organic blob for Design node
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
`,He=`// forgeBlobFrag.glsl — Lit material for morphing blob
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
`,Xe=`// voronoiSphere.frag.glsl — Strategy node surface (Voronoi cells)
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
`,O=[{id:"design",name:"DESIGN",description:"Building interfaces where every pixel has a reason to exist.",depth:"5 years crafting visual systems",color:new ne(8073150),baseFreq:196,position:new C(-4,-.5,0),nodeType:"blob",skills:[{name:"UI/UX Design",desc:"Designing experiences that feel inevitable",level:"FLUENT",related:["Design Systems","Motion Design"]},{name:"Design Systems",desc:"Building languages the whole team can speak",level:"MASTER",related:["UI/UX Design","Typography"]},{name:"Typography",desc:"Treating type as a first-class design material",level:"FLUENT",related:["Design Systems","Brand Identity"]},{name:"Motion Design",desc:"Making transitions that teach the interface",level:"CAPABLE",related:["UI/UX Design","Design Systems"]},{name:"Brand Identity",desc:"Giving products a voice they carry everywhere",level:"CAPABLE",related:["Typography","UI/UX Design"]}]},{id:"engineering",name:"ENGINEERING",description:"Writing code that performs, scales, and ages well.",depth:"6 years building production systems",color:new ne(62975),baseFreq:220,position:new C(4,1,0),nodeType:"rings",skills:[{name:"React",desc:"Components as the atomic unit of thought",level:"MASTER",related:["TypeScript","Performance"]},{name:"Three.js",desc:"Turning math into light people can touch",level:"FLUENT",related:["WebGL/GLSL","React"]},{name:"WebGL/GLSL",desc:"Writing directly to the GPU in its own language",level:"FLUENT",related:["Three.js","Creative Tech"]},{name:"Node.js",desc:"APIs that communicate what they mean",level:"FLUENT",related:["REST APIs","TypeScript"]},{name:"TypeScript",desc:"Types as documentation that never goes stale",level:"MASTER",related:["React","Node.js"]},{name:"REST APIs",desc:"Contracts between systems that hold under pressure",level:"FLUENT",related:["Node.js","Performance"]},{name:"Performance",desc:"The 60fps imperative — no frame goes wasted",level:"CAPABLE",related:["React","WebGL/GLSL"]}]},{id:"creative",name:"CREATIVE TECH",description:"Making code behave like art and art behave like code.",depth:"4 years in generative territory",color:new ne(13215820),baseFreq:246.94,position:new C(0,1.5,-3),nodeType:"fractal",skills:[{name:"Generative Art",desc:"Algorithms that make decisions I would not",level:"FLUENT",related:["WebGL/GLSL","Creative Coding"]},{name:"WebGL Shaders",desc:"Painting with math on silicon canvases",level:"FLUENT",related:["Generative Art","Real-time 3D"]},{name:"Creative Coding",desc:"Tools as medium; output as artifact",level:"MASTER",related:["Generative Art","Interactive Installs"]},{name:"Real-time 3D",desc:"Worlds that exist only while you watch",level:"FLUENT",related:["WebGL Shaders","Three.js"]},{name:"Interactive Installs",desc:"Spaces that respond to presence",level:"CAPABLE",related:["Creative Coding","Real-time 3D"]}]},{id:"strategy",name:"STRATEGY",description:"Connecting what users need to what products can become.",depth:"4 years thinking in systems",color:new ne(15789544),baseFreq:261.63,position:new C(-3,0,-2),nodeType:"voronoi",skills:[{name:"Product Thinking",desc:"Asking what the problem is before solving it",level:"FLUENT",related:["User Research","Prototyping"]},{name:"User Research",desc:"Listening for the need behind the request",level:"CAPABLE",related:["Product Thinking","Workshop Lead"]},{name:"Prototyping",desc:"Making assumptions tangible before they cost you",level:"FLUENT",related:["Product Thinking","Creative Direction"]},{name:"Creative Direction",desc:"Holding the vision while others build",level:"CAPABLE",related:["Prototyping","Product Thinking"]},{name:"Workshop Lead",desc:"Designing sessions where alignment actually happens",level:"CAPABLE",related:["User Research","Creative Direction"]}]},{id:"craft",name:"CRAFT",description:"The instruments — chosen with care, wielded with precision.",depth:"Sharp tools, daily practice",color:new ne(13150590),baseFreq:293.66,position:new C(3,-.5,-2),nodeType:"shards",skills:[{name:"Figma",desc:"Where ideas become decisions become handoffs",level:"MASTER",related:["Design Systems","Prototyping"]},{name:"Blender",desc:"Sculpting forms that live in 3D space",level:"CAPABLE",related:["Three.js","Real-time 3D"]},{name:"GSAP",desc:"Animation that means something, every frame",level:"MASTER",related:["Motion Design","React"]},{name:"Git",desc:"History as a first draft, not an archive",level:"FLUENT",related:["Node.js","TypeScript"]},{name:"Photoshop",desc:"Pixel-level decisions when they matter",level:"FLUENT",related:["Brand Identity","UI/UX Design"]},{name:"Premiere",desc:"Story told through the cut",level:"CAPABLE",related:["Motion Design","Creative Direction"]}]}];function Ye(){let e=null,g=null,w=null,T=null;function L(){e||(e=new(window.AudioContext||window.webkitAudioContext),g=e.createGain(),g.gain.value=0,g.connect(e.destination))}function F(){if(L(),w)return;w=e.createOscillator(),w.type="sine",w.frequency.value=40;const d=e.createGain();d.gain.value=.03,w.connect(d),T=e.createOscillator(),T.frequency.value=.5;const o=e.createGain();o.gain.value=.08,T.connect(o),o.connect(d.gain),d.connect(g),w.start(),T.start(),g.gain.linearRampToValueAtTime(1,e.currentTime+2)}function G(){if(!e)return;const d=e.createBuffer(1,e.sampleRate*.08,e.sampleRate),o=d.getChannelData(0);for(let m=0;m<o.length;m++)o[m]=Math.random()*2-1;const l=e.createBufferSource();l.buffer=d;const x=e.createBiquadFilter();x.type="bandpass",x.frequency.value=4e3,x.Q.value=2;const t=e.createGain();t.gain.value=.08;const i=e.createStereoPanner();i.pan.value=Math.random()-.5,l.connect(x).connect(t).connect(i).connect(g),l.start()}function W(d){if(!e)return;const o=e.createOscillator();o.type="sine",o.frequency.value=80;const l=e.createGain();l.gain.setValueAtTime(.25,e.currentTime),l.gain.exponentialRampToValueAtTime(.001,e.currentTime+.2),o.connect(l).connect(g),o.start(),o.stop(e.currentTime+.22),[1,1.5,2,3,4].forEach(R=>{const U=e.createOscillator();U.type="sine",U.frequency.value=d*R;const k=e.createGain();k.gain.setValueAtTime(0,e.currentTime+.02),k.gain.linearRampToValueAtTime(.06,e.currentTime+.04),k.gain.setValueAtTime(.06,e.currentTime+.64),k.gain.exponentialRampToValueAtTime(.001,e.currentTime+1.04),U.connect(k).connect(g),U.start(),U.stop(e.currentTime+1.1)});const t=e.createOscillator();t.type="triangle",t.frequency.value=2e3;const i=e.createGain();i.gain.setValueAtTime(.12,e.currentTime),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+.3);const m=e.createBiquadFilter();m.type="bandpass",m.frequency.value=2250,m.Q.value=2,t.connect(m).connect(i).connect(g),t.start(),t.stop(e.currentTime+.35)}function q(d){if(!e)return;const o=e.createOscillator();o.type="sine",o.frequency.value=880*(1+(d/300-.6)*.2);const l=e.createGain();l.gain.setValueAtTime(.025,e.currentTime),l.gain.exponentialRampToValueAtTime(.001,e.currentTime+.04),o.connect(l).connect(g),o.start(),o.stop(e.currentTime+.05)}function h(){if(!e)return;const d=e.createBuffer(1,Math.floor(e.sampleRate*.06),e.sampleRate),o=d.getChannelData(0);for(let i=0;i<o.length;i++)o[i]=Math.random()*2-1;const l=e.createBufferSource();l.buffer=d;const x=e.createBiquadFilter();x.type="bandpass",x.frequency.value=3e3,x.Q.value=4;const t=e.createGain();t.gain.value=.12,l.connect(x).connect(t).connect(g),l.start()}function A(){if(!e)return;O.forEach((l,x)=>{const t=e.createOscillator();t.type="sine",t.frequency.value=l.baseFreq;const i=e.createGain();i.gain.setValueAtTime(0,e.currentTime),i.gain.linearRampToValueAtTime(.04,e.currentTime+1.5),i.gain.setValueAtTime(.04,e.currentTime+1.5),i.gain.exponentialRampToValueAtTime(.001,e.currentTime+4),t.connect(i).connect(g),t.start(),t.stop(e.currentTime+4.1)});const d=e.createOscillator();d.type="triangle",d.frequency.value=2093;const o=e.createGain();o.gain.setValueAtTime(0,e.currentTime+1.5),o.gain.linearRampToValueAtTime(.03,e.currentTime+2.5),o.gain.exponentialRampToValueAtTime(.001,e.currentTime+4.5),d.connect(o).connect(g),d.start(),d.stop(e.currentTime+4.6)}function I(d,o){if(!e)return null;const l=e.createOscillator();l.type="sine",l.frequency.value=d+o*8;const x=e.createGain();return x.gain.setValueAtTime(0,e.currentTime),x.gain.linearRampToValueAtTime(.06,e.currentTime+.05),l.connect(x).connect(g),l.start(),{osc:l,gain:x}}function j(d){if(!d||!e)return;d.gain.gain.setTargetAtTime(0,e.currentTime,.05),d.osc.stop(e.currentTime+.25);const o=e.createOscillator();o.frequency.value=80;const l=e.createGain();l.gain.setValueAtTime(.1,e.currentTime),l.gain.exponentialRampToValueAtTime(.001,e.currentTime+.1),o.connect(l).connect(g),o.start(),o.stop(e.currentTime+.12)}function H(d,o){e&&setTimeout(()=>{const l=e.createOscillator();l.type="sine",l.frequency.setValueAtTime(d.baseFreq,e.currentTime),l.frequency.linearRampToValueAtTime(d.baseFreq*1.1,e.currentTime+.4);const x=e.createGain();x.gain.setValueAtTime(.05,e.currentTime),x.gain.exponentialRampToValueAtTime(.001,e.currentTime+.4),l.connect(x).connect(g),l.start(),l.stop(e.currentTime+.45)},o)}function X(){e&&g.gain.linearRampToValueAtTime(0,e.currentTime+1.2)}return{startAmbience:F,electricArc:G,igniteNode:W,skillHover:q,skillClick:h,triggerConvergence:A,dragNode:I,releaseNode:j,exitNode:H,stopAll:X}}function $e({level:e}){const g=c.useRef(null),w=c.useRef(null),T=c.useRef(0),L=c.useMemo(()=>{switch(e){case"MASTER":return{amp:18,noise:.05,speed:1.5};case"FLUENT":return{amp:12,noise:.2,speed:1.2};case"CAPABLE":return{amp:7,noise:.5,speed:.9};case"LEARNING":return{amp:3,noise:1,speed:.7};default:return{amp:10,noise:.3,speed:1}}},[e]);return c.useEffect(()=>{const F=g.current;if(!F)return;const G=F.getContext("2d"),W=F.width,q=F.height,h=()=>{T.current+=.02,G.clearRect(0,0,W,q),G.beginPath(),G.strokeStyle="#C9A84C",G.lineWidth=1.5;for(let A=0;A<W;A++){const I=A/W,j=(Math.random()-.5)*L.noise*L.amp,H=q/2+Math.sin(I*Math.PI*4+T.current*L.speed)*L.amp+j;A===0?G.moveTo(A,H):G.lineTo(A,H)}G.stroke(),w.current=requestAnimationFrame(h)};return h(),()=>cancelAnimationFrame(w.current)},[L]),E.jsx("canvas",{ref:g,width:120,height:24,style:{display:"block"}})}function Qe({skill:e,x:g,y:w,visible:T}){return E.jsxs("div",{className:`forge-skill-tooltip ${T?"visible":""}`,style:{left:g+16,top:w-20},children:[E.jsxs("div",{className:"forge-tooltip-header",children:["◈ ",e==null?void 0:e.name]}),E.jsx("div",{className:"forge-tooltip-divider"}),E.jsx("div",{className:"forge-tooltip-desc",children:e==null?void 0:e.desc}),E.jsxs("div",{className:"forge-tooltip-wave",children:[E.jsx($e,{level:e==null?void 0:e.level}),E.jsx("span",{className:"forge-tooltip-level",children:e==null?void 0:e.level})]})]})}class Ze{constructor(g,w){this.mesh=g,this.home=w.clone(),this.velocity=new C,this.stiffness=.08,this.damping=.75,this.isDragging=!1}update(){if(this.isDragging)return;const g=new C().subVectors(this.home,this.mesh.position);this.velocity.add(g.multiplyScalar(this.stiffness)),this.velocity.multiplyScalar(this.damping),this.mesh.position.add(this.velocity)}}const re=3e3;function Je(e){const g=new Float32Array(re*3),w=new Float32Array(re*3),T=new Float32Array(re*3);for(let t=0;t<re;t++)g[t*3]=(Math.random()-.5)*40,g[t*3+1]=(Math.random()-.5)*20,g[t*3+2]=(Math.random()-.5)*40;const L=new ie;L.setAttribute("position",new de(g,3)),L.setAttribute("color",new de(T,3));const F=new we({size:.06,vertexColors:!0,transparent:!0,opacity:.8,blending:ae,depthWrite:!1}),G=new Te(L,F);e.add(G);const W=new ne(62975),q=new ne(13215820),h=new ne;function A(t){let i=Math.sin(t*127.1)*43758.5453123;return i-Math.floor(i)}function I(t,i,m){return(A(t*1.1+i*31.4+m*7.3)-.5)*2}function j(t,i,m,R){return(I(t,i+R,m)-I(t,i-R,m)-I(t,i,m+R)+I(t,i,m-R))/(2*R)}function H(t,i,m,R){return(I(t,i,m+R)-I(t,i,m-R)-I(t+R,i,m)+I(t-R,i,m))/(2*R)}function X(t,i,m,R){return(I(t+R,i,m)-I(t-R,i,m)-I(t,i+R,m)+I(t,i-R,m))/(2*R)}let d=0;const o=Array(5).fill(null).map(()=>({pos:new C,strength:0}));function l(t,i){d+=t,i.forEach((U,k)=>{o[k].pos.copy(U.pos),o[k].strength=U.strength});const m=L.attributes.position.array,R=L.attributes.color.array;for(let U=0;U<re;U++){const k=U*3,S=U*3+1,D=U*3+2;let v=m[k],f=m[S],n=m[D];const a=.1,y=.3+d*.08;let P=j(v*y,f*y,n*y,a)*.02,s=H(v*y,f*y,n*y,a)*.02,u=X(v*y,f*y,n*y,a)*.02;for(let p=0;p<5;p++){const N=o[p].pos.x-v,b=o[p].pos.y-f,B=o[p].pos.z-n,Y=Math.sqrt(N*N+b*b+B*B);if(Y<8&&o[p].strength>0){const ee=(1-Y/8)*.08*o[p].strength/Math.max(Y,.1);P+=N*ee,s+=b*ee,u+=B*ee}}w[k]=P,w[S]=s,w[D]=u,v+=P,f+=s,n+=u,m[k]=(v+20)%40-20,m[S]=(f+10)%20-10,m[D]=(n+20)%40-20;const r=Math.sqrt(P*P+s*s+u*u),M=Math.min(r/.05,1);h.lerpColors(q,W,M),R[k]=h.r,R[S]=h.g,R[D]=h.b}return L.attributes.position.needsUpdate=!0,L.attributes.color.needsUpdate=!0,re}function x(){e.remove(G),L.dispose(),F.dispose()}return{points:G,update:l,dispose:x,count:re}}function Ke(e=2){const g=[];function w(F,G,W,q,h){if(h===0){const o=[F,G,W,q];[[0,1,2],[0,1,3],[0,2,3],[1,2,3]].forEach(x=>x.forEach(t=>{const i=o[t];g.push(i.x,i.y,i.z)}));return}const A=new C().addVectors(F,G).multiplyScalar(.5),I=new C().addVectors(F,W).multiplyScalar(.5),j=new C().addVectors(F,q).multiplyScalar(.5),H=new C().addVectors(G,W).multiplyScalar(.5),X=new C().addVectors(G,q).multiplyScalar(.5),d=new C().addVectors(W,q).multiplyScalar(.5);w(F,A,I,j,h-1),w(G,A,H,X,h-1),w(W,I,H,d,h-1),w(q,j,X,d,h-1)}const T=1.5;w(new C(T,T,T),new C(-T,-T,T),new C(-T,T,-T),new C(T,-T,-T),e);const L=new ie;return L.setAttribute("position",new qe(g,3)),L.computeVertexNormals(),L}function et({scrollProgress:e,activeNode:g,onParticleCount:w,visitedNodes:T,convergenceActive:L,freeForgActive:F,onNodeActivate:G,dragEnabled:W,audioRef:q}){const{scene:h,camera:A,gl:I}=Ee(),j=c.useRef([]),H=c.useRef([]),X=c.useRef([]);c.useRef([]);const d=c.useRef([]),o=c.useRef(null),l=c.useRef([]),x=c.useRef([]),t=c.useRef(null),i=c.useRef(new xe),m=c.useRef(new ue),R=c.useRef(0),U=c.useRef(0);c.useRef(O.map(S=>S.position.clone())),c.useRef(O.map(()=>1));const k=c.useRef({emissive:O.map(()=>1)});return c.useEffect(()=>{h.background=new ne(329744),h.fog=new Re(329744,.02);const S=new Se(1118498,.3);h.add(S);const D=new De(62975,.5,30);D.position.set(0,8,0),h.add(D),[{pos:[0,0,-30],rot:[0,0,0],color:[0,.96,1]},{pos:[0,0,30],rot:[0,Math.PI,0],color:[.63,.41,.97]},{pos:[-30,0,0],rot:[0,Math.PI/2,0],color:[.79,.66,.3]},{pos:[30,0,0],rot:[0,-Math.PI/2,0],color:[.94,.93,.91]}].forEach(r=>{const M=new pe(40,40,1,1),p=new ce({vertexShader:Oe,fragmentShader:We,uniforms:{uTime:{value:0},uColor:{value:new C(...r.color)},uRippleOrigin:{value:new ue(.5,.5)},uRippleTime:{value:-99},uPulseSync:{value:0}},transparent:!0,side:Me,depthWrite:!1,blending:ae}),N=new K(M,p);N.position.set(...r.pos),N.rotation.set(...r.rot),h.add(N),H.current.push(N),X.current.push(p)});const f=new pe(80,80),n=new oe({color:329744,roughness:.1,metalness:.9,envMapIntensity:.4}),a=new K(f,n);a.rotation.x=-Math.PI/2,a.position.y=-5,h.add(a);const y=document.createElement("canvas");y.width=128,y.height=128;const P=y.getContext("2d"),s=P.createRadialGradient(64,64,0,64,64,64);s.addColorStop(0,"rgba(255, 255, 255, 1)"),s.addColorStop(1,"rgba(255, 255, 255, 0)"),P.fillStyle=s,P.fillRect(0,0,128,128);const u=new Ce(y);return O.forEach((r,M)=>{const p=new ve;p.position.copy(r.position),h.add(p);let N;if(r.color.clone(),r.nodeType==="blob"){const $=new Pe(1.5,4),Q=new ce({vertexShader:_e,fragmentShader:He,uniforms:{uTime:{value:0},uScale:{value:1},uColor:{value:r.color},uEmissiveIntensity:{value:.3}}});N=new K($,Q),p.add(N)}else if(r.nodeType==="rings"){const $=new le(.8,16,16),Q=new oe({color:329744,metalness:1,roughness:.2});N=new K($,Q),p.add(N),[{r:1.4,tube:.05,rx:0,ry:0,rz:0,speed:1.2},{r:1.8,tube:.04,rx:1,ry:0,rz:0,speed:-.8},{r:1.3,tube:.04,rx:0,ry:1,rz:0,speed:1.5},{r:1.6,tube:.03,rx:.5,ry:.5,rz:0,speed:-1.1}].forEach(V=>{const z=new Ne(V.r,V.tube,8,48),te=new oe({color:r.color,emissive:r.color,emissiveIntensity:.8,wireframe:!0}),_=new K(z,te);_.rotation.set(V.rx,V.ry,V.rz),_.userData.speed=V.speed,p.add(_)})}else if(r.nodeType==="fractal"){const $=Ke(2),Q=new oe({color:r.color,emissive:r.color,emissiveIntensity:.4,wireframe:!1,side:fe});N=new K($,Q),p.add(N);const Z=new Float32Array(80*3);for(let _=0;_<80;_++){const se=_/80*Math.PI*2,me=2.5+Math.random()*.5;Z[_*3]=Math.cos(se)*me,Z[_*3+1]=(Math.random()-.5)*.2,Z[_*3+2]=Math.sin(se)*me}const V=new ie;V.setAttribute("position",new de(Z,3));const z=new we({color:r.color,size:.06,transparent:!0,opacity:.7,blending:ae}),te=new Te(V,z);p.add(te)}else if(r.nodeType==="voronoi"){const $=new le(1.5,64,64),Q=new ce({vertexShader:`
            varying vec2 vUv; varying vec3 vNormal;
            void main() { vUv = uv; vNormal = normalize(normalMatrix*normal); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
          `,fragmentShader:Xe,uniforms:{uTime:{value:0},uColor:{value:r.color},uEmissiveIntensity:{value:.3}}});N=new K($,Q),p.add(N)}else if(r.nodeType==="shards"){const $=[new Le(.4,.4,.4),new Ge(.25,.6,6),new Ie(.15,.15,.6,8),new ge(.3,.5,12),new Fe(.35)],Q=new oe({color:r.color,emissive:r.color,emissiveIntensity:.5});$.forEach((Z,V)=>{const z=new K(Z,Q.clone()),te=V/$.length*Math.PI*2,_=.8+V*.25;z.position.set(Math.cos(te)*_,(V-2)*.3,Math.sin(te)*_),z.userData.orbitRadius=_,z.userData.orbitSpeed=.4+V*.1,z.userData.orbitAngle=te,p.add(z)}),N=p.children[0]}const b=new ze({map:u,color:r.color,transparent:!0,opacity:.35,blending:ae,depthWrite:!1}),B=new je(b);B.scale.set(6,6,1),p.add(B),p.userData.haloMat=b;const Y=new ve;Y.visible=!1,r.skills.forEach(($,Q)=>{const Z=new C((Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2).normalize(),V=5+Math.random()*3,z=new K(new le(.12,8,8),new oe({color:r.color,emissive:r.color,emissiveIntensity:1}));z.position.copy(Z.multiplyScalar(V)),z.userData.skill=$,z.userData.dir=Z.clone(),z.userData.radius=V,z.userData.homePos=z.position.clone(),z.userData.disciplineColor=r.color,z.userData.disciplineBaseFreq=r.baseFreq,z.userData.isSkillParticle=!0;const te=new ge(.22,.28,32),_=new Ve({color:13215820,transparent:!0,opacity:0,side:fe,depthWrite:!1}),se=new K(te,_);se.userData.isGoldRing=!0,z.add(se),Y.add(z)}),p.add(Y),p.userData.childGroup=Y,p.userData.isNode=!0,p.userData.disciplineIndex=M,p.userData.disc=r,p.userData.ignited=!1,p.userData.emissiveBase=1,j.current.push(p);const ee=new Ze(p,r.position.clone());x.current.push(ee)}),O.forEach((r,M)=>{const p=(M+1)%O.length,N=[];for(let ee=0;ee<=32;ee++){const $=ee/32,Q=O[M].position.clone(),Z=O[p].position.clone(),V=Q.clone().lerp(Z,.5);V.y+=2,N.push(new Ue(Q,V,Z).getPoint($))}const b=new ie().setFromPoints(N),B=new he({color:13215820,transparent:!0,opacity:0,blending:ae,depthWrite:!1}),Y=new ye(b,B);h.add(Y),l.current.push({line:Y,mat:B})}),o.current=Je(h),A.position.set(0,2,12),A.lookAt(0,0,0),()=>{var r;(r=o.current)==null||r.dispose(),h.clear()}},[]),Be((S,D)=>{var P;R.current+=D;const v=R.current,f=e.current??0;if(X.current.forEach(s=>{s.uniforms.uTime.value=v;const u=L.current?Math.min((v-(L.current||v))/2,1):0;s.uniforms.uPulseSync.value=u}),v-U.current>.2+Math.random()*.15){U.current=v;const s=(Math.random()-.5)*30,u=(Math.random()-.5)*30,r=s+(Math.random()-.5)*8,M=u+(Math.random()-.5)*8,p=[new C(s,30,u),new C(r,30,M)],N=new ie().setFromPoints(p),b=new he({color:16777215,transparent:!0,opacity:1,blending:ae}),B=new ye(N,b);h.add(B),d.current.push({arc:B,born:v})}d.current=d.current.filter(({arc:s,born:u})=>v-u>.12?(h.remove(s),s.geometry.dispose(),!1):!0);const n=O.map((s,u)=>{var r,M;return{pos:((r=j.current[u])==null?void 0:r.position)??O[u].position,strength:(M=T.current)!=null&&M.has(u)?.3:0}});j.current.forEach((s,u)=>{var N;if(!s)return;const r=O[u],M=r.position.y+Math.sin(v*.5+u*1.3)*.3;x.current[u].isDragging||(s.position.y=M);const p=Math.sin(v/8+u*1.2)*.3;if(!x.current[u].isDragging&&!F.current&&(s.position.x=r.position.x+p*.5),x.current[u].update(),r.nodeType==="rings"&&s.children.forEach(b=>{b.userData.speed&&(b.rotation.z+=D*b.userData.speed)}),r.nodeType==="fractal"&&(s.rotation.y+=D*.2,s.rotation.x+=D*.05),r.nodeType==="shards"&&s.children.forEach(b=>{if(b.userData.orbitSpeed!=null){b.userData.orbitAngle+=D*b.userData.orbitSpeed;const B=b.userData.orbitRadius;b.position.x=Math.cos(b.userData.orbitAngle)*B,b.position.z=Math.sin(b.userData.orbitAngle)*B,b.rotation.x+=D,b.rotation.y+=D*.7}}),s.children.forEach(b=>{var B,Y;(Y=(B=b.material)==null?void 0:B.uniforms)!=null&&Y.uTime&&(b.material.uniforms.uTime.value=v)}),s.userData.haloMat){const b=(N=T.current)!=null&&N.has(u)?.28:.15;s.userData.haloMat.opacity=b+Math.sin(v*1.5+u)*.05}});const a=.2,y=[.2,.36,.52,.64,.76,.88];if(f<a)A.position.lerp(new C(0,3,18),.03),A.lookAt(0,0,0);else if(f<.88)for(let s=0;s<5;s++){const u=y[s],r=y[s+1];if(f>=u&&f<r){const M=(f-u)/(r-u),p=O[s],N=p.position.clone().add(new C(-3,1,6));A.position.lerp(N,.025);const b=p.position.clone();A.lookAt(b),M>.4&&!((P=j.current[s])!=null&&P.userData.ignited)&&(j.current[s].userData.ignited=!0,G(s));break}}else A.position.lerp(new C(0,4,20),.02),A.lookAt(0,0,0);if(o.current){const s=o.current.update(D,n);w&&w(s)}}),c.useEffect(()=>{const S=I.domElement,D=n=>{const a=S.getBoundingClientRect();if(m.current.x=(n.clientX-a.left)/a.width*2-1,m.current.y=-((n.clientY-a.top)/a.height)*2+1,t.current&&F.current){x.current[t.current.index],i.current.setFromCamera(m.current,A);const y=new ke(new C(0,0,1),-t.current.group.position.z),P=new C;i.current.ray.intersectPlane(y,P),P&&t.current.group.position.set(P.x,P.y,t.current.group.position.z)}},v=n=>{var s;if(!F.current)return;const a=S.getBoundingClientRect();m.current.x=(n.clientX-a.left)/a.width*2-1,m.current.y=-((n.clientY-a.top)/a.height)*2+1,i.current.setFromCamera(m.current,A);const y=j.current.map(u=>u).filter(Boolean),P=i.current.intersectObjects(y,!0);if(P.length>0){let u=P[0].object;for(;u.parent&&!u.userData.isNode;)u=u.parent;if(u.userData.isNode){const r=u.userData.disciplineIndex;x.current[r].isDragging=!0,t.current={group:u,index:r};const M=(s=q.current)==null?void 0:s.dragNode(O[r].baseFreq,0);u.userData.dragTone=M}}},f=()=>{var n;if(t.current){const a=t.current.index;x.current[a].isDragging=!1,(n=q.current)==null||n.releaseNode(t.current.group.userData.dragTone),t.current=null}};return S.addEventListener("pointermove",D),S.addEventListener("pointerdown",v),S.addEventListener("pointerup",f),()=>{S.removeEventListener("pointermove",D),S.removeEventListener("pointerdown",v),S.removeEventListener("pointerup",f)}},[I,A,F]),c.useEffect(()=>{const S=D=>{const v=D.detail.index,f=j.current[v];f&&(f.userData.frozen=!0,setTimeout(()=>{f.userData.frozen=!1,J.to(f.scale,{x:3,y:3,z:3,duration:.3,ease:"cubic-bezier(0.34,1.56,0.64,1)",onComplete:()=>{J.to(f.scale,{x:1.4,y:1.4,z:1.4,duration:.4})}});const n=f.userData.childGroup;n.visible=!0,n.children.forEach((a,y)=>{const P=a.userData.homePos.clone();a.position.set(0,0,0),J.to(a.position,{x:P.x,y:P.y,z:P.z,delay:y*.01,duration:.6,ease:"power2.out"}),a.userData.labelVisible=!0}),X.current[0]&&J.to(X.current[0].uniforms.uPulseSync,{value:.5,duration:.4,yoyo:!0,repeat:1})},200))};return window.addEventListener("forge:ignite",S),()=>window.removeEventListener("forge:ignite",S)},[]),c.useEffect(()=>{const S=D=>{const v=D.detail.index,f=j.current[v];if(!f)return;const n=f.userData.childGroup;n.children.forEach((a,y)=>{J.to(a.position,{x:0,y:0,z:0,delay:y*.008,duration:.5,ease:"power2.in",onComplete:()=>{y===n.children.length-1&&(n.visible=!1)}})}),J.to(f.scale,{x:1,y:1,z:1,duration:.6,ease:"back.out(1.7)"}),k.current.emissive[v]=1.8,f.userData.haloMat&&(f.userData.haloMat.opacity=.25),l.current[v]&&J.to(l.current[v].mat,{opacity:.5,duration:.8})};return window.addEventListener("forge:retract",S),()=>window.removeEventListener("forge:retract",S)},[]),c.useEffect(()=>{const S=()=>{const v=new C(0,0,0);j.current.forEach((f,n)=>{if(!f)return;const a=new C(Math.cos(n/5*Math.PI*2)*1.5,0,Math.sin(n/5*Math.PI*2)*1.5);J.to(f.position,{x:v.x+a.x,y:v.y+a.y,z:v.z+a.z,duration:2.5,ease:"power2.inOut"}),x.current[n].home.copy(v).add(a)}),l.current.forEach(({mat:f})=>{J.to(f,{opacity:.8,duration:1})})},D=()=>{j.current.forEach((v,f)=>{v&&J.to(v.position,{y:40,duration:.8+f*.1,ease:"power2.in",delay:f*.1})}),o.current,X.current.forEach(v=>{J.to(v.uniforms.uPulseSync,{value:0,duration:1.2})})};return window.addEventListener("forge:convergence",S),window.addEventListener("forge:exit",D),()=>{window.removeEventListener("forge:convergence",S),window.removeEventListener("forge:exit",D)}},[]),null}function nt(){const e=c.useRef(null),g=c.useRef(0),w=c.useRef(-1),T=c.useRef(new Set),L=c.useRef(null),F=c.useRef(!1),G=c.useRef(Ye()),[W,q]=c.useState(0),[h,A]=c.useState(null),[I,j]=c.useState(null),[H,X]=c.useState({x:0,y:0}),[d,o]=c.useState(new Set),[l,x]=c.useState({line1:!1,line2:!1}),[t,i]=c.useState(!1),[m,R]=c.useState(!1),U=c.useRef(null);c.useRef(new xe),c.useRef(new ue),c.useEffect(()=>{const n=J.context(()=>{be.create({trigger:e.current,start:"top top",end:"+=6000",pin:!0,scrub:1,anticipatePin:1,onUpdate:a=>{var r;const y=a.progress;g.current=y,y<.2?(R(!0),A(null)):R(!1);const P=[.2,.36,.52,.64,.76,.88];let s=-1;for(let M=0;M<5;M++)if(y>=P[M]&&y<P[M+1]){s=M;break}s!==w.current&&(w.current>=0&&window.dispatchEvent(new CustomEvent("forge:retract",{detail:{index:w.current}})),w.current=s,s>=0?A(O[s]):A(null));const u=T.current.size>=5;y>=.88&&!L.current&&u&&(L.current=performance.now(),A(null),w.current=-1,window.dispatchEvent(new CustomEvent("forge:convergence")),(r=G.current)==null||r.triggerConvergence(),setTimeout(()=>x(M=>({...M,line1:!0})),2500),setTimeout(()=>x(M=>({...M,line2:!0})),4500)),y>=.92&&u&&!F.current&&(F.current=!0,i(!0)),y>=.98&&window.dispatchEvent(new CustomEvent("forge:exit"))}})},e);return()=>n.revert()},[]);const k=c.useCallback(n=>{var a,y;if(!T.current.has(n)){T.current.add(n),o(new Set(T.current)),window.dispatchEvent(new CustomEvent("forge:ignite",{detail:{index:n}})),(a=G.current)==null||a.igniteNode(O[n].baseFreq);try{(y=G.current)==null||y.startAmbience()}catch{}}},[]),S=c.useCallback(n=>{X({x:n.clientX,y:n.clientY})},[]),D=c.useRef(!1);return c.useEffect(()=>{const n=()=>{var a;if(!D.current){D.current=!0;try{(a=G.current)==null||a.startAmbience()}catch{}}};return document.addEventListener("pointerdown",n,{once:!0}),()=>document.removeEventListener("pointerdown",n)},[]),E.jsxs("div",{className:"forge-container",ref:e,children:[E.jsx(Ae,{ref:U,onMouseMove:S,style:{position:"absolute",inset:0},gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},dpr:Math.min(window.devicePixelRatio,2),children:E.jsx(et,{scrollProgress:g,activeNode:w,onParticleCount:q,visitedNodes:T,convergenceActive:L,freeForgActive:F,onNodeActivate:k,dragEnabled:F,audioRef:G})}),E.jsxs("div",{className:"forge-realm-label",children:[E.jsx("span",{className:"forge-realm-num",children:"II. THE FORGE"}),h&&E.jsxs("span",{className:"forge-active-disc",children:["[ ",h.name," ] — ACTIVE"]})]}),E.jsx("div",{className:"forge-progress-dots",children:O.map((n,a)=>E.jsx("div",{className:`forge-dot ${d.has(a)?"visited":""} ${(h==null?void 0:h.id)===n.id?"active":""}`,title:n.name},n.id))}),E.jsxs("div",{className:"forge-particle-count",children:["PARTICLES: ",W.toLocaleString()]}),m&&E.jsx("div",{className:"forge-approach-prompt",children:"APPROACH A DISCIPLINE."}),h&&E.jsxs("div",{className:"forge-discipline-overlay",children:[E.jsx("h2",{className:"forge-disc-title",children:h.name.split("").map((n,a)=>E.jsx("span",{className:"forge-letter",style:{animationDelay:`${a*.06}s`},children:n===" "?" ":n},a))}),E.jsx("p",{className:"forge-disc-desc",children:h.description}),E.jsx("p",{className:"forge-disc-depth",children:h.depth})]}),l.line1&&E.jsxs("div",{className:"forge-convergence-text",children:[E.jsx("div",{className:`forge-conv-line ${l.line1?"reveal":""}`,children:"YOUR DISCIPLINES DON'T COMPETE.".split("").map((n,a)=>E.jsx("span",{className:"forge-conv-letter",style:{animationDelay:`${a*.04}s`},children:n===" "?" ":n},a))}),l.line2&&E.jsx("div",{className:"forge-conv-line reveal",style:{animationDelay:"0.3s"},children:"THEY CONSPIRE.".split("").map((n,a)=>E.jsx("span",{className:"forge-conv-letter",style:{animationDelay:`${a*.06+.3}s`},children:n===" "?" ":n},a))})]}),t&&E.jsx("div",{className:"forge-freeforge-prompt",children:"DRAG ANYTHING. SEE WHAT HOLDS."}),I&&E.jsx(Qe,{skill:I,x:H.x,y:H.y,visible:!!I})]})}export{nt as default};
