import{r as o,u as g,j as e,a as y,V as h,S as w,c as a,b as k,e as b}from"./index-EHYa12sO.js";import{V as I}from"./VoyageCanvas-XSA0YfCj.js";import{u as S,d as L}from"./useSectionProgress-ayEFJUV8.js";import{s as T,B as R}from"./Beats-CzKm5iZ1.js";const P=[.13,.31,.49,.67,.84],m=[{at:0,side:"center",kicker:"T+ALWAYS · WHAT I BELIEVE",title:"STELLAR NURSERY",xl:!0,body:"Stars are born in clouds like this. So are principles — slowly, under pressure, then all at once."},{at:.12,side:"left",kicker:"PRINCIPLE I",title:"Be in the room where the problem lives",body:"Factory floors. University offices. Hospital hallways. Not the meeting room — the actual room."},{at:.3,side:"right",kicker:"PRINCIPLE II",title:"Data tells you what. People tell you why.",body:"The best product decisions happen when both are in the same sentence."},{at:.48,side:"left",kicker:"PRINCIPLE III",title:"The prototype is the argument",body:"A clickable demo in two days ends debates a deck never will. Show it, then decide."},{at:.66,side:"right",kicker:"PRINCIPLE IV",title:"Technical enough to build. Human enough to listen.",body:"Close enough to the system design to earn engineers’ trust. Close enough to customers to know what matters."},{at:.83,side:"left",kicker:"PRINCIPLE V",title:"Ship. Listen. Go again.",body:"Shipping is an act of humility. The users will show you exactly which parts were wrong."},{at:.95,side:"low",kicker:"FIVE LIGHTS",title:"Everything after was built by them."}],E=`
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`,N=t=>`
  precision highp float;
  uniform vec2  uRes;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2  uMouse;
  uniform vec3  uStars[5];    // star positions
  uniform float uIgnite[5];   // 0..1 steady brightness
  uniform float uFlash[5];    // birth flash
  varying vec2 vUv;

  float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
  float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p); vec3 u = f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i), hash(i+vec3(1,0,0)), u.x), mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), u.x), u.y),
               mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), u.x), mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), u.x), u.y), u.z);
  }
  float fbm(vec3 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 3; i++) { v += a*noise(p); p = p*2.02 + 3.1; a *= 0.5; } return v; }

  // One pillar: a tapering, leaning column with a ragged, rounded head
  float pillar(vec3 p, vec2 c, float top, float rad, float lean) {
    vec2 q = p.xz - c - vec2(lean * (p.y + 2.2), 0.0);
    float r = rad * mix(1.0, 0.55, smoothstep(-2.2, top, p.y));
    float body = 1.0 - smoothstep(r * 0.05, r * 1.35, length(q));
    float cap = 1.0 - smoothstep(top - 0.45, top + 0.35, p.y);
    return body * cap;
  }

  // Pillar shapes only (no detail noise) — cheap enough for shadow rays
  float shapes(vec3 w) {
    float d = pillar(w, vec2(-1.2, 0.5), 0.75, 0.5, 0.14);
    d = max(d, pillar(w, vec2(0.1, 1.0), 1.55, 0.42, -0.05));
    d = max(d, pillar(w, vec2(1.3, 0.15), 0.05, 0.36, 0.2));
    return d;
  }

  float density(vec3 p) {
    // One-noise domain warp keeps the columns wind-sculpted but cheap
    vec3 w = p + (vec3(noise(p * 1.3), noise(p * 1.3 + 7.1), noise(p * 1.3 + 3.7)) - 0.5) * 0.45;
    float n = fbm(w * 3.4 + vec3(0.0, uTime * 0.02, 0.0));
    float d = clamp(shapes(w) * 1.5 - (1.0 - n) * 0.55, 0.0, 1.0);
    return d * 1.4;
  }

  // Thin ionised haze behind everything (teal + gold), no raymarch needed
  vec3 haze(vec3 rd) {
    float n = fbm(rd * 2.4 + vec3(0.0, uTime * 0.01, 3.0));
    vec3 teal = vec3(0.05, 0.22, 0.24);
    vec3 gold = vec3(0.32, 0.22, 0.08);
    return mix(teal, gold, smoothstep(0.2, 0.9, rd.y + n * 0.6)) * smoothstep(0.3, 0.85, n) * 1.1;
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
    vec3 ro = vec3(uMouse.x * 0.25, -0.1 + uMouse.y * 0.15, -4.4 + uProgress * 1.6);
    vec3 rd = normalize(vec3(p, 1.25));

    vec3 col = vec3(0.0);
    float trans = 1.0;
    float t = 1.2;
    float stepLen = 5.2 / float(${t});
    vec3 L = normalize(vec3(-0.3, 1.0, -0.4));     // light from above (the young cluster)
    for (int i = 0; i < ${t}; i++) {
      vec3 x = ro + rd * t;
      float d = density(x);
      if (d > 0.02) {
        // Self-shadowing toward the light gives the bright, sculpted rims
        float shade = exp(-shapes(x + L * 0.25) * 2.4);
        shade = shade * shade * shade;
        vec3 dust = mix(vec3(0.05, 0.022, 0.015), vec3(0.1, 0.05, 0.03), smoothstep(-2.0, 1.5, x.y));
        // Thin, wispy gas glows; dense cores stay dark silhouettes
        float fringe = 1.0 - smoothstep(0.0, 0.8, d);
        vec3 rimLit = vec3(1.0, 0.74, 0.4) * fringe * (0.3 + 0.7 * shade) * 1.5;
        vec3 starLight = vec3(0.0);
        for (int k = 0; k < 5; k++) {
          vec3 dv = x - uStars[k];
          float fall = 1.0 / (1.0 + dot(dv, dv) * 5.0);
          starLight += vec3(1.0, 0.82, 0.55) * (uIgnite[k] * 0.8 + uFlash[k] * 4.0) * fall;
        }
        vec3 emit = dust + rimLit + starLight * (0.25 + fringe) * 0.9;
        float a = clamp(d * stepLen * 2.4, 0.0, 1.0);
        col += trans * emit * a;
        trans *= 1.0 - a;
        if (trans < 0.02) break;
      }
      t += stepLen;
    }
    col += trans * haze(rd);

    // Newborn stars: sharp cores + diffraction spikes, dimmed by gas in front
    for (int k = 0; k < 5; k++) {
      vec3 sp = uStars[k] - ro;
      float z = dot(sp, rd);
      if (z <= 0.0) continue;
      vec3 v = vec3(p, 1.25);
      vec2 s2 = (sp.xy / sp.z) * 1.25;
      vec2 dd = p - s2;
      float r = length(dd);
      float b = uIgnite[k] + uFlash[k] * 2.5;
      float core = exp(-r * r * 9000.0) * 2.0 + exp(-r * r * 380.0) * 0.35;
      float spikes = (exp(-abs(dd.y) * 900.0) + exp(-abs(dd.x) * 900.0)) * exp(-r * 9.0) * 0.4;
      col += vec3(1.0, 0.93, 0.8) * b * (core + spikes) * mix(0.5, 1.0, trans);
      col += vec3(1.0, 0.85, 0.6) * uFlash[k] * exp(-r * r * 12.0) * 0.35;
    }

    col = 1.0 - exp(-col * 2.4);   // filmic-ish tone curve
    float v = smoothstep(1.3, 0.35, length(p));
    float alpha = clamp(max(max(col.r, col.g), col.b) * 2.0 + (1.0 - trans) * 0.95, 0.0, 1.0);
    gl_FragColor = vec4(col * v, alpha * v);
  }
`,z=[new a(-1.1,.75,.55),new a(.95,-.35,.3),new a(.2,1.45,1),new a(-.35,-.9,-.2),new a(1.4,.15,.25)];function F({progress:t}){const{size:r}=y(),i=g.getState().performanceLow,l=o.useRef(new h),n=o.useRef(new h),c=o.useRef(0),v=o.useMemo(()=>new w({vertexShader:E,fragmentShader:N(i?20:30),uniforms:{uRes:{value:new h(1,1)},uTime:{value:0},uProgress:{value:0},uMouse:{value:new h},uStars:{value:z},uIgnite:{value:[0,0,0,0,0]},uFlash:{value:[0,0,0,0,0]}},transparent:!0,depthTest:!1,depthWrite:!1}),[i]);return k((u,f)=>{const s=v.uniforms;c.current=L(c.current,t.current,4,f),s.uRes.value.set(r.width,r.height),s.uTime.value=u.clock.elapsedTime,s.uProgress.value=c.current,n.current.set(u.pointer.x,u.pointer.y),l.current.lerp(n.current,1-Math.exp(-f*2)),s.uMouse.value.copy(l.current),P.forEach((x,p)=>{const d=c.current-x;s.uIgnite.value[p]=b.smoothstep(d,0,.04)*(.9+.1*Math.sin(u.clock.elapsedTime*3+p)),s.uFlash.value[p]=d>0?Math.exp(-d*38):0})}),e.jsx("mesh",{frustumCulled:!1,material:v,children:e.jsx("planeGeometry",{args:[2,2]})})}function A(){const t=o.useRef(null),{progress:r,step:i}=S(t,{steps:T(m)}),l=g(n=>n.performanceLow);return e.jsx("div",{className:"v-chapter",ref:t,children:e.jsxs("div",{className:"v-sticky",children:[e.jsx("div",{className:"v-canvas",children:e.jsx(I,{maxDpr:l?.45:.65,minDpr:.35,gl:{alpha:!0,antialias:!1,premultipliedAlpha:!1},camera:{position:[0,0,1]},children:e.jsx(F,{progress:r})})}),e.jsx(R,{beats:m,step:i})]})})}export{A as default};
