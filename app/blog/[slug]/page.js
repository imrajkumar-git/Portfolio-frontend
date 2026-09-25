"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import blogApi from "@/lib/blogApi";
import { categoryIcon, categoryLabel } from "@/lib/categories";

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function LikeButton({ post, onToggled }) {
  const { user } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      const { data } = await blogApi.post(`/posts/${post.slug}/like/`);
      onToggled(data);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={busy}
      className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
        post.liked_by_me
          ? "border-red-400/40 bg-red-400/10 text-red-300"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-emerald-400/40"
      }`}
    >
      {post.liked_by_me ? "❤️" : "🤍"} {post.likes_count} {post.likes_count === 1 ? "Like" : "Likes"}
    </button>
  );
}

function CommentSection({ post }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(post.comments || []);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    setError("");
    try {
      const { data } = await blogApi.post(`/posts/${post.slug}/comments/`, { content: text });
      setComments((prev) => [...prev, data]);
      setText("");
    } catch (err) {
      setError("Could not post your comment.");
    } finally {
      setPosting(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this comment?")) return;
    try {
      await blogApi.delete(`/comments/${id}/`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert("Could not delete this comment.");
    }
  };

  return (
    <div className="mt-10">
      <h2 className="mb-4 font-display font-semibold text-white">
        {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
      </h2>

      {user ? (
        <form onSubmit={onSubmit} className="mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Add a comment…"
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={posting}
            className="mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-4 py-2 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
          >
            {posting ? "Posting…" : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="mb-6 text-sm text-slate-500">
          <Link href="/login" className="font-medium text-emerald-400 hover:text-emerald-300">
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-xs font-semibold text-black">
              {c.user.username.slice(0, 2).toUpperCase()}
            </span>
            <div className="flex-1 rounded-xl bg-white/5 px-4 py-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-200">{c.user.username}</span>
                <span className="text-xs text-slate-500">{timeAgo(c.created_at)}</span>
              </div>
              <p className="mt-1 text-sm text-slate-300">{c.content}</p>
              {user && (user.username === c.user.username || user.is_staff) && (
                <button onClick={() => onDelete(c.id)} className="mt-1 text-xs text-red-400 hover:text-red-300">
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-slate-500">No comments yet — be the first to say something.</p>
        )}
      </div>
    </div>
  );
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    blogApi
      .get(`/posts/${slug}/`)
      .then(({ data }) => setPost(data))
      .catch(() => setError("This post could not be found."))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  const onDeletePost = async () => {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    try {
      await blogApi.delete(`/posts/${slug}/`);
      router.push("/blog");
    } catch (err) {
      alert("Could not delete this post.");
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-3xl px-6 py-24 text-center text-slate-500">Loading…</div>;
  }

  if (error || !post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-slate-400">{error || "Post not found."}</p>
        <Link href="/blog" className="mt-3 inline-block font-medium text-emerald-400 hover:text-emerald-300">
          ← Back to blog
        </Link>
      </div>
    );
  }

  const canManage = user && (user.username === post.author.username || user.is_staff);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/blog" className="text-sm text-slate-500 hover:text-emerald-300">
        ← Back to blog
      </Link>

      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt={post.title}
          className="mt-4 h-72 w-full rounded-2xl border border-white/10 object-cover"
        />
      )}

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          {post.category && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              {categoryIcon(post.category)} {categoryLabel(post.category)}
            </span>
          )}
          <h1 className="font-display text-3xl font-bold text-white">{post.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            by <span className="font-medium text-slate-300">{post.author.username}</span> · {timeAgo(post.created_at)}
            {!post.is_published && <span className="ml-2 font-medium text-yellow-400">(Draft)</span>}
          </p>
        </div>

        {canManage && (
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/blog/${post.slug}/edit`}
              className="rounded-lg border border-emerald-400/30 px-3 py-1.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/10"
            >
              Edit
            </Link>
            <button
              onClick={onDeletePost}
              className="rounded-lg border border-red-400/30 px-3 py-1.5 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <div className="prose prose-invert mt-6 max-w-none whitespace-pre-wrap leading-relaxed text-slate-300">
        {post.content}
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <LikeButton post={post} onToggled={(data) => setPost((p) => ({ ...p, ...data }))} />
      </div>

      <CommentSection post={post} />
    </article>
  );
}
