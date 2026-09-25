"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import reviewsApi from "@/lib/reviewsApi";
import StarRating from "@/components/StarRating";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function ReviewForm({ existing, onSaved }) {
  const [rating, setRating] = useState(existing?.rating || 5);
  const [content, setContent] = useState(existing?.content || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await reviewsApi.post("/", { rating, content });
      onSaved(data);
    } catch (err) {
      setError("Could not submit your review.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="glass-card rounded-3xl p-6 shadow-glow">
      <h3 className="mb-3 font-display font-semibold text-white">
        {existing ? "Update your review" : "Leave a review"}
      </h3>
      {error && <p className="mb-2 text-sm text-red-400">{error}</p>}
      <div className="mb-3">
        <StarRating value={rating} onChange={setRating} size={26} />
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        required
        placeholder="What did you think?"
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
      />
      <button
        type="submit"
        disabled={saving}
        className="mt-3 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
      >
        {saving ? "Saving…" : existing ? "Update review" : "Submit review"}
      </button>
    </form>
  );
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const { data } = await reviewsApi.get("/");
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.results || [];
        setReviews(list);

        if (user) {
          const mine = await reviewsApi.get("/mine/");
          if (!cancelled) setMyReview(mine.data);
        }
      } catch (err) {
        if (!cancelled) setError("Could not load reviews.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const onSaved = (data) => {
    setMyReview(data);
    setReviews((prev) => {
      const exists = prev.some((r) => r.id === data.id);
      return exists ? prev.map((r) => (r.id === data.id ? data : r)) : [data, ...prev];
    });
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
          ⭐ What people say
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold">Member reviews</h1>
        {avgRating && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <StarRating value={Math.round(avgRating)} readOnly size={22} />
            <span className="font-medium text-slate-200">{avgRating} / 5</span>
            <span className="text-sm text-slate-500">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        <div className="sm:col-span-1">
          {user ? (
            <ReviewForm existing={myReview} onSaved={onSaved} />
          ) : (
            <div className="glass-card rounded-3xl p-6 text-sm text-slate-400">
              <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
                Log in
              </Link>{" "}
              to leave your own review.
            </div>
          )}
        </div>

        <div className="space-y-4 sm:col-span-2">
          {error && (
            <div className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/5" />
              ))}
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <p className="py-12 text-center text-slate-500">No reviews yet — be the first!</p>
          )}

          {!loading &&
            reviews.map((r) => (
              <div key={r.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-xs font-semibold text-black">
                      {r.user.username.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{r.user.username}</p>
                      <StarRating value={r.rating} readOnly size={14} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{timeAgo(r.created_at)}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{r.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
