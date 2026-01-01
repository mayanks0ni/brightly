"use client";

import { useEffect, useMemo, useState } from "react";
import BlurText from "@/components/BlurText";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import IridescenceBackground from "@/components/Iridescence";
import Link from "next/link";
import { useAuth } from "@/components/ui/AuthProvider";
import { useRouter } from "next/navigation";
import { WordReveal } from "@/components/animations/WordReveal";

export default function DashboardPage() {
  const user = useAuth();
  const router = useRouter(); // ✅ router
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    async function loadMotivation() {
      try {
        setLoading(true);
        setError("");

        const today = new Date().toISOString().split("T")[0];
        const docId = `${user.uid}_${today}`;
        const ref = doc(db, "dailyMotivation", docId);

        const snap = await getDoc(ref);
        if (snap.exists()) {
          setMotivation(snap.data().text);
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();

        const res = await fetch("http://127.0.0.1:8000/motivation/daily", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load motivation");
        }

        const data = await res.json();

        await setDoc(ref, {
          userId: user.uid,
          text: data.text,
          date: today,
          createdAt: serverTimestamp(),
        });

        setMotivation(data.text);
      } catch {
        setError("Could not load motivation today.");
      } finally {
        setLoading(false);
      }
    }

    loadMotivation();
  }, [user]);

  /* ───────────── LOG OUT ───────────── */
  async function handleLogout() {
    await signOut(auth);
    router.replace("/"); // back to landing
  }

  //doing this to ensure recap becomes available at the right time
  const now = new Date();
  const isDecember = now.getMonth() === 11; // 0-based, 11 = December
  const day = now.getDate();

  const showYearRecap = isDecember && day >= 20 && day <= 31;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f6fa]">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <IridescenceBackground />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 p-6">
        <div className="max-w-xl mx-auto space-y-10">

          {/* HEADER */}
          <header className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-4xl font-semibold tracking-tight text-neutral-700">
                Dashboard
              </h1>
              <p className="text-sm text-neutral-500">
                a soft place to land
              </p>
            </div>

            {/* LOG OUT BUTTON */}
            <button
              onClick={handleLogout}
              className="
    text-sm
    text-neutral-600
    px-4
    py-2
    rounded-xl

    bg-white/60
    backdrop-blur-md
    border border-white/40

    shadow-[0_8px_20px_-10px_rgba(0,0,0,0.25)]
    transition

    hover:bg-white/75
    hover:text-neutral-800
  "
            >
              Log out
            </button>

          </header>

          {/* MOTIVATION CARD */}
          <div className="rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)]">
            <p className="text-xs uppercase tracking-wide text-neutral-400 mb-2">
              today’s motivation
            </p>

            {loading ? (
              <p className="text-neutral-400 italic">thinking…</p>
            ) : error ? (
              <p className="text-red-400">{error}</p>
            ) : (
              <WordReveal text={motivation} className="leading-relaxed text-neutral-700" />
            )}
          </div>

          {/* NAV */}
          <div className="grid gap-3">
            <NavLink href="/dashboard/add" emoji="-">
              Add a memory
            </NavLink>
            <NavLink href="/dashboard/memories" emoji="-">
              View memories
            </NavLink>
            {showYearRecap && (
              <NavLink href={`/dashboard/recap/${new Date().getFullYear()}`} emoji="-">
                Year recap
              </NavLink>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ---------------- NAV LINK ---------------- */

function NavLink({
  href,
  emoji,
  children,
}: {
  href: string;
  emoji: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl bg-white/60 px-4 py-3 text-neutral-600 transition hover:bg-white/80 hover:text-neutral-800 hover:shadow-sm"
    >
      <span className="text-xl">{emoji}</span>
      {children}
    </Link>
  );
}
