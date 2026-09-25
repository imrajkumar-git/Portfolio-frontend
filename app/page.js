import Image from "next/image";
import Link from "next/link";
import { experience } from "@/data/experience";
import { orbit } from "@/data/skills";
import { projects } from "@/data/projects";
import LatestPosts from "@/components/LatestPosts";

export default function HomePage() {
  const topExperience = experience.slice(0, 3);
  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-6 py-20 md:flex-row md:py-28">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
              🟢 Available for freelance & full-time roles
            </span>

            <h1 className="mt-6 font-display text-3xl font-bold leading-tight  sm:text-4xl lg:text-5xl">
              Hey, I&apos;m Rajkumar 👋 <br />
              I build <span className="text-gradient">full-stack</span> web
              experiences 🚀
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-slate-300 md:mx-0">
              A Computer Engineering graduate from Abu Dhabi turning ideas into
              fast, colourful, reliable products — from backend APIs 🧠 to
              pixel-perfect interfaces 🎨.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link
                href="/experience"
                className="btn-glow rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-7 py-3 font-semibold text-black shadow-glow transition hover:-translate-y-0.5"
              >
                See My Experience 💼
              </Link>
              <Link
                href="/contact"
                className="btn-glow rounded-full border border-sky-400/50 bg-sky-400/10 px-7 py-3 font-semibold text-sky-300 shadow-skyglow transition hover:-translate-y-0.5 hover:bg-sky-400/20"
              >
                Let&apos;s Talk 💬
              </Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-4 text-center md:text-left">
              <div>
                <p className="font-display text-3xl font-bold text-emerald-400">5+</p>
                <p className="text-xs text-slate-400">Roles Held</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-sky-400">4</p>
                <p className="text-xs text-slate-400">Languages Spoken</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-emerald-400">100%</p>
                <p className="text-xs text-slate-400">Data Accuracy</p>
              </div>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="relative mx-auto h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96">
              <div className="absolute inset-0 animate-floaty rounded-[2.5rem] bg-gradient-to-br from-emerald-500/30 to-sky-500/30 blur-2xl" />
              <div className="glass-card relative h-full w-full overflow-hidden rounded-[2.5rem] p-2 shadow-glow">
                <Image
                  src="/hero-portrait.jpg"
                  alt="Rajkumar Aryal"
                  fill
                  priority
                  sizes="(max-width: 768px) 288px, 384px"
                  className="rounded-[2rem] object-cover"
                />
              </div>
              <span className="absolute -top-4 -left-4 rounded-2xl border border-emerald-400/30 bg-black/60 px-0 py-2 text-sm text-emerald-300 backdrop-blur">
                📍
              </span>
               <span className="absolute -bottom-4 -left-4 rounded-2xl border border-emerald-400/30 bg-black/60 px-0 py-2 text-sm text-emerald-300 backdrop-blur">
                📍
              </span> <span className="absolute -bottom-4 -right-4 rounded-2xl border border-emerald-400/30 bg-black/60 px-0 py-2 text-sm text-emerald-300 backdrop-blur">
                📍
              </span>
              <span className="absolute -top-4 -right-4 rounded-2xl border border-emerald-400/30 bg-black/60 px-0 py-2 text-sm text-emerald-300 backdrop-blur">
                📍
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS STRIP */}
      <section className="border-y border-white/5 bg-black/30 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-6 text-center text-sm text-slate-400">
            Tools and technologies I work with
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {orbit.slice(0, 16).map((tech) => (
              <span
                key={tech.name}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-200"
              >
                {tech.name}
              </span>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link
              href="/skills"
              className="text-sm font-semibold text-emerald-400 transition hover:text-sky-400"
            >
              Explore the full stack
            </Link>
          </p>
        </div>
      </section>

      {/* EXPERIENCE PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold ">
              Recent Experience 🧭
            </h2>
            <p className="mt-2 text-slate-400">
              A snapshot of where I&apos;ve worked and grown.
            </p>
          </div>
          <Link href="/experience" className="font-semibold text-emerald-400 hover:text-sky-400">
            View full timeline →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {topExperience.map((job) => (
            <div
              key={job.role + job.company}
              className="glass-card rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="inline-block rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                {job.tag}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold ">
                {job.role}
              </h3>
              <p className="text-sm text-emerald-400">{job.company}</p>
              <p className="mt-1 text-xs text-slate-400">{job.period}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                {job.points[0]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold ">
              Selected Work
            </h2>
            <p className="mt-2 text-slate-400">
              A few things I&apos;ve designed and built end to end.
            </p>
          </div>
          <Link href="/projects" className="font-semibold text-emerald-400 hover:text-sky-400">
            See all projects
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((project) => (
            <Link
              key={project.slug}
              href="/projects"
              className="glass-card group flex flex-col rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="text-xs text-slate-500">{project.year}</span>
              <h3 className="mt-2 font-display text-lg font-semibold  transition group-hover:text-emerald-300">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">{project.tagline}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.stack.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-slate-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BLOG PREVIEW */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold ">
              From the Blog 📝
            </h2>
            <p className="mt-2 text-slate-400">
              Notes on code, design, and career lessons.
            </p>
          </div>
          <Link href="/blog" className="font-semibold text-emerald-400 hover:text-sky-400">
            Read all posts →
          </Link>
        </div>

        <LatestPosts />
      </section>

      {/* CTA */}
      <section className="mx-auto mb-24 max-w-6xl px-6">
        <div className="glass-card flex flex-col items-center gap-6 rounded-3xl p-10 text-center shadow-glow md:flex-row md:justify-between md:text-left">
          <div>
            <h2 className="font-display text-xl font-bold  md:text-2xl">
              Got a project in mind? Let&apos;s build it. 🛠️
            </h2>
            <p className="mt-2 text-slate-300">
              I reply within 24 hours — send a message and let&apos;s talk details.
            </p>
          </div>
          <Link
            href="/contact"
            className="btn-glow whitespace-nowrap rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-8 py-3 font-semibold text-black shadow-glow transition hover:-translate-y-0.5"
          >
            Start a Project ✉️
          </Link>
        </div>
      </section>
    </>
  );
}
