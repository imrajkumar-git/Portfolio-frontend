"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children, staffOnly = false }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (staffOnly && !user.is_staff) {
      router.replace("/dashboard");
    }
  }, [user, loading, staffOnly, router]);

  if (loading || !user || (staffOnly && !user.is_staff)) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-24 text-center text-slate-400">
        Loading…
      </div>
    );
  }

  return children;
}
