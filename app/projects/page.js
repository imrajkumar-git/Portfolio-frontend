"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("All");

  const stacks = useMemo(() => {
    const all = new Set();
    projects.forEach((p) => p.stack.forEach((s) => all.add(s)));
    return ["All", ...Array.from(all).sort()];
  }, []);

  const shown =
    filter === "All" ? projects : projects.filter((p) => p.stack.includes(filter));

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <header>
        <p className="text-sm font-medium tracking-wide text-emerald-400">Work</p>
        <h1 className="mt-3 font-display text-4xl font-bold  sm:text-5xl">
          Projects
        </h1>
        <p className="mt-4 max-w-xl text-slate-400">
          Things I&apos;ve designed, built, or shipped — what the problem was,
          what I used, and what came out of it.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2">
        {stacks.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              filter === s
                ? "border-emerald-400/60 bg-emerald-400/10 text-white"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-slate-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {shown.map((project) => (
          <article
            key={project.slug}
            className="glass-card flex flex-col rounded-3xl p-7 transition hover:-translate-y-1 hover:shadow-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold ">
                  {project.title}
                </h2>
                <p className="mt-1 text-sm text-emerald-400">{project.tagline}</p>
              </div>
              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                {project.year}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {project.description}
            </p>

            <ul className="mt-5 space-y-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-slate-400">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                  {h}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2 border-t border-white/10 pt-5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                {project.role} · {project.status}
              </span>
              {project.links.live && (
                <Link
                  href={project.links.live}
                  className="font-semibold text-emerald-400 transition hover:text-sky-400"
                >
                  View it
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="mt-16 text-center text-slate-500">
          Nothing built with {filter} yet — pick another filter.
        </p>
      )}
    </div>
  );
}
