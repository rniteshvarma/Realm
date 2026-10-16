import{M as Z,ai as ee,e as W,J as te,d as g,ap as z,a2 as re,am as ne,h as Y,aq as se,ak as N,V as T,B as $,o as B,r as l,a as F,j as e,D as K,b as E,c as oe,S as ae,K as P,C as ie,ac as ce,u as le,f as ue,g as O,ar as k}from"./index-kBNIGw7Z.js";import{S as V}from"./deviceTier-4wMGNzoE.js";import{T as L,P as fe}from"./PerspectiveCamera-DDNc2iH6.js";import"./Fbo-B_2XY8Rx.js";class G extends Z{constructor(o,r={}){super(o),this.isReflector=!0,this.type="Reflector",this.camera=new ee;const i=this,t=r.color!==void 0?new W(r.color):new W(8355711),a=r.textureWidth||512,d=r.textureHeight||512,c=r.clipBias||0,n=r.shader||G.ReflectorShader,f=r.multisample!==void 0?r.multisample:4,u=new te,h=new g,y=new g,w=new g,M=new z,m=new g(0,0,-1),p=new N,v=new g,x=new g,R=new N,j=new z,S=this.camera,A=new re(a,d,{samples:f,type:ne}),I=new Y({name:n.name!==void 0?n.name:"unspecified",uniforms:se.clone(n.uniforms),fragmentShader:n.fragmentShader,vertexShader:n.vertexShader});I.uniforms.tDiffuse.value=A.texture,I.uniforms.color.value=t,I.uniforms.textureMatrix.value=j,this.material=I,this.onBeforeRender=function(b,X,H){if(y.setFromMatrixPosition(i.matrixWorld),w.setFromMatrixPosition(H.matrixWorld),M.extractRotation(i.matrixWorld),h.set(0,0,1),h.applyMatrix4(M),v.subVectors(y,w),v.dot(h)>0)return;v.reflect(h).negate(),v.add(y),M.extractRotation(H.matrixWorld),m.set(0,0,-1),m.applyMatrix4(M),m.add(w),x.subVectors(y,m),x.reflect(h).negate(),x.add(y),S.position.copy(v),S.up.set(0,1,0),S.up.applyMatrix4(M),S.up.reflect(h),S.lookAt(x),S.far=H.far,S.updateMatrixWorld(),S.projectionMatrix.copy(H.projectionMatrix),j.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),j.multiply(S.projectionMatrix),j.multiply(S.matrixWorldInverse),j.multiply(i.matrixWorld),u.setFromNormalAndCoplanarPoint(h,y),u.applyMatrix4(S.matrixWorldInverse),p.set(u.normal.x,u.normal.y,u.normal.z,u.constant);const C=S.projectionMatrix;R.x=(Math.sign(p.x)+C.elements[8])/C.elements[0],R.y=(Math.sign(p.y)+C.elements[9])/C.elements[5],R.z=-1,R.w=(1+C.elements[10])/C.elements[14],p.multiplyScalar(2/p.dot(R)),C.elements[2]=p.x,C.elements[6]=p.y,C.elements[10]=p.z+1-c,C.elements[14]=p.w,i.visible=!1;const q=b.getRenderTarget(),J=b.xr.enabled,Q=b.shadowMap.autoUpdate;b.xr.enabled=!1,b.shadowMap.autoUpdate=!1,b.setRenderTarget(A),b.state.buffers.depth.setMask(!0),b.autoClear===!1&&b.clear(),b.render(X,S),b.xr.enabled=J,b.shadowMap.autoUpdate=Q,b.setRenderTarget(q);const D=H.viewport;D!==void 0&&b.state.viewport(D),i.visible=!0},this.getRenderTarget=function(){return A},this.dispose=function(){A.dispose(),i.material.dispose()}}}G.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`,fragmentShader:`
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>

		}`};function de(s,o,r=5,i=8){const t=[];t.push(new T(-s/2,-o/2)),t.push(new T(s/2,-o/2)),t.push(new T(-s/2,o/2)),t.push(new T(s/2,o/2));for(let c=1;c<i;c++)for(let n=1;n<r;n++){let f=-s/2+s/r*n,u=-o/2+o/i*c;f+=(Math.random()-.5)*(s/r)*.8,u+=(Math.random()-.5)*(o/i)*.8,t.push(new T(f,u))}const a=(c,n)=>{if(c===0&&n===0)return t[0];if(c===r&&n===0)return t[1];if(c===0&&n===i)return t[2];if(c===r&&n===i)return t[3];if(c>0&&c<r&&n>0&&n<i)return t[4+(n-1)*(r-1)+(c-1)];let f=-s/2+s/r*c,u=-o/2+o/i*n;return new T(f,u)},d=[];for(let c=0;c<i;c++)for(let n=0;n<r;n++){const f=a(n,c+1),u=a(n+1,c+1),h=a(n,c),y=a(n+1,c),w=p=>new T((p.x+s/2)/s,(p.y+o/2)/o),M=_(f,h,y,w),m=_(f,y,u,w);d.push(M,m)}return d}function _(s,o,r,i){const t=new T((s.x+o.x+r.x)/3,(s.y+o.y+r.y)/3),a=new g(s.x-t.x,s.y-t.y,0),d=new g(o.x-t.x,o.y-t.y,0),c=new g(r.x-t.x,r.y-t.y,0),n=new $,f=new Float32Array([a.x,a.y,a.z,d.x,d.y,d.z,c.x,c.y,c.z]);n.setAttribute("position",new B(f,3));const u=i(s),h=i(o),y=i(r),w=new Float32Array([u.x,u.y,h.x,h.y,y.x,y.y]);n.setAttribute("uv",new B(w,2));const M=new Float32Array([0,0,1,0,0,1,0,0,1]);return n.setAttribute("normal",new B(M,3)),{centroid:new g(t.x,t.y,0),geometry:n}}function U({textPrimary:s,textSecondary:o,isHovered:r}){const i=l.useRef();return F(()=>{if(i.current){const t=r?1:0;i.current.scale.y+=(t-i.current.scale.y)*.1,i.current.position.y=-1.2-(1-i.current.scale.y)*.5}}),e.jsxs("group",{ref:i,children:[e.jsx(L,{fontSize:.2,color:"#F0F0F0",anchorX:"center",anchorY:"top",position:[0,0,0],font:void 0,letterSpacing:.05,children:s}),e.jsx(L,{fontSize:.06,color:"#C9A84C",anchorX:"center",anchorY:"top",position:[0,-.4,0],font:void 0,letterSpacing:.2,children:o})]})}function me({hovered:s,onClick:o,position:r,rotationOffset:i}){const t=l.useRef(),a=l.useRef(),d=l.useMemo(()=>{const c=new $,n=new Float32Array([0,.2,0,-.1,0,.2,.1,0,.2,0,.2,0,.1,0,.2,0,-.1,0,0,.2,0,0,-.1,0,-.1,0,.2,0,.2,0,-.6,.4,-.2,-.1,0,.2,0,.2,0,.1,0,.2,.6,.4,-.2,.1,0,.2,0,.5,.3,-.1,0,.2,0,.2,0,-.1,0,.2,0,.1,-.5,0,.2,0,0,.1,-.5,.1,0,.2]);return c.setAttribute("position",new B(n,3)),c.computeVertexNormals(),c},[]);return F(c=>{if(!t.current)return;const n=c.clock.elapsedTime;let u=(i||0)+n*.2,h=1;s&&(u=0,h=1.25),t.current.rotation.y+=(u-t.current.rotation.y)*.1,t.current.rotation.x+=((s?Math.PI/12:Math.sin(n*.5)*.1)-t.current.rotation.x)*.1,t.current.scale.lerp(new g().setScalar(h),.1),t.current.position.y=r[1]+Math.sin(n+r[0])*.1,a.current&&(a.current.rotation.z+=.01,a.current.rotation.x=Math.PI/2+Math.sin(n)*.2,a.current.scale.lerp(new g().setScalar(s?1.5:0),.1),a.current.visible=a.current.scale.x>.01)}),e.jsxs("group",{position:[r[0],0,r[2]],children:[e.jsxs("group",{ref:t,children:[e.jsx("mesh",{geometry:d,onClick:o,children:e.jsx("meshStandardMaterial",{color:"#FFFFFF",emissive:"#C9A84C",emissiveIntensity:.2,transparent:!0,opacity:.9,wireframe:!0,side:K})}),e.jsxs("mesh",{ref:a,visible:!1,children:[e.jsx("torusGeometry",{args:[.5,.005,16,64]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})]}),e.jsx(U,{textPrimary:"MANAGEMENT",textSecondary:"FOR PROJECTS THAT SCALE.",isHovered:s})]})}function pe({hovered:s,onClick:o,position:r,rotationOffset:i}){const t=l.useRef(),a=l.useRef(),d=l.useRef();return F(c=>{if(!t.current)return;const n=c.clock.elapsedTime;let f=i+n*.3,u=1;s&&(f=0,u=1.25),t.current.rotation.y+=(f-t.current.rotation.y)*.1,t.current.rotation.x+=((s?Math.PI/4:0)-t.current.rotation.x)*.1,t.current.scale.lerp(new g().setScalar(u),.1),t.current.position.y=r[1]+Math.cos(n+r[0])*.1,d.current&&(d.current.rotation.z=n*2),a.current&&(a.current.rotation.z-=.01,a.current.scale.lerp(new g().setScalar(s?1.5:0),.1),a.current.visible=a.current.scale.x>.01)}),e.jsxs("group",{position:[r[0],0,r[2]],children:[e.jsxs("group",{ref:t,children:[e.jsxs("mesh",{onClick:o,children:[e.jsx("torusGeometry",{args:[.4,.05,16,32]}),e.jsx("meshStandardMaterial",{metalness:1,roughness:.1,color:"#AAAAAA"})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.08,16,16]}),e.jsx("meshStandardMaterial",{metalness:1,roughness:.1,color:"#C9A84C"})]}),e.jsxs("mesh",{ref:d,children:[e.jsx("octahedronGeometry",{args:[.3,0]}),e.jsx("meshStandardMaterial",{metalness:1,roughness:.2,color:"#00F5FF"})]}),e.jsxs("mesh",{ref:a,visible:!1,children:[e.jsx("torusGeometry",{args:[.6,.005,16,64]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})]}),e.jsx(U,{textPrimary:"UI/UX DESIGN",textSecondary:"WHERE THE STORY COMES ALIVE.",isHovered:s})]})}function xe({hovered:s,onClick:o,position:r,rotationOffset:i}){const t=l.useRef(),a=l.useRef(),d=`/*
  if (you.need(creativity)) {
    return me.call();
  }
*/`;return F(c=>{if(!t.current)return;const n=c.clock.elapsedTime;let f=i-n*.1,u=1;s&&(f=0,u=1.25),t.current.rotation.y+=(f-t.current.rotation.y)*.1,t.current.rotation.x+=((s?0:Math.sin(n)*.1)-t.current.rotation.x)*.1,t.current.scale.lerp(new g().setScalar(u),.1),t.current.position.y=r[1]+Math.sin(n*.5+r[0])*.1,a.current&&(a.current.rotation.z+=.015,a.current.scale.lerp(new g().setScalar(s?1.5:0),.1),a.current.visible=a.current.scale.x>.01)}),e.jsxs("group",{position:[r[0],0,r[2]],children:[e.jsxs("group",{ref:t,children:[e.jsxs("mesh",{onClick:o,children:[e.jsx("planeGeometry",{args:[1.2,.8]}),e.jsx("meshStandardMaterial",{color:"#080C14",transparent:!0,opacity:.8,side:K,metalness:.8,roughness:.2})]}),e.jsxs("mesh",{position:[0,0,-.01],children:[e.jsx("planeGeometry",{args:[1.22,.82]}),e.jsx("meshBasicMaterial",{color:"#00F5FF",transparent:!0,opacity:.2})]}),e.jsx(L,{position:[0,0,.02],fontSize:.07,color:"#00F5FF",anchorX:"center",anchorY:"middle",font:void 0,lineHeight:1.4,children:d}),e.jsxs("mesh",{ref:a,visible:!1,children:[e.jsx("torusGeometry",{args:[.8,.005,16,64]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})]}),e.jsx(U,{textPrimary:"DEVELOPMENT",textSecondary:"LET'S MAKE SOMETHING REAL.",isHovered:s})]})}const he=`uniform float uTime;
uniform sampler2D tDiffuse; 
uniform float uClarity; // 0.0 (distorted) to 1.0 (clear)
uniform vec2 uHandPos; // normalized handprint position
uniform float uHandIntensity; // bloom intensity
uniform float uOpacity; 
varying vec2 vUv;

void main() {
    float time = uTime * 0.8;
    
    // Idle state: mercury distortion
    float pulse = sin(time) * 0.003;
    float ripple = sin(vUv.y * 12.0 + time * 1.5) * 0.002;
    
    // As uClarity approaches 1.0, distortion approaches 0
    float distortionLevel = 1.0 - uClarity;
    vec2 distorted = vUv + vec2(ripple, pulse) * distortionLevel;
    
    // Heat/Handprint Bloom 
    float distToHand = distance(distorted, uHandPos);
    float handInfluence = smoothstep(0.2, 0.0, distToHand) * uHandIntensity;
    
    // Invert distortion near handprint to make it crystal clear there
    distorted = mix(distorted, vUv, handInfluence);

    vec4 reflection = texture2D(tDiffuse, distorted);
    vec4 tint = vec4(0.85, 0.90, 1.0, 1.0); // cool silver tint
    
    // Vignette
    float vignette = smoothstep(0.0, 0.5, distance(vUv, vec2(0.5)) * 1.4);
    
    vec4 baseColor = mix(reflection * tint, vec4(0.03, 0.04, 0.08, 1.0), vignette * 0.6);
    
    // Add golden bloom from handprint
    vec3 gold = vec3(0.788, 0.659, 0.298); // #C9A84C
    vec4 finalColor = baseColor + vec4(gold * handInfluence * 1.5, 0.0);
    
    gl_FragColor = vec4(finalColor.rgb, finalColor.a * uOpacity);
}
`,ve=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function ge(){const o=E(t=>t.performanceLow)?60:200,r=l.useRef(),i=l.useMemo(()=>{const t=new Float32Array(o*3);for(let a=0;a<o;a++)t[a*3]=(Math.random()-.5)*10,t[a*3+1]=Math.random()*8,t[a*3+2]=(Math.random()-.5)*10-4;return t},[]);return F(t=>{if(r.current){const a=t.clock.elapsedTime;r.current.rotation.y=a*.05,r.current.position.y=Math.sin(a*.2)*.5}}),e.jsxs("points",{ref:r,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",count:o,array:i,itemSize:3})}),e.jsx("pointsMaterial",{size:.03,color:"#FFFFFF",transparent:!0,opacity:.4,sizeAttenuation:!0})]})}function ye(){return e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,5,-10],children:[e.jsx("boxGeometry",{args:[20,10,20]}),e.jsx("meshBasicMaterial",{color:"#080C14",side:ce})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.01,0],children:[e.jsx("planeGeometry",{args:[20,20]}),e.jsx("meshStandardMaterial",{color:"#05080E",roughness:.1,metalness:.9})]}),e.jsx("ambientLight",{intensity:.2}),e.jsx("directionalLight",{position:[0,10,5],intensity:.5,color:"#C9A84C"}),e.jsx("spotLight",{position:[0,10,-6],"target-position":[0,0,-6],angle:.4,penumbra:.8,intensity:2,color:"#FFFFFF",distance:20}),e.jsx(ge,{})]})}function Se({scrollProgress:s,shatterTriggered:o,onMirrorClick:r}){const i=l.useRef(),t=l.useRef(),a=l.useRef(),[d,c]=l.useState([]),[n,f]=l.useState(!1),u=l.useRef(!1),h=l.useRef(new T(.5,.45)),{gl:y,scene:w,camera:M}=le(),m=l.useMemo(()=>new Y({uniforms:{uTime:{value:0},tDiffuse:{value:null},uClarity:{value:0},uHandPos:{value:h.current},uHandIntensity:{value:0},uOpacity:{value:1}},vertexShader:ve,fragmentShader:he}),[]);return l.useEffect(()=>{if(!t.current)return;const p=new ue(3,5),v=E.getState().performanceLow,x=new G(p,{clipBias:.003,textureWidth:window.innerWidth*(v?.5:window.devicePixelRatio),textureHeight:window.innerHeight*(v?.5:window.devicePixelRatio),color:8952217});m.uniforms.tDiffuse.value=x.getRenderTarget().texture;const R=x.onBeforeRender.bind(x);return x.onBeforeRender=(j,S,A)=>{R(j,S,A),m.uniforms.tDiffuse.value=x.getRenderTarget().texture},x.material=m,t.current.add(x),()=>{var j;(j=t.current)==null||j.remove(x),x.dispose(),p.dispose()}},[m]),F(p=>{const v=p.clock.elapsedTime;m.uniforms.uTime.value=v;const x=Math.min(s/.9,1);m.uniforms.uClarity.value=x,s>=.88&&!n?m.uniforms.uHandIntensity.value+=(1-m.uniforms.uHandIntensity.value)*.05:m.uniforms.uHandIntensity.value+=(0-m.uniforms.uHandIntensity.value)*.1}),l.useEffect(()=>{if(o&&!n){f(!0),t.current&&(t.current.visible=!1);const p=de(3,5,6,8);c(p)}},[o,n]),e.jsxs("group",{ref:i,position:[0,2.8,-8],children:[e.jsx("group",{ref:t,onClick:s>=.88?r:null,onPointerOver:()=>u.current=!0,onPointerOut:()=>u.current=!1}),d.length>0&&e.jsx("group",{ref:a,children:d.map((p,v)=>e.jsx(je,{shard:p,customMaterial:m},v))})]})}function je({shard:s,customMaterial:o}){const r=l.useRef(),i=l.useMemo(()=>({uTime:o.uniforms.uTime,tDiffuse:o.uniforms.tDiffuse,uClarity:o.uniforms.uClarity,uHandPos:o.uniforms.uHandPos,uHandIntensity:o.uniforms.uHandIntensity,uOpacity:{value:.9}}),[o]);return l.useEffect(()=>{if(!r.current)return;const t=s.centroid.x,a=s.centroid.y,d=1+Math.random()*2;O.to(r.current.position,{x:r.current.position.x+t*d,y:r.current.position.y+a*d-(3+Math.random()*2),z:r.current.position.z+(Math.random()*2+1),duration:1.2+Math.random()*.8,ease:"power3.out"}),O.to(r.current.rotation,{x:Math.random()*Math.PI*4,y:Math.random()*Math.PI*4,z:Math.random()*Math.PI*4,duration:1.5,ease:"power2.out"}),O.to(i.uOpacity,{value:0,duration:1,delay:.5+Math.random()*.5,onComplete:()=>{r.current&&(r.current.visible=!1)}})},[s,i]),e.jsx("mesh",{ref:r,geometry:s.geometry,position:[s.centroid.x,s.centroid.y,0],children:e.jsx("shaderMaterial",{attach:"material",uniforms:i,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader,transparent:!0})})}function be({visible:s}){const o=l.useRef(),[r,i]=l.useState(!1),[t,a]=l.useState(!1),[d,c]=l.useState(!1);E(f=>f.discoverEgg),l.useRef(0),l.useEffect(()=>{s&&o.current&&(O.fromTo(o.current.position,{z:-15},{z:-5,duration:4,ease:"power2.out"}),O.fromTo(o.current,{opacity:0},{duration:1}))},[s]);const n=(f,u)=>{u&&(f==="A"&&P.triggerHoverPing(528),f==="B"&&P.triggerHoverPing(396),f==="C"&&P.triggerHoverPing(639)),f==="A"&&i(u),f==="B"&&a(u),f==="C"&&c(u)};return s?e.jsxs("group",{ref:o,position:[0,2.5,-5],children:[e.jsx(me,{position:[-2.5,0,0],hovered:r,rotationOffset:Math.PI/4}),e.jsx("group",{onPointerOver:()=>n("B",!0),onPointerOut:()=>n("B",!1),children:e.jsx(pe,{position:[0,0,0],hovered:t,rotationOffset:0})}),e.jsx("group",{onPointerOver:()=>n("C",!0),onPointerOut:()=>n("C",!1),children:e.jsx(xe,{position:[2.5,0,0],hovered:d,rotationOffset:-Math.PI/4})}),e.jsxs("mesh",{position:[-2.5,0,0],visible:!1,onPointerOver:()=>n("A",!0),onPointerOut:()=>n("A",!1),children:[e.jsx("sphereGeometry",{args:[1]}),e.jsx("meshBasicMaterial",{})]})]}):null}function Te(){const s=l.useRef(null),o=E(m=>m.setCursorState),[r,i]=l.useState(0),[t,a]=l.useState(!1),d=l.useRef(!1),c=l.useRef(!1),[n,f]=l.useState(!1),u=oe(),h=E(m=>m.setSignalShattered),[y,w]=l.useState(!1);l.useEffect(()=>{const m=s.current,p=ae.create({trigger:m,start:"top top",end:()=>`+=${m.parentElement.offsetHeight-m.offsetHeight}`,invalidateOnRefresh:!0,pin:!0,scrub:1,onUpdate:v=>{const x=v.progress;i(x);const R=k();if(x>=.9&&!d.current&&!c.current){c.current=!0,f(!0);const j=v.start+(v.end-v.start)*.9;v.scroll()>j&&(R?R.scrollTo(j,{immediate:!0}):window.scrollTo(0,j)),R&&R.stop(),o("hover-glass")}else x<.85&&c.current&&!d.current&&(c.current=!1,f(!1),o("default"))}});return()=>p.kill()},[o]);const M=()=>{d.current||(d.current=!0,a(!0),f(!1),h(!0),o("default"),P.triggerGlassShatter(),P.postBreakAmbience(),setTimeout(()=>{w(!0);const m=k();m&&m.start()},1800))};return l.useEffect(()=>{P.triggerMirrorChorus()},[]),e.jsxs("div",{className:"signal-realm",ref:s,children:[e.jsx("div",{className:"signal-realm-label",children:"VI. THE LOOKING GLASS"}),e.jsxs("div",{className:"approach-text-container",children:[e.jsx("div",{className:`approach-line ${r>.15&&r<.35?"visible":""}`,children:"YOU'VE SEEN THE WORK."}),e.jsx("div",{className:`approach-line ${r>.35&&r<.55?"visible":""}`,children:"YOU'VE FELT THE THOUGHT."}),e.jsx("div",{className:`approach-line ${r>.55&&r<.75?"visible":""}`,children:"NOW YOU KNOW WHO BUILT THIS."}),e.jsx("div",{className:`approach-line come-closer ${r>.75&&!t?"visible scaling":""}`,children:"COME CLOSER."})]}),e.jsx("div",{className:`shatter-prompt ${n?"visible":""}`,children:"BREAK THE GLASS TO MOVE FORWARD."}),e.jsxs(ie,{gl:{antialias:V.TIER>=2,alpha:!1,powerPreference:"high-performance",stencil:!1},dpr:[.85,V.pixelRatio],frameloop:u,style:{position:"absolute",inset:0},children:[e.jsx(fe,{makeDefault:!0,position:[0,2.5,0],fov:60}),e.jsx("fog",{attach:"fog",color:"#080C14",near:2,far:20}),e.jsx(ye,{}),e.jsx(Se,{scrollProgress:r,shatterTriggered:t,onMirrorClick:M}),e.jsx(be,{visible:y})]})]})}export{Te as default};
