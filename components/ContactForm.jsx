"use client";

import { useState } from "react";

const initialState = { name: "", email: "", budget: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email, and message.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please email me directly instead.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card mx-auto max-w-3xl space-y-5 rounded-3xl p-6 shadow-glow sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
            🧑 Your Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
            📧 Email Address
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
          💰 Project Budget (optional)
        </label>
        <select
          name="budget"
          value={form.budget}
          onChange={handleChange}
          className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          <option value="">Select a range</option>
          <option value="< $500">Under $500</option>
          <option value="$500 - $2,000">$500 – $2,000</option>
          <option value="$2,000 - $5,000">$2,000 – $5,000</option>
          <option value="$5,000+">$5,000+</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-300">
          📝 Project Details
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell me a bit about what you're building..."
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-2 text-xs text-red-300">
          ⚠️ {error}
        </p>
      )}
      {status === "success" && (
        <p className="rounded-xl bg-emerald-500/10 px-4 py-2 text-xs text-emerald-300">
          ✅ Message sent — thanks for reaching out! I&apos;ll reply soon.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-glow w-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === "sending" ? "Sending... ⏳" : "Send Message 🚀"}
      </button>
    </form>
  );
}
