"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import CoverImagePicker from "@/components/CoverImagePicker";
import { useAuth } from "@/context/AuthContext";
import blogApi from "@/lib/blogApi";
import { errorMessage } from "@/lib/errors";
import BLOG_CATEGORIES from "@/lib/categories";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400";

function EditPostForm() {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [form, setForm] = useState(null);
  const [existingCover, setExistingCover] = useState("");
  const [cover, setCover] = useState({ file: null, removed: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    blogApi
      .get(`/posts/${slug}/`)
      .then(({ data }) => {
        if (!(user.username === data.author.username || user.is_staff)) {
          router.replace(`/blog/${slug}`);
          return;
        }
        setForm({
          title: data.title,
          excerpt: data.excerpt || "",
          content: data.content,
          category: data.category || BLOG_CATEGORIES[0].id,
          is_published: data.is_published,
        });
        setExistingCover(data.cover || "");
      })
      .catch(() => setError("Could not load this post."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("excerpt", form.excerpt);
      payload.append("content", form.content);
      payload.append("is_published", form.is_published ? "true" : "false");
      payload.append("category", form.category);

      if (cover.file) {
        payload.append("cover_image", cover.file);
      } else if (cover.removed) {
        // Tells the API to delete the stored file rather than keep it.
        payload.append("remove_cover_image", "true");
      }

      await blogApi.patch(`/posts/${slug}/`, payload);
      router.push(`/blog/${slug}`);
    } catch (err) {
      setError(errorMessage(err, "Could not save your changes."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-2xl px-6 py-24 text-center text-slate-500">Loading…</div>;
  }

  if (error && !form) {
    return <div className="mx-auto max-w-2xl px-6 py-24 text-center text-slate-400">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="mb-8 font-display text-3xl font-bold text-white">Edit post</h1>

      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="glass-card space-y-5 rounded-3xl p-6 shadow-glow sm:p-8">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">Title</label>
          <input name="title" value={form.title} onChange={onChange} required className={inputCls} />
        </div>

        <CoverImagePicker
          existingUrl={existingCover}
          disabled={saving}
          onChange={setCover}
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className={inputCls}
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-black text-white">
                {cat.icon} {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">Excerpt</label>
          <input name="excerpt" value={form.excerpt} onChange={onChange} maxLength={300} className={inputCls} />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">Content</label>
          <textarea
            name="content"
            value={form.content}
            onChange={onChange}
            required
            rows={10}
            className={`${inputCls} font-mono`}
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input type="checkbox" name="is_published" checked={form.is_published} onChange={onChange} />
          Published
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <RequireAuth>
      <EditPostForm />
    </RequireAuth>
  );
}
