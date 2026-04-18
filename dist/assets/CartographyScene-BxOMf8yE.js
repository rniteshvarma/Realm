import{r as a,J as S,b as C,c as M,K as ae,f as V,m as G,a as N,v as se,y as ie,h as W,D as U,j as n,k as le,B as q,L as H,N as ce,d as $,V as Y,O as ue,U as ve,e as fe,g as O,u as de,S as me,C as he}from"./index-C6A6qjDW.js";import{E as pe,C as ge,B as be}from"./ChromaticAberration-1eOgYB6j.js";import{T as ye}from"./Text-Dun43wfy.js";import{P as xe}from"./PerspectiveCamera-CBY1_SN-.js";import"./Fbo-CHV-28Jx.js";const j=[174,285,396,417,528],we=[{type:"arpeggio",note:174,vol:.03},{type:"pad",note:285,vol:.025},{type:"pulse",note:396,vol:.02},{type:"shimmer",note:2e3,vol:.015},{type:"sub",note:40,vol:.018}];function A(){return S.ctx}function B(){const e=A();if(!e)return;const s=e.sampleRate*.65,t=e.createBuffer(1,s,e.sampleRate),i=t.getChannelData(0);for(let c=0;c<s;c++)i[c]=(Math.random()*2-1)*Math.pow(1-c/s,1.2);const r=e.createBufferSource();r.buffer=t;const o=e.createBiquadFilter();o.type="lowpass",o.frequency.setValueAtTime(4e3,e.currentTime),o.frequency.exponentialRampToValueAtTime(100,e.currentTime+.6),o.Q.value=1.5;const l=e.createGain();l.gain.setValueAtTime(.3,e.currentTime),l.gain.linearRampToValueAtTime(0,e.currentTime+.65),r.connect(o),o.connect(l),S.reverbNode?l.connect(S.reverbNode):l.connect(e.destination),r.start()}function Ce(e){const s=A();if(!s)return null;const t=s.createOscillator();t.type="sine",t.frequency.value=e;const i=s.createGain();return i.gain.value=0,t.connect(i),S.reverbNode?i.connect(S.reverbNode):i.connect(S.masterGain||s.destination),t.start(),{osc:t,gain:i}}function Se(e){const s=A();if(!s)return null;const t=we[e];if(!t)return null;const i=s.createGain();i.gain.value=0;const r=[];if(t.type==="arpeggio"){const o=s.createOscillator(),l=s.createOscillator();o.type="sine",l.type="sine",o.frequency.value=t.note,l.frequency.value=t.note*1.5;const c=s.createOscillator();c.type="square",c.frequency.value=4;const u=s.createGain();u.gain.value=.5,c.connect(u),u.connect(o.frequency),o.connect(i),l.connect(i),o.start(),l.start(),c.start(),r.push(o,l,c)}else if(t.type==="pad")[1,1.25,1.5,1.875].forEach(l=>{const c=s.createOscillator();c.type="triangle",c.frequency.value=t.note*l,c.connect(i),c.start(),r.push(c)});else if(t.type==="pulse"){const o=s.createOscillator();o.type="sine",o.frequency.value=t.note;const l=s.createOscillator();l.type="sine",l.frequency.value=.5;const c=s.createGain();c.gain.value=.5,l.connect(c),c.connect(i.gain),o.connect(i),o.start(),l.start(),r.push(o,l)}else if(t.type==="shimmer"){const o=s.createOscillator();o.type="triangle",o.frequency.value=t.note;const l=s.createOscillator();l.type="sine",l.frequency.value=5.5;const c=s.createGain();c.gain.value=20,l.connect(c),c.connect(o.frequency),o.connect(i),o.start(),l.start(),r.push(o,l)}else if(t.type==="sub"){const o=s.createOscillator();o.type="sine",o.frequency.value=t.note,o.connect(i),o.start(),r.push(o)}return S.reverbNode?i.connect(S.reverbNode):i.connect(S.masterGain||s.destination),{gain:i,nodes:r,config:t}}function Re({phase:e,projectIndex:s,phaseProgress:t,zoneProgress:i}){const r=a.useRef(null),o=a.useRef(null),l=a.useRef(null),c=a.useRef(-1),u=a.useRef(!1);a.useEffect(()=>{if(!S.ctx||!S._running||u.current)return;u.current=!0;const v=S.ctx;if(!v)return;const g=[110,165,220,330,440,660,880];for(let f=0;f<Math.min(g.length,12);f++){const y=1+f*2,T=S.oscillators[y];T&&T.frequency&&(T.frequency.cancelScheduledValues(v.currentTime),T.frequency.setValueAtTime(T.frequency.value,v.currentTime),T.frequency.linearRampToValueAtTime(g[f]||220,v.currentTime+4))}},[]);const p=a.useCallback((v,g)=>{const f=A();if(f){if(c.current!==v){if(r.current){const{gain:y,osc:T}=r.current;y.gain.cancelScheduledValues(f.currentTime),y.gain.linearRampToValueAtTime(0,f.currentTime+.5),setTimeout(()=>{try{T.stop()}catch{}},600),r.current=null}c.current=v,r.current=Ce(j[v])}if(r.current){const y=g*.12;r.current.gain.gain.cancelScheduledValues(f.currentTime),r.current.gain.gain.setValueAtTime(r.current.gain.gain.value,f.currentTime),r.current.gain.gain.linearRampToValueAtTime(y,f.currentTime+.1)}}},[]),h=a.useRef(!1),m=a.useCallback(v=>{v>.02&&!h.current&&(h.current=!0,B())},[]),d=a.useCallback(v=>{const g=A();if(!g)return;if(r.current&&r.current.gain.gain.linearRampToValueAtTime(0,g.currentTime+.5),o.current){o.current.gain.gain.cancelScheduledValues(g.currentTime),o.current.gain.gain.linearRampToValueAtTime(o.current.config.vol,g.currentTime+1.5);return}const f=Se(v);f&&(o.current=f,f.gain.gain.linearRampToValueAtTime(f.config.vol,g.currentTime+2))},[]),b=a.useCallback(()=>{const v=A();if(v){if(h.current=!1,o.current){o.current.gain.gain.cancelScheduledValues(v.currentTime),o.current.gain.gain.linearRampToValueAtTime(0,v.currentTime+.4);const g=o.current.nodes;setTimeout(()=>{g.forEach(f=>{try{f.stop()}catch{}})},500),o.current=null}if(S.masterGain){const g=S.masterGain.gain,f=g.value;g.cancelScheduledValues(v.currentTime),g.setValueAtTime(f,v.currentTime),g.linearRampToValueAtTime(f*1.3,v.currentTime+.4),g.linearRampToValueAtTime(f,v.currentTime+1.4)}}},[]),x=a.useRef(!1),w=a.useCallback(()=>{if(x.current)return;x.current=!0;const v=A();v&&j.forEach(g=>{const f=v.createOscillator();f.type="sine",f.frequency.value=g;const y=v.createGain();y.gain.value=0,f.connect(y),S.reverbNode?y.connect(S.reverbNode):y.connect(v.destination),f.start(),y.gain.linearRampToValueAtTime(.008,v.currentTime+3),y.gain.setValueAtTime(.008,v.currentTime+30),y.gain.linearRampToValueAtTime(0,v.currentTime+35),setTimeout(()=>{try{f.stop()}catch{}},36e3)})},[]);return a.useEffect(()=>{!A()||!S._running||(l.current!==e&&(e==="escape"&&b(),l.current=e),e==="approach"?p(s,t):e==="descent"?m(t):e==="inside"&&d(s))},[e,s,t,p,m,d,b]),a.useEffect(()=>{e==="escape"&&s===4&&t>.6&&w()},[e,s,t,w]),a.useEffect(()=>()=>{if(r.current)try{r.current.osc.stop()}catch{}o.current&&o.current.nodes.forEach(v=>{try{v.stop()}catch{}})},[]),{playDescentWhoosh:B}}const R=[{index:0,id:"genesis",title:"GENESIS SYSTEM",role:"Lead Design Engineer",year:"2024",tags:["Design Systems","React","Figma API"],pullQuote:"The hardest thing isn't building the system — it's deciding what the system believes.",verb:"ENGINEERED.",challenge:"How do you create a design system that scales across 40 product teams without becoming a cage?",metric:"340%",metricDesc:"increase in design-to-dev velocity",reflection:"Constraints, when chosen deliberately, are the most generative force in design.",liveUrl:"#",readMoreUrl:"#",orbRadius:1.1,orbShader:"electric",orbColor1:new M(330266),orbColor2:new M(26367),orbPosition:new C(-6,2,-20),interiorType:"neuralGrid",interiorBg:"#000D1A",frequency:174,panels:{brief:"A Fortune 500 fintech company needed a single design system to serve 40 product teams spanning 8 time zones.",process:"Started with a token audit across 140 active components. Built a component genealogy tree. Defined the philosophy before the pixels.",solution:"A living design system with automated Figma-to-code pipelines, semantic token architecture, and a governance model that treats contributors as first-class citizens.",impact:"340% velocity increase. 60% reduction in design inconsistencies. 14 previously siloed teams shipping coherently.",learning:"The real deliverable wasn't the system — it was the shared language it gave the organization."}},{index:1,id:"tidal",title:"TIDAL",role:"Creative Technologist & Frontend Lead",year:"2023",tags:["D3.js","WebGL","Real-time Data"],pullQuote:"Data only matters when it makes someone feel the weight of a number.",verb:"VISUALIZED.",challenge:"Turn 12 years of ocean temperature data into something that could change how people feel about climate change.",metric:"2.4M",metricDesc:"unique visitors in first 3 months",reflection:"The most powerful visualization I've ever built is the one that made a senator cry.",liveUrl:"#",readMoreUrl:"#",orbRadius:.9,orbShader:"ocean",orbColor1:new M(5424),orbColor2:new M(39321),orbPosition:new C(7,-1,-22),interiorType:"liquidMetal",interiorBg:"#030D12",frequency:285,panels:{brief:"NOAA needed a public-facing visualization of 12 years of ocean temperature anomaly data.",process:"Synthesized 4TB of raw sensor data. Prototyped 23 visualization forms. Tested emotional response with 40 participants.",solution:'An interactive 3D globe with time-scrubbing, animated thermal layers, and a "witness" mode that plays the full 12 years in 90 seconds.',impact:"2.4M visitors. Featured in The Guardian, WIRED, and Atlantic. Used in 3 congressional briefings.",learning:"Restraint in animation is the difference between data art and propaganda."}},{index:2,id:"ember",title:"EMBER",role:"Design Director",year:"2023",tags:["Brand Identity","Motion Design","CSS Architecture"],pullQuote:"A brand is not a logo. It's a promise made visible.",verb:"DIRECTED.",challenge:"Rebuild a 15-year-old enterprise software brand from zero without alienating its 200,000 existing users.",metric:"89%",metricDesc:"brand recognition among target segment post-launch",reflection:'The moment I stopped trying to make it look "modern" was the moment it became timeless.',liveUrl:"#",readMoreUrl:"#",orbRadius:1.2,orbShader:"lava",orbColor1:new M(1704704),orbColor2:new M(16729088),orbPosition:new C(-4,-3,-18),interiorType:"digitalGarden",interiorBg:"#010800",frequency:396,panels:{brief:"Reposition and rebrand Hestia Software, a 15-year legacy project management tool, to compete in the modern dev-tools market.",process:" 6-month discovery. 40 stakeholder interviews. 3 brand territory explorations. Tested with existing users before committing line 1 of CSS.",solution:"Ember — a brand built around the metaphor of sustained creative heat. Warm palette, confident typography, motion system rooted in acceleration curves.",impact:"89% unprompted recognition among ICP. 40% increase in trial sign-ups in Q1. Covered in Brand New.",learning:"Legacy users aren't resistant to change. They're resistant to being abandoned. Bring them with you."}},{index:3,id:"prism",title:"PRISM",role:"Product Designer & Prototyper",year:"2022",tags:["VSCode Extension","Semantic Analysis","TypeScript"],pullQuote:"The best tools are the ones that disappear — you only notice them when they're gone.",verb:"INVENTED.",challenge:"Help developers understand their own codebase structure the way architects understand a building.",metric:"47K",metricDesc:"active installs on VSCode Marketplace",reflection:"I shipped a thing that programmers use every day and most of them don't know my name. That's what success looks like.",liveUrl:"#",readMoreUrl:"#",orbRadius:.7,orbShader:"ice",orbColor1:new M(13166840),orbColor2:new M(43724),orbPosition:new C(8,4,-25),interiorType:"frequencyRoom",interiorBg:"#010510",frequency:417,panels:{brief:"Design a VSCode extension that gives developers a spatial map of their codebase's dependency graph.",process:"Spent 3 weeks as a developer using competing tools. Found the core pain: cognitive load of invisible dependencies. Designed around reducing mental model burden.",solution:"Prism — a living dependency map that updates as you type, surfaces hidden coupling, and suggests refactor opportunities. Zero config, zero friction.",impact:"47K active installs. 4.8/5 marketplace rating. Featured in the VSCode official blog.",learning:"Zero → one is the hardest distance. Not because of the code. Because of the courage to ship before it's perfect."}},{index:4,id:"codex",title:"CODEX",role:"Founder & Full-Stack Developer",year:"2022",tags:["Next.js","Postgres","OpenAI API"],pullQuote:"We don't have a knowledge problem. We have a retrieval problem.",verb:"BUILT.",challenge:"Make institutional knowledge — the stuff that lives in people's heads — searchable and alive.",metric:"12,000",metricDesc:"hours of institutional knowledge captured in beta",reflection:"The hardest part of building knowledge tools is convincing people their knowledge is worth preserving.",liveUrl:"#",readMoreUrl:"#",orbRadius:.85,orbShader:"circuit",orbColor1:new M(68099),orbColor2:new M(52292),orbPosition:new C(-2,1,-15),interiorType:"archiveWithin",interiorBg:"#0A0101",frequency:528,panels:{brief:"Build a knowledge management platform for research teams where information decays as fast as people leave.",process:"Spent 6 months embedded with 3 research teams. Mapped knowledge flows. Found 73% of critical context lived in Slack and heads, not docs.",solution:"Codex — an AI-augmented knowledge graph that captures expertise from conversations, meetings, and code comments. Surfaces relevant context proactively.",impact:"12,000 hours of institutional knowledge captured. 3 enterprise clients in beta. $280K ARR pre-Series A.",learning:"If you're building for knowledge workers, you have to understand that time is their scarcest resource. Every extra click is a moral failure."}}];function X(e,s){const t=e.orbPosition,i=s||t.clone().add(new C(0,0,60));return new ae([i,t.clone().add(new C(3,1.5,15)),t.clone().add(new C(4,.5,5)),t.clone().add(new C(-5,.8,2)),t.clone().add(new C(-3,-1.2,-2)),t.clone().add(new C(1,.4,.5)),t.clone().add(new C(0,0,-1.5))],!1,"catmullrom",.5)}const E={APPROACH_END:.2,ORBIT_END:.4,DESCENT_END:.6,INSIDE_END:.85};function Te(e,s){const t=1/s,i=e/t,r=Math.min(Math.floor(i),s-1),o=(e-r*t)/t;let l="escape",c=E.INSIDE_END,u=1;o<E.APPROACH_END?(l="approach",c=0,u=E.APPROACH_END):o<E.ORBIT_END?(l="orbit",c=E.APPROACH_END,u=E.ORBIT_END):o<E.DESCENT_END?(l="descent",c=E.ORBIT_END,u=E.DESCENT_END):o<E.INSIDE_END&&(l="inside",c=E.DESCENT_END,u=E.INSIDE_END);const p=u>c?(o-c)/(u-c):0;return{projectIndex:r,zoneProgress:o,phase:l,phaseProgress:Math.max(0,Math.min(1,p))}}const Ee=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform float uTime;
uniform float uSpeed;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,Q=`// ── ORB SURFACE: ELECTRIC STORM ──
// Deep navy / electric blue with animated noise + lightning flashes

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep navy
uniform vec3 uColor2;  // electric blue

// Hash & noise
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    val += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return val;
}

// Lightning bolt: returns brightness along a jagged vertical line
float lightning(vec2 uv, float seed, float t) {
  float x = uv.x - (0.3 + seed * 0.4);
  float jitter = fbm(vec2(uv.y * 4.0 + seed * 10.0, t * 2.0), 3) * 0.15;
  float d = abs(x + jitter);
  float bolt = 1.0 - smoothstep(0.0, 0.025, d);
  // Flash envelope: sharp on, quick fade
  float flash = sin(t * 6.28 + seed * 7.3) * 0.5 + 0.5;
  flash = pow(flash, 8.0);
  return bolt * flash;
}

void main() {
  float t = uTime * uSpeed * 0.4;
  vec2 uv = vUv;

  // Cloud noise base
  float cloud = fbm(uv * 3.0 + vec2(t * 0.1, -t * 0.07), 5);
  cloud = cloud * 0.5 + 0.5;

  // Storm cell — brighter in the middle
  vec2 center = uv - 0.5;
  float stormCore = 1.0 - length(center) * 1.4;
  stormCore = clamp(stormCore, 0.0, 1.0);

  // Base planet color
  vec3 col = mix(uColor1, uColor2, cloud * stormCore + 0.1);

  // Add a swirling dark layer
  float swirl = fbm(uv * 2.0 + vec2(-t * 0.05, t * 0.08), 4);
  col = mix(col, uColor1 * 0.3, swirl * (1.0 - stormCore) * 0.6);

  // Lightning flashes — 3 bolts with different seeds
  float bolts = 0.0;
  bolts += lightning(uv, 0.1, t);
  bolts += lightning(uv, 0.55, t + 1.3);
  bolts += lightning(uv, 0.82, t + 2.7);
  bolts = clamp(bolts, 0.0, 1.0);
  col += vec3(0.6, 0.85, 1.0) * bolts * 2.0;

  // Edge atmosphere glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  col += uColor2 * rim * 0.8;

  // Slight emissive
  col += uColor2 * stormCore * 0.15;

  gl_FragColor = vec4(col, 1.0);
}
`,Ne=`// ── ORB SURFACE: OCEAN ──
// Deep teal / dark blue with wave displacement + foam crests

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep ocean blue
uniform vec3 uColor2;  // teal / cyan

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float wave(vec2 uv, float freq, float speed, float amp) {
  return amp * sin(uv.x * freq + uTime * speed * uSpeed)
           * cos(uv.y * freq * 0.7 + uTime * speed * 0.6 * uSpeed);
}

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;

  // Wave displacement — stacked sine waves at multiple scales
  float h = 0.0;
  h += wave(uv, 6.0,  0.8,  0.12);
  h += wave(uv, 13.0, 1.3,  0.06);
  h += wave(uv, 28.0, 2.1,  0.03);
  h += wave(uv, 52.0, 3.5,  0.015);
  h = h * 0.5 + 0.5; // normalize to [0,1]

  // Deep vs shallow coloring
  vec3 deep  = uColor1 * 0.4;
  vec3 mid   = uColor1;
  vec3 crest = uColor2;
  vec3 foam  = vec3(0.85, 0.95, 1.0);

  vec3 col = mix(deep, mid, h);
  col = mix(col, crest, smoothstep(0.65, 0.75, h));
  // Foam on peaks
  float foamMask = smoothstep(0.78, 0.90, h);
  float foamNoise = noise(uv * 20.0 + vec2(t * 0.5, 0.0)) * 0.5 + 0.5;
  col = mix(col, foam, foamMask * foamNoise * 1.3);

  // Subsurface scattering — brighten edges lit by center
  float sss = max(0.0, dot(vNormal, normalize(vec3(0.3, 0.5, 0.8))));
  col += uColor2 * sss * 0.2;

  // Rim glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 4.0);
  col += uColor2 * rim * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`,Me=`// ── ORB SURFACE: MOLTEN LAVA ──
// Slow churning lava-lamp noise with hot cores

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep red / dark
uniform vec3 uColor2;  // bright orange / yellow

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  float t = uTime * uSpeed * 0.15; // slow, viscous movement
  vec2 uv = vUv;

  // Domain-warped lava noise
  vec2 q = vec2(fbm(uv + vec2(0.0, 0.0) + t),
                fbm(uv + vec2(5.2, 1.3) + t * 0.9));

  vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.4));

  float f = fbm(uv + 4.0 * r + t);
  f = f * 0.5 + 0.5;

  // Color based on "temperature"
  vec3 coldRock = uColor1 * 0.15;          // near black
  vec3 coolLava = uColor1;                 // dark red
  vec3 hotLava  = uColor2;                 // bright orange
  vec3 hotCore  = vec3(1.0, 0.95, 0.6);   // yellow-white hot center

  vec3 col = coldRock;
  col = mix(col, coolLava, smoothstep(0.2, 0.45, f));
  col = mix(col, hotLava,  smoothstep(0.45, 0.70, f));
  col = mix(col, hotCore,  smoothstep(0.72, 0.88, f));

  // Emissive glow on hot spots
  col += hotCore * smoothstep(0.80, 1.0, f) * 0.8;

  // Rim atmosphere — molten red
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 2.5);
  col += vec3(1.0, 0.3, 0.0) * rim * 0.7;

  gl_FragColor = vec4(col, 1.0);
}
`,Ae=`// ── ORB SURFACE: ICE CRYSTAL LATTICE ──
// Faceted, refracting, with hexagonal lattice and sparkle

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // pale ice blue
uniform vec3 uColor2;  // deep crystal cyan

// Hexagonal tiling
vec2 hexCoord(vec2 uv, float scale) {
  uv *= scale;
  vec2 s = vec2(1.0, 1.732);
  vec2 a = mod(uv, s) - s * 0.5;
  vec2 b = mod(uv + s * 0.5, s) - s * 0.5;
  return dot(a, a) < dot(b, b) ? a : b;
}

float hexDist(vec2 h) {
  h = abs(h);
  return max(dot(h, normalize(vec2(1.0, 1.732))), h.x);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash2(i), vec2(1.0));
  float b = dot(hash2(i + vec2(1,0)), vec2(1.0));
  float c = dot(hash2(i + vec2(0,1)), vec2(1.0));
  float d = dot(hash2(i + vec2(1,1)), vec2(1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  float t = uTime * uSpeed * 0.1;
  vec2 uv = vUv;

  // Slowly shifting hex lattice — subtle drift
  vec2 drift = vec2(t * 0.03, t * 0.02);
  vec2 h6  = hexCoord(uv + drift, 6.0);
  vec2 h12 = hexCoord(uv * 1.8 - drift * 0.5, 10.0);

  float d6  = hexDist(h6);
  float d12 = hexDist(h12);

  // Cell edges — the "crystal facets"
  float edge6  = 1.0 - smoothstep(0.38, 0.48, d6);
  float edge12 = 1.0 - smoothstep(0.35, 0.44, d12);

  // Per-cell shimmer — different facet brightness
  float cellId = dot(hash2(floor(uv * 6.0 + drift)), vec2(1.0));
  float facet  = smoothstep(-0.3, 1.0, cellId);

  // Base crystal color
  vec3 base = mix(uColor1, uColor2, facet * 0.6 + d12 * 0.4);

  // Edge highlight — white frost
  vec3 frostWhite = vec3(0.9, 0.97, 1.0);
  base = mix(base, frostWhite * 1.2, edge6 * 0.8);
  base = mix(base, frostWhite, edge12 * 0.5);

  // Sparkle points — random high-frequency twinkle
  float sparkNoise = noise(uv * 40.0 + t * 2.0);
  float sparkle = pow(max(0.0, sparkNoise), 14.0);
  base += frostWhite * sparkle * 3.0;

  // Interior glow — slightly warmer center
  vec2 center = uv - 0.5;
  float glow = 1.0 - length(center) * 1.8;
  glow = clamp(glow, 0.0, 1.0);
  base += uColor2 * glow * 0.25;

  // Refraction shimmer — time-based hue shift at edges
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  // Rainbow rim — iridescent crystal edges
  float hueShift = sin(rim * 6.0 + t * 2.0) * 0.5 + 0.5;
  vec3 rainbowRim = mix(vec3(0.4, 0.8, 1.0), vec3(0.9, 0.6, 1.0), hueShift);
  base += rainbowRim * rim * 0.6;

  gl_FragColor = vec4(base, 1.0);
}
`,ke=`// ── ORB SURFACE: LIVING CIRCUIT BOARD ──
// Animated PCB trace lines with traveling signal pulses

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // dark green / PCB background
uniform vec3 uColor2;  // bright green / gold trace

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

// Grid-aligned trace network
float trace(vec2 uv, float gridSize) {
  vec2 cell = floor(uv * gridSize);
  vec2 local = fract(uv * gridSize);

  // Decide if this cell has a horizontal or vertical trace based on hash
  vec2 h = hash2(cell);

  float traceH = 0.0;
  float traceV = 0.0;

  // Horizontal traces in alternating cells
  if (h.x > 0.35) {
    traceH = 1.0 - smoothstep(0.0, 0.06, abs(local.y - 0.5));
  }
  // Vertical traces in other cells
  if (h.y > 0.35) {
    traceV = 1.0 - smoothstep(0.0, 0.06, abs(local.x - 0.5));
  }

  return max(traceH, traceV);
}

// Signal pulse traveling along a trace
float pulse(vec2 uv, float gridSize, float t) {
  vec2 cell = floor(uv * gridSize);
  vec2 local = fract(uv * gridSize);
  vec2 h = hash2(cell);

  // Pulse travels from 0 to 1 along the trace, seeded per cell
  float speed = 0.8 + h.x * 1.5;
  float phase = h.y * 6.28;
  float pos = fract(t * speed * uSpeed + phase);

  float pulseH = 0.0;
  float pulseV = 0.0;

  if (h.x > 0.35) {
    // Horizontal pulse
    float onTrace = 1.0 - smoothstep(0.0, 0.08, abs(local.y - 0.5));
    float hit = 1.0 - smoothstep(0.0, 0.18, abs(local.x - pos));
    pulseH = onTrace * hit;
  }
  if (h.y > 0.35) {
    // Vertical pulse
    float onTrace = 1.0 - smoothstep(0.0, 0.08, abs(local.x - 0.5));
    float hit = 1.0 - smoothstep(0.0, 0.18, abs(local.y - pos));
    pulseV = onTrace * hit;
  }

  return max(pulseH, pulseV);
}

// Node/via intersection dot
float node(vec2 uv, float gridSize) {
  vec2 local = fract(uv * gridSize);
  vec2 h = hash2(floor(uv * gridSize));
  if (h.x * h.y > 0.5) {
    return 1.0 - smoothstep(0.08, 0.14, length(local - 0.5));
  }
  return 0.0;
}

void main() {
  float t = uTime * 0.5;
  vec2 uv = vUv;

  // Multi-scale circuit grid
  float coarse = trace(uv, 5.0);
  float medium = trace(uv, 12.0);
  float fine   = trace(uv, 24.0);

  float traces = max(coarse * 1.0, max(medium * 0.7, fine * 0.4));

  // Pulses on each scale
  float pulseC = pulse(uv, 5.0,  t);
  float pulseM = pulse(uv, 12.0, t + 1.3);
  float pulseF = pulse(uv, 24.0, t + 2.7);
  float pulses = max(pulseC, max(pulseM * 0.8, pulseF * 0.6));

  // Circuit nodes
  float nodes = max(node(uv, 5.0), node(uv, 12.0));

  // PCB substrate texture — subtle noise
  vec2 h2 = hash2(floor(uv * 80.0));
  float substrate = h2.x * 0.04;

  // Color assembly
  vec3 background = uColor1 * (0.15 + substrate);
  vec3 traceColor = mix(uColor2, vec3(0.4, 0.9, 0.3), 0.5);
  vec3 pulseColor = vec3(1.0, 1.0, 0.5); // gold pulse
  vec3 nodeColor  = vec3(0.8, 0.7, 0.2); // gold nodes

  vec3 col = background;
  col = mix(col, traceColor, traces * 0.7);
  col = mix(col, pulseColor, pulses);
  col += nodeColor * nodes * 0.8;

  // Emissive glow on active traces
  col += traceColor * traces * 0.1;
  col += pulseColor * pulses * 0.8;

  // Rim glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  col += uColor2 * rim * 0.4;

  gl_FragColor = vec4(col, 1.0);
}
`,Pe={electric:Q,ocean:Ne,lava:Me,ice:Ae,circuit:ke};function De({orbRadius:e,phase:s,isMobile:t}){const i=t?2:4,r=a.useRef();a.useRef([]);const o=a.useMemo(()=>Array.from({length:i},(m,d)=>({radius:.04+Math.random()*.04,orbitR:e*1.6+d*.3,speed:.4+Math.random()*.6,axisX:Math.random()*.6-.3,axisY:Math.random()*.3,phaseOff:d/i*Math.PI*2})),[e,i]),l=a.useMemo(()=>new G(.06,8,8),[]),c=a.useMemo(()=>new le({color:13421789,roughness:.8,metalness:.2}),[]),u=a.useMemo(()=>o.map(m=>{const d=[];for(let b=0;b<=60;b++){const x=b/60*Math.PI*2+m.phaseOff,w=Math.cos(x)*m.orbitR,v=Math.sin(x)*m.orbitR,g=Math.sin(x*m.axisX+m.phaseOff)*m.orbitR*.2;d.push(new C(w,g,v))}return new q().setFromPoints(d)}),[o]),p=a.useMemo(()=>o.map(()=>new H({color:8952251,transparent:!0,opacity:0})),[o]),h=a.useMemo(()=>new ce,[]);return N(m=>{const d=m.clock.elapsedTime;if(!r.current)return;const b=s==="orbit",x=s==="approach";o.forEach((w,v)=>{const g=d*w.speed+w.phaseOff,f=Math.cos(g)*w.orbitR,y=Math.sin(g)*w.orbitR,T=Math.sin(g*w.axisX+w.phaseOff)*w.orbitR*.2;if(h.position.set(f,T,y),h.scale.setScalar(w.radius/.06),h.updateMatrix(),r.current.setMatrixAt(v,h.matrix),p[v]){const k=x||b?.35:0;p[v].opacity+=(k-p[v].opacity)*.03}}),r.current.instanceMatrix.needsUpdate=!0}),n.jsxs("group",{children:[n.jsx("instancedMesh",{ref:r,args:[l,c,i]}),u.map((m,d)=>n.jsx("line",{geometry:m,material:p[d]},d))]})}function Ie({project:e,phase:s,phaseProgress:t,mouseNDC:i,isActive:r,isMobile:o}){const l=a.useRef(),c=a.useRef();a.useRef();const u=a.useRef(1),p=Pe[e.orbShader]||Q,h=a.useMemo(()=>({uTime:{value:0},uSpeed:{value:.4},uColor1:{value:e.orbColor1.clone()},uColor2:{value:e.orbColor2.clone()}}),[e]),m=a.useMemo(()=>new V({vertexShader:Ee,fragmentShader:p,uniforms:h}),[p,h]),d=o?32:64,b=a.useMemo(()=>new G(e.orbRadius,d,d),[e.orbRadius,d]);N(v=>{const g=v.clock.elapsedTime;h.uTime.value=g;const f=s==="approach"?.4+t*.8:s==="orbit"?1.2:.4;if(h.uSpeed.value+=(f-h.uSpeed.value)*.02,!l.current)return;const y=!r&&(s==="descent"||s==="inside")?0:1;if(u.current+=(y-u.current)*.04,l.current.scale.setScalar(u.current),c.current&&s==="orbit"){const T=i.x*.4,k=-i.y*.25;c.current.rotation.y+=(T-c.current.rotation.y)*.05,c.current.rotation.x+=(k-c.current.rotation.x)*.05}c.current&&(c.current.rotation.y+=.001)});const x=a.useMemo(()=>new se(e.orbRadius*1.02,e.orbRadius*1.18,64),[e.orbRadius]),w=a.useMemo(()=>new ie({color:e.orbColor2,transparent:!0,opacity:.08,side:U,blending:W,depthWrite:!1}),[e.orbColor2]);return n.jsxs("group",{ref:l,position:e.orbPosition,children:[n.jsx("mesh",{ref:c,geometry:b,material:m}),n.jsx("mesh",{geometry:x,material:w,rotation:[Math.PI/2,0,0]}),r&&n.jsx(De,{orbRadius:e.orbRadius,phase:s,isMobile:o}),s==="approach"&&t>.6||s==="orbit"?n.jsx(ye,{position:[0,e.orbRadius+.4,0],fontSize:.18,color:"#C9A84C",anchorX:"center",anchorY:"bottom",fillOpacity:s==="orbit"?1:t*2-1.2,children:e.title}):null]})}const K=`// ── INTERIOR BIOME: NEURAL GRID ──
// Deep blue hexagonal grid with neural pulse propagation

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

// Hexagonal distance and cell
vec4 hexInfo(vec2 uv) {
  vec2 s = vec2(1.0, 1.732050808);
  vec4 b = floor(vec4(uv, uv - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 p = vec4(uv - b.xy * s, uv - (b.zw + 0.5) * s);
  vec4 c = dot(p.xy, p.xy) < dot(p.zw, p.zw) ? vec4(p.xy, b.xy) : vec4(p.zw, b.zw);
  return vec4(c.xy, c.zw);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float ar = uResolution.x / uResolution.y;
  vec2 scaledUv = vec2(uv.x * ar, uv.y) * 8.0;

  // Hex grid
  vec4 hex = hexInfo(scaledUv);
  vec2 localPos  = hex.xy;
  vec2 cellIndex = hex.zw;

  float distToCenter = length(localPos);
  float hexEdge = 1.0 - smoothstep(0.35, 0.48, distToCenter);

  // Per-cell unique seed
  float cellSeed = fract(sin(dot(cellIndex, vec2(12.9898, 78.233))) * 43758.5453);

  // Pulse wave from center — ripple outward
  float distFromOrigin = length(cellIndex / 8.0 - vec2(0.5 * ar / 8.0, 0.5));
  float pulsePhase = t * 1.5 - distFromOrigin * 12.0 + cellSeed * 6.28;
  float pulse = sin(pulsePhase) * 0.5 + 0.5;
  pulse = pow(pulse, 4.0);

  // Synaptic firing — random snap activations
  float firePhase = fract(t * (0.3 + cellSeed * 0.7) + cellSeed);
  float fire = firePhase > 0.92 ? pow((firePhase - 0.92) / 0.08, 2.0) : 0.0;
  fire = clamp(fire * (1.0 - (firePhase > 0.96 ? (firePhase - 0.96) / 0.04 : 0.0)), 0.0, 1.0);

  // Branch connections — thin lines between hex centers
  float branch = 0.0;
  float lineW = 0.025;
  // Check for near-horizontal connection
  branch = max(branch, 1.0 - smoothstep(lineW, lineW * 1.5, abs(localPos.y)) * step(abs(localPos.x), 0.5));

  // Colors
  vec3 bgColor     = vec3(0.01, 0.03, 0.10);
  vec3 gridColor   = vec3(0.05, 0.18, 0.55);
  vec3 pulseColor  = vec3(0.10, 0.50, 1.00);
  vec3 fireColor   = vec3(0.70, 0.90, 1.00);
  vec3 branchColor = vec3(0.04, 0.12, 0.40);

  vec3 col = bgColor;

  // Hex cell fill — dim gradient
  col += gridColor * (0.2 + 0.1 * sin(distToCenter * 8.0 + t));

  // Edge lines
  col = mix(col, gridColor * 1.5, (1.0 - hexEdge) * 0.7);

  // Pulse wave
  col += pulseColor * pulse * hexEdge * 0.6;

  // Synaptic flash
  col += fireColor * fire * 2.0;

  // Branch lines
  col += branchColor * branch * 0.5;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.5;
  vignette = clamp(vignette, 0.0, 1.0);
  col *= vignette;

  // Scanline
  float scanline = sin(uv.y * uResolution.y * 0.5) * 0.03;
  col -= scanline;

  gl_FragColor = vec4(col, 1.0);
}
`,_e=`// ── INTERIOR BIOME: LIQUID METAL ──
// Churning metallic fluid — silver/gunmetal with gold veins

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.1;
    a *= 0.5;
  }
  return v;
}

// Specular reflections of an imaginary light source
float specular(vec2 uv, vec2 lightPos, float roughness) {
  vec2 toLight = normalize(lightPos - uv);
  float d = length(lightPos - uv);
  float spec = pow(max(0.0, 1.0 - d * roughness), 8.0);
  return spec;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12; // slow, viscous

  // Domain-warped fluid surface
  vec2 q = vec2(fbm(uv * 3.0 + t),
                fbm(uv * 3.0 + vec2(3.7, 1.9) + t * 0.8));

  vec2 r = vec2(fbm(uv * 2.5 + 1.5 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv * 2.5 + 1.5 * q + vec2(8.3, 2.8) + t * 0.3));

  float f = fbm(uv * 2.0 + 2.0 * r + t);
  f = f * 0.5 + 0.5;

  // Metallic color palette
  vec3 gunmetal = vec3(0.10, 0.11, 0.13);
  vec3 silver   = vec3(0.70, 0.72, 0.75);
  vec3 chrome   = vec3(0.85, 0.87, 0.90);
  vec3 gold     = vec3(0.85, 0.72, 0.25);
  vec3 deepMetal= vec3(0.04, 0.05, 0.06);

  vec3 col = mix(deepMetal, gunmetal, smoothstep(0.0, 0.4, f));
  col = mix(col, silver,   smoothstep(0.4, 0.65, f));
  col = mix(col, chrome,   smoothstep(0.65, 0.85, f));

  // Gold veins — narrow threshold bands of gold
  float vein1 = 1.0 - smoothstep(0.0, 0.015, abs(f - 0.38));
  float vein2 = 1.0 - smoothstep(0.0, 0.020, abs(f - 0.52));
  float vein3 = 1.0 - smoothstep(0.0, 0.012, abs(f - 0.66));
  float veins = max(vein1, max(vein2, vein3));

  col = mix(col, gold, veins * 1.5);
  col += gold * veins * 0.5; // emissive bleeding

  // Moving specular highlights from shifting virtual lights
  vec2 light1 = vec2(0.3 + sin(t * 0.7) * 0.3, 0.6 + cos(t * 0.5) * 0.2);
  vec2 light2 = vec2(0.7 + cos(t * 0.4) * 0.2, 0.3 + sin(t * 0.6) * 0.3);
  float spec1 = specular(uv, light1, 3.0);
  float spec2 = specular(uv, light2, 4.0);
  col += chrome * (spec1 * 0.6 + spec2 * 0.4);

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.2;
  col *= clamp(vignette, 0.2, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`,Oe=`// ── INTERIOR BIOME: DIGITAL GARDEN ──
// Bioluminescent seeds that grow branching trees — deep green + gold glow

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash2(i).x;
  float b = hash2(i + vec2(1,0)).x;
  float c = hash2(i + vec2(0,1)).x;
  float d = hash2(i + vec2(1,1)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Segment distance — for drawing branch lines
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// A single tree branch contribution at a given scale
float branch(vec2 uv, vec2 root, float angle, float length, float gen, float t, float seed) {
  if (gen > 3.0) return 0.0;

  vec2 tip = root + vec2(sin(angle), cos(angle)) * length;

  // Grow animation — tip starts at root, moves outward
  float growTime = clamp(t - seed * 2.0 - gen * 0.8, 0.0, 1.0);
  vec2 animTip = mix(root, tip, growTime);

  float d = sdSegment(uv, root, animTip);
  float lineWidth = 0.005 * (1.0 + 0.5 / (gen + 1.0));
  float line = 1.0 - smoothstep(0.0, lineWidth, d);

  // Glow
  float glow = 1.0 - smoothstep(0.0, lineWidth * 4.0, d);

  return line * 0.8 + glow * 0.3;
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2(uv.x * ar, uv.y);
  float t = uTime * 0.5;

  // Background — deep forest void
  vec3 bgDark  = vec3(0.01, 0.04, 0.02);
  vec3 bgMid   = vec3(0.02, 0.07, 0.03);
  float bgNoise = noise(suv * 3.0 + t * 0.05) * 0.5 + 0.5;
  vec3 col = mix(bgDark, bgMid, bgNoise);

  // Ground mist
  float mist = smoothstep(0.85, 1.0, uv.y);
  col = mix(col, vec3(0.03, 0.12, 0.06), mist * 0.5);

  // Tree colors
  vec3 branchColor = vec3(0.05, 0.35, 0.12);
  vec3 glowColor   = vec3(0.40, 0.90, 0.30); // bioluminescent green
  vec3 tipGlow     = vec3(1.00, 0.85, 0.20); // gold at growth tips

  // Draw N trees from grid roots
  float treeMask = 0.0;
  float treeglow = 0.0;

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 seed2 = hash2(vec2(fi, 0.0));

    // Root positions scattered across lower half
    vec2 root = vec2(seed2.x * ar, 0.75 + seed2.y * 0.2);
    float treeSeed = hash1(fi * 13.7);

    // Main trunk angle (mostly upward)
    float angle = -1.5708 + (seed2.x - 0.5) * 0.8; // ~90° ± variance

    float len1 = 0.08 + seed2.y * 0.06;
    float b1 = branch(suv, root, angle, len1, 0.0, t, treeSeed);
    treeMask += b1;

    // Level 1 branches
    vec2 trunk_tip = root + vec2(sin(angle), cos(angle)) * len1;
    float bAngle1L = angle - 0.4 - seed2.x * 0.3;
    float bAngle1R = angle + 0.4 + seed2.y * 0.3;
    float len2 = len1 * 0.65;

    float b2L = branch(suv, trunk_tip, bAngle1L, len2, 1.0, t, treeSeed + 0.3);
    float b2R = branch(suv, trunk_tip, bAngle1R, len2, 1.0, t, treeSeed + 0.6);
    treeMask += b2L + b2R;

    // Level 2
    vec2 tipL = trunk_tip + vec2(sin(bAngle1L), cos(bAngle1L)) * len2;
    vec2 tipR = trunk_tip + vec2(sin(bAngle1R), cos(bAngle1R)) * len2;
    float len3 = len2 * 0.6;

    treeMask += branch(suv, tipL, bAngle1L - 0.35, len3, 2.0, t, treeSeed + 0.1);
    treeMask += branch(suv, tipL, bAngle1L + 0.25, len3, 2.0, t, treeSeed + 0.2);
    treeMask += branch(suv, tipR, bAngle1R - 0.25, len3, 2.0, t, treeSeed + 0.4);
    treeMask += branch(suv, tipR, bAngle1R + 0.35, len3, 2.0, t, treeSeed + 0.5);

    // Bioluminescent spots at tips
    float spotR = 0.006;
    float totalGrowth = clamp(t - treeSeed * 2.0 - 2.4, 0.0, 1.0);
    treeglow += totalGrowth * (1.0 - smoothstep(0.0, spotR, length(suv - tipL)));
    treeglow += totalGrowth * (1.0 - smoothstep(0.0, spotR, length(suv - tipR)));
  }

  treeMask = clamp(treeMask, 0.0, 1.0);
  treeglow = clamp(treeglow, 0.0, 1.0);

  col = mix(col, branchColor, treeMask * 0.6);
  col += glowColor * treeMask * 0.8;
  col += tipGlow * treeglow * 3.0;

  // Floating dust particles
  float dust = 0.0;
  for (int j = 0; j < 20; j++) {
    float fj = float(j);
    vec2 dSeed = hash2(vec2(fj * 7.3, 1.0));
    vec2 dPos = fract(dSeed + vec2(0.0, t * (0.01 + dSeed.x * 0.03)));
    dPos.x *= ar;
    float dDist = length(suv - dPos);
    dust += (1.0 - smoothstep(0.0, 0.004, dDist)) * dSeed.y;
  }
  col += tipGlow * dust * 1.5;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.4;
  col *= clamp(vignette, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`,Fe=`// ── INTERIOR BIOME: FREQUENCY ROOM ──
// 3D oscilloscope waveforms exploded in space — teal + ultraviolet

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2((uv.x - 0.5) * ar, uv.y - 0.5);

  // Background
  vec3 bgDeep = vec3(0.01, 0.03, 0.08);
  vec3 col = bgDeep;

  // Draw waveform layers — each at a different Y offset and frequency
  vec3 teal    = vec3(0.00, 0.85, 0.80);
  vec3 uv_color= vec3(0.55, 0.00, 1.00); // ultraviolet
  vec3 cyan    = vec3(0.20, 1.00, 0.90);
  vec3 white   = vec3(0.90, 0.95, 1.00);

  float waveSum = 0.0;
  float glowSum = 0.0;

  // 7 oscilloscope lines at different frequencies + phases
  for (int i = 0; i < 7; i++) {
    float fi = float(i);

    float yOffset   = -0.35 + fi * 0.12;
    float freq1     = 3.0 + fi * 1.7;
    float freq2     = 7.0 + fi * 2.3;
    float speed1    = 0.8 + fi * 0.3;
    float speed2    = 1.3 + fi * 0.2;
    float amplitude = 0.04 + fi * 0.005;

    // Compound waveform: two sine waves beating together
    float wave = sin(suv.x * freq1 + t * speed1) * amplitude
               + sin(suv.x * freq2 - t * speed2 + fi * 1.1) * amplitude * 0.5;

    float dy = suv.y - yOffset - wave;

    float lineW = 0.004;
    float glowW = 0.025;
    float line = 1.0 - smoothstep(0.0, lineW, abs(dy));
    float glow = 1.0 - smoothstep(0.0, glowW, abs(dy));

    // Alternate color between teal and ultraviolet
    vec3 waveColor = mix(teal, uv_color, fi / 7.0);
    vec3 glowColor = mix(cyan, uv_color * 0.5, fi / 7.0);

    col += waveColor * line * 1.5;
    col += glowColor * glow * 0.15;

    waveSum += line;
    glowSum += glow;
  }

  // Lissajous figure overlay — infinity loop shape in center
  float lx = sin(t * 2.0) * 0.25;
  float ly = sin(t * 1.0 + 1.5708) * 0.12;
  vec2 lissPos = vec2(lx, ly);
  float lissD = length(suv - lissPos);
  float lissCursor = 1.0 - smoothstep(0.0, 0.008, lissD);
  float lissGlow   = 1.0 - smoothstep(0.0, 0.04, lissD);
  col += white * lissCursor * 2.0;
  col += cyan  * lissGlow   * 0.4;

  // Frequency grid — thin horizontal reference lines
  float gridY = mod(uv.y * 10.0, 1.0);
  float gridLine = 1.0 - smoothstep(0.0, 0.01, abs(gridY - 0.5));
  col += vec3(0.02, 0.05, 0.10) * gridLine;

  // Vertical scan line (moving)
  float scanX = fract(t * 0.3) * ar - ar * 0.5;
  float scanD = abs(suv.x - scanX);
  float scanLine = (1.0 - smoothstep(0.0, 0.003, scanD)) * 0.3;
  col += teal * scanLine;
  col += teal * (1.0 - smoothstep(0.0, 0.05, scanD)) * 0.05;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.3;
  col *= clamp(vignette, 0.0, 1.0);

  // CRT scanline texture
  float scanRow = sin(uv.y * uResolution.y * 1.5 + t * 0.5) * 0.015;
  col -= scanRow;

  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
}
`,Le=`// ── INTERIOR BIOME: THE ARCHIVE WITHIN ──
// Floating code glyphs in slow rotation — amber + dark red-black

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float hash1(float n) { return fract(sin(n) * 43758.5453123); }
vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),
                        dot(p, vec2(269.5, 183.3)))) * 43758.5453123);
}

// Draw a single glyph as a series of line segments approximating letters
float glyph(vec2 uv, int glyphId) {
  float g = 0.0;
  float w = 0.012;

  if (glyphId == 0) {
    // "{" bracket
    g += 1.0 - smoothstep(0.0, w, length(uv - vec2(0.0, 0.3)));
    g += 1.0 - smoothstep(0.0, w * 0.5, abs(uv.x + 0.2) + max(0.0, abs(uv.y) - 0.25));
  } else if (glyphId == 1) {
    // "/" slash
    float d = abs((uv.x + uv.y * 0.5) / 1.118);
    g += 1.0 - smoothstep(0.0, w, d) * step(-0.3, uv.y) * step(uv.y, 0.3);
    g = 1.0 - smoothstep(0.0, w, d);
  } else if (glyphId == 2) {
    // "0" zero
    float ring = abs(length(uv * vec2(1.0, 1.6)) - 0.28);
    g = 1.0 - smoothstep(0.0, w, ring);
  } else if (glyphId == 3) {
    // "|" pipe
    g = 1.0 - smoothstep(0.0, w, abs(uv.x));
  } else if (glyphId == 4) {
    // ">" chevron
    float d1 = abs(uv.x - abs(uv.y) * 0.8);
    g = 1.0 - smoothstep(0.0, w, d1);
  } else {
    // "-" dash
    float d = max(abs(uv.y), abs(uv.x) - 0.3);
    g = 1.0 - smoothstep(0.0, w, d);
  }
  return clamp(g, 0.0, 1.0);
}

float glyphAt(vec2 uv, vec2 center, float size, int id, float alpha) {
  vec2 local = (uv - center) / size;
  if (abs(local.x) > 0.5 || abs(local.y) > 0.5) return 0.0;
  return glyph(local, id) * alpha;
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2(uv.x * ar, uv.y);
  float t = uTime;

  // Background — very dark red-brown
  vec3 bgColor  = vec3(0.04, 0.01, 0.01);
  vec3 midColor = vec3(0.08, 0.03, 0.02);

  float bgN = fract(sin(dot(floor(uv * 50.0), vec2(12.9, 78.2))) * 4375.8);
  vec3 col = mix(bgColor, midColor, bgN * 0.3);

  // Amber glow from center — like an old lamp in a library
  float lampDist = length(uv - vec2(0.5));
  vec3 ambientGlow = vec3(0.9, 0.5, 0.1) * (0.04 / (lampDist * lampDist + 0.1));
  col += ambientGlow * 0.5;

  // Drifting glyph particles — 40 floating code characters
  vec3 glyphColor = vec3(0.9, 0.55, 0.1);   // amber
  vec3 glyphDim   = vec3(0.35, 0.15, 0.02); // dim orange

  for (int i = 0; i < 40; i++) {
    float fi = float(i);
    vec2 seed = hash2(vec2(fi, 0.0));

    // Non-uniform floating speed and drift direction
    float speed  = 0.005 + seed.x * 0.012;
    float drift  = (seed.y - 0.5) * 0.002;
    float yPhase = t * speed + seed.x * 7.3;

    // Wrap position
    float px = mod(seed.x * ar + drift * t, ar);
    float py = 1.0 - mod(yPhase, 1.0); // fall upward

    // Slow orbital rotation per glyph in local space
    float rotAngle = t * (0.1 + seed.x * 0.2) + seed.y * 6.28;
    vec2 offset = vec2(cos(rotAngle), sin(rotAngle)) * 0.003 * fi;
    vec2 glyphPos = vec2(px, py) + offset;

    // Fade in / out with distance from center
    float distCenter = length(vec2(px / ar, py) - 0.5);
    float alpha = (1.0 - smoothstep(0.2, 0.5, distCenter)) * (0.4 + seed.y * 0.6);

    // Choose glyph type
    int glyphId = int(mod(fi * 3.7, 6.0));

    float size = 0.02 + seed.x * 0.025;
    float g = glyphAt(suv, glyphPos, size, glyphId, alpha);

    vec3 gc = mix(glyphDim, glyphColor, alpha);
    col += gc * g;
    // Glow halo
    float haloDist = length(suv - glyphPos);
    col += glyphColor * (1.0 - smoothstep(0.0, 0.05, haloDist)) * alpha * 0.15;
  }

  // Horizontal depth lines — like shelves in a library
  for (int k = 0; k < 5; k++) {
    float fy = 0.2 + float(k) * 0.16;
    float lineY = abs(uv.y - fy);
    float shelf = (1.0 - smoothstep(0.0, 0.003, lineY)) * 0.2;
    col += vec3(0.3, 0.12, 0.02) * shelf;
  }

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.6;
  col *= clamp(vignette, 0.0, 1.0);

  // Film grain
  float grain = hash1(uv.x * 1097.3 + uv.y * 863.2 + t * 97.1) * 0.05;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`,je={neuralGrid:K,liquidMetal:_e,digitalGarden:Oe,frequencyRoom:Fe,archiveWithin:Le},Be=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function ze({interiorType:e,visible:s}){const{viewport:t}=$(),i=a.useRef(),r=a.useMemo(()=>({uTime:{value:0},uResolution:{value:new Y(window.innerWidth,window.innerHeight)}}),[]),o=je[e]||K;return N(l=>{i.current&&(r.uTime.value=l.clock.elapsedTime)}),s?n.jsxs("mesh",{position:[0,0,-3],renderOrder:-1,children:[n.jsx("planeGeometry",{args:[t.width*2.5,t.height*2.5,1,1]}),n.jsx("shaderMaterial",{ref:i,vertexShader:Be,fragmentShader:o,uniforms:r,depthWrite:!1,depthTest:!1})]}):null}function Ve({position:e,rotation:s,hovered:t}){const i=a.useMemo(()=>new ve(new fe(1.82,1.12)),[]),r=a.useMemo(()=>new H({color:"#C9A84C",transparent:!0,opacity:.3}),[]);return N(()=>{r&&(r.opacity=t?.8:.3)}),n.jsx("lineSegments",{position:e,rotation:s,geometry:i,material:r})}function Ge({position:e,rotation:s,color:t,label:i,visible:r}){const o=a.useRef(),[l,c]=a.useState(!1),u=a.useRef(),p=a.useMemo(()=>new C(e[0],e[1],e[2]+1.2),[e]),h=a.useMemo(()=>new C(...e),[e]),m=a.useMemo(()=>new C(1.4,1.4,1.4),[]),d=a.useMemo(()=>new C(1,1,1),[]);N(v=>{if(!o.current||!r)return;const g=v.clock.elapsedTime;l?(o.current.position.lerp(p,.08),o.current.rotation.y+=(0-o.current.rotation.y)*.1,o.current.scale.lerp(m,.08)):(o.current.position.lerp(h,.06),o.current.scale.lerp(d,.06)),u.current&&(u.current.uniforms.uTime.value=g)});const b=a.useMemo(()=>({uTime:{value:0},uColor:{value:new M(t)}}),[t]),x=`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,w=`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      // Scanline
      float scanline = sin(vUv.y * 120.0 - uTime * 0.3) * 0.03 + 0.97;
      // Vignette
      float vignette = 1.0 - length(vUv - 0.5) * 1.2;
      vignette = clamp(vignette, 0.3, 1.0);
      // Base color (simulated screenshot)
      vec3 col = uColor * scanline * vignette;
      // Subtle grid
      float gx = step(0.98, fract(vUv.x * 20.0));
      float gy = step(0.98, fract(vUv.y * 14.0));
      col = mix(col, col * 0.7, max(gx, gy) * 0.5);
      gl_FragColor = vec4(col, 0.92);
    }
  `;return r?n.jsxs("group",{children:[n.jsxs("mesh",{ref:o,position:e,rotation:s,onPointerOver:()=>c(!0),onPointerOut:()=>c(!1),children:[n.jsx("planeGeometry",{args:[1.8,1.1,1,1]}),n.jsx("shaderMaterial",{ref:u,vertexShader:x,fragmentShader:w,uniforms:b,transparent:!0,roughness:.1,metalness:.3})]}),n.jsx(Ve,{position:e,rotation:s,hovered:l})]}):null}function z({position:e,label:s,visible:t,onClick:i}){const r=a.useRef(),o=a.useRef(),[l,c]=a.useState(!1),u=a.useRef(0),p=a.useMemo(()=>new ue(.18,0),[]);return N(h=>{if(!r.current||!t)return;const m=h.clock.elapsedTime;r.current.rotation.y+=.012,r.current.rotation.x=Math.sin(m*.5)*.15;const d=l?1:0;if(u.current+=(d-u.current)*.08,r.current.material&&(r.current.material.emissiveIntensity=u.current*1.5),o.current){const b=l?1+Math.sin(m*4)*.06:0;o.current.scale.setScalar(b+(l?1:0)),o.current.material.opacity=l?.6:0}}),t?n.jsxs("group",{position:e,children:[n.jsx("mesh",{ref:r,geometry:p,onPointerOver:()=>c(!0),onPointerOut:()=>c(!1),onClick:i,children:n.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:0,metalness:.9,roughness:.1})}),n.jsxs("mesh",{ref:o,rotation:[Math.PI/2,0,0],children:[n.jsx("ringGeometry",{args:[.22,.28,32]}),n.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:0,side:U,depthWrite:!1})]})]}):null}function We({project:e,phase:s,phaseProgress:t,onReadMore:i}){const r=a.useRef(),o=s==="inside"||s==="escape",l=a.useMemo(()=>[{position:[-2,.5,-1.5],rotation:[0,.15,.05],color:_(e.orbColor2)},{position:[1.8,.2,-2.5],rotation:[0,-.2,-.03],color:_(e.orbColor1)},{position:[-1.2,-.8,-3.5],rotation:[.05,.1,0],color:_(e.orbColor2)},{position:[.5,1.1,-2],rotation:[-.05,-.15,.06],color:_(e.orbColor1)}],[e]),c=o&&t>.92;return N(()=>{r.current&&(r.current.visible=o)}),n.jsxs("group",{ref:r,visible:o,children:[n.jsx(ze,{interiorType:e.interiorType,visible:o}),l.map((u,p)=>n.jsx(Ge,{position:u.position,rotation:u.rotation,color:u.color,label:`${e.title} — IMG ${p+1}`,visible:o&&t>.05},p)),n.jsx(z,{position:[-.6,-1.2,-1.8],label:"VIEW LIVE",visible:c,onClick:()=>window.open(e.liveUrl,"_blank")}),n.jsx(z,{position:[.6,-1.2,-1.8],label:"READ MORE",visible:c,onClick:i}),n.jsx("pointLight",{position:[0,1,-1],intensity:1.5,color:e.orbColor2,distance:8}),n.jsx("ambientLight",{intensity:.3})]})}function _(e){return`#${e.clone().multiplyScalar(.5).getHexString()}`}const P=["THE BRIEF","THE PROCESS","THE SOLUTION","THE IMPACT","THE LEARNING"],Ue=["brief","process","solution","impact","learning"];function qe({project:e,onClose:s}){const t=a.useRef(),i=a.useRef(),[r,o]=a.useState(0),[l,c]=a.useState(!1),u=a.useRef(null);a.useEffect(()=>{t.current&&O.fromTo(t.current,{y:"100%",opacity:0},{y:"0%",opacity:1,duration:.6,ease:"power3.out"})},[]);const p=a.useCallback(()=>{l||(c(!0),O.to(t.current,{y:"100%",opacity:0,duration:.5,ease:"power3.in",onComplete:s}))},[l,s]),h=a.useCallback(()=>{r<P.length-1&&o(f=>f+1)},[r]),m=a.useCallback(()=>{r>0&&o(f=>f-1)},[r]);a.useEffect(()=>{const f=y=>{y.key==="ArrowRight"&&h(),y.key==="ArrowLeft"&&m(),y.key==="Escape"&&p()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[h,m,p]);const d=f=>{u.current=f.touches[0].clientX},b=f=>{if(u.current===null)return;const y=f.changedTouches[0].clientX-u.current;y<-50&&h(),y>50&&m(),u.current=null};a.useEffect(()=>{i.current&&O.fromTo(i.current,{x:30,opacity:0},{x:0,opacity:1,duration:.4,ease:"power2.out"})},[r]);const x=(e==null?void 0:e.panels)||{},w=Ue[r],v=P[r],g=x[w]||"[PLACEHOLDER: Fill case study content]";return n.jsxs("div",{ref:t,className:"project-overlay",onTouchStart:d,onTouchEnd:b,style:{transform:"translateY(100%)"},children:[n.jsx("div",{className:"project-overlay__glass"}),n.jsx("button",{className:"project-overlay__close",onClick:p,"aria-label":"Close case study",children:n.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("line",{x1:"4",y1:"4",x2:"20",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),n.jsx("line",{x1:"20",y1:"4",x2:"4",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}),n.jsxs("div",{className:"project-overlay__inner",children:[n.jsxs("div",{className:"project-overlay__left",children:[n.jsxs("div",{className:"overlay-project-number",children:["0",((e==null?void 0:e.index)??0)+1]}),n.jsx("h2",{className:"overlay-project-title",children:e==null?void 0:e.title}),n.jsx("p",{className:"overlay-project-role",children:e==null?void 0:e.role}),n.jsx("p",{className:"overlay-project-year",children:e==null?void 0:e.year}),n.jsx("div",{className:"overlay-project-tags",children:((e==null?void 0:e.tags)||[]).map(f=>n.jsx("span",{className:"overlay-tag",children:f},f))}),n.jsx("div",{className:"overlay-dots",children:P.map((f,y)=>n.jsx("button",{className:`overlay-dot ${y===r?"active":""}`,onClick:()=>o(y),"aria-label":`Go to ${P[y]}`},y))})]}),n.jsxs("div",{className:"project-overlay__right",children:[n.jsxs("div",{ref:i,className:"overlay-panel",children:[n.jsxs("div",{className:"overlay-panel__header",children:[n.jsxs("span",{className:"overlay-panel__number",children:["0",r+1," / 0",P.length]}),n.jsx("h3",{className:"overlay-panel__title",children:v})]}),n.jsx("p",{className:"overlay-panel__body",children:g}),w==="impact"&&(e==null?void 0:e.metric)&&n.jsxs("div",{className:"overlay-metric",children:[n.jsx("span",{className:"overlay-metric__number",children:e.metric}),n.jsx("span",{className:"overlay-metric__desc",children:e.metricDesc})]})]}),n.jsxs("div",{className:"overlay-nav",children:[n.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--prev ${r===0?"disabled":""}`,onClick:m,disabled:r===0,"aria-label":"Previous panel",children:"←"}),n.jsx("span",{className:"overlay-nav__label",children:v}),n.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--next ${r===P.length-1?"disabled":""}`,onClick:h,disabled:r===P.length-1,"aria-label":"Next panel",children:"→"})]})]})]})]})}const He=`// ── STAR FIELD VERTEX SHADER ──
// pos → each vertex is a star point. warpMode stretches them to lines.

attribute float aSize;
attribute float aBrightness;

uniform float uTime;
uniform float uWarpStrength; // 0 = static points, 1 = full warp lines
uniform float uWarpSeed;    // per-star variation

varying float vBrightness;
varying float vWarp;

void main() {
  vBrightness = aBrightness;
  vWarp = uWarpStrength;

  vec3 pos = position;

  // Warp: streak stars backward along Z
  if (uWarpStrength > 0.0) {
    float stretch = uWarpStrength * 3.0;
    pos.z -= stretch * (0.5 + uWarpSeed * 0.5);
  }

  // Twinkle — subtle position jitter
  float twinkle = sin(uTime * (1.5 + aBrightness * 2.0) + uWarpSeed * 6.28) * 0.002;
  pos.x += twinkle;
  pos.y += twinkle * 0.7;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPosition.z) * (uWarpStrength > 0.5 ? 0.5 : 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`,$e=`// ── STAR FIELD FRAGMENT SHADER ──

varying float vBrightness;
varying float vWarp;

void main() {
  // Round star disc
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // Static star: soft circular glow
  float star = 1.0 - smoothstep(0.0, 0.5, d);
  star = pow(star, 2.5) * vBrightness;

  // Warp: elongated streak (horizontal streak on the gl_PointCoord plane)
  // When warpStrength is high, stars become horizontal streaks
  float warpStar = (1.0 - smoothstep(0.0, 0.5, abs(uv.y))) // narrow vertical
                 * (1.0 - smoothstep(0.0, 0.5, abs(uv.x) * (1.0 - vWarp * 0.9)));
  warpStar *= vBrightness;

  float brightness = mix(star, warpStar, vWarp);

  // Color — slightly warm white for near stars, blue for far
  vec3 color = mix(vec3(0.85, 0.90, 1.00), vec3(1.00, 0.98, 0.92), vBrightness);

  // Warp color shift — cyan tinge during warp
  color = mix(color, vec3(0.60, 0.90, 1.00), vWarp * 0.6);

  gl_FragColor = vec4(color * brightness, brightness);
}
`;function Ye({warpStrength:e,isMobile:s}){const t=s?1e3:3e3,i=a.useRef(),{positions:r,sizes:o,brightnesses:l,seeds:c}=a.useMemo(()=>{const h=new Float32Array(t*3),m=new Float32Array(t),d=new Float32Array(t),b=new Float32Array(t);for(let x=0;x<t;x++)h[x*3]=(Math.random()-.5)*300,h[x*3+1]=(Math.random()-.5)*300,h[x*3+2]=-30-Math.random()*200,m[x]=.5+Math.random()*2.5,d[x]=.3+Math.random()*.7,b[x]=Math.random();return{positions:h,sizes:m,brightnesses:d,seeds:b}},[t]),u=a.useMemo(()=>({uTime:{value:0},uWarpStrength:{value:0},uWarpSeed:{value:0}}),[]),p=a.useMemo(()=>new V({vertexShader:He,fragmentShader:$e,uniforms:u,transparent:!0,blending:W,depthWrite:!1,vertexColors:!1}),[u]);return N(h=>{u.uTime.value=h.clock.elapsedTime,u.uWarpStrength.value+=(e-u.uWarpStrength.value)*.04}),n.jsx("points",{ref:i,material:p,children:n.jsxs("bufferGeometry",{children:[n.jsx("bufferAttribute",{attach:"attributes-position",count:t,array:r,itemSize:3}),n.jsx("bufferAttribute",{attach:"attributes-aSize",count:t,array:o,itemSize:1}),n.jsx("bufferAttribute",{attach:"attributes-aBrightness",count:t,array:l,itemSize:1}),n.jsx("bufferAttribute",{attach:"attributes-uWarpSeed",count:t,array:c,itemSize:1})]})})}function Xe({visible:e,position:s}){const t=a.useRef();return N(i=>{if(!t.current||!e)return;const r=i.clock.elapsedTime;t.current.rotation.y+=.008,t.current.rotation.x=Math.sin(r*.4)*.06}),e?n.jsxs("mesh",{ref:t,position:s,children:[n.jsx("coneGeometry",{args:[.08,.25,8]}),n.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:.6,metalness:.9,roughness:.1})]}):null}function Qe({path:e,visible:s,opacity:t}){const i=a.useRef(),r=a.useMemo(()=>{const l=[];for(let c=0;c<=50;c++)l.push(e.getPoint(c/50));return l},[e]),o=a.useMemo(()=>new q().setFromPoints(r),[r]);return N(()=>{i.current&&(i.current.opacity+=(s?t:0-i.current.opacity)*.03)}),n.jsx("line",{geometry:o,children:n.jsx("lineBasicMaterial",{ref:i,color:"#C9A84C",transparent:!0,opacity:0,linewidth:1})})}function Ke({scrollProgress:e,currentProjectIndex:s,currentPhase:t}){const{camera:i}=$(),r=a.useRef(new C(0,0,-10)),o=a.useRef([]);return a.useEffect(()=>{const l=[];R.forEach((c,u)=>{const p=u>0?R[u-1].orbPosition:null;l.push(X(c,p))}),o.current=l},[]),N(()=>{if(o.current.length===0)return;const l=R.length,c=1/l,u=Math.min(Math.floor(e/c),l-1),p=(e-u*c)/c,h=o.current[u];if(!h)return;const m=h.getPoint(Math.min(p,.99));i.position.lerp(m,.08);const d=R[u];r.current.lerp(d.orbPosition,.05),i.lookAt(r.current)}),null}function Ze({phase:e,phaseProgress:s}){a.useRef({x:0,y:0});const t=a.useMemo(()=>new Y(0,0),[]);return N(()=>{let i=0;e==="descent"&&(s<.5?i=s*2*.018:i=(1-s)*2*.018);const r=t.x,o=r+(i-r)*.15;t.set(o,o*.3)}),n.jsx(pe,{children:n.jsx(ge,{blendFunction:be.NORMAL,offset:t})})}function Je({project:e,visible:s,phaseProgress:t}){const i=s&&t>.1;return n.jsxs("div",{className:`orbit-meta ${i?"orbit-meta--visible":""}`,children:[n.jsxs("div",{className:"orbit-meta__number",style:{transitionDelay:"0ms"},children:["0",e.index+1]}),n.jsx("h2",{className:"orbit-meta__title",style:{transitionDelay:"80ms"},children:e.title}),n.jsx("p",{className:"orbit-meta__role",style:{transitionDelay:"160ms"},children:e.role}),n.jsx("p",{className:"orbit-meta__year",style:{transitionDelay:"240ms"},children:e.year}),n.jsx("div",{className:"orbit-meta__tags",style:{transitionDelay:"320ms"},children:e.tags.map(r=>n.jsx("span",{className:"orbit-tag",children:r},r))}),n.jsx("p",{className:"orbit-meta__pull-quote",style:{transitionDelay:"400ms"},children:e.pullQuote})]})}function en({project:e,phase:s,phaseProgress:t}){const i=s==="inside",r=i&&t>.12,o=i&&t>.38,l=i&&t>.56,c=i&&t>.76,u=a.useMemo(()=>{if(!(e!=null&&e.metric))return"";const m=e.metric.replace(/[^\d.]/g,""),d=e.metric.replace(/[\d.]/g,"");return{digits:parseFloat(m),suffix:d}},[e]),[p,h]=a.useState(0);return a.useEffect(()=>{if(!l||!u.digits)return;const m=performance.now(),d=1500,b=x=>{const w=Math.min((x-m)/d,1),v=1-Math.pow(1-w,3);h(Math.round(v*u.digits)),w<1&&requestAnimationFrame(b)};requestAnimationFrame(b)},[l,u]),n.jsxs("div",{className:"narrative-blocks",children:[n.jsx("div",{className:`narrative-block narrative-block--a ${r?"visible":""}`,children:e==null?void 0:e.verb}),n.jsx("div",{className:`narrative-block narrative-block--b ${o?"visible":""}`,children:e==null?void 0:e.challenge}),n.jsxs("div",{className:`narrative-block narrative-block--c ${l?"visible":""}`,children:[n.jsxs("span",{className:"narrative-metric",children:[p,u.suffix]}),n.jsx("span",{className:"narrative-metric-desc",children:e==null?void 0:e.metricDesc})]}),n.jsxs("div",{className:`narrative-block narrative-block--d ${c?"visible":""}`,children:['"',e==null?void 0:e.reflection,'"']})]})}function nn({visible:e,onComplete:s}){const t=a.useRef(),i=a.useRef();return a.useEffect(()=>{if(!e||!t.current)return;const o=Array.from(t.current.querySelectorAll(".entry-title__letter"));O.timeline({onComplete:s}).fromTo(o,{opacity:0,scale:.4,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:.06,stagger:{from:"center",amount:.8},ease:"power2.out"}).fromTo(i.current,{opacity:0,y:20},{opacity:1,y:0,duration:.8,ease:"power2.out"},"-=0.3").to([t.current,i.current],{delay:1.2,opacity:0,filter:"blur(8px)",y:-20,scale:1.05,duration:.6,stagger:.1,ease:"power3.in"})},[e,s]),e?n.jsxs("div",{className:"entry-title-container",children:[n.jsx("h1",{ref:t,className:"entry-title",children:"III. THE CARTOGRAPHY".split("").map((o,l)=>n.jsx("span",{className:"entry-title__letter",children:o===" "?" ":o},l))}),n.jsx("p",{ref:i,className:"entry-subtitle",children:"WORLDS I HAVE BUILT."})]}):null}function tn({projectIndex:e,phase:s}){const t=s==="escape"&&e<R.length-1,i=R[e+1];return n.jsx("div",{className:`transit-caption ${t?"visible":""}`,children:t&&i&&`PROJECT ${e+1} OF ${R.length} — ${i.title} AHEAD`})}function on({scrollProgress:e,projectIndex:s,phase:t,totalProjects:i}){const r=e,o=t==="inside"||t==="descent";return n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:`cartography-realm-label ${o?"dimmed":""}`,children:[n.jsx("div",{className:"realm-label__title",children:"III. THE CARTOGRAPHY"}),n.jsxs("div",{className:"realm-label__world",children:["WORLD ",s+1," / ",i]})]}),n.jsxs("div",{className:"cartography-progress-bar",children:[n.jsx("span",{className:"progress-label progress-label--top",children:"START"}),n.jsx("div",{className:"progress-track",children:n.jsx("div",{className:"progress-dot",style:{top:`${r*100}%`}})}),n.jsx("span",{className:"progress-label progress-label--bottom",children:"END"})]}),n.jsxs("div",{className:`scroll-hint ${["orbit","escape"].includes(t)?"visible":""}`,children:[n.jsx("span",{children:t==="orbit"?"SCROLL TO DESCEND":"SCROLL TO CONTINUE"}),n.jsx("div",{className:"scroll-hint__arrow"})]})]})}function rn({scrollProgress:e,phase:s,phaseProgress:t,projectIndex:i,warpActive:r,finalMap:o,showSpacecraft:l,onReadMore:c,isMobile:u,mouseNDC:p}){var m;const h=a.useMemo(()=>R.map((d,b)=>{const x=b>0?R[b-1].orbPosition:null;return X(d,x)}),[]);return n.jsxs(n.Fragment,{children:[n.jsx(xe,{makeDefault:!0,position:[0,2,50],fov:55}),n.jsx(Ke,{scrollProgress:e,currentProjectIndex:i,currentPhase:s}),n.jsx(Ye,{warpStrength:r?1:0,isMobile:u}),n.jsx("fog",{attach:"fog",color:"#02040A",near:40,far:120}),n.jsx("ambientLight",{intensity:.08}),n.jsx("pointLight",{position:[0,30,-20],intensity:.5,color:"#3366ff"}),R.map((d,b)=>n.jsx(Ie,{project:d,phase:b===i?s:"idle",phaseProgress:b===i?t:0,mouseNDC:p,isActive:b===i,isMobile:u},d.id)),n.jsx(We,{project:R[i],phase:s,phaseProgress:t,onReadMore:c}),o&&h.map((d,b)=>n.jsx(Qe,{path:d,visible:o,opacity:.5},b)),n.jsx(Xe,{visible:o||e<.05,position:o?new C(12,4,-15):(m=R[i])==null?void 0:m.orbPosition.clone().add(new C(6,2,8))}),!u&&n.jsx(Ze,{phase:s,phaseProgress:t})]})}function vn(){const e=a.useRef(null),s=de(D=>D.performanceLow),[t,i]=a.useState(0),[r,o]=a.useState("approach"),[l,c]=a.useState(0),[u,p]=a.useState(0),[h,m]=a.useState(0),[d,b]=a.useState(!1),[x,w]=a.useState(!1),[v,g]=a.useState(!1),[f,y]=a.useState(!1),[T,k]=a.useState(null),[Z,J]=a.useState({x:0,y:0});Re({phase:r,projectIndex:u,phaseProgress:l,zoneProgress:h}),a.useEffect(()=>{const D=I=>{J({x:I.clientX/window.innerWidth*2-1,y:-(I.clientY/window.innerHeight*2-1)})};return window.addEventListener("mousemove",D,{passive:!0}),()=>window.removeEventListener("mousemove",D)},[]),a.useEffect(()=>{if(!e.current)return;const D=me.create({trigger:e.current,start:"top top",end:"bottom bottom",scrub:1.5,onEnter:()=>b(!0),onUpdate:I=>{const F=I.progress;i(F);const{projectIndex:te,phase:L,phaseProgress:oe,zoneProgress:re}=Te(F,R.length);p(te),o(L),c(oe),m(re),y(L==="escape"),g(F>.97)}});return()=>D.kill()},[]);const ee=a.useCallback(()=>{k(R[u])},[u]),ne=a.useCallback(()=>{k(null)},[]);return n.jsx("div",{ref:e,className:"cartography-scroll-space",children:n.jsxs("div",{className:"cartography-sticky",children:[n.jsx(he,{gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},dpr:s?[1,1]:[1,1.5],style:{position:"absolute",inset:0,background:"#02040A"},children:n.jsx(rn,{scrollProgress:t,phase:r,phaseProgress:l,projectIndex:u,warpActive:f,finalMap:v,showSpacecraft:!0,onReadMore:ee,isMobile:s,mouseNDC:Z})}),d&&!x&&n.jsx(nn,{visible:d,onComplete:()=>w(!0)}),n.jsx(Je,{project:R[u],visible:r==="orbit",phaseProgress:l}),n.jsx(en,{project:R[u],phase:r,phaseProgress:l}),n.jsx(tn,{projectIndex:u,phase:r}),v&&n.jsx("div",{className:"final-map-text",children:"EVERY WORLD BEGAN AS AN EMPTY CANVAS."}),n.jsx(on,{scrollProgress:t,projectIndex:u,phase:r,totalProjects:R.length}),T&&n.jsx(qe,{project:T,onClose:ne})]})})}export{vn as default};
