"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import Avatar from "@/components/Avatar";
import api from "@/lib/api";
import blogApi from "@/lib/blogApi";

const SOCIAL_FIELDS = [
  { name: "website_url", label: "Website" },
  { name: "twitter_url", label: "Twitter / X" },
  { name: "instagram_url", label: "Instagram" },
  { name: "linkedin_url", label: "LinkedIn" },
  { name: "github_url", label: "GitHub" },
];

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400";

function ProfileForm() {
  const { user, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    username: user?.username || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    bio: user?.bio || "",
    website_url: user?.website_url || "",
    twitter_url: user?.twitter_url || "",
    instagram_url: user?.instagram_url || "",
    linkedin_url: user?.linkedin_url || "",
    github_url: user?.github_url || "",
  });
  const [pictureFile, setPictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profile_picture || null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPictureFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => data.append(key, value));
      if (pictureFile) data.append("profile_picture", pictureFile);

      await api.patch("/profile/", data);
      await refreshProfile();
      setMessage("Your profile was updated successfully.");
      setPictureFile(null);
    } catch (err) {
      setError("Could not update your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-glow sm:p-8">
      <h2 className="mb-6 font-display font-semibold text-white">Edit profile</h2>

      {message && (
        <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={onSave} className="space-y-5">
        <div className="flex items-center gap-4">
          <Avatar user={{ ...user, profile_picture: previewUrl }} size={64} />
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-emerald-400/30 px-3 py-1.5 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/10"
            >
              Change photo
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} className="hidden" />
            <p className="mt-1 text-xs text-slate-500">JPG or PNG, square images look best.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-300">Username</label>
            <input name="username" value={form.username} onChange={onChange} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">First name</label>
              <input name="first_name" value={form.first_name} onChange={onChange} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-300">Last name</label>
              <input name="last_name" value={form.last_name} onChange={onChange} className={inputCls} />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-300">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={3}
            maxLength={500}
            placeholder="A short line about yourself"
            className={inputCls}
          />
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-slate-300">Social links</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {SOCIAL_FIELDS.map((f) => (
              <div key={f.name}>
                <label className="mb-1 block text-xs text-slate-500">{f.label}</label>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={onChange}
                  placeholder="https://…"
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-5 py-2.5 text-sm font-semibold text-black shadow-glow transition hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function AccountInfo() {
  const { user } = useAuth();
  return (
    <div className="glass-card rounded-3xl p-6 shadow-glow sm:p-8">
      <h2 className="mb-4 font-display font-semibold text-white">Account info</h2>
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-slate-500">Email</dt>
          <dd className="font-medium text-slate-200">{user.email}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Verified</dt>
          <dd className="font-medium text-emerald-400">{user.is_verified ? "Yes" : "No"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Role</dt>
          <dd className="font-medium text-slate-200">{user.is_staff ? "Administrator" : "Member"}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Joined</dt>
          <dd className="font-medium text-slate-200">{new Date(user.date_joined).toLocaleDateString()}</dd>
        </div>
      </dl>
    </div>
  );
}

function MyPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    blogApi
      .get("/posts/")
      .then(({ data }) => {
        const list = Array.isArray(data) ? data : data.results || [];
        setPosts(list.filter((p) => p.author.username === user.username));
      })
      .catch(() => setError("Could not load your posts."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user.username]);

  const onDelete = async (slug) => {
    if (!confirm("Delete this post?")) return;
    try {
      await blogApi.delete(`/posts/${slug}/`);
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err) {
      alert("Could not delete this post.");
    }
  };

  const togglePublish = async (post) => {
    try {
      const { data } = await blogApi.patch(`/posts/${post.slug}/`, {
        is_published: !post.is_published,
      });
      setPosts((prev) => prev.map((p) => (p.slug === data.slug ? { ...p, ...data } : p)));
    } catch (err) {
      alert("Could not update publish status.");
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 shadow-glow sm:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-semibold text-white">My posts</h2>
        <Link href="/blog/new" className="text-sm font-medium text-emerald-400 hover:text-emerald-300">
          + New post
        </Link>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {loading && <p className="text-sm text-slate-500">Loading…</p>}
      {!loading && posts.length === 0 && (
        <p className="text-sm text-slate-500">You haven&apos;t written any posts yet.</p>
      )}

      <div className="divide-y divide-white/10">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <Link href={`/blog/${post.slug}`} className="block truncate font-medium text-slate-200 hover:text-emerald-300">
                {post.title}
              </Link>
              <p className="text-xs text-slate-500">
                {post.is_published ? "Published" : "Draft"} · {post.likes_count} likes · {post.comments_count} comments
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <button onClick={() => togglePublish(post)} className="text-slate-400 hover:text-emerald-300">
                {post.is_published ? "Unpublish" : "Publish"}
              </button>
              <Link href={`/blog/${post.slug}/edit`} className="text-emerald-400 hover:text-emerald-300">
                Edit
              </Link>
              <button onClick={() => onDelete(post.slug)} className="text-red-400 hover:text-red-300">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
          👋 Your space
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-white">My Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">This is your own account data — only you can see and edit it.</p>
      </div>

      <div className="grid items-start gap-6 sm:grid-cols-2">
        <AccountInfo />
        <ProfileForm />
      </div>

      <div className="mt-6">
        <MyPosts />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}
