import Image from "next/image";
import { education, skills, languages } from "@/data/experience";

export const metadata = {
  title: "About — Rajkumar Aryal",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-14 md:grid-cols-2 md:items-center">
        <div className="relative mx-auto h-80 w-72 sm:h-96 sm:w-80">
          <div className="absolute -inset-3 -z-10 rounded-[2.5rem] bg-gradient-to-br from-sky-500/30 to-emerald-500/30 blur-2xl" />
          <div className="glass-card h-full w-full overflow-hidden rounded-[2rem] p-2 shadow-skyglow">
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
              <Image
                src="/about-portrait.jpg"
                alt="Rajkumar Aryal portrait"
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-sm text-sky-300">
            👋 About Me
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold ">
            Curious builder, reliable teammate 🌱
          </h1>
          <p className="mt-5 leading-relaxed text-slate-300">
            I&apos;m a Computer Engineering graduate (TEVT Diploma) currently
            based in Baniyas, Abu Dhabi. My path has been a little unusual —
            I&apos;ve worked hypermarket floors and fuel-retail counters
            while building backend applications, designing brand visuals, and
            configuring networks on the side. That mix taught me something
            most developers learn later: how to stay calm under pressure,
            communicate clearly, and get things exactly right the first time.
          </p>
          <p className="mt-4 leading-relaxed text-slate-300">
            Today I&apos;m focused on full-stack web development — Python and
            JavaScript on the backend, React/Next.js on the front, and a
            genuine love for clean, colourful interfaces shaped by my
            graphic-design background. 🎨💻
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {languages.map((lang) => (
              <span
                key={lang.name}
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300"
              >
                {lang.name} · {lang.level}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div className="mt-24">
        <h2 className="font-display text-2xl font-bold ">
          Skills & Toolkit 🧰
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className="glass-card rounded-2xl p-6">
              <h3 className="font-display text-sm font-semibold uppercase text-sky-400">
                {group}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EDUCATION */}
      <div className="mt-24">
        <h2 className="font-display text-2xl font-bold">
          Education 🎓
        </h2>
        <div className="mt-8 space-y-5">
          {education.map((item) => (
            <div
              key={item.title}
              className="glass-card flex flex-col justify-between gap-2 rounded-2xl p-6 sm:flex-row sm:items-center"
            >
              <div>
                <h3 className="font-display font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400">{item.school}</p>
              </div>
              <span className="w-fit rounded-full bg-emerald-400/10 px-4 py-1 text-sm text-emerald-300">
                {item.period}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
