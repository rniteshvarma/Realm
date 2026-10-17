import{ak as j,al as W,am as F,an as B,ao as _,r as d,j as e,u as D,B as L,d as b,ah as P,b as z,ap as I,e as M}from"./index-B9nYBtf5.js";import{V as N}from"./VoyageCanvas-BoNDJoh5.js";import{u as G,d as H}from"./useSectionProgress-Sl9-qPiB.js";import{s as V,B as q}from"./Beats-LF5kscrI.js";const A={blending:_,blendEquation:B,blendSrc:F,blendDst:j,blendSrcAlpha:W,blendDstAlpha:j},T=[{at:0,side:"center",kicker:"T+2013 · BEFORE THE SHAPE",title:"ACCRETION",xl:!0,body:"Everything starts as dust."},{at:.1,side:"left",kicker:"T+2013 · HYDERABAD",title:"Loose particles",body:"Four years of computer science. Logic, code and curiosity — orbiting, colliding, not yet holding together.",metric:"B.Tech · Computer Science"},{at:.3,side:"right",kicker:"T+2017 · 7,000 KM NORTH",title:"Gravity pulled",body:"A master’s in software engineering in Sweden. Where I learned why some systems hold together and most quietly fall apart.",metric:"MSc · Software Engineering · Sweden"},{at:.5,side:"left",kicker:"T+2018 · STOCKHOLM",title:"The first law of models",body:"Inside an AI research lab, studying what makes machine learning work. The answer was rarely the model — it was the data feeding it.",metric:"AI / ML research"},{at:.7,side:"right",kicker:"T+2019 · STOCKHOLM",title:"Feel it in the hand",body:"Shipping production React taught me what no spec can: how a product actually feels to the person using it.",metric:"Engineering → product"},{at:.88,side:"low",kicker:"CORE FORMED",title:"Enough mass to hold a shape."}],g=[{r:4.2,start:.1,color:"#ffd98a"},{r:6.8,start:.3,color:"#9cc8ff"},{r:9.4,start:.5,color:"#e8b27a"},{r:12.2,start:.7,color:"#cfe4ff"}],K=.9,k=.16,U=`
  uniform float uTime;
  uniform float uProgress;
  uniform float uPixelRatio;
  uniform vec4  uWorldR;      // orbit radius per world
  uniform vec4  uWorldPhase;  // starting angle per world
  attribute vec4 aOrbit;      // r0, angle0, height, seed
  attribute vec2 aCapture;    // world index (-1 = free), capture time
  varying vec3  vColor;
  varying float vAlpha;

  float omega(float r) { return 1.6 * pow(r, -1.5); }

  void main() {
    float r = aOrbit.x, a0 = aOrbit.y, h = aOrbit.z, seed = aOrbit.w;
    float a = a0 + uTime * omega(r);
    vec3 free = vec3(cos(a) * r, h * (0.3 + r * 0.04), sin(a) * r);

    vec3 pos = free;
    float flash = 0.0;
    float captured = 0.0;
    vec3 col = mix(vec3(1.0, 0.86, 0.6), vec3(0.62, 0.74, 1.0), smoothstep(3.0, 14.0, r));
    col = mix(col, vec3(0.55, 0.42, 0.3), step(0.8, fract(seed * 13.7)) * 0.6);

    if (aCapture.x >= 0.0) {
      int k = int(aCapture.x);
      float wr = k == 0 ? uWorldR.x : k == 1 ? uWorldR.y : k == 2 ? uWorldR.z : uWorldR.w;
      float wp = k == 0 ? uWorldPhase.x : k == 1 ? uWorldPhase.y : k == 2 ? uWorldPhase.z : uWorldPhase.w;
      float wa = wp + uTime * omega(wr);
      vec3 world = vec3(cos(wa) * wr, 0.0, sin(wa) * wr);
      // Spiral in: angular catch-up then radial collapse onto the body
      float c = smoothstep(aCapture.y, aCapture.y + 0.05, uProgress);
      captured = c;
      vec3 shell = normalize(vec3(fract(seed * 91.3) - 0.5, fract(seed * 47.1) - 0.5, fract(seed * 23.9) - 0.5) + 1e-3)
                   * (0.18 + 0.32 * fract(seed * 7.3));
      pos = mix(free, world + shell, c * c * (3.0 - 2.0 * c));
      // Collision flash right at the moment of capture
      float dt = (uProgress - aCapture.y - 0.03) / 0.012;
      flash = exp(-dt * dt);
    }

    // Random sparkle of colliding grains
    float tw = pow(fract(sin(seed * 997.0 + floor(uTime * 4.0 + seed * 9.0)) * 43758.5), 60.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (0.7 + fract(seed * 5.1) * 1.4) * (1.0 + flash * 5.0 + tw * 3.0) * (1.0 - captured * 0.45);
    gl_PointSize = min(size * uPixelRatio * (34.0 / -mv.z), (3.5 + flash * 10.0) * uPixelRatio);
    vColor = col + flash * vec3(1.4, 1.1, 0.8) + tw * 0.8;
    vAlpha = (0.22 + 0.4 * fract(seed * 3.3)) * (1.0 - captured * 0.5) + flash * 0.8;
  }
`,Y=`
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;function Z({progress:o}){const t=D.getState().performanceLow?9e3:26e3,w=d.useMemo(()=>g.map((a,s)=>s*1.7+.4),[]),E=d.useMemo(()=>{const a=new Float32Array(t*4),s=new Float32Array(t*2);for(let i=0;i<t;i++){const h=2.8+Math.pow(Math.random(),.85)*13,f=Math.random();a.set([h,Math.random()*Math.PI*2,(Math.random()-.5)*2*Math.random(),f],i*4);let c=-1,p=0;g.forEach((l,m)=>{Math.abs(h-l.r)<K&&(c=m,p=l.start+Math.random()*k)}),s.set([c,p],i*2)}const r=new L;return r.setAttribute("position",new b(new Float32Array(t*3),3)),r.setAttribute("aOrbit",new b(a,4)),r.setAttribute("aCapture",new b(s,2)),r},[t]),u=d.useMemo(()=>({uTime:{value:0},uProgress:{value:0},uPixelRatio:{value:Math.min(window.devicePixelRatio,2)},uWorldR:{value:new P(...g.map(a=>a.r))},uWorldPhase:{value:new P(...w)}}),[w]),S=d.useRef([]),x=d.useRef();return z((a,s)=>{const r=a.clock.elapsedTime;u.uTime.value=r,u.uProgress.value=H(u.uProgress.value,o.current,5,s);const i=u.uProgress.value;g.forEach((l,m)=>{const y=S.current[m];if(!y)return;const R=w[m]+r*1.6*Math.pow(l.r,-1.5);y.position.set(Math.cos(R)*l.r,0,Math.sin(R)*l.r);const O=M.smoothstep(i,l.start+.02,l.start+k+.05);y.scale.setScalar(.001+O*(.42+m*.04))}),x.current&&x.current.scale.setScalar(1+Math.sin(r*2.3)*.04);const h=a.camera,f=M.lerp(1.25,.32,i),c=M.lerp(30,21,i),p=-.6+i*1.4+r*.02;h.position.set(Math.sin(p)*Math.cos(f)*c,Math.sin(f)*c,Math.cos(p)*Math.cos(f)*c),h.lookAt(0,0,0)}),e.jsxs(e.Fragment,{children:[e.jsx("points",{geometry:E,frustumCulled:!1,children:e.jsx("shaderMaterial",{vertexShader:U,fragmentShader:Y,uniforms:u,transparent:!0,depthWrite:!1,...A})}),e.jsxs("group",{ref:x,children:[e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.7,32,32]}),e.jsx("meshBasicMaterial",{color:"#fff6e6",toneMapped:!1})]}),e.jsx("sprite",{scale:[7,7,1],children:e.jsx("spriteMaterial",{map:C(),color:"#ffd28a",transparent:!0,opacity:.9,...A,depthWrite:!1,toneMapped:!1})}),e.jsx("sprite",{scale:[22,22,1],children:e.jsx("spriteMaterial",{map:C(),color:"#C9A84C",transparent:!0,opacity:.25,...A,depthWrite:!1,toneMapped:!1})})]}),g.map((a,s)=>e.jsxs("mesh",{ref:r=>S.current[s]=r,scale:.001,children:[e.jsx("sphereGeometry",{args:[1,32,32]}),e.jsx("meshStandardMaterial",{color:a.color,emissive:a.color,emissiveIntensity:.35,roughness:.7})]},s)),e.jsx("pointLight",{position:[0,0,0],intensity:60,distance:40,color:"#ffe2a8"}),e.jsx("ambientLight",{intensity:.05})]})}let v=null;function C(){if(v)return v;const o=document.createElement("canvas");o.width=o.height=128;const n=o.getContext("2d"),t=n.createRadialGradient(64,64,0,64,64,64);return t.addColorStop(0,"rgba(255,255,255,1)"),t.addColorStop(.2,"rgba(255,255,255,0.45)"),t.addColorStop(.5,"rgba(255,255,255,0.1)"),t.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=t,n.fillRect(0,0,128,128),v=new I(o),v}function $(){const o=d.useRef(null),{progress:n,step:t}=G(o,{steps:V(T)});return e.jsx("div",{className:"v-chapter",ref:o,children:e.jsxs("div",{className:"v-sticky",children:[e.jsx("div",{className:"v-canvas",children:e.jsx(N,{maxDpr:1.5,gl:{alpha:!0,antialias:!1},camera:{fov:50,position:[0,30,10]},children:e.jsx(Z,{progress:n})})}),e.jsx(q,{beats:T,step:t})]})})}const te=Object.freeze(Object.defineProperty({__proto__:null,default:$,glowTexture:C},Symbol.toStringTag,{value:"Module"}));export{A,te as a,C as g};
