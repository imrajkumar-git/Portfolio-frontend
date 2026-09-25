import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Rajkumar Aryal",
};

const QUICK_CONTACT = [
  {
    emoji: "📧",
    label: "Email",
    value: "rajkumararyal0977@gmail.com",
    href: "mailto:rajkumararyal0977@gmail.com",
  },
  {
    emoji: "📞",
    label: "Phone",
    value: "+971 054 780 9320",
    href: "tel:+9710547809320",
  },
  {
    emoji: "📍",
    label: "Location",
    value: "Baniyas East-8, Abu Dhabi, UAE",
    href: null,
  },
];

const FAQS = [
  {
    q: "How fast do you reply?",
    a: "Usually within 24 hours — often sooner on weekdays.",
  },
  {
    q: "Do you take freelance and full-time work?",
    a: "Both — send the details and I'll let you know if it's a fit.",
  },
  {
    q: "What kind of projects do you take on?",
    a: "Full-stack web apps, backend APIs, dashboards, and design-to-code builds.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
          ✉️ Get In Touch
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold ">
          Let&apos;s build something together 🤝
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400">
          Have a project, a role, or just an idea you want to talk through?
          Fill in the form below and I&apos;ll get back to you soon.
        </p>
      </div>

      {/* Quick contact tiles */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {QUICK_CONTACT.map((item) => {
          const Wrapper = item.href ? "a" : "div";
          return (
            <Wrapper
              key={item.label}
              href={item.href || undefined}
              className="glass-card flex flex-col items-center gap-2 rounded-2xl px-4 py-6 text-center transition hover:-translate-y-1 hover:shadow-glow"
            >
              <span className="text-2xl">{item.emoji}</span>
              <p className="text-xs uppercase tracking-wide text-slate-400">
                {item.label}
              </p>
              <p className="text-sm font-medium ">{item.value}</p>
            </Wrapper>
          );
        })}
      </div>

      {/* Form */}
      <div className="mt-14">
        <ContactForm />
      </div>

      {/* FAQ */}
      <div className="mt-16">
        <h2 className="text-center font-display text-xl font-semibold text-white">
          Quick answers ❓
        </h2>
        <div className="mx-auto mt-6 max-w-2xl space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="glass-card group rounded-xl px-5 py-3 text-sm open:shadow-glow"
            >
              <summary className="cursor-pointer list-none font-medium text-slate-100 marker:content-none">
                <span className="mr-2 text-emerald-400">▸</span>
                {item.q}
              </summary>
              <p className="mt-2 pl-5 text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
