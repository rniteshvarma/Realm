import{af as ue,f as ce,V as E,ab as he,ac as g,a0 as X,ak as re,a1 as q,a8 as fe,aq as me,B as ne,n as Q,M as ve,k as de,r as n,am as pe,d as O,H as xe,b as j,an as Z,ai as ee,ag as ge,Y as Me,ar as ye,as as Se,a as I,u as we,S as Te,j as t,C as _e,D as be,c as De,E as Ue,g as P}from"./index-C6A6qjDW.js";import{a as Be}from"./SFXLibrary-6BG-H-NV.js";import{v as Y}from"./iridescent.vert-ClrsAcLs.js";import{P as Ce}from"./PerspectiveCamera-CBY1_SN-.js";import{_ as Re}from"./Fbo-CHV-28Jx.js";import{T as G}from"./Text-Dun43wfy.js";const Fe=()=>parseInt(ue.replace(/\D+/g,"")),je=Fe();class Ee extends ce{constructor(e=new E){super({uniforms:{inputBuffer:new g(null),depthBuffer:new g(null),resolution:new g(new E),texelSize:new g(new E),halfTexelSize:new g(new E),kernel:new g(0),scale:new g(1),cameraNear:new g(0),cameraFar:new g(1),minDepthThreshold:new g(0),maxDepthThreshold:new g(1),depthScale:new g(0),depthToBlurRatioBias:new g(.25)},fragmentShader:`#include <common>
        #include <dithering_pars_fragment>      
        uniform sampler2D inputBuffer;
        uniform sampler2D depthBuffer;
        uniform float cameraNear;
        uniform float cameraFar;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          float depthFactor = 0.0;
          
          #ifdef USE_DEPTH
            vec4 depth = texture2D(depthBuffer, vUv);
            depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
            depthFactor *= depthScale;
            depthFactor = max(0.0, min(1.0, depthFactor + 0.25));
          #endif
          
          vec4 sum = texture2D(inputBuffer, mix(vUv0, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv1, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv2, vUv, depthFactor));
          sum += texture2D(inputBuffer, mix(vUv3, vUv, depthFactor));
          gl_FragColor = sum * 0.25 ;

          #include <dithering_fragment>
          #include <tonemapping_fragment>
          #include <${je>=154?"colorspace_fragment":"encodings_fragment"}>
        }`,vertexShader:`uniform vec2 texelSize;
        uniform vec2 halfTexelSize;
        uniform float kernel;
        uniform float scale;
        varying vec2 vUv;
        varying vec2 vUv0;
        varying vec2 vUv1;
        varying vec2 vUv2;
        varying vec2 vUv3;

        void main() {
          vec2 uv = position.xy * 0.5 + 0.5;
          vUv = uv;

          vec2 dUv = (texelSize * vec2(kernel) + halfTexelSize) * scale;
          vUv0 = vec2(uv.x - dUv.x, uv.y + dUv.y);
          vUv1 = vec2(uv.x + dUv.x, uv.y + dUv.y);
          vUv2 = vec2(uv.x + dUv.x, uv.y - dUv.y);
          vUv3 = vec2(uv.x - dUv.x, uv.y - dUv.y);

          gl_Position = vec4(position.xy, 1.0, 1.0);
        }`,blending:he,depthWrite:!1,depthTest:!1}),this.toneMapped=!1,this.setTexelSize(e.x,e.y),this.kernel=new Float32Array([0,1,2,2,3])}setTexelSize(e,o){this.uniforms.texelSize.value.set(e,o),this.uniforms.halfTexelSize.value.set(e,o).multiplyScalar(.5)}setResolution(e){this.uniforms.resolution.value.copy(e)}}class Pe{constructor({gl:e,resolution:o,width:i=500,height:f=500,minDepthThreshold:a=0,maxDepthThreshold:s=1,depthScale:r=0,depthToBlurRatioBias:l=.25}){this.renderToScreen=!1,this.renderTargetA=new X(o,o,{minFilter:q,magFilter:q,stencilBuffer:!1,depthBuffer:!1,type:re}),this.renderTargetB=this.renderTargetA.clone(),this.convolutionMaterial=new Ee,this.convolutionMaterial.setTexelSize(1/i,1/f),this.convolutionMaterial.setResolution(new E(i,f)),this.scene=new fe,this.camera=new me,this.convolutionMaterial.uniforms.minDepthThreshold.value=a,this.convolutionMaterial.uniforms.maxDepthThreshold.value=s,this.convolutionMaterial.uniforms.depthScale.value=r,this.convolutionMaterial.uniforms.depthToBlurRatioBias.value=l,this.convolutionMaterial.defines.USE_DEPTH=r>0;const c=new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),v=new Float32Array([0,0,2,0,0,2]),d=new ne;d.setAttribute("position",new Q(c,3)),d.setAttribute("uv",new Q(v,2)),this.screen=new ve(d,this.convolutionMaterial),this.screen.frustumCulled=!1,this.scene.add(this.screen)}render(e,o,i){const f=this.scene,a=this.camera,s=this.renderTargetA,r=this.renderTargetB;let l=this.convolutionMaterial,c=l.uniforms;c.depthBuffer.value=o.depthTexture;const v=l.kernel;let d=o,M,p,_;for(p=0,_=v.length-1;p<_;++p)M=p&1?r:s,c.kernel.value=v[p],c.inputBuffer.value=d.texture,e.setRenderTarget(M),e.render(f,a),d=M;c.kernel.value=v[p],c.inputBuffer.value=d.texture,e.setRenderTarget(this.renderToScreen?null:i),e.render(f,a)}}class Ae extends de{constructor(e={}){super(e),this._tDepth={value:null},this._distortionMap={value:null},this._tDiffuse={value:null},this._tDiffuseBlur={value:null},this._textureMatrix={value:null},this._hasBlur={value:!1},this._mirror={value:0},this._mixBlur={value:0},this._blurStrength={value:.5},this._minDepthThreshold={value:.9},this._maxDepthThreshold={value:1},this._depthScale={value:0},this._depthToBlurRatioBias={value:.25},this._distortion={value:1},this._mixContrast={value:1},this.setValues(e)}onBeforeCompile(e){var o;(o=e.defines)!=null&&o.USE_UV||(e.defines.USE_UV=""),e.uniforms.hasBlur=this._hasBlur,e.uniforms.tDiffuse=this._tDiffuse,e.uniforms.tDepth=this._tDepth,e.uniforms.distortionMap=this._distortionMap,e.uniforms.tDiffuseBlur=this._tDiffuseBlur,e.uniforms.textureMatrix=this._textureMatrix,e.uniforms.mirror=this._mirror,e.uniforms.mixBlur=this._mixBlur,e.uniforms.mixStrength=this._blurStrength,e.uniforms.minDepthThreshold=this._minDepthThreshold,e.uniforms.maxDepthThreshold=this._maxDepthThreshold,e.uniforms.depthScale=this._depthScale,e.uniforms.depthToBlurRatioBias=this._depthToBlurRatioBias,e.uniforms.distortion=this._distortion,e.uniforms.mixContrast=this._mixContrast,e.vertexShader=`
        uniform mat4 textureMatrix;
        varying vec4 my_vUv;
      ${e.vertexShader}`,e.vertexShader=e.vertexShader.replace("#include <project_vertex>",`#include <project_vertex>
        my_vUv = textureMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`),e.fragmentShader=`
        uniform sampler2D tDiffuse;
        uniform sampler2D tDiffuseBlur;
        uniform sampler2D tDepth;
        uniform sampler2D distortionMap;
        uniform float distortion;
        uniform float cameraNear;
			  uniform float cameraFar;
        uniform bool hasBlur;
        uniform float mixBlur;
        uniform float mirror;
        uniform float mixStrength;
        uniform float minDepthThreshold;
        uniform float maxDepthThreshold;
        uniform float mixContrast;
        uniform float depthScale;
        uniform float depthToBlurRatioBias;
        varying vec4 my_vUv;
        ${e.fragmentShader}`,e.fragmentShader=e.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>

      float distortionFactor = 0.0;
      #ifdef USE_DISTORTION
        distortionFactor = texture2D(distortionMap, vUv).r * distortion;
      #endif

      vec4 new_vUv = my_vUv;
      new_vUv.x += distortionFactor;
      new_vUv.y += distortionFactor;

      vec4 base = texture2DProj(tDiffuse, new_vUv);
      vec4 blur = texture2DProj(tDiffuseBlur, new_vUv);

      vec4 merge = base;

      #ifdef USE_NORMALMAP
        vec2 normal_uv = vec2(0.0);
        vec4 normalColor = texture2D(normalMap, vUv * normalScale);
        vec3 my_normal = normalize( vec3( normalColor.r * 2.0 - 1.0, normalColor.b,  normalColor.g * 2.0 - 1.0 ) );
        vec3 coord = new_vUv.xyz / new_vUv.w;
        normal_uv = coord.xy + coord.z * my_normal.xz * 0.05;
        vec4 base_normal = texture2D(tDiffuse, normal_uv);
        vec4 blur_normal = texture2D(tDiffuseBlur, normal_uv);
        merge = base_normal;
        blur = blur_normal;
      #endif

      float depthFactor = 0.0001;
      float blurFactor = 0.0;

      #ifdef USE_DEPTH
        vec4 depth = texture2DProj(tDepth, new_vUv);
        depthFactor = smoothstep(minDepthThreshold, maxDepthThreshold, 1.0-(depth.r * depth.a));
        depthFactor *= depthScale;
        depthFactor = max(0.0001, min(1.0, depthFactor));

        #ifdef USE_BLUR
          blur = blur * min(1.0, depthFactor + depthToBlurRatioBias);
          merge = merge * min(1.0, depthFactor + 0.5);
        #else
          merge = merge * depthFactor;
        #endif

      #endif

      float reflectorRoughnessFactor = roughness;
      #ifdef USE_ROUGHNESSMAP
        vec4 reflectorTexelRoughness = texture2D( roughnessMap, vUv );
        reflectorRoughnessFactor *= reflectorTexelRoughness.g;
      #endif

      #ifdef USE_BLUR
        blurFactor = min(1.0, mixBlur * reflectorRoughnessFactor);
        merge = mix(merge, blur, blurFactor);
      #endif

      vec4 newMerge = vec4(0.0, 0.0, 0.0, 1.0);
      newMerge.r = (merge.r - 0.5) * mixContrast + 0.5;
      newMerge.g = (merge.g - 0.5) * mixContrast + 0.5;
      newMerge.b = (merge.b - 0.5) * mixContrast + 0.5;

      diffuseColor.rgb = diffuseColor.rgb * ((1.0 - min(1.0, mirror)) + newMerge.rgb * mixStrength);
      `)}get tDiffuse(){return this._tDiffuse.value}set tDiffuse(e){this._tDiffuse.value=e}get tDepth(){return this._tDepth.value}set tDepth(e){this._tDepth.value=e}get distortionMap(){return this._distortionMap.value}set distortionMap(e){this._distortionMap.value=e}get tDiffuseBlur(){return this._tDiffuseBlur.value}set tDiffuseBlur(e){this._tDiffuseBlur.value=e}get textureMatrix(){return this._textureMatrix.value}set textureMatrix(e){this._textureMatrix.value=e}get hasBlur(){return this._hasBlur.value}set hasBlur(e){this._hasBlur.value=e}get mirror(){return this._mirror.value}set mirror(e){this._mirror.value=e}get mixBlur(){return this._mixBlur.value}set mixBlur(e){this._mixBlur.value=e}get mixStrength(){return this._blurStrength.value}set mixStrength(e){this._blurStrength.value=e}get minDepthThreshold(){return this._minDepthThreshold.value}set minDepthThreshold(e){this._minDepthThreshold.value=e}get maxDepthThreshold(){return this._maxDepthThreshold.value}set maxDepthThreshold(e){this._maxDepthThreshold.value=e}get depthScale(){return this._depthScale.value}set depthScale(e){this._depthScale.value=e}get depthToBlurRatioBias(){return this._depthToBlurRatioBias.value}set depthToBlurRatioBias(e){this._depthToBlurRatioBias.value=e}get distortion(){return this._distortion.value}set distortion(e){this._distortion.value=e}get mixContrast(){return this._mixContrast.value}set mixContrast(e){this._mixContrast.value=e}}const Ne=n.forwardRef(({mixBlur:u=0,mixStrength:e=.5,resolution:o=256,blur:i=[0,0],args:f=[1,1],minDepthThreshold:a=.9,maxDepthThreshold:s=1,depthScale:r=0,depthToBlurRatioBias:l=.25,mirror:c=0,children:v,debug:d=0,distortion:M=1,mixContrast:p=1,distortionMap:_,...U},B)=>{pe({MeshReflectorMaterial:Ae}),n.useEffect(()=>{console.warn("Reflector has been deprecated and will be removed next major. Replace it with <MeshReflectorMaterial />!")},[]);const m=O(({gl:h})=>h),b=O(({camera:h})=>h),z=O(({scene:h})=>h);i=Array.isArray(i)?i:[i,i];const H=i[0]+i[1]>0,S=n.useRef(null);n.useImperativeHandle(B,()=>S.current,[]);const[C]=n.useState(()=>new xe),[D]=n.useState(()=>new j),[R]=n.useState(()=>new j),[V]=n.useState(()=>new j),[A]=n.useState(()=>new Z),[L]=n.useState(()=>new j(0,0,-1)),[w]=n.useState(()=>new ee),[N]=n.useState(()=>new j),[W]=n.useState(()=>new j),[k]=n.useState(()=>new ee),[F]=n.useState(()=>new Z),[x]=n.useState(()=>new ge),oe=n.useCallback(()=>{if(R.setFromMatrixPosition(S.current.matrixWorld),V.setFromMatrixPosition(b.matrixWorld),A.extractRotation(S.current.matrixWorld),D.set(0,0,1),D.applyMatrix4(A),N.subVectors(R,V),N.dot(D)>0)return;N.reflect(D).negate(),N.add(R),A.extractRotation(b.matrixWorld),L.set(0,0,-1),L.applyMatrix4(A),L.add(V),W.subVectors(R,L),W.reflect(D).negate(),W.add(R),x.position.copy(N),x.up.set(0,1,0),x.up.applyMatrix4(A),x.up.reflect(D),x.lookAt(W),x.far=b.far,x.updateMatrixWorld(),x.projectionMatrix.copy(b.projectionMatrix),F.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),F.multiply(x.projectionMatrix),F.multiply(x.matrixWorldInverse),F.multiply(S.current.matrixWorld),C.setFromNormalAndCoplanarPoint(D,R),C.applyMatrix4(x.matrixWorldInverse),w.set(C.normal.x,C.normal.y,C.normal.z,C.constant);const h=x.projectionMatrix;k.x=(Math.sign(w.x)+h.elements[8])/h.elements[0],k.y=(Math.sign(w.y)+h.elements[9])/h.elements[5],k.z=-1,k.w=(1+h.elements[10])/h.elements[14],w.multiplyScalar(2/w.dot(k)),h.elements[2]=w.x,h.elements[6]=w.y,h.elements[10]=w.z+1,h.elements[14]=w.w},[]),[$,ae,ie,K]=n.useMemo(()=>{const h={type:re,minFilter:q,magFilter:q},T=new X(o,o,h);T.depthBuffer=!0,T.depthTexture=new Me(o,o),T.depthTexture.format=ye,T.depthTexture.type=Se;const J=new X(o,o,h),se=new Pe({gl:m,resolution:o,width:i[0],height:i[1],minDepthThreshold:a,maxDepthThreshold:s,depthScale:r,depthToBlurRatioBias:l}),le={mirror:c,textureMatrix:F,mixBlur:u,tDiffuse:T.texture,tDepth:T.depthTexture,tDiffuseBlur:J.texture,hasBlur:H,mixStrength:e,minDepthThreshold:a,maxDepthThreshold:s,depthScale:r,depthToBlurRatioBias:l,transparent:!0,debug:d,distortion:M,distortionMap:_,mixContrast:p,"defines-USE_BLUR":H?"":void 0,"defines-USE_DEPTH":r>0?"":void 0,"defines-USE_DISTORTION":_?"":void 0};return[T,J,se,le]},[m,i,F,o,c,H,u,e,a,s,r,l,d,M,_,p]);return I(()=>{if(!(S!=null&&S.current))return;S.current.visible=!1;const h=m.xr.enabled,T=m.shadowMap.autoUpdate;oe(),m.xr.enabled=!1,m.shadowMap.autoUpdate=!1,m.setRenderTarget($),m.state.buffers.depth.setMask(!0),m.autoClear||m.clear(),m.render(z,x),H&&ie.render(m,$,ae),m.xr.enabled=h,m.shadowMap.autoUpdate=T,S.current.visible=!0,m.setRenderTarget(null)}),n.createElement("mesh",Re({ref:S},U),n.createElement("planeGeometry",{args:f}),v?v("meshReflectorMaterial",K):n.createElement("meshReflectorMaterial",K))}),te=`// runeEtching.glsl — Myth Engine monolith surfaces
// Moving rune/circuit patterns illuminating from within, like light engraving

uniform float uTime;
uniform float uGlow;     // 0-1, increases when monolith is active
uniform vec3 uRuneColor; // gold or teal depending on monolith

varying vec2 vUv;

// Simple hash for pseudo-random circuit patterns
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// Circuit line pattern
float circuit(vec2 uv, float scale) {
  uv *= scale;
  vec2 id = floor(uv);
  vec2 gv = fract(uv);
  
  float h = hash(id);
  float h2 = hash(id + vec2(1.0, 0.0));
  float h3 = hash(id + vec2(0.0, 1.0));
  
  // Horizontal lines
  float hLine = smoothstep(0.02, 0.0, abs(gv.y - 0.5)) * step(h, 0.6);
  // Vertical lines
  float vLine = smoothstep(0.02, 0.0, abs(gv.x - 0.5)) * step(h2, 0.5);
  // Node dots at junctions
  float node = smoothstep(0.08, 0.0, length(gv - 0.5)) * step(h3, 0.3);
  
  return max(max(hLine, vLine), node);
}

// Rune-like shapes
float rune(vec2 uv) {
  // Scrolling rune field
  uv.y -= uTime * 0.08;
  uv.x += sin(uv.y * 3.0) * 0.02;
  
  float c1 = circuit(uv, 8.0);
  float c2 = circuit(uv * 1.3 + vec2(2.7, 1.1), 5.0) * 0.6;
  float c3 = circuit(uv * 0.7 + vec2(0.4, 2.3), 12.0) * 0.4;
  
  return max(max(c1, c2), c3);
}

void main() {
  vec2 uv = vUv;
  
  float runePattern = rune(uv);
  
  // Active glow pulse
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  float intensity = runePattern * (0.3 + uGlow * 0.7 + pulse * uGlow * 0.3);
  
  // Base: dark obsidian
  vec3 base = vec3(0.02, 0.02, 0.025);
  vec3 color = base + uRuneColor * intensity;
  
  // Edge rim light
  float rim = (1.0 - smoothstep(0.0, 0.08, uv.x)) +
              (1.0 - smoothstep(0.92, 1.0, uv.x)) +
              (1.0 - smoothstep(0.0, 0.05, uv.y)) +
              (1.0 - smoothstep(0.95, 1.0, uv.y));
  color += uRuneColor * rim * 0.08 * (uGlow + 0.2);
  
  gl_FragColor = vec4(color, 1.0);
}
`,ke=`// aurora.glsl — Myth Engine ceiling
// Flowing curtains of violet, gold, and teal light (vertex shader noise)

uniform float uTime;
uniform vec2 uResolution;

varying vec2 vUv;

// Smooth noise
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = fract(sin(dot(i,             vec2(127.1,311.7))) * 43758.5);
  float b = fract(sin(dot(i + vec2(1,0), vec2(127.1,311.7))) * 43758.5);
  float c = fract(sin(dot(i + vec2(0,1), vec2(127.1,311.7))) * 43758.5);
  float d = fract(sin(dot(i + vec2(1,1), vec2(127.1,311.7))) * 43758.5);
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  
  // Time-driven flow
  float t = uTime * 0.3;
  
  // Aurora curtain shape — vertical bands flowing horizontally
  float curtain = fbm(vec2(uv.x * 3.0 + t * 0.5, uv.y * 0.5));
  curtain += fbm(vec2(uv.x * 2.0 - t * 0.3, uv.y * 1.0 + t * 0.1)) * 0.5;
  
  // Fade at edges (curtain hangs from top)
  float fade = smoothstep(1.0, 0.3, uv.y) * smoothstep(0.0, 0.1, uv.y);
  curtain *= fade;
  
  // Three aurora colors
  vec3 violet = vec3(0.706, 0.310, 0.910);   // #B44FE8
  vec3 gold   = vec3(0.788, 0.659, 0.298);   // #C9A84C  
  vec3 teal   = vec3(0.310, 0.671, 0.910);   // #4FABE8
  
  // Horizontal color shift based on noise patterns
  float band1 = fbm(vec2(uv.x * 2.0, t));
  float band2 = fbm(vec2(uv.x * 1.5 + 1.7, t * 0.7));
  
  vec3 color = mix(violet, teal, band1);
  color = mix(color, gold, band2 * 0.4);
  color *= curtain * 1.5;
  
  // Very dark base
  vec3 dark = vec3(0.0, 0.0, 0.01);
  color = mix(dark, color, curtain);
  
  gl_FragColor = vec4(color, curtain + 0.02);
}
`,y=[{title:"Dieter Rams",quote:'"Good design is as little design as possible."',sub:"Pioneered functional beauty. Showed me restraint is a power, not a limitation."},{title:"The Matrix (1999)",quote:'"There is no spoon."',sub:"A world inside a machine. Made me ask what reality a designer constructs."},{title:"Naoki Urasawa",quote:'"Tension lives in the pause."',sub:"Taught me that silence, white space, and waiting are narrative tools."},{title:"Brutalist Architecture",quote:'"Truth to materials."',sub:"Honesty of structure. What you see IS what holds it together."},{title:"Richard Feynman",quote:`"If you can't explain it simply, you don't understand it."`,sub:"Clarity as the ultimate form of intelligence."},{title:"Hayao Miyazaki",quote:'"Always remember to breathe."',sub:"Showed me that wonder is a design principle. The world can always feel alive."},{title:"Paul Graham",quote:'"Make something people want."',sub:"Stripped away vanity. Reminded me that the user is the only audience."},{title:"My Own Curiosity",quote:'"What if?"',sub:"The question that started every project worth making."}];function Ie({influence:u,angle:e,radius:o,isActive:i,onClick:f}){const a=n.useRef(),s=n.useRef();n.useRef();const[r,l]=n.useState(!1),[c,v]=[n.useRef(),n.useRef()],d=n.useMemo(()=>({uTime:{value:0},uGlow:{value:0},uRuneColor:{value:new De("#C9A84C")}}),[]),M=Math.sin(e)*o,p=Math.cos(e)*o;I(U=>{if(!s.current)return;s.current.uniforms.uTime.value=U.clock.elapsedTime;const B=i?1:0;s.current.uniforms.uGlow.value+=(B-s.current.uniforms.uGlow.value)*.06,a.current&&a.current.lookAt(0,a.current.position.y,0)});const _=U=>{var B,m;U.stopPropagation(),!(U.delta>2)&&(r||(l(!0),f(),P.to((B=c.current)==null?void 0:B.position,{x:-1.2,duration:.6,ease:"power2.out"}),P.to((m=v.current)==null?void 0:m.position,{x:1.2,duration:.6,ease:"power2.out"}),setTimeout(()=>{var b,z;l(!1),P.to((b=c.current)==null?void 0:b.position,{x:0,duration:.5,ease:"back.out(1.5)"}),P.to((z=v.current)==null?void 0:z.position,{x:0,duration:.5,ease:"back.out(1.5)"})},3e3)))};return t.jsxs("group",{ref:a,position:[M,0,p],onClick:_,children:[t.jsx("group",{ref:c,position:[0,0,0],children:t.jsxs("mesh",{position:[-.5,0,0],children:[t.jsx("boxGeometry",{args:[1,8,.6]}),t.jsx("shaderMaterial",{ref:s,vertexShader:Y,fragmentShader:te,uniforms:d})]})}),t.jsx("group",{ref:v,position:[0,0,0],children:t.jsxs("mesh",{position:[.5,0,0],children:[t.jsx("boxGeometry",{args:[1,8,.6]}),t.jsx("shaderMaterial",{vertexShader:Y,fragmentShader:te,uniforms:d})]})}),i&&t.jsx(G,{position:[0,-5,.5],fontSize:.3,color:"#C9A84C",anchorX:"center",maxWidth:4,textAlign:"center",children:u.title})]})}function ze({onClickCube:u}){const e=n.useRef(),[o,i]=n.useState(!1);I(a=>{e.current&&(e.current.rotation.y+=.003,e.current.rotation.x+=.001,e.current.rotation.z+=.0015)});const f=n.useMemo(()=>{const s=[];for(let r=0;r<6;r++){const l=r/6*Math.PI*2,c=(r+1)/6*Math.PI*2;s.push([2*Math.cos(l),2*Math.sin(l),0,2*Math.cos(c),2*Math.sin(c),0])}for(let r=0;r<6;r++){const l=r/6*Math.PI*2;s.push([0,0,0,2*Math.cos(l),2*Math.sin(l),0])}for(let r=0;r<3;r++){const l=r/3*Math.PI*2,c=(r+1)/3*Math.PI*2;s.push([2*Math.cos(l),2*Math.sin(l),0,2*Math.cos(c),2*Math.sin(c),0])}for(let r=0;r<3;r++){const l=r/3*Math.PI*2+Math.PI/3,c=(r+1)/3*Math.PI*2+Math.PI/3;s.push([2*Math.cos(l),2*Math.sin(l),0,2*Math.cos(c),2*Math.sin(c),0])}return s},[]);return t.jsx("group",{ref:e,position:[0,1,0],onPointerOver:a=>{a.stopPropagation(),i(!0)},onPointerOut:a=>{a.stopPropagation(),i(!1)},onClick:a=>{a.stopPropagation(),!(a.delta>2)&&u()},children:f.map((a,s)=>{const r=new ne;return r.setAttribute("position",new Ue([a[0],a[1],a[2],a[3],a[4],a[5]],3)),t.jsx("line",{geometry:r,children:t.jsx("lineBasicMaterial",{color:o?"#FFFFFF":"#C9A84C",linewidth:o?2:1})},s)})})}function He(){const u=n.useRef(),e=n.useMemo(()=>({uTime:{value:0},uResolution:{value:new E(window.innerWidth,window.innerHeight)}}),[]);return I(o=>{u.current&&(u.current.uniforms.uTime.value=o.clock.elapsedTime)}),t.jsxs("mesh",{position:[0,20,0],rotation:[Math.PI/2,0,0],children:[t.jsx("planeGeometry",{args:[120,120,1,1]}),t.jsx("shaderMaterial",{ref:u,vertexShader:Y,fragmentShader:ke,uniforms:e,transparent:!0,side:be})]})}function Le({visible:u}){const e=n.useRef();return n.useRef(),n.useEffect(()=>{e.current&&(u?P.fromTo(e.current.position,{y:-10},{y:0,duration:1.2,ease:"power2.out"}):e.current.position.y>-9&&P.to(e.current.position,{y:-12,duration:1.5,ease:"power2.in"}))},[u]),t.jsxs("group",{ref:e,position:[0,-12,0],children:[t.jsxs("mesh",{children:[t.jsx("boxGeometry",{args:[2,8,.8]}),t.jsx("meshStandardMaterial",{metalness:1,roughness:0,color:"#888",envMapIntensity:3})]}),u&&t.jsxs(t.Fragment,{children:[t.jsx(G,{position:[0,2,.5],fontSize:.4,color:"#FFFFFF",anchorX:"center",children:"NITESH VARMA"}),t.jsx(G,{position:[0,1.2,.5],fontSize:.25,color:"#C9A84C",anchorX:"center",children:"THE NINTH INFLUENCE"}),t.jsx(G,{position:[0,.4,.5],fontSize:.2,color:"rgba(240,240,240,0.5)",anchorX:"center",maxWidth:3,textAlign:"center",children:`YOU BECAME
WHAT YOU CONSUMED.`})]})]})}function We({scrollProgress:u}){const{camera:e}=O(),o=14;return I(()=>{const i=u*Math.PI*2,f=Math.sin(i)*o,a=Math.cos(i)*o;e.position.x+=(f-e.position.x)*.05,e.position.z+=(a-e.position.z)*.05,e.position.y+=(2-e.position.y)*.05,e.lookAt(0,1,0)}),null}function Oe({scrollProgress:u,activeMonolith:e,onMonolithClick:o,ninthVisible:i,onCubeClick:f}){const a=Math.floor(u*y.length)%y.length;return t.jsxs(t.Fragment,{children:[t.jsx(Ce,{makeDefault:!0,position:[0,2,14],fov:65}),t.jsx(We,{scrollProgress:u}),t.jsx("ambientLight",{intensity:.1,color:"#0D1B2A"}),t.jsx("pointLight",{position:[0,10,0],color:"#C9A84C",intensity:2}),t.jsx("spotLight",{position:[0,20,0],angle:.8,penumbra:.5,intensity:1,color:"#B44FE8"}),t.jsx("fog",{attach:"fog",color:"#010208",near:20,far:80}),t.jsx(He,{}),t.jsx(Ne,{position:[0,-4,0],rotation:[-Math.PI/2,0,0],args:[80,80],mirror:.7,mixBlur:4,mixStrength:1,blur:[300,100],children:(s,r)=>t.jsx(s,{color:"#050505",metalness:.9,roughness:.1,...r})}),y.map((s,r)=>t.jsx(Ie,{influence:s,angle:r/y.length*Math.PI*2,radius:10,isActive:r===a,onClick:()=>o(r)},r)),t.jsx(ze,{onClickCube:f}),t.jsx(Le,{visible:i})]})}function Ke(){const u=n.useRef(null),[e,o]=n.useState(0),[i,f]=n.useState(null),[a,s]=n.useState(!1),r=we(M=>M.discoverEgg),l=n.useRef(!1);n.useEffect(()=>{const M=Te.create({trigger:u.current,start:"top top",end:"+=400vh",pin:!0,scrub:1.5,onUpdate:p=>o(p.progress)});return()=>M.kill()},[]);const c=()=>{l.current||(l.current=!0,r("ninth-stone"),Be()),s(!0),setTimeout(()=>s(!1),5500)},v=Math.floor(e*y.length)%y.length,d=y[v];return t.jsxs("div",{className:"myth-engine",ref:u,children:[t.jsxs("div",{className:"myth-header",children:[t.jsx("span",{className:"myth-label",children:"VII — MYTH ENGINE"}),t.jsx("span",{className:"myth-sub",children:"INFLUENCES / DNA / WHAT MADE ME"})]}),t.jsx(_e,{gl:{antialias:!0,alpha:!1},dpr:[1,1.5],style:{position:"absolute",inset:0},children:t.jsx(Oe,{scrollProgress:e,activeMonolith:i,onMonolithClick:f,ninthVisible:a,onCubeClick:c})}),i!==null&&t.jsx("div",{className:"myth-detail-card",onClick:()=>f(null),children:t.jsxs("div",{className:"myth-card-inner",children:[t.jsx("button",{className:"myth-card-close",children:"✕"}),t.jsx("h3",{className:"myth-card-title",children:y[i].title}),t.jsx("blockquote",{className:"myth-card-quote",children:y[i].quote}),t.jsx("p",{className:"myth-card-sub",children:y[i].sub})]})}),t.jsxs("div",{className:"myth-current",children:[t.jsxs("span",{className:"myth-count",children:[String(v+1).padStart(2,"0")," / 08"]}),t.jsx("span",{className:"myth-name",children:d.title})]}),t.jsx("div",{className:"myth-hint",children:"SCROLL TO WALK THE CIRCLE · CLICK MONOLITH TO OPEN · CLICK CENTER FOR THE MYTH"})]})}export{Ke as default};
