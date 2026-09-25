"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import StarRating from "@/components/StarRating";
import api from "@/lib/api";
import blogApi from "@/lib/blogApi";
import reviewsApi from "@/lib/reviewsApi";

const TABS = [
  { id: "users", label: "Users" },
  { id: "posts", label: "Blog posts" },
  { id: "reviews", label: "Reviews" },
];

const inputCls =
  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400";

function badge(active, activeCls, inactiveCls, activeLabel, inactiveLabel) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${active ? activeCls : inactiveCls}`}>
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

/* ---------------------------- Users tab ---------------------------- */

function EditUserModal({ user, onClose, onSaved }) {
  const [form, setForm] = useState({
    username: user.username,
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    is_staff: user.is_staff,
    is_active: user.is_active,
    is_verified: user.is_verified,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, type, checked, value } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const { data } = await api.patch(`/admin/users/${user.id}/`, form);
      onSaved(data);
    } catch (err) {
      setError("Could not update this user.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl bg-black/80 p-6 shadow-glow">
        <h2 className="mb-1 font-display text-lg font-semibold text-white">Edit user</h2>
        <p className="mb-4 text-sm text-slate-400">{user.email}</p>

        {error && (
          <div className="mb-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
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

          <div className="space-y-2 pt-2">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="is_active" checked={form.is_active} onChange={onChange} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="is_verified" checked={form.is_verified} onChange={onChange} />
              Email verified
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input type="checkbox" name="is_staff" checked={form.is_staff} onChange={onChange} />
              Admin / staff access
            </label>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-white/10 py-2 text-sm font-medium text-slate-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-sky-500 py-2 text-sm font-semibold text-black disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users/");
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onDelete = async (user) => {
    if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user.id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (err) {
      alert(err?.response?.data?.detail || "Could not delete this user.");
    }
  };

  const onSaved = (updated) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditing(null);
  };

  return (
    <div>
      <div className="glass-card overflow-hidden rounded-2xl">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Loading users…</td></tr>
            )}
            {error && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-red-400">{error}</td></tr>
            )}
            {!loading && users.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No users found.</td></tr>
            )}
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-200">{u.username}</div>
                  <div className="text-xs text-slate-500">{u.email}</div>
                </td>
                <td className="px-4 py-3">
                  {badge(u.is_staff, "bg-emerald-400/15 text-emerald-300", "bg-white/10 text-slate-300", "Admin", "Member")}
                </td>
                <td className="space-x-1 px-4 py-3">
                  {badge(u.is_active, "bg-emerald-400/15 text-emerald-300", "bg-red-400/15 text-red-300", "Active", "Disabled")}
                  {badge(u.is_verified, "bg-sky-400/15 text-sky-300", "bg-yellow-400/15 text-yellow-300", "Verified", "Unverified")}
                </td>
                <td className="px-4 py-3 text-slate-400">{new Date(u.date_joined).toLocaleDateString()}</td>
                <td className="space-x-3 px-4 py-3 text-right">
                  <button onClick={() => setEditing(u)} className="font-medium text-emerald-400 hover:text-emerald-300">
                    Edit
                  </button>
                  <button onClick={() => onDelete(u)} className="font-medium text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && <EditUserModal user={editing} onClose={() => setEditing(null)} onSaved={onSaved} />}
    </div>
  );
}

/* --------------------------- Posts tab --------------------------- */

function PostsTab() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    blogApi
      .get("/posts/")
      .then(({ data }) => setPosts(Array.isArray(data) ? data : data.results || []))
      .catch(() => setError("Could not load posts."))
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async (post) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await blogApi.delete(`/posts/${post.slug}/`);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch (err) {
      alert("Could not delete this post.");
    }
  };

  const togglePublish = async (post) => {
    try {
      const { data } = await blogApi.patch(`/posts/${post.slug}/`, {
        is_published: !post.is_published,
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, ...data } : p)));
    } catch (err) {
      alert("Could not update publish status.");
    }
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">Post</th>
            <th className="px-4 py-3 font-medium">Author</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Engagement</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {loading && (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Loading posts…</td></tr>
          )}
          {error && (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-red-400">{error}</td></tr>
          )}
          {!loading && posts.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No posts yet.</td></tr>
          )}
          {posts.map((p) => (
            <tr key={p.id} className="hover:bg-white/5">
              <td className="px-4 py-3">
                <Link href={`/blog/${p.slug}`} className="font-medium text-slate-200 hover:text-emerald-300">
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-400">{p.author.username}</td>
              <td className="px-4 py-3">
                {badge(p.is_published, "bg-emerald-400/15 text-emerald-300", "bg-yellow-400/15 text-yellow-300", "Published", "Draft")}
              </td>
              <td className="px-4 py-3 text-xs text-slate-400">{p.likes_count} likes · {p.comments_count} comments</td>
              <td className="space-x-3 px-4 py-3 text-right">
                <button onClick={() => togglePublish(p)} className="font-medium text-slate-300 hover:text-emerald-300">
                  {p.is_published ? "Unpublish" : "Publish"}
                </button>
                <Link href={`/blog/${p.slug}/edit`} className="font-medium text-emerald-400 hover:text-emerald-300">
                  Edit
                </Link>
                <button onClick={() => onDelete(p)} className="font-medium text-red-400 hover:text-red-300">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* -------------------------- Reviews tab -------------------------- */

function ReviewsTab() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    reviewsApi
      .get("/")
      .then(({ data }) => setReviews(Array.isArray(data) ? data : data.results || []))
      .catch(() => setError("Could not load reviews."))
      .finally(() => setLoading(false));
  }, []);

  const onDelete = async (review) => {
    if (!confirm(`Delete ${review.user.username}'s review?`)) return;
    try {
      await reviewsApi.delete(`/${review.id}/`);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } catch (err) {
      alert("Could not delete this review.");
    }
  };

  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left text-slate-400">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Review</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {loading && (
            <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">Loading reviews…</td></tr>
          )}
          {error && (
            <tr><td colSpan={4} className="px-4 py-6 text-center text-red-400">{error}</td></tr>
          )}
          {!loading && reviews.length === 0 && (
            <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-500">No reviews yet.</td></tr>
          )}
          {reviews.map((r) => (
            <tr key={r.id} className="hover:bg-white/5">
              <td className="px-4 py-3 font-medium text-slate-200">{r.user.username}</td>
              <td className="px-4 py-3"><StarRating value={r.rating} readOnly size={14} /></td>
              <td className="max-w-sm truncate px-4 py-3 text-slate-400">{r.content}</td>
              <td className="px-4 py-3 text-right">
                <button onClick={() => onDelete(r)} className="font-medium text-red-400 hover:text-red-300">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ----------------------------- Page ----------------------------- */

function AdminContent() {
  const [tab, setTab] = useState("users");

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs text-emerald-300">
        🛠️ Staff only
      </span>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">Admin Panel</h1>
      <p className="mb-6 mt-2 text-sm text-slate-400">
        Full access — manage every user, blog post, and review on the site.
      </p>

      <div className="mb-6 flex w-fit gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === t.id
                ? "bg-gradient-to-r from-emerald-500 to-sky-500 text-black"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "users" && <UsersTab />}
      {tab === "posts" && <PostsTab />}
      {tab === "reviews" && <ReviewsTab />}
    </div>
  );
}

export default function AdminPage() {
  return (
    <RequireAuth staffOnly>
      <AdminContent />
    </RequireAuth>
  );
}
