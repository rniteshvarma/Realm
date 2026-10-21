import{a as H,r as c,W as V,H as Ce,L as K,g as Me,F as ve,b as I,V as D,U as ie,h as G,i as Ge,k as He,l as ze,C as F,N as ae,m as Q,n as pe,o as _e,p as Ae,q as be,O as We,s as Ve,t as ne,D as X,S as Z,v as je,w as me,x as M,y as De,T as Ne,R as qe,P as $e,A as Xe,B as ge,d as xe,z as de,G as Ye,j as o,J as Ke,K as q,c as w,f as Qe,X as Pe,Y as Ze,Z as Je,_ as Be,$ as et,a0 as Ie,a1 as tt,a2 as nt,a3 as st,a4 as rt,a5 as re,u as it,a6 as at,e as ot}from"./index-EHYa12sO.js";import{V as lt}from"./VoyageCanvas-XSA0YfCj.js";import{_ as ct,T as ut}from"./Text-BwKYpmFi.js";let te;function dt(){var e;if(te!==void 0)return te;try{let t;const n=document.createElement("canvas");return te=!!(window.WebGL2RenderingContext&&(t=n.getContext("webgl2"))),t&&((e=t.getExtension("WEBGL_lose_context"))==null||e.loseContext()),te}catch{return te=!1}}function ft(e,t,n){const s=H(v=>v.size),i=H(v=>v.viewport),r=typeof e=="number"?e:s.width*i.dpr,a=s.height*i.dpr,u=(typeof e=="number"?n:e)||{},{samples:l=0,depth:h,...d}=u,f=c.useMemo(()=>{const v=new V(r,a,{minFilter:K,magFilter:K,type:Ce,...d});return h&&(v.depthTexture=new Me(r,a,ve)),v.samples=l,v},[]);return c.useLayoutEffect(()=>{f.setSize(r,a),l&&(f.samples=l)},[l,f,r,a]),c.useEffect(()=>()=>f.dispose(),[]),f}const ht=e=>typeof e=="function",vt=c.forwardRef(({envMap:e,resolution:t=256,frames:n=1/0,makeDefault:s,children:i,...r},a)=>{const u=H(({set:b})=>b),l=H(({camera:b})=>b),h=H(({size:b})=>b),d=c.useRef(null);c.useImperativeHandle(a,()=>d.current,[]);const f=c.useRef(null),v=ft(t);c.useLayoutEffect(()=>{r.manual||(d.current.aspect=h.width/h.height)},[h,r]),c.useLayoutEffect(()=>{d.current.updateProjectionMatrix()});let p=0,x=null;const S=ht(i);return I(b=>{S&&(n===1/0||p<n)&&(f.current.visible=!1,b.gl.setRenderTarget(v),x=b.scene.background,e&&(b.scene.background=e),b.gl.render(b.scene,d.current),b.scene.background=x,b.gl.setRenderTarget(null),f.current.visible=!0,p++)}),c.useLayoutEffect(()=>{if(s){const b=l;return u(()=>({camera:d.current})),()=>u(()=>({camera:b}))}},[d,s,u]),c.createElement(c.Fragment,null,c.createElement("perspectiveCamera",ct({ref:d},r),!S&&i),c.createElement("group",{ref:f},S&&i(v.texture)))});/**
 * postprocessing v6.39.1 build Fri Apr 17 2026
 * https://github.com/pmndrs/postprocessing
 * Copyright 2015-2026 Raoul van Rüschen
 * @license Zlib
 */var pt=(()=>{const e=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),t=new Float32Array([0,0,2,0,0,2]),n=new ge;return n.setAttribute("position",new xe(e,3)),n.setAttribute("uv",new xe(t,2)),n})(),U=class fe{static get fullscreenGeometry(){return pt}constructor(t="Pass",n=new be,s=new We){this.name=t,this.renderer=null,this.scene=n,this.camera=s,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthBlit=!1,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(t){if(this.rtt===t){const n=this.fullscreenMaterial;n!==null&&(n.needsUpdate=!0),this.rtt=!t}}set mainScene(t){}set mainCamera(t){}setRenderer(t){this.renderer=t}isEnabled(){return this.enabled}setEnabled(t){this.enabled=t}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(t){let n=this.screen;n!==null?n.material=t:(n=new Ve(fe.fullscreenGeometry,t),n.frustumCulled=!1,this.scene===null&&(this.scene=new be),this.scene.add(n),this.screen=n)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(t){this.fullscreenMaterial=t}getDepthTexture(){return null}setDepthTexture(t,n=Q){}render(t,n,s,i,r){throw new Error("Render method not implemented!")}setSize(t,n){}initialize(t,n,s){}dispose(){for(const t of Object.keys(this)){const n=this[t];(n instanceof V||n instanceof De||n instanceof Ne||n instanceof fe)&&this[t].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},mt=class extends U{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(e,t,n,s,i){const r=e.state.buffers.stencil;r.setLocked(!1),r.setTest(!1)}},gt=`#ifdef COLOR_WRITE
#include <common>
#include <dithering_pars_fragment>
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#endif
#ifdef DEPTH_WRITE
#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}
#endif
#ifdef USE_WEIGHTS
uniform vec4 channelWeights;
#endif
uniform float opacity;varying vec2 vUv;void main(){
#ifdef COLOR_WRITE
vec4 texel=texture2D(inputBuffer,vUv);
#ifdef USE_WEIGHTS
texel*=channelWeights;
#endif
gl_FragColor=opacity*texel;
#ifdef COLOR_SPACE_CONVERSION
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
#else
gl_FragColor=vec4(0.0);
#endif
#ifdef DEPTH_WRITE
gl_FragDepth=readDepth(vUv);
#endif
}`,bt="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",xt=class extends Z{constructor(){super({name:"CopyMaterial",defines:{COLOR_SPACE_CONVERSION:"1",DEPTH_PACKING:"0",COLOR_WRITE:"1"},uniforms:{inputBuffer:new M(null),depthBuffer:new M(null),channelWeights:new M(null),opacity:new M(1)},blending:me,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:gt,vertexShader:bt}),this.depthFunc=Xe}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(e){const t=e!==null;this.colorWrite!==t&&(t?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=t,this.needsUpdate=!0),this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){const t=e!==null;this.depthWrite!==t&&(t?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=t,this.depthWrite=t,this.needsUpdate=!0),this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}get colorSpaceConversion(){return this.defines.COLOR_SPACE_CONVERSION!==void 0}set colorSpaceConversion(e){this.colorSpaceConversion!==e&&(e?this.defines.COLOR_SPACE_CONVERSION=!0:delete this.defines.COLOR_SPACE_CONVERSION,this.needsUpdate=!0)}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(e){e!==null?(this.defines.USE_WEIGHTS="1",this.uniforms.channelWeights.value=e):delete this.defines.USE_WEIGHTS,this.needsUpdate=!0}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}},St=class extends U{constructor(e,t=!0){super("CopyPass"),this.fullscreenMaterial=new xt,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new V(1,1,{minFilter:K,magFilter:K,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,n,s,i){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,n){n!==void 0&&(this.renderTarget.texture.type=n,n!==ie?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":e!==null&&e.outputColorSpace===G&&(this.renderTarget.texture.colorSpace=G))}},Se=new F,Oe=class extends U{constructor(e=!0,t=!0,n=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=n,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,n){this.color=e,this.depth=t,this.stencil=n}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,n,s,i){const r=this.overrideClearColor,a=this.overrideClearAlpha,u=e.getClearAlpha(),l=r!==null,h=a>=0;l?(e.getClearColor(Se),e.setClearColor(r,h?a:u)):h&&e.setClearAlpha(a),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),l?e.setClearColor(Se,u):h&&e.setClearAlpha(u)}},yt=class extends U{constructor(e,t){super("MaskPass",e,t),this.needsSwap=!1,this.clearPass=new Oe(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,n,s,i){const r=e.getContext(),a=e.state.buffers,u=this.scene,l=this.camera,h=this.clearPass,d=this.inverted?0:1,f=1-d;a.color.setMask(!1),a.depth.setMask(!1),a.color.setLocked(!0),a.depth.setLocked(!0),a.stencil.setTest(!0),a.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),a.stencil.setFunc(r.ALWAYS,d,4294967295),a.stencil.setClear(f),a.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?h.render(e,null):(h.render(e,t),h.render(e,n))),this.renderToScreen?(e.setRenderTarget(null),e.render(u,l)):(e.setRenderTarget(t),e.render(u,l),e.setRenderTarget(n),e.render(u,l)),a.color.setLocked(!1),a.depth.setLocked(!1),a.stencil.setLocked(!1),a.stencil.setFunc(r.EQUAL,1,4294967295),a.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),a.stencil.setLocked(!0)}},ce=1/1e3,Et=1e3,Tt=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document<"u"&&document.hidden!==void 0&&(e?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=e)}get delta(){return this._delta*ce}get fixedDelta(){return this._fixedDelta*ce}set fixedDelta(e){this._fixedDelta=e*Et}get elapsed(){return this._elapsed*ce}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(e!==void 0?e:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(e){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},wt=class{constructor(t=null,{depthBuffer:n=!0,stencilBuffer:s=!1,multisampling:i=0,frameBufferType:r}={}){this.renderer=null,this.inputBuffer=this.createBuffer(n,s,r,i),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new St,this.depthTexture=null,this.depthRenderTarget=null,this.passes=[],this.timer=new Tt,this.autoRenderToScreen=!0,this.setRenderer(t)}get multisampling(){return this.inputBuffer.samples}set multisampling(t){const n=this.inputBuffer,s=this.multisampling;s>0&&t>0?(this.inputBuffer.samples=t,this.outputBuffer.samples=t,this.inputBuffer.dispose(),this.outputBuffer.dispose()):s!==t&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(n.depthBuffer,n.stencilBuffer,n.texture.type,t),this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(t){if(this.renderer=t,t!==null){const n=t.getSize(new D),s=t.getContext().getContextAttributes().alpha,i=this.inputBuffer.texture.type;i===ie&&t.outputColorSpace===G&&(this.inputBuffer.texture.colorSpace=G,this.outputBuffer.texture.colorSpace=G,this.inputBuffer.dispose(),this.outputBuffer.dispose()),t.autoClear=!1,this.setSize(n.width,n.height);for(const r of this.passes)r.initialize(t,s,i)}}replaceRenderer(t,n=!0){const s=this.renderer,i=s.domElement.parentNode;return this.setRenderer(t),n&&i!==null&&(i.removeChild(s.domElement),i.appendChild(t.domElement)),s}createDepthTexture(){const t=this.inputBuffer,n=new Me;this.depthTexture=n,t.stencilBuffer?(n.format=Ge,n.type=He):n.type=ve;const s=n.clone();return s.name="EffectComposer.StableDepth",this.depthRenderTarget=new V(t.width,t.height,{depthBuffer:!0,stencilBuffer:t.stencilBuffer,depthTexture:s}),s}blitDepthBuffer(t){const n=this.renderer,s=this.depthRenderTarget,i=n.properties,r=n.getContext();n.setRenderTarget(s);const a=i.get(t).__webglFramebuffer,u=i.get(s).__webglFramebuffer,l=t.stencilBuffer?r.DEPTH_BUFFER_BIT|r.STENCIL_BUFFER_BIT:r.DEPTH_BUFFER_BIT;r.bindFramebuffer(r.READ_FRAMEBUFFER,a),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,u),r.blitFramebuffer(0,0,t.width,t.height,0,0,s.width,s.height,l,r.NEAREST),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),n.setRenderTarget(null)}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.depthRenderTarget.dispose(),this.depthRenderTarget=null,this.inputBuffer.depthTexture=null,this.outputBuffer.depthTexture=null;for(const t of this.passes)t.setDepthTexture(null)}}createBuffer(t,n,s,i){const r=this.renderer,a=r===null?new D:r.getDrawingBufferSize(new D),u={minFilter:K,magFilter:K,stencilBuffer:n,depthBuffer:t,type:s},l=new V(a.width,a.height,u);return i>0&&(l.samples=i),s===ie&&r!==null&&r.outputColorSpace===G&&(l.texture.colorSpace=G),l.texture.name="EffectComposer.Buffer",l.texture.generateMipmaps=!1,l}setMainScene(t){for(const n of this.passes)n.mainScene=t}setMainCamera(t){for(const n of this.passes)n.mainCamera=t}addPass(t,n){const s=this.passes,i=this.renderer,r=i.getDrawingBufferSize(new D),a=i.getContext().getContextAttributes().alpha,u=this.inputBuffer.texture.type;if(t.renderer=i,t.setSize(r.width,r.height),t.initialize(i,a,u),this.autoRenderToScreen&&(s.length>0&&(s[s.length-1].renderToScreen=!1),t.renderToScreen&&(this.autoRenderToScreen=!1)),n!==void 0?s.splice(n,0,t):s.push(t),this.autoRenderToScreen&&(s[s.length-1].renderToScreen=!0),t.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){const l=this.createDepthTexture();for(t of s)t.setDepthTexture(l)}else{const l=this.depthRenderTarget.depthTexture;t.setDepthTexture(l)}}removePass(t){const n=this.passes,s=n.indexOf(t);if(s!==-1&&n.splice(s,1).length>0){if(this.depthTexture!==null){const a=(l,h)=>l||h.needsDepthTexture;if(!n.reduce(a,!1)){const l=this.depthRenderTarget.depthTexture;t.getDepthTexture()===l&&t.setDepthTexture(null),this.deleteDepthTexture()}}this.autoRenderToScreen&&s===n.length&&(t.renderToScreen=!1,n.length>0&&(n[n.length-1].renderToScreen=!0))}}removeAllPasses(){const t=this.passes;this.deleteDepthTexture(),t.length>0&&(this.autoRenderToScreen&&(t[t.length-1].renderToScreen=!1),this.passes=[])}render(t){const n=this.renderer,s=this.copyPass;let i=this.inputBuffer,r=this.outputBuffer,a,u=!1;t===void 0&&(this.timer.update(),t=this.timer.getDelta());for(const l of this.passes)if(l.enabled){if(i.depthTexture=this.depthTexture,r.depthTexture=null,l.render(n,i,r,t,u),l.needsDepthBlit&&this.depthRenderTarget!==null&&this.blitDepthBuffer(i),l.needsSwap){if(u){s.renderToScreen=l.renderToScreen;const h=n.getContext(),d=n.state.buffers.stencil;d.setFunc(h.NOTEQUAL,1,4294967295),s.render(n,i,r,t,u),d.setFunc(h.EQUAL,1,4294967295)}a=i,i=r,r=a}l instanceof yt?u=!0:l instanceof mt&&(u=!1)}}setSize(t,n,s){const i=this.renderer,r=i.getSize(new D);(t===void 0||n===void 0)&&(t=r.width,n=r.height),(r.width!==t||r.height!==n)&&i.setSize(t,n,s);const a=i.getDrawingBufferSize(new D);this.inputBuffer.setSize(a.width,a.height),this.outputBuffer.setSize(a.width,a.height),this.depthRenderTarget!==null&&this.depthRenderTarget.setSize(a.width,a.height);for(const u of this.passes)u.setSize(a.width,a.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(const t of this.passes)t.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose(),U.fullscreenGeometry.dispose()}},L={NONE:0,DEPTH:1,CONVOLUTION:2},E={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},Rt=class{constructor(){this.shaderParts=new Map([[E.FRAGMENT_HEAD,null],[E.FRAGMENT_MAIN_UV,null],[E.FRAGMENT_MAIN_IMAGE,null],[E.VERTEX_HEAD,null],[E.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=L.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=_e}},ue=!1,ye=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let n;if(t.material.flatShading)switch(t.material.side){case X:n=this.materialsFlatShadedDoubleSide;break;case ne:n=this.materialsFlatShadedBackSide;break;default:n=this.materialsFlatShaded;break}else switch(t.material.side){case X:n=this.materialsDoubleSide;break;case ne:n=this.materialsBackSide;break;default:n=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=n[2]:t.isInstancedMesh?t.material=n[1]:t.material=n[0],++this.meshCount}}}cloneMaterial(e){if(!(e instanceof Z))return e.clone();const t=e.uniforms,n=new Map;for(const i in t){const r=t[i].value;r.isRenderTargetTexture&&(t[i].value=null,n.set(i,r))}const s=e.clone();for(const i of n)t[i[0]].value=i[1],s.uniforms[i[0]].value=i[1];return s}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){const t=this.materials=[this.cloneMaterial(e),this.cloneMaterial(e),this.cloneMaterial(e)];for(const n of t)n.uniforms=Object.assign({},e.uniforms),n.side=je;t[2].skinning=!0,this.materialsBackSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.side=ne,s}),this.materialsDoubleSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.side=X,s}),this.materialsFlatShaded=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s}),this.materialsFlatShadedBackSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s.side=ne,s}),this.materialsFlatShadedDoubleSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s.side=X,s})}}render(e,t,n){const s=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,ue){const i=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,n);for(const r of i)r[0].material=r[1];this.meshCount!==i.size&&i.clear()}else{const i=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,n),t.overrideMaterial=i}e.shadowMap.enabled=s}disposeMaterials(){if(this.material!==null){const e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(const t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return ue}static set workaroundEnabled(e){ue=e}},W=-1,Y=class extends pe{constructor(e=null,t=W,n=W,s=1){super(),e!==null&&this.addEventListener("change",()=>e.setSize(this.baseSize.width,this.baseSize.height)),this.baseSize=new D(1,1),this.preferredSize=new D(t,n),this.target=this.preferredSize,this.s=s,this.effectiveSize=new D,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){const e=this.baseSize,t=this.preferredSize,n=this.effectiveSize,s=this.scale;t.width!==W?n.width=t.width:t.height!==W?n.width=Math.round(t.height*(e.width/Math.max(e.height,1))):n.width=Math.round(e.width*s),t.height!==W?n.height=t.height:t.width!==W?n.height=Math.round(t.width/Math.max(e.width/Math.max(e.height,1),1)):n.height=Math.round(e.height*s)}get width(){return this.effectiveSize.width}set width(e){this.preferredWidth=e}get height(){return this.effectiveSize.height}set height(e){this.preferredHeight=e}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(e){this.s!==e&&(this.s=e,this.preferredSize.setScalar(W),this.dispatchEvent({type:"change"}))}getScale(){return this.scale}setScale(e){this.scale=e}get baseWidth(){return this.baseSize.width}set baseWidth(e){this.baseSize.width!==e&&(this.baseSize.width=e,this.dispatchEvent({type:"change"}))}getBaseWidth(){return this.baseWidth}setBaseWidth(e){this.baseWidth=e}get baseHeight(){return this.baseSize.height}set baseHeight(e){this.baseSize.height!==e&&(this.baseSize.height=e,this.dispatchEvent({type:"change"}))}getBaseHeight(){return this.baseHeight}setBaseHeight(e){this.baseHeight=e}setBaseSize(e,t){(this.baseSize.width!==e||this.baseSize.height!==t)&&(this.baseSize.set(e,t),this.dispatchEvent({type:"change"}))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(e){this.preferredSize.width!==e&&(this.preferredSize.width=e,this.dispatchEvent({type:"change"}))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(e){this.preferredWidth=e}get preferredHeight(){return this.preferredSize.height}set preferredHeight(e){this.preferredSize.height!==e&&(this.preferredSize.height=e,this.dispatchEvent({type:"change"}))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(e){this.preferredHeight=e}setPreferredSize(e,t){(this.preferredSize.width!==e||this.preferredSize.height!==t)&&(this.preferredSize.set(e,t),this.dispatchEvent({type:"change"}))}copy(e){this.s=e.scale,this.baseSize.set(e.baseWidth,e.baseHeight),this.preferredSize.set(e.preferredWidth,e.preferredHeight),this.dispatchEvent({type:"change"})}static get AUTO_SIZE(){return W}},y={ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},Ct="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Mt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}",_t="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",At="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Dt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Nt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Pt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Bt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",It="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ot="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ft="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ut="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",kt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Lt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Gt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ht="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",zt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Wt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Vt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",jt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",qt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",$t="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Xt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}",Yt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Kt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Qt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Zt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Jt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",en="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",tn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}",nn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",sn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",rn=new Map([[y.ADD,Ct],[y.ALPHA,Mt],[y.AVERAGE,_t],[y.COLOR,At],[y.COLOR_BURN,Dt],[y.COLOR_DODGE,Nt],[y.DARKEN,Pt],[y.DIFFERENCE,Bt],[y.DIVIDE,It],[y.DST,null],[y.EXCLUSION,Ot],[y.HARD_LIGHT,Ft],[y.HARD_MIX,Ut],[y.HUE,kt],[y.INVERT,Lt],[y.INVERT_RGB,Gt],[y.LIGHTEN,Ht],[y.LINEAR_BURN,zt],[y.LINEAR_DODGE,Wt],[y.LINEAR_LIGHT,Vt],[y.LUMINOSITY,jt],[y.MULTIPLY,qt],[y.NEGATION,$t],[y.NORMAL,Xt],[y.OVERLAY,Yt],[y.PIN_LIGHT,Kt],[y.REFLECT,Qt],[y.SATURATION,Zt],[y.SCREEN,Jt],[y.SOFT_LIGHT,en],[y.SRC,tn],[y.SUBTRACT,nn],[y.VIVID_LIGHT,sn]]),an=class extends pe{constructor(e,t=1){super(),this._blendFunction=e,this.opacity=new M(t)}getOpacity(){return this.opacity.value}setOpacity(e){this.opacity.value=e}get blendFunction(){return this._blendFunction}set blendFunction(e){this._blendFunction=e,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(e){this.blendFunction=e}getShaderCode(){return rn.get(this.blendFunction)}},he=class extends pe{constructor(e,t,{attributes:n=L.NONE,blendFunction:s=y.NORMAL,defines:i=new Map,uniforms:r=new Map,extensions:a=null,vertexShader:u=null}={}){super(),this.name=e,this.renderer=null,this.attributes=n,this.fragmentShader=t,this.vertexShader=u,this.defines=i,this.uniforms=r,this.extensions=a,this.blendMode=new an(s),this.blendMode.addEventListener("change",l=>this.setChanged()),this._inputColorSpace=_e,this._outputColorSpace=Ae}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(e){this._inputColorSpace=e,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e,this.setChanged()}set mainScene(e){}set mainCamera(e){}getName(){return this.name}setRenderer(e){this.renderer=e}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(e){this.attributes=e,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(e){this.fragmentShader=e,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(e){this.vertexShader=e,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(e,t=Q){}update(e,t,n){}setSize(e,t){}initialize(e,t,n){}dispose(){for(const e of Object.keys(this)){const t=this[e];(t instanceof V||t instanceof De||t instanceof Ne||t instanceof U)&&this[e].dispose()}}},on=`#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`,ln="uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}",cn=class extends he{constructor({offset:e=new D(.001,5e-4),radialModulation:t=!1,modulationOffset:n=.15}={}){super("ChromaticAberrationEffect",on,{vertexShader:ln,attributes:L.CONVOLUTION,uniforms:new Map([["offset",new M(e)],["modulationOffset",new M(n)]])}),this.radialModulation=t}get offset(){return this.uniforms.get("offset").value}set offset(e){this.uniforms.get("offset").value=e}get radialModulation(){return this.defines.has("RADIAL_MODULATION")}set radialModulation(e){e?this.defines.set("RADIAL_MODULATION","1"):this.defines.delete("RADIAL_MODULATION"),this.setChanged()}get modulationOffset(){return this.uniforms.get("modulationOffset").value}set modulationOffset(e){this.uniforms.get("modulationOffset").value=e}getOffset(){return this.offset}setOffset(e){this.offset=e}},Fe=class extends U{constructor(e,t,n=null){super("RenderPass",e,t),this.needsSwap=!1,this.needsDepthBlit=!0,this.clearPass=new Oe,this.overrideMaterialManager=n===null?null:new ye(n),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){const e=this.overrideMaterialManager;return e!==null?e.material:null}set overrideMaterial(e){const t=this.overrideMaterialManager;e!==null?t!==null?t.setMaterial(e):this.overrideMaterialManager=new ye(e):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,n,s,i){const r=this.scene,a=this.camera,u=this.selection,l=a.layers.mask,h=r.background,d=e.shadowMap.autoUpdate,f=this.renderToScreen?null:t;u!==null&&a.layers.set(u.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(r.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(f),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(e,r,a):e.render(r,a),a.layers.mask=l,r.background=h,e.shadowMap.autoUpdate=d}},un=`#include <packing>
#ifdef GL_FRAGMENT_PRECISION_HIGH
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
#ifdef DOWNSAMPLE_NORMALS
uniform lowp sampler2D normalBuffer;
#endif
varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
return unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
return texture2D(depthBuffer,uv).r;
#endif
}int findBestDepth(const in float samples[4]){float c=(samples[0]+samples[1]+samples[2]+samples[3])*0.25;float distances[4];distances[0]=abs(c-samples[0]);distances[1]=abs(c-samples[1]);distances[2]=abs(c-samples[2]);distances[3]=abs(c-samples[3]);float maxDistance=max(max(distances[0],distances[1]),max(distances[2],distances[3]));int remaining[3];int rejected[3];int i,j,k;for(i=0,j=0,k=0;i<4;++i){if(distances[i]<maxDistance){remaining[j++]=i;}else{rejected[k++]=i;}}for(;j<3;++j){remaining[j]=rejected[--k];}vec3 s=vec3(samples[remaining[0]],samples[remaining[1]],samples[remaining[2]]);c=(s.x+s.y+s.z)/3.0;distances[0]=abs(c-s.x);distances[1]=abs(c-s.y);distances[2]=abs(c-s.z);float minDistance=min(distances[0],min(distances[1],distances[2]));for(i=0;i<3;++i){if(distances[i]==minDistance){break;}}return remaining[i];}void main(){float d[4];d[0]=readDepth(vUv0);d[1]=readDepth(vUv1);d[2]=readDepth(vUv2);d[3]=readDepth(vUv3);int index=findBestDepth(d);
#ifdef DOWNSAMPLE_NORMALS
vec3 n[4];n[0]=texture2D(normalBuffer,vUv0).rgb;n[1]=texture2D(normalBuffer,vUv1).rgb;n[2]=texture2D(normalBuffer,vUv2).rgb;n[3]=texture2D(normalBuffer,vUv3).rgb;
#else
vec3 n[4];n[0]=vec3(0.0);n[1]=vec3(0.0);n[2]=vec3(0.0);n[3]=vec3(0.0);
#endif
gl_FragColor=vec4(n[index],d[index]);}`,dn="uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}",fn=class extends Z{constructor(){super({name:"DepthDownsamplingMaterial",defines:{DEPTH_PACKING:"0"},uniforms:{depthBuffer:new M(null),normalBuffer:new M(null),texelSize:new M(new D)},blending:me,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:un,vertexShader:dn})}set depthBuffer(e){this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=Q){this.depthBuffer=e,this.depthPacking=t}set normalBuffer(e){this.uniforms.normalBuffer.value=e,e!==null?this.defines.DOWNSAMPLE_NORMALS="1":delete this.defines.DOWNSAMPLE_NORMALS,this.needsUpdate=!0}setNormalBuffer(e){this.normalBuffer=e}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t)}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},hn=class extends U{constructor({normalBuffer:e=null,resolutionScale:t=.5,width:n=Y.AUTO_SIZE,height:s=Y.AUTO_SIZE,resolutionX:i=n,resolutionY:r=s}={}){super("DepthDownsamplingPass");const a=new fn;a.normalBuffer=e,this.fullscreenMaterial=a,this.needsDepthTexture=!0,this.needsSwap=!1,this.renderTarget=new V(1,1,{minFilter:ae,magFilter:ae,depthBuffer:!1,type:ve}),this.renderTarget.texture.name="DepthDownsamplingPass.Target",this.renderTarget.texture.generateMipmaps=!1;const u=this.resolution=new Y(this,i,r,t);u.addEventListener("change",l=>this.setSize(u.baseWidth,u.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}setDepthTexture(e,t=Q){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t}render(e,t,n,s,i){e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){const n=this.resolution;n.setBaseSize(e,t),this.renderTarget.setSize(n.width,n.height),this.fullscreenMaterial.setSize(e,t)}initialize(e,t,n){const s=e.getContext();if(!(s.getExtension("EXT_color_buffer_float")||s.getExtension("EXT_color_buffer_half_float")))throw new Error("Rendering to float texture is not supported.")}},vn=`#include <common>
#include <packing>
#include <dithering_pars_fragment>
#define packFloatToRGBA(v) packDepthToRGBA(v)
#define unpackRGBAToFloat(v) unpackRGBAToDepth(v)
#ifdef FRAMEBUFFER_PRECISION_HIGH
uniform mediump sampler2D inputBuffer;
#else
uniform lowp sampler2D inputBuffer;
#endif
#if DEPTH_PACKING == 3201
uniform lowp sampler2D depthBuffer;
#elif defined(GL_FRAGMENT_PRECISION_HIGH)
uniform highp sampler2D depthBuffer;
#else
uniform mediump sampler2D depthBuffer;
#endif
uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;vec4 sRGBToLinear(const in vec4 value){return vec4(mix(pow(value.rgb*0.9478672986+vec3(0.0521327014),vec3(2.4)),value.rgb*0.0773993808,vec3(lessThanEqual(value.rgb,vec3(0.04045)))),value.a);}float readDepth(const in vec2 uv){
#if DEPTH_PACKING == 3201
float depth=unpackRGBAToDepth(texture2D(depthBuffer,uv));
#else
float depth=texture2D(depthBuffer,uv).r;
#endif
#if defined(USE_LOGARITHMIC_DEPTH_BUFFER) || defined(LOG_DEPTH)
float d=pow(2.0,depth*log2(cameraFar+1.0))-1.0;float a=cameraFar/(cameraFar-cameraNear);float b=cameraFar*cameraNear/(cameraNear-cameraFar);depth=a+b/d;
#elif defined(USE_REVERSED_DEPTH_BUFFER)
depth=1.0-depth;
#endif
return depth;}float getViewZ(const in float depth){
#ifdef PERSPECTIVE_CAMERA
return perspectiveDepthToViewZ(depth,cameraNear,cameraFar);
#else
return orthographicDepthToViewZ(depth,cameraNear,cameraFar);
#endif
}vec3 RGBToHCV(const in vec3 RGB){vec4 P=mix(vec4(RGB.bg,-1.0,2.0/3.0),vec4(RGB.gb,0.0,-1.0/3.0),step(RGB.b,RGB.g));vec4 Q=mix(vec4(P.xyw,RGB.r),vec4(RGB.r,P.yzx),step(P.x,RGB.r));float C=Q.x-min(Q.w,Q.y);float H=abs((Q.w-Q.y)/(6.0*C+EPSILON)+Q.z);return vec3(H,C,Q.x);}vec3 RGBToHSL(const in vec3 RGB){vec3 HCV=RGBToHCV(RGB);float L=HCV.z-HCV.y*0.5;float S=HCV.y/(1.0-abs(L*2.0-1.0)+EPSILON);return vec3(HCV.x,S,L);}vec3 HueToRGB(const in float H){float R=abs(H*6.0-3.0)-1.0;float G=2.0-abs(H*6.0-2.0);float B=2.0-abs(H*6.0-4.0);return clamp(vec3(R,G,B),0.0,1.0);}vec3 HSLToRGB(const in vec3 HSL){vec3 RGB=HueToRGB(HSL.x);float C=(1.0-abs(2.0*HSL.z-1.0))*HSL.y;return(RGB-0.5)*C+HSL.z;}FRAGMENT_HEAD void main(){FRAGMENT_MAIN_UV vec4 color0=texture2D(inputBuffer,UV);vec4 color1=vec4(0.0);FRAGMENT_MAIN_IMAGE color0.a=clamp(color0.a,0.0,1.0);gl_FragColor=color0;
#ifdef ENCODE_OUTPUT
#include <colorspace_fragment>
#endif
#include <dithering_fragment>
}`,pn="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",mn=class extends Z{constructor(e,t,n,s,i=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:qe.replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new M(null),depthBuffer:new M(null),resolution:new M(new D),texelSize:new M(new D),cameraNear:new M(.3),cameraFar:new M(1e3),aspect:new M(1),time:new M(0)},blending:me,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:i}),e&&this.setShaderParts(e),t&&this.setDefines(t),n&&this.setUniforms(n),this.copyCameraSettings(s)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){this.uniforms.depthBuffer.value=e}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=Q){this.depthBuffer=e,this.depthPacking=t}setShaderData(e){this.setShaderParts(e.shaderParts),this.setDefines(e.defines),this.setUniforms(e.uniforms),this.setExtensions(e.extensions)}setShaderParts(e){return this.fragmentShader=vn.replace(E.FRAGMENT_HEAD,e.get(E.FRAGMENT_HEAD)||"").replace(E.FRAGMENT_MAIN_UV,e.get(E.FRAGMENT_MAIN_UV)||"").replace(E.FRAGMENT_MAIN_IMAGE,e.get(E.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=pn.replace(E.VERTEX_HEAD,e.get(E.VERTEX_HEAD)||"").replace(E.VERTEX_MAIN_SUPPORT,e.get(E.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(e){for(const t of e.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(e){for(const t of e.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(e){this.extensions={};for(const t of e)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(e){this.encodeOutput!==e&&(e?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(e){return this.encodeOutput}setOutputEncodingEnabled(e){this.encodeOutput=e}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}setDeltaTime(e){this.uniforms.time.value+=e}adoptCameraSettings(e){this.copyCameraSettings(e)}copyCameraSettings(e){e&&(this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,e instanceof $e?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(e,t){const n=this.uniforms;n.resolution.value.set(e,t),n.texelSize.value.set(1/e,1/t),n.aspect.value=e/t}static get Section(){return E}};function Ee(e,t,n){for(const s of t){const i="$1"+e+s.charAt(0).toUpperCase()+s.slice(1),r=new RegExp("([^\\.])(\\b"+s+"\\b)","g");for(const a of n.entries())a[1]!==null&&n.set(a[0],a[1].replace(r,i))}}function gn(e,t,n){let s=t.getFragmentShader(),i=t.getVertexShader();const r=s!==void 0&&/mainImage/.test(s),a=s!==void 0&&/mainUv/.test(s);if(n.attributes|=t.getAttributes(),s===void 0)throw new Error(`Missing fragment shader (${t.name})`);if(a&&n.attributes&L.CONVOLUTION)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${t.name})`);if(!r&&!a)throw new Error(`Could not find mainImage or mainUv function (${t.name})`);{const u=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,l=n.shaderParts;let h=l.get(E.FRAGMENT_HEAD)||"",d=l.get(E.FRAGMENT_MAIN_UV)||"",f=l.get(E.FRAGMENT_MAIN_IMAGE)||"",v=l.get(E.VERTEX_HEAD)||"",p=l.get(E.VERTEX_MAIN_SUPPORT)||"";const x=new Set,S=new Set;if(a&&(d+=`	${e}MainUv(UV);
`,n.uvTransformation=!0),i!==null&&/mainSupport/.test(i)){const g=/mainSupport *\([\w\s]*?uv\s*?\)/.test(i);p+=`	${e}MainSupport(`,p+=g?`vUv);
`:`);
`;for(const m of i.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(const C of m[1].split(/\s*,\s*/))n.varyings.add(C),x.add(C),S.add(C);for(const m of i.matchAll(u))S.add(m[1])}for(const g of s.matchAll(u))S.add(g[1]);for(const g of t.defines.keys())S.add(g.replace(/\([\w\s,]*\)/g,""));for(const g of t.uniforms.keys())S.add(g);S.delete("while"),S.delete("for"),S.delete("if"),t.uniforms.forEach((g,m)=>n.uniforms.set(e+m.charAt(0).toUpperCase()+m.slice(1),g)),t.defines.forEach((g,m)=>n.defines.set(e+m.charAt(0).toUpperCase()+m.slice(1),g));const b=new Map([["fragment",s],["vertex",i]]);Ee(e,S,n.defines),Ee(e,S,b),s=b.get("fragment"),i=b.get("vertex");const T=t.blendMode;if(n.blendModes.set(T.blendFunction,T),r){t.inputColorSpace!==null&&t.inputColorSpace!==n.colorSpace&&(f+=t.inputColorSpace===G?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),t.outputColorSpace!==Ae?n.colorSpace=t.outputColorSpace:t.inputColorSpace!==null&&(n.colorSpace=t.inputColorSpace);const g=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;f+=`${e}MainImage(color0, UV, `,n.attributes&L.DEPTH&&g.test(s)&&(f+="depth, ",n.readDepth=!0),f+=`color1);
	`;const m=e+"BlendOpacity";n.uniforms.set(m,T.opacity),f+=`color0 = blend${T.blendFunction}(color0, color1, ${m});

	`,h+=`uniform float ${m};

`}if(h+=s+`
`,i!==null&&(v+=i+`
`),l.set(E.FRAGMENT_HEAD,h),l.set(E.FRAGMENT_MAIN_UV,d),l.set(E.FRAGMENT_MAIN_IMAGE,f),l.set(E.VERTEX_HEAD,v),l.set(E.VERTEX_MAIN_SUPPORT,p),t.extensions!==null)for(const g of t.extensions)n.extensions.add(g)}}var bn=class extends U{constructor(e,...t){super("EffectPass"),this.fullscreenMaterial=new mn(null,null,null,e),this.listener=n=>this.handleEvent(n),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(e){for(const t of this.effects)t.mainScene=e}set mainCamera(e){this.fullscreenMaterial.copyCameraSettings(e);for(const t of this.effects)t.mainCamera=e}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(e){this.fullscreenMaterial.encodeOutput=e}get dithering(){return this.fullscreenMaterial.dithering}set dithering(e){const t=this.fullscreenMaterial;t.dithering=e,t.needsUpdate=!0}setEffects(e){for(const t of this.effects)t.removeEventListener("change",this.listener);this.effects=e.sort((t,n)=>n.attributes-t.attributes);for(const t of this.effects)t.addEventListener("change",this.listener)}updateMaterial(){const e=new Rt;let t=0;for(const a of this.effects)if(a.blendMode.blendFunction===y.DST)e.attributes|=a.getAttributes()&L.DEPTH;else{if(e.attributes&a.getAttributes()&L.CONVOLUTION)throw new Error(`Convolution effects cannot be merged (${a.name})`);gn("e"+t++,a,e)}let n=e.shaderParts.get(E.FRAGMENT_HEAD),s=e.shaderParts.get(E.FRAGMENT_MAIN_IMAGE),i=e.shaderParts.get(E.FRAGMENT_MAIN_UV);const r=/\bblend\b/g;for(const a of e.blendModes.values())n+=a.getShaderCode().replace(r,`blend${a.blendFunction}`)+`
`;e.attributes&L.DEPTH?(e.readDepth&&(s=`float depth = readDepth(UV);

	`+s),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,e.colorSpace===G&&(s+=`color0 = sRGBToLinear(color0);
	`),e.uvTransformation?(i=`vec2 transformedUv = vUv;
`+i,e.defines.set("UV","transformedUv")):e.defines.set("UV","vUv"),e.shaderParts.set(E.FRAGMENT_HEAD,n),e.shaderParts.set(E.FRAGMENT_MAIN_IMAGE,s),e.shaderParts.set(E.FRAGMENT_MAIN_UV,i);for(const[a,u]of e.shaderParts)u!==null&&e.shaderParts.set(a,u.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(e)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(e,t=Q){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t;for(const n of this.effects)n.setDepthTexture(e,t)}render(e,t,n,s,i){for(const r of this.effects)r.update(e,t,s);if(!this.skipRendering||this.renderToScreen){const r=this.fullscreenMaterial;r.inputBuffer=t.texture,r.time+=s*this.timeScale,e.setRenderTarget(this.renderToScreen?null:n),e.render(this.scene,this.camera)}}setSize(e,t){this.fullscreenMaterial.setSize(e,t);for(const n of this.effects)n.setSize(e,t)}initialize(e,t,n){this.renderer=e;for(const s of this.effects)s.initialize(e,t,n);this.updateMaterial(),n!==void 0&&n!==ie&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(const e of this.effects)e.removeEventListener("change",this.listener),e.dispose()}handleEvent(e){switch(e.type){case"change":this.recompile();break}}},xn=class extends U{constructor(e,t,{renderTarget:n,resolutionScale:s=1,width:i=Y.AUTO_SIZE,height:r=Y.AUTO_SIZE,resolutionX:a=i,resolutionY:u=r}={}){super("NormalPass"),this.needsSwap=!1,this.renderPass=new Fe(e,t,new ze);const l=this.renderPass;l.ignoreBackground=!0,l.skipShadowMapUpdate=!0;const h=l.getClearPass();h.overrideClearColor=new F(7829503),h.overrideClearAlpha=1,this.renderTarget=n,this.renderTarget===void 0&&(this.renderTarget=new V(1,1,{minFilter:ae,magFilter:ae}),this.renderTarget.texture.name="NormalPass.Target");const d=this.resolution=new Y(this,a,u,s);d.addEventListener("change",f=>this.setSize(d.baseWidth,d.baseHeight))}set mainScene(e){this.renderPass.mainScene=e}set mainCamera(e){this.renderPass.mainCamera=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}render(e,t,n,s,i){const r=this.renderToScreen?null:this.renderTarget;this.renderPass.render(e,r,r)}setSize(e,t){const n=this.resolution;n.setBaseSize(e,t),this.renderTarget.setSize(n.width,n.height)}};const Sn=c.createContext(null),Te=e=>(e.getAttributes()&L.CONVOLUTION)===L.CONVOLUTION,yn=de.memo(c.forwardRef(({children:e,camera:t,scene:n,resolutionScale:s,enabled:i=!0,renderPriority:r=1,autoClear:a=!0,depthBuffer:u,enableNormalPass:l,stencilBuffer:h,multisampling:d=8,frameBufferType:f=Ce},v)=>{const{gl:p,scene:x,camera:S,size:b}=H(),T=n||x,g=t||S,[m,C,N]=c.useMemo(()=>{const k=dt(),R=new wt(p,{depthBuffer:u,stencilBuffer:h,multisampling:d>0&&k?d:0,frameBufferType:f});R.addPass(new Fe(T,g));let P=null,_=null;return l&&(_=new xn(T,g),_.enabled=!1,R.addPass(_),s!==void 0&&k&&(P=new hn({normalBuffer:_.texture,resolutionScale:s}),P.enabled=!1,R.addPass(P))),[R,_,P]},[g,p,u,h,d,f,T,l,s]);c.useEffect(()=>m==null?void 0:m.setSize(b.width,b.height),[m,b]),I((k,R)=>{if(i){const P=p.autoClear;p.autoClear=a,h&&!a&&p.clearStencil(),m.render(R),p.autoClear=P}},i?r:0);const z=c.useRef(null);c.useLayoutEffect(()=>{var k;const R=[],P=(k=z.current)==null?void 0:k.__r3f;if(P&&m){const _=P.objects;for(let B=0;B<_.length;B++){const j=_[B];if(j instanceof he){const J=[j];if(!Te(j)){let ee=null;for(;(ee=_[B+1])instanceof he&&!Te(ee);)J.push(ee),B++}const le=new bn(g,...J);R.push(le)}else j instanceof U&&R.push(j)}for(const B of R)m==null||m.addPass(B);C&&(C.enabled=!0),N&&(N.enabled=!0)}return()=>{for(const _ of R)m==null||m.removePass(_);C&&(C.enabled=!1),N&&(N.enabled=!1)}},[m,e,g,C,N]),c.useEffect(()=>{const k=p.toneMapping;return p.toneMapping=Ye,()=>{p.toneMapping=k}},[p]);const oe=c.useMemo(()=>({composer:m,normalPass:C,downSamplingPass:N,resolutionScale:s,camera:g,scene:T}),[m,C,N,s,g,T]);return c.useImperativeHandle(v,()=>m,[m]),o.jsx(Sn.Provider,{value:oe,children:o.jsx("group",{ref:z,children:e})})}));let En=0;const we=new WeakMap,Tn=(e,t)=>de.forwardRef(function({blendFunction:s=void 0,opacity:i=void 0,...r},a){let u=we.get(e);if(!u){const d=`@react-three/postprocessing/${e.name}-${En++}`;Ke({[d]:e}),we.set(e,u=d)}const l=H(d=>d.camera),h=de.useMemo(()=>{var d,f;return[...(d=void 0)!=null?d:[],...(f=r.args)!=null?f:[{...t,...r}]]},[JSON.stringify(r)]);return o.jsx(u,{camera:l,"blendMode-blendFunction":s,"blendMode-opacity-value":i,...r,ref:a,args:h})}),wn=Tn(cn);function Rn({phase:e,projectIndex:t,phaseProgress:n}){const s=c.useRef(null),i=c.useRef(-1),r=c.useRef(-1),a=c.useRef(!1);c.useEffect(()=>{if(!q._running)return;const u=s.current!==e||i.current!==t;if(s.current=e,i.current=t,e==="approach"){const l=Math.round(n*10)/10;l!==r.current&&(r.current=l,q.swell(l))}else u&&(r.current=-1,e==="descent"&&q.whoosh({level:.07,duration:1.6}),e==="inside"&&q.setWorld(t),e==="escape"&&q.resetWorld());e==="escape"&&n>.6&&!a.current&&t>=3&&(a.current=!0,q.chord([74,78,81,83,86],{spread:.28,level:.018}))},[e,t,n]),c.useEffect(()=>()=>q.resetWorld(),[])}const A=[{index:0,id:"lighthouse",title:"LIGHTHOUSE",role:"Co-founder, Product & Engineering",year:"2023 — Present",tags:["Real-time IoT","AI Copilot","SaaS"],pullQuote:"A factory floor that talks back.",verb:"BUILT.",challenge:"Manufacturing facilities running blind — no real-time visibility into what machines are doing.",metric:"5M+",metricDesc:"events processed daily",reflection:"The hardest part wasn't the technology. It was earning trust from people who'd never used software on a factory floor.",liveUrl:"https://www.wavefuel.in",readMoreUrl:"https://www.wavefuel.in",orbRadius:1.2,orbShader:"electric",orbColor1:new F(330266),orbColor2:new F(26367),orbPosition:new w(-6,2,-20),interiorType:"neuralGrid",interiorBg:"#000D1A",frequency:174,panels:{brief:"Enterprise SaaS platform for real-time monitoring and automation across manufacturing — IoT, cloud, AI.",process:"Co-built with enterprise customers from day one. Weekly on-site sessions. Every decision validated against operational reality, not assumptions.",solution:"Lighthouse — real-time event processing at 5M+ events/day, AI copilot for conversational machine control, monitoring dashboards, OEE tracking.",impact:"5+ enterprise deployments. $20K+ ACV. 13% increase in OEE. 50–60% improvement in feature utilization.",learning:"B2B SaaS in manufacturing taught me that the interface with the most impact is often the one that gets out of the way."}},{index:1,id:"bight",title:"BIGHT",role:"Co-founder, Product & Operations",year:"2020 — 2021",tags:["EdTech","LMS","B2B SaaS"],pullQuote:"Education infrastructure for the next generation.",verb:"LAUNCHED.",challenge:"Universities managing coursework through email threads and spreadsheets.",metric:"12+",metricDesc:"engineers and designers led",reflection:'My first real lesson in the distance between "users want this" and "users will change their behavior for this."',liveUrl:"#",readMoreUrl:"#",orbRadius:.9,orbShader:"ocean",orbColor1:new F(5424),orbColor2:new F(39321),orbPosition:new w(7,-1,-22),interiorType:"digitalGarden",interiorBg:"#030D12",frequency:285,panels:{brief:"B2B SaaS LMS for universities — centralized coursework, assessment, and academic progress management.",process:"Led cross-functional team of 12+. Defined agile processes, sprint cadences, and QA standards from scratch.",solution:"Full LMS with automated grading, progress tracking, faculty tools, and university admin dashboards.",impact:"Pilot programs with universities. Automated grading reduced workflow time. Measurable improvement in university operational efficiency.",learning:"Co-founding taught me that vision is cheap. Execution is everything. The team that ships wins."}},{index:2,id:"searce-cloud",title:"CLOUD AT SCALE",role:"Project Manager, Searce",year:"2022 — 2023",tags:["AWS","GCP","Kubernetes"],pullQuote:"12 cloud projects. Zero late deliveries.",verb:"DELIVERED.",challenge:"Complex cloud migrations with misaligned client expectations and distributed teams.",metric:"100%",metricDesc:"on-time delivery rate",reflection:"Delivery is a trust game. When people believe you'll ship, they give you harder problems.",liveUrl:"#",readMoreUrl:"#",orbRadius:.75,orbShader:"lava",orbColor1:new F(1704704),orbColor2:new F(16729088),orbPosition:new w(-4,-3,-18),interiorType:"liquidMetal",interiorBg:"#010800",frequency:396,panels:{brief:"Managed 12 cloud projects in 12 months including 4 simultaneous large-scale migrations on AWS, GCP, and Kubernetes.",process:"Translated technical complexity into clear client language. Weekly alignment. Risk tracking from day one.",solution:"End-to-end project delivery framework — scope definition, execution plans, stakeholder management, escalation paths.",impact:"100% on-time delivery. Lowest escalation rate in the company. Leadership recognition.",learning:"The best project managers make complex work feel calm. Calm is a skill."}},{index:3,id:"ibm-att",title:"ENTERPRISE PROGRAMS",role:"Project Manager, IBM",year:"2020 — 2021",tags:["Agile","SAFe","Enterprise IT"],pullQuote:"Enterprise scale. Human problems.",verb:"COORDINATED.",challenge:"Multi-location AT&T programs with hundreds of stakeholders and zero tolerance for delay.",metric:"Multi-location",metricDesc:"enterprise programs delivered",reflection:"IBM is where I learned that process is not bureaucracy — it's the language that lets large teams move as one.",liveUrl:"#",readMoreUrl:"#",orbRadius:.65,orbShader:"circuit",orbColor1:new F(72193),orbColor2:new F(65416),orbPosition:new w(8,4,-25),interiorType:"archiveWithin",interiorBg:"#010510",frequency:417,panels:{brief:"Directed multiple enterprise IT programs for AT&T coordinating engineering and business teams across locations.",process:"Agile, SAFe, and Waterfall. Adapted framework to project needs. Sprint planning, backlog prioritization, milestone tracking.",solution:"Standardized reporting and stakeholder dashboards in JIRA and IBM tools. Improved executive visibility.",impact:"Complex multi-location initiatives delivered on time and within budget. Improved efficiency and reduced delays.",learning:"Large organizations move slowly by design. Your job is to find the path of least resistance without cutting corners."}}];function Ue(e,t){const n=e.orbPosition,s=t||n.clone().add(new w(0,0,60));return new Qe([s,n.clone().add(new w(3,1.5,15)),n.clone().add(new w(4,.5,5)),n.clone().add(new w(-5,.8,2)),n.clone().add(new w(-3,-1.2,-2)),n.clone().add(new w(1,.4,.5)),n.clone().add(new w(0,0,-1.5))],!1,"catmullrom",.5)}const O={APPROACH_END:.2,ORBIT_END:.4,DESCENT_END:.6,INSIDE_END:.85};function Cn(e,t){const n=1/t,s=e/n,i=Math.min(Math.floor(s),t-1),r=(e-i*n)/n;let a="escape",u=O.INSIDE_END,l=1;r<O.APPROACH_END?(a="approach",u=0,l=O.APPROACH_END):r<O.ORBIT_END?(a="orbit",u=O.APPROACH_END,l=O.ORBIT_END):r<O.DESCENT_END?(a="descent",u=O.ORBIT_END,l=O.DESCENT_END):r<O.INSIDE_END&&(a="inside",u=O.DESCENT_END,l=O.INSIDE_END);const h=l>u?(r-u)/(l-u):0;return{projectIndex:i,zoneProgress:r,phase:a,phaseProgress:Math.max(0,Math.min(1,h))}}const Mn=`varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vWorldPosition;

uniform float uTime;
uniform float uSpeed;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vPosition = position;
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,ke=`// ── ORB SURFACE: ELECTRIC STORM ──
// Deep navy / electric blue with animated noise + lightning flashes

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep navy
uniform vec3 uColor2;  // electric blue

// Hash & noise
vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    if (i >= octaves) break;
    val += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return val;
}

// Lightning bolt: returns brightness along a jagged vertical line
float lightning(vec2 uv, float seed, float t) {
  float x = uv.x - (0.3 + seed * 0.4);
  float jitter = fbm(vec2(uv.y * 4.0 + seed * 10.0, t * 2.0), 3) * 0.15;
  float d = abs(x + jitter);
  float bolt = 1.0 - smoothstep(0.0, 0.025, d);
  // Flash envelope: sharp on, quick fade
  float flash = sin(t * 6.28 + seed * 7.3) * 0.5 + 0.5;
  flash = pow(flash, 8.0);
  return bolt * flash;
}

void main() {
  float t = uTime * uSpeed * 0.4;
  vec2 uv = vUv;

  // Cloud noise base
  float cloud = fbm(uv * 3.0 + vec2(t * 0.1, -t * 0.07), 5);
  cloud = cloud * 0.5 + 0.5;

  // Storm cell — brighter in the middle
  vec2 center = uv - 0.5;
  float stormCore = 1.0 - length(center) * 1.4;
  stormCore = clamp(stormCore, 0.0, 1.0);

  // Base planet color
  vec3 col = mix(uColor1, uColor2, cloud * stormCore + 0.1);

  // Add a swirling dark layer
  float swirl = fbm(uv * 2.0 + vec2(-t * 0.05, t * 0.08), 4);
  col = mix(col, uColor1 * 0.3, swirl * (1.0 - stormCore) * 0.6);

  // Lightning flashes — 3 bolts with different seeds
  float bolts = 0.0;
  bolts += lightning(uv, 0.1, t);
  bolts += lightning(uv, 0.55, t + 1.3);
  bolts += lightning(uv, 0.82, t + 2.7);
  bolts = clamp(bolts, 0.0, 1.0);
  col += vec3(0.6, 0.85, 1.0) * bolts * 2.0;

  // Edge atmosphere glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  col += uColor2 * rim * 0.8;

  // Slight emissive
  col += uColor2 * stormCore * 0.15;

  gl_FragColor = vec4(col, 1.0);
}
`,_n=`// ── ORB SURFACE: OCEAN ──
// Deep teal / dark blue with wave displacement + foam crests

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep ocean blue
uniform vec3 uColor2;  // teal / cyan

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float wave(vec2 uv, float freq, float speed, float amp) {
  return amp * sin(uv.x * freq + uTime * speed * uSpeed)
           * cos(uv.y * freq * 0.7 + uTime * speed * 0.6 * uSpeed);
}

void main() {
  float t = uTime * uSpeed;
  vec2 uv = vUv;

  // Wave displacement — stacked sine waves at multiple scales
  float h = 0.0;
  h += wave(uv, 6.0,  0.8,  0.12);
  h += wave(uv, 13.0, 1.3,  0.06);
  h += wave(uv, 28.0, 2.1,  0.03);
  h += wave(uv, 52.0, 3.5,  0.015);
  h = h * 0.5 + 0.5; // normalize to [0,1]

  // Deep vs shallow coloring
  vec3 deep  = uColor1 * 0.4;
  vec3 mid   = uColor1;
  vec3 crest = uColor2;
  vec3 foam  = vec3(0.85, 0.95, 1.0);

  vec3 col = mix(deep, mid, h);
  col = mix(col, crest, smoothstep(0.65, 0.75, h));
  // Foam on peaks
  float foamMask = smoothstep(0.78, 0.90, h);
  float foamNoise = noise(uv * 20.0 + vec2(t * 0.5, 0.0)) * 0.5 + 0.5;
  col = mix(col, foam, foamMask * foamNoise * 1.3);

  // Subsurface scattering — brighten edges lit by center
  float sss = max(0.0, dot(vNormal, normalize(vec3(0.3, 0.5, 0.8))));
  col += uColor2 * sss * 0.2;

  // Rim glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 4.0);
  col += uColor2 * rim * 0.5;

  gl_FragColor = vec4(col, 1.0);
}
`,An=`// ── ORB SURFACE: MOLTEN LAVA ──
// Slow churning lava-lamp noise with hot cores

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // deep red / dark
uniform vec3 uColor2;  // bright orange / yellow

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i + vec2(0,0)), f - vec2(0,0)),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = rot * p * 2.0 + shift;
    a *= 0.5;
  }
  return v;
}

void main() {
  float t = uTime * uSpeed * 0.15; // slow, viscous movement
  vec2 uv = vUv;

  // Domain-warped lava noise
  vec2 q = vec2(fbm(uv + vec2(0.0, 0.0) + t),
                fbm(uv + vec2(5.2, 1.3) + t * 0.9));

  vec2 r = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.4));

  float f = fbm(uv + 4.0 * r + t);
  f = f * 0.5 + 0.5;

  // Color based on "temperature"
  vec3 coldRock = uColor1 * 0.15;          // near black
  vec3 coolLava = uColor1;                 // dark red
  vec3 hotLava  = uColor2;                 // bright orange
  vec3 hotCore  = vec3(1.0, 0.95, 0.6);   // yellow-white hot center

  vec3 col = coldRock;
  col = mix(col, coolLava, smoothstep(0.2, 0.45, f));
  col = mix(col, hotLava,  smoothstep(0.45, 0.70, f));
  col = mix(col, hotCore,  smoothstep(0.72, 0.88, f));

  // Emissive glow on hot spots
  col += hotCore * smoothstep(0.80, 1.0, f) * 0.8;

  // Rim atmosphere — molten red
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 2.5);
  col += vec3(1.0, 0.3, 0.0) * rim * 0.7;

  gl_FragColor = vec4(col, 1.0);
}
`,Dn=`// ── ORB SURFACE: ICE CRYSTAL LATTICE ──
// Faceted, refracting, with hexagonal lattice and sparkle

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // pale ice blue
uniform vec3 uColor2;  // deep crystal cyan

// Hexagonal tiling
vec2 hexCoord(vec2 uv, float scale) {
  uv *= scale;
  vec2 s = vec2(1.0, 1.732);
  vec2 a = mod(uv, s) - s * 0.5;
  vec2 b = mod(uv + s * 0.5, s) - s * 0.5;
  return dot(a, a) < dot(b, b) ? a : b;
}

float hexDist(vec2 h) {
  h = abs(h);
  return max(dot(h, normalize(vec2(1.0, 1.732))), h.x);
}

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = dot(hash2(i), vec2(1.0));
  float b = dot(hash2(i + vec2(1,0)), vec2(1.0));
  float c = dot(hash2(i + vec2(0,1)), vec2(1.0));
  float d = dot(hash2(i + vec2(1,1)), vec2(1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

void main() {
  float t = uTime * uSpeed * 0.1;
  vec2 uv = vUv;

  // Slowly shifting hex lattice — subtle drift
  vec2 drift = vec2(t * 0.03, t * 0.02);
  vec2 h6  = hexCoord(uv + drift, 6.0);
  vec2 h12 = hexCoord(uv * 1.8 - drift * 0.5, 10.0);

  float d6  = hexDist(h6);
  float d12 = hexDist(h12);

  // Cell edges — the "crystal facets"
  float edge6  = 1.0 - smoothstep(0.38, 0.48, d6);
  float edge12 = 1.0 - smoothstep(0.35, 0.44, d12);

  // Per-cell shimmer — different facet brightness
  float cellId = dot(hash2(floor(uv * 6.0 + drift)), vec2(1.0));
  float facet  = smoothstep(-0.3, 1.0, cellId);

  // Base crystal color
  vec3 base = mix(uColor1, uColor2, facet * 0.6 + d12 * 0.4);

  // Edge highlight — white frost
  vec3 frostWhite = vec3(0.9, 0.97, 1.0);
  base = mix(base, frostWhite * 1.2, edge6 * 0.8);
  base = mix(base, frostWhite, edge12 * 0.5);

  // Sparkle points — random high-frequency twinkle
  float sparkNoise = noise(uv * 40.0 + t * 2.0);
  float sparkle = pow(max(0.0, sparkNoise), 14.0);
  base += frostWhite * sparkle * 3.0;

  // Interior glow — slightly warmer center
  vec2 center = uv - 0.5;
  float glow = 1.0 - length(center) * 1.8;
  glow = clamp(glow, 0.0, 1.0);
  base += uColor2 * glow * 0.25;

  // Refraction shimmer — time-based hue shift at edges
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  // Rainbow rim — iridescent crystal edges
  float hueShift = sin(rim * 6.0 + t * 2.0) * 0.5 + 0.5;
  vec3 rainbowRim = mix(vec3(0.4, 0.8, 1.0), vec3(0.9, 0.6, 1.0), hueShift);
  base += rainbowRim * rim * 0.6;

  gl_FragColor = vec4(base, 1.0);
}
`,Nn=`// ── ORB SURFACE: LIVING CIRCUIT BOARD ──
// Animated PCB trace lines with traveling signal pulses

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;  // dark green / PCB background
uniform vec3 uColor2;  // bright green / gold trace

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

// Grid-aligned trace network
float trace(vec2 uv, float gridSize) {
  vec2 cell = floor(uv * gridSize);
  vec2 local = fract(uv * gridSize);

  // Decide if this cell has a horizontal or vertical trace based on hash
  vec2 h = hash2(cell);

  float traceH = 0.0;
  float traceV = 0.0;

  // Horizontal traces in alternating cells
  if (h.x > 0.35) {
    traceH = 1.0 - smoothstep(0.0, 0.06, abs(local.y - 0.5));
  }
  // Vertical traces in other cells
  if (h.y > 0.35) {
    traceV = 1.0 - smoothstep(0.0, 0.06, abs(local.x - 0.5));
  }

  return max(traceH, traceV);
}

// Signal pulse traveling along a trace
float pulse(vec2 uv, float gridSize, float t) {
  vec2 cell = floor(uv * gridSize);
  vec2 local = fract(uv * gridSize);
  vec2 h = hash2(cell);

  // Pulse travels from 0 to 1 along the trace, seeded per cell
  float speed = 0.8 + h.x * 1.5;
  float phase = h.y * 6.28;
  float pos = fract(t * speed * uSpeed + phase);

  float pulseH = 0.0;
  float pulseV = 0.0;

  if (h.x > 0.35) {
    // Horizontal pulse
    float onTrace = 1.0 - smoothstep(0.0, 0.08, abs(local.y - 0.5));
    float hit = 1.0 - smoothstep(0.0, 0.18, abs(local.x - pos));
    pulseH = onTrace * hit;
  }
  if (h.y > 0.35) {
    // Vertical pulse
    float onTrace = 1.0 - smoothstep(0.0, 0.08, abs(local.x - 0.5));
    float hit = 1.0 - smoothstep(0.0, 0.18, abs(local.y - pos));
    pulseV = onTrace * hit;
  }

  return max(pulseH, pulseV);
}

// Node/via intersection dot
float node(vec2 uv, float gridSize) {
  vec2 local = fract(uv * gridSize);
  vec2 h = hash2(floor(uv * gridSize));
  if (h.x * h.y > 0.5) {
    return 1.0 - smoothstep(0.08, 0.14, length(local - 0.5));
  }
  return 0.0;
}

void main() {
  float t = uTime * 0.5;
  vec2 uv = vUv;

  // Multi-scale circuit grid
  float coarse = trace(uv, 5.0);
  float medium = trace(uv, 12.0);
  float fine   = trace(uv, 24.0);

  float traces = max(coarse * 1.0, max(medium * 0.7, fine * 0.4));

  // Pulses on each scale
  float pulseC = pulse(uv, 5.0,  t);
  float pulseM = pulse(uv, 12.0, t + 1.3);
  float pulseF = pulse(uv, 24.0, t + 2.7);
  float pulses = max(pulseC, max(pulseM * 0.8, pulseF * 0.6));

  // Circuit nodes
  float nodes = max(node(uv, 5.0), node(uv, 12.0));

  // PCB substrate texture — subtle noise
  vec2 h2 = hash2(floor(uv * 80.0));
  float substrate = h2.x * 0.04;

  // Color assembly
  vec3 background = uColor1 * (0.15 + substrate);
  vec3 traceColor = mix(uColor2, vec3(0.4, 0.9, 0.3), 0.5);
  vec3 pulseColor = vec3(1.0, 1.0, 0.5); // gold pulse
  vec3 nodeColor  = vec3(0.8, 0.7, 0.2); // gold nodes

  vec3 col = background;
  col = mix(col, traceColor, traces * 0.7);
  col = mix(col, pulseColor, pulses);
  col += nodeColor * nodes * 0.8;

  // Emissive glow on active traces
  col += traceColor * traces * 0.1;
  col += pulseColor * pulses * 0.8;

  // Rim glow
  float rim = 1.0 - clamp(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0);
  rim = pow(rim, 3.0);
  col += uColor2 * rim * 0.4;

  gl_FragColor = vec4(col, 1.0);
}
`,Pn={electric:ke,ocean:_n,lava:An,ice:Dn,circuit:Nn};function Bn({orbRadius:e,phase:t,isMobile:n}){const s=n?2:4,i=c.useRef();c.useRef([]);const r=c.useMemo(()=>Array.from({length:s},(f,v)=>({radius:.04+Math.random()*.04,orbitR:e*1.6+v*.3,speed:.4+Math.random()*.6,axisX:Math.random()*.6-.3,axisY:Math.random()*.3,phaseOff:v/s*Math.PI*2})),[e,s]),a=c.useMemo(()=>new Pe(.06,8,8),[]),u=c.useMemo(()=>new et({color:13421789,roughness:.8,metalness:.2}),[]),l=c.useMemo(()=>r.map(f=>{const v=[];for(let p=0;p<=60;p++){const x=p/60*Math.PI*2+f.phaseOff,S=Math.cos(x)*f.orbitR,b=Math.sin(x)*f.orbitR,T=Math.sin(x*f.axisX+f.phaseOff)*f.orbitR*.2;v.push(new w(S,T,b))}return new ge().setFromPoints(v)}),[r]),h=c.useMemo(()=>r.map(()=>new Ie({color:8952251,transparent:!0,opacity:0})),[r]),d=c.useMemo(()=>new tt,[]);return I(f=>{const v=f.clock.elapsedTime;if(!i.current)return;const p=t==="orbit",x=t==="approach";r.forEach((S,b)=>{const T=v*S.speed+S.phaseOff,g=Math.cos(T)*S.orbitR,m=Math.sin(T)*S.orbitR,C=Math.sin(T*S.axisX+S.phaseOff)*S.orbitR*.2;if(d.position.set(g,C,m),d.scale.setScalar(S.radius/.06),d.updateMatrix(),i.current.setMatrixAt(b,d.matrix),h[b]){const N=x||p?.35:0;h[b].opacity+=(N-h[b].opacity)*.03}}),i.current.instanceMatrix.needsUpdate=!0}),o.jsxs("group",{children:[o.jsx("instancedMesh",{ref:i,args:[a,u,s]}),l.map((f,v)=>o.jsx("line",{geometry:f,material:h[v]},v))]})}function In({project:e,phase:t,phaseProgress:n,mouseNDC:s,activePhase:i,isActive:r,isMobile:a}){const u=c.useRef(),l=c.useRef();c.useRef();const h=c.useRef(1),d=Pn[e.orbShader]||ke,f=c.useMemo(()=>({uTime:{value:0},uSpeed:{value:.4},uColor1:{value:e.orbColor1.clone()},uColor2:{value:e.orbColor2.clone()}}),[e]),v=c.useMemo(()=>new Z({vertexShader:Mn,fragmentShader:d,uniforms:f}),[d,f]),p=a?32:64,x=c.useMemo(()=>new Pe(e.orbRadius,p,p),[e.orbRadius,p]);I(T=>{const g=T.clock.elapsedTime;f.uTime.value=g;const m=t==="approach"?.4+n*.8:t==="orbit"?1.2:.4;if(f.uSpeed.value+=(m-f.uSpeed.value)*.02,!u.current)return;const C=!r&&(i==="descent"||i==="inside")?0:1;if(h.current+=(C-h.current)*.04,u.current.scale.setScalar(h.current),l.current&&t==="orbit"){const N=s.x*.4,z=-s.y*.25;l.current.rotation.y+=(N-l.current.rotation.y)*.05,l.current.rotation.x+=(z-l.current.rotation.x)*.05}l.current&&(l.current.rotation.y+=.001)});const S=c.useMemo(()=>new Ze(e.orbRadius*1.02,e.orbRadius*1.18,64),[e.orbRadius]),b=c.useMemo(()=>new Je({color:e.orbColor2,transparent:!0,opacity:.08,side:X,blending:Be,depthWrite:!1}),[e.orbColor2]);return o.jsxs("group",{ref:u,position:e.orbPosition,children:[o.jsx("mesh",{ref:l,geometry:x,material:v}),o.jsx("mesh",{geometry:S,material:b,rotation:[Math.PI/2,0,0]}),r&&o.jsx(Bn,{orbRadius:e.orbRadius,phase:t,isMobile:a}),t==="approach"&&n>.6||t==="orbit"?o.jsx(ut,{position:[0,e.orbRadius+.4,0],fontSize:.18,color:"#C9A84C",anchorX:"center",anchorY:"bottom",fillOpacity:t==="orbit"?1:n*2-1.2,children:e.title}):null]})}const Le=`// ── INTERIOR BIOME: NEURAL GRID ──
// Deep blue hexagonal grid with neural pulse propagation

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

// Hexagonal distance and cell
vec4 hexInfo(vec2 uv) {
  vec2 s = vec2(1.0, 1.732050808);
  vec4 b = floor(vec4(uv, uv - vec2(0.5, 1.0)) / s.xyxy) + 0.5;
  vec4 p = vec4(uv - b.xy * s, uv - (b.zw + 0.5) * s);
  vec4 c = dot(p.xy, p.xy) < dot(p.zw, p.zw) ? vec4(p.xy, b.xy) : vec4(p.zw, b.zw);
  return vec4(c.xy, c.zw);
}

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float ar = uResolution.x / uResolution.y;
  vec2 scaledUv = vec2(uv.x * ar, uv.y) * 8.0;

  // Hex grid
  vec4 hex = hexInfo(scaledUv);
  vec2 localPos  = hex.xy;
  vec2 cellIndex = hex.zw;

  float distToCenter = length(localPos);
  float hexEdge = 1.0 - smoothstep(0.35, 0.48, distToCenter);

  // Per-cell unique seed
  float cellSeed = fract(sin(dot(cellIndex, vec2(12.9898, 78.233))) * 43758.5453);

  // Pulse wave from center — ripple outward
  float distFromOrigin = length(cellIndex / 8.0 - vec2(0.5 * ar / 8.0, 0.5));
  float pulsePhase = t * 1.5 - distFromOrigin * 12.0 + cellSeed * 6.28;
  float pulse = sin(pulsePhase) * 0.5 + 0.5;
  pulse = pow(pulse, 4.0);

  // Synaptic firing — random snap activations
  float firePhase = fract(t * (0.3 + cellSeed * 0.7) + cellSeed);
  float fire = firePhase > 0.92 ? pow((firePhase - 0.92) / 0.08, 2.0) : 0.0;
  fire = clamp(fire * (1.0 - (firePhase > 0.96 ? (firePhase - 0.96) / 0.04 : 0.0)), 0.0, 1.0);

  // Branch connections — thin lines between hex centers
  float branch = 0.0;
  float lineW = 0.025;
  // Check for near-horizontal connection
  branch = max(branch, 1.0 - smoothstep(lineW, lineW * 1.5, abs(localPos.y)) * step(abs(localPos.x), 0.5));

  // Colors
  vec3 bgColor     = vec3(0.01, 0.03, 0.10);
  vec3 gridColor   = vec3(0.05, 0.18, 0.55);
  vec3 pulseColor  = vec3(0.10, 0.50, 1.00);
  vec3 fireColor   = vec3(0.70, 0.90, 1.00);
  vec3 branchColor = vec3(0.04, 0.12, 0.40);

  vec3 col = bgColor;

  // Hex cell fill — dim gradient
  col += gridColor * (0.2 + 0.1 * sin(distToCenter * 8.0 + t));

  // Edge lines
  col = mix(col, gridColor * 1.5, (1.0 - hexEdge) * 0.7);

  // Pulse wave
  col += pulseColor * pulse * hexEdge * 0.6;

  // Synaptic flash
  col += fireColor * fire * 2.0;

  // Branch lines
  col += branchColor * branch * 0.5;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.5;
  vignette = clamp(vignette, 0.0, 1.0);
  col *= vignette;

  // Scanline
  float scanline = sin(uv.y * uResolution.y * 0.5) * 0.03;
  col -= scanline;

  gl_FragColor = vec4(col, 1.0);
}
`,On=`// ── INTERIOR BIOME: LIQUID METAL ──
// Churning metallic fluid — silver/gunmetal with gold veins

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(dot(hash2(i), f),
                 dot(hash2(i + vec2(1,0)), f - vec2(1,0)), u.x),
             mix(dot(hash2(i + vec2(0,1)), f - vec2(0,1)),
                 dot(hash2(i + vec2(1,1)), f - vec2(1,1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    v += a * noise(p);
    p = rot * p * 2.1;
    a *= 0.5;
  }
  return v;
}

// Specular reflections of an imaginary light source
float specular(vec2 uv, vec2 lightPos, float roughness) {
  vec2 toLight = normalize(lightPos - uv);
  float d = length(lightPos - uv);
  float spec = pow(max(0.0, 1.0 - d * roughness), 8.0);
  return spec;
}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.12; // slow, viscous

  // Domain-warped fluid surface
  vec2 q = vec2(fbm(uv * 3.0 + t),
                fbm(uv * 3.0 + vec2(3.7, 1.9) + t * 0.8));

  vec2 r = vec2(fbm(uv * 2.5 + 1.5 * q + vec2(1.7, 9.2) + t * 0.5),
                fbm(uv * 2.5 + 1.5 * q + vec2(8.3, 2.8) + t * 0.3));

  float f = fbm(uv * 2.0 + 2.0 * r + t);
  f = f * 0.5 + 0.5;

  // Metallic color palette
  vec3 gunmetal = vec3(0.10, 0.11, 0.13);
  vec3 silver   = vec3(0.70, 0.72, 0.75);
  vec3 chrome   = vec3(0.85, 0.87, 0.90);
  vec3 gold     = vec3(0.85, 0.72, 0.25);
  vec3 deepMetal= vec3(0.04, 0.05, 0.06);

  vec3 col = mix(deepMetal, gunmetal, smoothstep(0.0, 0.4, f));
  col = mix(col, silver,   smoothstep(0.4, 0.65, f));
  col = mix(col, chrome,   smoothstep(0.65, 0.85, f));

  // Gold veins — narrow threshold bands of gold
  float vein1 = 1.0 - smoothstep(0.0, 0.015, abs(f - 0.38));
  float vein2 = 1.0 - smoothstep(0.0, 0.020, abs(f - 0.52));
  float vein3 = 1.0 - smoothstep(0.0, 0.012, abs(f - 0.66));
  float veins = max(vein1, max(vein2, vein3));

  col = mix(col, gold, veins * 1.5);
  col += gold * veins * 0.5; // emissive bleeding

  // Moving specular highlights from shifting virtual lights
  vec2 light1 = vec2(0.3 + sin(t * 0.7) * 0.3, 0.6 + cos(t * 0.5) * 0.2);
  vec2 light2 = vec2(0.7 + cos(t * 0.4) * 0.2, 0.3 + sin(t * 0.6) * 0.3);
  float spec1 = specular(uv, light1, 3.0);
  float spec2 = specular(uv, light2, 4.0);
  col += chrome * (spec1 * 0.6 + spec2 * 0.4);

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.2;
  col *= clamp(vignette, 0.2, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`,Fn=`// ── INTERIOR BIOME: DIGITAL GARDEN ──
// Bioluminescent seeds that grow branching trees — deep green + gold glow

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453123);
}

float hash1(float n) {
  return fract(sin(n) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash2(i).x;
  float b = hash2(i + vec2(1,0)).x;
  float c = hash2(i + vec2(0,1)).x;
  float d = hash2(i + vec2(1,1)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Segment distance — for drawing branch lines
float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a;
  vec2 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

// A single tree branch contribution at a given scale
float branch(vec2 uv, vec2 root, float angle, float length, float gen, float t, float seed) {
  if (gen > 3.0) return 0.0;

  vec2 tip = root + vec2(sin(angle), cos(angle)) * length;

  // Grow animation — tip starts at root, moves outward
  float growTime = clamp(t - seed * 2.0 - gen * 0.8, 0.0, 1.0);
  vec2 animTip = mix(root, tip, growTime);

  float d = sdSegment(uv, root, animTip);
  float lineWidth = 0.005 * (1.0 + 0.5 / (gen + 1.0));
  float line = 1.0 - smoothstep(0.0, lineWidth, d);

  // Glow
  float glow = 1.0 - smoothstep(0.0, lineWidth * 4.0, d);

  return line * 0.8 + glow * 0.3;
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2(uv.x * ar, uv.y);
  float t = uTime * 0.5;

  // Background — deep forest void
  vec3 bgDark  = vec3(0.01, 0.04, 0.02);
  vec3 bgMid   = vec3(0.02, 0.07, 0.03);
  float bgNoise = noise(suv * 3.0 + t * 0.05) * 0.5 + 0.5;
  vec3 col = mix(bgDark, bgMid, bgNoise);

  // Ground mist
  float mist = smoothstep(0.85, 1.0, uv.y);
  col = mix(col, vec3(0.03, 0.12, 0.06), mist * 0.5);

  // Tree colors
  vec3 branchColor = vec3(0.05, 0.35, 0.12);
  vec3 glowColor   = vec3(0.40, 0.90, 0.30); // bioluminescent green
  vec3 tipGlow     = vec3(1.00, 0.85, 0.20); // gold at growth tips

  // Draw N trees from grid roots
  float treeMask = 0.0;
  float treeglow = 0.0;

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 seed2 = hash2(vec2(fi, 0.0));

    // Root positions scattered across lower half
    vec2 root = vec2(seed2.x * ar, 0.75 + seed2.y * 0.2);
    float treeSeed = hash1(fi * 13.7);

    // Main trunk angle (mostly upward)
    float angle = -1.5708 + (seed2.x - 0.5) * 0.8; // ~90° ± variance

    float len1 = 0.08 + seed2.y * 0.06;
    float b1 = branch(suv, root, angle, len1, 0.0, t, treeSeed);
    treeMask += b1;

    // Level 1 branches
    vec2 trunk_tip = root + vec2(sin(angle), cos(angle)) * len1;
    float bAngle1L = angle - 0.4 - seed2.x * 0.3;
    float bAngle1R = angle + 0.4 + seed2.y * 0.3;
    float len2 = len1 * 0.65;

    float b2L = branch(suv, trunk_tip, bAngle1L, len2, 1.0, t, treeSeed + 0.3);
    float b2R = branch(suv, trunk_tip, bAngle1R, len2, 1.0, t, treeSeed + 0.6);
    treeMask += b2L + b2R;

    // Level 2
    vec2 tipL = trunk_tip + vec2(sin(bAngle1L), cos(bAngle1L)) * len2;
    vec2 tipR = trunk_tip + vec2(sin(bAngle1R), cos(bAngle1R)) * len2;
    float len3 = len2 * 0.6;

    treeMask += branch(suv, tipL, bAngle1L - 0.35, len3, 2.0, t, treeSeed + 0.1);
    treeMask += branch(suv, tipL, bAngle1L + 0.25, len3, 2.0, t, treeSeed + 0.2);
    treeMask += branch(suv, tipR, bAngle1R - 0.25, len3, 2.0, t, treeSeed + 0.4);
    treeMask += branch(suv, tipR, bAngle1R + 0.35, len3, 2.0, t, treeSeed + 0.5);

    // Bioluminescent spots at tips
    float spotR = 0.006;
    float totalGrowth = clamp(t - treeSeed * 2.0 - 2.4, 0.0, 1.0);
    treeglow += totalGrowth * (1.0 - smoothstep(0.0, spotR, length(suv - tipL)));
    treeglow += totalGrowth * (1.0 - smoothstep(0.0, spotR, length(suv - tipR)));
  }

  treeMask = clamp(treeMask, 0.0, 1.0);
  treeglow = clamp(treeglow, 0.0, 1.0);

  col = mix(col, branchColor, treeMask * 0.6);
  col += glowColor * treeMask * 0.8;
  col += tipGlow * treeglow * 3.0;

  // Floating dust particles
  float dust = 0.0;
  for (int j = 0; j < 20; j++) {
    float fj = float(j);
    vec2 dSeed = hash2(vec2(fj * 7.3, 1.0));
    vec2 dPos = fract(dSeed + vec2(0.0, t * (0.01 + dSeed.x * 0.03)));
    dPos.x *= ar;
    float dDist = length(suv - dPos);
    dust += (1.0 - smoothstep(0.0, 0.004, dDist)) * dSeed.y;
  }
  col += tipGlow * dust * 1.5;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.4;
  col *= clamp(vignette, 0.0, 1.0);

  gl_FragColor = vec4(col, 1.0);
}
`,Un=`// ── INTERIOR BIOME: FREQUENCY ROOM ──
// 3D oscilloscope waveforms exploded in space — teal + ultraviolet

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = uTime;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2((uv.x - 0.5) * ar, uv.y - 0.5);

  // Background
  vec3 bgDeep = vec3(0.01, 0.03, 0.08);
  vec3 col = bgDeep;

  // Draw waveform layers — each at a different Y offset and frequency
  vec3 teal    = vec3(0.00, 0.85, 0.80);
  vec3 uv_color= vec3(0.55, 0.00, 1.00); // ultraviolet
  vec3 cyan    = vec3(0.20, 1.00, 0.90);
  vec3 white   = vec3(0.90, 0.95, 1.00);

  float waveSum = 0.0;
  float glowSum = 0.0;

  // 7 oscilloscope lines at different frequencies + phases
  for (int i = 0; i < 7; i++) {
    float fi = float(i);

    float yOffset   = -0.35 + fi * 0.12;
    float freq1     = 3.0 + fi * 1.7;
    float freq2     = 7.0 + fi * 2.3;
    float speed1    = 0.8 + fi * 0.3;
    float speed2    = 1.3 + fi * 0.2;
    float amplitude = 0.04 + fi * 0.005;

    // Compound waveform: two sine waves beating together
    float wave = sin(suv.x * freq1 + t * speed1) * amplitude
               + sin(suv.x * freq2 - t * speed2 + fi * 1.1) * amplitude * 0.5;

    float dy = suv.y - yOffset - wave;

    float lineW = 0.004;
    float glowW = 0.025;
    float line = 1.0 - smoothstep(0.0, lineW, abs(dy));
    float glow = 1.0 - smoothstep(0.0, glowW, abs(dy));

    // Alternate color between teal and ultraviolet
    vec3 waveColor = mix(teal, uv_color, fi / 7.0);
    vec3 glowColor = mix(cyan, uv_color * 0.5, fi / 7.0);

    col += waveColor * line * 1.5;
    col += glowColor * glow * 0.15;

    waveSum += line;
    glowSum += glow;
  }

  // Lissajous figure overlay — infinity loop shape in center
  float lx = sin(t * 2.0) * 0.25;
  float ly = sin(t * 1.0 + 1.5708) * 0.12;
  vec2 lissPos = vec2(lx, ly);
  float lissD = length(suv - lissPos);
  float lissCursor = 1.0 - smoothstep(0.0, 0.008, lissD);
  float lissGlow   = 1.0 - smoothstep(0.0, 0.04, lissD);
  col += white * lissCursor * 2.0;
  col += cyan  * lissGlow   * 0.4;

  // Frequency grid — thin horizontal reference lines
  float gridY = mod(uv.y * 10.0, 1.0);
  float gridLine = 1.0 - smoothstep(0.0, 0.01, abs(gridY - 0.5));
  col += vec3(0.02, 0.05, 0.10) * gridLine;

  // Vertical scan line (moving)
  float scanX = fract(t * 0.3) * ar - ar * 0.5;
  float scanD = abs(suv.x - scanX);
  float scanLine = (1.0 - smoothstep(0.0, 0.003, scanD)) * 0.3;
  col += teal * scanLine;
  col += teal * (1.0 - smoothstep(0.0, 0.05, scanD)) * 0.05;

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.3;
  col *= clamp(vignette, 0.0, 1.0);

  // CRT scanline texture
  float scanRow = sin(uv.y * uResolution.y * 1.5 + t * 0.5) * 0.015;
  col -= scanRow;

  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
}
`,kn=`// ── INTERIOR BIOME: THE ARCHIVE WITHIN ──
// Floating code glyphs in slow rotation — amber + dark red-black

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

float hash1(float n) { return fract(sin(n) * 43758.5453123); }
vec2 hash2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)),
                        dot(p, vec2(269.5, 183.3)))) * 43758.5453123);
}

// Draw a single glyph as a series of line segments approximating letters
float glyph(vec2 uv, int glyphId) {
  float g = 0.0;
  float w = 0.012;

  if (glyphId == 0) {
    // "{" bracket
    g += 1.0 - smoothstep(0.0, w, length(uv - vec2(0.0, 0.3)));
    g += 1.0 - smoothstep(0.0, w * 0.5, abs(uv.x + 0.2) + max(0.0, abs(uv.y) - 0.25));
  } else if (glyphId == 1) {
    // "/" slash
    float d = abs((uv.x + uv.y * 0.5) / 1.118);
    g += 1.0 - smoothstep(0.0, w, d) * step(-0.3, uv.y) * step(uv.y, 0.3);
    g = 1.0 - smoothstep(0.0, w, d);
  } else if (glyphId == 2) {
    // "0" zero
    float ring = abs(length(uv * vec2(1.0, 1.6)) - 0.28);
    g = 1.0 - smoothstep(0.0, w, ring);
  } else if (glyphId == 3) {
    // "|" pipe
    g = 1.0 - smoothstep(0.0, w, abs(uv.x));
  } else if (glyphId == 4) {
    // ">" chevron
    float d1 = abs(uv.x - abs(uv.y) * 0.8);
    g = 1.0 - smoothstep(0.0, w, d1);
  } else {
    // "-" dash
    float d = max(abs(uv.y), abs(uv.x) - 0.3);
    g = 1.0 - smoothstep(0.0, w, d);
  }
  return clamp(g, 0.0, 1.0);
}

float glyphAt(vec2 uv, vec2 center, float size, int id, float alpha) {
  vec2 local = (uv - center) / size;
  if (abs(local.x) > 0.5 || abs(local.y) > 0.5) return 0.0;
  return glyph(local, id) * alpha;
}

void main() {
  vec2 uv = vUv;
  float ar = uResolution.x / uResolution.y;
  vec2 suv = vec2(uv.x * ar, uv.y);
  float t = uTime;

  // Background — very dark red-brown
  vec3 bgColor  = vec3(0.04, 0.01, 0.01);
  vec3 midColor = vec3(0.08, 0.03, 0.02);

  float bgN = fract(sin(dot(floor(uv * 50.0), vec2(12.9, 78.2))) * 4375.8);
  vec3 col = mix(bgColor, midColor, bgN * 0.3);

  // Amber glow from center — like an old lamp in a library
  float lampDist = length(uv - vec2(0.5));
  vec3 ambientGlow = vec3(0.9, 0.5, 0.1) * (0.04 / (lampDist * lampDist + 0.1));
  col += ambientGlow * 0.5;

  // Drifting glyph particles — 40 floating code characters
  vec3 glyphColor = vec3(0.9, 0.55, 0.1);   // amber
  vec3 glyphDim   = vec3(0.35, 0.15, 0.02); // dim orange

  for (int i = 0; i < 40; i++) {
    float fi = float(i);
    vec2 seed = hash2(vec2(fi, 0.0));

    // Non-uniform floating speed and drift direction
    float speed  = 0.005 + seed.x * 0.012;
    float drift  = (seed.y - 0.5) * 0.002;
    float yPhase = t * speed + seed.x * 7.3;

    // Wrap position
    float px = mod(seed.x * ar + drift * t, ar);
    float py = 1.0 - mod(yPhase, 1.0); // fall upward

    // Slow orbital rotation per glyph in local space
    float rotAngle = t * (0.1 + seed.x * 0.2) + seed.y * 6.28;
    vec2 offset = vec2(cos(rotAngle), sin(rotAngle)) * 0.003 * fi;
    vec2 glyphPos = vec2(px, py) + offset;

    // Fade in / out with distance from center
    float distCenter = length(vec2(px / ar, py) - 0.5);
    float alpha = (1.0 - smoothstep(0.2, 0.5, distCenter)) * (0.4 + seed.y * 0.6);

    // Choose glyph type
    int glyphId = int(mod(fi * 3.7, 6.0));

    float size = 0.02 + seed.x * 0.025;
    float g = glyphAt(suv, glyphPos, size, glyphId, alpha);

    vec3 gc = mix(glyphDim, glyphColor, alpha);
    col += gc * g;
    // Glow halo
    float haloDist = length(suv - glyphPos);
    col += glyphColor * (1.0 - smoothstep(0.0, 0.05, haloDist)) * alpha * 0.15;
  }

  // Horizontal depth lines — like shelves in a library
  for (int k = 0; k < 5; k++) {
    float fy = 0.2 + float(k) * 0.16;
    float lineY = abs(uv.y - fy);
    float shelf = (1.0 - smoothstep(0.0, 0.003, lineY)) * 0.2;
    col += vec3(0.3, 0.12, 0.02) * shelf;
  }

  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 1.6;
  col *= clamp(vignette, 0.0, 1.0);

  // Film grain
  float grain = hash1(uv.x * 1097.3 + uv.y * 863.2 + t * 97.1) * 0.05;
  col += grain;

  gl_FragColor = vec4(col, 1.0);
}
`,Ln={neuralGrid:Le,liquidMetal:On,digitalGarden:Fn,frequencyRoom:Un,archiveWithin:kn},Gn=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function Hn({interiorType:e,visible:t}){const{viewport:n}=H(),s=c.useRef(),i=c.useMemo(()=>({uTime:{value:0},uResolution:{value:new D(window.innerWidth,window.innerHeight)}}),[]),r=Ln[e]||Le;return I(a=>{s.current&&(i.uTime.value=a.clock.elapsedTime)}),t?o.jsxs("mesh",{position:[0,0,-3],renderOrder:-1,children:[o.jsx("planeGeometry",{args:[n.width*2.5,n.height*2.5,1,1]}),o.jsx("shaderMaterial",{ref:s,vertexShader:Gn,fragmentShader:r,uniforms:i,depthWrite:!1,depthTest:!1})]}):null}function zn({position:e,rotation:t,hovered:n}){const s=c.useMemo(()=>new st(new rt(1.82,1.12)),[]),i=c.useMemo(()=>new Ie({color:"#C9A84C",transparent:!0,opacity:.3}),[]);return I(()=>{i&&(i.opacity=n?.8:.3)}),o.jsx("lineSegments",{position:e,rotation:t,geometry:s,material:i})}function Wn({position:e,rotation:t,color:n,label:s,visible:i}){const r=c.useRef(),[a,u]=c.useState(!1),l=c.useRef(),h=c.useMemo(()=>new w(e[0],e[1],e[2]+1.2),[e]),d=c.useMemo(()=>new w(...e),[e]),f=c.useMemo(()=>new w(1.4,1.4,1.4),[]),v=c.useMemo(()=>new w(1,1,1),[]);I(b=>{if(!r.current||!i)return;const T=b.clock.elapsedTime;a?(r.current.position.lerp(h,.08),r.current.rotation.y+=(0-r.current.rotation.y)*.1,r.current.scale.lerp(f,.08)):(r.current.position.lerp(d,.06),r.current.scale.lerp(v,.06)),l.current&&(l.current.uniforms.uTime.value=T)});const p=c.useMemo(()=>({uTime:{value:0},uColor:{value:new F(n)}}),[n]),x=`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,S=`
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    void main() {
      // Scanline
      float scanline = sin(vUv.y * 120.0 - uTime * 0.3) * 0.03 + 0.97;
      // Vignette
      float vignette = 1.0 - length(vUv - 0.5) * 1.2;
      vignette = clamp(vignette, 0.3, 1.0);
      // Base color (simulated screenshot)
      vec3 col = uColor * scanline * vignette;
      // Subtle grid
      float gx = step(0.98, fract(vUv.x * 20.0));
      float gy = step(0.98, fract(vUv.y * 14.0));
      col = mix(col, col * 0.7, max(gx, gy) * 0.5);
      gl_FragColor = vec4(col, 0.92);
    }
  `;return i?o.jsxs("group",{children:[o.jsxs("mesh",{ref:r,position:e,rotation:t,onPointerOver:()=>u(!0),onPointerOut:()=>u(!1),children:[o.jsx("planeGeometry",{args:[1.8,1.1,1,1]}),o.jsx("shaderMaterial",{ref:l,vertexShader:x,fragmentShader:S,uniforms:p,transparent:!0,roughness:.1,metalness:.3})]}),o.jsx(zn,{position:e,rotation:t,hovered:a})]}):null}function Re({position:e,label:t,visible:n,onClick:s}){const i=c.useRef(),r=c.useRef(),[a,u]=c.useState(!1),l=c.useRef(0),h=c.useMemo(()=>new nt(.18,0),[]);return I(d=>{if(!i.current||!n)return;const f=d.clock.elapsedTime;i.current.rotation.y+=.012,i.current.rotation.x=Math.sin(f*.5)*.15;const v=a?1:0;if(l.current+=(v-l.current)*.08,i.current.material&&(i.current.material.emissiveIntensity=l.current*1.5),r.current){const p=a?1+Math.sin(f*4)*.06:0;r.current.scale.setScalar(p+(a?1:0)),r.current.material.opacity=a?.6:0}}),n?o.jsxs("group",{position:e,children:[o.jsx("mesh",{ref:i,geometry:h,onPointerOver:()=>u(!0),onPointerOut:()=>u(!1),onClick:s,children:o.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:0,metalness:.9,roughness:.1})}),o.jsxs("mesh",{ref:r,rotation:[Math.PI/2,0,0],children:[o.jsx("ringGeometry",{args:[.22,.28,32]}),o.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:0,side:X,depthWrite:!1})]})]}):null}function Vn({project:e,phase:t,phaseProgress:n,onReadMore:s}){const i=c.useRef(),r=t==="inside"||t==="escape",a=c.useMemo(()=>[{position:[-2,.5,-1.5],rotation:[0,.15,.05],color:se(e.orbColor2)},{position:[1.8,.2,-2.5],rotation:[0,-.2,-.03],color:se(e.orbColor1)},{position:[-1.2,-.8,-3.5],rotation:[.05,.1,0],color:se(e.orbColor2)},{position:[.5,1.1,-2],rotation:[-.05,-.15,.06],color:se(e.orbColor1)}],[e]),u=r&&n>.92;return I(()=>{i.current&&(i.current.visible=r)}),o.jsxs("group",{ref:i,visible:r,children:[o.jsx(Hn,{interiorType:e.interiorType,visible:r}),a.map((l,h)=>o.jsx(Wn,{position:l.position,rotation:l.rotation,color:l.color,label:`${e.title} — IMG ${h+1}`,visible:r&&n>.05},h)),o.jsx(Re,{position:[-.6,-1.2,-1.8],label:"VIEW LIVE",visible:u,onClick:()=>window.open(e.liveUrl,"_blank")}),o.jsx(Re,{position:[.6,-1.2,-1.8],label:"READ MORE",visible:u,onClick:s}),o.jsx("pointLight",{position:[0,1,-1],intensity:1.5,color:e.orbColor2,distance:8}),o.jsx("ambientLight",{intensity:.3})]})}function se(e){return`#${e.clone().multiplyScalar(.5).getHexString()}`}const $=["THE BRIEF","THE PROCESS","THE SOLUTION","THE IMPACT","THE LEARNING"],jn=["brief","process","solution","impact","learning"];function qn({project:e,onClose:t}){const n=c.useRef(),s=c.useRef(),[i,r]=c.useState(0),[a,u]=c.useState(!1),l=c.useRef(null);c.useEffect(()=>{n.current&&re.fromTo(n.current,{y:"100%",opacity:0},{y:"0%",opacity:1,duration:.6,ease:"power3.out"})},[]);const h=c.useCallback(()=>{a||(u(!0),re.to(n.current,{y:"100%",opacity:0,duration:.5,ease:"power3.in",onComplete:t}))},[a,t]),d=c.useCallback(()=>{i<$.length-1&&r(g=>g+1)},[i]),f=c.useCallback(()=>{i>0&&r(g=>g-1)},[i]);c.useEffect(()=>{const g=m=>{m.key==="ArrowRight"&&d(),m.key==="ArrowLeft"&&f(),m.key==="Escape"&&h()};return window.addEventListener("keydown",g),()=>window.removeEventListener("keydown",g)},[d,f,h]);const v=g=>{l.current=g.touches[0].clientX},p=g=>{if(l.current===null)return;const m=g.changedTouches[0].clientX-l.current;m<-50&&d(),m>50&&f(),l.current=null};c.useEffect(()=>{s.current&&re.fromTo(s.current,{x:30,opacity:0},{x:0,opacity:1,duration:.4,ease:"power2.out"})},[i]);const x=(e==null?void 0:e.panels)||{},S=jn[i],b=$[i],T=x[S]||"[PLACEHOLDER: Fill case study content]";return o.jsxs("div",{ref:n,className:"project-overlay","data-lenis-prevent":!0,onTouchStart:v,onTouchEnd:p,style:{transform:"translateY(100%)"},children:[o.jsx("div",{className:"project-overlay__glass"}),o.jsx("button",{className:"project-overlay__close",onClick:h,"aria-label":"Close case study",children:o.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[o.jsx("line",{x1:"4",y1:"4",x2:"20",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),o.jsx("line",{x1:"20",y1:"4",x2:"4",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}),o.jsxs("div",{className:"project-overlay__inner",children:[o.jsxs("div",{className:"project-overlay__left",children:[o.jsxs("div",{className:"overlay-project-number",children:["0",((e==null?void 0:e.index)??0)+1]}),o.jsx("h2",{className:"overlay-project-title",children:e==null?void 0:e.title}),o.jsx("p",{className:"overlay-project-role",children:e==null?void 0:e.role}),o.jsx("p",{className:"overlay-project-year",children:e==null?void 0:e.year}),o.jsx("div",{className:"overlay-project-tags",children:((e==null?void 0:e.tags)||[]).map(g=>o.jsx("span",{className:"overlay-tag",children:g},g))}),o.jsx("div",{className:"overlay-dots",children:$.map((g,m)=>o.jsx("button",{className:`overlay-dot ${m===i?"active":""}`,onClick:()=>r(m),"aria-label":`Go to ${$[m]}`},m))})]}),o.jsxs("div",{className:"project-overlay__right",children:[o.jsxs("div",{ref:s,className:"overlay-panel",children:[o.jsxs("div",{className:"overlay-panel__header",children:[o.jsxs("span",{className:"overlay-panel__number",children:["0",i+1," / 0",$.length]}),o.jsx("h3",{className:"overlay-panel__title",children:b})]}),o.jsx("p",{className:"overlay-panel__body",children:T}),S==="impact"&&(e==null?void 0:e.metric)&&o.jsxs("div",{className:"overlay-metric",children:[o.jsx("span",{className:"overlay-metric__number",children:e.metric}),o.jsx("span",{className:"overlay-metric__desc",children:e.metricDesc})]})]}),o.jsxs("div",{className:"overlay-nav",children:[o.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--prev ${i===0?"disabled":""}`,onClick:f,disabled:i===0,"aria-label":"Previous panel",children:"←"}),o.jsx("span",{className:"overlay-nav__label",children:b}),o.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--next ${i===$.length-1?"disabled":""}`,onClick:d,disabled:i===$.length-1,"aria-label":"Next panel",children:"→"})]})]})]})]})}const $n=`// ── STAR FIELD VERTEX SHADER ──
// pos → each vertex is a star point. warpMode stretches them to lines.

attribute float aSize;
attribute float aBrightness;

uniform float uTime;
uniform float uWarpStrength; // 0 = static points, 1 = full warp lines
uniform float uWarpSeed;    // per-star variation

varying float vBrightness;
varying float vWarp;

void main() {
  vBrightness = aBrightness;
  vWarp = uWarpStrength;

  vec3 pos = position;

  // Warp: streak stars backward along Z
  if (uWarpStrength > 0.0) {
    float stretch = uWarpStrength * 3.0;
    pos.z -= stretch * (0.5 + uWarpSeed * 0.5);
  }

  // Twinkle — subtle position jitter
  float twinkle = sin(uTime * (1.5 + aBrightness * 2.0) + uWarpSeed * 6.28) * 0.002;
  pos.x += twinkle;
  pos.y += twinkle * 0.7;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = aSize * (300.0 / -mvPosition.z) * (uWarpStrength > 0.5 ? 0.5 : 1.0);
  gl_Position = projectionMatrix * mvPosition;
}
`,Xn=`// ── STAR FIELD FRAGMENT SHADER ──

varying float vBrightness;
varying float vWarp;

void main() {
  // Round star disc
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // Static star: soft circular glow
  float star = 1.0 - smoothstep(0.0, 0.5, d);
  star = pow(star, 2.5) * vBrightness;

  // Warp: elongated streak (horizontal streak on the gl_PointCoord plane)
  // When warpStrength is high, stars become horizontal streaks
  float warpStar = (1.0 - smoothstep(0.0, 0.5, abs(uv.y))) // narrow vertical
                 * (1.0 - smoothstep(0.0, 0.5, abs(uv.x) * (1.0 - vWarp * 0.9)));
  warpStar *= vBrightness;

  float brightness = mix(star, warpStar, vWarp);

  // Color — slightly warm white for near stars, blue for far
  vec3 color = mix(vec3(0.85, 0.90, 1.00), vec3(1.00, 0.98, 0.92), vBrightness);

  // Warp color shift — cyan tinge during warp
  color = mix(color, vec3(0.60, 0.90, 1.00), vWarp * 0.6);

  gl_FragColor = vec4(color * brightness, brightness);
}
`;function Yn({warpStrength:e,isMobile:t}){const n=t?1e3:3e3,s=c.useRef(),{positions:i,sizes:r,brightnesses:a,seeds:u}=c.useMemo(()=>{const d=new Float32Array(n*3),f=new Float32Array(n),v=new Float32Array(n),p=new Float32Array(n);for(let x=0;x<n;x++)d[x*3]=(Math.random()-.5)*300,d[x*3+1]=(Math.random()-.5)*300,d[x*3+2]=-30-Math.random()*200,f[x]=.5+Math.random()*2.5,v[x]=.3+Math.random()*.7,p[x]=Math.random();return{positions:d,sizes:f,brightnesses:v,seeds:p}},[n]),l=c.useMemo(()=>({uTime:{value:0},uWarpStrength:{value:0},uWarpSeed:{value:0}}),[]),h=c.useMemo(()=>new Z({vertexShader:$n,fragmentShader:Xn,uniforms:l,transparent:!0,blending:Be,depthWrite:!1,vertexColors:!1}),[l]);return I(d=>{l.uTime.value=d.clock.elapsedTime,l.uWarpStrength.value+=(e-l.uWarpStrength.value)*.04}),o.jsx("points",{ref:s,material:h,children:o.jsxs("bufferGeometry",{children:[o.jsx("bufferAttribute",{attach:"attributes-position",count:n,array:i,itemSize:3}),o.jsx("bufferAttribute",{attach:"attributes-aSize",count:n,array:r,itemSize:1}),o.jsx("bufferAttribute",{attach:"attributes-aBrightness",count:n,array:a,itemSize:1}),o.jsx("bufferAttribute",{attach:"attributes-uWarpSeed",count:n,array:u,itemSize:1})]})})}function Kn({visible:e,position:t}){const n=c.useRef();return I(s=>{if(!n.current||!e)return;const i=s.clock.elapsedTime;n.current.rotation.y+=.008,n.current.rotation.x=Math.sin(i*.4)*.06}),e?o.jsxs("mesh",{ref:n,position:t,children:[o.jsx("coneGeometry",{args:[.08,.25,8]}),o.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:.6,metalness:.9,roughness:.1})]}):null}function Qn({path:e,visible:t,opacity:n}){const s=c.useRef(),i=c.useMemo(()=>{const a=[];for(let u=0;u<=50;u++)a.push(e.getPoint(u/50));return a},[e]),r=c.useMemo(()=>new ge().setFromPoints(i),[i]);return I(()=>{s.current&&(s.current.opacity+=((t?n:0)-s.current.opacity)*.03)}),o.jsx("line",{geometry:r,children:o.jsx("lineBasicMaterial",{ref:s,color:"#C9A84C",transparent:!0,opacity:0,linewidth:1})})}const Zn=new w(1,7,22),Jn=new w(1,.5,-21);function es({scrollProgress:e,currentProjectIndex:t,currentPhase:n}){const{camera:s}=H(),i=c.useRef(new w(0,0,-10)),r=c.useRef([]),a=c.useMemo(()=>new w,[]),u=c.useMemo(()=>new w,[]);return c.useEffect(()=>{const l=[];A.forEach((h,d)=>{const f=d>0?A[d-1].orbPosition:null;l.push(Ue(h,f))}),r.current=l},[]),I(()=>{if(r.current.length===0)return;const l=A.length,h=1/l,d=Math.min(Math.floor(e/h),l-1),f=(e-d*h)/h,v=r.current[d];if(v){if(v.getPoint(Math.min(f,.99),a),u.copy(A[d].orbPosition),d===l-1){const p=ot.smoothstep(f,O.INSIDE_END,.92);a.lerp(Zn,p),u.lerp(Jn,p)}s.position.lerp(a,.08),i.current.lerp(u,.05),s.lookAt(i.current)}}),null}function ts({phase:e,phaseProgress:t}){c.useRef({x:0,y:0});const n=c.useMemo(()=>new D(0,0),[]);return I(()=>{let s=0;e==="descent"&&(t<.5?s=t*2*.018:s=(1-t)*2*.018);const i=n.x,r=i+(s-i)*.15;n.set(r,r*.3)}),o.jsx(yn,{children:o.jsx(wn,{blendFunction:y.NORMAL,offset:n})})}function ns({project:e,visible:t,phaseProgress:n}){const s=t&&n>.1;return o.jsxs("div",{className:`orbit-meta ${s?"orbit-meta--visible":""}`,children:[o.jsxs("div",{className:"orbit-meta__number",style:{transitionDelay:"0ms"},children:["0",e.index+1]}),o.jsx("h2",{className:"orbit-meta__title",style:{transitionDelay:"80ms"},children:e.title}),o.jsx("p",{className:"orbit-meta__role",style:{transitionDelay:"160ms"},children:e.role}),o.jsx("p",{className:"orbit-meta__year",style:{transitionDelay:"240ms"},children:e.year}),o.jsx("div",{className:"orbit-meta__tags",style:{transitionDelay:"320ms"},children:e.tags.map(i=>o.jsx("span",{className:"orbit-tag",children:i},i))}),o.jsx("p",{className:"orbit-meta__pull-quote",style:{transitionDelay:"400ms"},children:e.pullQuote})]})}function ss({project:e,phase:t,phaseProgress:n}){const s=t==="inside",i=s&&n>.12,r=s&&n>.38,a=s&&n>.56,u=s&&n>.76,l=c.useMemo(()=>{if(!(e!=null&&e.metric))return"";const f=e.metric.replace(/[^\d.]/g,""),v=e.metric.replace(/[\d.]/g,"");return{digits:parseFloat(f),suffix:v}},[e]),[h,d]=c.useState(0);return c.useEffect(()=>{if(!a||!l.digits){d(0);return}let f=0;const v=performance.now(),p=1500,x=S=>{const b=Math.min((S-v)/p,1),T=1-Math.pow(1-b,3);d(Math.round(T*l.digits)),b<1&&(f=requestAnimationFrame(x))};return f=requestAnimationFrame(x),()=>cancelAnimationFrame(f)},[a,l]),o.jsxs("div",{className:"narrative-blocks",children:[o.jsx("div",{className:`narrative-block narrative-block--a ${i?"visible":""}`,children:e==null?void 0:e.verb}),o.jsx("div",{className:`narrative-block narrative-block--b ${r?"visible":""}`,children:e==null?void 0:e.challenge}),o.jsxs("div",{className:`narrative-block narrative-block--c ${a?"visible":""}`,children:[o.jsxs("span",{className:"narrative-metric",children:[h,l.suffix]}),o.jsx("span",{className:"narrative-metric-desc",children:e==null?void 0:e.metricDesc})]}),o.jsxs("div",{className:`narrative-block narrative-block--d ${u?"visible":""}`,children:['"',e==null?void 0:e.reflection,'"']})]})}function rs({visible:e,onComplete:t}){const n=c.useRef(),s=c.useRef();return c.useEffect(()=>{if(!e||!n.current)return;const r=Array.from(n.current.querySelectorAll(".entry-title__letter"));re.timeline({onComplete:t}).fromTo(r,{opacity:0,scale:.4,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:.06,stagger:{from:"center",amount:.8},ease:"power2.out"}).fromTo(s.current,{opacity:0,y:20},{opacity:1,y:0,duration:.8,ease:"power2.out"},"-=0.3").to([n.current,s.current],{delay:1.2,opacity:0,filter:"blur(8px)",y:-20,scale:1.05,duration:.6,stagger:.1,ease:"power3.in"})},[e,t]),e?o.jsxs("div",{className:"entry-title-container",children:[o.jsx("h1",{ref:n,className:"entry-title",children:"THE CARTOGRAPHY".split("").map((r,a)=>o.jsx("span",{className:"entry-title__letter",children:r===" "?" ":r},a))}),o.jsx("p",{ref:s,className:"entry-subtitle",children:"WORLDS I HAVE BUILT."})]}):null}function is({scrollProgress:e,projectIndex:t,phase:n,totalProjects:s}){const i=e,r=n==="inside"||n==="descent",a=n==="escape"&&t<s-1,u=A[t+1];return o.jsxs(o.Fragment,{children:[o.jsxs("div",{className:`cartography-realm-label ${r?"dimmed":""}`,children:[o.jsx("div",{className:"realm-label__title",children:"THE CARTOGRAPHY"}),o.jsxs("div",{className:"realm-label__world",children:["WORLD ",t+1," / ",s]})]}),o.jsxs("div",{className:"cartography-progress-bar",children:[o.jsx("span",{className:"progress-label progress-label--top",children:"START"}),o.jsx("div",{className:"progress-track",children:o.jsx("div",{className:"progress-dot",style:{top:`${i*100}%`}})}),o.jsx("span",{className:"progress-label progress-label--bottom",children:"END"})]}),o.jsxs("div",{className:`scroll-hint-container ${["orbit","escape"].includes(n)?"visible":""}`,children:[o.jsx("div",{className:`transit-caption ${a?"visible":""}`,children:a&&u&&`PROJECT ${t+1} OF ${s} — ${u.title} AHEAD`}),o.jsxs("div",{className:"scroll-hint",children:[o.jsx("span",{children:n==="orbit"?"SCROLL TO DESCEND":"SCROLL TO CONTINUE"}),o.jsx("div",{className:"scroll-hint__arrow"})]})]})]})}function as({scrollProgress:e,phase:t,phaseProgress:n,projectIndex:s,warpActive:i,finalMap:r,showSpacecraft:a,onReadMore:u,isMobile:l,mouseNDC:h}){var v;const d=s===A.length-1&&t==="escape",f=c.useMemo(()=>A.map((p,x)=>{const S=x>0?A[x-1].orbPosition:null;return Ue(p,S)}),[]);return o.jsxs(o.Fragment,{children:[o.jsx(vt,{makeDefault:!0,position:[0,2,50],fov:55}),o.jsx(es,{scrollProgress:e,currentProjectIndex:s,currentPhase:t}),o.jsx(Yn,{warpStrength:i?1:0,isMobile:l}),o.jsx("fog",{attach:"fog",color:"#02040A",near:40,far:120}),o.jsx("ambientLight",{intensity:.08}),o.jsx("pointLight",{position:[0,30,-20],intensity:.5,color:"#3366ff"}),A.map((p,x)=>o.jsx(In,{project:p,phase:x===s?t:"idle",activePhase:d?"escape":t,phaseProgress:x===s?n:0,mouseNDC:h,isActive:x===s,isMobile:l},p.id)),o.jsx(Vn,{project:A[s],phase:d?"idle":t,phaseProgress:n,onReadMore:u}),r&&f.map((p,x)=>o.jsx(Qn,{path:p,visible:r,opacity:.5},x)),o.jsx(Kn,{visible:r||e<.05,position:r?new w(12,4,-15):(v=A[s])==null?void 0:v.orbPosition.clone().add(new w(6,2,8))}),!l&&o.jsx(ts,{phase:t,phaseProgress:n})]})}function ds(){const e=c.useRef(null),t=it(R=>R.performanceLow),[n,s]=c.useState(0),[i,r]=c.useState("approach"),[a,u]=c.useState(0),[l,h]=c.useState(0),[d,f]=c.useState(0),[v,p]=c.useState(!1),[x,S]=c.useState(!1),[b,T]=c.useState(!1),[g,m]=c.useState(!1),[C,N]=c.useState(null),z=c.useRef({x:0,y:0}).current;Rn({phase:i,projectIndex:l,phaseProgress:a}),c.useEffect(()=>{const R=P=>{z.x=P.clientX/window.innerWidth*2-1,z.y=-(P.clientY/window.innerHeight*2-1)};return window.addEventListener("mousemove",R,{passive:!0}),()=>window.removeEventListener("mousemove",R)},[]),c.useEffect(()=>{if(!e.current)return;const R=at.create({trigger:e.current,start:"top top",end:"bottom bottom",scrub:1.5,onEnter:()=>p(!0),onUpdate:_=>{const B=_.progress;s(B);const{projectIndex:j,phase:J,phaseProgress:le,zoneProgress:ee}=Cn(B,A.length);h(j),r(J),u(le),f(ee),m(J==="escape"),T(B>.97)}}),P=requestAnimationFrame(()=>{var _,B;R.refresh(),(B=(_=R.vars).onUpdate)==null||B.call(_,R)});return()=>{cancelAnimationFrame(P),R.kill()}},[]);const oe=c.useCallback(()=>{N(A[l])},[l]),k=c.useCallback(()=>{N(null)},[]);return o.jsx("div",{ref:e,className:"cartography-scroll-space",children:o.jsxs("div",{className:"cartography-sticky",children:[o.jsx(lt,{gl:{antialias:!t,alpha:!1},maxDpr:t?1:1.5,style:{position:"absolute",inset:0,background:"#02040A"},children:o.jsx(as,{scrollProgress:n,phase:i,phaseProgress:a,projectIndex:l,warpActive:g,finalMap:b,showSpacecraft:!0,onReadMore:oe,isMobile:t,mouseNDC:z})}),v&&!x&&o.jsx(rs,{visible:v,onComplete:()=>S(!0)}),o.jsx(ns,{project:A[l],visible:i==="orbit",phaseProgress:a}),o.jsx(ss,{project:A[l],phase:i,phaseProgress:a}),b&&o.jsx("div",{className:"final-map-text",children:"EVERY WORLD BEGAN AS AN EMPTY CANVAS."}),o.jsx(is,{scrollProgress:n,projectIndex:l,phase:i,totalProjects:A.length}),C&&o.jsx(qn,{project:C,onClose:k})]})})}export{ds as default};
