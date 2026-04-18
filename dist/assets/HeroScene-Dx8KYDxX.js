import{r as a,j as e,g as u,u as l,C as f,V as v,a as h}from"./index-C6A6qjDW.js";import{w as p,B as m,a as w,E as g,C as y}from"./ChromaticAberration-1eOgYB6j.js";import{v as j}from"./iridescent.vert-ClrsAcLs.js";import{O as E}from"./OrthographicCamera-DZA_POGH.js";import"./Fbo-CHV-28Jx.js";const M=p(w,{blendFunction:m.ADD}),N=`uniform float uTime;
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

`;function b(){const n=a.useRef(null);return a.useEffect(()=>{if(!n.current)return;const s=n.current.children,o=()=>{u.to(s,{y:()=>(Math.random()-.5)*40,x:()=>(Math.random()-.5)*40,rotateZ:()=>(Math.random()-.5)*45,opacity:0,filter:"blur(4px)",duration:.6,ease:"power3.out",stagger:.02})},r=()=>{u.to(s,{y:0,x:0,rotateZ:0,opacity:1,filter:"blur(0px)",duration:.8,ease:"elastic.out(1, 0.5)",stagger:.02})},t=n.current;return t.addEventListener("mouseenter",o),t.addEventListener("mouseleave",r),()=>{t.removeEventListener("mouseenter",o),t.removeEventListener("mouseleave",r)}},[]),e.jsxs("h1",{className:"manifesto-headline",children:[e.jsxs("div",{className:"word-row",children:[e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"I"}),e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"DON'T"}),e.jsx("span",{className:"word word-2","data-cursor":"hover-drag",children:"MAKE"}),e.jsx("span",{className:"word word-2","data-cursor":"hover-drag",children:"WEBSITES."})]}),e.jsxs("div",{className:"word-row",children:[e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"I"}),e.jsx("span",{className:"word word-1","data-cursor":"hover-drag",children:"BUILD"}),e.jsx("span",{className:"word word-3 shattered",ref:n,"data-cursor":"hover-drag",children:"WORLDS".split("").map((s,o)=>e.jsx("span",{style:{display:"inline-block"},children:s},o))}),e.jsx("span",{className:"word word-4","data-cursor":"hover-drag",children:"."})]})]})}function R(){const r=[[200,200],[250,200],[150,200],[225,200+50*Math.sqrt(3)/2],[175,200+50*Math.sqrt(3)/2],[225,200-50*Math.sqrt(3)/2],[175,200-50*Math.sqrt(3)/2]],t=[];return r.forEach((i,c)=>{r.forEach((d,x)=>{x>c&&t.push(e.jsx("line",{x1:i[0],y1:i[1],x2:d[0],y2:d[1]},`${c}-${x}`))})}),e.jsxs("svg",{viewBox:"0 0 400 400",className:"metatron-svg",children:[r.map((i,c)=>e.jsx("circle",{cx:i[0],cy:i[1],r:50},c)),e.jsx("circle",{cx:200,cy:200,r:50*2}),t]})}function T(){const n=a.useRef(),s=l(r=>r.mouse),o=a.useMemo(()=>({uTime:{value:0},uMouse:{value:new v(.5,.5)},uResolution:{value:new v(window.innerWidth,window.innerHeight)}}),[]);return h(r=>{n.current&&(n.current.uniforms.uTime.value=r.clock.elapsedTime,n.current.uniforms.uMouse.value.x+=(s.x-n.current.uniforms.uMouse.value.x)*.05,n.current.uniforms.uMouse.value.y+=(s.y-n.current.uniforms.uMouse.value.y)*.05)}),a.useEffect(()=>{const r=()=>{n.current&&n.current.uniforms.uResolution.value.set(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",r),()=>window.removeEventListener("resize",r)},[]),e.jsxs("mesh",{children:[e.jsx("planeGeometry",{args:[2,2]}),e.jsx("shaderMaterial",{ref:n,vertexShader:j,fragmentShader:N,uniforms:o,depthWrite:!1,depthTest:!1})]})}const C=12e3;function L(n,s){const o=a.useRef(null),r=a.useRef(!1),t=a.useRef(null);return a.useEffect(()=>{const c=()=>{clearTimeout(o.current),n.current&&u.to(n.current,{opacity:0,duration:.5}),o.current=setTimeout(()=>{n.current&&(u.to(n.current,{opacity:1,duration:.8}),t.current=setTimeout(()=>{u.to(n.current,{opacity:0,duration:.8})},3e3))},C)};return window.addEventListener("mousemove",c),c(),()=>{window.removeEventListener("mousemove",c),clearTimeout(o.current),clearTimeout(t.current)}},[n]),{handleGhostHover:()=>{r.current||(r.current=!0,s("patient"))}}}function D(){const n=l(t=>t.performanceLow),s=l(t=>t.discoverEgg),o=a.useRef(null),{handleGhostHover:r}=L(o,s);return e.jsxs("div",{className:"manifesto-realm",children:[e.jsx("div",{className:"manifesto-metatron",children:e.jsx(R,{})}),e.jsx("div",{ref:o,className:"manifesto-ghost-word",onMouseEnter:r,children:"PATIENT"}),e.jsx("div",{className:"manifesto-canvas-wrapper",children:e.jsxs(f,{gl:{antialias:!0,alpha:!1},dpr:[1,n?1:2],children:[e.jsx(E,{makeDefault:!0,position:[0,0,1],left:-1,right:1,top:1,bottom:-1,near:.1,far:10}),e.jsx(T,{}),!n&&e.jsxs(g,{multisampling:0,children:[e.jsx(M,{intensity:1.2,luminanceThreshold:.2,luminanceSmoothing:.9,blendFunction:m.SCREEN}),e.jsx(y,{offset:[.002,.002],blendFunction:m.NORMAL})]})]})}),e.jsxs("div",{className:"manifesto-content layer-content",children:[e.jsx(b,{}),e.jsx("div",{className:"scroll-hint",children:e.jsx("div",{className:"waveform-line"})})]})]})}export{D as default};
