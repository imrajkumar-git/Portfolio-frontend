"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import blogApi from "@/lib/blogApi";
import BLOG_CATEGORIES, { categoryIcon, categoryLabel } from "@/lib/categories";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function PostCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="glass-card group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-glow"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-emerald-500/40 to-sky-500/40">
        {post.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-white/80">
            {post.title.slice(0, 1).toUpperCase()}
          </div>
        )}
        {!post.is_published && (
          <span className="absolute left-3 top-3 rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-semibold text-yellow-900">
            Draft
          </span>
        )}
        {post.category && (
          <span className="scrim absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
            {categoryIcon(post.category)} {categoryLabel(post.category)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-white transition group-hover:text-emerald-300">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-400">
          {post.excerpt || "No excerpt yet — click to read the full post."}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            by <span className="font-medium text-slate-300">{post.author.username}</span> · {timeAgo(post.created_at)}
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              ❤️ {post.likes_count}
            </span>
            <span className="flex items-center gap-1">
              💬 {post.comments_count}
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogListPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    blogApi
      .get("/posts/")
      .then(({ data }) => {
        if (!cancelled) setPosts(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => !cancelled && setError("Could not load blog posts."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // Only categories actually in use get a pill, plus "All" — so the row
  // never looks empty even before every post has a category assigned.
  const usedCategories = useMemo(() => {
    const ids = new Set(posts.map((p) => p.category).filter(Boolean));
    return BLOG_CATEGORIES.filter((c) => ids.has(c.id));
  }, [posts]);

  const filtered = posts.filter((p) => {
    const matchesQuery = (p.title + " " + (p.excerpt || "")).toLowerCase().includes(query.toLowerCase());
    // Posts without a category (e.g. written before categories existed)
    // stay visible under every filter instead of disappearing.
    const matchesCategory =
      activeCategory === "all" || !p.category || p.category === activeCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-1.5 text-sm text-sky-300">
          📝 Community Blog
        </span>
        <h1 className="mt-5 font-display text-3xl font-bold  sm:text-4xl">
          Stories, ideas &amp; updates
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Written by me and by members of the community. Log in to like, comment, and share your own.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 sm:w-80"
          />
          {user ? (
            <Link
              href="/blog/new"
              className="whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
            >
              + Write a post
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:border-emerald-400/40"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-xl bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Category filter pills — always shows "All" plus every category,
            so there's always more than 5 to browse even before posts exist
            in all of them. */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              activeCategory === "all"
                ? "border-emerald-400/60 bg-gradient-to-r from-emerald-500 to-sky-500 text-black shadow-glow"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/40"
            }`}
          >
            🗂️ All
          </button>
          {BLOG_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                activeCategory === cat.id
                  ? "border-emerald-400/60 bg-gradient-to-r from-emerald-500 to-sky-500 text-black shadow-glow"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/40"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16">
        {error && (
          <div className="mb-6 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="py-16 text-center text-slate-500">
            {query || activeCategory !== "all"
              ? "No posts match your filters."
              : "No posts yet — be the first to write one!"}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
