import{T as t0,v as e0,u as n0,L as K,V as E,n as j,p as a0,A as u0,m as J,aQ as d0,D as $,R as W,B as r0,k as C,i as D}from"./index-DIHda9-v.js";import{bL as f0,bM as i0,bN as h0,bO as s0,bP as p0,bQ as v0,bR as m0,bz as S,bA as s,bB as h,bC as X}from"./boot-DwlOqL8S.js";function R(e){const t=o=>{const n=o/255;return n<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)};return[t(e>>16&255),t(e>>8&255),t(e&255)]}const G=(e,t,o)=>[e[0]+(t[0]-e[0])*o,e[1]+(t[1]-e[1])*o,e[2]+(t[2]-e[2])*o],l0=(e,t,o)=>{const n=Math.max(0,Math.min(1,(o-e)/(t-e)));return n*n*(3-2*n)};function b0(e,t){const o=.2126*e[0]+.7152*e[1]+.0722*e[2],n=[o*1.05,o,o*.92],r=(.58+.42*t)*(1-.1*l0(.6,1,t)),a=G(n,e,r);return[a[0]*(1+.033*t),a[1],a[2]*(1-.04*t)]}const U={fire0:0,fire1:1,fire2:2,warm:3,rim:m0.always};function I0(e){const t=f0();t.uSunCol.value.set(0,0,0),t.uSunBounce.value.set(0,0,0),t.uFogDensity.value=.012,t.uFogLift.value.set(.3,2,0,0),t.uWind.value=0,t.uStars.value=0,t.uLit.value=0,t.uStair.value=0,t.uColourWave.value.set(0,0,0,0),t.uArchBeam.value.set(0,0,0,0);const o=e.origin;for(let n=0;n<i0;n+=1){const r=e.palette.lights[n];r===void 0?t.uLampPos.value[n].set(o.x,-50,o.z,.001):t.uLampPos.value[n].set(o.x+r.at.x,o.y+r.at.y,o.z+r.at.z,r.range),t.uLampPool.value[n]=0,t.uLampCol.value[n].set(0,0,0)}for(let n=0;n<h0;n+=1)t.uEmit.value[n].set(0,0,0);return t}function o0(e,t,o){return 1+(.82+.1*Math.sin(e*8.3+t*3.1)+.06*Math.sin(e*13.7+t*1.7)+.05*Math.sin(e*2.1+t)-1)*o}function C0(e,t,o){const n=t.palette,r=o.restore,a=n.dawn,i=a===void 0?0:o.dawn;e.uRestore.value=r,e.uTime.value=o.time;const l=(d,k)=>{const A=.2126*d[0]+.7152*d[1]+.0722*d[2];return G([A,A,A*1.04],d,k)},p=.35+.65*r,u=R(n.ambientSky),x=a===void 0?u:G(u,R(a.ambientSky),i),w=(a===void 0?n.ambientPower:n.ambientPower+(a.ambientPower-n.ambientPower)*i)*(1+.25*o.warmth),g=l(x,p),m=l(R(n.ambientGround),p);e.uSkyAmb.value.set(g[0]*w,g[1]*w,g[2]*w),e.uGroundAmb.value.set(m[0]*w*.8,m[1]*w*.8,m[2]*w*.8);const T=l0(.6,1,r);let v=0;n.lights.forEach((d,k)=>{if(k>=i0)return;const A=d.flicker===!0?o.fire[v]??1:1,L=d.power*A*(d.flicker===!0?o0(o.time,k,T)*(.55+.45*r):1)*(1+.35*o.warmth),z=l(R(d.color),p);if(e.uLampCol.value[k].set(z[0]*L,z[1]*L,z[2]*L),d.flicker===!0){const M=v;if(M<=U.fire2){const I=A*(d.flicker===!0?o0(o.time+.4,k+7,T):1)*(.45+.55*r)*1.6,f=l(R(16742956),p);e.uEmit.value[M].set(f[0]*I,f[1]*I,f[2]*I)}v+=1}});const b=o.warmth*.6;e.uEmit.value[U.warm].set(1*b,.62*b,.3*b);const y=R(n.haze),c=b0(a===void 0?y:G(y,R(a.haze),i),r);return e.uFogCol.value.set(c[0],c[1],c[2]),e.uEmit.value[U.rim].set(c[0],c[1],c[2]),c}const w0=`
varying vec3 vDir;
void main() {
  vDir = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,x0=`
uniform float uRestore;
uniform sampler2D uMap;
uniform float uMapOn;
uniform vec3 uArc;      // x: half the arc (rad), y: the painting's top elevation (rad), z: its bottom elevation (rad)
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uHaze;
uniform float uFloorEl; // the floor rim's elevation seen from the eye (rad, negative)
uniform float uDawn;
uniform float uBright;
varying vec3 vDir;
${s0}
void main() {
  vec3 d = normalize(vDir);
  float el = asin(clamp(d.y, -1.0, 1.0));
  float az = atan(d.x, -d.z);
  vec3 sky = mix(uHorizon, uZenith, smoothstep(0.02, 1.1, el));
  vec3 c = el > 0.0 ? sky : mix(uHorizon, uHaze, smoothstep(0.0, 0.12, -el));
  float u0 = az / (2.0 * uArc.x) + 0.5;
  // Past the painted arc the painting goes on round the viewer, mirrored (continuous at its edges), and fades into the
  // era's haze behind them: a turned head never meets an empty edge (2026-11-17, the first browser run showed one).
  float back = 0.0;
  float u = u0;
  if (u0 < 0.0) { u = -u0; back = -u0; }
  else if (u0 > 1.0) { u = 2.0 - u0; back = u0 - 1.0; }
  u = clamp(u, 0.0, 1.0);
  float v = (uArc.y - el) / (uArc.y - uArc.z);
  if (v > 0.0 && v < 1.0) {
    // Soft edges: the top fades into the sky, the foot into the haze above the floor's rim, the far back into the haze.
    float w = smoothstep(0.0, 0.05, v) * smoothstep(uFloorEl + 0.005, uFloorEl + 0.085, el) * (1.0 - smoothstep(0.3, 0.72, back));
    vec3 pic;
    if (uMapOn > 0.5) {
      pic = pow(texture2D(uMap, vec2(u, 1.0 - v)).rgb, vec3(2.2)) * uBright;
    } else {
      // The stand-in: the era's sky down to a warm band at the horizon, a low painted swell of land, then the haze.
      float hz = uArc.y / (uArc.y - uArc.z);
      float land = hz + 0.035 * (0.6 + 0.4 * sin(u * 17.0) * sin(u * 5.3 + 1.0));
      pic = v < hz ? mix(uZenith, uHorizon * 1.15, smoothstep(0.0, hz, v)) : mix(uHorizon, uHaze, smoothstep(hz, hz + 0.25, v));
      pic = mix(pic, uHaze * 0.7, smoothstep(land - 0.004, land + 0.004, v) * (1.0 - smoothstep(land, land + 0.2, v)) * 0.5);
    }
    pic *= mix(vec3(1.0), vec3(1.3, 1.16, 1.02), uDawn);
    // The mirrored part is a little hazier than the painting itself, so the eye stays on what is ahead.
    pic = mix(pic, uHorizon, 0.3 * smoothstep(0.0, 0.25, back));
    c = mix(c, pic, w);
  }
  c = gradeAlbedoR(c, uRestore);
  gl_FragColor = vec4(shoulder(c), 1.0);
  #include <colorspace_fragment>
}
`;function y0(e){const t=e.backdrop,o=t.arcDeg*Math.PI/180,n=o/t.aspect;return{half:o/2,top:n*t.horizonV,bottom:-n*(1-t.horizonV)}}function q0(e,t,o){const n=y0(t),r={uRestore:e.uRestore,uMap:{value:o},uMapOn:{value:0},uArc:{value:new E(n.half,n.top,n.bottom)},uZenith:{value:new E},uHorizon:{value:new E},uHaze:{value:new E},uFloorEl:{value:-Math.atan2(t.eyeY,t.floor.radius)},uDawn:{value:0},uBright:{value:1}},a=new j({uniforms:r,vertexShader:w0,fragmentShader:x0,side:a0,depthWrite:!0});return a.name="era:backdrop",{material:a,uniforms:r}}function _0(e,t,o){const n=t.palette,r=n.dawn===void 0?0:o,a=n.dawn===void 0?R(n.zenith):G(R(n.zenith),R(n.dawn.zenith),r),i=n.dawn===void 0?R(n.horizon):G(R(n.horizon),R(n.dawn.horizon),r),l=n.dawn===void 0?R(n.haze):G(R(n.haze),R(n.dawn.haze),r);e.uZenith.value.set(a[0],a[1],a[2]),e.uHorizon.value.set(i[0],i[1],i[2]),e.uHaze.value.set(l[0],l[1],l[2]),e.uDawn.value=r}const g0=`
${p0}
attribute vec3 color;
attribute vec2 aPaint; // x: 1 on a face that shows the picture, y: how much of the glow it takes
varying vec2 vUv;
varying vec3 vColor;
varying vec3 vLight;
varying float vFog;
varying vec2 vPaint;
${v0}
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vec3 n = normalize(mat3(modelMatrix) * normal);
  vLight = ambientLight(world.xyz, n, 1.0) + lampLight(world.xyz, n);
  vFog = fogAmount(world.xyz);
  vUv = uv;
  vColor = color;
  vPaint = aPaint;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`,z0=`
uniform float uRestore;
uniform vec3 uFogCol;
uniform sampler2D uMap;
uniform vec4 uRect;     // the picture's part of uMap: xy offset, zw scale
uniform float uInk;     // how much of uMap shows
uniform float uReveal;  // uMap shows left of this (0..1), with a soft edge
uniform sampler2D uMap2;
uniform vec4 uRect2;
uniform float uMix2;    // a second picture over the first
uniform vec3 uGlow;     // an emissive glow on the faces that take it
uniform vec3 uInkGlow;  // an emissive glow on uMap's ink (the chronicle's gold writing)
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vColor;
varying vec3 vLight;
varying float vFog;
varying vec2 vPaint;
${s0}
void main() {
  vec3 albedo = vColor;
  float ink = 0.0;
  if (vPaint.x > 0.5) {
    vec4 t1 = texture2D(uMap, uRect.xy + vUv * uRect.zw);
    ink = t1.a * uInk * (1.0 - smoothstep(uReveal - 0.04, uReveal, vUv.x));
    albedo = mix(albedo, pow(t1.rgb, vec3(2.2)), ink);
    if (uMix2 > 0.001) {
      vec4 t2 = texture2D(uMap2, uRect2.xy + vUv * uRect2.zw);
      albedo = mix(albedo, pow(t2.rgb, vec3(2.2)), uMix2);
      ink *= 1.0 - uMix2;
    }
  }
  vec3 c = gradeAlbedoR(albedo, uRestore) * vLight + uGlow * vPaint.y + uInkGlow * ink;
  c = mix(shoulder(c), uFogCol, vFog);
  gl_FragColor = vec4(c, uOpacity);
  #include <colorspace_fragment>
}
`,k0={aPaint:[0,0]};function D0(e,t={}){const o=R0(),n=t.rect??[0,0,1,1],r=t.rect2??[0,0,1,1],a={uMap:{value:t.map??o},uRect:{value:new J(n[0],n[1],n[2],n[3])},uInk:{value:t.ink??1},uReveal:{value:1.05},uMap2:{value:t.map2??o},uRect2:{value:new J(r[0],r[1],r[2],r[3])},uMix2:{value:0},uGlow:{value:new E(0,0,0)},uInkGlow:{value:new E(0,0,0)},uOpacity:{value:1}},i=e,l=new j({uniforms:{...i,...a},vertexShader:g0,fragmentShader:z0,side:t.front===!0?d0:a0});return l.name="era:picture",l.defaultAttributeValues={...l.defaultAttributeValues,...k0},t.transparent===!0&&(l.transparent=!0,l.depthWrite=!1),{material:l,uniforms:a}}const H0={flame:0,steam:1,glow:2,sparkle:3,puff:4},N=16,M0=`
uniform float uTime;
uniform float uLive;
uniform float uLevel[${N}];
uniform vec3 uOffset[${N}];
attribute vec3 aCentre;
attribute vec2 aCorner;
attribute vec4 aInfo;   // x: channel, y: kind, z: size (m), w: phase 0..1
varying vec2 vCorner;
varying float vKind;
varying float vLevel;
varying float vAge;
void main() {
  int ch = int(aInfo.x + 0.5);
  float lvl = uLevel[ch];
  float kind = aInfo.y;
  float size = aInfo.z;
  float ph = aInfo.w;
  float t = uTime;
  vec3 c = aCentre + uOffset[ch];
  float sx = size;
  float sy = size;
  vAge = 0.0;
  if (kind < 0.5) {
    // A flame: taller than wide, rising from its base, swaying and flickering while the scene is awake.
    float fl = 1.0 + (0.16 * sin(t * 9.1 + ph * 6.3) + 0.09 * sin(t * 15.3 + ph * 2.0)) * uLive;
    sy = size * 1.7 * fl * lvl;
    sx = size * (1.0 + 0.08 * sin(t * 7.0 + ph * 4.0) * uLive) * mix(0.6, 1.0, lvl);
    c.x += 0.05 * size * sin(t * 3.1 + ph * 6.3) * uLive;
    c.y += sy * 0.42;
  } else if (kind < 1.5) {
    // Steam: puffs rise and grow over a 2.4 s cycle while the level lasts.
    float age = fract(t * 0.42 + ph);
    vAge = age;
    c.y += age * 1.4;
    c.x += 0.15 * sin(age * 3.0 + ph * 6.3);
    sx = size * (0.45 + age * 1.1);
    sy = sx;
  } else if (kind > 2.5 && kind < 3.5) {
    // A sparkle: small twinkles turning round their centre.
    float a = t * 2.3 + ph * 6.283;
    c += vec3(cos(a), 0.6 * sin(a * 1.4 + ph * 3.0), sin(a)) * size * 1.4;
    sx = size * 0.22 * (0.6 + 0.4 * sin(t * 11.0 + ph * 20.0));
    sy = sx;
  } else if (kind > 3.5) {
    // A puff: it rises a little and spreads as its level falls (the level runs 1 to 0 over its life).
    float age = 1.0 - lvl;
    vAge = age;
    c.y += age * 0.35;
    sx = size * (0.6 + age * 0.9);
    sy = sx;
  }
  vec4 mv = modelViewMatrix * vec4(c, 1.0);
  mv.xy += aCorner * vec2(sx, sy);
  gl_Position = projectionMatrix * mv;
  vCorner = aCorner;
  vKind = kind;
  vLevel = lvl;
}
`,A0=`
uniform float uRestore;
uniform float uTime;
uniform float uLive;
varying vec2 vCorner;
varying float vKind;
varying float vLevel;
varying float vAge;
void main() {
  if (vLevel <= 0.001) discard;
  vec2 q = vCorner;
  vec3 col;
  float a;
  if (vKind < 0.5) {
    // A teardrop: round at the base, narrowing to a tip; hot white-yellow low, orange to red high.
    float y = q.y * 0.5 + 0.5;
    float w = mix(0.95, 0.08, pow(y, 0.8));
    float d = abs(q.x) / max(w, 0.05);
    a = (1.0 - smoothstep(0.55, 1.0, d)) * (1.0 - smoothstep(0.75, 1.0, y)) * smoothstep(0.0, 0.12, y);
    a *= 0.85 + 0.15 * sin(uTime * 17.0 * uLive + q.y * 9.0);
    col = mix(vec3(1.0, 0.85, 0.45), vec3(1.0, 0.32, 0.06), smoothstep(0.1, 0.85, y)) * 1.6;
  } else if (vKind < 1.5) {
    float r = length(q);
    a = (1.0 - smoothstep(0.2, 1.0, r)) * (1.0 - vAge) * smoothstep(0.0, 0.15, vAge) * 0.5;
    col = vec3(0.62, 0.62, 0.66);
  } else if (vKind < 2.5) {
    float r = length(q);
    a = pow(1.0 - smoothstep(0.0, 1.0, r), 2.0);
    col = vec3(1.0, 0.7, 0.36);
  } else if (vKind < 3.5) {
    float r = length(q);
    a = (1.0 - smoothstep(0.0, 1.0, r)) + 0.6 * (1.0 - smoothstep(0.0, 0.12, abs(q.x))) * (1.0 - smoothstep(0.3, 1.0, abs(q.y))) + 0.6 * (1.0 - smoothstep(0.0, 0.12, abs(q.y))) * (1.0 - smoothstep(0.3, 1.0, abs(q.x)));
    col = vec3(1.0, 0.9, 0.6) * 1.4;
  } else {
    // A puff fades as its level runs down (the vertex shader grows it meanwhile).
    a = (1.0 - smoothstep(0.15, 1.0, length(q))) * smoothstep(0.0, 0.25, vLevel) * 0.55;
    col = vec3(0.5, 0.53, 0.6);
  }
  if (vKind < 3.5) a *= min(1.0, vLevel);
  // The Silence: a frozen fire is dim and nearly colourless.
  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, 0.3 + 0.7 * uRestore) * (0.55 + 0.45 * uRestore);
  gl_FragColor = vec4(col * a, a);
  #include <colorspace_fragment>
}
`;function G0(e){const t={uRestore:e.uRestore,uTime:{value:0},uLive:{value:0},uLevel:{value:Array.from({length:N},()=>0)},uOffset:{value:Array.from({length:N},()=>new E)}},o=new j({uniforms:t,vertexShader:M0,fragmentShader:A0,transparent:!0,depthWrite:!1,blending:u0});return o.name="era:sprites",{material:o,uniforms:t}}let B=null;function R0(){return B===null&&(B=new $(new Uint8Array([0,0,0,0]),1,1,W),B.needsUpdate=!0),B}function T0(){try{return"./"}catch{return"/"}}function U0(e,t){const o=new t0;if(o.colorSpace=e0,o.generateMipmaps=t.mipmaps,o.minFilter=t.mipmaps?n0:K,o.magFilter=K,o.anisotropy=t.mipmaps?4:1,typeof Image>"u")return o;try{const n=new Image;n.decoding="async",n.onload=()=>{try{o.image=n,o.needsUpdate=!0,t.onReady?.()}catch(r){console.warn(`[eras] ${e} could not be used`,r)}},n.onerror=()=>console.info(`[eras] ${e} is not there (yet): the scene keeps its stand-in`),n.src=`${T0()}${e}`}catch(n){console.warn(`[eras] ${e} could not be loaded`,n)}return o}function O0(e,t,o,n){try{const r=e?.createElement("canvas"),a=r?.getContext("2d")??null;if(r===void 0||a===null)return new $(new Uint8Array([0,0,0,0]),1,1,W);r.width=t,r.height=o,n(a,t,o);const i=new t0(r);return i.colorSpace=e0,i.generateMipmaps=!0,i.minFilter=n0,i.magFilter=K,i.anisotropy=4,i.needsUpdate=!0,i}catch(r){return console.warn("[eras] a canvas texture could not be drawn",r),new $(new Uint8Array([0,0,0,0]),1,1,W)}}const B0='"Noto Serif", "Times New Roman", Georgia, serif',Y=Math.PI*2;function q(e,t,o,n){return Math.atan2(o-e,n-t)}function Z(e){return new D().makeRotationX(e)}function L0(e){return new D().makeRotationZ(e)}function V(e,t,o,n,r,a,i){e.color(i).detail(h.wood),e.box(-t/2,n-r,-o/2,t/2,n,o/2,{top:!0,bottom:!0});const l=t/2-a,p=o/2-a;for(const[u,x]of[[-l,-p],[l,-p],[-l,p],[l,p]])e.box(u-a/2,0,x-a/2,u+a/2,n-r,x+a/2)}function _(e,t,o,n,r=6){e.tube(t,o,n,r)}function N0(e,t,o,n){const r=[0,.35,.7,1.1,1.5,1.95,2.4,2.9,3.4,3.9,4.4,4.9,5.4,5.9].filter(b=>b<e-.05);r.push(e);const a=40,i=Math.max(1.5,e-1.4),l=[],p=[],u=[],x=[],w=[],g=[],m=[],T=(b,y)=>{const c=Math.sin(b*12.9898+y*78.233)*43758.5453;return c-Math.floor(c)};for(let b=0;b<r.length;b+=1){const y=r[b],c=b===0?1:a;for(let d=0;d<c;d+=1){const k=d/a*Y,A=b===0?0:Math.cos(k)*y,L=b===0?0:Math.sin(k)*y,z=Math.max(0,Math.min(1,(y-i)/(e-i))),M=z*z*(3-2*z),I=.9+.2*T(Math.round(A*3),Math.round(L*3)),f=(1-M)*I;l.push(A,0,L),p.push(0,1,0),u.push(t[0]*f,t[1]*f,t[2]*f),x.push(o,1),w.push(U.rim,M),g.push(0,0)}}for(let b=0;b<a;b+=1)m.push(0,1+(b+1)%a,1+b);for(let b=1;b+1<r.length;b+=1){const y=1+(b-1)*a,c=1+b*a;for(let d=0;d<a;d+=1){const k=(d+1)%a;m.push(y+d,y+k,c+k,y+d,c+k,c+d)}}const v=new r0;return v.setAttribute("position",new C(new Float32Array(l),3)),v.setAttribute("normal",new C(new Float32Array(p),3)),v.setAttribute("color",new C(new Float32Array(u),3)),v.setAttribute("aDetail",new C(new Float32Array(x),2)),v.setAttribute("aEmit",new C(new Float32Array(w),2)),v.setAttribute("aWear",new C(new Float32Array(g),2)),v.setIndex(m),v.computeBoundingSphere(),v}class Q{constructor(){this.pos=[],this.nor=[],this.uv=[],this.col=[],this.paint=[],this.idx=[],this.matrix=new D,this.stack=[],this.v=new E}push(t){return this.stack.push(this.matrix.clone()),this.matrix=this.matrix.clone().multiply(t),this}pop(){return this.matrix=this.stack.pop()??new D,this}get triangles(){return this.idx.length/3}quad(t,o,n,r,a,i=0,l=0,p=[0,0,1,1]){const u=[t,o,n,r].map(v=>this.v.set(v[0],v[1],v[2]).applyMatrix4(this.matrix).toArray()),x=new E(u[1][0]-u[0][0],u[1][1]-u[0][1],u[1][2]-u[0][2]),w=new E(u[3][0]-u[0][0],u[3][1]-u[0][1],u[3][2]-u[0][2]),g=new E().crossVectors(x,w).normalize(),m=this.pos.length/3,T=[[p[0],p[1]],[p[2],p[1]],[p[2],p[3]],[p[0],p[3]]];for(let v=0;v<4;v+=1)this.pos.push(u[v][0],u[v][1],u[v][2]),this.nor.push(g.x,g.y,g.z),this.uv.push(T[v][0],T[v][1]),this.col.push(a[0],a[1],a[2]),this.paint.push(i,l);return this.idx.push(m,m+1,m+2,m,m+2,m+3),this}box(t,o,n,r,a,i,l,p){return p===void 0?this.quad([t,o,i],[r,o,i],[r,a,i],[t,a,i],l):this.quad([t,o,i],[r,o,i],[r,a,i],[t,a,i],l,1,p.glow,p.uv),this.quad([r,o,n],[t,o,n],[t,a,n],[r,a,n],l),this.quad([r,o,i],[r,o,n],[r,a,n],[r,a,i],l),this.quad([t,o,n],[t,o,i],[t,a,i],[t,a,n],l),this.quad([t,a,i],[r,a,i],[r,a,n],[t,a,n],l),this.quad([t,o,n],[r,o,n],[r,o,i],[t,o,i],l),this}build(){const t=new r0;return t.setAttribute("position",new C(new Float32Array(this.pos),3)),t.setAttribute("normal",new C(new Float32Array(this.nor),3)),t.setAttribute("uv",new C(new Float32Array(this.uv),2)),t.setAttribute("color",new C(new Float32Array(this.col),3)),t.setAttribute("aPaint",new C(new Float32Array(this.paint),2)),t.setIndex(this.idx),t.computeBoundingSphere(),t}}function c0(e,t,o,n,r){const a=new Q,i=e/2,l=.012;a.box(-i-.015,-.012,-t/2-.015,i+.015,0,t/2+.015,o);const p=1;return a.quad([-i,l,t/2],[0,l+.02,t/2],[0,l+.02,-t/2],[-i,l,-t/2],n,p,0,[0,0,.5,1]),a.quad([0,l+.02,t/2],[i,l,t/2],[i,l,-t/2],[0,l+.02,-t/2],n,p,0,[.5,0,1,1]),a.quad([-i,0,t/2],[i,0,t/2],[i,l,t/2],[-i,l,t/2],X(n,[0,0,0],.15)),a.build()}function V0(e,t,o){const n=new Q;return n.quad([-e/2,-t/2,.001],[e/2,-t/2,.001],[e/2,t/2,.001],[-e/2,t/2,.001],o,1,1,[0,0,1,1]),n.quad([e/2,-t/2,-.001],[-e/2,-t/2,-.001],[-e/2,t/2,-.001],[e/2,t/2,-.001],X(o,[0,0,0],.1)),n.build()}function K0(e,t){const o=new Q,n=s(10122312);return o.box(-.065,0,-.03,.065,.15,.03,n,{uv:[e,0,t,1],glow:1}),o.build()}const O=(e,t,o,n=0,r=0)=>({pos:{x:e,y:t,z:o},yaw:n,tilt:r}),F=.745;function $0(e){const t=z=>e.things.find(M=>M.key===z).at,o=new S,n=s(8016948),r=s(5913636),a=s(14998731);o.color(s(8006692)).detail(h.none),o.box(-1.35,0,-2.75,1.35,.012,-.95,{top:!0}),o.color(s(12095550)),o.box(-1.2,.012,-2.62,1.2,.016,-2.55,{top:!0}),o.box(-1.2,.012,-1.15,1.2,.016,-1.08,{top:!0}),o.at(0,0,-1.72),V(o,1.66,.7,.705,.05,.07,n),o.color(a).detail(h.none),o.box(-.86,.6,-.37,.86,F,.37,{top:!0,bottom:!0}),o.color(s(11024940)),o.box(-.865,.6,-.375,.865,.63,.375,{top:!1,bottom:!0}),o.pop();const i=t("era.1147.bread");o.color(r).detail(h.wood),o.cylinder(i.x,i.z,.17,.17,F,F+.02,14),o.color(s(10115636)).detail(h.none),o.cylinder(0,-1.88,.06,.075,F,.86,10),o.cylinder(0,-1.88,.075,.045,.86,.95,10),o.color(s(6964264)),o.cylinder(-.12,-1.68,.075,.05,F,.79,10),o.cylinder(.14,-1.69,.075,.05,F,.79,10),o.color(s(8003370)),o.blob(-.12,.79,-1.68,.055,.02,.055),o.color(s(3811930)),o.blob(.14,.79,-1.69,.055,.02,.055);const l=t("era.1147.chronicle"),p=q(l.x,l.z,0,0),u=.62,x=l.y-.13;o.at(l.x,0,l.z,p),o.color(r).detail(h.wood),o.box(-.24,0,-.06,.24,.05,.06),o.box(-.06,0,-.24,.06,.05,.24),o.box(-.045,.05,-.045,.045,x-.04,.045),o.push(new D().makeTranslation(0,x,0)).push(Z(u)),o.box(-.26,-.03,-.2,.26,0,.2,{top:!0,bottom:!0}),o.color(s(6957602)).detail(h.none),o.box(-.24,0,-.17,.24,.012,.17,{top:!0}),o.color(r),o.box(-.26,-.03,.17,.26,.03,.2),o.pop().pop(),o.pop();const w=.013,g={x:l.x+Math.sin(p)*Math.sin(u)*w,y:x+Math.cos(u)*w,z:l.z+Math.cos(p)*Math.sin(u)*w},m=t("era.1147.fire");o.color(s(7236196)).detail(h.stone);for(let z=0;z<9;z+=1){const M=z/9*Y;o.blob(m.x+Math.cos(M)*.46,.07,m.z+Math.sin(M)*.46,.13,.09,.11,!0,.25,z+3)}o.color(s(4862496)).detail(h.wood);for(let z=0;z<7;z+=1){const M=z/7*Y+.3;_(o,[m.x+Math.cos(M)*.36,.02,m.z+Math.sin(M)*.36],[m.x+Math.cos(M)*.05,.62,m.z+Math.sin(M)*.05],.045,5)}o.color(s(2757640)).detail(h.none).emit(U.fire0,1),o.blob(m.x,.08,m.z,.3,.07,.3,!0,.3,11),o.noEmit(),o.color(s(6965806)).detail(h.wood),_(o,[-2.9,.22,-.7],[-2.5,.22,-2.1],.2,8),_(o,[2.5,.22,-.5],[2.9,.22,-1.7],.2,8);const T=o.build(),v=new S;v.color(s(11696184)).detail(h.none),v.blob(0,.065,0,.13,.075,.12,!1,.05,2),v.color(s(14200944));for(const z of[-.05,0,.05])v.cube(0,.135,z,.16,.008,.014);const b=v.build(),y=new S;y.color(s(10114608)).detail(h.none),y.cylinder(0,0,.075,.1,0,.1,12,{top:!1,bottom:!0}),y.cylinder(0,0,.1,.07,.1,.17,12,{top:!1}),y.color(s(13666848)),y.cylinder(0,0,.068,.068,.16,.168,12,{top:!0}),y.color(s(9068600)).detail(h.wood),y.tube([.02,.12,0],[.09,.3,.02],.012,5);const c=y.build(),d=new S;d.color(s(13152368)).detail(h.none),d.cylinder(0,0,.045,.04,0,.012,12,{top:!0,bottom:!0}),d.cylinder(0,0,.012,.012,.012,.08,8,{}),d.cylinder(0,0,.022,.05,.08,.16,12,{top:!1,bottom:!0}),d.color(s(6953504)),d.cylinder(0,0,.046,.046,.145,.15,12,{top:!0});const k=d.build(),A=t("era.1147.honey"),L=c0(.44,.3,s(6957602),s(14865064));return{statics:T,bread:b,honey:c,cup:k,pages:L,rest:{bread:O(i.x,F+.02,i.z),honey:O(A.x,F,A.z,.6),cups:[O(-.6,F,-1.98),O(.6,F,-1.98)],pages:{pos:g,yaw:p,tilt:u}},served:{bread:{x:-.5,y:F,z:-1.9},honey:{x:.5,y:F,z:-1.9}},fire:m}}const H=.78,P0=.74;function W0(e){const t=f=>e.things.find(P=>P.key===f).at,o=new S,n=s(6965804),r=s(4862496),a=-2.25,i=.86,l={x:0,y:1.035,z:a-.14};o.color(n).detail(h.wood);for(const f of[-.5,.5])o.box(f-.07,0,a-.08,f+.07,1.98,a+.08),o.box(f-.1,0,a-.45,f+.1,.1,a+.35);o.box(-.66,1.84,a-.1,.66,1.98,a+.1),o.box(-.5,1.64,a-.09,.5,1.72,a+.09),o.color(r),o.cylinder(0,a,.045,.045,1.72,1.84,10,{}),o.color(n),o.box(-.42,i-.08,a-.5,.42,i,-2,{top:!0,bottom:!0});for(const[f,P]of[[-.36,-2.06],[.36,-2.06],[-.36,a-.44],[.36,a-.44]])o.box(f-.04,0,P-.04,f+.04,i-.08,P+.04);o.color(s(3815996)).detail(h.none),o.box(-.4,i,a-.14,.4,i+.025,a-.1),o.box(-.4,i,a+.1,.4,i+.025,a+.14),o.box(-.4,i,a-.1,-.36,i+.025,a+.1),o.box(.36,i,a-.1,.4,i+.025,a+.1),o.color(r).detail(h.wood);for(const f of[-.33,.33])o.box(f-.02,i,l.z-.02,f+.02,l.y,l.z+.02);o.tube([-.33,l.y,l.z],[.33,l.y,l.z],.01,5),o.color(n),o.box(-.78,0,a-.1,-.6,.8,a+.1);for(const f of[-.05,.05])o.color(s(2761254)).detail(h.none),o.blob(-.69,.85,a+f,.055,.045,.055),o.color(n).detail(h.wood),o.tube([-.69,.88,a+f],[-.69,1,a+f],.012,5);const p=e.things.filter(f=>f.key.startsWith("era.1564.letter.")),u=p.length>0?p[0].at.z:-1.2;o.at(0,0,u),V(o,1,.24,P0,.04,.05,n),o.pop();const x=t("era.1564.table"),w=q(x.x,x.z,0,0);o.at(x.x,0,x.z,w),V(o,.95,.62,H,.045,.06,n),o.color(s(15261640)).detail(h.none),o.box(.2,H,-.26,.42,H+.05,-.06,{top:!0}),o.color(s(2761760)),o.cylinder(.32,.04,.05,.06,H,H+.06,10),o.pop();const g=t("era.1564.book"),m=q(g.x,g.z,0,0),T=.62;o.at(g.x,0,g.z,m),o.color(r).detail(h.wood),o.push(new D().makeTranslation(0,g.y-.03,0)).push(Z(T)),o.box(-.27,-.025,-.19,.27,0,.19,{top:!0,bottom:!0}),o.pop().pop(),o.box(-.2,H,-.16,.2,g.y-.08,-.1),o.pop(),o.at(1.08,0,-1.78,q(1.08,-1.78,0,0)),o.color(n).detail(h.wood);for(const[f,P]of[[-.36,-.2],[.36,-.2],[-.36,.2],[.36,.2]])o.box(f-.03,0,P-.03,f+.03,.9+(P<0?.14:0),P+.03);o.push(new D().makeTranslation(0,.98,0)).push(Z(.35)),o.color(r),o.box(-.4,-.04,-.26,.4,0,.26,{top:!0,bottom:!0}),o.color(n);for(let f=0;f<=8;f+=1)o.box(-.4+f*.1-.006,0,-.26,-.4+f*.1+.006,.04,.26);for(let f=0;f<=5;f+=1)o.box(-.4,0,-.26+f*.104-.006,.4,.04,-.26+f*.104+.006);o.color(s(3814964)).detail(h.none);for(let f=0;f<8;f+=1)for(let P=0;P<5;P+=1)(f*7+P*3)%4!==0&&o.cube(-.35+f*.1,.012,-.208+P*.104,.07,.02,.07);o.pop().pop(),o.pop(),o.color(s(3811866)).detail(h.none),o.tube([-1.6,2.35,-3.1],[1.6,2.35,-3.1],.006,4),o.color(s(15261638));for(const f of[-1.25,-.7,.35,.95])o.box(f-.21,1.98,-3.105,f+.21,2.35,-3.095);const v=o.build(),b=new S;b.color(n).detail(h.wood),b.box(-.4,-.07,-.14,.4,0,.14,{top:!0,bottom:!0}),b.color(r),b.cylinder(0,0,.07,.07,0,.08,10,{top:!0}),b.color(s(9079440)).detail(h.none),b.tube([0,.06,0],[.42,.08,.28],.016,6),b.color(n).detail(h.wood),b.tube([.42,.08,.28],[.52,.09,.34],.024,6);const y=b.build(),c=.38,d=new S;d.color(r).detail(h.wood),d.box(-.3,0,0,-.27,c,.012),d.box(.27,0,0,.3,c,.012),d.box(-.3,c-.03,0,.3,c,.012),d.box(-.3,0,0,.3,.03,.012),d.color(s(9075290)),d.box(-.27,.03,.002,.27,c-.03,.008);const k=d.build(),A=new S;A.color(s(11039290)).detail(h.none),A.blob(0,.05,0,.13,.055,.07,!1,.04,5),A.color(s(13805674));for(const f of[-.06,0,.06])A.cube(f,.1,0,.012,.006,.08);const L=A.build(),z=c0(.5,.36,s(3810328),s(15260860)),M=t("era.1564.bread"),I=[-.27,-.135,0,.135,.27].map(f=>({x:f,y:i+.012,z:a}));return{statics:v,platen:y,tympan:k,bread:L,book:z,rest:{bread:O(M.x,H,M.z,q(M.x,M.z,0,0)+Math.PI/2),book:{pos:{x:g.x,y:g.y,z:g.z},yaw:m,tilt:T}},press:{platenUpY:1.56,platenDownY:l.y+.02+.07,z:a,hinge:l,tympanRest:-15*Math.PI/180,tympanPrint:Math.PI/2,tympanLen:c,slots:I}}}function F0(e,t,o){const i=Math.round(9.563409563409563),l=X(s(6965808),s(3811870),.35+.15*Math.sin(o));e.color(l).detail(h.wood);for(let u=0;u<i;u+=1){const x=.13+u*.13*1.85;_(e,[-2.6/2-.12,x,0],[2.6/2+.12,x,0],.13,6)}for(const u of[-1,1])for(let x=0;x<i;x+=1){const w=.13+x*.13*1.85;_(e,[u*(2.6/2),w,.1],[u*(2.6/2),w,-1.6],.13*.95,5)}e.color(s(3024416)).detail(h.roof);const p=3.45;for(const u of[-1,1])e.quad([u*(2.6/2+.35),2.3-.05,.35],[u*(2.6/2+.35),2.3-.05,-1.8],[0,p,-1.8],[0,p,.35]),e.quad([0,p,.35],[0,p,-1.8],[u*(2.6/2+.35),2.3-.05,-1.8],[u*(2.6/2+.35),2.3-.05,.35]);e.color(s(5914664)).detail(h.wood),e.tri([-2.6/2,2.3,.06],[2.6/2,2.3,.06],[0,p-.12,.06]),e.color(s(13153418)).detail(h.none),e.tube([-2.6/2-.3,2.3-.02,.36],[0,p+.02,.36],.03,4),e.tube([2.6/2+.3,2.3-.02,.36],[0,p+.02,.36],.03,4),e.color(s(1971728)).detail(h.wood),e.box(-.35,0,.1,.35,1.7,.16),e.color(s(2100228)).detail(h.none).emit(t,1);for(const u of[-.85,.85])e.box(u-.28,1,.1,u+.28,1.55,.17);e.noEmit(),e.color(s(14207136));for(const u of[-.85,.85])e.box(u-.34,.94,.12,u+.34,1,.2),e.box(u-.34,1.55,.12,u+.34,1.61,.2);e.color(s(2756614)).detail(h.none).emit(t,.8);for(let u=0;u<4;u+=1)e.blob(-.9+u*.6,.05,.3,.16,.05,.12,!0,.3,o*10+u);return e.noEmit(),[{x:-.85,y:1.45,z:.25},{x:.85,y:1.45,z:.25},{x:-.7,y:2.55,z:.1},{x:.5,y:2.75,z:0},{x:0,y:3.2,z:-.2},{x:1.1,y:2.35,z:.2}]}function Y0(e){const t=new S,o=[];e.things.filter(c=>c.key.startsWith("era.1812.house.")).forEach((c,d)=>{const k=q(c.at.x,c.at.z,0,0),A=c.at.x-Math.sin(k)*.2,L=c.at.z-Math.cos(k)*.2;t.at(A,0,L,k);const z=F0(t,U.fire0+d,d+1);t.pop();const M=new D().makeRotationY(k).setPosition(A,0,L);o.push(z.map(I=>{const f=new E(I.x,I.y,I.z).applyMatrix4(M);return{x:f.x,y:f.y,z:f.z}}))});const r=s(5915696),a=e.things.find(c=>c.key==="era.1812.well").at;t.at(a.x,0,a.z,q(a.x,a.z,0,0)),t.color(r).detail(h.wood);for(let c=0;c<4;c+=1){const d=.1+c*.17;_(t,[-.46,d,.4],[.46,d,.4],.09,6),_(t,[-.46,d+.085,-.4],[.46,d+.085,-.4],.09,6),_(t,[.4,d+.085,-.46],[.4,d+.085,.46],.09,6),_(t,[-.4,d,-.46],[-.4,d,.46],.09,6)}t.color(s(1053720)).detail(h.none),t.box(-.32,.6,-.32,.32,.62,.32,{top:!0}),t.color(r).detail(h.wood);for(const c of[-1,1])t.box(c*.5-.05,0,-.05,c*.5+.05,1.7,.05);t.color(s(3812384)).detail(h.roof),t.quad([-.62,1.62,.42],[.62,1.62,.42],[.62,1.95,0],[-.62,1.95,0]),t.quad([.62,1.62,-.42],[-.62,1.62,-.42],[-.62,1.95,0],[.62,1.95,0]),t.color(r).detail(h.wood),t.tube([-.55,1.25,0],[.62,1.25,0],.05,8),t.tube([.62,1.25,0],[.62,1.05,.12],.02,5),t.color(s(9075290)).detail(h.none),t.tube([0,1.22,0],[0,.92,0],.008,4),t.color(s(6969924)).detail(h.wood),t.cylinder(0,0,.12,.14,.72,.92,10,{top:!1,bottom:!0}),t.pop();const i=e.things.find(c=>c.key==="era.1812.bell").at;t.at(i.x,0,i.z,q(i.x,i.z,0,0)),t.color(r).detail(h.wood);for(const[c,d]of[[-.4,-.4],[.4,-.4],[-.4,.4],[.4,.4]])t.box(c-.06,0,d-.06,c+.06,3.15,d+.06);t.box(-.5,2.1,-.5,.5,2.2,.5,{top:!0,bottom:!0});for(const c of[-1,1])t.box(c*.5-.02,2.2,-.5,c*.5+.02,2.55,.5);t.box(-.5,2.2,-.52,.5,2.55,-.48);for(const c of[-.16,.16])t.box(c-.025,0,.62,c+.025,2.2,.67);for(let c=0;c<8;c+=1)t.box(-.16,.25+c*.25,.62,.16,.28+c*.25,.67);t.color(s(3812384)).detail(h.roof);const l=3.7;for(const[c,d]of[[[-.62,3.1,.62],[.62,3.1,.62]],[[.62,3.1,.62],[.62,3.1,-.62]],[[.62,3.1,-.62],[-.62,3.1,-.62]],[[-.62,3.1,-.62],[-.62,3.1,.62]]])t.tri(c,d,[0,l,0]);t.color(r).detail(h.wood),t.box(-.5,3,-.04,.5,3.08,.04),t.pop();const p={x:i.x,y:2.98,z:i.z},u=e.things.find(c=>c.key==="era.1812.table").at;t.at(u.x,0,u.z,q(u.x,u.z,0,0)+.3),V(t,.9,.6,.62,.04,.05,s(8016948)),t.color(s(11569728)).detail(h.none),t.cylinder(.18,-.08,.1,.12,.62,.8,10,{top:!0}),t.cylinder(.18,-.08,.05,.04,.8,.9,8,{top:!0}),t.color(s(5913122)).detail(h.wood),t.box(-.95,0,-.2,-.55,.32,.12),t.color(s(9071162)),t.box(-.96,.32,-.21,-.54,.36,.13),t.push(new D().makeTranslation(.62,.17,.42)).push(L0(1.45)),t.color(s(6965806)),t.cylinder(0,0,.17,.17,-.02,.02,10,{top:!0,bottom:!0});for(const[c,d]of[[.1,.1],[-.1,.1],[0,-.12]])t.box(c-.02,-.4,d-.02,c+.02,-.02,d+.02);t.pop().pop(),t.pop();const x=t.build(),w=new S;w.color(s(12094010)).detail(h.none),w.cylinder(0,0,.05,.05,-.04,0,8,{top:!0}),w.cylinder(0,0,.14,.085,-.25,-.04,12,{top:!0}),w.cylinder(0,0,.16,.14,-.28,-.25,12,{}),w.color(s(5917242)),w.blob(0,-.27,0,.03,.03,.03);const g=w.build(),m=new S;m.color(s(8018488)).detail(h.wood),m.cylinder(0,0,.12,.15,0,.26,12,{top:!1,bottom:!0}),m.color(s(3815996)).detail(h.none),m.cylinder(0,0,.152,.152,.2,.225,12,{}),m.color(s(5929610)),m.cylinder(0,0,.14,.14,.2,.205,12,{top:!0}),m.color(s(3815996)),m.tube([-.15,.24,0],[0,.4,0],.008,4),m.tube([0,.4,0],[.15,.24,0],.008,4);const T=m.build(),v=new S;v.color(s(5914664)).detail(h.wood),v.tube([0,-.25,0],[0,.32,0],.022,6),v.color(s(2759184)).detail(h.none).emit(U.warm,.6),v.blob(0,.36,0,.05,.08,.05,!0,.2,7),v.noEmit();const b=v.build(),y={x:a.x+Math.cos(.9)*0+.32,y:.79,z:a.z+.38};return{statics:x,bell:g,bucket:T,torch:b,flames:o,bellAt:p,bucketAt:y}}export{B0 as E,Q as P,N as S,V0 as a,K0 as b,O0 as c,I0 as d,U0 as e,q0 as f,N0 as g,H0 as h,$0 as i,W0 as j,Y0 as k,R as l,C0 as m,_0 as n,c0 as o,D0 as p,U as q,G0 as s,q as y};
