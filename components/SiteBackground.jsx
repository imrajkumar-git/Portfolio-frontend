"use client";

import CosmicBackground from "@/components/CosmicBackground";
import CanvasScene from "@/components/backgrounds/CanvasScene";
import { useAnimation } from "@/context/AnimationContext";
import { useTheme } from "@/context/ThemeContext";

/**
 * The site-wide background: renders whichever animation the visitor picked in
 * the navbar. Only the chosen scene is mounted, so the others cost nothing.
 * (/skills hides this layer and draws its own — see .skills-active in CSS.)
 */
export default function SiteBackground() {
  const { anim } = useAnimation();
  const { theme } = useTheme();
  const isLight = theme === "light";

  if (anim === "aurora") return <CosmicBackground key="aurora" />;

  return (
    <div
      key={anim}
      className={`cosmic-bg bg-enter fixed inset-0 -z-10 transition-colors duration-700 ${
        isLight
          ? "bg-[radial-gradient(120%_90%_at_50%_0%,#f2fbf7_0%,#e6f4fb_45%,#eef9f4_100%)]"
          : "bg-[radial-gradient(120%_90%_at_50%_0%,#08211c_0%,#05100e_48%,#030706_100%)]"
      }`}
      aria-hidden="true"
    >
      <CanvasScene scene={anim} />
      <div
        className={`absolute inset-0 ${
          isLight
            ? "bg-gradient-to-b from-white/45 via-white/5 to-white/55"
            : "bg-gradient-to-b from-black/35 via-transparent to-black/65"
        }`}
      />
      <div className="bg-noise absolute inset-0" />
    </div>
  );
}
