"use client";

import { useEffect, useRef } from "react";

// Cursor rainbow trail inspired by modern portfolio cursor effects.
// IMPORTANT: This is NOT a full-screen fluid sim — it only draws around the cursor.

type Point = { x: number; y: number };

export default function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Respect reduced motion.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (prefersReducedMotion.matches) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 1;
    let h = 1;

    const cursor: Point = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
    const target: Point = { ...cursor };

    const trail: Point[] = [];
    const TRAIL_LEN = 28;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(window.innerWidth * dpr));
      h = Math.max(1, Math.floor(window.innerHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
    };

    const onLeave = () => {
      // When cursor leaves window, fade out naturally by stopping updates.
      target.x = cursor.x;
      target.y = cursor.y;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });

    let t0 = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - t0) / 1000);
      t0 = now;

      // Follow cursor quickly so it feels 1:1 (like the reference site).
      // Keep a tiny smoothing to avoid jitter.
      const follow = 1 - Math.pow(0.001, dt); // ~ very fast easing
      cursor.x += (target.x - cursor.x) * follow;
      cursor.y += (target.y - cursor.y) * follow;

      // Add to trail.
      trail.unshift({ x: cursor.x, y: cursor.y });
      if (trail.length > TRAIL_LEN) trail.pop();

      // Fade previous frame without painting black over the page.
      // destination-out reduces existing alpha, leaving the background untouched.
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Draw the rainbow trail with additive blending.
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(10px)";

      const time = now / 1000;
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        const denom = Math.max(1, trail.length - 1);
        const n = i / denom;

        // Size: big near cursor, smaller at tail.
        const base = 46;
        const r = base * (1.15 - n);

        // Hue cycles over time and down the trail.
        const hue = (time * 110 + i * 12) % 360;
        const alpha = (1 - n) * 0.55;

        const x = p.x;
        const y = p.y;
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(r) || r <= 0) continue;

        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, `hsla(${hue}, 100%, 65%, ${alpha})`);
        g.addColorStop(0.55, `hsla(${(hue + 35) % 360}, 100%, 60%, ${alpha * 0.55})`);
        g.addColorStop(1, `hsla(${(hue + 80) % 360}, 100%, 55%, 0)`);

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crisp core (no blur) to match the “tight” rainbow center.
      ctx.filter = "none";
      ctx.globalCompositeOperation = "lighter";
      const coreHue = (time * 140) % 360;
      ctx.fillStyle = `hsla(${coreHue}, 100%, 70%, 0.9)`;
      ctx.beginPath();
      ctx.arc(cursor.x, cursor.y, 8, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove as any);
      window.removeEventListener("pointerleave", onLeave as any);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
