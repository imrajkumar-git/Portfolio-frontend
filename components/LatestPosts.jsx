"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import blogApi from "@/lib/blogApi";

/**
 * The homepage blog teaser. Reads the three newest published posts from the
 * Django API rather than a static array, so a post written
 * at /blog/new shows up here immediately — cover image included.
 */
export default function LatestPosts() {
  const [posts, setPosts] = useState([]);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    blogApi
      .get("/posts/")
      .then(({ data }) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data.results || [];
        setPosts(list.filter((p) => p.is_published).slice(0, 3));
        setState("ready");
      })
      .catch(() => !cancelled && setState("error"));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return (
      <div className="grid gap-6 md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="glass-card h-48 animate-pulse rounded-2xl"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (state === "error") {
    return (
      <p className="text-sm text-slate-500">
        The blog isn&apos;t reachable right now.{" "}
        <Link href="/blog" className="text-emerald-400 hover:text-sky-400">
          Try the blog page
        </Link>
        .
      </p>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <p className="text-slate-300">No posts published yet.</p>
        <Link
          href="/blog/new"
          className="mt-3 inline-block text-sm font-semibold text-emerald-400 hover:text-sky-400"
        >
          Write the first one
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Link
          key={post.slug}
          href={`/blog/${post.slug}`}
          className="glass-card group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1 hover:shadow-skyglow"
        >
          <div className="relative h-36 overflow-hidden bg-gradient-to-br from-emerald-500/30 to-sky-500/30">
            {post.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.cover}
                alt={post.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-3xl font-bold text-white/70">
                {post.title.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <h3 className="line-clamp-2 font-display text-lg font-semibold text-white transition group-hover:text-sky-300">
              {post.title}
            </h3>
            <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-400">
              {post.excerpt || "Click through to read the full post."}
            </p>
            <span className="mt-4 text-xs text-slate-500">
              by {post.author.username}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
