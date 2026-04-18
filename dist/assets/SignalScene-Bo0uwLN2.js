import{M as Q,ag as Z,c as N,H as ee,b,an as U,a0 as te,ak as re,f as V,ao as ne,ai as W,V as A,B as Y,n as I,r as u,a as P,j as e,D as _,u as $,S as oe,J as F,C as se,aa as ae,d as ie,e as ce,g as E,ap as z}from"./index-C6A6qjDW.js";import{T as D}from"./Text-Dun43wfy.js";import{P as le}from"./PerspectiveCamera-CBY1_SN-.js";import"./Fbo-CHV-28Jx.js";class B extends Q{constructor(a,r={}){super(a),this.isReflector=!0,this.type="Reflector",this.camera=new Z;const s=this,t=r.color!==void 0?new N(r.color):new N(8355711),l=r.textureWidth||512,f=r.textureHeight||512,i=r.clipBias||0,n=r.shader||B.ReflectorShader,d=r.multisample!==void 0?r.multisample:4,c=new ee,x=new b,h=new b,m=new b,M=new U,y=new b(0,0,-1),p=new W,v=new b,R=new b,g=new W,w=new U,j=this.camera,T=new te(l,f,{samples:d,type:re}),O=new V({name:n.name!==void 0?n.name:"unspecified",uniforms:ne.clone(n.uniforms),fragmentShader:n.fragmentShader,vertexShader:n.vertexShader});O.uniforms.tDiffuse.value=T.texture,O.uniforms.color.value=t,O.uniforms.textureMatrix.value=w,this.material=O,this.onBeforeRender=function(S,K,H){if(h.setFromMatrixPosition(s.matrixWorld),m.setFromMatrixPosition(H.matrixWorld),M.extractRotation(s.matrixWorld),x.set(0,0,1),x.applyMatrix4(M),v.subVectors(h,m),v.dot(x)>0)return;v.reflect(x).negate(),v.add(h),M.extractRotation(H.matrixWorld),y.set(0,0,-1),y.applyMatrix4(M),y.add(m),R.subVectors(h,y),R.reflect(x).negate(),R.add(h),j.position.copy(v),j.up.set(0,1,0),j.up.applyMatrix4(M),j.up.reflect(x),j.lookAt(R),j.far=H.far,j.updateMatrixWorld(),j.projectionMatrix.copy(H.projectionMatrix),w.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),w.multiply(j.projectionMatrix),w.multiply(j.matrixWorldInverse),w.multiply(s.matrixWorld),c.setFromNormalAndCoplanarPoint(x,h),c.applyMatrix4(j.matrixWorldInverse),p.set(c.normal.x,c.normal.y,c.normal.z,c.constant);const C=j.projectionMatrix;g.x=(Math.sign(p.x)+C.elements[8])/C.elements[0],g.y=(Math.sign(p.y)+C.elements[9])/C.elements[5],g.z=-1,g.w=(1+C.elements[10])/C.elements[14],p.multiplyScalar(2/p.dot(g)),C.elements[2]=p.x,C.elements[6]=p.y,C.elements[10]=p.z+1-i,C.elements[14]=p.w,s.visible=!1;const X=S.getRenderTarget(),q=S.xr.enabled,J=S.shadowMap.autoUpdate;S.xr.enabled=!1,S.shadowMap.autoUpdate=!1,S.setRenderTarget(T),S.state.buffers.depth.setMask(!0),S.autoClear===!1&&S.clear(),S.render(K,j),S.xr.enabled=q,S.shadowMap.autoUpdate=J,S.setRenderTarget(X);const k=H.viewport;k!==void 0&&S.state.viewport(k),s.visible=!0},this.getRenderTarget=function(){return T},this.dispose=function(){T.dispose(),s.material.dispose()}}}B.ReflectorShader={name:"ReflectorShader",uniforms:{color:{value:null},tDiffuse:{value:null},textureMatrix:{value:null}},vertexShader:`
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

		}`};function ue(o,a,r=5,s=8){const t=[];t.push(new A(-o/2,-a/2)),t.push(new A(o/2,-a/2)),t.push(new A(-o/2,a/2)),t.push(new A(o/2,a/2));for(let i=1;i<s;i++)for(let n=1;n<r;n++){let d=-o/2+o/r*n,c=-a/2+a/s*i;d+=(Math.random()-.5)*(o/r)*.8,c+=(Math.random()-.5)*(a/s)*.8,t.push(new A(d,c))}const l=(i,n)=>{if(i===0&&n===0)return t[0];if(i===r&&n===0)return t[1];if(i===0&&n===s)return t[2];if(i===r&&n===s)return t[3];if(i>0&&i<r&&n>0&&n<s)return t[4+(n-1)*(r-1)+(i-1)];let d=-o/2+o/r*i,c=-a/2+a/s*n;return new A(d,c)},f=[];for(let i=0;i<s;i++)for(let n=0;n<r;n++){const d=l(n,i+1),c=l(n+1,i+1),x=l(n,i),h=l(n+1,i),m=p=>new A((p.x+o/2)/o,(p.y+a/2)/a),M=L(d,x,h,m),y=L(d,h,c,m);f.push(M,y)}return f}function L(o,a,r,s){const t=new A((o.x+a.x+r.x)/3,(o.y+a.y+r.y)/3),l=new b(o.x-t.x,o.y-t.y,0),f=new b(a.x-t.x,a.y-t.y,0),i=new b(r.x-t.x,r.y-t.y,0),n=new Y,d=new Float32Array([l.x,l.y,l.z,f.x,f.y,f.z,i.x,i.y,i.z]);n.setAttribute("position",new I(d,3));const c=s(o),x=s(a),h=s(r),m=new Float32Array([c.x,c.y,x.x,x.y,h.x,h.y]);n.setAttribute("uv",new I(m,2));const M=new Float32Array([0,0,1,0,0,1,0,0,1]);return n.setAttribute("normal",new I(M,3)),{centroid:new b(t.x,t.y,0),geometry:n}}function G({textPrimary:o,textSecondary:a,isHovered:r}){const s=u.useRef();return P(()=>{if(s.current){const t=r?1:0;s.current.scale.y+=(t-s.current.scale.y)*.1,s.current.position.y=-1.2-(1-s.current.scale.y)*.5}}),e.jsxs("group",{ref:s,children:[e.jsx(D,{fontSize:.2,color:"#F0F0F0",anchorX:"center",anchorY:"top",position:[0,0,0],font:void 0,letterSpacing:.05,children:o}),e.jsx(D,{fontSize:.06,color:"#C9A84C",anchorX:"center",anchorY:"top",position:[0,-.4,0],font:void 0,letterSpacing:.2,children:a})]})}function de({hovered:o,onClick:a,position:r,rotationOffset:s}){const t=u.useRef(),l=u.useRef(),f=u.useMemo(()=>{const i=new Y,n=new Float32Array([0,.2,0,-.1,0,.2,.1,0,.2,0,.2,0,.1,0,.2,0,-.1,0,0,.2,0,0,-.1,0,-.1,0,.2,0,.2,0,-.6,.4,-.2,-.1,0,.2,0,.2,0,.1,0,.2,.6,.4,-.2,.1,0,.2,0,.5,.3,-.1,0,.2,0,.2,0,-.1,0,.2,0,.1,-.5,0,.2,0,0,.1,-.5,.1,0,.2]);return i.setAttribute("position",new I(n,3)),i.computeVertexNormals(),i},[]);return P(i=>{if(!t.current)return;const n=i.clock.elapsedTime;let c=(s||0)+n*.2,x=1;o&&(c=0,x=1.25),t.current.rotation.y+=(c-t.current.rotation.y)*.1,t.current.rotation.x+=((o?Math.PI/12:Math.sin(n*.5)*.1)-t.current.rotation.x)*.1,t.current.scale.lerp(new b().setScalar(x),.1),t.current.position.y=r[1]+Math.sin(n+r[0])*.1,l.current&&(l.current.rotation.z+=.01,l.current.rotation.x=Math.PI/2+Math.sin(n)*.2,l.current.scale.lerp(new b().setScalar(o?1.5:0),.1),l.current.visible=l.current.scale.x>.01)}),e.jsxs("group",{position:[r[0],0,r[2]],children:[e.jsxs("group",{ref:t,children:[e.jsx("mesh",{geometry:f,onClick:a,children:e.jsx("meshStandardMaterial",{color:"#FFFFFF",emissive:"#C9A84C",emissiveIntensity:.2,transparent:!0,opacity:.9,wireframe:!0,side:_})}),e.jsxs("mesh",{ref:l,visible:!1,children:[e.jsx("torusGeometry",{args:[.5,.005,16,64]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})]}),e.jsx(G,{textPrimary:"rniteshvarma@gmail.com",textSecondary:"WRITE SOMETHING WORTH READING.",isHovered:o})]})}function fe({hovered:o,onClick:a,position:r,rotationOffset:s}){const t=u.useRef(),l=u.useRef(),f=u.useRef();return P(i=>{if(!t.current)return;const n=i.clock.elapsedTime;let d=s+n*.3,c=1;o&&(d=0,c=1.25),t.current.rotation.y+=(d-t.current.rotation.y)*.1,t.current.rotation.x+=((o?Math.PI/4:0)-t.current.rotation.x)*.1,t.current.scale.lerp(new b().setScalar(c),.1),t.current.position.y=r[1]+Math.cos(n+r[0])*.1,f.current&&(f.current.rotation.z=n*2),l.current&&(l.current.rotation.z-=.01,l.current.scale.lerp(new b().setScalar(o?1.5:0),.1),l.current.visible=l.current.scale.x>.01)}),e.jsxs("group",{position:[r[0],0,r[2]],children:[e.jsxs("group",{ref:t,children:[e.jsxs("mesh",{onClick:a,children:[e.jsx("torusGeometry",{args:[.4,.05,16,32]}),e.jsx("meshStandardMaterial",{metalness:1,roughness:.1,color:"#AAAAAA"})]}),e.jsxs("mesh",{children:[e.jsx("sphereGeometry",{args:[.08,16,16]}),e.jsx("meshStandardMaterial",{metalness:1,roughness:.1,color:"#C9A84C"})]}),e.jsxs("mesh",{ref:f,children:[e.jsx("octahedronGeometry",{args:[.3,0]}),e.jsx("meshStandardMaterial",{metalness:1,roughness:.2,color:"#00F5FF"})]}),e.jsxs("mesh",{ref:l,visible:!1,children:[e.jsx("torusGeometry",{args:[.6,.005,16,64]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})]}),e.jsx(G,{textPrimary:"linkedin.com/in/niteshvarma",textSecondary:"FIND YOUR BEARING.",isHovered:o})]})}function me({hovered:o,onClick:a,position:r,rotationOffset:s}){const t=u.useRef(),l=u.useRef(),f=`/* 
  if (you.need(creativity)) {
    return me.call();
  }
*/`;return P(i=>{if(!t.current)return;const n=i.clock.elapsedTime;let d=s-n*.1,c=1;o&&(d=0,c=1.25),t.current.rotation.y+=(d-t.current.rotation.y)*.1,t.current.rotation.x+=((o?0:Math.sin(n)*.1)-t.current.rotation.x)*.1,t.current.scale.lerp(new b().setScalar(c),.1),t.current.position.y=r[1]+Math.sin(n*.5+r[0])*.1,l.current&&(l.current.rotation.z+=.015,l.current.scale.lerp(new b().setScalar(o?1.5:0),.1),l.current.visible=l.current.scale.x>.01)}),e.jsxs("group",{position:[r[0],0,r[2]],children:[e.jsxs("group",{ref:t,children:[e.jsxs("mesh",{onClick:a,children:[e.jsx("planeGeometry",{args:[1.2,.8]}),e.jsx("meshStandardMaterial",{color:"#080C14",transparent:!0,opacity:.8,side:_,metalness:.8,roughness:.2})]}),e.jsxs("mesh",{position:[0,0,-.01],children:[e.jsx("planeGeometry",{args:[1.22,.82]}),e.jsx("meshBasicMaterial",{color:"#00F5FF",transparent:!0,opacity:.2})]}),e.jsx(D,{position:[0,0,.01],fontSize:.08,color:"#00F5FF",anchorX:"center",anchorY:"middle",font:void 0,children:f}),e.jsxs("mesh",{ref:l,visible:!1,children:[e.jsx("torusGeometry",{args:[.8,.005,16,64]}),e.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:.6})]})]}),e.jsx(G,{textPrimary:"github.com/niteshvarma",textSecondary:"READ THE RECEIPTS.",isHovered:o})]})}const pe=`uniform float uTime;
uniform sampler2D tDiffuse; 
uniform float uClarity; // 0.0 (distorted) to 1.0 (clear)
uniform vec2 uHandPos; // normalized handprint position
uniform float uHandIntensity; // bloom intensity
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
    
    gl_FragColor = finalColor;
}
`,xe=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function he(){const a=u.useRef(),r=u.useMemo(()=>{const s=new Float32Array(600);for(let t=0;t<200;t++)s[t*3]=(Math.random()-.5)*10,s[t*3+1]=Math.random()*8,s[t*3+2]=(Math.random()-.5)*10-4;return s},[]);return P(s=>{if(a.current){const t=s.clock.elapsedTime;a.current.rotation.y=t*.05,a.current.position.y=Math.sin(t*.2)*.5}}),e.jsxs("points",{ref:a,children:[e.jsx("bufferGeometry",{children:e.jsx("bufferAttribute",{attach:"attributes-position",count:200,array:r,itemSize:3})}),e.jsx("pointsMaterial",{size:.03,color:"#FFFFFF",transparent:!0,opacity:.4,sizeAttenuation:!0})]})}function ve(){return e.jsxs("group",{children:[e.jsxs("mesh",{position:[0,5,-10],children:[e.jsx("boxGeometry",{args:[20,10,20]}),e.jsx("meshBasicMaterial",{color:"#080C14",side:ae})]}),e.jsxs("mesh",{rotation:[-Math.PI/2,0,0],position:[0,-.01,0],children:[e.jsx("planeGeometry",{args:[20,20]}),e.jsx("meshStandardMaterial",{color:"#05080E",roughness:.1,metalness:.9})]}),e.jsx("ambientLight",{intensity:.2}),e.jsx("directionalLight",{position:[0,10,5],intensity:.5,color:"#C9A84C"}),e.jsx("spotLight",{position:[0,10,-6],"target-position":[0,0,-6],angle:.4,penumbra:.8,intensity:2,color:"#FFFFFF",distance:20}),e.jsx(he,{})]})}function ge({scrollProgress:o,shatterTriggered:a,onMirrorClick:r}){const s=u.useRef(),t=u.useRef(),l=u.useRef(),[f,i]=u.useState([]),[n,d]=u.useState(!1),c=u.useRef(!1),x=u.useRef(new A(.5,.45)),{gl:h,scene:m,camera:M}=ie(),y=u.useMemo(()=>new V({uniforms:{uTime:{value:0},tDiffuse:{value:null},uClarity:{value:0},uHandPos:{value:x.current},uHandIntensity:{value:0}},vertexShader:xe,fragmentShader:pe}),[]);return u.useEffect(()=>{if(!t.current)return;const p=new ce(3,5),v=new B(p,{clipBias:.003,textureWidth:window.innerWidth*window.devicePixelRatio,textureHeight:window.innerHeight*window.devicePixelRatio,color:8952217});y.uniforms.tDiffuse.value=v.getRenderTarget().texture;const R=v.onBeforeRender.bind(v);return v.onBeforeRender=(g,w,j)=>{R(g,w,j),y.uniforms.tDiffuse.value=v.getRenderTarget().texture},v.material=y,t.current.add(v),()=>{var g;(g=t.current)==null||g.remove(v),v.dispose(),p.dispose()}},[y]),P(p=>{const v=p.clock.elapsedTime;y.uniforms.uTime.value=v;const R=Math.min(o/.9,1);y.uniforms.uClarity.value=R,o>=.9&&!n?y.uniforms.uHandIntensity.value+=(1-y.uniforms.uHandIntensity.value)*.05:y.uniforms.uHandIntensity.value+=(0-y.uniforms.uHandIntensity.value)*.1}),u.useEffect(()=>{if(a&&!n){d(!0),t.current&&(t.current.visible=!1);const p=ue(3,5,6,8);i(p),setTimeout(()=>{var R;(((R=l.current)==null?void 0:R.children)||[]).forEach(g=>{const w=g.userData.centroid.x,j=g.userData.centroid.y,T=1+Math.random()*2;E.to(g.position,{x:g.position.x+w*T,y:g.position.y+j*T-(3+Math.random()*2),z:g.position.z+(Math.random()*2+1),duration:1.2+Math.random()*.8,ease:"power3.out"}),E.to(g.rotation,{x:Math.random()*Math.PI*4,y:Math.random()*Math.PI*4,z:Math.random()*Math.PI*4,duration:1.5,ease:"power2.out"}),E.to(g.material,{opacity:0,duration:1,delay:.5+Math.random()*.5,onComplete:()=>{g.visible=!1}})})},50)}},[a,n]),e.jsxs("group",{ref:s,position:[0,2.8,-8],children:[e.jsx("group",{ref:t,onClick:o>=.9?r:null,onPointerOver:()=>c.current=!0,onPointerOut:()=>c.current=!1}),f.length>0&&e.jsx("group",{ref:l,children:f.map((p,v)=>e.jsx("mesh",{geometry:p.geometry,position:[p.centroid.x,p.centroid.y,0],userData:{centroid:p.centroid},children:e.jsx("primitive",{object:y.clone(),attach:"material",transparent:!0,opacity:.9})},v))})]})}function ye({visible:o}){const a=u.useRef(),[r,s]=u.useState(!1),[t,l]=u.useState(!1),[f,i]=u.useState(!1),n=$(m=>m.discoverEgg),d=u.useRef(0);u.useEffect(()=>{o&&a.current&&(E.fromTo(a.current.position,{z:-15},{z:-5,duration:4,ease:"power2.out"}),E.fromTo(a.current,{opacity:0},{duration:1}))},[o]);const c=(m,M)=>{M&&(m==="A"&&F.triggerHoverPing(528),m==="B"&&F.triggerHoverPing(396),m==="C"&&F.triggerHoverPing(639)),m==="A"&&s(M),m==="B"&&l(M),m==="C"&&i(M)},x=m=>{window.open(m,"_blank")},h=()=>{d.current+=1,d.current>=3&&(n("morse"),F.triggerHoverPing(800))};return o?e.jsxs("group",{ref:a,position:[0,2.5,-5],children:[e.jsx(de,{position:[-2.5,0,0],hovered:r,rotationOffset:Math.PI/4,onClick:()=>x("mailto:rniteshvarma@gmail.com")}),e.jsx("group",{onPointerOver:()=>c("B",!0),onPointerOut:()=>c("B",!1),onClick:h,children:e.jsx(fe,{position:[0,0,0],hovered:t,rotationOffset:0})}),e.jsx("group",{onPointerOver:()=>c("C",!0),onPointerOut:()=>c("C",!1),onClick:()=>x("https://github.com/rniteshvarma"),children:e.jsx(me,{position:[2.5,0,0],hovered:f,rotationOffset:-Math.PI/4})}),e.jsxs("mesh",{position:[-2.5,0,0],visible:!1,onPointerOver:()=>c("A",!0),onPointerOut:()=>c("A",!1),children:[e.jsx("sphereGeometry",{args:[1]}),e.jsx("meshBasicMaterial",{})]})]}):null}function Re(){const o=u.useRef(null),a=$(d=>d.setCursorState),[r,s]=u.useState(0),[t,l]=u.useState(!1),[f,i]=u.useState(!1);u.useEffect(()=>{const d=oe.create({trigger:o.current,start:"top top",end:"+=400vh",pin:!0,scrub:1,onUpdate:c=>{const x=c.progress;s(x);const h=z();if(x>=.9&&!t){const m=c.start+(c.end-c.start)*.9;c.scroll()>m&&(h?h.scrollTo(m,{immediate:!0}):window.scrollTo(0,m)),h&&h.stop(),a("hover-glass")}}});return()=>d.kill()},[a,t]);const n=()=>{t||(l(!0),a("default"),F.triggerGlassShatter(),F.postBreakAmbience(),setTimeout(()=>{i(!0);const d=z();d&&d.start()},1800))};return u.useEffect(()=>{F.triggerMirrorChorus()},[]),e.jsxs("div",{className:"signal-realm",ref:o,children:[e.jsxs("div",{className:"approach-text-container",children:[e.jsx("div",{className:`approach-line ${r>.15&&r<.35?"visible":""}`,children:"YOU'VE SEEN THE WORK."}),e.jsx("div",{className:`approach-line ${r>.35&&r<.55?"visible":""}`,children:"YOU'VE FELT THE THOUGHT."}),e.jsx("div",{className:`approach-line ${r>.55&&r<.75?"visible":""}`,children:"NOW YOU KNOW WHO BUILT THIS."}),e.jsx("div",{className:`approach-line come-closer ${r>.75&&!t?"visible scaling":""}`,children:"COME CLOSER."})]}),e.jsx("div",{className:`shatter-prompt ${r>=.9&&!t?"visible":""}`,children:"PRESS YOUR HAND AGAINST THE GLASS."}),f&&e.jsx("div",{className:"floor-inscription",children:"EVERY GREAT COLLABORATION BEGINS WITH HELLO."}),f&&e.jsxs("div",{className:"looking-glass-footer",children:["REALM IV — THE LOOKING GLASS — ",new Date().getFullYear()," — HAND-CODED IN THE DARK"]}),e.jsxs(se,{gl:{antialias:!0,alpha:!1},dpr:[1,1.5],style:{position:"absolute",inset:0},children:[e.jsx(le,{makeDefault:!0,position:[0,2.5,0],fov:60}),e.jsx("fog",{attach:"fog",color:"#080C14",near:2,far:20}),e.jsx(ve,{}),e.jsx(ge,{scrollProgress:r,shatterTriggered:t,onMirrorClick:n}),e.jsx(ye,{visible:f})]})]})}export{Re as default};
