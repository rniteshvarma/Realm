import{r,u as g,a as M,g as x,j as e,b as w,c as N,C as T,V as R}from"./index-kBNIGw7Z.js";import{w as C,B as y,a as F,E as S,C as L}from"./ChromaticAberration-i0-cQeYs.js";import{S as f}from"./deviceTier-4wMGNzoE.js";import{u as q,_ as z}from"./Fbo-B_2XY8Rx.js";const B=n=>typeof n=="function",I=r.forwardRef(({envMap:n,resolution:c=256,frames:o=1/0,children:s,makeDefault:t,...a},l)=>{const u=g(({set:i})=>i),v=g(({camera:i})=>i),m=g(({size:i})=>i),d=r.useRef(null);r.useImperativeHandle(l,()=>d.current,[]);const h=r.useRef(null),E=q(c);r.useLayoutEffect(()=>{a.manual||d.current.updateProjectionMatrix()},[m,a]),r.useLayoutEffect(()=>{d.current.updateProjectionMatrix()}),r.useLayoutEffect(()=>{if(t){const i=v;return u(()=>({camera:d.current})),()=>u(()=>({camera:i}))}},[d,t,u]);let j=0,b=null;const p=B(s);return M(i=>{p&&(o===1/0||j<o)&&(h.current.visible=!1,i.gl.setRenderTarget(E),b=i.scene.background,n&&(i.scene.background=n),i.gl.render(i.scene,d.current),i.scene.background=b,i.gl.setRenderTarget(null),h.current.visible=!0,j++)}),r.createElement(r.Fragment,null,r.createElement("orthographicCamera",z({left:m.width/-2,right:m.width/2,top:m.height/2,bottom:m.height/-2,ref:d},a),!p&&s),r.createElement("group",{ref:h},p&&s(E.texture)))}),D=C(F,{blendFunction:y.ADD}),k=`varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`,G=`uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

varying vec2 vUv;

// Utility to generate procedural noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

// Simplex noise implementation structure
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Fractional Brownian Motion (fbm) for domain warping
float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < 4; ++i) {
        v += a * snoise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

void main() {
    // Parallax mouse effect pushing coordinates
    vec2 st = gl_FragCoord.xy/uResolution.xy;
    st.x *= uResolution.x/uResolution.y;
    
    vec2 mouseEffect = (uMouse - 0.5) * 0.5;
    st += mouseEffect;

    // Time variation
    float t = uTime * 0.2;

    // Domain warping
    vec2 q = vec2(0.);
    q.x = fbm( st + 0.00*t);
    q.y = fbm( st + vec2(1.0));

    vec2 r = vec2(0.);
    r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*t );
    r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*t);

    float f = fbm(st+r);

    // Color mixing based on design system
    // --void: #000000
    // --plasma: #7B2FBE (electric purple)
    // --neural: #00F5FF (neon teal)
    // --burn: #FF2D2D (bleeding red)
    
    vec3 color = mix(vec3(0.0, 0.0, 0.0), vec3(0.482, 0.184, 0.745), clamp((f*f)*4.0,0.0,1.0));
    color = mix(color, vec3(0.0, 0.96, 1.0), clamp(length(q),0.0,1.0));
    color = mix(color, vec3(1.0, 0.176, 0.176), clamp(length(r.x),0.0,1.0));

    // Darken outer edges
    float vignette = length(vUv - 0.5);
    color *= smoothstep(0.8, 0.2, vignette);

    gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color,1.);
}

`;function O(){const n=r.useRef(null);return r.useEffect(()=>{if(!n.current)return;const c=n.current.children,o=()=>{x.to(c,{y:()=>(Math.random()-.5)*40,x:()=>(Math.random()-.5)*40,rotateZ:()=>(Math.random()-.5)*45,opacity:0,filter:"blur(4px)",duration:.6,ease:"power3.out",stagger:.02})},s=()=>{x.to(c,{y:0,x:0,rotateZ:0,opacity:1,filter:"blur(0px)",duration:.8,ease:"elastic.out(1, 0.5)",stagger:.02})},t=n.current;return t.addEventListener("mouseenter",o),t.addEventListener("mouseleave",s),()=>{x.killTweensOf(c),t.removeEventListener("mouseenter",o),t.removeEventListener("mouseleave",s)}},[]),e.jsxs("h1",{className:"manifesto-headline",children:[e.jsxs("div",{className:"word-row",children:[e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"I"}),e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"DON'T"}),e.jsx("span",{className:"word word-2","data-cursor":"hover-drag",children:"MANAGE"}),e.jsx("span",{className:"word word-2","data-cursor":"hover-drag",children:"PRODUCTS."})]}),e.jsxs("div",{className:"word-row",children:[e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"I"}),e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"BUILD"}),e.jsxs("span",{className:"word-tail",children:[e.jsx("span",{className:"word word-3 shattered",ref:n,"data-cursor":"hover-drag",children:"WORLDS".split("").map((c,o)=>e.jsx("span",{style:{display:"inline-block"},children:c},o))}),e.jsx("span",{className:"word word-4","data-cursor":"hover-drag",children:"."})]})]})]})}function P(){const s=[[200,200],[250,200],[150,200],[225,200+50*Math.sqrt(3)/2],[175,200+50*Math.sqrt(3)/2],[225,200-50*Math.sqrt(3)/2],[175,200-50*Math.sqrt(3)/2]],t=[];return s.forEach((a,l)=>{s.forEach((u,v)=>{v>l&&t.push(e.jsx("line",{x1:a[0],y1:a[1],x2:u[0],y2:u[1]},`${l}-${v}`))})}),e.jsxs("svg",{viewBox:"0 0 400 400",className:"metatron-svg",children:[s.map((a,l)=>e.jsx("circle",{cx:a[0],cy:a[1],r:50},l)),e.jsx("circle",{cx:200,cy:200,r:50*2}),t]})}function A(){const n=r.useRef(),c=r.useMemo(()=>({uTime:{value:0},uMouse:{value:new R(.5,.5)},uResolution:{value:new R(window.innerWidth,window.innerHeight)}}),[]);return M((o,s)=>{if(n.current){const{mouse:t}=w.getState(),a=1-Math.pow(.95,s*60);n.current.uniforms.uTime.value=o.clock.elapsedTime,n.current.uniforms.uMouse.value.x+=(t.x-n.current.uniforms.uMouse.value.x)*a,n.current.uniforms.uMouse.value.y+=(t.y-n.current.uniforms.uMouse.value.y)*a}}),r.useEffect(()=>{const o=()=>{n.current&&n.current.uniforms.uResolution.value.set(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),e.jsxs("mesh",{children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{ref:n,vertexShader:k,fragmentShader:G,uniforms:c,depthWrite:!1,depthTest:!1})]})}const H=12e3;function U(n,c){const o=r.useRef(null),s=r.useRef(!1),t=r.useRef(null),a=r.useRef(!1);return r.useEffect(()=>{const u=()=>{clearTimeout(o.current),!a.current&&(o.current=setTimeout(()=>{n.current&&(a.current=!0,x.to(n.current,{opacity:1,duration:.8}),clearTimeout(t.current),t.current=setTimeout(()=>{a.current=!1,n.current&&x.to(n.current,{opacity:0,duration:.8}),u()},3e3))},H))};return window.addEventListener("mousemove",u,{passive:!0}),u(),()=>{window.removeEventListener("mousemove",u),clearTimeout(o.current),clearTimeout(t.current)}},[n]),{handleGhostHover:()=>{a.current&&!s.current&&(s.current=!0,c("patient"))}}}function $(){w(t=>t.performanceLow);const n=w(t=>t.discoverEgg),c=r.useRef(null),{handleGhostHover:o}=U(c,n),s=N();return e.jsxs("div",{className:"manifesto-realm",children:[e.jsx("div",{ref:c,className:"manifesto-ghost-word",onMouseEnter:o,children:"PATIENT"}),e.jsx("div",{className:"manifesto-canvas-wrapper",children:e.jsxs(T,{gl:{antialias:f.TIER>=2,alpha:!1,powerPreference:"high-performance",stencil:!1},dpr:[.85,f.pixelRatio],frameloop:s,children:[e.jsx(I,{makeDefault:!0,position:[0,0,1],left:-1,right:1,top:1,bottom:-1,near:.1,far:10}),e.jsx(A,{}),f.bloomEnabled&&e.jsxs(S,{multisampling:0,children:[e.jsx(D,{intensity:f.bloomIntensity,luminanceThreshold:.2,luminanceSmoothing:.9,blendFunction:y.SCREEN}),f.chromaticAberr&&e.jsx(L,{offset:[.002,.002],blendFunction:y.NORMAL})]})]})}),e.jsx("div",{className:"manifesto-metatron","aria-hidden":"true",children:e.jsx(P,{})}),e.jsx("div",{className:"manifesto-scrim","aria-hidden":"true"}),e.jsxs("div",{className:"manifesto-content layer-content",children:[e.jsx(O,{}),e.jsx("p",{className:"manifesto-subline",children:"Product Manager · Co-founder · Builder"}),e.jsx("div",{className:"manifesto-scroll-hint","aria-hidden":"true",children:e.jsx("div",{className:"waveform-line"})})]})]})}export{$ as default};
