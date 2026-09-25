"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TechIcon from "./TechIcon";

/**
 * A drag-to-rotate sphere of technology badges.
 *
 * Points are spread with a Fibonacci spiral so they stay evenly spaced, then
 * projected to 2D every frame. Badges are billboarded (they never tilt) and
 * fade with depth, so the ones on the far side read as being behind the globe.
 * Pointer drag adds angular velocity; releasing lets it coast back to a slow
 * idle spin. Respects prefers-reduced-motion by parking the idle spin.
 */

const RADIUS = 1;
const IDLE_SPIN = 0.0016;

function fibonacciSphere(count) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(count - 1, 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * r, y, Math.sin(theta) * r]);
  }
  return points;
}

export default function SkillSphere({ items = [], onSelect }) {
  const wrapRef = useRef(null);
  const badgeRefs = useRef([]);
  const rotation = useRef({ x: -0.25, y: 0 });
  const velocity = useRef({ x: 0, y: IDLE_SPIN });
  const drag = useRef({ active: false, lastX: 0, lastY: 0, moved: false });
  const frame = useRef(null);
  const reduced = useRef(false);

  const [size, setSize] = useState(360);
  const [hovered, setHovered] = useState(null);

  const points = useMemo(() => fibonacciSphere(items.length), [items.length]);

  // ---- measure ----
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduced.current = mq.matches;
    if (mq.matches) velocity.current.y = 0;
    const onChange = (e) => {
      reduced.current = e.matches;
      velocity.current.y = e.matches ? 0 : IDLE_SPIN;
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // ---- animation loop ----
  useEffect(() => {
    const radius = (size / 2) * 0.72;
    const perspective = size * 1.6;

    const tick = () => {
      if (!drag.current.active) {
        // Friction, easing back toward the gentle idle spin.
        const target = reduced.current ? 0 : IDLE_SPIN;
        velocity.current.x *= 0.94;
        velocity.current.y = velocity.current.y * 0.94 + target * 0.06;
      }

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;
      // Clamp vertical tilt so the sphere never flips upside down.
      rotation.current.x = Math.max(-0.9, Math.min(0.9, rotation.current.x));

      const sinX = Math.sin(rotation.current.x);
      const cosX = Math.cos(rotation.current.x);
      const sinY = Math.sin(rotation.current.y);
      const cosY = Math.cos(rotation.current.y);

      for (let i = 0; i < points.length; i++) {
        const el = badgeRefs.current[i];
        if (!el) continue;
        const [px, py, pz] = points[i];

        // Yaw then pitch.
        const x1 = px * cosY - pz * sinY;
        const z1 = px * sinY + pz * cosY;
        const y2 = py * cosX - z1 * sinX;
        const z2 = py * sinX + z1 * cosX;

        const scale = perspective / (perspective + (RADIUS - z2) * radius * 1.8);
        const depth = (z2 + 1) / 2; // 0 = far side, 1 = nearest

        el.style.transform = `translate3d(${x1 * radius}px, ${y2 * radius}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.22 + depth * 0.78).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.45 ? `blur(${((0.45 - depth) * 3).toFixed(2)}px)` : "none";
      }

      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [points, size]);

  // ---- pointer drag ----
  const onPointerDown = useCallback((e) => {
    drag.current = { active: true, lastX: e.clientX, lastY: e.clientY, moved: false };
    velocity.current = { x: 0, y: 0 };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.lastX;
    const dy = e.clientY - drag.current.lastY;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
    drag.current.lastX = e.clientX;
    drag.current.lastY = e.clientY;
    velocity.current = { x: dy * 0.00035, y: dx * 0.00045 };
    rotation.current.x += dy * 0.004;
    rotation.current.y += dx * 0.005;
  }, []);

  const endDrag = useCallback(() => {
    drag.current.active = false;
  }, []);

  // Keyboard nudge so the sphere isn't mouse-only.
  const onKeyDown = useCallback((e) => {
    const step = 0.2;
    if (e.key === "ArrowLeft") rotation.current.y -= step;
    else if (e.key === "ArrowRight") rotation.current.y += step;
    else if (e.key === "ArrowUp") rotation.current.x -= step / 2;
    else if (e.key === "ArrowDown") rotation.current.x += step / 2;
    else return;
    e.preventDefault();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="skill-sphere relative mx-auto aspect-square w-full max-w-[540px] cursor-grab touch-none select-none active:cursor-grabbing"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="group"
      aria-label="Rotating sphere of technologies. Use the arrow keys to turn it."
    >
      {/* wireframe globe + core glow */}
      <svg
        viewBox="0 0 200 200"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sphereCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3ddc91" stopOpacity="0.30" />
            <stop offset="55%" stopColor="#2fb2f4" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#2fb2f4" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="78" fill="url(#sphereCore)" />
        <circle
          cx="100"
          cy="100"
          r="72"
          fill="none"
          stroke="rgba(61,220,145,0.22)"
          strokeWidth="0.4"
        />
        {/* latitude rings */}
        {[18, 36, 54, 66].map((ry) => (
          <ellipse
            key={`lat-${ry}`}
            cx="100"
            cy="100"
            rx="72"
            ry={ry}
            fill="none"
            stroke="rgba(92,201,255,0.14)"
            strokeWidth="0.35"
          />
        ))}
        {/* longitude rings */}
        {[0, 30, 60, 90, 120, 150].map((deg) => (
          <ellipse
            key={`lon-${deg}`}
            cx="100"
            cy="100"
            rx="26"
            ry="72"
            fill="none"
            stroke="rgba(61,220,145,0.12)"
            strokeWidth="0.35"
            transform={`rotate(${deg} 100 100)`}
          />
        ))}
      </svg>

      {/* badges */}
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {items.map((item, i) => (
          <button
            key={item.name}
            ref={(el) => (badgeRefs.current[i] = el)}
            type="button"
            onClick={() => {
              if (drag.current.moved) return; // don't fire after a drag
              onSelect?.(item);
            }}
            onMouseEnter={() => setHovered(item.name)}
            onMouseLeave={() => setHovered(null)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-sm transition-colors ${
              hovered === item.name
                ? "border-emerald-400/70 bg-emerald-400/15 text-white"
                : "border-white/10 bg-black/45 text-slate-200"
            }`}
            style={{ willChange: "transform, opacity" }}
            tabIndex={-1}
          >
            <span className="flex items-center gap-1.5">
              <TechIcon
                name={item.icon}
                className="h-3.5 w-3.5 shrink-0"
                style={{ color: item.color }}
              />
              {item.name}
            </span>
          </button>
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-slate-500">
        Drag to rotate
      </p>
    </div>
  );
}
