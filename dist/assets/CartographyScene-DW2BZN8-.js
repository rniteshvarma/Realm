import{r,K as R,d as C,e as N,N as ae,h as z,n as G,a as M,w as se,z as ie,i as U,D as q,j as n,l as le,B as H,L as $,U as ce,u as Y,V as X,O as ue,W as ve,f as fe,g as L,b as de,c as me,S as he,C as pe,X as ge}from"./index-kBNIGw7Z.js";import{E as ye,C as be,B as xe}from"./ChromaticAberration-i0-cQeYs.js";import{T as we,P as Ce}from"./PerspectiveCamera-DDNc2iH6.js";import"./Fbo-B_2XY8Rx.js";const B=[174,285,396,417,528],Re=[{type:"arpeggio",note:174,vol:.03},{type:"pad",note:285,vol:.025},{type:"pulse",note:396,vol:.02},{type:"shimmer",note:2e3,vol:.015},{type:"sub",note:40,vol:.018}];function A(){return R.ctx}function V(){const e=A();if(!e)return;const s=e.sampleRate*.65,o=e.createBuffer(1,s,e.sampleRate),i=o.getChannelData(0);for(let c=0;c<s;c++)i[c]=(Math.random()*2-1)*Math.pow(1-c/s,1.2);const a=e.createBufferSource();a.buffer=o;const t=e.createBiquadFilter();t.type="lowpass",t.frequency.setValueAtTime(4e3,e.currentTime),t.frequency.exponentialRampToValueAtTime(100,e.currentTime+.6),t.Q.value=1.5;const l=e.createGain();l.gain.setValueAtTime(.3,e.currentTime),l.gain.linearRampToValueAtTime(0,e.currentTime+.65),a.connect(t),t.connect(l),R.reverbNode?l.connect(R.reverbNode):l.connect(e.destination),a.start()}function Se(e){const s=A();if(!s)return null;const o=s.createOscillator();o.type="sine",o.frequency.value=e;const i=s.createGain();return i.gain.value=0,o.connect(i),R.reverbNode?i.connect(R.reverbNode):i.connect(R.masterGain||s.destination),o.start(),{osc:o,gain:i}}function Te(e){const s=A();if(!s)return null;const o=Re[e];if(!o)return null;const i=s.createGain();i.gain.value=0;const a=[];if(o.type==="arpeggio"){const t=s.createOscillator(),l=s.createOscillator();t.type="sine",l.type="sine",t.frequency.value=o.note,l.frequency.value=o.note*1.5;const c=s.createOscillator();c.type="square",c.frequency.value=4;const u=s.createGain();u.gain.value=.5,c.connect(u),u.connect(t.frequency),t.connect(i),l.connect(i),t.start(),l.start(),c.start(),a.push(t,l,c)}else if(o.type==="pad")[1,1.25,1.5,1.875].forEach(l=>{const c=s.createOscillator();c.type="triangle",c.frequency.value=o.note*l,c.connect(i),c.start(),a.push(c)});else if(o.type==="pulse"){const t=s.createOscillator();t.type="sine",t.frequency.value=o.note;const l=s.createOscillator();l.type="sine",l.frequency.value=.5;const c=s.createGain();c.gain.value=.5,l.connect(c),c.connect(i.gain),t.connect(i),t.start(),l.start(),a.push(t,l)}else if(o.type==="shimmer"){const t=s.createOscillator();t.type="triangle",t.frequency.value=o.note;const l=s.createOscillator();l.type="sine",l.frequency.value=5.5;const c=s.createGain();c.gain.value=20,l.connect(c),c.connect(t.frequency),t.connect(i),t.start(),l.start(),a.push(t,l)}else if(o.type==="sub"){const t=s.createOscillator();t.type="sine",t.frequency.value=o.note,t.connect(i),t.start(),a.push(t)}return R.reverbNode?i.connect(R.reverbNode):i.connect(R.masterGain||s.destination),{gain:i,nodes:a,config:o}}function Ee({phase:e,projectIndex:s,phaseProgress:o,zoneProgress:i}){const a=r.useRef(null),t=r.useRef(null),l=r.useRef(null),c=r.useRef(-1),u=r.useRef(!1);r.useEffect(()=>{if(!R.ctx||!R._running||u.current)return;u.current=!0;const v=R.ctx;if(!v)return;const y=[110,165,220,330,440,660,880];for(let f=0;f<Math.min(y.length,12);f++){const x=1+f*2,S=R.oscillators[x];S&&S.frequency&&(S.frequency.cancelScheduledValues(v.currentTime),S.frequency.setValueAtTime(S.frequency.value,v.currentTime),S.frequency.linearRampToValueAtTime(y[f]||220,v.currentTime+4))}},[]);const h=r.useCallback((v,y)=>{const f=A();if(f){if(c.current!==v){if(a.current){const{gain:x,osc:S}=a.current;x.gain.cancelScheduledValues(f.currentTime),x.gain.linearRampToValueAtTime(0,f.currentTime+.5),setTimeout(()=>{try{S.stop()}catch{}},600),a.current=null}c.current=v,a.current=Se(B[v])}if(a.current){const x=y*.12;a.current.gain.gain.cancelScheduledValues(f.currentTime),a.current.gain.gain.setValueAtTime(a.current.gain.gain.value,f.currentTime),a.current.gain.gain.linearRampToValueAtTime(x,f.currentTime+.1)}}},[]),m=r.useRef(!1),d=r.useCallback(v=>{v>.02&&!m.current&&(m.current=!0,V())},[]),p=r.useCallback(v=>{const y=A();if(!y)return;if(a.current&&a.current.gain.gain.linearRampToValueAtTime(0,y.currentTime+.5),t.current){t.current.gain.gain.cancelScheduledValues(y.currentTime),t.current.gain.gain.linearRampToValueAtTime(t.current.config.vol,y.currentTime+1.5);return}const f=Te(v);f&&(t.current=f,f.gain.gain.linearRampToValueAtTime(f.config.vol,y.currentTime+2))},[]),b=r.useCallback(()=>{const v=A();if(v){if(m.current=!1,t.current){t.current.gain.gain.cancelScheduledValues(v.currentTime),t.current.gain.gain.linearRampToValueAtTime(0,v.currentTime+.4);const y=t.current.nodes;setTimeout(()=>{y.forEach(f=>{try{f.stop()}catch{}})},500),t.current=null}if(R.masterGain){const y=R.masterGain.gain,f=y.value;y.cancelScheduledValues(v.currentTime),y.setValueAtTime(f,v.currentTime),y.linearRampToValueAtTime(f*1.3,v.currentTime+.4),y.linearRampToValueAtTime(f,v.currentTime+1.4)}}},[]),g=r.useRef(!1),w=r.useCallback(()=>{if(g.current)return;g.current=!0;const v=A();v&&B.forEach(y=>{const f=v.createOscillator();f.type="sine",f.frequency.value=y;const x=v.createGain();x.gain.value=0,f.connect(x),R.reverbNode?x.connect(R.reverbNode):x.connect(v.destination),f.start(),x.gain.linearRampToValueAtTime(.008,v.currentTime+3),x.gain.setValueAtTime(.008,v.currentTime+30),x.gain.linearRampToValueAtTime(0,v.currentTime+35),setTimeout(()=>{try{f.stop()}catch{}},36e3)})},[]);return r.useEffect(()=>{!A()||!R._running||(l.current!==e&&(e==="escape"&&b(),l.current=e),e==="approach"?h(s,o):e==="descent"?d(o):e==="inside"&&p(s))},[e,s,o,h,d,p,b]),r.useEffect(()=>{e==="escape"&&s===4&&o>.6&&w()},[e,s,o,w]),r.useEffect(()=>()=>{if(a.current)try{a.current.osc.stop()}catch{}t.current&&t.current.nodes.forEach(v=>{try{v.stop()}catch{}})},[]),{playDescentWhoosh:V}}const T=[{index:0,id:"lighthouse",title:"LIGHTHOUSE",role:"Co-founder, Product & Engineering",year:"2023 — Present",tags:["Real-time IoT","AI Copilot","SaaS"],pullQuote:"A factory floor that talks back.",verb:"BUILT.",challenge:"Manufacturing facilities running blind — no real-time visibility into what machines are doing.",metric:"5M+",metricDesc:"events processed daily",reflection:"The hardest part wasn't the technology. It was earning trust from people who'd never used software on a factory floor.",liveUrl:"https://www.wavefuel.in",readMoreUrl:"https://www.wavefuel.in",orbRadius:1.2,orbShader:"electric",orbColor1:new N(330266),orbColor2:new N(26367),orbPosition:new C(-6,2,-20),interiorType:"neuralGrid",interiorBg:"#000D1A",frequency:174,panels:{brief:"Enterprise SaaS platform for real-time monitoring and automation across manufacturing — IoT, cloud, AI.",process:"Co-built with enterprise customers from day one. Weekly on-site sessions. Every decision validated against operational reality, not assumptions.",solution:"Lighthouse — real-time event processing at 5M+ events/day, AI copilot for conversational machine control, monitoring dashboards, OEE tracking.",impact:"5+ enterprise deployments. $20K+ ACV. 13% increase in OEE. 50–60% improvement in feature utilization.",learning:"B2B SaaS in manufacturing taught me that the interface with the most impact is often the one that gets out of the way."}},{index:1,id:"bight",title:"BIGHT",role:"Co-founder, Product & Operations",year:"2020 — 2021",tags:["EdTech","LMS","B2B SaaS"],pullQuote:"Education infrastructure for the next generation.",verb:"LAUNCHED.",challenge:"Universities managing coursework through email threads and spreadsheets.",metric:"12+",metricDesc:"engineers and designers led",reflection:'My first real lesson in the distance between "users want this" and "users will change their behavior for this."',liveUrl:"#",readMoreUrl:"#",orbRadius:.9,orbShader:"ocean",orbColor1:new N(5424),orbColor2:new N(39321),orbPosition:new C(7,-1,-22),interiorType:"digitalGarden",interiorBg:"#030D12",frequency:285,panels:{brief:"B2B SaaS LMS for universities — centralized coursework, assessment, and academic progress management.",process:"Led cross-functional team of 12+. Defined agile processes, sprint cadences, and QA standards from scratch.",solution:"Full LMS with automated grading, progress tracking, faculty tools, and university admin dashboards.",impact:"Pilot programs with universities. Automated grading reduced workflow time. Measurable improvement in university operational efficiency.",learning:"Co-founding taught me that vision is cheap. Execution is everything. The team that ships wins."}},{index:2,id:"searce-cloud",title:"CLOUD AT SCALE",role:"Project Manager, Searce",year:"2022 — 2023",tags:["AWS","GCP","Kubernetes"],pullQuote:"12 cloud projects. Zero late deliveries.",verb:"DELIVERED.",challenge:"Complex cloud migrations with misaligned client expectations and distributed teams.",metric:"100%",metricDesc:"on-time delivery rate",reflection:"Delivery is a trust game. When people believe you'll ship, they give you harder problems.",liveUrl:"#",readMoreUrl:"#",orbRadius:.75,orbShader:"lava",orbColor1:new N(1704704),orbColor2:new N(16729088),orbPosition:new C(-4,-3,-18),interiorType:"liquidMetal",interiorBg:"#010800",frequency:396,panels:{brief:"Managed 12 cloud projects in 12 months including 4 simultaneous large-scale migrations on AWS, GCP, and Kubernetes.",process:"Translated technical complexity into clear client language. Weekly alignment. Risk tracking from day one.",solution:"End-to-end project delivery framework — scope definition, execution plans, stakeholder management, escalation paths.",impact:"100% on-time delivery. Lowest escalation rate in the company. Leadership recognition.",learning:"The best project managers make complex work feel calm. Calm is a skill."}},{index:3,id:"ibm-att",title:"ENTERPRISE PROGRAMS",role:"Project Manager, IBM",year:"2020 — 2021",tags:["Agile","SAFe","Enterprise IT"],pullQuote:"Enterprise scale. Human problems.",verb:"COORDINATED.",challenge:"Multi-location AT&T programs with hundreds of stakeholders and zero tolerance for delay.",metric:"Multi-location",metricDesc:"enterprise programs delivered",reflection:"IBM is where I learned that process is not bureaucracy — it's the language that lets large teams move as one.",liveUrl:"#",readMoreUrl:"#",orbRadius:.65,orbShader:"circuit",orbColor1:new N(72193),orbColor2:new N(65416),orbPosition:new C(8,4,-25),interiorType:"archiveWithin",interiorBg:"#010510",frequency:417,panels:{brief:"Directed multiple enterprise IT programs for AT&T coordinating engineering and business teams across locations.",process:"Agile, SAFe, and Waterfall. Adapted framework to project needs. Sprint planning, backlog prioritization, milestone tracking.",solution:"Standardized reporting and stakeholder dashboards in JIRA and IBM tools. Improved executive visibility.",impact:"Complex multi-location initiatives delivered on time and within budget. Improved efficiency and reduced delays.",learning:"Large organizations move slowly by design. Your job is to find the path of least resistance without cutting corners."}}];function Q(e,s){const o=e.orbPosition,i=s||o.clone().add(new C(0,0,60));return new ae([i,o.clone().add(new C(3,1.5,15)),o.clone().add(new C(4,.5,5)),o.clone().add(new C(-5,.8,2)),o.clone().add(new C(-3,-1.2,-2)),o.clone().add(new C(1,.4,.5)),o.clone().add(new C(0,0,-1.5))],!1,"catmullrom",.5)}const E={APPROACH_END:.2,ORBIT_END:.4,DESCENT_END:.6,INSIDE_END:.85};function Me(e,s){const o=1/s,i=e/o,a=Math.min(Math.floor(i),s-1),t=(e-a*o)/o;let l="escape",c=E.INSIDE_END,u=1;t<E.APPROACH_END?(l="approach",c=0,u=E.APPROACH_END):t<E.ORBIT_END?(l="orbit",c=E.APPROACH_END,u=E.ORBIT_END):t<E.DESCENT_END?(l="descent",c=E.ORBIT_END,u=E.DESCENT_END):t<E.INSIDE_END&&(l="inside",c=E.DESCENT_END,u=E.INSIDE_END);const h=u>c?(t-c)/(u-c):0;return{projectIndex:a,zoneProgress:t,phase:l,phaseProgress:Math.max(0,Math.min(1,h))}}const Ne=`varying vec2 vUv;
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
`,K=`// ── ORB SURFACE: ELECTRIC STORM ──
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
`,Ae=`// ── ORB SURFACE: OCEAN ──
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
`,ke=`// ── ORB SURFACE: MOLTEN LAVA ──
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
`,Pe=`// ── ORB SURFACE: ICE CRYSTAL LATTICE ──
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
`,Ie=`// ── ORB SURFACE: LIVING CIRCUIT BOARD ──
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
`,_e={electric:K,ocean:Ae,lava:ke,ice:Pe,circuit:Ie};function De({orbRadius:e,phase:s,isMobile:o}){const i=o?2:4,a=r.useRef();r.useRef([]);const t=r.useMemo(()=>Array.from({length:i},(d,p)=>({radius:.04+Math.random()*.04,orbitR:e*1.6+p*.3,speed:.4+Math.random()*.6,axisX:Math.random()*.6-.3,axisY:Math.random()*.3,phaseOff:p/i*Math.PI*2})),[e,i]),l=r.useMemo(()=>new G(.06,8,8),[]),c=r.useMemo(()=>new le({color:13421789,roughness:.8,metalness:.2}),[]),u=r.useMemo(()=>t.map(d=>{const p=[];for(let b=0;b<=60;b++){const g=b/60*Math.PI*2+d.phaseOff,w=Math.cos(g)*d.orbitR,v=Math.sin(g)*d.orbitR,y=Math.sin(g*d.axisX+d.phaseOff)*d.orbitR*.2;p.push(new C(w,y,v))}return new H().setFromPoints(p)}),[t]),h=r.useMemo(()=>t.map(()=>new $({color:8952251,transparent:!0,opacity:0})),[t]),m=r.useMemo(()=>new ce,[]);return M(d=>{const p=d.clock.elapsedTime;if(!a.current)return;const b=s==="orbit",g=s==="approach";t.forEach((w,v)=>{const y=p*w.speed+w.phaseOff,f=Math.cos(y)*w.orbitR,x=Math.sin(y)*w.orbitR,S=Math.sin(y*w.axisX+w.phaseOff)*w.orbitR*.2;if(m.position.set(f,S,x),m.scale.setScalar(w.radius/.06),m.updateMatrix(),a.current.setMatrixAt(v,m.matrix),h[v]){const k=g||b?.35:0;h[v].opacity+=(k-h[v].opacity)*.03}}),a.current.instanceMatrix.needsUpdate=!0}),n.jsxs("group",{children:[n.jsx("instancedMesh",{ref:a,args:[l,c,i]}),u.map((d,p)=>n.jsx("line",{geometry:d,material:h[p]},p))]})}function Oe({project:e,phase:s,phaseProgress:o,mouseNDC:i,activePhase:a,isActive:t,isMobile:l}){const c=r.useRef(),u=r.useRef();r.useRef();const h=r.useRef(1),m=_e[e.orbShader]||K,d=r.useMemo(()=>({uTime:{value:0},uSpeed:{value:.4},uColor1:{value:e.orbColor1.clone()},uColor2:{value:e.orbColor2.clone()}}),[e]),p=r.useMemo(()=>new z({vertexShader:Ne,fragmentShader:m,uniforms:d}),[m,d]),b=l?32:64,g=r.useMemo(()=>new G(e.orbRadius,b,b),[e.orbRadius,b]);M(y=>{const f=y.clock.elapsedTime;d.uTime.value=f;const x=s==="approach"?.4+o*.8:s==="orbit"?1.2:.4;if(d.uSpeed.value+=(x-d.uSpeed.value)*.02,!c.current)return;const S=!t&&(a==="descent"||a==="inside")?0:1;if(h.current+=(S-h.current)*.04,c.current.scale.setScalar(h.current),u.current&&s==="orbit"){const k=i.x*.4,_=-i.y*.25;u.current.rotation.y+=(k-u.current.rotation.y)*.05,u.current.rotation.x+=(_-u.current.rotation.x)*.05}u.current&&(u.current.rotation.y+=.001)});const w=r.useMemo(()=>new se(e.orbRadius*1.02,e.orbRadius*1.18,64),[e.orbRadius]),v=r.useMemo(()=>new ie({color:e.orbColor2,transparent:!0,opacity:.08,side:q,blending:U,depthWrite:!1}),[e.orbColor2]);return n.jsxs("group",{ref:c,position:e.orbPosition,children:[n.jsx("mesh",{ref:u,geometry:g,material:p}),n.jsx("mesh",{geometry:w,material:v,rotation:[Math.PI/2,0,0]}),t&&n.jsx(De,{orbRadius:e.orbRadius,phase:s,isMobile:l}),s==="approach"&&o>.6||s==="orbit"?n.jsx(we,{position:[0,e.orbRadius+.4,0],fontSize:.18,color:"#C9A84C",anchorX:"center",anchorY:"bottom",fillOpacity:s==="orbit"?1:o*2-1.2,children:e.title}):null]})}const J=`// ── INTERIOR BIOME: NEURAL GRID ──
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
`,Le=`// ── INTERIOR BIOME: LIQUID METAL ──
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
`,Fe=`// ── INTERIOR BIOME: DIGITAL GARDEN ──
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
`,je=`// ── INTERIOR BIOME: FREQUENCY ROOM ──
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
`,Be=`// ── INTERIOR BIOME: THE ARCHIVE WITHIN ──
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
`,Ve={neuralGrid:J,liquidMetal:Le,digitalGarden:Fe,frequencyRoom:je,archiveWithin:Be},We=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function ze({interiorType:e,visible:s}){const{viewport:o}=Y(),i=r.useRef(),a=r.useMemo(()=>({uTime:{value:0},uResolution:{value:new X(window.innerWidth,window.innerHeight)}}),[]),t=Ve[e]||J;return M(l=>{i.current&&(a.uTime.value=l.clock.elapsedTime)}),s?n.jsxs("mesh",{position:[0,0,-3],renderOrder:-1,children:[n.jsx("planeGeometry",{args:[o.width*2.5,o.height*2.5,1,1]}),n.jsx("shaderMaterial",{ref:i,vertexShader:We,fragmentShader:t,uniforms:a,depthWrite:!1,depthTest:!1})]}):null}function Ge({position:e,rotation:s,hovered:o}){const i=r.useMemo(()=>new ve(new fe(1.82,1.12)),[]),a=r.useMemo(()=>new $({color:"#C9A84C",transparent:!0,opacity:.3}),[]);return M(()=>{a&&(a.opacity=o?.8:.3)}),n.jsx("lineSegments",{position:e,rotation:s,geometry:i,material:a})}function Ue({position:e,rotation:s,color:o,label:i,visible:a}){const t=r.useRef(),[l,c]=r.useState(!1),u=r.useRef(),h=r.useMemo(()=>new C(e[0],e[1],e[2]+1.2),[e]),m=r.useMemo(()=>new C(...e),[e]),d=r.useMemo(()=>new C(1.4,1.4,1.4),[]),p=r.useMemo(()=>new C(1,1,1),[]);M(v=>{if(!t.current||!a)return;const y=v.clock.elapsedTime;l?(t.current.position.lerp(h,.08),t.current.rotation.y+=(0-t.current.rotation.y)*.1,t.current.scale.lerp(d,.08)):(t.current.position.lerp(m,.06),t.current.scale.lerp(p,.06)),u.current&&(u.current.uniforms.uTime.value=y)});const b=r.useMemo(()=>({uTime:{value:0},uColor:{value:new N(o)}}),[o]),g=`
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
  `;return a?n.jsxs("group",{children:[n.jsxs("mesh",{ref:t,position:e,rotation:s,onPointerOver:()=>c(!0),onPointerOut:()=>c(!1),children:[n.jsx("planeGeometry",{args:[1.8,1.1,1,1]}),n.jsx("shaderMaterial",{ref:u,vertexShader:g,fragmentShader:w,uniforms:b,transparent:!0,roughness:.1,metalness:.3})]}),n.jsx(Ge,{position:e,rotation:s,hovered:l})]}):null}function W({position:e,label:s,visible:o,onClick:i}){const a=r.useRef(),t=r.useRef(),[l,c]=r.useState(!1),u=r.useRef(0),h=r.useMemo(()=>new ue(.18,0),[]);return M(m=>{if(!a.current||!o)return;const d=m.clock.elapsedTime;a.current.rotation.y+=.012,a.current.rotation.x=Math.sin(d*.5)*.15;const p=l?1:0;if(u.current+=(p-u.current)*.08,a.current.material&&(a.current.material.emissiveIntensity=u.current*1.5),t.current){const b=l?1+Math.sin(d*4)*.06:0;t.current.scale.setScalar(b+(l?1:0)),t.current.material.opacity=l?.6:0}}),o?n.jsxs("group",{position:e,children:[n.jsx("mesh",{ref:a,geometry:h,onPointerOver:()=>c(!0),onPointerOut:()=>c(!1),onClick:i,children:n.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:0,metalness:.9,roughness:.1})}),n.jsxs("mesh",{ref:t,rotation:[Math.PI/2,0,0],children:[n.jsx("ringGeometry",{args:[.22,.28,32]}),n.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:0,side:q,depthWrite:!1})]})]}):null}function qe({project:e,phase:s,phaseProgress:o,onReadMore:i}){const a=r.useRef(),t=s==="inside"||s==="escape",l=r.useMemo(()=>[{position:[-2,.5,-1.5],rotation:[0,.15,.05],color:O(e.orbColor2)},{position:[1.8,.2,-2.5],rotation:[0,-.2,-.03],color:O(e.orbColor1)},{position:[-1.2,-.8,-3.5],rotation:[.05,.1,0],color:O(e.orbColor2)},{position:[.5,1.1,-2],rotation:[-.05,-.15,.06],color:O(e.orbColor1)}],[e]),c=t&&o>.92;return M(()=>{a.current&&(a.current.visible=t)}),n.jsxs("group",{ref:a,visible:t,children:[n.jsx(ze,{interiorType:e.interiorType,visible:t}),l.map((u,h)=>n.jsx(Ue,{position:u.position,rotation:u.rotation,color:u.color,label:`${e.title} — IMG ${h+1}`,visible:t&&o>.05},h)),n.jsx(W,{position:[-.6,-1.2,-1.8],label:"VIEW LIVE",visible:c,onClick:()=>window.open(e.liveUrl,"_blank")}),n.jsx(W,{position:[.6,-1.2,-1.8],label:"READ MORE",visible:c,onClick:i}),n.jsx("pointLight",{position:[0,1,-1],intensity:1.5,color:e.orbColor2,distance:8}),n.jsx("ambientLight",{intensity:.3})]})}function O(e){return`#${e.clone().multiplyScalar(.5).getHexString()}`}const P=["THE BRIEF","THE PROCESS","THE SOLUTION","THE IMPACT","THE LEARNING"],He=["brief","process","solution","impact","learning"];function $e({project:e,onClose:s}){const o=r.useRef(),i=r.useRef(),[a,t]=r.useState(0),[l,c]=r.useState(!1),u=r.useRef(null);r.useEffect(()=>{o.current&&L.fromTo(o.current,{y:"100%",opacity:0},{y:"0%",opacity:1,duration:.6,ease:"power3.out"})},[]);const h=r.useCallback(()=>{l||(c(!0),L.to(o.current,{y:"100%",opacity:0,duration:.5,ease:"power3.in",onComplete:s}))},[l,s]),m=r.useCallback(()=>{a<P.length-1&&t(f=>f+1)},[a]),d=r.useCallback(()=>{a>0&&t(f=>f-1)},[a]);r.useEffect(()=>{const f=x=>{x.key==="ArrowRight"&&m(),x.key==="ArrowLeft"&&d(),x.key==="Escape"&&h()};return window.addEventListener("keydown",f),()=>window.removeEventListener("keydown",f)},[m,d,h]);const p=f=>{u.current=f.touches[0].clientX},b=f=>{if(u.current===null)return;const x=f.changedTouches[0].clientX-u.current;x<-50&&m(),x>50&&d(),u.current=null};r.useEffect(()=>{i.current&&L.fromTo(i.current,{x:30,opacity:0},{x:0,opacity:1,duration:.4,ease:"power2.out"})},[a]);const g=(e==null?void 0:e.panels)||{},w=He[a],v=P[a],y=g[w]||"[PLACEHOLDER: Fill case study content]";return n.jsxs("div",{ref:o,className:"project-overlay","data-lenis-prevent":!0,onTouchStart:p,onTouchEnd:b,style:{transform:"translateY(100%)"},children:[n.jsx("div",{className:"project-overlay__glass"}),n.jsx("button",{className:"project-overlay__close",onClick:h,"aria-label":"Close case study",children:n.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[n.jsx("line",{x1:"4",y1:"4",x2:"20",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),n.jsx("line",{x1:"20",y1:"4",x2:"4",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}),n.jsxs("div",{className:"project-overlay__inner",children:[n.jsxs("div",{className:"project-overlay__left",children:[n.jsxs("div",{className:"overlay-project-number",children:["0",((e==null?void 0:e.index)??0)+1]}),n.jsx("h2",{className:"overlay-project-title",children:e==null?void 0:e.title}),n.jsx("p",{className:"overlay-project-role",children:e==null?void 0:e.role}),n.jsx("p",{className:"overlay-project-year",children:e==null?void 0:e.year}),n.jsx("div",{className:"overlay-project-tags",children:((e==null?void 0:e.tags)||[]).map(f=>n.jsx("span",{className:"overlay-tag",children:f},f))}),n.jsx("div",{className:"overlay-dots",children:P.map((f,x)=>n.jsx("button",{className:`overlay-dot ${x===a?"active":""}`,onClick:()=>t(x),"aria-label":`Go to ${P[x]}`},x))})]}),n.jsxs("div",{className:"project-overlay__right",children:[n.jsxs("div",{ref:i,className:"overlay-panel",children:[n.jsxs("div",{className:"overlay-panel__header",children:[n.jsxs("span",{className:"overlay-panel__number",children:["0",a+1," / 0",P.length]}),n.jsx("h3",{className:"overlay-panel__title",children:v})]}),n.jsx("p",{className:"overlay-panel__body",children:y}),w==="impact"&&(e==null?void 0:e.metric)&&n.jsxs("div",{className:"overlay-metric",children:[n.jsx("span",{className:"overlay-metric__number",children:e.metric}),n.jsx("span",{className:"overlay-metric__desc",children:e.metricDesc})]})]}),n.jsxs("div",{className:"overlay-nav",children:[n.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--prev ${a===0?"disabled":""}`,onClick:d,disabled:a===0,"aria-label":"Previous panel",children:"←"}),n.jsx("span",{className:"overlay-nav__label",children:v}),n.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--next ${a===P.length-1?"disabled":""}`,onClick:m,disabled:a===P.length-1,"aria-label":"Next panel",children:"→"})]})]})]})]})}const Ye=`// ── STAR FIELD VERTEX SHADER ──
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
`,Xe=`// ── STAR FIELD FRAGMENT SHADER ──

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
`;function Qe({warpStrength:e,isMobile:s}){const o=s?1e3:3e3,i=r.useRef(),{positions:a,sizes:t,brightnesses:l,seeds:c}=r.useMemo(()=>{const m=new Float32Array(o*3),d=new Float32Array(o),p=new Float32Array(o),b=new Float32Array(o);for(let g=0;g<o;g++)m[g*3]=(Math.random()-.5)*300,m[g*3+1]=(Math.random()-.5)*300,m[g*3+2]=-30-Math.random()*200,d[g]=.5+Math.random()*2.5,p[g]=.3+Math.random()*.7,b[g]=Math.random();return{positions:m,sizes:d,brightnesses:p,seeds:b}},[o]),u=r.useMemo(()=>({uTime:{value:0},uWarpStrength:{value:0},uWarpSeed:{value:0}}),[]),h=r.useMemo(()=>new z({vertexShader:Ye,fragmentShader:Xe,uniforms:u,transparent:!0,blending:U,depthWrite:!1,vertexColors:!1}),[u]);return M(m=>{u.uTime.value=m.clock.elapsedTime,u.uWarpStrength.value+=(e-u.uWarpStrength.value)*.04}),n.jsx("points",{ref:i,material:h,children:n.jsxs("bufferGeometry",{children:[n.jsx("bufferAttribute",{attach:"attributes-position",count:o,array:a,itemSize:3}),n.jsx("bufferAttribute",{attach:"attributes-aSize",count:o,array:t,itemSize:1}),n.jsx("bufferAttribute",{attach:"attributes-aBrightness",count:o,array:l,itemSize:1}),n.jsx("bufferAttribute",{attach:"attributes-uWarpSeed",count:o,array:c,itemSize:1})]})})}function Ke({visible:e,position:s}){const o=r.useRef();return M(i=>{if(!o.current||!e)return;const a=i.clock.elapsedTime;o.current.rotation.y+=.008,o.current.rotation.x=Math.sin(a*.4)*.06}),e?n.jsxs("mesh",{ref:o,position:s,children:[n.jsx("coneGeometry",{args:[.08,.25,8]}),n.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:.6,metalness:.9,roughness:.1})]}):null}function Je({path:e,visible:s,opacity:o}){const i=r.useRef(),a=r.useMemo(()=>{const l=[];for(let c=0;c<=50;c++)l.push(e.getPoint(c/50));return l},[e]),t=r.useMemo(()=>new H().setFromPoints(a),[a]);return M(()=>{i.current&&(i.current.opacity+=((s?o:0)-i.current.opacity)*.03)}),n.jsx("line",{geometry:t,children:n.jsx("lineBasicMaterial",{ref:i,color:"#C9A84C",transparent:!0,opacity:0,linewidth:1})})}const Ze=new C(1,7,22),en=new C(1,.5,-21);function nn({scrollProgress:e,currentProjectIndex:s,currentPhase:o}){const{camera:i}=Y(),a=r.useRef(new C(0,0,-10)),t=r.useRef([]),l=r.useMemo(()=>new C,[]),c=r.useMemo(()=>new C,[]);return r.useEffect(()=>{const u=[];T.forEach((h,m)=>{const d=m>0?T[m-1].orbPosition:null;u.push(Q(h,d))}),t.current=u},[]),M(()=>{if(t.current.length===0)return;const u=T.length,h=1/u,m=Math.min(Math.floor(e/h),u-1),d=(e-m*h)/h,p=t.current[m];if(p){if(p.getPoint(Math.min(d,.99),l),c.copy(T[m].orbPosition),m===u-1){const b=ge.smoothstep(d,E.INSIDE_END,.92);l.lerp(Ze,b),c.lerp(en,b)}i.position.lerp(l,.08),a.current.lerp(c,.05),i.lookAt(a.current)}}),null}function tn({phase:e,phaseProgress:s}){r.useRef({x:0,y:0});const o=r.useMemo(()=>new X(0,0),[]);return M(()=>{let i=0;e==="descent"&&(s<.5?i=s*2*.018:i=(1-s)*2*.018);const a=o.x,t=a+(i-a)*.15;o.set(t,t*.3)}),n.jsx(ye,{children:n.jsx(be,{blendFunction:xe.NORMAL,offset:o})})}function on({project:e,visible:s,phaseProgress:o}){const i=s&&o>.1;return n.jsxs("div",{className:`orbit-meta ${i?"orbit-meta--visible":""}`,children:[n.jsxs("div",{className:"orbit-meta__number",style:{transitionDelay:"0ms"},children:["0",e.index+1]}),n.jsx("h2",{className:"orbit-meta__title",style:{transitionDelay:"80ms"},children:e.title}),n.jsx("p",{className:"orbit-meta__role",style:{transitionDelay:"160ms"},children:e.role}),n.jsx("p",{className:"orbit-meta__year",style:{transitionDelay:"240ms"},children:e.year}),n.jsx("div",{className:"orbit-meta__tags",style:{transitionDelay:"320ms"},children:e.tags.map(a=>n.jsx("span",{className:"orbit-tag",children:a},a))}),n.jsx("p",{className:"orbit-meta__pull-quote",style:{transitionDelay:"400ms"},children:e.pullQuote})]})}function rn({project:e,phase:s,phaseProgress:o}){const i=s==="inside",a=i&&o>.12,t=i&&o>.38,l=i&&o>.56,c=i&&o>.76,u=r.useMemo(()=>{if(!(e!=null&&e.metric))return"";const d=e.metric.replace(/[^\d.]/g,""),p=e.metric.replace(/[\d.]/g,"");return{digits:parseFloat(d),suffix:p}},[e]),[h,m]=r.useState(0);return r.useEffect(()=>{if(!l||!u.digits){m(0);return}let d=0;const p=performance.now(),b=1500,g=w=>{const v=Math.min((w-p)/b,1),y=1-Math.pow(1-v,3);m(Math.round(y*u.digits)),v<1&&(d=requestAnimationFrame(g))};return d=requestAnimationFrame(g),()=>cancelAnimationFrame(d)},[l,u]),n.jsxs("div",{className:"narrative-blocks",children:[n.jsx("div",{className:`narrative-block narrative-block--a ${a?"visible":""}`,children:e==null?void 0:e.verb}),n.jsx("div",{className:`narrative-block narrative-block--b ${t?"visible":""}`,children:e==null?void 0:e.challenge}),n.jsxs("div",{className:`narrative-block narrative-block--c ${l?"visible":""}`,children:[n.jsxs("span",{className:"narrative-metric",children:[h,u.suffix]}),n.jsx("span",{className:"narrative-metric-desc",children:e==null?void 0:e.metricDesc})]}),n.jsxs("div",{className:`narrative-block narrative-block--d ${c?"visible":""}`,children:['"',e==null?void 0:e.reflection,'"']})]})}function an({visible:e,onComplete:s}){const o=r.useRef(),i=r.useRef();return r.useEffect(()=>{if(!e||!o.current)return;const t=Array.from(o.current.querySelectorAll(".entry-title__letter"));L.timeline({onComplete:s}).fromTo(t,{opacity:0,scale:.4,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:.06,stagger:{from:"center",amount:.8},ease:"power2.out"}).fromTo(i.current,{opacity:0,y:20},{opacity:1,y:0,duration:.8,ease:"power2.out"},"-=0.3").to([o.current,i.current],{delay:1.2,opacity:0,filter:"blur(8px)",y:-20,scale:1.05,duration:.6,stagger:.1,ease:"power3.in"})},[e,s]),e?n.jsxs("div",{className:"entry-title-container",children:[n.jsx("h1",{ref:o,className:"entry-title",children:"III. THE CARTOGRAPHY".split("").map((t,l)=>n.jsx("span",{className:"entry-title__letter",children:t===" "?" ":t},l))}),n.jsx("p",{ref:i,className:"entry-subtitle",children:"WORLDS I HAVE BUILT."})]}):null}function sn({scrollProgress:e,projectIndex:s,phase:o,totalProjects:i}){const a=e,t=o==="inside"||o==="descent",l=o==="escape"&&s<i-1,c=T[s+1];return n.jsxs(n.Fragment,{children:[n.jsxs("div",{className:`cartography-realm-label ${t?"dimmed":""}`,children:[n.jsx("div",{className:"realm-label__title",children:"III. THE CARTOGRAPHY"}),n.jsxs("div",{className:"realm-label__world",children:["WORLD ",s+1," / ",i]})]}),n.jsxs("div",{className:"cartography-progress-bar",children:[n.jsx("span",{className:"progress-label progress-label--top",children:"START"}),n.jsx("div",{className:"progress-track",children:n.jsx("div",{className:"progress-dot",style:{top:`${a*100}%`}})}),n.jsx("span",{className:"progress-label progress-label--bottom",children:"END"})]}),n.jsxs("div",{className:`scroll-hint-container ${["orbit","escape"].includes(o)?"visible":""}`,children:[n.jsx("div",{className:`transit-caption ${l?"visible":""}`,children:l&&c&&`PROJECT ${s+1} OF ${i} — ${c.title} AHEAD`}),n.jsxs("div",{className:"scroll-hint",children:[n.jsx("span",{children:o==="orbit"?"SCROLL TO DESCEND":"SCROLL TO CONTINUE"}),n.jsx("div",{className:"scroll-hint__arrow"})]})]})]})}function ln({scrollProgress:e,phase:s,phaseProgress:o,projectIndex:i,warpActive:a,finalMap:t,showSpacecraft:l,onReadMore:c,isMobile:u,mouseNDC:h}){var p;const m=i===T.length-1&&s==="escape",d=r.useMemo(()=>T.map((b,g)=>{const w=g>0?T[g-1].orbPosition:null;return Q(b,w)}),[]);return n.jsxs(n.Fragment,{children:[n.jsx(Ce,{makeDefault:!0,position:[0,2,50],fov:55}),n.jsx(nn,{scrollProgress:e,currentProjectIndex:i,currentPhase:s}),n.jsx(Qe,{warpStrength:a?1:0,isMobile:u}),n.jsx("fog",{attach:"fog",color:"#02040A",near:40,far:120}),n.jsx("ambientLight",{intensity:.08}),n.jsx("pointLight",{position:[0,30,-20],intensity:.5,color:"#3366ff"}),T.map((b,g)=>n.jsx(Oe,{project:b,phase:g===i?s:"idle",activePhase:m?"escape":s,phaseProgress:g===i?o:0,mouseNDC:h,isActive:g===i,isMobile:u},b.id)),n.jsx(qe,{project:T[i],phase:m?"idle":s,phaseProgress:o,onReadMore:c}),t&&d.map((b,g)=>n.jsx(Je,{path:b,visible:t,opacity:.5},g)),n.jsx(Ke,{visible:t||e<.05,position:t?new C(12,4,-15):(p=T[i])==null?void 0:p.orbPosition.clone().add(new C(6,2,8))}),!u&&n.jsx(tn,{phase:s,phaseProgress:o})]})}function dn(){const e=r.useRef(null),s=de(I=>I.performanceLow),[o,i]=r.useState(0),[a,t]=r.useState("approach"),[l,c]=r.useState(0),[u,h]=r.useState(0),[m,d]=r.useState(0),[p,b]=r.useState(!1),[g,w]=r.useState(!1),[v,y]=r.useState(!1),[f,x]=r.useState(!1),[S,k]=r.useState(null),_=r.useRef({x:0,y:0}).current,Z=me();Ee({phase:a,projectIndex:u,phaseProgress:l,zoneProgress:m}),r.useEffect(()=>{const I=D=>{_.x=D.clientX/window.innerWidth*2-1,_.y=-(D.clientY/window.innerHeight*2-1)};return window.addEventListener("mousemove",I,{passive:!0}),()=>window.removeEventListener("mousemove",I)},[]),r.useEffect(()=>{if(!e.current)return;const I=he.create({trigger:e.current,start:"top top",end:"bottom bottom",scrub:1.5,onEnter:()=>b(!0),onUpdate:D=>{const F=D.progress;i(F);const{projectIndex:te,phase:j,phaseProgress:oe,zoneProgress:re}=Me(F,T.length);h(te),t(j),c(oe),d(re),x(j==="escape"),y(F>.97)}});return()=>I.kill()},[]);const ee=r.useCallback(()=>{k(T[u])},[u]),ne=r.useCallback(()=>{k(null)},[]);return n.jsx("div",{ref:e,className:"cartography-scroll-space",children:n.jsxs("div",{className:"cartography-sticky",children:[n.jsx(pe,{gl:{antialias:!0,alpha:!1,powerPreference:"high-performance"},dpr:s?[1,1]:[1,1.5],frameloop:Z,style:{position:"absolute",inset:0,background:"#02040A"},children:n.jsx(ln,{scrollProgress:o,phase:a,phaseProgress:l,projectIndex:u,warpActive:f,finalMap:v,showSpacecraft:!0,onReadMore:ee,isMobile:s,mouseNDC:_})}),p&&!g&&n.jsx(an,{visible:p,onComplete:()=>w(!0)}),n.jsx(on,{project:T[u],visible:a==="orbit",phaseProgress:l}),n.jsx(rn,{project:T[u],phase:a,phaseProgress:l}),v&&n.jsx("div",{className:"final-map-text",children:"EVERY WORLD BEGAN AS AN EMPTY CANVAS."}),n.jsx(sn,{scrollProgress:o,projectIndex:u,phase:a,totalProjects:T.length}),S&&n.jsx($e,{project:S,onClose:ne})]})})}export{dn as default};
