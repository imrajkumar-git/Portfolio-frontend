"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PendingApprovalContent() {
  const params = useSearchParams();
  const email = params.get("email") || "";

  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-xs text-sky-300">
          🕒 One more step
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold text-white">Account created!</h1>
        <p className="mt-2 text-sm text-slate-400">
          Thanks for signing up{email ? `, ${email}` : ""}. Your account is now waiting for an
          admin to verify it — you&apos;ll be able to log in as soon as that&apos;s done.
        </p>
      </div>

      <div className="glass-card mt-8 rounded-3xl p-6 text-center shadow-glow sm:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-sky-500/20 text-3xl">
          ✅
        </div>
        <h2 className="mt-4 font-display text-lg font-semibold text-white">Pending verification</h2>
        <p className="mt-2 text-sm text-slate-400">
          There&apos;s nothing else for you to do right now. This usually doesn&apos;t take long —
          feel free to try logging in, and we&apos;ll let you know if it&apos;s not ready yet.
        </p>

        <Link
          href="/login"
          className="mt-6 inline-block w-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
        >
          Go to login
        </Link>
        <Link
          href="/"
          className="mt-3 block text-sm font-medium text-slate-400 hover:text-emerald-300"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

export default function PendingApprovalPage() {
  return (
    <Suspense fallback={null}>
      <PendingApprovalContent />
    </Suspense>
  );
}
