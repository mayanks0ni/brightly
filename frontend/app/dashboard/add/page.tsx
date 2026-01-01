"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/ui/AuthProvider";

import IridescenceBackground from "../../../components/Iridescence";

export default function AddMemoryPage() {
  const user = useAuth();
  const router = useRouter();

  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ───────────── STABLE BACKGROUND (NO RE-RENDER) ───────────── */
  const Background = useMemo(() => {
    return (
      <div className="absolute inset-0 z-0 pointer-events-none transform-gpu will-change-transform">
        <IridescenceBackground />
        {/* soft veil instead of blur */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px]" />
      </div>
    );
  }, []);

  /* ───────────── AUTH STATES ───────────── */
  if (user === undefined) {
    return <p className="p-6">Checking login…</p>;
  }

  if (user === null) {
    router.replace("/login");
    return null;
  }

  /* ───────────── SUBMIT ───────────── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      setError("Memory cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/memory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // send Firebase ID token
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Backend failed");
      }

      router.push("/dashboard/memories");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f6fa]">
      {Background}

      {/* ───────────── CONTENT ───────────── */}
      <div className="relative z-10 p-6">
        <div className="max-w-xl mx-auto space-y-8">

          {/* HEADER */}
          <header className="space-y-2">
            <h1
              className="
                text-4xl
                font-semibold
                tracking-tight
                text-transparent
                bg-clip-text
                bg-gradient-to-b
                from-neutral-800
                to-neutral-500
              "
            >
              Add a Good Moment
            </h1>

            <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
              Write it gently. This is a quiet place to collect the good parts of your day.
            </p>

            <div className="pt-2">
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
              space-y-4
              shadow-[0_25px_60px_-35px_rgba(0,0,0,0.35)]
              border border-white/40
            "
          >
            {error && (
              <p className="text-sm text-red-500">
                {error}
              </p>
            )}

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Something good that happened today…"
              className="
                w-full
                min-h-[140px]
                rounded-xl
                bg-white/90
                p-4
                text-neutral-700
                placeholder:text-neutral-400
                outline-none
                resize-none
                focus:ring-2
                focus:ring-indigo-200
              "
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="
                  px-4 py-2
                  rounded-lg
                  text-neutral-600
                  hover:bg-white/60
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="
                  px-5 py-2
                  rounded-lg
                  bg-neutral-900
                  text-white
                  transition
                  hover:bg-neutral-800
                  disabled:opacity-60
                "
              >
                {loading ? "Saving…" : "Save Memory"}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
