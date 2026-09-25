"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const AuthContext = createContext(null);

/**
 * True when a login error looks like "your account exists but isn't
 * verified yet" rather than "wrong email/password". Backends phrase this
 * differently, so we match a few common shapes instead of one exact string.
 */
export function isUnverifiedAccountError(err) {
  const data = err?.response?.data;
  if (!data) return false;
  const blob = (typeof data === "string" ? data : JSON.stringify(data)).toLowerCase();
  return (
    blob.includes("not verified") ||
    blob.includes("not been verified") ||
    blob.includes("pending") ||
    blob.includes("pending approval") ||
    blob.includes("awaiting") ||
    (blob.includes("verify") && blob.includes("account")) ||
    blob.includes("inactive")
  );
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadUser = useCallback(async () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/profile/");
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post("/login/", { email, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  /**
   * Plain email/password registration — no OTP step. Accepts a single
   * object so it's easy to add fields (interests, phone, bio, ...) without
   * changing every call site. Account starts unverified; an admin flips
   * `is_verified` on from the Admin Panel's Users tab before the person can
   * log in.
   */
  const register = async ({
    username,
    email,
    password,
    password2,
    first_name = "",
    last_name = "",
    phone_number = "",
    bio = "",
    preferred_categories = [],
  }) => {
    const { data } = await api.post("/register/", {
      username,
      email,
      password,
      password2,
      first_name,
      last_name,
      phone_number,
      bio,
      preferred_categories,
    });
    return data;
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, refreshProfile: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
