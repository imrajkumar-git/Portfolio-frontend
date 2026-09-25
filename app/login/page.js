"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth, isUnverifiedAccountError } from "@/context/AuthContext";
import { errorMessage } from "@/lib/errors";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const justVerified = params.get("verified") === "1";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPending(false);
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      if (isUnverifiedAccountError(err)) {
        setPending(true);
      } else {
        setError(errorMessage(err, "Login failed. Please check your credentials."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-md px-6 py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-10 -z-10 mx-auto h-72 max-w-lg bg-grid-glow blur-3xl"
      />

      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
          🔐 Member Login
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-white sm:text-4xl">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-400">Log in to comment, post, and leave a review.</p>
      </div>

      <div className="glass-card mt-8 rounded-3xl p-6 shadow-glow sm:p-8">
        {justVerified && (
          <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
            You&apos;re verified! You can now log in.
          </div>
        )}
        {pending && (
          <div className="mb-4 rounded-xl border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-300">
            🕒 Your account is still waiting on admin verification. Please check back soon.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              required
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
