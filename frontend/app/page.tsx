"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ui/AuthProvider";
import Link from "next/link";

import IridescenceBackground from "@/components/Iridescence";

export default function HomePage() {
  const user = useAuth();
  const router = useRouter();

  /* ───────────── STABLE BACKGROUND ───────────── */
  const Background = useMemo(() => {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none transform-gpu will-change-transform">
        <IridescenceBackground />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px]" />
      </div>
    );
  }, []);

  /* ───────────── REDIRECT LOGGED-IN USERS ───────────── */
  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  /* ───────────── AUTH LOADING ───────────── */
  if (user === undefined) {
    return null;
  }

  if (user) {
    return null;
  }

  /* ───────────── PUBLIC LANDING ───────────── */
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f6fa]">
      {Background}

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-xl space-y-10">

          {/* HEADER */}
          <header className="text-center space-y-3">
            <h1
              className="
                text-5xl
                font-semibold
                tracking-tight
                text-transparent
                bg-clip-text
                bg-gradient-to-b
                from-neutral-900
                to-neutral-500
              "
            >
              Brightly
            </h1>

            <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              A private space to collect good moments — and gently turn them
              into reflection, clarity, and a beautiful year-end recap.
            </p>

            <div className="pt-4 flex justify-center">
              <div className="h-px w-24 bg-gradient-to-r from-neutral-300/60 to-transparent" />
            </div>
          </header>

          {/* GLASS CARD */}
          <div
            className="
              rounded-2xl
              bg-white/85
              backdrop-blur-xl
              p-8
              shadow-[0_25px_60px_-35px_rgba(0,0,0,0.35)]
              border border-white/40
              text-center
              space-y-6
            "
          >
            <p className="text-neutral-600 leading-relaxed">
              Capture what mattered today. Over time, Brightly helps you
              notice patterns, themes, and moments worth remembering.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/register"
                className="
                  px-6 py-2.5
                  rounded-lg
                  bg-neutral-900
                  text-white
                  transition
                  hover:bg-neutral-800
                "
              >
                Get Started
              </Link>

              <Link
                href="/login"
                className="
                  px-6 py-2.5
                  rounded-lg
                  text-neutral-700
                  border border-neutral-300/60
                  hover:bg-white/60
                "
              >
                Login
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
