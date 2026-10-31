"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { PALETTE, SCENES } from "./scenes";

/**
 * Runs one of the 2D canvas scenes full-screen.
 *
 * - Reads the theme from a ref every frame, so a light/dark switch recolours
 *   the scene immediately without rebuilding it.
 * - Pauses on a hidden tab and while /skills (html.skills-active) is showing
 *   its own background. Draws a single still frame for reduced-motion users.
 * - Caps pixel ratio and particle counts on phones.
 */
export default function CanvasScene({ scene }) {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const lightRef = useRef(isLight);
  const redrawRef = useRef(null);

  useEffect(() => {
    lightRef.current = isLight;
    redrawRef.current?.();
  }, [isLight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const factory = SCENES[scene];
    if (!canvas || !factory) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const impl = factory(ctx);
    const pointer = { x: -9999, y: -9999 };

    let w = 0;
    let h = 0;
    let raf = 0;
    let running = true;
    let last = performance.now();

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const mobile = w < 768;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      impl.resize(w, h, mobile);
    };

    const paint = (now, dt) => {
      const pal = PALETTE[lightRef.current ? "light" : "dark"];
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, w, h);
      impl.draw(now / 1000, dt, pal, pointer, reduced);
    };

    const loop = (now) => {
      if (running) raf = requestAnimationFrame(loop);
      if (root.classList.contains("skills-active")) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      paint(now, dt);
    };

    build();
    redrawRef.current = () => paint(performance.now(), 0.016);
    if (reduced) paint(0, 0);
    else raf = requestAnimationFrame(loop);

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    let lastW = window.innerWidth;
    const onResize = () => {
      // Mobile address bars fire resize while scrolling; only rebuild on real change.
      if (window.innerWidth !== lastW || Math.abs(window.innerHeight - h) > 160) {
        lastW = window.innerWidth;
        build();
        if (reduced) paint(0, 0);
      }
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running && !reduced) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      redrawRef.current = null;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [scene]);

  return <canvas ref={canvasRef} className="absolute left-0 top-0" aria-hidden="true" />;
}
