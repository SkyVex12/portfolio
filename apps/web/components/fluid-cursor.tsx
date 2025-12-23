"use client";

import { useEffect, useMemo, useRef } from "react";

// A compact WebGL “oil-on-water” cursor fluid.
// Notes:
// - Transparent canvas overlay (won't block clicks)
// - 7-color palette (cycles) with soft “ink” diffusion
// - Theme-aware blending via CSS (dark/light)
// - Respects prefers-reduced-motion

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

type RGB = [number, number, number];

type Pointer = {
  id: number;
  down: boolean;
  moved: boolean;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: RGB;
};

export default function FluidCursor() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const colorIndexRef = useRef(0);

  // Palette tuned to your current mesh/ring accents (cyan/purple/green)
  // plus complementary “oil” hues.
  const palette = useMemo<RGB[]>(
    () => [
      [56 / 255, 189 / 255, 248 / 255], // cyan
      [168 / 255, 85 / 255, 247 / 255], // purple
      [34 / 255, 197 / 255, 94 / 255], // green
      [59 / 255, 130 / 255, 246 / 255], // blue
      [236 / 255, 72 / 255, 153 / 255], // pink
      [249 / 255, 115 / 255, 22 / 255], // orange
      [250 / 255, 204 / 255, 21 / 255], // yellow
    ],
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    // ---------- WebGL helpers ----------
    // IMPORTANT:
    // We intentionally prefer WebGL1 here because the shaders are written in GLSL ES 1.00
    // (gl_FragColor, attribute/varying). On some browsers, requesting WebGL2 first will
    // compile in GLSL ES 3.00 mode and fail silently, resulting in “no effect”.
    const gl =
      (canvas.getContext("webgl", { alpha: true, antialias: false }) as WebGLRenderingContext | null) ||
      (canvas.getContext("webgl2", { alpha: true, antialias: false }) as WebGL2RenderingContext | null);
    if (!gl) return;

    // Extensions
    const isWebGL2 = (gl as WebGL2RenderingContext).texImage3D !== undefined;
    const extColorBufferFloat = isWebGL2 ? (gl as WebGL2RenderingContext).getExtension("EXT_color_buffer_float") : null;
    const extFloat = gl.getExtension("OES_texture_float");
    const extHalfFloat = !isWebGL2 ? gl.getExtension("OES_texture_half_float") : null;
    const extLinearFloat = gl.getExtension("OES_texture_float_linear");
    const extLinearHalf = !isWebGL2 ? gl.getExtension("OES_texture_half_float_linear") : null;

    // Choose texture type
    const useFloat = !!(isWebGL2 ? extColorBufferFloat : extFloat);
    const texType = isWebGL2
      ? (useFloat ? (gl as WebGL2RenderingContext).FLOAT : (gl as WebGL2RenderingContext).HALF_FLOAT)
      : useFloat
        ? (gl as WebGLRenderingContext).FLOAT
        : (extHalfFloat as any)?.HALF_FLOAT_OES;
    const canLinear = !!(useFloat ? extLinearFloat : extLinearHalf);

    // Early-out if no usable float/half-float
    if (!texType) return;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error("shader");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        const msg = gl.getShaderInfoLog(s) || "shader compile failed";
        gl.deleteShader(s);
        throw new Error(msg);
      }
      return s;
    };

    const link = (vsSrc: string, fsSrc: string) => {
      const p = gl.createProgram();
      if (!p) throw new Error("program");
      const vs = compile(gl.VERTEX_SHADER, vsSrc);
      const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        const msg = gl.getProgramInfoLog(p) || "program link failed";
        gl.deleteProgram(p);
        throw new Error(msg);
      }
      return p;
    };

    const quadVS = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    // Common sampling helpers
    const commonFS = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 uTexelSize;
      vec2 clampUv(vec2 uv) { return clamp(uv, vec2(0.0), vec2(1.0)); }
    `;

    const splatFS = `
      ${commonFS}
      uniform sampler2D uTarget;
      uniform vec2 uPoint;
      uniform float uRadius;
      uniform vec3 uColor;
      void main () {
        vec4 base = texture2D(uTarget, vUv);
        vec2 p = vUv - uPoint;
        p.x *= uTexelSize.y / uTexelSize.x; // aspect correct
        float d = dot(p, p);
        float influence = exp(-d / uRadius);
        // Add color but keep alpha soft for “oil” look
        vec3 c = base.rgb + uColor * influence;
        float a = clamp(base.a + influence * 0.35, 0.0, 1.0);
        gl_FragColor = vec4(c, a);
      }
    `;

    const advectionFS = `
      ${commonFS}
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform float uDt;
      uniform float uDissipation;
      void main () {
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vec2 coord = vUv - uDt * vel * uTexelSize;
        vec4 result = texture2D(uSource, clampUv(coord));
        gl_FragColor = uDissipation * result;
      }
    `;

    const divergenceFS = `
      ${commonFS}
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, clampUv(vUv - vec2(uTexelSize.x, 0.0))).x;
        float R = texture2D(uVelocity, clampUv(vUv + vec2(uTexelSize.x, 0.0))).x;
        float B = texture2D(uVelocity, clampUv(vUv - vec2(0.0, uTexelSize.y))).y;
        float T = texture2D(uVelocity, clampUv(vUv + vec2(0.0, uTexelSize.y))).y;
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlFS = `
      ${commonFS}
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uVelocity, clampUv(vUv - vec2(uTexelSize.x, 0.0))).y;
        float R = texture2D(uVelocity, clampUv(vUv + vec2(uTexelSize.x, 0.0))).y;
        float B = texture2D(uVelocity, clampUv(vUv - vec2(0.0, uTexelSize.y))).x;
        float T = texture2D(uVelocity, clampUv(vUv + vec2(0.0, uTexelSize.y))).x;
        float c = R - L - T + B;
        gl_FragColor = vec4(c, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityFS = `
      ${commonFS}
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float uCurlStrength;
      uniform float uDt;
      void main () {
        float L = abs(texture2D(uCurl, clampUv(vUv - vec2(uTexelSize.x, 0.0))).x);
        float R = abs(texture2D(uCurl, clampUv(vUv + vec2(uTexelSize.x, 0.0))).x);
        float B = abs(texture2D(uCurl, clampUv(vUv - vec2(0.0, uTexelSize.y))).x);
        float T = abs(texture2D(uCurl, clampUv(vUv + vec2(0.0, uTexelSize.y))).x);
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(R - L, T - B);
        float len = length(force) + 1e-5;
        force /= len;
        force *= uCurlStrength * C;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * uDt;
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    const pressureFS = `
      ${commonFS}
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
        float L = texture2D(uPressure, clampUv(vUv - vec2(uTexelSize.x, 0.0))).x;
        float R = texture2D(uPressure, clampUv(vUv + vec2(uTexelSize.x, 0.0))).x;
        float B = texture2D(uPressure, clampUv(vUv - vec2(0.0, uTexelSize.y))).x;
        float T = texture2D(uPressure, clampUv(vUv + vec2(0.0, uTexelSize.y))).x;
        float div = texture2D(uDivergence, vUv).x;
        float p = (L + R + B + T - div) * 0.25;
        gl_FragColor = vec4(p, 0.0, 0.0, 1.0);
      }
    `;

    const gradSubtractFS = `
      ${commonFS}
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
        float L = texture2D(uPressure, clampUv(vUv - vec2(uTexelSize.x, 0.0))).x;
        float R = texture2D(uPressure, clampUv(vUv + vec2(uTexelSize.x, 0.0))).x;
        float B = texture2D(uPressure, clampUv(vUv - vec2(0.0, uTexelSize.y))).x;
        float T = texture2D(uPressure, clampUv(vUv + vec2(0.0, uTexelSize.y))).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel -= vec2(R - L, T - B) * 0.5;
        gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    // “Oil-on-water” look: slight hue separation and edge enhancement via alpha.
    const displayFS = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uDye;
      void main () {
        vec4 d = texture2D(uDye, vUv);
        // Contrast + gentle “film” response
        vec3 c = 1.0 - exp(-d.rgb * 1.15);
        // Pull some vibrancy into midtones
        c = pow(c, vec3(0.95));
        // Use alpha as a soft mask, but keep it airy
        float a = clamp(d.a * 0.85, 0.0, 0.85);
        gl_FragColor = vec4(c, a);
      }
    `;

    // Programs
    let splatP: WebGLProgram;
    let advectP: WebGLProgram;
    let divergenceP: WebGLProgram;
    let curlP: WebGLProgram;
    let vorticityP: WebGLProgram;
    let pressureP: WebGLProgram;
    let gradP: WebGLProgram;
    let displayP: WebGLProgram;
    try {
      splatP = link(quadVS, splatFS);
      advectP = link(quadVS, advectionFS);
      divergenceP = link(quadVS, divergenceFS);
      curlP = link(quadVS, curlFS);
      vorticityP = link(quadVS, vorticityFS);
      pressureP = link(quadVS, pressureFS);
      gradP = link(quadVS, gradSubtractFS);
      displayP = link(quadVS, displayFS);
    } catch {
      return;
    }

    const getUniforms = (p: WebGLProgram) => {
      const u: Record<string, WebGLUniformLocation | null> = {};
      const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) {
        const info = gl.getActiveUniform(p, i);
        if (!info) continue;
        u[info.name] = gl.getUniformLocation(p, info.name);
      }
      return u;
    };

    const U = {
      splat: getUniforms(splatP),
      adv: getUniforms(advectP),
      div: getUniforms(divergenceP),
      curl: getUniforms(curlP),
      vort: getUniforms(vorticityP),
      press: getUniforms(pressureP),
      grad: getUniforms(gradP),
      disp: getUniforms(displayP),
    };

    // Fullscreen quad
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const bindQuad = (p: WebGLProgram) => {
      gl.useProgram(p);
      const aPos = gl.getAttribLocation(p, "aPosition");
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    };

    const createTex = (w: number, h: number, internal: number, format: number) => {
      const t = gl.createTexture();
      if (!t) throw new Error("tex");
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, canLinear ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, canLinear ? gl.LINEAR : gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (isWebGL2) {
        (gl as WebGL2RenderingContext).texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, texType as any, null);
      } else {
        (gl as WebGLRenderingContext).texImage2D(gl.TEXTURE_2D, 0, format, w, h, 0, format, texType as any, null);
      }
      return t;
    };

    const createFBO = (w: number, h: number, internal: number, format: number) => {
      const tex = createTex(w, h, internal, format);
      const fbo = gl.createFramebuffer();
      if (!fbo) throw new Error("fbo");
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fbo, w, h };
    };

    const createPingPong = (w: number, h: number, internal: number, format: number) => {
      const a = createFBO(w, h, internal, format);
      const b = createFBO(w, h, internal, format);
      return {
        read: a,
        write: b,
        swap() {
          const t = this.read;
          this.read = this.write;
          this.write = t;
        },
      };
    };

    const RGBA = isWebGL2 ? (gl as WebGL2RenderingContext).RGBA : gl.RGBA;
    const RG = isWebGL2 ? (gl as WebGL2RenderingContext).RG : gl.RGBA; // fallback to RGBA for WebGL1
    const internalRGBA = isWebGL2 ? (gl as WebGL2RenderingContext).RGBA16F : RGBA;
    const internalRG = isWebGL2 ? (gl as WebGL2RenderingContext).RG16F : RGBA;

    // ---------- Simulation parameters (tweakable) ----------
    const config = {
      simRes: 128, // velocity/pressure resolution
      dyeRes: 512, // color resolution
      dt: 0.016,
      velocityDissipation: 0.985,
      dyeDissipation: 0.992,
      pressureIterations: 14,
      curlStrength: 18.0,
      splatRadius: 0.0009, // smaller = sharper
      splatForce: 520.0,
    };

    // ---------- Framebuffers ----------
    let simW = 0,
      simH = 0,
      dyeW = 0,
      dyeH = 0;

    let velocity: ReturnType<typeof createPingPong>;
    let dye: ReturnType<typeof createPingPong>;
    let divergence: ReturnType<typeof createFBO>;
    let curl: ReturnType<typeof createFBO>;
    let pressure: ReturnType<typeof createPingPong>;

    const resize = () => {
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      const w = Math.floor(window.innerWidth);
      const h = Math.floor(window.innerHeight);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      // Keep sim aspect aligned with screen
      const aspect = w / h;
      simW = config.simRes;
      simH = Math.round(config.simRes / aspect);
      dyeW = config.dyeRes;
      dyeH = Math.round(config.dyeRes / aspect);

      velocity = createPingPong(simW, simH, internalRG, isWebGL2 ? (gl as WebGL2RenderingContext).RG : RGBA);
      dye = createPingPong(dyeW, dyeH, internalRGBA, RGBA);
      divergence = createFBO(simW, simH, internalRGBA, RGBA);
      curl = createFBO(simW, simH, internalRGBA, RGBA);
      pressure = createPingPong(simW, simH, internalRGBA, RGBA);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const pointers = new Map<number, Pointer>();
    const getNextColor = (): RGB => {
      const i = colorIndexRef.current++ % palette.length;
      return palette[i];
    };

    const updatePointer = (id: number, clientX: number, clientY: number, down: boolean) => {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - (clientY - rect.top) / rect.height;

      let p = pointers.get(id);
      if (!p) {
        // Mark moved=true so the very first motion produces a visible splat.
        p = { id, down, moved: true, x, y, dx: 0, dy: 0, color: getNextColor() };
        pointers.set(id, p);
        return;
      }
      p.dx = x - p.x;
      p.dy = y - p.y;
      p.x = x;
      p.y = y;
      p.down = down;
      p.moved = true;
      if (p.moved) p.color = getNextColor();
    };

    const onMouseMove = (e: MouseEvent) => updatePointer(1, e.clientX, e.clientY, true);
    const onTouchMove = (e: TouchEvent) => {
      for (let i = 0; i < e.touches.length; i++) {
        const t = e.touches[i];
        updatePointer(t.identifier, t.clientX, t.clientY, true);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ---------- Render passes ----------
    const blit = (target: WebGLFramebuffer | null, w: number, h: number) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target);
      gl.viewport(0, 0, w, h);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const setTexelSize = (u: WebGLUniformLocation | null, w: number, h: number) => {
      if (!u) return;
      gl.uniform2f(u, 1 / w, 1 / h);
    };

    const bindTex = (unit: number, tex: WebGLTexture, uniform: WebGLUniformLocation | null) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      if (uniform) gl.uniform1i(uniform, unit);
    };

    const splat = (p: Pointer) => {
      const force = config.splatForce;
      const dx = p.dx * force;
      const dy = p.dy * force;
      const radius = config.splatRadius;

      // velocity splat
      bindQuad(splatP);
      setTexelSize(U.splat.uTexelSize, simW, simH);
      gl.uniform2f(U.splat.uPoint, p.x, p.y);
      gl.uniform1f(U.splat.uRadius, radius);
      gl.uniform3f(U.splat.uColor, dx, dy, 0);
      bindTex(0, velocity.read.tex, U.splat.uTarget);
      blit(velocity.write.fbo, simW, simH);
      velocity.swap();

      // dye splat (oil color)
      bindQuad(splatP);
      setTexelSize(U.splat.uTexelSize, dyeW, dyeH);
      gl.uniform2f(U.splat.uPoint, p.x, p.y);
      gl.uniform1f(U.splat.uRadius, radius * 0.75);
      gl.uniform3f(U.splat.uColor, p.color[0] * 1.35, p.color[1] * 1.35, p.color[2] * 1.35);
      bindTex(0, dye.read.tex, U.splat.uTarget);
      blit(dye.write.fbo, dyeW, dyeH);
      dye.swap();
    };

    const step = () => {
      // Splats from pointers
      pointers.forEach((p) => {
        if (!p.down) return;
        if (!p.moved) return;
        p.moved = false;
        splat(p);
      });

      // Curl
      bindQuad(curlP);
      setTexelSize(U.curl.uTexelSize, simW, simH);
      bindTex(0, velocity.read.tex, U.curl.uVelocity);
      blit(curl.fbo, simW, simH);

      // Vorticity confinement
      bindQuad(vorticityP);
      setTexelSize(U.vort.uTexelSize, simW, simH);
      gl.uniform1f(U.vort.uCurlStrength, config.curlStrength);
      gl.uniform1f(U.vort.uDt, config.dt);
      bindTex(0, velocity.read.tex, U.vort.uVelocity);
      bindTex(1, curl.tex, U.vort.uCurl);
      blit(velocity.write.fbo, simW, simH);
      velocity.swap();

      // Divergence
      bindQuad(divergenceP);
      setTexelSize(U.div.uTexelSize, simW, simH);
      bindTex(0, velocity.read.tex, U.div.uVelocity);
      blit(divergence.fbo, simW, simH);

      // Pressure solve
      // Clear pressure a bit each frame (helps stability)
      gl.disable(gl.BLEND);
      for (let i = 0; i < config.pressureIterations; i++) {
        bindQuad(pressureP);
        setTexelSize(U.press.uTexelSize, simW, simH);
        bindTex(0, pressure.read.tex, U.press.uPressure);
        bindTex(1, divergence.tex, U.press.uDivergence);
        blit(pressure.write.fbo, simW, simH);
        pressure.swap();
      }

      // Subtract pressure gradient
      bindQuad(gradP);
      setTexelSize(U.grad.uTexelSize, simW, simH);
      bindTex(0, pressure.read.tex, U.grad.uPressure);
      bindTex(1, velocity.read.tex, U.grad.uVelocity);
      blit(velocity.write.fbo, simW, simH);
      velocity.swap();

      // Advect velocity
      bindQuad(advectP);
      setTexelSize(U.adv.uTexelSize, simW, simH);
      gl.uniform1f(U.adv.uDt, config.dt);
      gl.uniform1f(U.adv.uDissipation, config.velocityDissipation);
      bindTex(0, velocity.read.tex, U.adv.uVelocity);
      bindTex(1, velocity.read.tex, U.adv.uSource);
      blit(velocity.write.fbo, simW, simH);
      velocity.swap();

      // Advect dye
      bindQuad(advectP);
      setTexelSize(U.adv.uTexelSize, dyeW, dyeH);
      gl.uniform1f(U.adv.uDt, config.dt);
      gl.uniform1f(U.adv.uDissipation, config.dyeDissipation);
      bindTex(0, velocity.read.tex, U.adv.uVelocity);
      bindTex(1, dye.read.tex, U.adv.uSource);
      blit(dye.write.fbo, dyeW, dyeH);
      dye.swap();

      // Display to screen (transparent background)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.disable(gl.BLEND);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      bindQuad(displayP);
      bindTex(0, dye.read.tex, U.disp.uDye);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafRef.current = window.requestAnimationFrame(step);
    };

    rafRef.current = window.requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      pointers.clear();
      // Let GC collect GL objects on navigation.
    };
  }, [palette]);

  return <canvas ref={canvasRef} aria-hidden="true" className="fluid-cursor" />;
}
