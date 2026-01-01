"use client";

import { useEffect, useState, useRef, isValidElement } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toPng, toSvg } from "html-to-image";

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/ui/AuthProvider";

import LiquidChrome from "@/components/LiquidChrome";
import RecapContainer from "@/components/recap/RecapContainer";
import SpotlightCard from "@/components/SpotlightCard";
import { WordReveal } from "@/components/animations/WordReveal"

import {
  Sparkles,
  Brain,
  Calendar,
  Palette,
  BookOpen,
  Leaf,
  Eye,
  Compass,
  Star,
  MessageCircle,
} from "lucide-react";

import { YearRecap } from "@/types/recap";

/* ================= PAGE ================= */

export default function RecapPage() {
  const { year } = useParams<{ year: string }>();
  const user = useAuth();

  const [recap, setRecap] = useState<YearRecap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const finalSlideRef = useRef<HTMLDivElement | null>(null);

  /* ================= DOWNLOAD ================= */

  async function downloadFinalSlide() {
    if (!finalSlideRef.current) return;

    const original = finalSlideRef.current;
    const radius = 36;

    // Measure slide size
    const rect = original.getBoundingClientRect();
    const baseWidth = rect.width;
    const baseHeight = rect.height;

    // Target 4K width
    const TARGET_WIDTH = 3840;
    const scale = TARGET_WIDTH / baseWidth;
    const TARGET_HEIGHT = Math.round(baseHeight * scale);

    // Clone slide
    const clone = original.cloneNode(true) as HTMLElement;
    clone.style.transform = "none";
    clone.style.overflow = "visible";

    // Hide download button
    clone
      .querySelectorAll("[data-export-ignore]")
      .forEach(el => ((el as HTMLElement).style.display = "none"));

    const wrapper = document.createElement("div");
    wrapper.style.width = `${baseWidth}px`;
    wrapper.style.padding = "56px";
    wrapper.style.boxSizing = "border-box";
    wrapper.style.background = `
    radial-gradient(
      120% 120% at 30% 0%,
      rgba(255,255,255,0.12),
      rgba(255,255,255,0.02) 40%,
      rgba(0,0,0,0.9) 75%
    ),
    linear-gradient(
      180deg,
      #2a2a2e 0%,
      #1b1b1f 50%,
      #0f0f12 100%
    )
  `;
    wrapper.style.borderRadius = `${radius}px`;
    wrapper.style.overflow = "hidden";

    wrapper.appendChild(clone);

    // Mount offscreen
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.appendChild(wrapper);
    document.body.appendChild(container);

    try {
      const svgDataUrl = await toSvg(wrapper, {
        cacheBust: true,
      });

      const img = new Image();
      img.src = svgDataUrl;

      await new Promise(res => (img.onload = res));

      const canvas = document.createElement("canvas");
      canvas.width = TARGET_WIDTH;
      canvas.height = TARGET_HEIGHT;

      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);

      const pngUrl = canvas.toDataURL("image/png");

      const link = document.createElement("a");
      link.download = `your-${recap?.year}-wrapped.png`;
      link.href = pngUrl;
      link.click();
    } finally {
      document.body.removeChild(container);
    }
  }

  useEffect(() => {
    if (!user || !year) return;

    async function loadYearlyRecap() {
      try {
        setLoading(true);
        setError("");

        const recapId = `${user.uid}_${year}`;
        const recapRef = doc(db, "yearlyRecap", recapId);

        const snap = await getDoc(recapRef);
        if (snap.exists()) {
          setRecap(snap.data() as YearRecap);
          return;
        }

        const token = await user.getIdToken();
        const res = await fetch(
          `http://127.0.0.1:8000/recap/yearly?year=${year}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "x-user-id": user.uid,
            },
          }
        );

        if (!res.ok) throw new Error("recap generation failed");

        const data = await res.json();

        const recapData: YearRecap = {
          year: Number(year),
          total_memories: data.total_memories,
          themes: data.themes,
          peak_moments: data.peak_moments,
          narrative: data.narrative,
          personality: data.personality,
          closing_note: data.closing_note,
          createdAt: serverTimestamp(),
        };

        await setDoc(recapRef, {
          userId: user.uid,
          ...recapData,
        });

        setRecap(recapData);
      } catch (e) {
        console.error(e);
        setError("Could not generate your yearly recap.");
      } finally {
        setLoading(false);
      }
    }

    loadYearlyRecap();
  }, [user, year]);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Shell>
        <FixedCard>
          <Card icon={Sparkles} title="Weaving your year">
            weaving your {year} memories together…
          </Card>
        </FixedCard>
      </Shell>
    );
  }

  /* ================= ERROR ================= */

  if (error || !recap) {
    return (
      <Shell>
        <FixedCard>
          <Card icon={MessageCircle} title="Something went wrong">
            {error}
            <Link
              href="/dashboard"
              className="block mt-4 text-sm text-zinc-300 hover:text-white"
            >
              ← back to dashboard
            </Link>
          </Card>
        </FixedCard>
      </Shell>
    );
  }

  /* ================= SLIDE HELPER ================= */

  function slide(
    Icon: React.ElementType,
    title: string,
    lines: (string | string[] | React.ReactNode)[],
    isFinal = false
  ) {
    return (
      <FixedCard key={`slide-${title}`}>
        <div ref={isFinal ? finalSlideRef : undefined}>
          <Card icon={Icon} title={title}>
            {/* ✅ span instead of div */}
            <span className="flex flex-col gap-6">
              {lines.map((line, i) => {
                /* 🟢 FINAL SLIDE — JSX only */
                if (isFinal && isValidElement(line)) {
                  return (
                    <span key={`final-${i}`} className="block">
                      {line}
                    </span>
                  );
                }

                /* 🟢 BULLET LIST */
                if (Array.isArray(line)) {
                  return (
                    <span key={`list-${i}`} className="block">
                      <ul className="list-disc pl-5 space-y-2">
                        {line.map((item, idx) => (
                          <li key={`item-${i}-${idx}`}>
                            <WordReveal
                              text={item}
                              className="text-zinc-300 leading-relaxed"
                            />
                          </li>
                        ))}
                      </ul>
                    </span>
                  );
                }

                /* 🟢 STRING */
                return (
                  <WordReveal
                    key={`text-${i}`}
                    text={line}
                    className={
                      i === 0
                        ? "text-zinc-100 text-lg leading-relaxed"
                        : "text-zinc-300 leading-relaxed"
                    }
                  />
                );
              })}

              {/* 🟢 DOWNLOAD BUTTON */}
              {isFinal && (
                <button
                  data-export-ignore
                  onClick={downloadFinalSlide}
                  className="
                mt-6 self-start rounded-full
                px-5 py-2 bg-white/90 text-black
                text-sm font-medium hover:bg-white transition
              "
                >
                  Download your wrapped
                </button>
              )}
            </span>
          </Card>
        </div>
      </FixedCard>
    );

  }

  /* ================= SLIDES (10) ================= */

  const slides = [
    slide(Calendar, `Your ${recap.year} Wrapped`, [
      "Welcome to your personal year-in-review.",
      "This recap doesn’t rank or judge — it just looks for patterns.",
      "Everything here is based on what you chose to record.",
    ]),

    slide(Star, "Your recap personality", [
      recap.personality,
      "This label summarizes how your memories showed up across the year.",
      "Think of it as a vibe, not a diagnosis.",
    ]),

    slide(Brain, "Moments you saved", [
      `${recap.total_memories} memories made it into your vault.`,
      "Each one represents a moment you decided was worth keeping.",
      "Frequency doesn’t equal importance — but it does show attention.",
    ]),

    slide(Eye, "Reading the number", [
      "This count reflects how often you recorded moments.",
      "Some years are loud. Some are quiet.",
      "Both are valid recording styles.",
    ]),

    slide(Compass, "Theme depth", [
      recap.themes, // 👈 array, not string
      "More themes usually mean broader experiences or changing focus.",
      "This describes structure, not meaning.",
    ]),

    slide(Sparkles, "Peak moments", [
      recap.peak_moments, // 👈 array, not string
      "These stood out compared to the rest.",
      "Not every meaningful year has obvious peaks.",
    ]),


    slide(Sparkles, "Peak moments", [
      `${recap.peak_moments.join("\n")}`,
      "These stood out compared to the rest.",
      "Not every meaningful year has obvious peaks.",
    ]),

    slide(BookOpen, "Your year in words", [
      recap.narrative,
      "This summary looks at your year as a whole.",
      "It describes the shape, not the details.",
    ]),

    slide(Eye, "Zooming out", [
      "Patterns often become clearer with distance.",
      "Sometimes the absence of extremes is the story.",
      "Context matters more than conclusions.",
    ]),

    slide(Leaf, "A note from your year", [
      recap.closing_note,
      "Not advice. Not a takeaway.",
      "Just a gentle full stop.",
    ]),
    slide(
      Sparkles,
      "That was your year",
      [
        /* GRID SUMMARY */
        <div key="grid" className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              moments saved
            </p>
            <p className="text-2xl font-semibold text-white">
              {recap.total_memories}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              recap personality
            </p>
            <p className="text-lg text-zinc-200">
              {recap.personality}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              top themes
            </p>
            <ul className="mt-1 space-y-1 text-zinc-300">
              {recap.themes.slice(0, 3).map((t, i) => (
                <li key={i}>• {t}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wide text-zinc-400">
              peak moments
            </p>
            <ul className="mt-1 space-y-1 text-zinc-300">
              {recap.peak_moments.slice(0, 3).map((p, i) => (
                <li key={i}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>,

        /* NARRATIVE */
        <div key="narrative">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            your year in words
          </p>
          <p className="mt-1 text-zinc-300 leading-relaxed">
            {recap.narrative}
          </p>
        </div>,

        /* CLOSING NOTE */
        <div key="closing">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            a note from your year
          </p>
          <p className="mt-1 text-zinc-300 italic">
            {recap.closing_note}
          </p>
        </div>,
      ],
      true
    )
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* 🌊 LIQUID CHROME */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LiquidChrome />
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
      </div>

      {/* 🎬 RECAP */}
      <div className="relative z-10 h-screen">
        <RecapContainer slides={slides} />
      </div>
      <style jsx global>{`
  /* ===== Recap navigation arrows ===== */
  .recap-nav-button {
    position: relative;
    z-index: 50;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(12px);
    border-radius: 9999px;
    padding: 0.6rem;
    color: #0f172a; /* slate-900 */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    transition: background 0.2s ease, transform 0.2s ease;
  }

  .recap-nav-button:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-1px);
  }

  .recap-nav-button svg {
    width: 22px;
    height: 22px;
  }
`}</style>

    </div>
  );
}

/* ================= 3D TILT ================= */

function Tilt3D({ children }: { children: React.ReactNode }) {
  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const rx = ((y / r.height) - 0.5) * -12;
    const ry = ((x / r.width) - 0.5) * 12;

    el.style.transform = `
      perspective(1200px)
      rotateX(${rx}deg)
      rotateY(${ry}deg)
      translateZ(18px)
    `;
  }

  function reset(e: React.MouseEvent<HTMLDivElement>) {
    e.currentTarget.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0px)
    `;
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="transition-transform duration-300 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}

/* ================= FIXED GLASS CARD ================= */

function FixedCard({ children }: { children: React.ReactNode }) {
  return (
    <Tilt3D>
      <SpotlightCard
        className="
          mx-auto max-w-xl w-full h-[420px]
          !bg-zinc-800/80
          !border !border-white/25
          !ring-0 !ring-transparent
          backdrop-blur-xl rounded-3xl
          shadow-[0_40px_100px_-40px_rgba(0,0,0,0.7)]
        "
        spotlightColor="rgba(255,255,255,0.25)"
      >
        <div className="h-full p-8 overflow-y-auto">
          {children}
        </div>
      </SpotlightCard>
    </Tilt3D>
  );
}

/* ================= CARD CONTENT ================= */

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <Icon className="h-8 w-8 text-white/85 drop-shadow-[0_0_14px_rgba(255,255,255,0.45)]" />
      <h2 className="text-2xl font-semibold text-white">{title}</h2>

      <div className="text-zinc-300 leading-relaxed">
        {children}
      </div>
    </div>
  );
}


/* ================= SHELL ================= */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <LiquidChrome />
        <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex h-screen items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
