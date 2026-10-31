"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Background that belongs to /skills only — a drifting "signal network".
 *
 * Nodes float slowly and link to their neighbours; small pulses of light
 * travel along the links like data moving through a circuit. The pointer
 * bends nearby nodes toward it and brightens the links around it.
 *
 * The rest of the site uses a WebGL aurora; this is deliberately a different
 * visual language (2D canvas, graph-like) so the page feels distinct.
 *
 * Theme: the loop reads the current theme every frame from a ref, so switching
 * light/dark recolours the scene instantly with no teardown, and the two base
 * gradients cross-fade in CSS.
 */

const PALETTE = {
  dark: {
    a: [61, 220, 145],
    b: [92, 201, 255],
    link: 0.42,
    node: 0.95,
    pulse: 1,
    blend: "lighter",
    orbs: [
      [31, 200, 121, 0.2],
      [47, 178, 244, 0.17],
      [120, 110, 255, 0.1],
    ],
  },
  light: {
    a: [8, 140, 84],
    b: [18, 118, 186],
    link: 0.55,
    node: 0.9,
    pulse: 1,
    blend: "source-over",
    orbs: [
      [31, 200, 121, 0.26],
      [47, 178, 244, 0.24],
      [140, 130, 255, 0.14],
    ],
  },
};

export default function SkillsBackdrop() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const isLight = theme === "light";
  const lightRef = useRef(isLight);
  const redrawRef = useRef(null);

  useEffect(() => {
    lightRef.current = isLight;
    redrawRef.current?.(); // repaint immediately (matters for reduced motion)
  }, [isLight]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes = [];
    const pulses = [];
    let raf = 0;
    let running = true;
    const pointer = { x: -9999, y: -9999 };

    const rand = (a, b) => a + Math.random() * (b - a);

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(w < 768 ? 46 : 105, Math.round((w * h) / 15500));
      nodes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.26, 0.26),
        vy: rand(-0.26, 0.26),
        r: rand(1.1, 2.7),
        ph: rand(0, Math.PI * 2),
        c: Math.random() < 0.55 ? "a" : "b",
      }));
    };

    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    const draw = (ts) => {
      const t = ts / 1000;
      const pal = PALETTE[lightRef.current ? "light" : "dark"];
      const linkDist = w < 768 ? 112 : 150;

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      // slow ambient colour orbs
      pal.orbs.forEach((o, i) => {
        const ox = w * (0.5 + 0.38 * Math.sin(t * 0.07 + i * 2.1));
        const oy = h * (0.45 + 0.34 * Math.cos(t * 0.05 + i * 1.7));
        const rad = Math.max(w, h) * (0.34 + i * 0.05);
        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, rad);
        g.addColorStop(0, `rgba(${o[0]},${o[1]},${o[2]},${o[3]})`);
        g.addColorStop(1, `rgba(${o[0]},${o[1]},${o[2]},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      });

      ctx.globalCompositeOperation = pal.blend;

      // move nodes
      if (!reduced) {
        for (const n of nodes) {
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 36000 && d2 > 1) {
            n.vx += dx * 0.0000045;
            n.vy += dy * 0.0000045;
          }
          const sp = Math.hypot(n.vx, n.vy);
          if (sp > 0.55) {
            n.vx *= 0.55 / sp;
            n.vy *= 0.55 / sp;
          }
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          else if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          else if (n.y > h + 20) n.y = -20;
        }
      }

      // links
      const edges = [];
      ctx.lineWidth = 0.9;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d > linkDist) continue;
          let alpha = (1 - d / linkDist) * pal.link;
          const mx = (a.x + b.x) / 2 - pointer.x;
          const my = (a.y + b.y) / 2 - pointer.y;
          if (mx * mx + my * my < 32000) alpha = Math.min(1, alpha * 2);
          ctx.strokeStyle = rgba(a.c === "a" ? pal.a : pal.b, alpha);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
          if (d < linkDist * 0.85 && edges.length < 160) edges.push([a, b]);
        }
      }

      // data pulses travelling along links
      if (!reduced) {
        if (edges.length && pulses.length < 16 && Math.random() < 0.05) {
          const [a, b] = edges[Math.floor(Math.random() * edges.length)];
          pulses.push({ a, b, p: 0, s: rand(0.012, 0.024), c: Math.random() < 0.5 ? "a" : "b" });
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          p.p += p.s;
          if (p.p >= 1) {
            pulses.splice(i, 1);
            continue;
          }
          const col = p.c === "a" ? pal.a : pal.b;
          const x = p.a.x + (p.b.x - p.a.x) * p.p;
          const y = p.a.y + (p.b.y - p.a.y) * p.p;
          const tp = Math.max(0, p.p - 0.14);
          const tx = p.a.x + (p.b.x - p.a.x) * tp;
          const ty = p.a.y + (p.b.y - p.a.y) * tp;
          ctx.strokeStyle = rgba(col, 0.75);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.fillStyle = rgba(col, 0.28);
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = rgba(col, 1);
          ctx.beginPath();
          ctx.arc(x, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // nodes
      for (const n of nodes) {
        const col = n.c === "a" ? pal.a : pal.b;
        const pulse = 1 + 0.35 * Math.sin(t * 1.6 + n.ph);
        ctx.fillStyle = rgba(col, 0.13);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 3.4 * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = rgba(col, pal.node);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (ts) => {
      draw(ts);
      if (running) raf = requestAnimationFrame(loop);
    };

    build();
    redrawRef.current = () => draw(performance.now());
    if (reduced) draw(0);
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
      // Mobile address bars fire resize on scroll; only rebuild on real width changes.
      if (window.innerWidth !== lastW) {
        lastW = window.innerWidth;
        build();
      } else {
        h = window.innerHeight;
        dpr = Math.min(window.devicePixelRatio || 1, w < 768 ? 1.5 : 2);
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        canvas.style.height = `${h}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      if (reduced) draw(0);
    };
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running && !reduced) {
        running = true;
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
  }, []);

  return (
    <div className="skills-backdrop" aria-hidden="true">
      <div className={`skills-backdrop-base is-dark ${isLight ? "" : "is-on"}`} />
      <div className={`skills-backdrop-base is-light ${isLight ? "is-on" : ""}`} />
      <canvas ref={canvasRef} className="absolute left-0 top-0" />
      <div className="skills-backdrop-vignette" />
    </div>
  );
}
