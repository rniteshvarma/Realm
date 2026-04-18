import{r,S as Ne,g as R,j as s,C as Be,al as Ie,ap as ie,l as Ge,d as Ve,b as I,a as q,h as Le}from"./index-C6A6qjDW.js";import{P as Oe}from"./PerspectiveCamera-CBY1_SN-.js";import"./Fbo-CHV-28Jx.js";class De{constructor(){this.ctx=null,this.masterGain=null,this.reverbNode=null,this._baseTone=null,this._baseToneGain=null,this._crackleTimeout=null,this._presenceDroneGains=[],this._presenceDrones=[],this._penOsc=null,this._penGain=null,this._subBass=null,this._subBassGain=null,this._chordOscs=[],this._chordGains=[],this._initialized=!1}_ensureCtx(){this.ctx||(this.ctx=new(window.AudioContext||window.webkitAudioContext),this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=.6,this.masterGain.connect(this.ctx.destination))}async _buildReverb(t=8){const e=Math.floor(this.ctx.sampleRate*t),n=this.ctx.createBuffer(2,e,this.ctx.sampleRate);for(let a=0;a<2;a++){const u=n.getChannelData(a);for(let f=0;f<e;f++)u[f]=(Math.random()*2-1)*Math.pow(1-f/e,2.2)}const i=this.ctx.createConvolver();i.buffer=n,i.connect(this.masterGain),this.reverbNode=i}async init(){if(this._initialized){this.ctx.state==="suspended"&&await this.ctx.resume();return}this._ensureCtx(),this.ctx.state==="suspended"&&await this.ctx.resume();const t=()=>this._buildReverb(10);if(typeof requestIdleCallback<"u"?requestIdleCallback(t,{timeout:3e3}):setTimeout(t,500),typeof window.speechSynthesis<"u"){const e=new SpeechSynthesisUtterance("");e.volume=0,window.speechSynthesis.speak(e);const n=()=>{this._cachedVoices=window.speechSynthesis.getVoices()};n(),window.speechSynthesis.onvoiceschanged!==void 0&&(window.speechSynthesis.onvoiceschanged=n)}this._initialized=!0}startBaseTone(){if(!this.ctx||this._baseTone)return;const t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="sine",t.frequency.value=174,e.gain.setValueAtTime(0,this.ctx.currentTime),e.gain.linearRampToValueAtTime(.04,this.ctx.currentTime+3),t.connect(e),e.connect(this.reverbNode),t.start(),this._baseTone=t,this._baseToneGain=e}stopBaseTone(t=3){if(!this._baseTone)return;const e=this.ctx.currentTime;this._baseToneGain.gain.cancelScheduledValues(e),this._baseToneGain.gain.setValueAtTime(this._baseToneGain.gain.value,e),this._baseToneGain.gain.linearRampToValueAtTime(0,e+t),setTimeout(()=>{try{this._baseTone.stop()}catch{}this._baseTone=null},t*1e3+100)}baseToneAscend(t=12){if(!this._baseTone)return;const e=this.ctx.currentTime;this._baseTone.frequency.cancelScheduledValues(e),this._baseTone.frequency.setValueAtTime(this._baseTone.frequency.value,e),this._baseTone.frequency.linearRampToValueAtTime(220,e+t)}_fireCrackle(){if(!this.ctx||!this._crackleActive)return;const t=.02+Math.random()*.05,e=Math.floor(this.ctx.sampleRate*t),n=this.ctx.createBuffer(1,e,this.ctx.sampleRate),i=n.getChannelData(0);let a=0,u=0,f=0,h=0,m=0,S=0,C=0;for(let P=0;P<e;P++){const _=Math.random()*2-1;a=.99886*a+_*.0555179,u=.99332*u+_*.0750759,f=.969*f+_*.153852,h=.8665*h+_*.3104856,m=.55*m+_*.5329522,S=-.7616*S-_*.016898,i[P]=(a+u+f+h+m+S+C+_*.5362)*.11,C=_*.115926}const v=this.ctx.createBufferSource();v.buffer=n;const x=this.ctx.createBiquadFilter();x.type="highpass",x.frequency.value=900;const g=this.ctx.createGain();g.gain.value=.015;const y=this.ctx.createStereoPanner();y.pan.value=(Math.random()-.5)*1.2,v.connect(x),x.connect(g),g.connect(y),y.connect(this.masterGain),v.start();const A=300+Math.random()*1700;this._crackleTimeout=setTimeout(()=>this._fireCrackle(),A)}startCandleCrackle(){this._crackleActive=!0,this._fireCrackle()}stopCandleCrackle(){this._crackleActive=!1,this._crackleTimeout&&clearTimeout(this._crackleTimeout)}strikeEnterBell(){if(!this.ctx)return;const t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="triangle",t.frequency.value=522;const n=this.ctx.currentTime;e.gain.setValueAtTime(0,n),e.gain.linearRampToValueAtTime(.18,n+.01),e.gain.exponentialRampToValueAtTime(.001,n+3);const i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type="sine",i.frequency.value=1044,a.gain.setValueAtTime(0,n),a.gain.linearRampToValueAtTime(.03,n+.01),a.gain.exponentialRampToValueAtTime(1e-4,n+1.5),t.connect(e),i.connect(a),this.reverbNode?(e.connect(this.reverbNode),a.connect(this.reverbNode)):(e.connect(this.masterGain),a.connect(this.masterGain)),t.start(),i.start(),t.stop(n+3.2),i.stop(n+2)}startPresenceDrone(){if(!this.ctx||this._presenceDrones.length>0)return;[174,261,392].forEach(e=>{const n=this.ctx.createOscillator(),i=this.ctx.createGain();n.type="sine",n.frequency.value=e+(Math.random()*3-1.5),i.gain.setValueAtTime(0,this.ctx.currentTime),n.connect(i),this.reverbNode?i.connect(this.reverbNode):i.connect(this.masterGain),n.start(),this._presenceDrones.push(n),this._presenceDroneGains.push(i)}),this._presenceDroneGains.forEach(e=>{e.gain.linearRampToValueAtTime(.05,this.ctx.currentTime+1.6)})}stopPresenceDrone(){if(!this.ctx||this._presenceDrones.length===0)return;const t=this.ctx.currentTime;this._presenceDroneGains.forEach(e=>{e.gain.cancelScheduledValues(t),e.gain.setValueAtTime(e.gain.value,t),e.gain.linearRampToValueAtTime(0,t+.2)}),setTimeout(()=>{this._presenceDrones.forEach(e=>{try{e.stop()}catch{}}),this._presenceDrones=[],this._presenceDroneGains=[]},400)}startPenWhisper(){if(!this.ctx||this._penOsc)return;const t=this.ctx.sampleRate*2,e=this.ctx.createBuffer(1,t,this.ctx.sampleRate),n=e.getChannelData(0);for(let h=0;h<t;h++)n[h]=Math.random()*2-1;const i=this.ctx.createBufferSource();i.buffer=e,i.loop=!0;const a=this.ctx.createBiquadFilter();a.type="highpass",a.frequency.value=3e3;const u=this.ctx.createBiquadFilter();u.type="lowpass",u.frequency.value=8e3;const f=this.ctx.createGain();f.gain.value=.008,i.connect(a),a.connect(u),u.connect(f),f.connect(this.masterGain),i.start(),this._penOsc=i,this._penGain=f}stopPenWhisper(){if(this._penOsc){try{this._penOsc.stop()}catch{}this._penOsc=null,this._penGain=null}}startSeventhExchangeChord(){if(!this.ctx)return;const t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="sine",t.frequency.value=60,e.gain.value=.04,t.connect(e),e.connect(this.masterGain),t.start(),this._subBass=t,this._subBassGain=e,this._chordFreqs=[174,261,392,523],this._chordOscs=[],this._chordGains=[]}addChordNote(t){if(!this.ctx||!this._chordFreqs)return;const e=this._chordFreqs[t];if(!e)return;const n=this.ctx.createOscillator(),i=this.ctx.createGain();n.type="sine",n.frequency.value=e,i.gain.setValueAtTime(0,this.ctx.currentTime),i.gain.linearRampToValueAtTime(.03,this.ctx.currentTime+.5),n.connect(i),this.reverbNode?i.connect(this.reverbNode):i.connect(this.masterGain),n.start(),this._chordOscs.push(n),this._chordGains.push(i)}swellAndCutChord(t=.3){if(!this.ctx)return;const e=this.ctx.currentTime;this._chordGains.forEach(n=>{n.gain.cancelScheduledValues(e),n.gain.setValueAtTime(n.gain.value,e),n.gain.linearRampToValueAtTime(.15,e+t),n.gain.linearRampToValueAtTime(0,e+t+.05)}),this._subBassGain&&this._subBassGain.gain.linearRampToValueAtTime(0,e+t+.5),setTimeout(()=>{if(this._chordOscs.forEach(n=>{try{n.stop()}catch{}}),this._subBass)try{this._subBass.stop()}catch{}this._chordOscs=[],this._chordGains=[],this._subBass=null},(t+1)*1e3)}strikeBelief(t){const e=[392,440,494,587.33,659.25],n=e[t%e.length];if(!this.ctx)return;const i=this.ctx.createOscillator(),a=this.ctx.createGain();i.type="triangle",i.frequency.value=n;const u=this.ctx.currentTime;a.gain.setValueAtTime(0,u),a.gain.linearRampToValueAtTime(.12,u+.01),a.gain.exponentialRampToValueAtTime(.001,u+2),i.connect(a),this.reverbNode?a.connect(this.reverbNode):a.connect(this.masterGain),i.start(),i.stop(u+2.2)}async speak(t){if(typeof window.speechSynthesis>"u")return;window.speechSynthesis.cancel();const e=new SpeechSynthesisUtterance(t);e.rate=.82,e.pitch=.72,e.volume=1;const i=(this._cachedVoices||window.speechSynthesis.getVoices()).find(a=>a.name.toLowerCase().includes("daniel")||a.name.toLowerCase().includes("alex")||a.name.toLowerCase().includes("george")||a.lang==="en-GB");return i&&(e.voice=i),window.speechSynthesis.speak(e),new Promise(a=>{e.onend=a,e.onerror=a})}silenceVoice(){typeof window.speechSynthesis<"u"&&window.speechSynthesis.cancel()}dispose(){if(this.stopCandleCrackle(),this.stopPresenceDrone(),this.stopPenWhisper(),this.stopBaseTone(.1),this.silenceVoice(),this._subBass)try{this._subBass.stop()}catch{}this._chordOscs&&this._chordOscs.forEach(t=>{try{t.stop()}catch{}}),this.ctx&&(this.ctx.close(),this.ctx=null),this._initialized=!1}}const E=new De,ze=`// ── Stone Wall Shader — THE SÉANCE ─────────────────────────────────────
// Base: --heaven-deep (#0D1B2A) prussian blue-black.
// Shimmer: --neural (#00F5FF) teal — consistent with all other realms.
// Corners bleed --plasma (#7B2FBE) violet — matches Realm 1 + Realm 2.

uniform float uTime;
uniform float uShimmerSpeed;
varying vec2 vUv;
varying vec3 vWorldPos;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),           hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p  = p * 2.1 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  // Base stone texture — 3 octaves
  float n = noise(vUv * 8.0)  * 0.6 +
            noise(vUv * 16.0) * 0.3 +
            noise(vUv * 32.0) * 0.1;

  // Moisture shimmer — moves slowly upward
  float shimmer = noise(vUv * 20.0 + vec2(0.0, -uTime * uShimmerSpeed));
  shimmer = pow(shimmer, 6.0) * 0.12;

  // Crack / grain veins
  float crack = fbm(vUv * 6.0 + vec2(uTime * 0.003, 0.0));
  crack = smoothstep(0.55, 0.6, crack) * 0.04;

  // FIX 1: --heaven-deep (#0D1B2A) as the base stone color
  vec3 stone = vec3(0.051, 0.106, 0.165) + n * 0.03 - crack;

  // FIX 1: shimmer uses --neural teal (#00F5FF) — matches other realm glows
  vec3 shimmerCol = vec3(0.0, 0.961, 1.0);
  vec3 col = stone + shimmer * shimmerCol * 0.08;

  // FIX 1: --plasma (#7B2FBE) violet bleed in corners — same depth trick as Realm 1
  float cornerDist = length(vUv - 0.5) * 2.0;
  vec3 plasmaBleed = vec3(0.482, 0.184, 0.745);
  col += plasmaBleed * pow(cornerDist, 3.0) * 0.04;

  // Subtle edge darkening (SSAO-like vignette at wall corners)
  float edgeFade = smoothstep(0.0, 0.15, vUv.x) *
                   smoothstep(0.0, 0.15, 1.0 - vUv.x) *
                   smoothstep(0.0, 0.15, vUv.y) *
                   smoothstep(0.0, 0.15, 1.0 - vUv.y);
  col *= (0.65 + 0.35 * edgeFade);

  gl_FragColor = vec4(col, 1.0);
}
`,We=`// ── Floor Hex Grid Shader — THE SÉANCE ─────────────────────────────────
// FIX 2: Replace warm wood grain with obsidian hex grid.
// Base: --heaven-deep dark (#040608 → vec3(0.04,0.06,0.10))
// Grid lines: --neural teal (#00F5FF) — matches Realm 2 Forge + Realm 6 Frequency.
// Very dim — this is a floor, not a wall.

uniform float uTime;
varying vec2 vUv;

// Hex grid helpers — same logic as The Forge containment walls
vec4 hexCoords(vec2 uv) {
  vec2 r = vec2(1.0, 1.732);
  vec2 h = r * 0.5;
  vec2 a = mod(uv, r) - h;
  vec2 b = mod(uv - h, r) - h;
  vec2 gv = dot(a, a) < dot(b, b) ? a : b;
  float x = atan(gv.x, gv.y);
  float y = 0.5 - length(gv);
  vec2 id = uv - gv;
  return vec4(x, y, id.x, id.y);
}

float hexDist(vec2 p) {
  p = abs(p);
  return max(dot(p, normalize(vec2(1.0, 1.732))), p.x);
}

void main() {
  vec2 uv = vUv * 12.0;
  vec4 hc = hexCoords(uv);
  float d = hexDist(hc.xy);
  float edge = smoothstep(0.46, 0.5, d);

  // Per-cell pulse — faint, slow
  float pulse = sin(uTime * 0.4 + hc.z * 0.3) * 0.5 + 0.5;

  // --neural (#00F5FF) grid lines, very dim — floor not ceiling
  vec3 gridCol = vec3(0.0, 0.961, 1.0) * edge * pulse * 0.055;

  // --heaven-deep dark base
  vec3 base = vec3(0.04, 0.06, 0.10);

  gl_FragColor = vec4(base + gridCol, 1.0);
}
`,Ue=`// ── Presence Particle Vertex Shader — THE SÉANCE ───────────────────────
// Colour-cycling particles: violet → gold → teal.
// Size attenuation for depth.

uniform float uTime;
attribute float aSize;
varying float vLife;
varying float vAlpha;

void main() {
  // Life drives the colour cycle — unique per particle via position hash
  vLife = fract(uTime * 0.08 + position.x * 0.3 + position.y * 0.2);

  vec4 mvPos   = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize * (200.0 / -mvPos.z);
  gl_PointSize = clamp(gl_PointSize, 1.0, 32.0);
  gl_Position  = projectionMatrix * mvPos;

  // Fade based on distance (depth-based alpha)
  vAlpha = clamp(1.0 + mvPos.z * 0.08, 0.1, 1.0);
}
`,qe=`// ── Presence Particle Fragment Shader — THE SÉANCE ─────────────────────
// FIX 8: Exact REALM palette — 4-stop cycle adds --aurora-1 for richness.
//
//   --plasma  #7B2FBE = vec3(0.482, 0.184, 0.745)
//   --sacred  #C9A84C = vec3(0.788, 0.659, 0.298)
//   --neural  #00F5FF = vec3(0.0,   0.961, 1.0)
//   --aurora-1 #B44FE8 = vec3(0.706, 0.310, 0.910)
//
// Cycle: plasma → sacred → neural → aurora → plasma (loop)
// Connects to Gate sigil colors AND Myth Engine aurora ceiling.

uniform float uTime;
varying float vLife;
varying float vAlpha;

void main() {
  // Soft circle
  float d     = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float alpha = (1.0 - d * 2.0) * 0.75 * vAlpha;

  // Exact REALM palette (FIX 8)
  vec3 plasma = vec3(0.482, 0.184, 0.745); // --plasma  #7B2FBE
  vec3 sacred = vec3(0.788, 0.659, 0.298); // --sacred  #C9A84C
  vec3 neural = vec3(0.0,   0.961, 1.0);   // --neural  #00F5FF
  vec3 aurora = vec3(0.706, 0.310, 0.910); // --aurora-1 #B44FE8

  // 4-stop cycle
  vec3 col;
  if (vLife < 0.25)
    col = mix(plasma, sacred, vLife / 0.25);
  else if (vLife < 0.50)
    col = mix(sacred, neural, (vLife - 0.25) / 0.25);
  else if (vLife < 0.75)
    col = mix(neural, aurora, (vLife - 0.50) / 0.25);
  else
    col = mix(aurora, plasma, (vLife - 0.75) / 0.25);

  // Boost brightness — additive blending benefits from this
  col *= 1.3;

  gl_FragColor = vec4(col, alpha);
}
`,D={name:"Nitesh Varma",title:"Creative Technologist & Designer",manifesto:"I am the gap between a system and its soul. I build things that shouldn't be describable in a brief — tools that feel alive, interfaces that forget they're interfaces, and experiences that change the room they're in. Everything I make is an argument. The work is the thesis.",beliefs:["CONSTRAINTS ARE COLLABORATORS.","THE BEST INTERFACE DISAPPEARS.","SYSTEMS AND SOUL ARE NOT OPPOSITES.","BUILD WHAT CANNOT BE DESCRIBED IN A BRIEF.","EVERY PIXEL IS A DECISION."],masterBelief:"THE WORK TEACHES YOU THE WORK.",fallbackResponses:["Clarity is a form of courage. Most people avoid it.","The best work doesn't explain itself. It demonstrates.","Every constraint is a collaborator waiting to be understood.","Build what you wish existed. Someone else does too.","Systems and soul are not opposites — they never were.","The interface that disappears is the one that truly serves.","Speed is a design decision. So is waiting.","The prototype is the argument. Ship it.","Restraint is the hardest skill. Also the rarest.","What you choose not to show is as important as what you do.","Every pixel is a decision. Every decision is a signal.","The work teaches you the work. There is no other way.","Precision and warmth are not opposites. Pursue both.","Questions are better tools than answers.","Design without tension is decoration.","Taste is trained. Not given. Never given.","The gap between the system and the soul is where I live.","Make the thing you cannot describe. That's the one worth making.","Beauty is a function of truth. Elegance is truth under pressure.","I build to understand — and to be understood."]},He=["fuck","shit","ass","bitch","cunt","damn","hell","bastard"];function Ye(c){const t=c.toLowerCase();return He.some(e=>t.includes(e))}const we=`
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;function ae({position:c,rotation:t,args:e,shimmerSpeed:n=.04}){const i=r.useRef(),a=r.useMemo(()=>({uTime:{value:0},uShimmerSpeed:{value:n}}),[n]);return q(({clock:u})=>{i.current&&(i.current.uniforms.uTime.value=u.elapsedTime)}),s.jsxs("mesh",{position:c,rotation:t,children:[s.jsx("planeGeometry",{args:e}),s.jsx("shaderMaterial",{ref:i,vertexShader:we,fragmentShader:ze,uniforms:a})]})}function $e({sigilIntensity:c}){const t=r.useRef(),e=r.useMemo(()=>({uTime:{value:0}}),[]);return q(({clock:n})=>{t.current&&(t.current.uniforms.uTime.value=n.elapsedTime)}),s.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.51,0],children:[s.jsx("planeGeometry",{args:[10,10,1,1]}),s.jsx("shaderMaterial",{ref:t,vertexShader:we,fragmentShader:We,uniforms:e})]})}function Te({position:c,intensity:t,scale:e=1}){const n=r.useRef(),i=r.useRef(),a=r.useRef(),u=r.useRef(),f=r.useRef(),{circle1Points:h,circle2Points:m,outer1Points:S,outer2Points:C}=r.useMemo(()=>{const v=.38*e,x=v*1.25,g=v*.5,y=x*.5,A=64,P=[],_=[],F=[],M=[];for(let w=0;w<=A;w++){const T=w/A*Math.PI*2;P.push(new I(Math.cos(T)*v-g,0,Math.sin(T)*v)),_.push(new I(Math.cos(T)*v+g,0,Math.sin(T)*v)),F.push(new I(Math.cos(T)*x-y,0,Math.sin(T)*x)),M.push(new I(Math.cos(T)*x+y,0,Math.sin(T)*x))}return{circle1Points:P,circle2Points:_,outer1Points:F,outer2Points:M}},[e]);return q(({clock:v})=>{const x=v.elapsedTime,y=(.3+(Math.sin(x*Math.PI*.6)*.5+.5)*.3)*(t||1);i.current&&(i.current.opacity=y),a.current&&(a.current.opacity=y);const A=.1+(Math.sin(x*Math.PI*.6+Math.PI*.5)*.5+.5)*.1;u.current&&(u.current.opacity=A),f.current&&(f.current.opacity=A)}),s.jsxs("group",{ref:n,position:c,rotation:[-Math.PI/2,0,0],children:[s.jsxs("line",{children:[s.jsx("bufferGeometry",{setFromPoints:h}),s.jsx("lineBasicMaterial",{ref:i,color:"#C9A84C",transparent:!0,opacity:.9})]}),s.jsxs("line",{children:[s.jsx("bufferGeometry",{setFromPoints:m}),s.jsx("lineBasicMaterial",{ref:a,color:"#C9A84C",transparent:!0,opacity:.9})]}),s.jsxs("line",{children:[s.jsx("bufferGeometry",{setFromPoints:S}),s.jsx("lineBasicMaterial",{ref:u,color:"#00F5FF",transparent:!0,opacity:.15})]}),s.jsxs("line",{children:[s.jsx("bufferGeometry",{setFromPoints:C}),s.jsx("lineBasicMaterial",{ref:f,color:"#00F5FF",transparent:!0,opacity:.15})]})]})}function Xe({candleCount:c=3,intensityScale:t=1,visible:e=!0}){const n=r.useRef([]),i=r.useRef([0,0,0].map(()=>Math.random()*100)),a=r.useRef([0,0,0].map(()=>Math.random()*100)),u=r.useMemo(()=>c===1?[[0,.1,0]]:[[-.9,.1,.6],[.9,.1,.6],[0,.1,-.9]],[c]);return q((f,h)=>{n.current.forEach((m,S)=>{if(!m)return;i.current[S]+=h;const C=i.current[S],v=a.current[S],x=Math.sin(C*12+v)*.08,g=Math.sin(C*3.7+v*2)*.12,y=Math.random()*.04-.02;m.intensity=Math.max(.2,1.1*t+x+g+y),m.position.x=u[S][0]+Math.sin(C*2.1)*.05})}),e?s.jsxs(s.Fragment,{children:[u.map((f,h)=>s.jsx("pointLight",{ref:m=>n.current[h]=m,position:f,color:"#8BA4C9",intensity:1.1*t,distance:5,decay:2,castShadow:!1},h)),u.map((f,h)=>s.jsxs("mesh",{position:[f[0],-.45,f[2]],children:[s.jsx("cylinderGeometry",{args:[.04,.05,.12,8]}),s.jsx("meshStandardMaterial",{color:"#2A2018",roughness:.8})]},`holder-${h}`)),u.map((f,h)=>s.jsxs("mesh",{position:[f[0],f[1]+.08,f[2]],children:[s.jsx("sphereGeometry",{args:[.04,8,8]}),s.jsx("meshStandardMaterial",{color:"#00F5FF",emissive:"#C9A84C",emissiveIntensity:2.5,transparent:!0,opacity:.85})]},`flame-${h}`))]}):null}function Ke({inscriptionTexture:c}){const t=r.useRef();return q(({clock:e})=>{if(!t.current)return;const n=.3+(Math.sin(e.elapsedTime*Math.PI*.3)*.5+.5)*.3;t.current.emissiveIntensity=n}),s.jsxs("group",{children:[s.jsxs("mesh",{position:[0,-.5,0],children:[s.jsx("cylinderGeometry",{args:[1.2,1.2,.06,48]}),s.jsx("meshStandardMaterial",{ref:t,color:"#060C14",roughness:.05,metalness:.8,envMapIntensity:.6,emissive:"#C9A84C",emissiveIntensity:.3,emissiveMap:c||null})]}),s.jsxs("mesh",{position:[0,-.78,0],children:[s.jsx("cylinderGeometry",{args:[.08,.14,.56,12]}),s.jsx("meshStandardMaterial",{color:"#060C14",roughness:.1,metalness:.7})]}),s.jsx(Te,{position:[0,-.46,0],intensity:1,scale:1})]})}function Qe({shimmerSpeed:c}){return s.jsxs("group",{children:[s.jsx("ambientLight",{intensity:.05,color:"#0D1B2A"}),s.jsx(ae,{position:[0,5.5/2-.5,-8/2],rotation:[0,0,0],args:[8,5.5],shimmerSpeed:c}),s.jsx(ae,{position:[-8/2,5.5/2-.5,0],rotation:[0,Math.PI/2,0],args:[8,5.5],shimmerSpeed:c}),s.jsx(ae,{position:[8/2,5.5/2-.5,0],rotation:[0,-Math.PI/2,0],args:[8,5.5],shimmerSpeed:c}),s.jsx(ae,{position:[0,5.5/2-.5,8/2],rotation:[0,Math.PI,0],args:[8,5.5],shimmerSpeed:c}),s.jsx($e,{}),s.jsxs("mesh",{position:[0,5.5-.5,0],rotation:[Math.PI/2,0,0],children:[s.jsx("planeGeometry",{args:[10,10]}),s.jsx("meshBasicMaterial",{color:"#000000"})]}),s.jsx(Te,{position:[0,-.49,0],intensity:.5,scale:2.2}),s.jsx("fog",{attach:"fog",color:"#070508",near:3,far:10})]})}function Je(c){const t=[];for(let e=0;e<c*.18;e++){const n=Math.random()*Math.PI*2,i=Math.random()*.22;t.push(new I(Math.cos(n)*i,1.3+Math.sin(n)*i*.8,(Math.random()-.5)*.1))}for(let e=0;e<c*.14;e++)t.push(new I((Math.random()-.5)*.8,.95+Math.random()*.25,(Math.random()-.5)*.08));for(let e=0;e<c*.38;e++){const n=Math.random(),i=.28+n*.12;t.push(new I((Math.random()-.5)*i,.2+n*.75,(Math.random()-.5)*.07))}for(let e=0;e<c*.15;e++){const n=e%2===0?1:-1;t.push(new I(n*(.45+Math.random()*.15),.5+Math.random()*.4,(Math.random()-.5)*.08))}for(;t.length<c;)t.push(t[Math.floor(Math.random()*t.length)].clone().addScalar((Math.random()-.5)*.04));return t.slice(0,c)}function Ze({active:c,exchangeIndex:t,onFormed:e,rushCamera:n}){const i=r.useRef(),a=r.useRef(),u=r.useRef(null);r.useRef(null);const f=r.useRef(0),m=window.innerWidth<768?300:800,S=r.useMemo(()=>Je(180),[]),C=r.useMemo(()=>{const F=[];for(let M=0;M<m;M++)F.push(new I((Math.random()-.5)*6,Math.random()*3,-(Math.random()*3+1)));return F},[m]),{posArray:v,sizeArray:x}=r.useMemo(()=>{const F=new Float32Array(m*3),M=new Float32Array(m);for(let w=0;w<m;w++)F[w*3]=(Math.random()-.5)*6,F[w*3+1]=Math.random()*3,F[w*3+2]=-(Math.random()*3+1),M[w]=3+Math.random()*8;return{posArray:F,sizeArray:M}},[m]),g=r.useMemo(()=>Array.from({length:m},()=>new I),[m]),y=r.useRef(!1),A=r.useRef(!1);r.useEffect(()=>{n&&!y.current&&(y.current=!0)},[n]),r.useEffect(()=>{if(!c&&(A.current=!1,y.current=!1,u.current))for(let T=0;T<m;T++){const B=u.current[T*3]-0,b=u.current[T*3+1]-1,V=u.current[T*3+2]- -1.5,N=Math.sqrt(B*B+b*b+V*V)||1;g[T].set(B/N*(.05+Math.random()*.04),b/N*(.05+Math.random()*.04),V/N*(.05+Math.random()*.04))}},[c,m,g]);const P=1+(t>=5?.2:0);q((F,M)=>{if(!i.current)return;f.current+=M;const w=i.current.geometry.attributes.position,T=c?.04*P:.008,B=.88;for(let b=0;b<m;b++){const V=w.array[b*3],N=w.array[b*3+1],z=w.array[b*3+2];let j,H,Y;if(y.current)j=0,H=.5,Y=0;else if(c){const L=S[b%S.length];j=L.x*.6,H=L.y-.1,Y=L.z-2.5}else{const L=C[b];j=L.x,H=L.y,Y=L.z}const ce=(j-V)*T,ee=(H-N)*T,$=(Y-z)*T;g[b].x=(g[b].x+ce)*B,g[b].y=(g[b].y+ee)*B,g[b].z=(g[b].z+$)*B,w.array[b*3]=V+g[b].x+(Math.random()-.5)*.004,w.array[b*3+1]=N+g[b].y+(Math.random()-.5)*.004,w.array[b*3+2]=z+g[b].z}w.needsUpdate=!0,c&&!A.current&&f.current>1.8&&(A.current=!0,e==null||e()),a.current&&(a.current.uniforms.uTime.value=f.current)});const _=r.useMemo(()=>({uTime:{value:0}}),[]);return s.jsxs("points",{ref:i,children:[s.jsxs("bufferGeometry",{children:[s.jsx("bufferAttribute",{attach:"attributes-position",count:m,array:v,itemSize:3}),s.jsx("bufferAttribute",{attach:"attributes-aSize",count:m,array:x,itemSize:1})]}),s.jsx("shaderMaterial",{ref:a,vertexShader:Ue,fragmentShader:qe,uniforms:_,transparent:!0,blending:Le,depthWrite:!1})]})}function et({stage:c,scrollProgress:t}){const{camera:e}=Ve();r.useRef(new I(0,.3,2.2));const n=r.useRef(new I),i=r.useRef(new I(0,0,-1));return q(()=>{let a=0,u=.3,f=2.2,h=0,m=-.2,S=-1;if(c===2)a=0,u=.3,f=2.2,h=0,m=-.25,S=-1;else if(c===3){const C=Math.max(0,(t-.65)/.35);u=.3+C*5.5,f=2.2-C*.5,h=0,m=-.4-C*1.5,S=-1}n.current.set(a,u,f),e.position.lerp(n.current,.03),i.current.set(h,m,S),e.lookAt(i.current)}),null}class tt{constructor(){this.history=[],this.exchangeCount=0}async commune(t){this.exchangeCount++;const e=t.trim();if(!e)return null;const n=e.toLowerCase();if(n==="i love this")return{type:"LOVE",text:"then we're even."};if(n.includes("who are you"))return{type:"IDENTITY",text:D.manifesto};if(Ye(e))return{type:"PROFANITY",text:"that energy doesn't fit here."};if(e.split(/\s+/).length===1)return{type:"SINGLE_WORD",word:e};this.history.push({role:"user",content:e});const i=(this.exchangeCount-1)%D.fallbackResponses.length,a=D.fallbackResponses[i];return this.history.push({role:"assistant",content:a}),{type:this.exchangeCount===7?"SEVENTH":"NORMAL",text:a,exchange:this.exchangeCount}}reset(){this.history=[],this.exchangeCount=0}}let U=null,xe=null,he=null;function K(){const t=window.innerWidth<768?512:1024;return U||(U=document.createElement("canvas"),U.width=t,U.height=t,xe=U.getContext("2d"),he=new Ge(U)),{canvas:U,ctx:xe,texture:he}}function oe(){const{ctx:c,canvas:t}=K();c.clearRect(0,0,t.width,t.height),he.needsUpdate=!0}async function ge(c,t){const{ctx:e,canvas:n,texture:i}=K();e.clearRect(0,0,n.width,n.height);const a=n.width;e.font=`${Math.round(a*.025)}px "DM Mono", monospace`,e.fillStyle="transparent";const u=a*.75,f=c.split(" "),h=[];let m="";for(const v of f){const x=m?`${m} ${v}`:v;e.measureText(x).width>u&&m?(h.push(m),m=v):m=x}m&&h.push(m);const S=a*.038,C=a*.38-h.length*S/2;e.shadowBlur=4,e.shadowColor="rgba(201, 168, 76, 0.4)",e.fillStyle="#C9A84C",e.textAlign="center",e.textBaseline="middle";for(let v=0;v<h.length;v++){const x=h[v],g=C+v*S;for(let y=0;y<x.length;y++){const A=a/2-e.measureText(x).width/2+e.measureText(x.slice(0,y)).width,P=(Math.random()-.5)*2;e.fillText(x[y],A+e.measureText(x[y]).width/2,g+P),i.needsUpdate=!0,t==null||t(),await new Promise(_=>setTimeout(_,40))}}}async function ye(c=8e3){const{ctx:t,canvas:e,texture:n}=K(),i=30,a=c/i;for(let u=0;u<i;u++)t.globalAlpha=1-u/i,t.globalCompositeOperation="destination-out",t.fillStyle=`rgba(0,0,0,${1/i})`,t.fillRect(0,0,e.width,e.height),t.globalCompositeOperation="source-over",n.needsUpdate=!0,await new Promise(f=>setTimeout(f,a));t.clearRect(0,0,e.width,e.height),n.needsUpdate=!0}function nt({stage:c,scrollProgress:t,exchangeIndex:e,candleIntensityScale:n,shimmerSpeed:i,presenceActive:a,rushCamera:u,onPresenceFormed:f,inscriptionTex:h}){return s.jsxs(s.Fragment,{children:[s.jsx(Oe,{makeDefault:!0,position:[0,.3,2.2],fov:68,near:.1,far:30}),s.jsx(et,{stage:c,scrollProgress:t}),s.jsx(Qe,{shimmerSpeed:i}),s.jsx(Xe,{candleCount:window.innerWidth<768?1:3,intensityScale:n}),s.jsx(Ke,{inscriptionTexture:h}),s.jsx(Ze,{active:a,exchangeIndex:e,onFormed:f,rushCamera:u})]})}function ct(){const c=r.useRef(null),t=r.useRef(new tt),e=r.useRef(!1),[n,i]=r.useState(0),[a,u]=r.useState(1),[f,h]=r.useState(1),[m,S]=r.useState(.04),C=r.useRef([]),v=r.useRef(null),x=r.useRef(!1),[g,y]=r.useState(!1),[A,P]=r.useState(!1),[_,F]=r.useState(!1),M=r.useRef(null),w=r.useRef(null),T=r.useRef(null),B=r.useRef(null),[b,V]=r.useState([]),N=r.useRef(!1),z=r.useRef(null),j=r.useRef(null),[H,Y]=r.useState(""),[ce,ee]=r.useState(!1),$=r.useRef(null),[L,te]=r.useState(!1),[be,fe]=r.useState(!1),[Re,le]=r.useState(0),[Se,de]=r.useState([]),Q=r.useRef([]),J=r.useRef(null),[ue,Ce]=r.useState(!1),[me,Me]=r.useState(!1),X=r.useRef([]),ne=r.useRef(null),[Ee,_e]=r.useState(null),[st,Ae]=r.useState(!1);r.useEffect(()=>{const{texture:o}=K();_e(o);const l=requestAnimationFrame(()=>Ae(!0));return()=>{cancelAnimationFrame(l),oe()}},[]);const O=r.useCallback(async()=>{e.current||(e.current=!0,await E.init(),E.startBaseTone(),E.startCandleCrackle())},[]);r.useEffect(()=>{const o=()=>O();return window.addEventListener("click",o,{once:!0}),window.addEventListener("keydown",o,{once:!0}),()=>{window.removeEventListener("click",o),window.removeEventListener("keydown",o)}},[O]);const W=r.useRef(1),pe=r.useRef(!1);r.useEffect(()=>{const o=setTimeout(()=>{if(!c.current)return;const l=Ne.create({trigger:c.current,start:"top top",end:"+=500vh",pin:!0,scrub:.5,anticipatePin:1,invalidateOnRefresh:!0,onUpdate:p=>{const d=p.progress;if(i(d),d>=.2&&!N.current&&W.current<2){W.current=2;const k=ie(),G=p.start+(p.end-p.start)*.2;p.scroll()>G&&k&&k.scrollTo(G,{immediate:!0}),k&&k.stop(),u(2)}d>=.18&&!pe.current&&W.current===1&&(pe.current=!0,v.current&&(R.to(v.current,{color:"rgba(201,168,76,0.6)",duration:1.5}),setTimeout(()=>{E.speak("tell me what you're looking for."),setTimeout(()=>{v.current&&R.to(v.current,{color:"rgba(201,168,76,0)",duration:2})},3e3)},800))),N.current&&d>=.65&&W.current<3&&(W.current=3,u(3))}});o._kill=()=>l.kill()},50);return()=>{var l;clearTimeout(o),(l=o._kill)==null||l.call(o)}},[]),r.useEffect(()=>{const o=()=>O();return window.addEventListener("click",o,{once:!0}),window.addEventListener("keydown",o,{once:!0}),()=>{window.removeEventListener("click",o),window.removeEventListener("keydown",o)}},[O]),r.useEffect(()=>{if(!c.current)return;const o=new IntersectionObserver(([l])=>{if(l.isIntersecting&&!x.current){x.current=!0,O();const p=["you've come a long way.","most people don't make it here.","this room is different.","here, i speak first."],d=[800,2600,4600,6e3];p.forEach((k,G)=>{setTimeout(()=>{C.current[G]&&R.to(C.current[G],{color:"rgba(201,168,76,0.85)",duration:.8})},d[G]),setTimeout(()=>{C.current[G]&&R.to(C.current[G],{color:"rgba(201,168,76,0)",duration:1.2})},d[G]+2800)}),o.disconnect()}},{threshold:.1,rootMargin:"200px 0px"});return o.observe(c.current),()=>o.disconnect()},[O]),r.useEffect(()=>{if(a===2&&!g){y(!0);const o="TYPE ANYTHING. PRESS ENTER.";let l=0;setTimeout(()=>{if(!w.current)return;w.current.textContent="";const d=setInterval(()=>{l<o.length&&w.current?(w.current.textContent+=o[l],l++):(clearInterval(d),setTimeout(()=>{var k;return(k=M.current)==null?void 0:k.focus()},200))},40)},300),z.current=setTimeout(()=>{Z(),j.current&&R.to(j.current,{opacity:1,duration:1.5}),setTimeout(()=>{j.current&&R.to(j.current,{opacity:0,duration:2})},6e3)},2e4)}},[a,g]);const Z=r.useCallback(()=>{if(N.current)return;N.current=!0,W.current=Math.max(W.current,2),z.current&&clearTimeout(z.current);const o=ie();o&&o.start()},[]),Pe=r.useCallback(async o=>{var k,G;if(o.key!=="Enter")return;const l=(G=(k=M.current)==null?void 0:k.value)==null?void 0:G.trim();if(!l||A)return;P(!0),await O(),E.strikeEnterBell(),h(.5),M.current&&R.to(M.current,{scaleY:0,duration:.3,transformOrigin:"top"}),T.current&&T.current.classList.remove("visible");const p=await t.current.commune(l),d=t.current.exchangeCount;if(le(d),V(Array.from({length:d},(rt,Fe)=>Fe)),d===2&&h(.95),d===3&&S(.048),!p){h(1),P(!1);return}if(p.type==="SINGLE_WORD"){Y(p.word),ee(!0),$.current&&(R.fromTo($.current,{opacity:0,scale:.6},{opacity:1,scale:1,duration:.6,ease:"power3.out"}),setTimeout(()=>{R.to($.current,{opacity:0,scale:1.4,duration:1.2,ease:"power2.in",onComplete:()=>ee(!1)})},2e3)),h(1),se(),P(!1);return}if(p.type==="PROFANITY"){h(.3),setTimeout(()=>h(1),2e3),ve(p.text),se(),P(!1);return}if(p.type==="LOVE"){h(1.6),setTimeout(()=>h(1),2500),ve(p.text),se(),P(!1);return}if(p.type==="SEVENTH"){await ke(p.text);return}await je(p.text),h(1),d>=7?(F(!0),y(!1)):(se(),P(!1),T.current&&T.current.classList.add("visible"))},[A,O]);function se(){M.current&&(R.set(M.current,{scaleY:1,clearProps:"all"}),M.current.value="")}function ve(o){const{texture:l}=K();ge(o,()=>{l.needsUpdate=!0}),setTimeout(()=>ye(4e3),4e3)}async function je(o){te(!0),E.startPresenceDrone(),B.current&&B.current.classList.add("visible"),await new Promise(p=>setTimeout(p,1400)),B.current&&B.current.classList.remove("visible");const{texture:l}=K();E.startPenWhisper(),E.speak(o),await ge(o,()=>{l.needsUpdate=!0}),E.stopPenWhisper(),await new Promise(p=>setTimeout(p,3e3)),te(!1),E.stopPresenceDrone(),await new Promise(p=>setTimeout(p,1500)),ye(8e3),h(1)}async function ke(o){var p;E.startSeventhExchangeChord(),h(0),E.stopCandleCrackle(),await new Promise(d=>setTimeout(d,4e3));const l=((p=o.match(/[^.!?]+[.!?]?/g))==null?void 0:p.filter(Boolean).slice(0,4))||[o];de(l);for(let d=0;d<l.length;d++)E.addChordNote(d),await new Promise(k=>setTimeout(k,800)),Q.current[d]&&R.fromTo(Q.current[d],{width:0,color:"#FFFFFF"},{width:"auto",duration:1,ease:"none",onComplete:()=>{R.to(Q.current[d],{color:"#B44FE8",duration:.8,ease:"power2.out",onComplete:()=>{R.to(Q.current[d],{color:"#C9A84C",duration:1.2,ease:"power2.inOut"})}})}});await new Promise(d=>setTimeout(d,1e3));for(let d=0;d<3;d++)await new Promise(k=>setTimeout(k,600)),h(k=>Math.min(1,k+.35));E.startCandleCrackle(),fe(!0),E.swellAndCutChord(.3),await new Promise(d=>setTimeout(d,1500)),J.current&&R.to(J.current,{color:"rgba(201,168,76,0.6)",duration:1}),await new Promise(d=>setTimeout(d,3e3)),fe(!1),te(!1),de([]),J.current&&R.to(J.current,{color:"rgba(201,168,76,0)",duration:1}),le(0),t.current.reset(),V([]),oe(),Z(),F(!0),y(!1)}r.useEffect(()=>{a===3&&!ue&&(Ce(!0),D.beliefs.forEach((o,l)=>{setTimeout(()=>{X.current[l]&&(R.to(X.current[l],{color:"rgba(201,168,76,0.7)",duration:2}),E.strikeBelief(l))},l*1200)}),setTimeout(()=>{X.current[5]&&(R.to(X.current[5],{color:"rgba(201,168,76,0.8)",duration:2}),E.strikeBelief(5))},D.beliefs.length*1200+800),E.baseToneAscend(12))},[a,ue]),r.useEffect(()=>{a===3&&n>=.9&&!me&&(Me(!0),ne.current&&(R.fromTo(ne.current,{opacity:0},{opacity:1,duration:1.2}),setTimeout(()=>{R.to(ne.current,{opacity:0,duration:1.5})},2e3)))},[a,n,me]),r.useEffect(()=>{const o=d=>{d.key==="Escape"&&!N.current&&(Z(),j.current&&(R.to(j.current,{opacity:1,duration:.8}),setTimeout(()=>R.to(j.current,{opacity:0,duration:1.5}),4e3)))};let l=null;const p=d=>{!N.current&&W.current===2&&d.deltaY>0&&(j.current&&R.to(j.current,{opacity:1,duration:.6}),clearTimeout(l),l=setTimeout(()=>{Z(),setTimeout(()=>{j.current&&R.to(j.current,{opacity:0,duration:1.5})},3e3)},1500))};return window.addEventListener("keyup",o),window.addEventListener("wheel",p,{passive:!0}),()=>{window.removeEventListener("keyup",o),window.removeEventListener("wheel",p),clearTimeout(l)}},[Z]),r.useEffect(()=>()=>{E.dispose(),oe(),z.current&&clearTimeout(z.current);const o=ie();o&&o.start()},[]);const re=r.useRef(null);return r.useEffect(()=>{n>0&&n<.05&&re.current&&R.fromTo(re.current,{opacity:0},{opacity:1,duration:1.5,onComplete:()=>{setTimeout(()=>{R.to(re.current,{opacity:0,duration:2})},2e3)}})},[n>0&&n<.02]),s.jsxs("div",{className:"seance-realm",ref:c,onClick:O,children:[s.jsx("div",{className:"seance-title",ref:re,children:"V. THE SÉANCE"}),s.jsx("div",{className:`seance-label ${a===2?"dim":""}`,children:"V — THE SÉANCE"}),s.jsx("div",{className:"seance-ticks",children:Array.from({length:7},(o,l)=>s.jsx("div",{className:`seance-tick ${b.length>l?"active":""}`},l))}),s.jsx("div",{className:"table-text-container",children:["you've come a long way.","most people don't make it here.","this room is different.","here, i speak first."].map((o,l)=>s.jsx("span",{className:"table-line",ref:p=>C.current[l]=p,children:o},l))}),s.jsx("div",{className:"seance-voice-prompt",ref:v,children:"tell me what you're looking for."}),s.jsxs("div",{className:`communion-wrapper ${g&&!_?"visible":""}`,children:[s.jsx("div",{className:"communion-prompt",ref:w}),s.jsx("input",{ref:M,className:"communion-input",type:"text",placeholder:"a question. a thought. a word.","aria-label":"Type your message to the Séance",disabled:A,onKeyDown:Pe,autoComplete:"off",spellCheck:"false"}),s.jsx("div",{className:"communion-hint",ref:T,children:"ask again. or let it settle."})]}),s.jsx("div",{className:"seance-thinking",ref:B,children:". . ."}),s.jsxs("div",{className:`seance-session-complete ${_?"visible":""}`,children:[s.jsxs("p",{children:["this session is complete.",s.jsx("br",{}),"return when ready to begin again."]}),s.jsx("button",{className:"seance-reset-btn",onClick:()=>{t.current.reset(),F(!1),V([]),oe(),le(0),y(!0),N.current=!1;const o=ie();o&&o.stop(),setTimeout(()=>{var l;return(l=M.current)==null?void 0:l.focus()},400)},children:"[ RESET ]"})]}),ce&&s.jsx("div",{className:"word-eruption",ref:$,style:{opacity:0},children:s.jsx("span",{className:"word-eruption-text",children:H})}),s.jsx("div",{className:"wall-inscription-overlay",children:Se.map((o,l)=>{const p=["north","east","south","west"];return s.jsx("div",{className:`wall-sentence ${p[l]||"north"}`,ref:d=>Q.current[l]=d,children:o},l)})}),s.jsx("div",{className:"seance-final-text",ref:J,children:"this conversation will not be remembered. but it happened."}),ue&&s.jsxs("div",{className:"seance-beliefs-overlay",children:[D.beliefs.map((o,l)=>{const p=["wall-n","wall-e","wall-s","wall-w"];return s.jsx("div",{className:`belief-text ${p[l]}`,ref:d=>X.current[l]=d,children:o},l)}),s.jsx("div",{className:"belief-text floor",ref:o=>X.current[5]=o,children:D.masterBelief})]}),s.jsxs("div",{className:"seance-name-reveal",ref:ne,children:[s.jsx("h2",{children:D.name}),s.jsx("p",{children:D.title})]}),s.jsx("div",{className:"seance-nudge",ref:j,children:"you may move on."}),s.jsx(Be,{className:"seance-canvas",gl:{antialias:!0,alpha:!1,toneMapping:Ie},dpr:[1,window.innerWidth<768?1.5:2],style:{position:"absolute",inset:0},children:s.jsx(nt,{stage:a,scrollProgress:n,exchangeIndex:Re,candleIntensityScale:f,shimmerSpeed:m,presenceActive:L,rushCamera:be,onPresenceFormed:()=>{te(!0)},inscriptionTex:Ee})})]})}export{ct as default};
