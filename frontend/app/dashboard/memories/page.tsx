"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/ui/AuthProvider";

import IridescenceBackground from "../../../components/Iridescence";

type Memory = {
  id: string;
  text: string;
  createdAt?: any;
};

export default function MemoriesPage() {
  const user = useAuth();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchMemories() {
      const q = query(
        collection(db, "memories"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Memory[];

      setMemories(data);
      setLoading(false);
    }

    fetchMemories();
  }, [user]);

  /* ───────────────────────── LOADING ───────────────────────── */
  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-transparent">
        {/* FIXED BACKGROUND (WITH BASE COLOR) */}
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#f4f6fa]">
          <IridescenceBackground />
          <div className="absolute inset-0 backdrop-blur-[10px] bg-white/45" />
        </div>

        <div className="relative z-10 p-6 pt-10 max-w-4xl mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-white/70 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  /* ───────────────────────── EMPTY ───────────────────────── */
  if (memories.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-transparent">
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#f4f6fa]">
          <IridescenceBackground />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px]" />
        </div>

        <div className="relative z-10 p-6 pt-10 max-w-4xl mx-auto">
          <h1 className="text-4xl font-semibold text-neutral-800">
            Your Good Moments
          </h1>
          <p className="mt-2 text-neutral-500">
            No memories yet — your diary is waiting.
          </p>
        </div>
      </div>
    );
  }

  /* ───────────────────────── CONTENT ───────────────────────── */
  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#f4f6fa]">
        <IridescenceBackground />
        <div className="absolute inset-0 bg-white/10 backdrop-blur-[10px]" />
      </div>

      <div className="relative z-10 p-6 pt-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <header className="space-y-2 max-w-xl">
            <h1 className="text-4xl font-semibold tracking-tight text-neutral-800">
              Your Good Moments
            </h1>
            <p className="text-sm text-neutral-500">
              A personal diary of days worth keeping.
            </p>
          </header>

          <div className="space-y-6">
            {memories.map((m, i) => (
              <div
                key={m.id}
                className="diary-page"
                style={{
                  transform: `rotate(${i % 2 === 0 ? 0.2 : -0.2}deg)`,
                }}
              >
                <div className="diary-margin" />

                <p className="diary-date">
                  {m.createdAt?.toDate?.().toLocaleDateString(undefined, {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p className="diary-text">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .diary-page {
          position: relative;
          padding: 24px 28px 28px 48px;
          border-radius: 14px;
          background:
            linear-gradient(to right, rgba(220, 38, 38, 0.15) 1px, transparent 1px),
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 26px,
              rgba(0, 0, 0, 0.04) 27px
            ),
            #fffdf8;
          background-size: 100% 100%, 100% 27px, auto;
          border: 1px solid rgba(0, 0, 0, 0.06);
          box-shadow: 0 25px 40px -30px rgba(0, 0, 0, 0.35);
        }

        .diary-margin {
          position: absolute;
          left: 28px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(220, 38, 38, 0.35);
        }

        .diary-date {
          font-size: 0.85rem;
          letter-spacing: 0.04em;
          color: #6b7280;
          margin-bottom: 10px;
        }

        .diary-text {
          font-family: "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive;
          font-size: 1.05rem;
          line-height: 1.9;
          color: #1f2937;
          white-space: pre-wrap;
        }
      `}</style>
    </div>
  );
}
