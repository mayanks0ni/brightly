import { useEffect, useMemo, useState } from "react";

export function WordReveal({
  text,
  className,
  delay = 40,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = useMemo(() => text.split(" "), [text]);

  const [visibleCount, setVisibleCount] = useState(words.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVisibleCount(0);

    const interval = setInterval(() => {
      setVisibleCount((v) =>
        v < words.length ? v + 1 : v
      );
    }, delay);

    return () => clearInterval(interval);
  }, [words, delay]);

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-block transition-opacity duration-300 ${
            !mounted || i < visibleCount
              ? "opacity-100"
              : "opacity-0"
          }`}
        >
          {word}
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}
