"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TechIcon from "./TechIcon";
import { useTheme } from "@/context/ThemeContext";
import { readableColor } from "@/lib/color";

/**
 * A drag-to-rotate sphere of technology badges.
 *
 * Points are spread with a Fibonacci spiral so they stay evenly spaced, then
 * projected to 2D every frame. Badges are billboarded (they never tilt) and
 * fade/blur with depth, so the far side reads as being behind the globe.
 *
 * - Sizes itself from its container: bigger on desktop, edge-to-edge on phones,
 *   with label size scaling to match.
 * - touch-action is pan-y, so a vertical swipe still scrolls the page on a
 *   phone while a horizontal drag spins the globe.
 * - Colours follow the site theme (white brand marks flip to ink on light).
 * - Parks the idle spin under prefers-reduced-motion and skips work while the
 *   globe is off-screen or the tab is hidden.
 */

const IDLE_SPIN = 0.002;

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
  const { theme } = useTheme();
  const isLight = theme === "light";

  const wrapRef = useRef(null);
  const badgeRefs = useRef([]);
  const rotation = useRef({ x: -0.25, y: 0 });
  const velocity = useRef({ x: 0, y: IDLE_SPIN });
  const drag = useRef({ active: false, lastX: 0, lastY: 0, moved: false });
  const frame = useRef(null);
  const reduced = useRef(false);
  const onScreen = useRef(true);

  const [size, setSize] = useState(360);
  const [hovered, setHovered] = useState(null);

  const points = useMemo(() => fibonacciSphere(items.length), [items.length]);

  // Radius as a share of the half-width: tighter on phones so labels never clip.
  const radiusFactor = size < 520 ? 0.68 : 0.75;
  const fontSize = Math.max(11, Math.min(16, size / 34));

  // ---- measure ----
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize(el.clientWidth || 360);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- only animate while visible ----
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
      },
      { rootMargin: "80px" }
    );
    io.observe(el);
    return () => io.disconnect();
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
    const radius = (size / 2) * radiusFactor;
    const perspective = size * 1.6;

    const tick = () => {
      frame.current = requestAnimationFrame(tick);
      if (!onScreen.current || document.hidden) return;

      if (!drag.current.active) {
        const target = reduced.current ? 0 : IDLE_SPIN;
        velocity.current.x *= 0.94;
        velocity.current.y = velocity.current.y * 0.95 + target * 0.05;
      }

      rotation.current.x += velocity.current.x;
      rotation.current.y += velocity.current.y;
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

        const scale = (perspective / (perspective + (1 - z2) * radius * 1.8)) * 1.12;
        const depth = (z2 + 1) / 2; // 0 = far side, 1 = nearest

        el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * radius).toFixed(1)}px, ${(y2 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.opacity = (0.2 + depth * 0.8).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.filter = depth < 0.42 ? `blur(${((0.42 - depth) * 3).toFixed(2)}px)` : "none";
        el.style.pointerEvents = depth < 0.3 ? "none" : "auto";
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [points, size, radiusFactor]);

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
    rotation.current.y += dx * 0.006;
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

  const ringR = radiusFactor * 100;

  return (
    <div
      ref={wrapRef}
      className="skill-sphere relative mx-auto aspect-square w-full cursor-grab select-none active:cursor-grabbing"
      style={{ "--sphere-font": `${fontSize}px`, touchAction: "pan-y" }}
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
      {/* halo + wireframe + orbiting rings */}
      <svg
        viewBox="0 0 200 200"
        className="sphere-svg pointer-events-none absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="sphereCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--sphere-core-a)" stopOpacity="0.55" />
            <stop offset="55%" stopColor="var(--sphere-core-b)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--sphere-core-b)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle className="sphere-breathe" cx="100" cy="100" r={ringR + 16} fill="url(#sphereCore)" />
        <circle cx="100" cy="100" r={ringR} fill="none" className="sphere-stroke-a" strokeWidth="0.5" />

        {[0.25, 0.5, 0.75, 0.92].map((k) => (
          <ellipse
            key={`lat-${k}`}
            cx="100"
            cy="100"
            rx={ringR}
            ry={ringR * k * 0.5}
            fill="none"
            className="sphere-stroke-b"
            strokeWidth="0.4"
          />
        ))}

        <g className="sphere-spin" style={{ transformOrigin: "100px 100px" }}>
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <ellipse
              key={`lon-${deg}`}
              cx="100"
              cy="100"
              rx={ringR * 0.36}
              ry={ringR}
              fill="none"
              className="sphere-stroke-a"
              strokeWidth="0.4"
              transform={`rotate(${deg} 100 100)`}
            />
          ))}
        </g>

        {/* two orbiting satellites on dashed outer rings */}
        <g className="sphere-orbit-a" style={{ transformOrigin: "100px 100px" }}>
          <circle cx="100" cy="100" r={ringR + 11} fill="none" className="sphere-stroke-b" strokeWidth="0.45" strokeDasharray="2 5" />
          <circle cx={100 + ringR + 11} cy="100" r="2" className="sphere-dot-a" />
        </g>
        <g className="sphere-orbit-b" style={{ transformOrigin: "100px 100px" }}>
          <circle cx="100" cy="100" r={ringR + 21} fill="none" className="sphere-stroke-a" strokeWidth="0.35" strokeDasharray="1 7" />
          <circle cx={100 - ringR - 21} cy="100" r="1.6" className="sphere-dot-b" />
        </g>
      </svg>

      {/* badges */}
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {items.map((item, i) => {
          const color = readableColor(item.color, isLight);
          return (
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
              className={`sphere-badge absolute left-0 top-0 whitespace-nowrap ${
                hovered === item.name ? "is-hot" : ""
              }`}
              style={{ willChange: "transform, opacity", "--c": color }}
              tabIndex={-1}
            >
              <span className="flex items-center gap-[0.45em]">
                <TechIcon
                  name={item.icon}
                  className="shrink-0"
                  style={{ color, width: "1.2em", height: "1.2em" }}
                />
                {item.name}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sphere-hint pointer-events-none absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs">
        <span className="hidden sm:inline">Drag to rotate · click a badge to explore</span>
        <span className="sm:hidden">Swipe to spin · tap a badge</span>
      </p>
    </div>
  );
}
