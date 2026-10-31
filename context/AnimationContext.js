"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

/**
 * Which site-wide background animation is active. Persisted in localStorage.
 * The /skills page ignores this — it always shows its own signal-network scene.
 */
export const ANIMATIONS = [
  { id: "aurora", label: "Aurora", hint: "Flowing northern lights", icon: "🌌" },
  { id: "warp", label: "Starfield", hint: "Fly through space", icon: "🚀" },
  { id: "rain", label: "Code Rain", hint: "Falling code streams", icon: "💻" },
  { id: "fireflies", label: "Fireflies", hint: "Drifting glow lights", icon: "✨" },
  { id: "waves", label: "Waves", hint: "Layered ocean swell", icon: "🌊" },
];

const KEY = "rk-anim";
const IDS = ANIMATIONS.map((a) => a.id);

const AnimationContext = createContext({ anim: "aurora", setAnim: () => {} });

export function AnimationProvider({ children }) {
  const [anim, setAnimState] = useState("aurora");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored && IDS.includes(stored)) setAnimState(stored);
    } catch {
      /* storage can be blocked (private mode) — fall back to the default */
    }
  }, []);

  const setAnim = useCallback((id) => {
    if (!IDS.includes(id)) return;
    setAnimState(id);
    try {
      window.localStorage.setItem(KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  return <AnimationContext.Provider value={{ anim, setAnim }}>{children}</AnimationContext.Provider>;
}

export const useAnimation = () => useContext(AnimationContext);
