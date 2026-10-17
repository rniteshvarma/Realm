import{a as z,r as u,W as q,H as Ae,L as Q,g as De,F as pe,b as O,V as P,U as ae,h as H,i as Ve,k as We,l as je,C as U,N as oe,m as Z,n as me,o as Ne,p as Pe,q as xe,O as qe,s as $e,t as se,D as Y,S as J,v as Xe,w as ge,x as _,y as Be,T as Ie,R as Ye,P as Ke,A as Qe,B as be,d as ye,z as de,G as Ze,j as l,J as Je,K as M,c as w,f as et,X as Oe,Y as tt,Z as nt,_ as Fe,$ as st,a0 as Ue,a1 as rt,a2 as it,a3 as at,a4 as ot,a5 as ie,u as lt,a6 as ct,e as ut}from"./index-B9nYBtf5.js";import{V as ft}from"./VoyageCanvas-BoNDJoh5.js";import{_ as dt,T as ht}from"./Text-Dp2CTLCG.js";let ne;function vt(){var e;if(ne!==void 0)return ne;try{let t;const n=document.createElement("canvas");return ne=!!(window.WebGL2RenderingContext&&(t=n.getContext("webgl2"))),t&&((e=t.getExtension("WEBGL_lose_context"))==null||e.loseContext()),ne}catch{return ne=!1}}function pt(e,t,n){const s=z(g=>g.size),i=z(g=>g.viewport),r=typeof e=="number"?e:s.width*i.dpr,a=s.height*i.dpr,c=(typeof e=="number"?n:e)||{},{samples:o=0,depth:p,...f}=c,d=u.useMemo(()=>{const g=new q(r,a,{minFilter:Q,magFilter:Q,type:Ae,...f});return p&&(g.depthTexture=new De(r,a,pe)),g.samples=o,g},[]);return u.useLayoutEffect(()=>{d.setSize(r,a),o&&(d.samples=o)},[o,d,r,a]),u.useEffect(()=>()=>d.dispose(),[]),d}const mt=e=>typeof e=="function",gt=u.forwardRef(({envMap:e,resolution:t=256,frames:n=1/0,makeDefault:s,children:i,...r},a)=>{const c=z(({set:h})=>h),o=z(({camera:h})=>h),p=z(({size:h})=>h),f=u.useRef(null);u.useImperativeHandle(a,()=>f.current,[]);const d=u.useRef(null),g=pt(t);u.useLayoutEffect(()=>{r.manual||(f.current.aspect=p.width/p.height)},[p,r]),u.useLayoutEffect(()=>{f.current.updateProjectionMatrix()});let b=0,y=null;const S=mt(i);return O(h=>{S&&(n===1/0||b<n)&&(d.current.visible=!1,h.gl.setRenderTarget(g),y=h.scene.background,e&&(h.scene.background=e),h.gl.render(h.scene,f.current),h.scene.background=y,h.gl.setRenderTarget(null),d.current.visible=!0,b++)}),u.useLayoutEffect(()=>{if(s){const h=o;return c(()=>({camera:f.current})),()=>c(()=>({camera:h}))}},[f,s,c]),u.createElement(u.Fragment,null,u.createElement("perspectiveCamera",dt({ref:f},r),!S&&i),u.createElement("group",{ref:d},S&&i(g.texture)))});/**
 * postprocessing v6.39.1 build Fri Apr 17 2026
 * https://github.com/pmndrs/postprocessing
 * Copyright 2015-2026 Raoul van Rüschen
 * @license Zlib
 */var bt=(()=>{const e=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),t=new Float32Array([0,0,2,0,0,2]),n=new be;return n.setAttribute("position",new ye(e,3)),n.setAttribute("uv",new ye(t,2)),n})(),k=class he{static get fullscreenGeometry(){return bt}constructor(t="Pass",n=new xe,s=new qe){this.name=t,this.renderer=null,this.scene=n,this.camera=s,this.screen=null,this.rtt=!0,this.needsSwap=!0,this.needsDepthBlit=!1,this.needsDepthTexture=!1,this.enabled=!0}get renderToScreen(){return!this.rtt}set renderToScreen(t){if(this.rtt===t){const n=this.fullscreenMaterial;n!==null&&(n.needsUpdate=!0),this.rtt=!t}}set mainScene(t){}set mainCamera(t){}setRenderer(t){this.renderer=t}isEnabled(){return this.enabled}setEnabled(t){this.enabled=t}get fullscreenMaterial(){return this.screen!==null?this.screen.material:null}set fullscreenMaterial(t){let n=this.screen;n!==null?n.material=t:(n=new $e(he.fullscreenGeometry,t),n.frustumCulled=!1,this.scene===null&&(this.scene=new xe),this.scene.add(n),this.screen=n)}getFullscreenMaterial(){return this.fullscreenMaterial}setFullscreenMaterial(t){this.fullscreenMaterial=t}getDepthTexture(){return null}setDepthTexture(t,n=Z){}render(t,n,s,i,r){throw new Error("Render method not implemented!")}setSize(t,n){}initialize(t,n,s){}dispose(){for(const t of Object.keys(this)){const n=this[t];(n instanceof q||n instanceof Be||n instanceof Ie||n instanceof he)&&this[t].dispose()}this.fullscreenMaterial!==null&&this.fullscreenMaterial.dispose()}},xt=class extends k{constructor(){super("ClearMaskPass",null,null),this.needsSwap=!1}render(e,t,n,s,i){const r=e.state.buffers.stencil;r.setLocked(!1),r.setTest(!1)}},yt=`#ifdef COLOR_WRITE
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
}`,St="varying vec2 vUv;void main(){vUv=position.xy*0.5+0.5;gl_Position=vec4(position.xy,1.0,1.0);}",Tt=class extends J{constructor(){super({name:"CopyMaterial",defines:{COLOR_SPACE_CONVERSION:"1",DEPTH_PACKING:"0",COLOR_WRITE:"1"},uniforms:{inputBuffer:new _(null),depthBuffer:new _(null),channelWeights:new _(null),opacity:new _(1)},blending:ge,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:yt,vertexShader:St}),this.depthFunc=Qe}get inputBuffer(){return this.uniforms.inputBuffer.value}set inputBuffer(e){const t=e!==null;this.colorWrite!==t&&(t?this.defines.COLOR_WRITE=!0:delete this.defines.COLOR_WRITE,this.colorWrite=t,this.needsUpdate=!0),this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){const t=e!==null;this.depthWrite!==t&&(t?this.defines.DEPTH_WRITE=!0:delete this.defines.DEPTH_WRITE,this.depthTest=t,this.depthWrite=t,this.needsUpdate=!0),this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}get colorSpaceConversion(){return this.defines.COLOR_SPACE_CONVERSION!==void 0}set colorSpaceConversion(e){this.colorSpaceConversion!==e&&(e?this.defines.COLOR_SPACE_CONVERSION=!0:delete this.defines.COLOR_SPACE_CONVERSION,this.needsUpdate=!0)}get channelWeights(){return this.uniforms.channelWeights.value}set channelWeights(e){e!==null?(this.defines.USE_WEIGHTS="1",this.uniforms.channelWeights.value=e):delete this.defines.USE_WEIGHTS,this.needsUpdate=!0}setInputBuffer(e){this.uniforms.inputBuffer.value=e}getOpacity(e){return this.uniforms.opacity.value}setOpacity(e){this.uniforms.opacity.value=e}},Et=class extends k{constructor(e,t=!0){super("CopyPass"),this.fullscreenMaterial=new Tt,this.needsSwap=!1,this.renderTarget=e,e===void 0&&(this.renderTarget=new q(1,1,{minFilter:Q,magFilter:Q,stencilBuffer:!1,depthBuffer:!1}),this.renderTarget.texture.name="CopyPass.Target"),this.autoResize=t}get resize(){return this.autoResize}set resize(e){this.autoResize=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}setAutoResizeEnabled(e){this.autoResize=e}render(e,t,n,s,i){this.fullscreenMaterial.inputBuffer=t.texture,e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){this.autoResize&&this.renderTarget.setSize(e,t)}initialize(e,t,n){n!==void 0&&(this.renderTarget.texture.type=n,n!==ae?this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1":e!==null&&e.outputColorSpace===H&&(this.renderTarget.texture.colorSpace=H))}},Se=new U,ke=class extends k{constructor(e=!0,t=!0,n=!1){super("ClearPass",null,null),this.needsSwap=!1,this.color=e,this.depth=t,this.stencil=n,this.overrideClearColor=null,this.overrideClearAlpha=-1}setClearFlags(e,t,n){this.color=e,this.depth=t,this.stencil=n}getOverrideClearColor(){return this.overrideClearColor}setOverrideClearColor(e){this.overrideClearColor=e}getOverrideClearAlpha(){return this.overrideClearAlpha}setOverrideClearAlpha(e){this.overrideClearAlpha=e}render(e,t,n,s,i){const r=this.overrideClearColor,a=this.overrideClearAlpha,c=e.getClearAlpha(),o=r!==null,p=a>=0;o?(e.getClearColor(Se),e.setClearColor(r,p?a:c)):p&&e.setClearAlpha(a),e.setRenderTarget(this.renderToScreen?null:t),e.clear(this.color,this.depth,this.stencil),o?e.setClearColor(Se,c):p&&e.setClearAlpha(c)}},Rt=class extends k{constructor(e,t){super("MaskPass",e,t),this.needsSwap=!1,this.clearPass=new ke(!1,!1,!0),this.inverse=!1}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get inverted(){return this.inverse}set inverted(e){this.inverse=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getClearPass(){return this.clearPass}isInverted(){return this.inverted}setInverted(e){this.inverted=e}render(e,t,n,s,i){const r=e.getContext(),a=e.state.buffers,c=this.scene,o=this.camera,p=this.clearPass,f=this.inverted?0:1,d=1-f;a.color.setMask(!1),a.depth.setMask(!1),a.color.setLocked(!0),a.depth.setLocked(!0),a.stencil.setTest(!0),a.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),a.stencil.setFunc(r.ALWAYS,f,4294967295),a.stencil.setClear(d),a.stencil.setLocked(!0),this.clearPass.enabled&&(this.renderToScreen?p.render(e,null):(p.render(e,t),p.render(e,n))),this.renderToScreen?(e.setRenderTarget(null),e.render(c,o)):(e.setRenderTarget(t),e.render(c,o),e.setRenderTarget(n),e.render(c,o)),a.color.setLocked(!1),a.depth.setLocked(!1),a.stencil.setLocked(!1),a.stencil.setFunc(r.EQUAL,1,4294967295),a.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),a.stencil.setLocked(!0)}},ue=1/1e3,wt=1e3,Ct=class{constructor(){this.startTime=performance.now(),this.previousTime=0,this.currentTime=0,this._delta=0,this._elapsed=0,this._fixedDelta=1e3/60,this.timescale=1,this.useFixedDelta=!1,this._autoReset=!1}get autoReset(){return this._autoReset}set autoReset(e){typeof document<"u"&&document.hidden!==void 0&&(e?document.addEventListener("visibilitychange",this):document.removeEventListener("visibilitychange",this),this._autoReset=e)}get delta(){return this._delta*ue}get fixedDelta(){return this._fixedDelta*ue}set fixedDelta(e){this._fixedDelta=e*wt}get elapsed(){return this._elapsed*ue}update(e){this.useFixedDelta?this._delta=this.fixedDelta:(this.previousTime=this.currentTime,this.currentTime=(e!==void 0?e:performance.now())-this.startTime,this._delta=this.currentTime-this.previousTime),this._delta*=this.timescale,this._elapsed+=this._delta}reset(){this._delta=0,this._elapsed=0,this.currentTime=performance.now()-this.startTime}getDelta(){return this.delta}getElapsed(){return this.elapsed}handleEvent(e){document.hidden||(this.currentTime=performance.now()-this.startTime)}dispose(){this.autoReset=!1}},Mt=class{constructor(t=null,{depthBuffer:n=!0,stencilBuffer:s=!1,multisampling:i=0,frameBufferType:r}={}){this.renderer=null,this.inputBuffer=this.createBuffer(n,s,r,i),this.outputBuffer=this.inputBuffer.clone(),this.copyPass=new Et,this.depthTexture=null,this.depthRenderTarget=null,this.passes=[],this.timer=new Ct,this.autoRenderToScreen=!0,this.setRenderer(t)}get multisampling(){return this.inputBuffer.samples}set multisampling(t){const n=this.inputBuffer,s=this.multisampling;s>0&&t>0?(this.inputBuffer.samples=t,this.outputBuffer.samples=t,this.inputBuffer.dispose(),this.outputBuffer.dispose()):s!==t&&(this.inputBuffer.dispose(),this.outputBuffer.dispose(),this.inputBuffer=this.createBuffer(n.depthBuffer,n.stencilBuffer,n.texture.type,t),this.outputBuffer=this.inputBuffer.clone())}getTimer(){return this.timer}getRenderer(){return this.renderer}setRenderer(t){if(this.renderer=t,t!==null){const n=t.getSize(new P),s=t.getContext().getContextAttributes().alpha,i=this.inputBuffer.texture.type;i===ae&&t.outputColorSpace===H&&(this.inputBuffer.texture.colorSpace=H,this.outputBuffer.texture.colorSpace=H,this.inputBuffer.dispose(),this.outputBuffer.dispose()),t.autoClear=!1,this.setSize(n.width,n.height);for(const r of this.passes)r.initialize(t,s,i)}}replaceRenderer(t,n=!0){const s=this.renderer,i=s.domElement.parentNode;return this.setRenderer(t),n&&i!==null&&(i.removeChild(s.domElement),i.appendChild(t.domElement)),s}createDepthTexture(){const t=this.inputBuffer,n=new De;this.depthTexture=n,t.stencilBuffer?(n.format=Ve,n.type=We):n.type=pe;const s=n.clone();return s.name="EffectComposer.StableDepth",this.depthRenderTarget=new q(t.width,t.height,{depthBuffer:!0,stencilBuffer:t.stencilBuffer,depthTexture:s}),s}blitDepthBuffer(t){const n=this.renderer,s=this.depthRenderTarget,i=n.properties,r=n.getContext();n.setRenderTarget(s);const a=i.get(t).__webglFramebuffer,c=i.get(s).__webglFramebuffer,o=t.stencilBuffer?r.DEPTH_BUFFER_BIT|r.STENCIL_BUFFER_BIT:r.DEPTH_BUFFER_BIT;r.bindFramebuffer(r.READ_FRAMEBUFFER,a),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,c),r.blitFramebuffer(0,0,t.width,t.height,0,0,s.width,s.height,o,r.NEAREST),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),n.setRenderTarget(null)}deleteDepthTexture(){if(this.depthTexture!==null){this.depthTexture.dispose(),this.depthTexture=null,this.depthRenderTarget.dispose(),this.depthRenderTarget=null,this.inputBuffer.depthTexture=null,this.outputBuffer.depthTexture=null;for(const t of this.passes)t.setDepthTexture(null)}}createBuffer(t,n,s,i){const r=this.renderer,a=r===null?new P:r.getDrawingBufferSize(new P),c={minFilter:Q,magFilter:Q,stencilBuffer:n,depthBuffer:t,type:s},o=new q(a.width,a.height,c);return i>0&&(o.samples=i),s===ae&&r!==null&&r.outputColorSpace===H&&(o.texture.colorSpace=H),o.texture.name="EffectComposer.Buffer",o.texture.generateMipmaps=!1,o}setMainScene(t){for(const n of this.passes)n.mainScene=t}setMainCamera(t){for(const n of this.passes)n.mainCamera=t}addPass(t,n){const s=this.passes,i=this.renderer,r=i.getDrawingBufferSize(new P),a=i.getContext().getContextAttributes().alpha,c=this.inputBuffer.texture.type;if(t.renderer=i,t.setSize(r.width,r.height),t.initialize(i,a,c),this.autoRenderToScreen&&(s.length>0&&(s[s.length-1].renderToScreen=!1),t.renderToScreen&&(this.autoRenderToScreen=!1)),n!==void 0?s.splice(n,0,t):s.push(t),this.autoRenderToScreen&&(s[s.length-1].renderToScreen=!0),t.needsDepthTexture||this.depthTexture!==null)if(this.depthTexture===null){const o=this.createDepthTexture();for(t of s)t.setDepthTexture(o)}else{const o=this.depthRenderTarget.depthTexture;t.setDepthTexture(o)}}removePass(t){const n=this.passes,s=n.indexOf(t);if(s!==-1&&n.splice(s,1).length>0){if(this.depthTexture!==null){const a=(o,p)=>o||p.needsDepthTexture;if(!n.reduce(a,!1)){const o=this.depthRenderTarget.depthTexture;t.getDepthTexture()===o&&t.setDepthTexture(null),this.deleteDepthTexture()}}this.autoRenderToScreen&&s===n.length&&(t.renderToScreen=!1,n.length>0&&(n[n.length-1].renderToScreen=!0))}}removeAllPasses(){const t=this.passes;this.deleteDepthTexture(),t.length>0&&(this.autoRenderToScreen&&(t[t.length-1].renderToScreen=!1),this.passes=[])}render(t){const n=this.renderer,s=this.copyPass;let i=this.inputBuffer,r=this.outputBuffer,a,c=!1;t===void 0&&(this.timer.update(),t=this.timer.getDelta());for(const o of this.passes)if(o.enabled){if(i.depthTexture=this.depthTexture,r.depthTexture=null,o.render(n,i,r,t,c),o.needsDepthBlit&&this.depthRenderTarget!==null&&this.blitDepthBuffer(i),o.needsSwap){if(c){s.renderToScreen=o.renderToScreen;const p=n.getContext(),f=n.state.buffers.stencil;f.setFunc(p.NOTEQUAL,1,4294967295),s.render(n,i,r,t,c),f.setFunc(p.EQUAL,1,4294967295)}a=i,i=r,r=a}o instanceof Rt?c=!0:o instanceof xt&&(c=!1)}}setSize(t,n,s){const i=this.renderer,r=i.getSize(new P);(t===void 0||n===void 0)&&(t=r.width,n=r.height),(r.width!==t||r.height!==n)&&i.setSize(t,n,s);const a=i.getDrawingBufferSize(new P);this.inputBuffer.setSize(a.width,a.height),this.outputBuffer.setSize(a.width,a.height),this.depthRenderTarget!==null&&this.depthRenderTarget.setSize(a.width,a.height);for(const c of this.passes)c.setSize(a.width,a.height)}reset(){this.dispose(),this.autoRenderToScreen=!0}dispose(){for(const t of this.passes)t.dispose();this.passes=[],this.inputBuffer!==null&&this.inputBuffer.dispose(),this.outputBuffer!==null&&this.outputBuffer.dispose(),this.deleteDepthTexture(),this.copyPass.dispose(),this.timer.dispose(),k.fullscreenGeometry.dispose()}},G={NONE:0,DEPTH:1,CONVOLUTION:2},E={FRAGMENT_HEAD:"FRAGMENT_HEAD",FRAGMENT_MAIN_UV:"FRAGMENT_MAIN_UV",FRAGMENT_MAIN_IMAGE:"FRAGMENT_MAIN_IMAGE",VERTEX_HEAD:"VERTEX_HEAD",VERTEX_MAIN_SUPPORT:"VERTEX_MAIN_SUPPORT"},_t=class{constructor(){this.shaderParts=new Map([[E.FRAGMENT_HEAD,null],[E.FRAGMENT_MAIN_UV,null],[E.FRAGMENT_MAIN_IMAGE,null],[E.VERTEX_HEAD,null],[E.VERTEX_MAIN_SUPPORT,null]]),this.defines=new Map,this.uniforms=new Map,this.blendModes=new Map,this.extensions=new Set,this.attributes=G.NONE,this.varyings=new Set,this.uvTransformation=!1,this.readDepth=!1,this.colorSpace=Ne}},fe=!1,Te=class{constructor(e=null){this.originalMaterials=new Map,this.material=null,this.materials=null,this.materialsBackSide=null,this.materialsDoubleSide=null,this.materialsFlatShaded=null,this.materialsFlatShadedBackSide=null,this.materialsFlatShadedDoubleSide=null,this.setMaterial(e),this.meshCount=0,this.replaceMaterial=t=>{if(t.isMesh){let n;if(t.material.flatShading)switch(t.material.side){case Y:n=this.materialsFlatShadedDoubleSide;break;case se:n=this.materialsFlatShadedBackSide;break;default:n=this.materialsFlatShaded;break}else switch(t.material.side){case Y:n=this.materialsDoubleSide;break;case se:n=this.materialsBackSide;break;default:n=this.materials;break}this.originalMaterials.set(t,t.material),t.isSkinnedMesh?t.material=n[2]:t.isInstancedMesh?t.material=n[1]:t.material=n[0],++this.meshCount}}}cloneMaterial(e){if(!(e instanceof J))return e.clone();const t=e.uniforms,n=new Map;for(const i in t){const r=t[i].value;r.isRenderTargetTexture&&(t[i].value=null,n.set(i,r))}const s=e.clone();for(const i of n)t[i[0]].value=i[1],s.uniforms[i[0]].value=i[1];return s}setMaterial(e){if(this.disposeMaterials(),this.material=e,e!==null){const t=this.materials=[this.cloneMaterial(e),this.cloneMaterial(e),this.cloneMaterial(e)];for(const n of t)n.uniforms=Object.assign({},e.uniforms),n.side=Xe;t[2].skinning=!0,this.materialsBackSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.side=se,s}),this.materialsDoubleSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.side=Y,s}),this.materialsFlatShaded=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s}),this.materialsFlatShadedBackSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s.side=se,s}),this.materialsFlatShadedDoubleSide=t.map(n=>{const s=this.cloneMaterial(n);return s.uniforms=Object.assign({},e.uniforms),s.flatShading=!0,s.side=Y,s})}}render(e,t,n){const s=e.shadowMap.enabled;if(e.shadowMap.enabled=!1,fe){const i=this.originalMaterials;this.meshCount=0,t.traverse(this.replaceMaterial),e.render(t,n);for(const r of i)r[0].material=r[1];this.meshCount!==i.size&&i.clear()}else{const i=t.overrideMaterial;t.overrideMaterial=this.material,e.render(t,n),t.overrideMaterial=i}e.shadowMap.enabled=s}disposeMaterials(){if(this.material!==null){const e=this.materials.concat(this.materialsBackSide).concat(this.materialsDoubleSide).concat(this.materialsFlatShaded).concat(this.materialsFlatShadedBackSide).concat(this.materialsFlatShadedDoubleSide);for(const t of e)t.dispose()}}dispose(){this.originalMaterials.clear(),this.disposeMaterials()}static get workaroundEnabled(){return fe}static set workaroundEnabled(e){fe=e}},W=-1,K=class extends me{constructor(e=null,t=W,n=W,s=1){super(),e!==null&&this.addEventListener("change",()=>e.setSize(this.baseSize.width,this.baseSize.height)),this.baseSize=new P(1,1),this.preferredSize=new P(t,n),this.target=this.preferredSize,this.s=s,this.effectiveSize=new P,this.addEventListener("change",()=>this.updateEffectiveSize()),this.updateEffectiveSize()}updateEffectiveSize(){const e=this.baseSize,t=this.preferredSize,n=this.effectiveSize,s=this.scale;t.width!==W?n.width=t.width:t.height!==W?n.width=Math.round(t.height*(e.width/Math.max(e.height,1))):n.width=Math.round(e.width*s),t.height!==W?n.height=t.height:t.width!==W?n.height=Math.round(t.width/Math.max(e.width/Math.max(e.height,1),1)):n.height=Math.round(e.height*s)}get width(){return this.effectiveSize.width}set width(e){this.preferredWidth=e}get height(){return this.effectiveSize.height}set height(e){this.preferredHeight=e}getWidth(){return this.width}getHeight(){return this.height}get scale(){return this.s}set scale(e){this.s!==e&&(this.s=e,this.preferredSize.setScalar(W),this.dispatchEvent({type:"change"}))}getScale(){return this.scale}setScale(e){this.scale=e}get baseWidth(){return this.baseSize.width}set baseWidth(e){this.baseSize.width!==e&&(this.baseSize.width=e,this.dispatchEvent({type:"change"}))}getBaseWidth(){return this.baseWidth}setBaseWidth(e){this.baseWidth=e}get baseHeight(){return this.baseSize.height}set baseHeight(e){this.baseSize.height!==e&&(this.baseSize.height=e,this.dispatchEvent({type:"change"}))}getBaseHeight(){return this.baseHeight}setBaseHeight(e){this.baseHeight=e}setBaseSize(e,t){(this.baseSize.width!==e||this.baseSize.height!==t)&&(this.baseSize.set(e,t),this.dispatchEvent({type:"change"}))}get preferredWidth(){return this.preferredSize.width}set preferredWidth(e){this.preferredSize.width!==e&&(this.preferredSize.width=e,this.dispatchEvent({type:"change"}))}getPreferredWidth(){return this.preferredWidth}setPreferredWidth(e){this.preferredWidth=e}get preferredHeight(){return this.preferredSize.height}set preferredHeight(e){this.preferredSize.height!==e&&(this.preferredSize.height=e,this.dispatchEvent({type:"change"}))}getPreferredHeight(){return this.preferredHeight}setPreferredHeight(e){this.preferredHeight=e}setPreferredSize(e,t){(this.preferredSize.width!==e||this.preferredSize.height!==t)&&(this.preferredSize.set(e,t),this.dispatchEvent({type:"change"}))}copy(e){this.s=e.scale,this.baseSize.set(e.baseWidth,e.baseHeight),this.preferredSize.set(e.preferredWidth,e.preferredHeight),this.dispatchEvent({type:"change"})}static get AUTO_SIZE(){return W}},T={ADD:0,ALPHA:1,AVERAGE:2,COLOR:3,COLOR_BURN:4,COLOR_DODGE:5,DARKEN:6,DIFFERENCE:7,DIVIDE:8,DST:9,EXCLUSION:10,HARD_LIGHT:11,HARD_MIX:12,HUE:13,INVERT:14,INVERT_RGB:15,LIGHTEN:16,LINEAR_BURN:17,LINEAR_DODGE:18,LINEAR_LIGHT:19,LUMINOSITY:20,MULTIPLY:21,NEGATION:22,NORMAL:23,OVERLAY:24,PIN_LIGHT:25,REFLECT:26,SATURATION:27,SCREEN:28,SOFT_LIGHT:29,SRC:30,SUBTRACT:31,VIVID_LIGHT:32},At="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Dt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,src.a*opacity);}",Nt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=(dst.rgb+src.rgb)*0.5;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Pt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.xy,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Bt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=mix(step(0.0,b)*(1.0-min(vec3(1.0),(1.0-a)/max(b,1e-9))),vec3(1.0),step(1.0,a));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",It="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=dst.rgb,b=src.rgb;vec3 c=step(0.0,a)*mix(min(vec3(1.0),a/max(1.0-b,1e-9)),vec3(1.0),step(1.0,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ot="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ft="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=abs(dst.rgb-src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ut="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb/max(src.rgb,1e-9);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",kt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-2.0*dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Lt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb,1.0);vec3 b=min(src.rgb,1.0);vec3 c=mix(2.0*a*b,1.0-2.0*(1.0-a)*(1.0-b),step(0.5,b));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Gt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=step(1.0,dst.rgb+src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Ht="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(b.x,a.yz));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",zt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Vt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=src.rgb*max(1.0-dst.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Wt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb,src.rgb);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",jt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",qt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=min(dst.rgb+src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",$t="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=clamp(2.0*src.rgb+dst.rgb-1.0,0.0,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Xt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.xy,b.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Yt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb*src.rgb;return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Kt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(1.0-abs(1.0-dst.rgb-src.rgb),0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Qt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return mix(dst,src,opacity);}",Zt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=2.0*src.rgb*dst.rgb;vec3 b=1.0-2.0*(1.0-src.rgb)*(1.0-dst.rgb);vec3 c=mix(a,b,step(0.5,dst.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",Jt="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 c=mix(mix(src2,dst.rgb,step(0.5*dst.rgb,src.rgb)),max(src2-1.0,vec3(0.0)),step(dst.rgb,src2-1.0));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",en="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=min(dst.rgb*dst.rgb/max(1.0-src.rgb,1e-9),1.0);vec3 c=mix(a,src.rgb,step(1.0,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",tn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 a=RGBToHSL(dst.rgb);vec3 b=RGBToHSL(src.rgb);vec3 c=HSLToRGB(vec3(a.x,b.y,a.z));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",nn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=dst.rgb+src.rgb-min(dst.rgb*src.rgb,1.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",sn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 src2=2.0*src.rgb;vec3 d=dst.rgb+(src2-1.0);vec3 w=step(0.5,src.rgb);vec3 a=dst.rgb-(1.0-src2)*dst.rgb*(1.0-dst.rgb);vec3 b=mix(d*(sqrt(dst.rgb)-dst.rgb),d*dst.rgb*((16.0*dst.rgb-12.0)*dst.rgb+3.0),w*(1.0-step(0.25,dst.rgb)));vec3 c=mix(a,b,w);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",rn="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){return src;}",an="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=max(dst.rgb-src.rgb,0.0);return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",on="vec4 blend(const in vec4 dst,const in vec4 src,const in float opacity){vec3 c=mix(max(1.0-min((1.0-dst.rgb)/(2.0*src.rgb),1.0),0.0),min(dst.rgb/(2.0*(1.0-src.rgb)),1.0),step(0.5,src.rgb));return mix(dst,vec4(c,max(dst.a,src.a)),opacity);}",ln=new Map([[T.ADD,At],[T.ALPHA,Dt],[T.AVERAGE,Nt],[T.COLOR,Pt],[T.COLOR_BURN,Bt],[T.COLOR_DODGE,It],[T.DARKEN,Ot],[T.DIFFERENCE,Ft],[T.DIVIDE,Ut],[T.DST,null],[T.EXCLUSION,kt],[T.HARD_LIGHT,Lt],[T.HARD_MIX,Gt],[T.HUE,Ht],[T.INVERT,zt],[T.INVERT_RGB,Vt],[T.LIGHTEN,Wt],[T.LINEAR_BURN,jt],[T.LINEAR_DODGE,qt],[T.LINEAR_LIGHT,$t],[T.LUMINOSITY,Xt],[T.MULTIPLY,Yt],[T.NEGATION,Kt],[T.NORMAL,Qt],[T.OVERLAY,Zt],[T.PIN_LIGHT,Jt],[T.REFLECT,en],[T.SATURATION,tn],[T.SCREEN,nn],[T.SOFT_LIGHT,sn],[T.SRC,rn],[T.SUBTRACT,an],[T.VIVID_LIGHT,on]]),cn=class extends me{constructor(e,t=1){super(),this._blendFunction=e,this.opacity=new _(t)}getOpacity(){return this.opacity.value}setOpacity(e){this.opacity.value=e}get blendFunction(){return this._blendFunction}set blendFunction(e){this._blendFunction=e,this.dispatchEvent({type:"change"})}getBlendFunction(){return this.blendFunction}setBlendFunction(e){this.blendFunction=e}getShaderCode(){return ln.get(this.blendFunction)}},ve=class extends me{constructor(e,t,{attributes:n=G.NONE,blendFunction:s=T.NORMAL,defines:i=new Map,uniforms:r=new Map,extensions:a=null,vertexShader:c=null}={}){super(),this.name=e,this.renderer=null,this.attributes=n,this.fragmentShader=t,this.vertexShader=c,this.defines=i,this.uniforms=r,this.extensions=a,this.blendMode=new cn(s),this.blendMode.addEventListener("change",o=>this.setChanged()),this._inputColorSpace=Ne,this._outputColorSpace=Pe}get inputColorSpace(){return this._inputColorSpace}set inputColorSpace(e){this._inputColorSpace=e,this.setChanged()}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e,this.setChanged()}set mainScene(e){}set mainCamera(e){}getName(){return this.name}setRenderer(e){this.renderer=e}getDefines(){return this.defines}getUniforms(){return this.uniforms}getExtensions(){return this.extensions}getBlendMode(){return this.blendMode}getAttributes(){return this.attributes}setAttributes(e){this.attributes=e,this.setChanged()}getFragmentShader(){return this.fragmentShader}setFragmentShader(e){this.fragmentShader=e,this.setChanged()}getVertexShader(){return this.vertexShader}setVertexShader(e){this.vertexShader=e,this.setChanged()}setChanged(){this.dispatchEvent({type:"change"})}setDepthTexture(e,t=Z){}update(e,t,n){}setSize(e,t){}initialize(e,t,n){}dispose(){for(const e of Object.keys(this)){const t=this[e];(t instanceof q||t instanceof Be||t instanceof Ie||t instanceof k)&&this[e].dispose()}}},un=`#ifdef RADIAL_MODULATION
uniform float modulationOffset;
#endif
varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainImage(const in vec4 inputColor,const in vec2 uv,out vec4 outputColor){vec2 ra=inputColor.ra;vec2 ba=inputColor.ba;
#ifdef RADIAL_MODULATION
const vec2 center=vec2(0.5);float d=distance(uv,center)*2.0;d=max(d-modulationOffset,0.0);if(vActive>0.0&&d>0.0){ra=texture2D(inputBuffer,mix(uv,vUvR,d)).ra;ba=texture2D(inputBuffer,mix(uv,vUvB,d)).ba;}
#else
if(vActive>0.0){ra=texture2D(inputBuffer,vUvR).ra;ba=texture2D(inputBuffer,vUvB).ba;}
#endif
outputColor=vec4(ra.x,inputColor.g,ba.x,max(max(ra.y,ba.y),inputColor.a));}`,fn="uniform vec2 offset;varying float vActive;varying vec2 vUvR;varying vec2 vUvB;void mainSupport(const in vec2 uv){vec2 shift=offset*vec2(1.0,aspect);vActive=(shift.x!=0.0||shift.y!=0.0)?1.0:0.0;vUvR=uv+shift;vUvB=uv-shift;}",dn=class extends ve{constructor({offset:e=new P(.001,5e-4),radialModulation:t=!1,modulationOffset:n=.15}={}){super("ChromaticAberrationEffect",un,{vertexShader:fn,attributes:G.CONVOLUTION,uniforms:new Map([["offset",new _(e)],["modulationOffset",new _(n)]])}),this.radialModulation=t}get offset(){return this.uniforms.get("offset").value}set offset(e){this.uniforms.get("offset").value=e}get radialModulation(){return this.defines.has("RADIAL_MODULATION")}set radialModulation(e){e?this.defines.set("RADIAL_MODULATION","1"):this.defines.delete("RADIAL_MODULATION"),this.setChanged()}get modulationOffset(){return this.uniforms.get("modulationOffset").value}set modulationOffset(e){this.uniforms.get("modulationOffset").value=e}getOffset(){return this.offset}setOffset(e){this.offset=e}},Le=class extends k{constructor(e,t,n=null){super("RenderPass",e,t),this.needsSwap=!1,this.needsDepthBlit=!0,this.clearPass=new ke,this.overrideMaterialManager=n===null?null:new Te(n),this.ignoreBackground=!1,this.skipShadowMapUpdate=!1,this.selection=null}set mainScene(e){this.scene=e}set mainCamera(e){this.camera=e}get renderToScreen(){return super.renderToScreen}set renderToScreen(e){super.renderToScreen=e,this.clearPass.renderToScreen=e}get overrideMaterial(){const e=this.overrideMaterialManager;return e!==null?e.material:null}set overrideMaterial(e){const t=this.overrideMaterialManager;e!==null?t!==null?t.setMaterial(e):this.overrideMaterialManager=new Te(e):t!==null&&(t.dispose(),this.overrideMaterialManager=null)}getOverrideMaterial(){return this.overrideMaterial}setOverrideMaterial(e){this.overrideMaterial=e}get clear(){return this.clearPass.enabled}set clear(e){this.clearPass.enabled=e}getSelection(){return this.selection}setSelection(e){this.selection=e}isBackgroundDisabled(){return this.ignoreBackground}setBackgroundDisabled(e){this.ignoreBackground=e}isShadowMapDisabled(){return this.skipShadowMapUpdate}setShadowMapDisabled(e){this.skipShadowMapUpdate=e}getClearPass(){return this.clearPass}render(e,t,n,s,i){const r=this.scene,a=this.camera,c=this.selection,o=a.layers.mask,p=r.background,f=e.shadowMap.autoUpdate,d=this.renderToScreen?null:t;c!==null&&a.layers.set(c.getLayer()),this.skipShadowMapUpdate&&(e.shadowMap.autoUpdate=!1),(this.ignoreBackground||this.clearPass.overrideClearColor!==null)&&(r.background=null),this.clearPass.enabled&&this.clearPass.render(e,t),e.setRenderTarget(d),this.overrideMaterialManager!==null?this.overrideMaterialManager.render(e,r,a):e.render(r,a),a.layers.mask=o,r.background=p,e.shadowMap.autoUpdate=f}},hn=`#include <packing>
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
gl_FragColor=vec4(n[index],d[index]);}`,vn="uniform vec2 texelSize;varying vec2 vUv0;varying vec2 vUv1;varying vec2 vUv2;varying vec2 vUv3;void main(){vec2 uv=position.xy*0.5+0.5;vUv0=uv;vUv1=vec2(uv.x,uv.y+texelSize.y);vUv2=vec2(uv.x+texelSize.x,uv.y);vUv3=uv+texelSize;gl_Position=vec4(position.xy,1.0,1.0);}",pn=class extends J{constructor(){super({name:"DepthDownsamplingMaterial",defines:{DEPTH_PACKING:"0"},uniforms:{depthBuffer:new _(null),normalBuffer:new _(null),texelSize:new _(new P)},blending:ge,toneMapped:!1,depthWrite:!1,depthTest:!1,fragmentShader:hn,vertexShader:vn})}set depthBuffer(e){this.uniforms.depthBuffer.value=e}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=Z){this.depthBuffer=e,this.depthPacking=t}set normalBuffer(e){this.uniforms.normalBuffer.value=e,e!==null?this.defines.DOWNSAMPLE_NORMALS="1":delete this.defines.DOWNSAMPLE_NORMALS,this.needsUpdate=!0}setNormalBuffer(e){this.normalBuffer=e}setTexelSize(e,t){this.uniforms.texelSize.value.set(e,t)}setSize(e,t){this.uniforms.texelSize.value.set(1/e,1/t)}},mn=class extends k{constructor({normalBuffer:e=null,resolutionScale:t=.5,width:n=K.AUTO_SIZE,height:s=K.AUTO_SIZE,resolutionX:i=n,resolutionY:r=s}={}){super("DepthDownsamplingPass");const a=new pn;a.normalBuffer=e,this.fullscreenMaterial=a,this.needsDepthTexture=!0,this.needsSwap=!1,this.renderTarget=new q(1,1,{minFilter:oe,magFilter:oe,depthBuffer:!1,type:pe}),this.renderTarget.texture.name="DepthDownsamplingPass.Target",this.renderTarget.texture.generateMipmaps=!1;const c=this.resolution=new K(this,i,r,t);c.addEventListener("change",o=>this.setSize(c.baseWidth,c.baseHeight))}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}setDepthTexture(e,t=Z){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t}render(e,t,n,s,i){e.setRenderTarget(this.renderToScreen?null:this.renderTarget),e.render(this.scene,this.camera)}setSize(e,t){const n=this.resolution;n.setBaseSize(e,t),this.renderTarget.setSize(n.width,n.height),this.fullscreenMaterial.setSize(e,t)}initialize(e,t,n){const s=e.getContext();if(!(s.getExtension("EXT_color_buffer_float")||s.getExtension("EXT_color_buffer_half_float")))throw new Error("Rendering to float texture is not supported.")}},gn=`#include <common>
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
}`,bn="uniform vec2 resolution;uniform vec2 texelSize;uniform float cameraNear;uniform float cameraFar;uniform float aspect;uniform float time;varying vec2 vUv;VERTEX_HEAD void main(){vUv=position.xy*0.5+0.5;VERTEX_MAIN_SUPPORT gl_Position=vec4(position.xy,1.0,1.0);}",xn=class extends J{constructor(e,t,n,s,i=!1){super({name:"EffectMaterial",defines:{THREE_REVISION:Ye.replace(/\D+/g,""),DEPTH_PACKING:"0",ENCODE_OUTPUT:"1"},uniforms:{inputBuffer:new _(null),depthBuffer:new _(null),resolution:new _(new P),texelSize:new _(new P),cameraNear:new _(.3),cameraFar:new _(1e3),aspect:new _(1),time:new _(0)},blending:ge,toneMapped:!1,depthWrite:!1,depthTest:!1,dithering:i}),e&&this.setShaderParts(e),t&&this.setDefines(t),n&&this.setUniforms(n),this.copyCameraSettings(s)}set inputBuffer(e){this.uniforms.inputBuffer.value=e}setInputBuffer(e){this.uniforms.inputBuffer.value=e}get depthBuffer(){return this.uniforms.depthBuffer.value}set depthBuffer(e){this.uniforms.depthBuffer.value=e}get depthPacking(){return Number(this.defines.DEPTH_PACKING)}set depthPacking(e){this.defines.DEPTH_PACKING=e.toFixed(0),this.needsUpdate=!0}setDepthBuffer(e,t=Z){this.depthBuffer=e,this.depthPacking=t}setShaderData(e){this.setShaderParts(e.shaderParts),this.setDefines(e.defines),this.setUniforms(e.uniforms),this.setExtensions(e.extensions)}setShaderParts(e){return this.fragmentShader=gn.replace(E.FRAGMENT_HEAD,e.get(E.FRAGMENT_HEAD)||"").replace(E.FRAGMENT_MAIN_UV,e.get(E.FRAGMENT_MAIN_UV)||"").replace(E.FRAGMENT_MAIN_IMAGE,e.get(E.FRAGMENT_MAIN_IMAGE)||""),this.vertexShader=bn.replace(E.VERTEX_HEAD,e.get(E.VERTEX_HEAD)||"").replace(E.VERTEX_MAIN_SUPPORT,e.get(E.VERTEX_MAIN_SUPPORT)||""),this.needsUpdate=!0,this}setDefines(e){for(const t of e.entries())this.defines[t[0]]=t[1];return this.needsUpdate=!0,this}setUniforms(e){for(const t of e.entries())this.uniforms[t[0]]=t[1];return this}setExtensions(e){this.extensions={};for(const t of e)this.extensions[t]=!0;return this}get encodeOutput(){return this.defines.ENCODE_OUTPUT!==void 0}set encodeOutput(e){this.encodeOutput!==e&&(e?this.defines.ENCODE_OUTPUT="1":delete this.defines.ENCODE_OUTPUT,this.needsUpdate=!0)}isOutputEncodingEnabled(e){return this.encodeOutput}setOutputEncodingEnabled(e){this.encodeOutput=e}get time(){return this.uniforms.time.value}set time(e){this.uniforms.time.value=e}setDeltaTime(e){this.uniforms.time.value+=e}adoptCameraSettings(e){this.copyCameraSettings(e)}copyCameraSettings(e){e&&(this.uniforms.cameraNear.value=e.near,this.uniforms.cameraFar.value=e.far,e instanceof Ke?this.defines.PERSPECTIVE_CAMERA="1":delete this.defines.PERSPECTIVE_CAMERA,this.needsUpdate=!0)}setSize(e,t){const n=this.uniforms;n.resolution.value.set(e,t),n.texelSize.value.set(1/e,1/t),n.aspect.value=e/t}static get Section(){return E}};function Ee(e,t,n){for(const s of t){const i="$1"+e+s.charAt(0).toUpperCase()+s.slice(1),r=new RegExp("([^\\.])(\\b"+s+"\\b)","g");for(const a of n.entries())a[1]!==null&&n.set(a[0],a[1].replace(r,i))}}function yn(e,t,n){let s=t.getFragmentShader(),i=t.getVertexShader();const r=s!==void 0&&/mainImage/.test(s),a=s!==void 0&&/mainUv/.test(s);if(n.attributes|=t.getAttributes(),s===void 0)throw new Error(`Missing fragment shader (${t.name})`);if(a&&n.attributes&G.CONVOLUTION)throw new Error(`Effects that transform UVs are incompatible with convolution effects (${t.name})`);if(!r&&!a)throw new Error(`Could not find mainImage or mainUv function (${t.name})`);{const c=/\w+\s+(\w+)\([\w\s,]*\)\s*{/g,o=n.shaderParts;let p=o.get(E.FRAGMENT_HEAD)||"",f=o.get(E.FRAGMENT_MAIN_UV)||"",d=o.get(E.FRAGMENT_MAIN_IMAGE)||"",g=o.get(E.VERTEX_HEAD)||"",b=o.get(E.VERTEX_MAIN_SUPPORT)||"";const y=new Set,S=new Set;if(a&&(f+=`	${e}MainUv(UV);
`,n.uvTransformation=!0),i!==null&&/mainSupport/.test(i)){const v=/mainSupport *\([\w\s]*?uv\s*?\)/.test(i);b+=`	${e}MainSupport(`,b+=v?`vUv);
`:`);
`;for(const m of i.matchAll(/(?:varying\s+\w+\s+([\S\s]*?);)/g))for(const R of m[1].split(/\s*,\s*/))n.varyings.add(R),y.add(R),S.add(R);for(const m of i.matchAll(c))S.add(m[1])}for(const v of s.matchAll(c))S.add(v[1]);for(const v of t.defines.keys())S.add(v.replace(/\([\w\s,]*\)/g,""));for(const v of t.uniforms.keys())S.add(v);S.delete("while"),S.delete("for"),S.delete("if"),t.uniforms.forEach((v,m)=>n.uniforms.set(e+m.charAt(0).toUpperCase()+m.slice(1),v)),t.defines.forEach((v,m)=>n.defines.set(e+m.charAt(0).toUpperCase()+m.slice(1),v));const h=new Map([["fragment",s],["vertex",i]]);Ee(e,S,n.defines),Ee(e,S,h),s=h.get("fragment"),i=h.get("vertex");const x=t.blendMode;if(n.blendModes.set(x.blendFunction,x),r){t.inputColorSpace!==null&&t.inputColorSpace!==n.colorSpace&&(d+=t.inputColorSpace===H?`color0 = sRGBTransferOETF(color0);
	`:`color0 = sRGBToLinear(color0);
	`),t.outputColorSpace!==Pe?n.colorSpace=t.outputColorSpace:t.inputColorSpace!==null&&(n.colorSpace=t.inputColorSpace);const v=/MainImage *\([\w\s,]*?depth[\w\s,]*?\)/;d+=`${e}MainImage(color0, UV, `,n.attributes&G.DEPTH&&v.test(s)&&(d+="depth, ",n.readDepth=!0),d+=`color1);
	`;const m=e+"BlendOpacity";n.uniforms.set(m,x.opacity),d+=`color0 = blend${x.blendFunction}(color0, color1, ${m});

	`,p+=`uniform float ${m};

`}if(p+=s+`
`,i!==null&&(g+=i+`
`),o.set(E.FRAGMENT_HEAD,p),o.set(E.FRAGMENT_MAIN_UV,f),o.set(E.FRAGMENT_MAIN_IMAGE,d),o.set(E.VERTEX_HEAD,g),o.set(E.VERTEX_MAIN_SUPPORT,b),t.extensions!==null)for(const v of t.extensions)n.extensions.add(v)}}var Sn=class extends k{constructor(e,...t){super("EffectPass"),this.fullscreenMaterial=new xn(null,null,null,e),this.listener=n=>this.handleEvent(n),this.effects=[],this.setEffects(t),this.skipRendering=!1,this.minTime=1,this.maxTime=Number.POSITIVE_INFINITY,this.timeScale=1}set mainScene(e){for(const t of this.effects)t.mainScene=e}set mainCamera(e){this.fullscreenMaterial.copyCameraSettings(e);for(const t of this.effects)t.mainCamera=e}get encodeOutput(){return this.fullscreenMaterial.encodeOutput}set encodeOutput(e){this.fullscreenMaterial.encodeOutput=e}get dithering(){return this.fullscreenMaterial.dithering}set dithering(e){const t=this.fullscreenMaterial;t.dithering=e,t.needsUpdate=!0}setEffects(e){for(const t of this.effects)t.removeEventListener("change",this.listener);this.effects=e.sort((t,n)=>n.attributes-t.attributes);for(const t of this.effects)t.addEventListener("change",this.listener)}updateMaterial(){const e=new _t;let t=0;for(const a of this.effects)if(a.blendMode.blendFunction===T.DST)e.attributes|=a.getAttributes()&G.DEPTH;else{if(e.attributes&a.getAttributes()&G.CONVOLUTION)throw new Error(`Convolution effects cannot be merged (${a.name})`);yn("e"+t++,a,e)}let n=e.shaderParts.get(E.FRAGMENT_HEAD),s=e.shaderParts.get(E.FRAGMENT_MAIN_IMAGE),i=e.shaderParts.get(E.FRAGMENT_MAIN_UV);const r=/\bblend\b/g;for(const a of e.blendModes.values())n+=a.getShaderCode().replace(r,`blend${a.blendFunction}`)+`
`;e.attributes&G.DEPTH?(e.readDepth&&(s=`float depth = readDepth(UV);

	`+s),this.needsDepthTexture=this.getDepthTexture()===null):this.needsDepthTexture=!1,e.colorSpace===H&&(s+=`color0 = sRGBToLinear(color0);
	`),e.uvTransformation?(i=`vec2 transformedUv = vUv;
`+i,e.defines.set("UV","transformedUv")):e.defines.set("UV","vUv"),e.shaderParts.set(E.FRAGMENT_HEAD,n),e.shaderParts.set(E.FRAGMENT_MAIN_IMAGE,s),e.shaderParts.set(E.FRAGMENT_MAIN_UV,i);for(const[a,c]of e.shaderParts)c!==null&&e.shaderParts.set(a,c.trim().replace(/^#/,`
#`));this.skipRendering=t===0,this.needsSwap=!this.skipRendering,this.fullscreenMaterial.setShaderData(e)}recompile(){this.updateMaterial()}getDepthTexture(){return this.fullscreenMaterial.depthBuffer}setDepthTexture(e,t=Z){this.fullscreenMaterial.depthBuffer=e,this.fullscreenMaterial.depthPacking=t;for(const n of this.effects)n.setDepthTexture(e,t)}render(e,t,n,s,i){for(const r of this.effects)r.update(e,t,s);if(!this.skipRendering||this.renderToScreen){const r=this.fullscreenMaterial;r.inputBuffer=t.texture,r.time+=s*this.timeScale,e.setRenderTarget(this.renderToScreen?null:n),e.render(this.scene,this.camera)}}setSize(e,t){this.fullscreenMaterial.setSize(e,t);for(const n of this.effects)n.setSize(e,t)}initialize(e,t,n){this.renderer=e;for(const s of this.effects)s.initialize(e,t,n);this.updateMaterial(),n!==void 0&&n!==ae&&(this.fullscreenMaterial.defines.FRAMEBUFFER_PRECISION_HIGH="1")}dispose(){super.dispose();for(const e of this.effects)e.removeEventListener("change",this.listener),e.dispose()}handleEvent(e){switch(e.type){case"change":this.recompile();break}}},Tn=class extends k{constructor(e,t,{renderTarget:n,resolutionScale:s=1,width:i=K.AUTO_SIZE,height:r=K.AUTO_SIZE,resolutionX:a=i,resolutionY:c=r}={}){super("NormalPass"),this.needsSwap=!1,this.renderPass=new Le(e,t,new je);const o=this.renderPass;o.ignoreBackground=!0,o.skipShadowMapUpdate=!0;const p=o.getClearPass();p.overrideClearColor=new U(7829503),p.overrideClearAlpha=1,this.renderTarget=n,this.renderTarget===void 0&&(this.renderTarget=new q(1,1,{minFilter:oe,magFilter:oe}),this.renderTarget.texture.name="NormalPass.Target");const f=this.resolution=new K(this,a,c,s);f.addEventListener("change",d=>this.setSize(f.baseWidth,f.baseHeight))}set mainScene(e){this.renderPass.mainScene=e}set mainCamera(e){this.renderPass.mainCamera=e}get texture(){return this.renderTarget.texture}getTexture(){return this.renderTarget.texture}getResolution(){return this.resolution}getResolutionScale(){return this.resolution.scale}setResolutionScale(e){this.resolution.scale=e}render(e,t,n,s,i){const r=this.renderToScreen?null:this.renderTarget;this.renderPass.render(e,r,r)}setSize(e,t){const n=this.resolution;n.setBaseSize(e,t),this.renderTarget.setSize(n.width,n.height)}};const En=u.createContext(null),Re=e=>(e.getAttributes()&G.CONVOLUTION)===G.CONVOLUTION,Rn=de.memo(u.forwardRef(({children:e,camera:t,scene:n,resolutionScale:s,enabled:i=!0,renderPriority:r=1,autoClear:a=!0,depthBuffer:c,enableNormalPass:o,stencilBuffer:p,multisampling:f=8,frameBufferType:d=Ae},g)=>{const{gl:b,scene:y,camera:S,size:h}=z(),x=n||y,v=t||S,[m,R,N]=u.useMemo(()=>{const L=vt(),C=new Mt(b,{depthBuffer:c,stencilBuffer:p,multisampling:f>0&&L?f:0,frameBufferType:d});C.addPass(new Le(x,v));let B=null,A=null;return o&&(A=new Tn(x,v),A.enabled=!1,C.addPass(A),s!==void 0&&L&&(B=new mn({normalBuffer:A.texture,resolutionScale:s}),B.enabled=!1,C.addPass(B))),[C,A,B]},[v,b,c,p,f,d,x,o,s]);u.useEffect(()=>m==null?void 0:m.setSize(h.width,h.height),[m,h]),O((L,C)=>{if(i){const B=b.autoClear;b.autoClear=a,p&&!a&&b.clearStencil(),m.render(C),b.autoClear=B}},i?r:0);const V=u.useRef(null);u.useLayoutEffect(()=>{var L;const C=[],B=(L=V.current)==null?void 0:L.__r3f;if(B&&m){const A=B.objects;for(let I=0;I<A.length;I++){const $=A[I];if($ instanceof ve){const ee=[$];if(!Re($)){let te=null;for(;(te=A[I+1])instanceof ve&&!Re(te);)ee.push(te),I++}const ce=new Sn(v,...ee);C.push(ce)}else $ instanceof k&&C.push($)}for(const I of C)m==null||m.addPass(I);R&&(R.enabled=!0),N&&(N.enabled=!0)}return()=>{for(const A of C)m==null||m.removePass(A);R&&(R.enabled=!1),N&&(N.enabled=!1)}},[m,e,v,R,N]),u.useEffect(()=>{const L=b.toneMapping;return b.toneMapping=Ze,()=>{b.toneMapping=L}},[b]);const le=u.useMemo(()=>({composer:m,normalPass:R,downSamplingPass:N,resolutionScale:s,camera:v,scene:x}),[m,R,N,s,v,x]);return u.useImperativeHandle(g,()=>m,[m]),l.jsx(En.Provider,{value:le,children:l.jsx("group",{ref:V,children:e})})}));let wn=0;const we=new WeakMap,Cn=(e,t)=>de.forwardRef(function({blendFunction:s=void 0,opacity:i=void 0,...r},a){let c=we.get(e);if(!c){const f=`@react-three/postprocessing/${e.name}-${wn++}`;Je({[f]:e}),we.set(e,c=f)}const o=z(f=>f.camera),p=de.useMemo(()=>{var f,d;return[...(f=void 0)!=null?f:[],...(d=r.args)!=null?d:[{...t,...r}]]},[JSON.stringify(r)]);return l.jsx(c,{camera:o,"blendMode-blendFunction":s,"blendMode-opacity-value":i,...r,ref:a,args:p})}),Mn=Cn(dn),Ce=[174,285,396,417,528],_n=[{type:"arpeggio",note:174,vol:.03},{type:"pad",note:285,vol:.025},{type:"pulse",note:396,vol:.02},{type:"shimmer",note:2e3,vol:.015},{type:"sub",note:40,vol:.018}];function j(){return M.ctx}function Me(){const e=j();if(!e)return;const t=e.sampleRate*.65,n=e.createBuffer(1,t,e.sampleRate),s=n.getChannelData(0);for(let c=0;c<t;c++)s[c]=(Math.random()*2-1)*Math.pow(1-c/t,1.2);const i=e.createBufferSource();i.buffer=n;const r=e.createBiquadFilter();r.type="lowpass",r.frequency.setValueAtTime(4e3,e.currentTime),r.frequency.exponentialRampToValueAtTime(100,e.currentTime+.6),r.Q.value=1.5;const a=e.createGain();a.gain.setValueAtTime(.3,e.currentTime),a.gain.linearRampToValueAtTime(0,e.currentTime+.65),i.connect(r),r.connect(a),M.reverbNode?a.connect(M.reverbNode):a.connect(e.destination),i.start()}function An(e){const t=j();if(!t)return null;const n=t.createOscillator();n.type="sine",n.frequency.value=e;const s=t.createGain();return s.gain.value=0,n.connect(s),M.reverbNode?s.connect(M.reverbNode):s.connect(M.masterGain||t.destination),n.start(),{osc:n,gain:s}}function Dn(e){const t=j();if(!t)return null;const n=_n[e];if(!n)return null;const s=t.createGain();s.gain.value=0;const i=[];if(n.type==="arpeggio"){const r=t.createOscillator(),a=t.createOscillator();r.type="sine",a.type="sine",r.frequency.value=n.note,a.frequency.value=n.note*1.5;const c=t.createOscillator();c.type="square",c.frequency.value=4;const o=t.createGain();o.gain.value=.5,c.connect(o),o.connect(r.frequency),r.connect(s),a.connect(s),r.start(),a.start(),c.start(),i.push(r,a,c)}else if(n.type==="pad")[1,1.25,1.5,1.875].forEach(a=>{const c=t.createOscillator();c.type="triangle",c.frequency.value=n.note*a,c.connect(s),c.start(),i.push(c)});else if(n.type==="pulse"){const r=t.createOscillator();r.type="sine",r.frequency.value=n.note;const a=t.createOscillator();a.type="sine",a.frequency.value=.5;const c=t.createGain();c.gain.value=.5,a.connect(c),c.connect(s.gain),r.connect(s),r.start(),a.start(),i.push(r,a)}else if(n.type==="shimmer"){const r=t.createOscillator();r.type="triangle",r.frequency.value=n.note;const a=t.createOscillator();a.type="sine",a.frequency.value=5.5;const c=t.createGain();c.gain.value=20,a.connect(c),c.connect(r.frequency),r.connect(s),r.start(),a.start(),i.push(r,a)}else if(n.type==="sub"){const r=t.createOscillator();r.type="sine",r.frequency.value=n.note,r.connect(s),r.start(),i.push(r)}return M.reverbNode?s.connect(M.reverbNode):s.connect(M.masterGain||t.destination),{gain:s,nodes:i,config:n}}function Nn({phase:e,projectIndex:t,phaseProgress:n,zoneProgress:s}){const i=u.useRef(null),r=u.useRef(null),a=u.useRef(null),c=u.useRef(-1),o=u.useRef(!1);u.useEffect(()=>{if(!M.ctx||!M._running||o.current)return;o.current=!0;const h=M.ctx;if(!h)return;const x=[110,165,220,330,440,660,880];for(let v=0;v<Math.min(x.length,12);v++){const m=1+v*2,R=M.oscillators[m];R&&R.frequency&&(R.frequency.cancelScheduledValues(h.currentTime),R.frequency.setValueAtTime(R.frequency.value,h.currentTime),R.frequency.linearRampToValueAtTime(x[v]||220,h.currentTime+4))}},[]);const p=u.useCallback((h,x)=>{const v=j();if(v){if(c.current!==h){if(i.current){const{gain:m,osc:R}=i.current;m.gain.cancelScheduledValues(v.currentTime),m.gain.linearRampToValueAtTime(0,v.currentTime+.5),setTimeout(()=>{try{R.stop()}catch{}},600),i.current=null}c.current=h,i.current=An(Ce[h])}if(i.current){const m=x*.12;i.current.gain.gain.cancelScheduledValues(v.currentTime),i.current.gain.gain.setValueAtTime(i.current.gain.gain.value,v.currentTime),i.current.gain.gain.linearRampToValueAtTime(m,v.currentTime+.1)}}},[]),f=u.useRef(!1),d=u.useCallback(h=>{h>.02&&!f.current&&(f.current=!0,Me())},[]),g=u.useCallback(h=>{const x=j();if(!x)return;if(i.current&&i.current.gain.gain.linearRampToValueAtTime(0,x.currentTime+.5),r.current){r.current.gain.gain.cancelScheduledValues(x.currentTime),r.current.gain.gain.linearRampToValueAtTime(r.current.config.vol,x.currentTime+1.5);return}const v=Dn(h);v&&(r.current=v,v.gain.gain.linearRampToValueAtTime(v.config.vol,x.currentTime+2))},[]),b=u.useCallback(()=>{const h=j();if(h){if(f.current=!1,r.current){r.current.gain.gain.cancelScheduledValues(h.currentTime),r.current.gain.gain.linearRampToValueAtTime(0,h.currentTime+.4);const x=r.current.nodes;setTimeout(()=>{x.forEach(v=>{try{v.stop()}catch{}})},500),r.current=null}if(M.masterGain){const x=M.masterGain.gain,v=x.value;x.cancelScheduledValues(h.currentTime),x.setValueAtTime(v,h.currentTime),x.linearRampToValueAtTime(v*1.3,h.currentTime+.4),x.linearRampToValueAtTime(v,h.currentTime+1.4)}}},[]),y=u.useRef(!1),S=u.useCallback(()=>{if(y.current)return;y.current=!0;const h=j();h&&Ce.forEach(x=>{const v=h.createOscillator();v.type="sine",v.frequency.value=x;const m=h.createGain();m.gain.value=0,v.connect(m),M.reverbNode?m.connect(M.reverbNode):m.connect(h.destination),v.start(),m.gain.linearRampToValueAtTime(.008,h.currentTime+3),m.gain.setValueAtTime(.008,h.currentTime+30),m.gain.linearRampToValueAtTime(0,h.currentTime+35),setTimeout(()=>{try{v.stop()}catch{}},36e3)})},[]);return u.useEffect(()=>{!j()||!M._running||(a.current!==e&&(e==="escape"&&b(),a.current=e),e==="approach"?p(t,n):e==="descent"?d(n):e==="inside"&&g(t))},[e,t,n,p,d,g,b]),u.useEffect(()=>{e==="escape"&&t===4&&n>.6&&S()},[e,t,n,S]),u.useEffect(()=>()=>{if(i.current)try{i.current.osc.stop()}catch{}r.current&&r.current.nodes.forEach(h=>{try{h.stop()}catch{}})},[]),{playDescentWhoosh:Me}}const D=[{index:0,id:"lighthouse",title:"LIGHTHOUSE",role:"Co-founder, Product & Engineering",year:"2023 — Present",tags:["Real-time IoT","AI Copilot","SaaS"],pullQuote:"A factory floor that talks back.",verb:"BUILT.",challenge:"Manufacturing facilities running blind — no real-time visibility into what machines are doing.",metric:"5M+",metricDesc:"events processed daily",reflection:"The hardest part wasn't the technology. It was earning trust from people who'd never used software on a factory floor.",liveUrl:"https://www.wavefuel.in",readMoreUrl:"https://www.wavefuel.in",orbRadius:1.2,orbShader:"electric",orbColor1:new U(330266),orbColor2:new U(26367),orbPosition:new w(-6,2,-20),interiorType:"neuralGrid",interiorBg:"#000D1A",frequency:174,panels:{brief:"Enterprise SaaS platform for real-time monitoring and automation across manufacturing — IoT, cloud, AI.",process:"Co-built with enterprise customers from day one. Weekly on-site sessions. Every decision validated against operational reality, not assumptions.",solution:"Lighthouse — real-time event processing at 5M+ events/day, AI copilot for conversational machine control, monitoring dashboards, OEE tracking.",impact:"5+ enterprise deployments. $20K+ ACV. 13% increase in OEE. 50–60% improvement in feature utilization.",learning:"B2B SaaS in manufacturing taught me that the interface with the most impact is often the one that gets out of the way."}},{index:1,id:"bight",title:"BIGHT",role:"Co-founder, Product & Operations",year:"2020 — 2021",tags:["EdTech","LMS","B2B SaaS"],pullQuote:"Education infrastructure for the next generation.",verb:"LAUNCHED.",challenge:"Universities managing coursework through email threads and spreadsheets.",metric:"12+",metricDesc:"engineers and designers led",reflection:'My first real lesson in the distance between "users want this" and "users will change their behavior for this."',liveUrl:"#",readMoreUrl:"#",orbRadius:.9,orbShader:"ocean",orbColor1:new U(5424),orbColor2:new U(39321),orbPosition:new w(7,-1,-22),interiorType:"digitalGarden",interiorBg:"#030D12",frequency:285,panels:{brief:"B2B SaaS LMS for universities — centralized coursework, assessment, and academic progress management.",process:"Led cross-functional team of 12+. Defined agile processes, sprint cadences, and QA standards from scratch.",solution:"Full LMS with automated grading, progress tracking, faculty tools, and university admin dashboards.",impact:"Pilot programs with universities. Automated grading reduced workflow time. Measurable improvement in university operational efficiency.",learning:"Co-founding taught me that vision is cheap. Execution is everything. The team that ships wins."}},{index:2,id:"searce-cloud",title:"CLOUD AT SCALE",role:"Project Manager, Searce",year:"2022 — 2023",tags:["AWS","GCP","Kubernetes"],pullQuote:"12 cloud projects. Zero late deliveries.",verb:"DELIVERED.",challenge:"Complex cloud migrations with misaligned client expectations and distributed teams.",metric:"100%",metricDesc:"on-time delivery rate",reflection:"Delivery is a trust game. When people believe you'll ship, they give you harder problems.",liveUrl:"#",readMoreUrl:"#",orbRadius:.75,orbShader:"lava",orbColor1:new U(1704704),orbColor2:new U(16729088),orbPosition:new w(-4,-3,-18),interiorType:"liquidMetal",interiorBg:"#010800",frequency:396,panels:{brief:"Managed 12 cloud projects in 12 months including 4 simultaneous large-scale migrations on AWS, GCP, and Kubernetes.",process:"Translated technical complexity into clear client language. Weekly alignment. Risk tracking from day one.",solution:"End-to-end project delivery framework — scope definition, execution plans, stakeholder management, escalation paths.",impact:"100% on-time delivery. Lowest escalation rate in the company. Leadership recognition.",learning:"The best project managers make complex work feel calm. Calm is a skill."}},{index:3,id:"ibm-att",title:"ENTERPRISE PROGRAMS",role:"Project Manager, IBM",year:"2020 — 2021",tags:["Agile","SAFe","Enterprise IT"],pullQuote:"Enterprise scale. Human problems.",verb:"COORDINATED.",challenge:"Multi-location AT&T programs with hundreds of stakeholders and zero tolerance for delay.",metric:"Multi-location",metricDesc:"enterprise programs delivered",reflection:"IBM is where I learned that process is not bureaucracy — it's the language that lets large teams move as one.",liveUrl:"#",readMoreUrl:"#",orbRadius:.65,orbShader:"circuit",orbColor1:new U(72193),orbColor2:new U(65416),orbPosition:new w(8,4,-25),interiorType:"archiveWithin",interiorBg:"#010510",frequency:417,panels:{brief:"Directed multiple enterprise IT programs for AT&T coordinating engineering and business teams across locations.",process:"Agile, SAFe, and Waterfall. Adapted framework to project needs. Sprint planning, backlog prioritization, milestone tracking.",solution:"Standardized reporting and stakeholder dashboards in JIRA and IBM tools. Improved executive visibility.",impact:"Complex multi-location initiatives delivered on time and within budget. Improved efficiency and reduced delays.",learning:"Large organizations move slowly by design. Your job is to find the path of least resistance without cutting corners."}}];function Ge(e,t){const n=e.orbPosition,s=t||n.clone().add(new w(0,0,60));return new et([s,n.clone().add(new w(3,1.5,15)),n.clone().add(new w(4,.5,5)),n.clone().add(new w(-5,.8,2)),n.clone().add(new w(-3,-1.2,-2)),n.clone().add(new w(1,.4,.5)),n.clone().add(new w(0,0,-1.5))],!1,"catmullrom",.5)}const F={APPROACH_END:.2,ORBIT_END:.4,DESCENT_END:.6,INSIDE_END:.85};function Pn(e,t){const n=1/t,s=e/n,i=Math.min(Math.floor(s),t-1),r=(e-i*n)/n;let a="escape",c=F.INSIDE_END,o=1;r<F.APPROACH_END?(a="approach",c=0,o=F.APPROACH_END):r<F.ORBIT_END?(a="orbit",c=F.APPROACH_END,o=F.ORBIT_END):r<F.DESCENT_END?(a="descent",c=F.ORBIT_END,o=F.DESCENT_END):r<F.INSIDE_END&&(a="inside",c=F.DESCENT_END,o=F.INSIDE_END);const p=o>c?(r-c)/(o-c):0;return{projectIndex:i,zoneProgress:r,phase:a,phaseProgress:Math.max(0,Math.min(1,p))}}const Bn=`varying vec2 vUv;
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
`,He=`// ── ORB SURFACE: ELECTRIC STORM ──
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
`,In=`// ── ORB SURFACE: OCEAN ──
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
`,On=`// ── ORB SURFACE: MOLTEN LAVA ──
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
`,Fn=`// ── ORB SURFACE: ICE CRYSTAL LATTICE ──
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
`,Un=`// ── ORB SURFACE: LIVING CIRCUIT BOARD ──
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
`,kn={electric:He,ocean:In,lava:On,ice:Fn,circuit:Un};function Ln({orbRadius:e,phase:t,isMobile:n}){const s=n?2:4,i=u.useRef();u.useRef([]);const r=u.useMemo(()=>Array.from({length:s},(d,g)=>({radius:.04+Math.random()*.04,orbitR:e*1.6+g*.3,speed:.4+Math.random()*.6,axisX:Math.random()*.6-.3,axisY:Math.random()*.3,phaseOff:g/s*Math.PI*2})),[e,s]),a=u.useMemo(()=>new Oe(.06,8,8),[]),c=u.useMemo(()=>new st({color:13421789,roughness:.8,metalness:.2}),[]),o=u.useMemo(()=>r.map(d=>{const g=[];for(let b=0;b<=60;b++){const y=b/60*Math.PI*2+d.phaseOff,S=Math.cos(y)*d.orbitR,h=Math.sin(y)*d.orbitR,x=Math.sin(y*d.axisX+d.phaseOff)*d.orbitR*.2;g.push(new w(S,x,h))}return new be().setFromPoints(g)}),[r]),p=u.useMemo(()=>r.map(()=>new Ue({color:8952251,transparent:!0,opacity:0})),[r]),f=u.useMemo(()=>new rt,[]);return O(d=>{const g=d.clock.elapsedTime;if(!i.current)return;const b=t==="orbit",y=t==="approach";r.forEach((S,h)=>{const x=g*S.speed+S.phaseOff,v=Math.cos(x)*S.orbitR,m=Math.sin(x)*S.orbitR,R=Math.sin(x*S.axisX+S.phaseOff)*S.orbitR*.2;if(f.position.set(v,R,m),f.scale.setScalar(S.radius/.06),f.updateMatrix(),i.current.setMatrixAt(h,f.matrix),p[h]){const N=y||b?.35:0;p[h].opacity+=(N-p[h].opacity)*.03}}),i.current.instanceMatrix.needsUpdate=!0}),l.jsxs("group",{children:[l.jsx("instancedMesh",{ref:i,args:[a,c,s]}),o.map((d,g)=>l.jsx("line",{geometry:d,material:p[g]},g))]})}function Gn({project:e,phase:t,phaseProgress:n,mouseNDC:s,activePhase:i,isActive:r,isMobile:a}){const c=u.useRef(),o=u.useRef();u.useRef();const p=u.useRef(1),f=kn[e.orbShader]||He,d=u.useMemo(()=>({uTime:{value:0},uSpeed:{value:.4},uColor1:{value:e.orbColor1.clone()},uColor2:{value:e.orbColor2.clone()}}),[e]),g=u.useMemo(()=>new J({vertexShader:Bn,fragmentShader:f,uniforms:d}),[f,d]),b=a?32:64,y=u.useMemo(()=>new Oe(e.orbRadius,b,b),[e.orbRadius,b]);O(x=>{const v=x.clock.elapsedTime;d.uTime.value=v;const m=t==="approach"?.4+n*.8:t==="orbit"?1.2:.4;if(d.uSpeed.value+=(m-d.uSpeed.value)*.02,!c.current)return;const R=!r&&(i==="descent"||i==="inside")?0:1;if(p.current+=(R-p.current)*.04,c.current.scale.setScalar(p.current),o.current&&t==="orbit"){const N=s.x*.4,V=-s.y*.25;o.current.rotation.y+=(N-o.current.rotation.y)*.05,o.current.rotation.x+=(V-o.current.rotation.x)*.05}o.current&&(o.current.rotation.y+=.001)});const S=u.useMemo(()=>new tt(e.orbRadius*1.02,e.orbRadius*1.18,64),[e.orbRadius]),h=u.useMemo(()=>new nt({color:e.orbColor2,transparent:!0,opacity:.08,side:Y,blending:Fe,depthWrite:!1}),[e.orbColor2]);return l.jsxs("group",{ref:c,position:e.orbPosition,children:[l.jsx("mesh",{ref:o,geometry:y,material:g}),l.jsx("mesh",{geometry:S,material:h,rotation:[Math.PI/2,0,0]}),r&&l.jsx(Ln,{orbRadius:e.orbRadius,phase:t,isMobile:a}),t==="approach"&&n>.6||t==="orbit"?l.jsx(ht,{position:[0,e.orbRadius+.4,0],fontSize:.18,color:"#C9A84C",anchorX:"center",anchorY:"bottom",fillOpacity:t==="orbit"?1:n*2-1.2,children:e.title}):null]})}const ze=`// ── INTERIOR BIOME: NEURAL GRID ──
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
`,Hn=`// ── INTERIOR BIOME: LIQUID METAL ──
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
`,zn=`// ── INTERIOR BIOME: DIGITAL GARDEN ──
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
`,Vn=`// ── INTERIOR BIOME: FREQUENCY ROOM ──
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
`,Wn=`// ── INTERIOR BIOME: THE ARCHIVE WITHIN ──
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
`,jn={neuralGrid:ze,liquidMetal:Hn,digitalGarden:zn,frequencyRoom:Vn,archiveWithin:Wn},qn=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;function $n({interiorType:e,visible:t}){const{viewport:n}=z(),s=u.useRef(),i=u.useMemo(()=>({uTime:{value:0},uResolution:{value:new P(window.innerWidth,window.innerHeight)}}),[]),r=jn[e]||ze;return O(a=>{s.current&&(i.uTime.value=a.clock.elapsedTime)}),t?l.jsxs("mesh",{position:[0,0,-3],renderOrder:-1,children:[l.jsx("planeGeometry",{args:[n.width*2.5,n.height*2.5,1,1]}),l.jsx("shaderMaterial",{ref:s,vertexShader:qn,fragmentShader:r,uniforms:i,depthWrite:!1,depthTest:!1})]}):null}function Xn({position:e,rotation:t,hovered:n}){const s=u.useMemo(()=>new at(new ot(1.82,1.12)),[]),i=u.useMemo(()=>new Ue({color:"#C9A84C",transparent:!0,opacity:.3}),[]);return O(()=>{i&&(i.opacity=n?.8:.3)}),l.jsx("lineSegments",{position:e,rotation:t,geometry:s,material:i})}function Yn({position:e,rotation:t,color:n,label:s,visible:i}){const r=u.useRef(),[a,c]=u.useState(!1),o=u.useRef(),p=u.useMemo(()=>new w(e[0],e[1],e[2]+1.2),[e]),f=u.useMemo(()=>new w(...e),[e]),d=u.useMemo(()=>new w(1.4,1.4,1.4),[]),g=u.useMemo(()=>new w(1,1,1),[]);O(h=>{if(!r.current||!i)return;const x=h.clock.elapsedTime;a?(r.current.position.lerp(p,.08),r.current.rotation.y+=(0-r.current.rotation.y)*.1,r.current.scale.lerp(d,.08)):(r.current.position.lerp(f,.06),r.current.scale.lerp(g,.06)),o.current&&(o.current.uniforms.uTime.value=x)});const b=u.useMemo(()=>({uTime:{value:0},uColor:{value:new U(n)}}),[n]),y=`
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
  `;return i?l.jsxs("group",{children:[l.jsxs("mesh",{ref:r,position:e,rotation:t,onPointerOver:()=>c(!0),onPointerOut:()=>c(!1),children:[l.jsx("planeGeometry",{args:[1.8,1.1,1,1]}),l.jsx("shaderMaterial",{ref:o,vertexShader:y,fragmentShader:S,uniforms:b,transparent:!0,roughness:.1,metalness:.3})]}),l.jsx(Xn,{position:e,rotation:t,hovered:a})]}):null}function _e({position:e,label:t,visible:n,onClick:s}){const i=u.useRef(),r=u.useRef(),[a,c]=u.useState(!1),o=u.useRef(0),p=u.useMemo(()=>new it(.18,0),[]);return O(f=>{if(!i.current||!n)return;const d=f.clock.elapsedTime;i.current.rotation.y+=.012,i.current.rotation.x=Math.sin(d*.5)*.15;const g=a?1:0;if(o.current+=(g-o.current)*.08,i.current.material&&(i.current.material.emissiveIntensity=o.current*1.5),r.current){const b=a?1+Math.sin(d*4)*.06:0;r.current.scale.setScalar(b+(a?1:0)),r.current.material.opacity=a?.6:0}}),n?l.jsxs("group",{position:e,children:[l.jsx("mesh",{ref:i,geometry:p,onPointerOver:()=>c(!0),onPointerOut:()=>c(!1),onClick:s,children:l.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:0,metalness:.9,roughness:.1})}),l.jsxs("mesh",{ref:r,rotation:[Math.PI/2,0,0],children:[l.jsx("ringGeometry",{args:[.22,.28,32]}),l.jsx("meshBasicMaterial",{color:"#C9A84C",transparent:!0,opacity:0,side:Y,depthWrite:!1})]})]}):null}function Kn({project:e,phase:t,phaseProgress:n,onReadMore:s}){const i=u.useRef(),r=t==="inside"||t==="escape",a=u.useMemo(()=>[{position:[-2,.5,-1.5],rotation:[0,.15,.05],color:re(e.orbColor2)},{position:[1.8,.2,-2.5],rotation:[0,-.2,-.03],color:re(e.orbColor1)},{position:[-1.2,-.8,-3.5],rotation:[.05,.1,0],color:re(e.orbColor2)},{position:[.5,1.1,-2],rotation:[-.05,-.15,.06],color:re(e.orbColor1)}],[e]),c=r&&n>.92;return O(()=>{i.current&&(i.current.visible=r)}),l.jsxs("group",{ref:i,visible:r,children:[l.jsx($n,{interiorType:e.interiorType,visible:r}),a.map((o,p)=>l.jsx(Yn,{position:o.position,rotation:o.rotation,color:o.color,label:`${e.title} — IMG ${p+1}`,visible:r&&n>.05},p)),l.jsx(_e,{position:[-.6,-1.2,-1.8],label:"VIEW LIVE",visible:c,onClick:()=>window.open(e.liveUrl,"_blank")}),l.jsx(_e,{position:[.6,-1.2,-1.8],label:"READ MORE",visible:c,onClick:s}),l.jsx("pointLight",{position:[0,1,-1],intensity:1.5,color:e.orbColor2,distance:8}),l.jsx("ambientLight",{intensity:.3})]})}function re(e){return`#${e.clone().multiplyScalar(.5).getHexString()}`}const X=["THE BRIEF","THE PROCESS","THE SOLUTION","THE IMPACT","THE LEARNING"],Qn=["brief","process","solution","impact","learning"];function Zn({project:e,onClose:t}){const n=u.useRef(),s=u.useRef(),[i,r]=u.useState(0),[a,c]=u.useState(!1),o=u.useRef(null);u.useEffect(()=>{n.current&&ie.fromTo(n.current,{y:"100%",opacity:0},{y:"0%",opacity:1,duration:.6,ease:"power3.out"})},[]);const p=u.useCallback(()=>{a||(c(!0),ie.to(n.current,{y:"100%",opacity:0,duration:.5,ease:"power3.in",onComplete:t}))},[a,t]),f=u.useCallback(()=>{i<X.length-1&&r(v=>v+1)},[i]),d=u.useCallback(()=>{i>0&&r(v=>v-1)},[i]);u.useEffect(()=>{const v=m=>{m.key==="ArrowRight"&&f(),m.key==="ArrowLeft"&&d(),m.key==="Escape"&&p()};return window.addEventListener("keydown",v),()=>window.removeEventListener("keydown",v)},[f,d,p]);const g=v=>{o.current=v.touches[0].clientX},b=v=>{if(o.current===null)return;const m=v.changedTouches[0].clientX-o.current;m<-50&&f(),m>50&&d(),o.current=null};u.useEffect(()=>{s.current&&ie.fromTo(s.current,{x:30,opacity:0},{x:0,opacity:1,duration:.4,ease:"power2.out"})},[i]);const y=(e==null?void 0:e.panels)||{},S=Qn[i],h=X[i],x=y[S]||"[PLACEHOLDER: Fill case study content]";return l.jsxs("div",{ref:n,className:"project-overlay","data-lenis-prevent":!0,onTouchStart:g,onTouchEnd:b,style:{transform:"translateY(100%)"},children:[l.jsx("div",{className:"project-overlay__glass"}),l.jsx("button",{className:"project-overlay__close",onClick:p,"aria-label":"Close case study",children:l.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[l.jsx("line",{x1:"4",y1:"4",x2:"20",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),l.jsx("line",{x1:"20",y1:"4",x2:"4",y2:"20",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})}),l.jsxs("div",{className:"project-overlay__inner",children:[l.jsxs("div",{className:"project-overlay__left",children:[l.jsxs("div",{className:"overlay-project-number",children:["0",((e==null?void 0:e.index)??0)+1]}),l.jsx("h2",{className:"overlay-project-title",children:e==null?void 0:e.title}),l.jsx("p",{className:"overlay-project-role",children:e==null?void 0:e.role}),l.jsx("p",{className:"overlay-project-year",children:e==null?void 0:e.year}),l.jsx("div",{className:"overlay-project-tags",children:((e==null?void 0:e.tags)||[]).map(v=>l.jsx("span",{className:"overlay-tag",children:v},v))}),l.jsx("div",{className:"overlay-dots",children:X.map((v,m)=>l.jsx("button",{className:`overlay-dot ${m===i?"active":""}`,onClick:()=>r(m),"aria-label":`Go to ${X[m]}`},m))})]}),l.jsxs("div",{className:"project-overlay__right",children:[l.jsxs("div",{ref:s,className:"overlay-panel",children:[l.jsxs("div",{className:"overlay-panel__header",children:[l.jsxs("span",{className:"overlay-panel__number",children:["0",i+1," / 0",X.length]}),l.jsx("h3",{className:"overlay-panel__title",children:h})]}),l.jsx("p",{className:"overlay-panel__body",children:x}),S==="impact"&&(e==null?void 0:e.metric)&&l.jsxs("div",{className:"overlay-metric",children:[l.jsx("span",{className:"overlay-metric__number",children:e.metric}),l.jsx("span",{className:"overlay-metric__desc",children:e.metricDesc})]})]}),l.jsxs("div",{className:"overlay-nav",children:[l.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--prev ${i===0?"disabled":""}`,onClick:d,disabled:i===0,"aria-label":"Previous panel",children:"←"}),l.jsx("span",{className:"overlay-nav__label",children:h}),l.jsx("button",{className:`overlay-nav__btn overlay-nav__btn--next ${i===X.length-1?"disabled":""}`,onClick:f,disabled:i===X.length-1,"aria-label":"Next panel",children:"→"})]})]})]})]})}const Jn=`// ── STAR FIELD VERTEX SHADER ──
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
`,es=`// ── STAR FIELD FRAGMENT SHADER ──

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
`;function ts({warpStrength:e,isMobile:t}){const n=t?1e3:3e3,s=u.useRef(),{positions:i,sizes:r,brightnesses:a,seeds:c}=u.useMemo(()=>{const f=new Float32Array(n*3),d=new Float32Array(n),g=new Float32Array(n),b=new Float32Array(n);for(let y=0;y<n;y++)f[y*3]=(Math.random()-.5)*300,f[y*3+1]=(Math.random()-.5)*300,f[y*3+2]=-30-Math.random()*200,d[y]=.5+Math.random()*2.5,g[y]=.3+Math.random()*.7,b[y]=Math.random();return{positions:f,sizes:d,brightnesses:g,seeds:b}},[n]),o=u.useMemo(()=>({uTime:{value:0},uWarpStrength:{value:0},uWarpSeed:{value:0}}),[]),p=u.useMemo(()=>new J({vertexShader:Jn,fragmentShader:es,uniforms:o,transparent:!0,blending:Fe,depthWrite:!1,vertexColors:!1}),[o]);return O(f=>{o.uTime.value=f.clock.elapsedTime,o.uWarpStrength.value+=(e-o.uWarpStrength.value)*.04}),l.jsx("points",{ref:s,material:p,children:l.jsxs("bufferGeometry",{children:[l.jsx("bufferAttribute",{attach:"attributes-position",count:n,array:i,itemSize:3}),l.jsx("bufferAttribute",{attach:"attributes-aSize",count:n,array:r,itemSize:1}),l.jsx("bufferAttribute",{attach:"attributes-aBrightness",count:n,array:a,itemSize:1}),l.jsx("bufferAttribute",{attach:"attributes-uWarpSeed",count:n,array:c,itemSize:1})]})})}function ns({visible:e,position:t}){const n=u.useRef();return O(s=>{if(!n.current||!e)return;const i=s.clock.elapsedTime;n.current.rotation.y+=.008,n.current.rotation.x=Math.sin(i*.4)*.06}),e?l.jsxs("mesh",{ref:n,position:t,children:[l.jsx("coneGeometry",{args:[.08,.25,8]}),l.jsx("meshStandardMaterial",{color:"#C9A84C",emissive:"#C9A84C",emissiveIntensity:.6,metalness:.9,roughness:.1})]}):null}function ss({path:e,visible:t,opacity:n}){const s=u.useRef(),i=u.useMemo(()=>{const a=[];for(let c=0;c<=50;c++)a.push(e.getPoint(c/50));return a},[e]),r=u.useMemo(()=>new be().setFromPoints(i),[i]);return O(()=>{s.current&&(s.current.opacity+=((t?n:0)-s.current.opacity)*.03)}),l.jsx("line",{geometry:r,children:l.jsx("lineBasicMaterial",{ref:s,color:"#C9A84C",transparent:!0,opacity:0,linewidth:1})})}const rs=new w(1,7,22),is=new w(1,.5,-21);function as({scrollProgress:e,currentProjectIndex:t,currentPhase:n}){const{camera:s}=z(),i=u.useRef(new w(0,0,-10)),r=u.useRef([]),a=u.useMemo(()=>new w,[]),c=u.useMemo(()=>new w,[]);return u.useEffect(()=>{const o=[];D.forEach((p,f)=>{const d=f>0?D[f-1].orbPosition:null;o.push(Ge(p,d))}),r.current=o},[]),O(()=>{if(r.current.length===0)return;const o=D.length,p=1/o,f=Math.min(Math.floor(e/p),o-1),d=(e-f*p)/p,g=r.current[f];if(g){if(g.getPoint(Math.min(d,.99),a),c.copy(D[f].orbPosition),f===o-1){const b=ut.smoothstep(d,F.INSIDE_END,.92);a.lerp(rs,b),c.lerp(is,b)}s.position.lerp(a,.08),i.current.lerp(c,.05),s.lookAt(i.current)}}),null}function os({phase:e,phaseProgress:t}){u.useRef({x:0,y:0});const n=u.useMemo(()=>new P(0,0),[]);return O(()=>{let s=0;e==="descent"&&(t<.5?s=t*2*.018:s=(1-t)*2*.018);const i=n.x,r=i+(s-i)*.15;n.set(r,r*.3)}),l.jsx(Rn,{children:l.jsx(Mn,{blendFunction:T.NORMAL,offset:n})})}function ls({project:e,visible:t,phaseProgress:n}){const s=t&&n>.1;return l.jsxs("div",{className:`orbit-meta ${s?"orbit-meta--visible":""}`,children:[l.jsxs("div",{className:"orbit-meta__number",style:{transitionDelay:"0ms"},children:["0",e.index+1]}),l.jsx("h2",{className:"orbit-meta__title",style:{transitionDelay:"80ms"},children:e.title}),l.jsx("p",{className:"orbit-meta__role",style:{transitionDelay:"160ms"},children:e.role}),l.jsx("p",{className:"orbit-meta__year",style:{transitionDelay:"240ms"},children:e.year}),l.jsx("div",{className:"orbit-meta__tags",style:{transitionDelay:"320ms"},children:e.tags.map(i=>l.jsx("span",{className:"orbit-tag",children:i},i))}),l.jsx("p",{className:"orbit-meta__pull-quote",style:{transitionDelay:"400ms"},children:e.pullQuote})]})}function cs({project:e,phase:t,phaseProgress:n}){const s=t==="inside",i=s&&n>.12,r=s&&n>.38,a=s&&n>.56,c=s&&n>.76,o=u.useMemo(()=>{if(!(e!=null&&e.metric))return"";const d=e.metric.replace(/[^\d.]/g,""),g=e.metric.replace(/[\d.]/g,"");return{digits:parseFloat(d),suffix:g}},[e]),[p,f]=u.useState(0);return u.useEffect(()=>{if(!a||!o.digits){f(0);return}let d=0;const g=performance.now(),b=1500,y=S=>{const h=Math.min((S-g)/b,1),x=1-Math.pow(1-h,3);f(Math.round(x*o.digits)),h<1&&(d=requestAnimationFrame(y))};return d=requestAnimationFrame(y),()=>cancelAnimationFrame(d)},[a,o]),l.jsxs("div",{className:"narrative-blocks",children:[l.jsx("div",{className:`narrative-block narrative-block--a ${i?"visible":""}`,children:e==null?void 0:e.verb}),l.jsx("div",{className:`narrative-block narrative-block--b ${r?"visible":""}`,children:e==null?void 0:e.challenge}),l.jsxs("div",{className:`narrative-block narrative-block--c ${a?"visible":""}`,children:[l.jsxs("span",{className:"narrative-metric",children:[p,o.suffix]}),l.jsx("span",{className:"narrative-metric-desc",children:e==null?void 0:e.metricDesc})]}),l.jsxs("div",{className:`narrative-block narrative-block--d ${c?"visible":""}`,children:['"',e==null?void 0:e.reflection,'"']})]})}function us({visible:e,onComplete:t}){const n=u.useRef(),s=u.useRef();return u.useEffect(()=>{if(!e||!n.current)return;const r=Array.from(n.current.querySelectorAll(".entry-title__letter"));ie.timeline({onComplete:t}).fromTo(r,{opacity:0,scale:.4,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:.06,stagger:{from:"center",amount:.8},ease:"power2.out"}).fromTo(s.current,{opacity:0,y:20},{opacity:1,y:0,duration:.8,ease:"power2.out"},"-=0.3").to([n.current,s.current],{delay:1.2,opacity:0,filter:"blur(8px)",y:-20,scale:1.05,duration:.6,stagger:.1,ease:"power3.in"})},[e,t]),e?l.jsxs("div",{className:"entry-title-container",children:[l.jsx("h1",{ref:n,className:"entry-title",children:"THE CARTOGRAPHY".split("").map((r,a)=>l.jsx("span",{className:"entry-title__letter",children:r===" "?" ":r},a))}),l.jsx("p",{ref:s,className:"entry-subtitle",children:"WORLDS I HAVE BUILT."})]}):null}function fs({scrollProgress:e,projectIndex:t,phase:n,totalProjects:s}){const i=e,r=n==="inside"||n==="descent",a=n==="escape"&&t<s-1,c=D[t+1];return l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:`cartography-realm-label ${r?"dimmed":""}`,children:[l.jsx("div",{className:"realm-label__title",children:"THE CARTOGRAPHY"}),l.jsxs("div",{className:"realm-label__world",children:["WORLD ",t+1," / ",s]})]}),l.jsxs("div",{className:"cartography-progress-bar",children:[l.jsx("span",{className:"progress-label progress-label--top",children:"START"}),l.jsx("div",{className:"progress-track",children:l.jsx("div",{className:"progress-dot",style:{top:`${i*100}%`}})}),l.jsx("span",{className:"progress-label progress-label--bottom",children:"END"})]}),l.jsxs("div",{className:`scroll-hint-container ${["orbit","escape"].includes(n)?"visible":""}`,children:[l.jsx("div",{className:`transit-caption ${a?"visible":""}`,children:a&&c&&`PROJECT ${t+1} OF ${s} — ${c.title} AHEAD`}),l.jsxs("div",{className:"scroll-hint",children:[l.jsx("span",{children:n==="orbit"?"SCROLL TO DESCEND":"SCROLL TO CONTINUE"}),l.jsx("div",{className:"scroll-hint__arrow"})]})]})]})}function ds({scrollProgress:e,phase:t,phaseProgress:n,projectIndex:s,warpActive:i,finalMap:r,showSpacecraft:a,onReadMore:c,isMobile:o,mouseNDC:p}){var g;const f=s===D.length-1&&t==="escape",d=u.useMemo(()=>D.map((b,y)=>{const S=y>0?D[y-1].orbPosition:null;return Ge(b,S)}),[]);return l.jsxs(l.Fragment,{children:[l.jsx(gt,{makeDefault:!0,position:[0,2,50],fov:55}),l.jsx(as,{scrollProgress:e,currentProjectIndex:s,currentPhase:t}),l.jsx(ts,{warpStrength:i?1:0,isMobile:o}),l.jsx("fog",{attach:"fog",color:"#02040A",near:40,far:120}),l.jsx("ambientLight",{intensity:.08}),l.jsx("pointLight",{position:[0,30,-20],intensity:.5,color:"#3366ff"}),D.map((b,y)=>l.jsx(Gn,{project:b,phase:y===s?t:"idle",activePhase:f?"escape":t,phaseProgress:y===s?n:0,mouseNDC:p,isActive:y===s,isMobile:o},b.id)),l.jsx(Kn,{project:D[s],phase:f?"idle":t,phaseProgress:n,onReadMore:c}),r&&d.map((b,y)=>l.jsx(ss,{path:b,visible:r,opacity:.5},y)),l.jsx(ns,{visible:r||e<.05,position:r?new w(12,4,-15):(g=D[s])==null?void 0:g.orbPosition.clone().add(new w(6,2,8))}),!o&&l.jsx(os,{phase:t,phaseProgress:n})]})}function gs(){const e=u.useRef(null),t=lt(C=>C.performanceLow),[n,s]=u.useState(0),[i,r]=u.useState("approach"),[a,c]=u.useState(0),[o,p]=u.useState(0),[f,d]=u.useState(0),[g,b]=u.useState(!1),[y,S]=u.useState(!1),[h,x]=u.useState(!1),[v,m]=u.useState(!1),[R,N]=u.useState(null),V=u.useRef({x:0,y:0}).current;Nn({phase:i,projectIndex:o,phaseProgress:a,zoneProgress:f}),u.useEffect(()=>{const C=B=>{V.x=B.clientX/window.innerWidth*2-1,V.y=-(B.clientY/window.innerHeight*2-1)};return window.addEventListener("mousemove",C,{passive:!0}),()=>window.removeEventListener("mousemove",C)},[]),u.useEffect(()=>{if(!e.current)return;const C=ct.create({trigger:e.current,start:"top top",end:"bottom bottom",scrub:1.5,onEnter:()=>b(!0),onUpdate:A=>{const I=A.progress;s(I);const{projectIndex:$,phase:ee,phaseProgress:ce,zoneProgress:te}=Pn(I,D.length);p($),r(ee),c(ce),d(te),m(ee==="escape"),x(I>.97)}}),B=requestAnimationFrame(()=>{var A,I;C.refresh(),(I=(A=C.vars).onUpdate)==null||I.call(A,C)});return()=>{cancelAnimationFrame(B),C.kill()}},[]);const le=u.useCallback(()=>{N(D[o])},[o]),L=u.useCallback(()=>{N(null)},[]);return l.jsx("div",{ref:e,className:"cartography-scroll-space",children:l.jsxs("div",{className:"cartography-sticky",children:[l.jsx(ft,{gl:{antialias:!t,alpha:!1},maxDpr:t?1:1.5,style:{position:"absolute",inset:0,background:"#02040A"},children:l.jsx(ds,{scrollProgress:n,phase:i,phaseProgress:a,projectIndex:o,warpActive:v,finalMap:h,showSpacecraft:!0,onReadMore:le,isMobile:t,mouseNDC:V})}),g&&!y&&l.jsx(us,{visible:g,onComplete:()=>S(!0)}),l.jsx(ls,{project:D[o],visible:i==="orbit",phaseProgress:a}),l.jsx(cs,{project:D[o],phase:i,phaseProgress:a}),h&&l.jsx("div",{className:"final-map-text",children:"EVERY WORLD BEGAN AS AN EMPTY CANVAS."}),l.jsx(fs,{scrollProgress:n,projectIndex:o,phase:i,totalProjects:D.length}),R&&l.jsx(Zn,{project:R,onClose:L})]})})}export{gs as default};
