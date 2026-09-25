"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { errorMessage } from "@/lib/errors";
import BLOG_CATEGORIES from "@/lib/categories";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400";
const labelCls = "mb-1.5 block text-xs font-medium text-slate-300";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: "",
    password: "",
    password2: "",
    bio: "",
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleCategory = (id) => {
    setCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      await register({ ...form, preferred_categories: categories });
      router.push(`/verify?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(errorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-2xl px-6 py-20">
      {/* soft glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 mx-auto h-72 max-w-lg bg-grid-glow blur-3xl"
      />

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
          ✨ Join the community
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Sign up to comment, write posts, and share reviews. An admin reviews new accounts
          before they can log in — usually pretty quick.
        </p>
      </div>

      <div className="glass-card mt-8 rounded-3xl p-6 shadow-glow sm:p-8">
        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {/* --- Personal details --- */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">
                1
              </span>
              Your details
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>First name</label>
                <input
                  name="first_name"
                  value={form.first_name}
                  onChange={onChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Last name</label>
                <input
                  name="last_name"
                  value={form.last_name}
                  onChange={onChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Username</label>
                <input
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  required
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone number (optional)</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={onChange}
                  placeholder="+971 5x xxx xxxx"
                  className={inputCls}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  required
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* --- Security --- */}
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">
                2
              </span>
              Set a password
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  required
                  minLength={8}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Confirm password</label>
                <input
                  type="password"
                  name="password2"
                  value={form.password2}
                  onChange={onChange}
                  required
                  minLength={8}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* --- Blog interests --- */}
          <div>
            <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/15 text-xs text-emerald-300">
                3
              </span>
              What do you want to write about?
            </p>
            <p className="mb-3 text-xs text-slate-500">
              Pick as many as you like — this just helps tailor your dashboard. Optional.
            </p>
            <div className="flex flex-wrap gap-2">
              {BLOG_CATEGORIES.map((cat) => {
                const active = categories.includes(cat.id);
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-emerald-400/60 bg-gradient-to-r from-emerald-500 to-sky-500 text-black shadow-glow"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/40"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- Bio --- */}
          <div>
            <label className={labelCls}>Short bio (optional)</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={onChange}
              rows={3}
              maxLength={500}
              placeholder="A line or two about yourself — shown on your public profile"
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
