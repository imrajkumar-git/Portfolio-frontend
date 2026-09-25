# Rajkumar Aryal — Developer Portfolio + Community Platform

A colourful, animated developer portfolio built with **Next.js 14 (App Router)**,
**Tailwind CSS**, **Bootstrap**, **Three.js**, and vanilla **CSS3/JavaScript** —
now combined with a real **JWT + email-OTP auth system, blog, and reviews wall**
backed by the Django REST API in `../backend`. See the top-level `../README.md`
for how to run both halves together.

New, on top of the original portfolio:

- 🔐 `/login`, `/signup`, `/verify` — email/password auth with 6-digit OTP verification
- 🧑‍💻 `/dashboard` — edit your profile (avatar, bio, social links), manage your posts
- 🛠️ `/admin` — staff-only panel to manage users, blog posts, and reviews
- 📝 `/blog` — now a **real, database-backed** blog: anyone can read, verified
  users can write, like, and comment
- ⭐ `/reviews` — a public testimonials wall where verified users can rate & review

## ✨ Features

- Animated hero background — a Three.js starfield/light-rain effect that
  streams from top to bottom (`components/StarField.jsx`)
- Pages: Home, About, Experience (timeline), Blog, Contact
- Advanced responsive navbar with active-link highlighting + mobile menu
- Rich footer with contact links and social icons
- Light / dark theme toggle (persisted in `localStorage`)
- Working contact form wired to a Next.js API route (`app/api/contact/route.js`)
  — ready to connect to Resend / Nodemailer / SendGrid
- Green + black + sky-blue colour system, glowing buttons, glassmorphism cards
- Your logo and photos already dropped into `/public`

## 🚀 Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## 📁 Where things live

| What                      | File |
|---------------------------|------|
| Colours / theme tokens    | `tailwind.config.js` |
| Global styles             | `app/globals.css` |
| Starfield animation       | `components/StarField.jsx` |
| Navbar / Footer           | `components/Navbar.jsx`, `components/Footer.jsx` |
| Experience & skills data  | `data/experience.js` |
| Blog posts                | `data/blogs.js` |
| Contact form + API route  | `components/ContactForm.jsx`, `app/api/contact/route.js` |

## ✍️ Adding a new blog post

Open `data/blogs.js` and add a new object to the array:

```js
{
  slug: "my-new-post",
  title: "My New Post Title",
  excerpt: "One or two sentences describing the post.",
  date: "2026-09-01",
  tag: "Development",
  emoji: "🚀",
},
```

It will automatically appear on the `/blog` page.

## 📬 Wiring up the contact form to send real emails

`app/api/contact/route.js` currently logs submissions to the server console.
To actually deliver messages to your inbox, add an email provider such as
[Resend](https://resend.com) or Nodemailer + SMTP, and call it inside that
route handler using your own API key (stored in `.env.local`, never committed).

## 🖼️ Replacing images / logo

Swap the files in `/public` — keep the same filenames
(`logo.png`, `hero-portrait.jpg`, `about-portrait.jpg`) or update the
`src` paths in `components/Navbar.jsx`, `app/page.js`, and `app/about/page.js`.

## 🎨 Colour system

| Token      | Hex       | Usage                     |
|------------|-----------|---------------------------|
| Ink/void   | `#050807` | Background (dark mode)    |
| Emerald    | `#1fc879` / `#3ddc91` | Primary accent |
| Sky        | `#2fb2f4` / `#5cc9ff` | Secondary accent |

Deploy anywhere that supports Next.js — Vercel is the fastest path
(`vercel deploy`).
"# Portfolio-frontend" 
