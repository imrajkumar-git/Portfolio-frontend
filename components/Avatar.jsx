"use client";

const AUTH_MEDIA_ROOT = (
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/auth"
).replace(/\/api\/auth\/?$/, "");

export default function Avatar({ user, size = 32 }) {
  const initials = (user?.username || user?.email || "?").slice(0, 2).toUpperCase();
  // Support either field name the backend/profile form might use, so a
  // freshly-registered user with no uploaded picture always falls back
  // cleanly to the initials badge below instead of a broken image.
  const raw = user?.profile_picture || user?.avatar || null;
  const avatarUrl = raw ? (raw.startsWith("http") || raw.startsWith("blob:") ? raw : `${AUTH_MEDIA_ROOT}${raw}`) : null;

  if (avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl}
        alt={user.username || "avatar"}
        width={size}
        height={size}
        className="rounded-full object-cover ring-1 ring-emerald-400/40"
        style={{ width: size, height: size }}
      />
    );
  }

  // Default profile icon: gradient badge with the user's initials.
  return (
    <span
      className="flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 font-display text-xs font-bold text-black"
      style={{ width: size, height: size }}
    >
      {initials}
    </span>
  );
}
