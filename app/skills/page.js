"use client";

import { useState } from "react";
import Link from "next/link";
import SkillSphere from "@/components/SkillSphere";
import TechIcon from "@/components/TechIcon";
import { orbit, categories } from "@/data/skills";

export default function SkillsPage() {
  const [activeId, setActiveId] = useState(categories[0].id);
  const active = categories.find((c) => c.id === activeId) || categories[0];

  // Clicking a badge on the sphere jumps to the category that contains it.
  const focusSkill = (item) => {
    const match = categories.find((c) =>
      c.skills.some((s) => s.name.toLowerCase() === item.name.toLowerCase())
    );
    if (match) {
      setActiveId(match.id);
      document
        .getElementById("skill-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <header className="text-center">
        <p className="text-sm font-medium tracking-wide text-emerald-400">Expertise</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
          Technical Expertise
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Everything I build with, grouped by how I actually use it. Spin the
          globe, or pick a category to see the detail.
        </p>
      </header>

      <div className="mt-10">
        <SkillSphere items={orbit} onSelect={focusSkill} />
      </div>

      {/* category tabs */}
      <div
        className="mt-12 flex flex-wrap justify-center gap-3"
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
              onClick={() => setActiveId(cat.id)}
              className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "border-emerald-400/60 bg-emerald-400/10 text-green shadow-glow"
                  : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-green-400/80 hover:shadow-glow"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition ${
                  isActive ? "bg-emerald-400" : "bg-slate-600"
                }`}
              />
              {cat.tab}
            </button>
          );
        })}
      </div>

      {/* detail panel */}
      <section
        id="skill-panel"
        role="tabpanel"
        aria-label={active.title}
        className="glass-card mt-6 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex gap-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-glow" />
            <div>
              <h2 className="font-display text-2xl font-semibold ">
                {active.title}
              </h2>
              <p className="mt-1.5 max-w-2xl text-sm text-slate-400">{active.blurb}</p>
            </div>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
            {active.skills.length} skills
          </span>
        </div>

        <ul className="mt-6 flex flex-wrap gap-2.5">
          {active.skills.map((skill) => (
            <li
              key={skill.name}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-200 transition hover:border-emerald-400/40 hover:bg-emerald-400/[0.07]"
            >
              {skill.icon ? (
                <TechIcon
                  name={skill.icon}
                  className="h-4 w-4 shrink-0"
                  style={{ color: skill.color }}
                />
              ) : (
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500" />
              )}
              {skill.name}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
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
  );
}
