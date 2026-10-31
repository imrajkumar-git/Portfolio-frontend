"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SkillSphere from "@/components/SkillSphere";
import SkillsBackdrop from "@/components/SkillsBackdrop";
import TechIcon from "@/components/TechIcon";
import CountUp from "@/components/CountUp";
import { useTheme } from "@/context/ThemeContext";
import { readableColor } from "@/lib/color";
import { orbit, categories } from "@/data/skills";

export default function SkillsPage() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeId, setActiveId] = useState(categories[0].id);
  const [picked, setPicked] = useState(null);
  const pickTimer = useRef(null);
  const active = categories.find((c) => c.id === activeId) || categories[0];

  const totalSkills = useMemo(
    () => categories.reduce((sum, c) => sum + c.skills.length, 0),
    []
  );

  // While this page is open, the site-wide aurora steps aside for this page's
  // own background (see .skills-active in globals.css).
  useEffect(() => {
    document.documentElement.classList.add("skills-active");
    return () => {
      document.documentElement.classList.remove("skills-active");
      clearTimeout(pickTimer.current);
    };
  }, []);

  // Clicking a badge on the sphere jumps to the category that contains it
  // and lights up the matching chip.
  const focusSkill = (item) => {
    const match = categories.find((c) =>
      c.skills.some((s) => s.name.toLowerCase() === item.name.toLowerCase())
    );
    if (!match) return;
    setActiveId(match.id);
    const hit = match.skills.find((s) => s.name.toLowerCase() === item.name.toLowerCase());
    setPicked(hit?.name ?? null);
    clearTimeout(pickTimer.current);
    pickTimer.current = setTimeout(() => setPicked(null), 2600);
    document
      .getElementById("skill-panel")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const rowA = orbit.slice(0, Math.ceil(orbit.length / 2));
  const rowB = orbit.slice(Math.ceil(orbit.length / 2));

  return (
    <>
      <SkillsBackdrop />

      <div className="relative mx-auto max-w-6xl overflow-x-clip px-6 pb-24 pt-14 sm:pt-16">
        {/* ---------- header ---------- */}
        <header className="text-center">
          <span className="skills-eyebrow inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em]">
            <span className="skills-live-dot" />
            Expertise
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-6xl">
            Technical <span className="skills-title">Expertise</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-slate-400 sm:text-lg">
            Everything I build with, grouped by how I actually use it. Spin the
            globe, or pick a category to see the detail.
          </p>

          <dl className="mx-auto mt-9 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Technologies", value: orbit.length },
              { label: "Categories", value: categories.length },
              { label: "Skills listed", value: totalSkills },
            ].map((s) => (
              <div key={s.label} className="skills-stat rounded-2xl px-2 py-4 sm:px-4 sm:py-5">
                <dt className="order-2 mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400 sm:text-xs">
                  {s.label}
                </dt>
                <dd className="skills-stat-num font-display text-3xl font-bold sm:text-4xl">
                  <CountUp end={s.value} duration={1600} />
                </dd>
              </div>
            ))}
          </dl>
        </header>

        {/* ---------- sphere ---------- */}
        <div className="relative mt-10 sm:mt-14">
          <div className="sphere-aura" aria-hidden="true" />
          <div className="-mx-6 w-[calc(100%+3rem)] pb-6 sm:mx-auto sm:w-full sm:max-w-[min(760px,92vh)]">
            <SkillSphere items={orbit} onSelect={focusSkill} />
          </div>
        </div>

        {/* ---------- category tabs ---------- */}
        <div
          className="no-scrollbar -mx-6 mt-12 flex snap-x gap-3 overflow-x-auto px-6 pb-3 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          role="tablist"
          aria-label="Skill categories"
        >
          {categories.map((cat) => {
            const isActive = cat.id === activeId;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="skill-panel"
                onClick={(e) => {
                  setActiveId(cat.id);
                  e.currentTarget.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
                }}
                className={`skills-tab shrink-0 snap-center ${isActive ? "is-active" : ""}`}
              >
                <span className="skills-tab-dot" />
                {cat.tab}
                <span className="skills-tab-count">{cat.skills.length}</span>
              </button>
            );
          })}
        </div>

        {/* ---------- detail panel ---------- */}
        <section
          id="skill-panel"
          role="tabpanel"
          aria-label={active.title}
          className="skill-panel glass-card mt-4 rounded-3xl p-5 sm:p-8"
        >
          <div key={`${active.id}-head`} className="panel-fade flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex gap-3">
              <span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-glow" />
              <div>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">{active.title}</h2>
                <p className="mt-1.5 max-w-2xl text-sm text-slate-400 sm:text-base">{active.blurb}</p>
              </div>
            </div>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {active.skills.length} skills
            </span>
          </div>

          <ul key={active.id} className="mt-6 flex flex-wrap gap-2.5 sm:gap-3">
            {active.skills.map((skill, i) => {
              const color = readableColor(skill.color, isLight);
              return (
                <li
                  key={skill.name}
                  className={`skill-chip ${picked === skill.name ? "is-picked" : ""}`}
                  style={{ "--i": i, "--c": color || "var(--chip-fallback)" }}
                >
                  {skill.icon ? (
                    <TechIcon
                      name={skill.icon}
                      className="h-[1.1rem] w-[1.1rem] shrink-0"
                      style={{ color }}
                    />
                  ) : (
                    <span className="skill-chip-dot" />
                  )}
                  {skill.name}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------- tech ticker ---------- */}
        <div className="ticker mt-14" aria-hidden="true">
          {[rowA, rowB].map((row, r) => (
            <div key={r} className="ticker-row">
              <div className={`ticker-track ${r === 1 ? "is-reverse" : ""}`}>
                {[...row, ...row].map((item, i) => (
                  <span key={`${item.name}-${i}`} className="ticker-item">
                    <TechIcon
                      name={item.icon}
                      className="h-4 w-4"
                      style={{ color: readableColor(item.color, isLight) }}
                    />
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ---------- calls to action ---------- */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/projects"
            className="btn-glow rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-7 py-3 text-sm font-semibold text-black shadow-glow transition hover:-translate-y-0.5"
          >
            See these in projects
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-slate-200 transition hover:border-emerald-400/50 hover:text-white"
          >
            Start a conversation
          </Link>
        </div>
      </div>
    </>
  );
}
