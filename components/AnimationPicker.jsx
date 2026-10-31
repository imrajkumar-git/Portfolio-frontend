"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ANIMATIONS, useAnimation } from "@/context/AnimationContext";

/**
 * Lets the visitor choose one of five background animations.
 * variant="dropdown": icon button + popover (desktop navbar)
 * variant="inline":   a tappable grid (mobile menu)
 */
export default function AnimationPicker({ variant = "dropdown" }) {
  const { anim, setAnim } = useAnimation();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = ANIMATIONS.find((a) => a.id === anim) || ANIMATIONS[0];
  const onSkills = pathname === "/skills";

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options = (
    <div role="listbox" aria-label="Background animation" className="anim-options">
      {ANIMATIONS.map((a) => {
        const selected = a.id === anim;
        return (
          <button
            key={a.id}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => {
              setAnim(a.id);
              setOpen(false);
            }}
            className={`anim-option ${selected ? "is-selected" : ""}`}
          >
            <span className="anim-option-icon">{a.icon}</span>
            <span className="anim-option-text">
              <span className="anim-option-label">{a.label}</span>
              <span className="anim-option-hint">{a.hint}</span>
            </span>
            {selected && <span className="anim-option-check">✓</span>}
          </button>
        );
      })}
      {onSkills && (
        <p className="anim-note">The Skills page always uses its own animation.</p>
      )}
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="anim-inline">
        <p className="anim-inline-title">Background animation</p>
        {options}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="nav-icon-btn flex h-9 w-9 items-center justify-center rounded-full text-base"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Background animation: ${current.label}. Change`}
        title={`Animation: ${current.label}`}
      >
        <span aria-hidden="true">{current.icon}</span>
      </button>
      {open && <div className="nav-dropdown anim-popover absolute right-0 mt-2.5 w-72 rounded-2xl p-2 shadow-glow">{options}</div>}
    </div>
  );
}
