"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import CoverImagePicker from "@/components/CoverImagePicker";
import blogApi from "@/lib/blogApi";
import { errorMessage } from "@/lib/errors";
import BLOG_CATEGORIES from "@/lib/categories";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400";

function NewPostForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: BLOG_CATEGORIES[0].id,
    is_published: true,
  });
  const [coverFile, setCoverFile] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      // Multipart, so the picked file rides along with the text fields.
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("excerpt", form.excerpt);
      payload.append("content", form.content);
      payload.append("is_published", form.is_published ? "true" : "false");
      payload.append("category", form.category);
      if (coverFile) payload.append("cover_image", coverFile);

      const { data } = await blogApi.post("/posts/", payload);
      router.push(`/blog/${data.slug}`);
    } catch (err) {
      setError(errorMessage(err, "Could not publish this post. Please try again."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
        ✍️ New post
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Write a new post</h1>
      <p className="mb-8 mt-2 text-sm text-slate-400">Share something with the community.</p>

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
          disabled={saving}
          onChange={({ file }) => setCoverFile(file)}
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
          <label className="mb-1.5 block text-xs font-medium text-slate-300">
            Short excerpt (optional)
          </label>
          <input
            name="excerpt"
            value={form.excerpt}
            onChange={onChange}
            maxLength={300}
            placeholder="A one-line summary shown on the blog list"
            className={inputCls}
          />
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
          Publish immediately (uncheck to save as a private draft)
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-6 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Publishing…" : "Publish post"}
        </button>
      </form>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <RequireAuth>
      <NewPostForm />
    </RequireAuth>
  );
}
