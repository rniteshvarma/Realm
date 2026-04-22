import{r as c,u as T,V as A,S as P,j as u,C,g as O,a1 as M,a as S}from"./index-CIeHNeq0.js";import{w as V,V as G,E as H,C as j,B as L}from"./ChromaticAberration-JD9vs8xN.js";import{O as U,B as z}from"./Bloom-CYa8uHfX.js";import"./Fbo-Bw4Tt_vM.js";const N=V(G),W=`// singularity.frag.glsl  v4 — KERR warm palette
//
// Implements BRIEF 10 visual requirements:
//   • Warm thermal palette: dark red → orange → gold → white-hot
//   • Power-4 Doppler: left side blazes, right side near-black
//   • 5-octave FBM plasma filaments for disk texture
//   • Warm void background (#1C0A00 tinted, not pure black)
//   • Photon ring in warm cream (#FFE8B0)
//   • uSuckIn: UV warp + vignette collapse for the finale
//   • uOrbitAngle: rotates FBM texture, creating orbit parallax
//   • Camera distance/height → zoom + inclination

precision highp float;

uniform float uTime;
uniform vec2  uResolution;
uniform vec2  uMouse;
uniform float uOrbitAngle;      // camera orbit angle (slowly drifts, controls FBM parallax)
uniform float uCameraDistance;  // physical distance units (30 → 0.5)
uniform float uCameraHeight;    // elevation above disk plane (6 → 0.3)
uniform float uSuckIn;          // 0→1 finale pull
uniform float uDiskFade;        // 1→0 at very end

varying vec2 vUv;

#define PI  3.14159265359
#define EPS 0.0001

// ─── Noise / FBM ─────────────────────────────────────────────────────────────

float h(vec2 p) {
    p  = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 19.19);
    return fract(p.x * p.y);
}

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(h(i), h(i + vec2(1,0)), f.x),
               mix(h(i + vec2(0,1)), h(i + vec2(1,1)), f.x), f.y);
}

// 5-octave FBM — matches brief spec for plasma filaments
float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p  = p * 2.1 + vec2(1.7, 9.2);
        a *= 0.5;
    }
    return v;
}

// ─── Warm thermal color (KERR palette from BRIEF 10) ─────────────────────────

vec3 thermalColor(float temp) {
    // dark red → orange → hot gold → white-hot
    vec3 darkRed  = vec3(0.40, 0.04, 0.00);   // outer disk, receding side
    vec3 orange   = vec3(0.80, 0.35, 0.00);   // mid disk
    vec3 hotGold  = vec3(1.00, 0.71, 0.20);   // inner disk (#FFD580)
    vec3 whiteHot = vec3(1.00, 0.95, 0.85);   // core plasma (>10^10 K)

    if (temp < 0.30) return mix(darkRed, orange,  temp / 0.30);
    if (temp < 0.65) return mix(orange,  hotGold,  (temp - 0.30) / 0.35);
    return             mix(hotGold, whiteHot, (temp - 0.65) / 0.35);
}

// ─── Warm star field ─────────────────────────────────────────────────────────

vec3 stars(vec2 uv) {
    vec3 c = vec3(0.0);
    for (float s = 0.0; s < 3.0; s++) {
        float sc  = 55.0 + s * 88.0;
        vec2  g   = floor(uv * sc);
        vec2  f   = fract(uv * sc);
        float bv  = h(g + s * 17.3 + 0.5);
        if (bv > 0.55) {
            float br  = pow((bv - 0.55) / 0.45, 1.8);
            vec2  sp  = vec2(h(g + s * 3.1), h(g + s * 4.7 + 1.3));
            float d   = length(f - sp);
            float st  = br * smoothstep(0.12, 0.0, d);
            // Warm tint — stars near disk glow slightly orange
            float ti = h(g + s * 6.1 + 8.7);
            vec3 sc2 = ti > 0.75 ? vec3(1.0, 0.92, 0.75)   // warm white
                     : ti > 0.40 ? vec3(0.95, 0.95, 0.90)  // near-white
                                 : vec3(0.90, 0.88, 0.82);  // faint warm
            c += sc2 * st;
        }
    }
    return c;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

void main() {
    float asp   = uResolution.x / uResolution.y;
    vec2  uv    = vUv - 0.5;
    uv.x *= asp;

    // Mouse parallax (subtle)
    uv -= (uMouse - 0.5) * vec2(asp, 1.0) * 0.025;

    // ── Suck-in UV warp ──────────────────────────────────────────────────────
    // As uSuckIn → 1, all pixels collapse toward center
    if (uSuckIn > 0.0) {
        float pull    = uSuckIn * uSuckIn;       // ease-in curve
        float warpStr = 1.0 - pull * 0.85;
        uv *= warpStr;
    }

    // ── Derive zoom and inclination from camera params ────────────────────────
    // At dist=30, scale=1.0. Gets larger as camera approaches.
    float scale = clamp(30.0 / uCameraDistance, 0.2, 20.0);
    // During suck-in: extra zoom as camera rushes in
    if (uSuckIn > 0.0) {
        scale *= 1.0 + uSuckIn * uSuckIn * 1.5;
    }
    uv /= scale;

    float r   = length(uv);
    float phi = atan(uv.y, uv.x);

    // Inclination: elevation angle above disk plane
    float elev = atan(uCameraHeight, max(uCameraDistance, 0.1));
    float sinE = max(sin(elev), 0.025);     // 0 = edge-on, 1 = face-on

    // ── BH visual parameters (fixed in normalised screen units) ──────────────
    float BHR  = 0.13;    // event horizon shadow radius
    float PHR  = 0.154;   // photon sphere (warm cream ring)
    float DIN  = 0.28;    // disk inner edge (ISCO-like)
    float DOUT = 0.72;    // disk outer edge

    // ── Warm void background + lensed stars ──────────────────────────────────
    // Background is dark burgundy-black, not pure #000 — disk warmth fills space
    vec3 col = vec3(0.020, 0.004, 0.000);   // #1C0A00 base

    // Gravitational-lensed star UV
    vec2 bgUV;
    if (r < BHR * 0.5) {
        bgUV = -normalize(uv + EPS) * BHR * 2.5;
    } else {
        float lens = BHR * BHR * 1.5 / max(r * r, BHR * BHR * 0.2);
        bgUV = uv * scale + normalize(uv) * lens;
    }
    // Rotate star field with orbit (parallax)
    float sinO = sin(uOrbitAngle), cosO = cos(uOrbitAngle);
    vec2 bgUVrot = vec2(bgUV.x * cosO - bgUV.y * sinO,
                        bgUV.x * sinO + bgUV.y * cosO);

    col += stars(bgUVrot * 0.3 + vec2(uTime * 0.0012, 0.0005));

    // ── Disk: inclined projection ─────────────────────────────────────────────
    // Camera at elevation \`elev\` above disk plane:
    //   disk_z = screen_y / sin(elev)
    float dX  = uv.x;
    float dZ  = uv.y / sinE;
    float dR  = sqrt(dX * dX + dZ * dZ);
    float dPhi = atan(dZ, dX);

    bool nearSide = (dZ < 0.0);   // near side: between camera and BH

    if (dR > DIN && dR < DOUT && uDiskFade > 0.01) {
        float nR   = (dR - DIN) / (DOUT - DIN);
        float temp = pow(1.0 - nR, 0.75);   // T ∝ r^(-3/4)

        // Keplerian rotation (CCW, orbital speed falls with radius)
        float kV     = 0.38 / pow(max(dR / DIN, 1.0), 0.75);
        // World-angle texture: shifts with orbit angle so FBM rotates as camera orbits
        float orbPhi = dPhi + uOrbitAngle - uTime * kV;

        // ── 5-octave FBM turbulence (BRIEF 10 'plasma filaments') ──────────
        vec2 diskUV  = vec2(orbPhi / (2.0 * PI) + 0.5, nR);
        float turb   = fbm(diskUV * vec2(8.0, 4.0) + uTime * 0.04);
        float bright = fbm(diskUV * vec2(16.0, 6.0) + uTime * 0.07);
        float filam  = pow(bright, 2.5) * 2.0;    // bright streaked filaments

        temp = clamp(temp * (0.5 + turb * 0.5) + filam * 0.3, 0.0, 1.0);

        // Density envelope
        float dens = smoothstep(0.0, 0.25, 1.0 - nR)
                   * smoothstep(DIN, DIN * 1.4, dR)
                   * (0.4 + turb * 0.85);

        // ── DOPPLER BEAMING (power-4, KERR enhanced) ────────────────────────
        // Orbital velocity Keplerian + frame-dragging correction
        float vOrb = sqrt(1.0 / max(dR, DIN)) * (1.0 + 0.9 / pow(max(dR, DIN), 1.5));
        vOrb = min(vOrb, 0.95);
        float beta = vOrb * 0.6;   // visual scale factor

        // Approaching gas always on LEFT of screen (cos(phi) = -1 at phi=PI = left)
        // cosTheta formula validated from Kerr geodesic projection
        float cosTheta = -cos(dPhi);
        float doppler  = pow(max(1.0 - beta * cosTheta, 0.04), -4.0);
        doppler = clamp(doppler, 0.1, 8.0);

        // ── Gravitational redshift ───────────────────────────────────────────
        // Light loses energy climbing out (RS=2*BHR in visual units)
        float redshift = sqrt(1.0 - 2.0 * BHR / max(dR, BHR * 2.1));
        redshift = max(0.1, redshift);

        // ── Thickness in screen y ────────────────────────────────────────────
        float scH   = dR * 0.05 * sinE;
        float thick = exp(-uv.y * uv.y / max(scH * scH * 4.0, EPS));
        float vis   = nearSide ? 1.0 : 0.40;   // far side partially blocked

        vec3 dc = thermalColor(temp) * dens * doppler * redshift * thick * vis * 3.5;
        col += dc * uDiskFade;


    }

    // ── Lensed ghost image (disk visible above/below event horizon) ───────────
    if (uDiskFade > 0.01) {
        float gR     = PHR * 1.10;
        float gW     = 0.016;
        float gMask  = exp(-(r - gR) * (r - gR) / (gW * gW));

        float gPhi   = phi + PI;
        float gKV    = 0.38 / pow(max(gR / DIN, 1.0), 0.75);
        float gOrb   = gPhi + uOrbitAngle - uTime * gKV;
        vec2  gUV    = vec2(gOrb / (2.0 * PI) + 0.5, 0.5);
        float turbG  = fbm(gUV * vec2(8.0, 4.0) + uTime * 0.04) * 0.5 + 0.5;

        float cosG   = -cos(phi + PI);
        float vRelG  = 0.62;
        float doppG  = pow(max(1.0 - vRelG * cosG, 0.04), -4.0);
        doppG = clamp(doppG, 0.1, 8.0);

        col += thermalColor(0.88) * gMask * turbG * doppG * 1.5 * uDiskFade;
    }

    // ── Photon ring (warm cream #FFE8B0 per BRIEF 10) ────────────────────────
    {
        float pDist = abs(r - PHR);
        float pRing = exp(-pDist * pDist / (0.0018 * 0.0018)) * 16.0;
        col += vec3(1.0, 0.91, 0.69) * pRing;   // warm cream
    }

    // ── Event horizon — hard-edge pure black (no soft fade) ──────────────────
    // BRIEF 10: "a clean hard BLACK oval — not fuzzy, not gradient"
    float hMask = step(BHR, r);        // hard step, not smoothstep
    col = mix(vec3(0.0), col, hMask);

    // Very thin soft ramp just at the edge to avoid aliasing (1px)
    float edgeAA = smoothstep(BHR * 0.97, BHR * 1.03, r);
    col = mix(vec3(0.0), col, edgeAA);

    // ── Warm disk ambient glow in surrounding space ───────────────────────────
    // This makes background look dark burgundy rather than pure black
    float diskGlow = exp(-length(uv) * 1.8) * 0.07 * uDiskFade;
    col += vec3(diskGlow * 0.55, diskGlow * 0.09, 0.0);

    // ── Suck-in vignette (Phase B–D in brief) ────────────────────────────────
    {
        float edgeDark  = uSuckIn * 0.95;
        float vigLen    = length(vUv - 0.5);
        float vignette  = 1.0 - vigLen * (1.2 + edgeDark * 3.0);
        vignette = pow(clamp(vignette, 0.0, 1.0), 1.0 + edgeDark * 4.0);
        col *= vignette;
    }

    // ── Tone mapping + gamma ──────────────────────────────────────────────────
    col  = col / (col + 0.70);             // Reinhard
    col  = pow(max(col, 0.0), vec3(0.88)); // gamma ~1/0.88

    gl_FragColor = vec4(col, 1.0);
}
`,q=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;function X({effectsRef:g}){const n=c.useRef(),t=c.useRef();return S(()=>{n.current&&(n.current.intensity=g.current.bloom),t.current&&(t.current.offset.x=g.current.chromaX,t.current.offset.y=g.current.chromaY)}),u.jsxs(H,{children:[u.jsx(z,{ref:n,intensity:1.2,threshold:.12,smoothing:.35,radius:1.4,luminanceThreshold:.1,mipmapBlur:!0}),u.jsx(j,{ref:t,offset:[.001,.001],radialModulation:!0,modulationOffset:.5}),u.jsx(N,{offset:.3,darkness:.6,blendFunction:L.NORMAL})]})}function K({uniforms:g,effectsRef:n,performanceLow:t}){const o=c.useRef();return S(a=>{o.current&&(o.current.uniforms.uTime.value=a.clock.elapsedTime)}),u.jsxs(u.Fragment,{children:[u.jsxs("mesh",{children:[u.jsx("planeGeometry",{args:[2,2]}),u.jsx("shaderMaterial",{ref:o,vertexShader:q,fragmentShader:W,uniforms:g,depthWrite:!1,depthTest:!1})]}),!t&&u.jsx(X,{effectsRef:n})]})}class Y{constructor(){this.ctx=null,this.nodes={},this.initialized=!1}init(){if(!this.initialized)try{this.ctx=new(window.AudioContext||window.webkitAudioContext);const n=this.ctx,t=n.createOscillator();t.frequency.value=28;const o=n.createGain();o.gain.value=0,t.connect(o),o.connect(n.destination),t.start();const a=n.createOscillator();a.type="triangle",a.frequency.value=3500;const v=n.createOscillator();v.frequency.value=.4;const h=n.createGain();h.gain.value=.008;const f=n.createGain();f.gain.value=0,v.connect(h),h.connect(f.gain),a.connect(f),f.connect(n.destination),a.start(),v.start(),this.nodes={subGain:o,diskGain:f,diskOsc:a,subOsc:t},this.initialized=!0}catch(n){console.warn("SingularityAudio:",n)}}startAmbiance(){if(!this.initialized)return;const n=this.ctx.currentTime;this.nodes.diskGain.gain.setTargetAtTime(.022,n,3)}beginSuckInPhaseA(){if(!this.initialized)return;const n=this.ctx.currentTime;this.nodes.subGain.gain.setTargetAtTime(.02,n,2)}beginSuckInPhaseB(n){if(!this.initialized)return;const t=this.ctx.currentTime;this.nodes.subGain.gain.linearRampToValueAtTime(.06,t+n)}beginSuckInPhaseC(n){if(!this.initialized)return;const t=this.ctx.currentTime;this.nodes.subGain.gain.linearRampToValueAtTime(.15,t+n);const o=this.ctx.createOscillator(),a=this.ctx.createGain();o.type="sine",o.frequency.value=2e3,a.gain.setValueAtTime(0,t),a.gain.linearRampToValueAtTime(.06,t+.3),a.gain.linearRampToValueAtTime(0,t+n),o.frequency.linearRampToValueAtTime(200,t+n),o.connect(a),a.connect(this.ctx.destination),o.start(t),o.stop(t+n)}cutAllSounds(){if(!this.initialized)return;const n=this.ctx.currentTime;Object.values(this.nodes).forEach(t=>{t&&t.gain&&t.gain.setTargetAtTime(0,n,.05)})}playTone(n,t,o){if(!this.initialized)return;const a=this.ctx.currentTime,v=this.ctx.createOscillator(),h=this.ctx.createGain();v.type="sine",v.frequency.value=n,h.gain.setValueAtTime(0,a),h.gain.linearRampToValueAtTime(t,a+.3),h.gain.setValueAtTime(t,a+o),h.gain.linearRampToValueAtTime(0,a+o+.5),v.connect(h),h.connect(this.ctx.destination),v.start(a),v.stop(a+o+.7)}stop(){if(!this.initialized)return;const n=this.ctx.currentTime;Object.values(this.nodes).forEach(t=>{t&&t.gain&&t.gain.setTargetAtTime(0,n,.5)})}}function Q(){const g=c.useRef(null),n=c.useRef(null),t=c.useRef(null),o=c.useRef(null),a=T(i=>i.soundEnabled),v=T(i=>i.performanceLow),h=c.useRef({x:.5,y:.5}),f=c.useRef(null),m=c.useRef({dist:30,height:6,orb:0}),R=c.useRef(0),w=c.useRef(1),y=c.useRef(0),p=c.useRef({bloom:1.2,chromaX:.001,chromaY:.001}),x=c.useRef(!1),k=c.useRef(!1),[D,E]=c.useState(!1),l=c.useMemo(()=>({uTime:{value:0},uResolution:{value:new A(window.innerWidth,window.innerHeight)},uMouse:{value:new A(.5,.5)},uOrbitAngle:{value:0},uCameraDistance:{value:30},uCameraHeight:{value:6},uSuckIn:{value:0},uDiskFade:{value:1}}),[]);c.useEffect(()=>{const i=()=>l.uResolution.value.set(window.innerWidth,window.innerHeight);return window.addEventListener("resize",i),()=>window.removeEventListener("resize",i)},[l]),c.useEffect(()=>{const i=s=>{h.current.x=s.clientX/window.innerWidth,h.current.y=1-s.clientY/window.innerHeight};return window.addEventListener("mousemove",i,{passive:!0}),()=>window.removeEventListener("mousemove",i)},[]),c.useEffect(()=>{f.current=new Y},[]),c.useEffect(()=>{var i;a&&f.current?(f.current.init(),f.current.startAmbiance()):(i=f.current)==null||i.stop()},[a]),c.useEffect(()=>{let i;const s=(e,r,b)=>e+(r-e)*b,d=()=>{if(l.uMouse.value.set(h.current.x,h.current.y),k.current||(l.uCameraDistance.value=s(l.uCameraDistance.value,m.current.dist,.03),l.uCameraHeight.value=s(l.uCameraHeight.value,m.current.height,.03)),l.uOrbitAngle.value=s(l.uOrbitAngle.value,m.current.orb,.035),k.current||(l.uSuckIn.value=s(l.uSuckIn.value,R.current,.02)),l.uDiskFade.value=s(l.uDiskFade.value,w.current,.015),y.current+=.0012,o.current){const e=y.current,r=o.current.querySelector(".orbit-dot");r&&(r.setAttribute("cx",(30+Math.cos(e*Math.PI*2)*24).toFixed(1)),r.setAttribute("cy",(30+Math.sin(e*Math.PI*2)*24).toFixed(1)))}if(t.current){const e=l.uCameraDistance.value;t.current.textContent=`r = ${e.toFixed(1)} M`}i=requestAnimationFrame(d)};return i=requestAnimationFrame(d),()=>cancelAnimationFrame(i)},[l]),c.useEffect(()=>{const i=g.current;if(!i)return;const s=new IntersectionObserver(([d])=>{d.isIntersecting&&(E(!0),s.disconnect())},{rootMargin:"300px"});return s.observe(i),()=>s.disconnect()},[]);const B=()=>{var d;if(x.current)return;x.current=!0,k.current=!0;const i=M();try{i==null||i.stop()}catch{}a&&((d=f.current)==null||d.beginSuckInPhaseA());const s=O.timeline({onComplete:()=>{k.current=!1;try{i==null||i.start()}catch{}}});s.to({},{duration:.5}),s.to(l.uSuckIn,{value:.3,duration:1.2,ease:"power2.in"}),s.to(l.uCameraDistance,{value:8,duration:1.2,ease:"power2.in"},"<"),s.to(p.current,{bloom:2.8,duration:1.2},"<"),s.call(()=>{var e;a&&((e=f.current)==null||e.beginSuckInPhaseB(1.2))},null,"<"),s.to(l.uSuckIn,{value:.75,duration:1.5,ease:"power3.in"}),s.to(l.uCameraDistance,{value:3,duration:1.5,ease:"power3.in"},"<"),s.to(p.current,{chromaX:.025,chromaY:.025,duration:1.5},"<"),s.call(()=>{var e;a&&((e=f.current)==null||e.beginSuckInPhaseC(1.5))},null,"<"),s.to(l.uSuckIn,{value:1,duration:.8,ease:"power4.in"}),s.to(l.uCameraDistance,{value:.5,duration:.8,ease:"power4.in"},"<"),s.set(p.current,{chromaX:0,chromaY:0,bloom:0}),s.call(()=>{var e;a&&((e=f.current)==null||e.cutAllSounds())}),s.to({},{duration:.6})};c.useEffect(()=>{const i=g.current;if(!i)return;const s=P.create({trigger:i,start:"top top",end:"bottom bottom",scrub:1.2,onEnter:()=>{var d,e,r,b,I;(d=n.current)==null||d.classList.add("visible"),(e=o.current)==null||e.classList.add("visible"),(r=t.current)==null||r.classList.add("visible"),a&&((b=f.current)==null||b.init(),(I=f.current)==null||I.startAmbiance())},onLeave:()=>{var d,e,r;(d=n.current)==null||d.classList.remove("visible"),(e=o.current)==null||e.classList.remove("visible"),(r=f.current)==null||r.stop()},onEnterBack:()=>{var d,e,r,b;(d=n.current)==null||d.classList.add("visible"),(e=o.current)==null||e.classList.add("visible"),a&&((r=f.current)==null||r.init(),(b=f.current)==null||b.startAmbiance()),x.current=!1,k.current=!1,l.uSuckIn.value=0,R.current=0,l.uCameraDistance.value=12,p.current.bloom=1.2,p.current.chromaX=.001,p.current.chromaY=.001},onLeaveBack:()=>{var d,e,r;(d=n.current)==null||d.classList.remove("visible"),(e=o.current)==null||e.classList.remove("visible"),(r=f.current)==null||r.stop()},onUpdate:d=>{if(k.current)return;const e=d.progress;if(e<.12)m.current.dist=30,m.current.height=6,m.current.orb=0;else if(e<.3){const r=(e-.12)/.18;m.current.dist=30-r*14,m.current.height=6-r*4,m.current.orb=r*(5*Math.PI/180)}else if(e<.5){const r=(e-.3)/.2;m.current.dist=16,m.current.height=2-r*1.2,m.current.orb=5*Math.PI/180+r*(5*Math.PI/180)}else if(e<.72){const r=(e-.5)/.22;m.current.dist=16,m.current.height=.8,m.current.orb=10*Math.PI/180+r*(8*Math.PI/180)}else if(e<.85){const r=(e-.72)/.13;m.current.dist=16-r*4,m.current.height=.8-r*.5,m.current.orb=18*Math.PI/180}else{const r=(e-.85)/.15;m.current.dist=12,m.current.height=.3,w.current=Math.max(0,1-r*2),!x.current&&r>.1&&B()}}});return()=>s.kill()},[a]);const F=v?.55:.8;return u.jsxs("div",{className:"singularity",ref:g,id:"realm-9",children:[D&&u.jsxs(C,{gl:{antialias:!1,alpha:!1,powerPreference:"high-performance"},dpr:F,style:{position:"absolute",inset:0},children:[u.jsx(U,{makeDefault:!0,position:[0,0,1],left:-1,right:1,top:1,bottom:-1,near:.1,far:10}),u.jsx(K,{uniforms:l,effectsRef:p,performanceLow:v})]}),u.jsx("div",{className:"singularity-label",ref:n,children:"IX — THE SINGULARITY"}),u.jsx("div",{className:"singularity-distance",ref:t,children:"r = 30.0 M"}),u.jsx("div",{className:"singularity-orbit",ref:o,children:u.jsxs("svg",{viewBox:"0 0 60 60",style:{width:"100%",height:"100%",overflow:"visible"},children:[u.jsx("ellipse",{cx:"30",cy:"30",rx:"24",ry:"10",fill:"none",stroke:"rgba(201,168,76,0.2)",strokeWidth:"0.8",strokeDasharray:"4 3"}),u.jsx("circle",{className:"orbit-dot",cx:"30",cy:"6",r:"2.5",fill:"rgba(201,168,76,0.6)"}),u.jsx("circle",{cx:"30",cy:"30",r:"5",fill:"#000"}),u.jsx("circle",{cx:"30",cy:"30",r:"7",fill:"none",stroke:"rgba(255,180,60,0.4)",strokeWidth:"0.8"})]})}),u.jsx("div",{className:"singularity-gold-point"}),u.jsx("div",{className:"singularity-ring-overlay"})]})}export{Q as default};
