"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Nova Glow: sliding highlight pill behind the hovered/active link,
  // plus a soft radial spotlight that tracks the cursor across the pill.
  const pillRef = useRef(null);
  const linkRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });
  const [hoveredHref, setHoveredHref] = useState(null);
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

  const activeHref = LINKS.find((l) => l.href === pathname)?.href ?? null;
  const targetHref = hoveredHref ?? activeHref;

  const moveIndicatorTo = (href) => {
    const el = linkRefs.current[href];
    const pill = pillRef.current;
    if (!el || !pill) {
      setIndicator((i) => ({ ...i, opacity: 0 }));
      return;
    }
    const elRect = el.getBoundingClientRect();
    const pillRect = pill.getBoundingClientRect();
    setIndicator({
      left: elRect.left - pillRect.left,
      width: elRect.width,
      opacity: 1,
    });
  };

  useEffect(() => {
    moveIndicatorTo(targetHref);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetHref, pathname]);

  useEffect(() => {
    const onResize = () => moveIndicatorTo(targetHref);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetHref]);

  const handlePillMouseMove = (e) => {
    const pill = pillRef.current;
    if (!pill) return;
    const rect = pill.getBoundingClientRect();
    setSpotlight({ x: e.clientX - rect.left, y: e.clientY - rect.top, opacity: 1 });
  };
  const handlePillMouseLeave = () => {
    setSpotlight((s) => ({ ...s, opacity: 0 }));
    setHoveredHref(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`site-navbar sticky top-0 z-50 cursor-default ${scrolled ? "is-scrolled" : ""}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
              <Image src="/logo.png" alt="RK logo" width={86} height={36} />
      
          <span className="nav-logo-text font-display">
            <span>rajkumar</span>
            <span className="nav-wordmark-dot">.</span>
            <span className="nav-wordmark-tld">dev</span>
          </span>
        </Link>

        <ul
          ref={pillRef}
          className="nav-pill nova-glow-pill relative hidden items-center gap-0.5 rounded-full p-1.5 lg:flex"
          onMouseMove={handlePillMouseMove}
          onMouseLeave={handlePillMouseLeave}
        >
          <span
            className="nova-glow-spotlight"
            style={{
              opacity: spotlight.opacity,
              transform: `translate(${spotlight.x}px, ${spotlight.y}px)`,
            }}
            aria-hidden="true"
          />
          <span
            className="nova-glow-indicator"
            style={{
              transform: `translateX(${indicator.left}px)`,
              width: indicator.width,
              opacity: indicator.opacity,
            }}
            aria-hidden="true"
          />
          {LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href} className="relative z-10">
                <Link
                  href={link.href}
                  ref={(el) => {
                    linkRefs.current[link.href] = el;
                  }}
                  onMouseEnter={() => setHoveredHref(link.href)}
                  className={`nav-link nova-glow-link block whitespace-nowrap rounded-full px-3.5 py-2 xl:px-4 ${
                    active ? "is-active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {loading ? (
            <div className="nav-pill h-9 w-9 animate-pulse rounded-full" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="nav-icon-btn flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3"
              >
                <Avatar user={user} size={30} />
                <span className="nav-user-name max-w-[110px] truncate font-medium">
                  {user.username || user.email}
                </span>
              </button>

              {menuOpen && (
                <div className="nav-dropdown absolute right-0 mt-2.5 w-52 rounded-xl py-1 text-sm shadow-glow">
                  <div className="nav-dropdown-email truncate px-4 py-2">{user.email}</div>
                  <Link href="/dashboard" className="block px-4 py-2">
                    Dashboard
                  </Link>
                  {user.is_staff && (
                    <Link href="/admin" className="block px-4 py-2">
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={logout} className="nav-logout block w-full px-4 py-2 text-left">
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <button
          className="nav-icon-btn flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation menu"
        >
          <span className="text-lg">{open ? "✕" : "☰"}</span>
        </button>
      </nav>

      {open && (
        <div className="nav-mobile-panel px-4 pb-5 pt-2 sm:px-6 lg:hidden">
          <ul className="flex flex-col gap-1">
            {LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`nav-mobile-link block rounded-xl px-4 py-2.5 ${
                      active ? "is-active" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="nav-mobile-link">
                  Dashboard
                </Link>
                <button onClick={logout} className="nav-logout text-sm font-semibold uppercase tracking-wide">
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
