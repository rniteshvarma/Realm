import{r as t,u as s,g as l,j as n,C as u,V as i,a as c}from"./index-C6A6qjDW.js";import{v as m}from"./iridescent.vert-ClrsAcLs.js";import{O as f}from"./OrthographicCamera-DZA_POGH.js";import"./Fbo-CHV-28Jx.js";const d=`// voidFractal.frag.glsl — Realm IX infinite zoom
// Mandelic / Julia hybrid zoom with gold/black palette
// Designed for the hidden final phase.

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

// Palette: endless gold bleeding into pitch black
vec3 palette(float t) {
  vec3 a = vec3(0.0, 0.0, 0.0);       // Pitch black
  vec3 b = vec3(0.788, 0.659, 0.298); // Gold #C9A84C
  vec3 c = vec3(1.0, 1.0, 1.0);       // White core
  vec3 d = vec3(0.2, 0.1, 0.0);       // Burned shadows
  return a + b * cos(6.28318 * (c * t + d));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;
  vec2 uv0 = uv;

  // Infinite zoom effect
  float zoom = exp(-uTime * 0.2); 
  uv *= zoom;
  
  // Mouse slight parallax pan
  uv += (uMouse - 0.5) * 0.5 * zoom;

  // Fractal iteration
  vec3 finalColor = vec3(0.0);
  
  for(float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;
    
    // Smooth geometric folding
    float d = length(uv) * exp(-length(uv0));
    
    vec3 col = palette(length(uv0) + i * 0.4 + uTime * 0.4);
    
    d = sin(d * 8.0 + uTime) / 8.0;
    d = abs(d);
    
    // High contrast glow
    d = pow(0.01 / d, 1.2);
    
    finalColor += col * d;
  }
  
  // Deep vignette
  float vignette = smoothstep(1.5, 0.1, length(uv0));
  finalColor *= vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
`;function v(){const e=t.useRef(),r=s(o=>o.mouse),a=t.useMemo(()=>({uTime:{value:0},uMouse:{value:new i(.5,.5)},uResolution:{value:new i(window.innerWidth,window.innerHeight)}}),[]);return c(o=>{e.current&&(e.current.uniforms.uTime.value=o.clock.elapsedTime,e.current.uniforms.uMouse.value.x+=(r.x-e.current.uniforms.uMouse.value.x)*.05,e.current.uniforms.uMouse.value.y+=(r.y-e.current.uniforms.uMouse.value.y)*.05)}),t.useEffect(()=>{const o=()=>{e.current&&e.current.uniforms.uResolution.value.set(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]),n.jsxs("mesh",{children:[n.jsx("planeGeometry",{args:[2,2]}),n.jsx("shaderMaterial",{ref:e,vertexShader:m,fragmentShader:d,uniforms:a,depthWrite:!1,depthTest:!1})]})}function w(){const e=t.useRef(null),r=s(a=>a.performanceLow);return t.useEffect(()=>{l.fromTo(e.current,{opacity:0},{opacity:1,duration:4,ease:"power2.inOut"})},[]),n.jsxs("div",{className:"realm-ix-container",ref:e,children:[n.jsxs(u,{gl:{antialias:!1,alpha:!1},dpr:[1,r?1:2],children:[n.jsx(f,{makeDefault:!0,position:[0,0,1],left:-1,right:1,top:1,bottom:-1,near:.1,far:10}),n.jsx(v,{})]}),n.jsxs("div",{className:"realm-ix-content",children:[n.jsx("h1",{className:"realm-ix-title",children:"IX"}),n.jsxs("p",{className:"realm-ix-text",children:["ALL SIGNALS FOUND.",n.jsx("br",{}),"THE HEAVEN WITHIN THE DARK."]})]}),n.jsx("div",{className:"realm-ix-footer",children:"A HIDDEN LAYER — EXPLORED BY YOU."})]})}export{w as default};
