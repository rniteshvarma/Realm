import{r as s,a6 as N,u as b,j as t,K as k,a5 as q,a as U,V as y,b as H,e as M,aq as S}from"./index-DYzImh_6.js";import{V as W}from"./VoyageCanvas-s5Au4dfH.js";import{d as I}from"./useSectionProgress-K0rZfnjC.js";const w=[{from:.1,to:.3,text:"YOU’VE SEEN THE WORK."},{from:.3,to:.5,text:"YOU’VE FELT THE THOUGHT."},{from:.5,to:.72,text:"NOW YOU KNOW WHO BUILT THIS."}],R=.9,L=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`,V=`
  precision highp float;
  uniform vec2 uRes; uniform float uTime; uniform float uMass; uniform float uFall; uniform vec2 uOffset;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y); }
  float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a*noise(p); p = p*2.03 + 7.7; a *= 0.5; } return v; }

  vec3 stars(vec2 p, float scale) {
    vec2 g = p * scale; vec2 id = floor(g), f = fract(g) - 0.5;
    float h = hash(id);
    if (h < 0.83) return vec3(0.0);
    vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
    float d = length(f - o * 0.7);
    vec3 tint = mix(vec3(0.8, 0.88, 1.0), vec3(1.0, 0.86, 0.66), hash(id + 1.3));
    return tint * smoothstep(0.07, 0.0, d) * (h - 0.83) * 7.0;
  }

  // The sky behind the hole: stars, a galactic band, and the worlds you passed
  vec3 sky(vec2 q) {
    vec3 c = stars(q, 30.0) * 1.3 + stars(q + 13.1, 62.0) * 0.9 + stars(q - 5.3, 120.0) * 0.6 + stars(q + 2.2, 220.0) * 0.4;
    float band = exp(-pow((q.y + q.x * 0.35) * 2.2, 2.0));
    float n = fbm(q * 3.0 + vec2(uTime * 0.01, 0.0));
    c += mix(vec3(0.07, 0.1, 0.22), vec3(0.5, 0.34, 0.14), n) * band * n * 1.6;
    // Remembered worlds (gold, ice, teal, blue) — they smear into arcs
    vec2 W[4]; W[0] = vec2(-0.55, 0.22); W[1] = vec2(0.48, -0.18); W[2] = vec2(0.12, 0.42); W[3] = vec2(-0.25, -0.38);
    vec3 C[4]; C[0] = vec3(1.0, 0.8, 0.4); C[1] = vec3(0.75, 0.88, 1.0); C[2] = vec3(0.5, 0.95, 0.85); C[3] = vec3(0.35, 0.55, 1.0);
    for (int i = 0; i < 4; i++) {
      float d = length(q - W[i]);
      c += C[i] * (exp(-d * d * 2600.0) * 1.6 + exp(-d * d * 120.0) * 0.12);
    }
    return c;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec2 c = uOffset * 0.04;
    // Falling in: space spirals and stretches toward the centre
    vec2 d = p - c;
    float r = length(d);
    float swirl = uFall * uFall * 6.0 / (r + 0.15);
    d = mat2(cos(swirl), -sin(swirl), sin(swirl), cos(swirl)) * d;
    d *= 1.0 + uFall * uFall * 4.0;
    r = length(d);

    float thetaE = 0.03 + uMass * 0.2;          // Einstein radius
    float shadow = thetaE * 0.78;               // photon capture radius
    vec2 src = c + d - d * (thetaE * thetaE) / (r * r + 1e-5);
    vec3 col = sky(src);

    // Photon ring + soft glow at the edge of the shadow
    // Thin photon ring, brighter on the approaching side (Doppler beaming)
    float ang = atan(d.y, d.x);
    float beam = 0.35 + 0.65 * pow(0.5 + 0.5 * cos(ang - 2.4 + uTime * 0.05), 2.0);
    float ring = exp(-pow((r - shadow * 1.03) / (0.0025 + thetaE * 0.012), 2.0));
    col += vec3(1.0, 0.86, 0.58) * ring * beam * (0.9 + 0.8 * uMass);
    col += vec3(1.0, 0.75, 0.4) * exp(-pow((r - shadow) / (thetaE * 0.6), 2.0)) * 0.08 * uMass;

    // The horizon itself
    col *= smoothstep(shadow * 0.96, shadow * 1.02, r);

    // Crossing: everything goes white then black
    col = mix(col, vec3(1.0, 0.96, 0.9), smoothstep(0.55, 0.8, uFall) * (1.0 - smoothstep(0.85, 1.0, uFall)));
    col *= 1.0 - smoothstep(0.92, 1.0, uFall);

    float v = smoothstep(1.3, 0.3, length(p));
    gl_FragColor = vec4(col * v, 1.0);
  }
`;function K({progress:m,fall:p}){const{size:u}=U(),f=s.useRef(0),g=s.useRef(new y),n=s.useMemo(()=>({uRes:{value:new y(1,1)},uTime:{value:0},uMass:{value:0},uFall:{value:0},uOffset:{value:new y}}),[]);return H((h,i)=>{n.uRes.value.set(u.width,u.height),n.uTime.value=h.clock.elapsedTime,f.current=I(f.current,M.smoothstep(m.current,.02,R),3,i),n.uMass.value=f.current,n.uFall.value=p.current,g.current.lerp(h.pointer,1-Math.exp(-i*2)),n.uOffset.value.copy(g.current)}),t.jsxs("mesh",{frustumCulled:!1,children:[t.jsx("planeGeometry",{args:[2,2]}),t.jsx("shaderMaterial",{vertexShader:L,fragmentShader:V,uniforms:n,depthTest:!1,depthWrite:!1})]})}function D(){const m=s.useRef(null),p=s.useRef(0),u=s.useRef(0),[f,g]=s.useState(-1),n=s.useRef(-1),h=s.useRef(null),[i,E]=s.useState(!1),v=s.useRef(!1),x=s.useRef(!1);s.useEffect(()=>{const r=m.current,c=N.create({trigger:r,start:"top top",end:"bottom bottom",onUpdate:e=>{p.current=e.progress;const a=e.progress;h.current&&(h.current.style.opacity=String(Math.max(0,1-a*12)));let o=-1;if(w.forEach((d,j)=>{a>=d.from&&a<d.to&&(o=j)}),a>=.72&&(o=w.length),o!==n.current&&(n.current=o,g(o)),x.current||b.getState().signalShattered)return;const l=S();if(e.progress>=R&&!v.current){v.current=!0,E(!0);const d=e.start+(e.end-e.start)*R;e.scroll()>d&&(l?l.scrollTo(d,{immediate:!0}):window.scrollTo(0,d)),l==null||l.stop()}else e.progress<R-.05&&v.current&&(v.current=!1,E(!1))}}),T=requestAnimationFrame(()=>{var e,a;c.refresh(),(a=(e=c.vars).onUpdate)==null||a.call(e,c)});return()=>{var e;cancelAnimationFrame(T),c.kill(),v.current&&((e=S())==null||e.start())}},[]);const O=s.useRef(null);s.useEffect(()=>{var r;i&&((r=O.current)==null||r.focus({preventScroll:!0}))},[i]);const C=()=>{var r,c;!v.current||x.current||(x.current=!0,E(!1),(c=(r=k).triggerGlassShatter)==null||c.call(r),q.to(u,{current:1,duration:2.4,ease:"power2.in",onComplete:()=>{b.getState().setSignalShattered(!0);const T=(e=0)=>{const a=document.querySelector('[data-realm="10"]');if(!a||a.offsetHeight===0){e<30&&requestAnimationFrame(()=>T(e+1));return}N.refresh();const o=S();o==null||o.start();const l=a.getBoundingClientRect().top+window.scrollY;o&&o.scrollTo(l,{immediate:!0,force:!0}),window.scrollTo(0,l),setTimeout(()=>{u.current=0},400)};requestAnimationFrame(()=>T())}}))},F=r=>{(r.key==="Enter"||r.key===" ")&&(r.preventDefault(),C())};return t.jsx("div",{className:"v-chapter",ref:m,children:t.jsxs("div",{className:"v-sticky",children:[t.jsx("div",{className:"v-canvas",children:t.jsx(W,{maxDpr:1.25,gl:{alpha:!1,antialias:!1},camera:{position:[0,0,1]},children:t.jsx(K,{progress:p,fall:u})})}),t.jsxs("div",{className:"eh-intro",ref:h,children:[t.jsx("span",{className:"v-kicker",children:"T+? · THE TURNING POINT"}),t.jsx("h2",{className:"v-title v-title--xl",children:"EVENT HORIZON"})]}),t.jsxs("div",{className:"eh-lines",children:[w.map((r,c)=>t.jsx("div",{className:`eh-line ${f===c?"is-on":""}`,children:r.text},r.text)),t.jsx("div",{className:`eh-line eh-line--gold ${f===w.length&&!x.current?"is-on":""}`,children:"COME CLOSER."})]}),t.jsx("button",{ref:O,type:"button",className:`eh-cross ${i?"is-on":""}`,onClick:C,onKeyDown:F,"data-cursor":"true","aria-label":"Cross the event horizon",tabIndex:i?0:-1}),t.jsx("div",{className:`eh-prompt ${i?"is-on":""}`,children:"CLICK THE HORIZON TO CROSS"})]})})}export{D as default};
