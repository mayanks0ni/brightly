"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/components/ui/AuthProvider";

import IridescenceBackground from "@/components/Iridescence";

export default function LoginPage() {
  const router = useRouter();
  const user = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ───────────── STABLE BACKGROUND ───────────── */
  const Background = useMemo(() => {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none transform-gpu will-change-transform">
        <IridescenceBackground />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px]" />
      </div>
    );
  }, []);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user === undefined) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f6fa]">
      {Background}

      {/* CONTENT */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-10">

          {/* HEADER */}
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-900">
              Welcome back
            </h1>

            <p className="text-sm text-neutral-500 leading-relaxed">
              Continue where you left off.
            </p>

            <div className="pt-3 flex justify-center">
              <div className="h-px w-24 bg-gradient-to-r from-neutral-300/60 to-transparent" />
            </div>
          </header>

          {/* FORM CARD */}
          <form
            onSubmit={handleSubmit}
            className="
              rounded-2xl
              bg-white/85
              backdrop-blur-xl
              p-6
              space-y-5
              shadow-[0_25px_60px_-35px_rgba(0,0,0,0.35)]
              border border-white/40
            "
          >
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="
                  w-full
                  rounded-xl
                  bg-white/90
                  p-3
                  text-neutral-700
                  placeholder:text-neutral-400
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-200
                "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide text-neutral-400">
                Password
              </label>
              <input
                type="password"
                placeholder="Your password"
                className="
                  w-full
                  rounded-xl
                  bg-white/90
                  p-3
                  text-neutral-700
                  placeholder:text-neutral-400
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-200
                "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                mt-2
                rounded-xl
                bg-neutral-900
                text-white
                py-3
                transition
                hover:bg-neutral-800
                disabled:opacity-60
              "
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="text-xs text-neutral-500 text-center pt-2">
              New here?{" "}
              <button
                type="button"
                onClick={() => router.push("/register")}
                className="underline hover:text-neutral-700"
              >
                Create an account
              </button>
            </p>
          </form>

        </div>
      </main>
    </div>
  );
}
