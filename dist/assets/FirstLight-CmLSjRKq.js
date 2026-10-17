import{r as c,u as v,j as e,a as d,V as u,b as f}from"./index-B9nYBtf5.js";import{V as p}from"./VoyageCanvas-BoNDJoh5.js";import{u as g}from"./useSectionProgress-Sl9-qPiB.js";const x=`
  precision highp float;
  uniform vec2  uRes;
  uniform vec2  uMouse;     // aspect-corrected, centred
  uniform float uTime;
  uniform float uIntro;     // 0 → 1 after the Big Bang
  uniform float uScroll;    // 0 → 1 as you leave the chapter
  uniform float uLens;      // lens strength (0 on touch / until the pointer moves)
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return v;
  }

  // One layer of hashed stars
  vec3 stars(vec2 p, float scale, float t) {
    vec2 g = p * scale;
    vec2 id = floor(g), f = fract(g) - 0.5;
    float h = hash(id);
    if (h < 0.86) return vec3(0.0);
    vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float d = length(f - o * 0.7);
    float tw = 0.65 + 0.35 * sin(t * (1.0 + h * 3.0) + h * 40.0);
    float core = smoothstep(0.06, 0.0, d) * tw;
    vec3 tint = mix(vec3(0.82, 0.9, 1.0), vec3(1.0, 0.9, 0.72), hash(id + 1.3));
    return tint * core * (h - 0.86) * 9.0;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    // Flying forward as you scroll away
    p *= 1.0 - uScroll * 0.45;

    // ── Gravitational lens around the cursor (thin-lens mapping) ──
    vec2 d = p - uMouse;
    float r2 = dot(d, d) + 1e-4;
    float thetaE = 0.075 * uLens;
    vec2 src = p - d * (thetaE * thetaE) / r2;
    float ring = exp(-pow((sqrt(r2) - thetaE) / 0.006, 2.0)) * uLens;

    // ── Stars (three depths), sampled through the lens ──
    vec3 col = vec3(0.0);
    col += stars(src, 38.0, uTime) * 0.9;
    col += stars(src + 11.3, 70.0, uTime * 1.3) * 0.6;
    col += stars(src - 4.7, 130.0, uTime * 0.7) * 0.4;

    // ── Cosmic microwave background, Mollweide ellipse ──
    float ang = uTime * 0.012;
    mat2 R = mat2(cos(ang), -sin(ang), sin(ang), cos(ang));
    vec2 q = R * src * vec2(1.0, 1.0);
    vec2 e = p / vec2(0.95, 0.475);              // 2:1 ellipse
    float inside = 1.0 - smoothstep(0.96, 1.0, length(e));
    float rim = smoothstep(0.9, 1.0, length(e)) * inside;
    float n = fbm(q * 7.0 + vec2(uTime * 0.01, 0.0)) * 0.7 + fbm(q * 19.0) * 0.3;
    vec3 cold = vec3(0.05, 0.14, 0.42);
    vec3 warm = vec3(0.86, 0.52, 0.18);
    vec3 cmb = mix(cold, warm, smoothstep(0.32, 0.7, n));
    cmb = mix(cmb, vec3(1.0, 0.86, 0.55), smoothstep(0.72, 0.85, n) * 0.6);
    col += cmb * inside * 0.16 + vec3(0.79, 0.66, 0.3) * rim * 0.12;

    // Einstein ring + faint halo of the invisible mass
    col += vec3(1.0, 0.92, 0.75) * ring * 0.55;

    // Vignette
    float v = smoothstep(1.25, 0.25, length(p * vec2(0.8, 1.0)));
    col *= v;

    float alpha = clamp(uIntro, 0.0, 1.0);
    gl_FragColor = vec4(col * alpha, alpha);
  }
`,w=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`;function T({progress:r}){const{size:o}=d(),n=c.useRef(new u(0,0)),i=c.useMemo(()=>window.matchMedia("(pointer: coarse)").matches,[]),t=c.useMemo(()=>({uRes:{value:new u(1,1)},uMouse:{value:new u(0,0)},uTime:{value:0},uIntro:{value:0},uScroll:{value:0},uLens:{value:0}}),[]),a=c.useRef(0);return c.useEffect(()=>{const s=l=>{i||(a.current=1);const m=window.innerWidth/window.innerHeight;n.current.set((l.clientX/window.innerWidth-.5)*m,.5-l.clientY/window.innerHeight)};return window.addEventListener("mousemove",s,{passive:!0}),()=>window.removeEventListener("mousemove",s)},[]),f((s,l)=>{t.uRes.value.set(o.width,o.height),t.uTime.value=s.clock.elapsedTime,t.uMouse.value.lerp(n.current,1-Math.exp(-l*8)),t.uLens.value+=(a.current-t.uLens.value)*(1-Math.exp(-l*3)),v.getState().bigBang&&(t.uIntro.value=Math.min(1,t.uIntro.value+l/2.4)),t.uScroll.value+=(r.current-t.uScroll.value)*(1-Math.exp(-l*6))}),e.jsxs("mesh",{frustumCulled:!1,children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{vertexShader:w,fragmentShader:x,uniforms:t,transparent:!0,depthWrite:!1,depthTest:!1})]})}function h({text:r,delay:o}){let n=0;return e.jsx("span",{className:"fl-line",children:r.split(" ").map((i,t)=>e.jsx("span",{className:"fl-word",children:i.split("").map(a=>{const s=o+n++*.045;return e.jsx("span",{className:"fl-letter",style:{animationDelay:`${s}s`},children:a},n)})},t))})}function E(){const[r,o]=c.useState(!1);return c.useEffect(()=>{let i=0,t=0;const a=()=>{clearTimeout(i),i=setTimeout(()=>{o(!0),t=setTimeout(()=>{t=0,o(!1),a()},4500)},12e3)},s=()=>{t||a()};return window.addEventListener("mousemove",s,{passive:!0}),window.addEventListener("touchstart",s,{passive:!0}),a(),()=>{clearTimeout(i),clearTimeout(t),window.removeEventListener("mousemove",s),window.removeEventListener("touchstart",s)}},[]),{shown:r,discover:()=>{r&&v.getState().discoverEgg("patient")}}}function S(){const r=c.useRef(null),o=c.useRef(null),n=E(),i=v(a=>a.bigBang),{progress:t}=g(r,{onUpdate:a=>{const s=o.current;s&&(s.style.transform=`translate3d(0, ${-a*6}vh, 0) scale(${1+a*.35})`,s.style.opacity=String(Math.max(0,1-a*1.6)))}});return e.jsx("div",{className:"v-chapter first-light",ref:r,children:e.jsxs("div",{className:"v-sticky",children:[e.jsx("div",{className:"v-canvas",children:e.jsx(p,{maxDpr:1.25,gl:{alpha:!0,antialias:!1,premultipliedAlpha:!0},camera:{position:[0,0,1]},children:e.jsx(T,{progress:t})})}),e.jsx("div",{className:"fl-content",ref:o,children:i&&e.jsxs(e.Fragment,{children:[e.jsx("span",{className:"fl-kicker",children:"◈ FIRST LIGHT · 380,000 YEARS AFTER"}),e.jsxs("h1",{className:"fl-headline",children:[e.jsx(h,{text:"I DON'T MANAGE PRODUCTS.",delay:1.4}),e.jsx(h,{text:"I BUILD WORLDS.",delay:2.5})]}),e.jsx("p",{className:"fl-sub",children:"Product builder · Co-founder · 7 years across two continents"})]})}),e.jsx("button",{type:"button",className:`fl-ghost ${n.shown?"is-on":""}`,onMouseEnter:n.discover,onClick:n.discover,tabIndex:n.shown?0:-1,"aria-hidden":!n.shown,children:"PATIENT"}),e.jsx("div",{className:"v-cue fl-cue",children:"SCROLL · BEGIN THE VOYAGE"})]})})}export{S as default};
