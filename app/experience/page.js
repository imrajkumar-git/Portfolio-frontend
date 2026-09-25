import { experience } from "@/data/experience";

export const metadata = {
  title: "Experience — Rajkumar Aryal",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm text-emerald-300">
          💼 Career Path
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold ">
          Work Experience
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          {experience.length} roles across retail, design, IT support, and
          software development — each one adding a new skill to the stack.
        </p>
      </div>

      <div className="relative mt-16">
        <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-emerald-400 via-sky-400 to-transparent md:left-1/2" />

        <div className="space-y-12">
          {experience.map((job, idx) => {
            const alignRight = idx % 2 === 1;
            return (
              <div
                key={job.role + job.company}
                className={`relative flex flex-col gap-4 pl-12 md:w-1/2 md:pl-0 ${
                  alignRight
                    ? "md:ml-auto md:pl-12 md:text-left"
                    : "md:mr-auto md:pr-12 md:text-right"
                }`}
              >
                <span
                  className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-emerald-400 to-sky-400 shadow-glow md:left-auto ${
                    alignRight ? "md:-left-1.5" : "md:-right-1.5"
                  }`}
                />

                <div className="glass-card rounded-2xl p-6 transition hover:-translate-y-1 hover:shadow-glow">
                  <div
                    className={`flex flex-wrap items-center gap-2 ${
                      alignRight ? "" : "md:justify-end"
                    }`}
                  >
                    <span className="rounded-full bg-sky-400/10 px-3 py-1 text-xs font-medium text-sky-300">
                      {job.tag}
                    </span>
                    <span className="text-xs text-slate-400">{job.period}</span>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold ">
                    {job.role}
                  </h3>
                  <p className="text-sm font-medium text-emerald-400">
                    {job.company} · {job.location}
                  </p>
                  <ul
                    className={`mt-4 space-y-2 text-sm leading-relaxed text-slate-300 ${
                      alignRight ? "" : "md:ml-auto"
                    }`}
                  >
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-emerald-400">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
