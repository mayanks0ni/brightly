"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function RecapContainer({
  slides,
}: {
  slides: React.ReactNode[];
}) {
  const [index, setIndex] = useState(0);

  function next() {
    if (index < slides.length - 1) setIndex(index + 1);
  }

  function prev() {
    if (index > 0) setIndex(index - 1);
  }

  return (
    <div className="relative h-[80vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {slides[index]}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-6 left-0 right-0 flex justify-between px-6">
        <button onClick={prev} disabled={index === 0} className="recap-nav-button">
          ←
        </button>
        <button onClick={next} disabled={index === slides.length - 1} className="recap-nav-button">
          →
        </button>
      </div>
    </div>
  );
}
