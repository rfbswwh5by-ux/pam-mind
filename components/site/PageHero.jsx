import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import FlightPath from "@/components/site/FlightPath";

export default function PageHero({ eyebrow, title, intro, children }) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden border-b border-ink/5 pb-16 pt-16 md:pb-24 md:pt-24">
      <FlightPath className="absolute inset-x-0 bottom-0 h-28 w-full" />
      <motion.div initial={{ opacity: 0, y: reduce ? 0 : 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="container-edit relative max-w-4xl">
        {eyebrow && <p className="eyebrow mb-6 flex items-center gap-3 text-mist"><span className="h-px w-10 bg-mist/50" aria-hidden="true" />{eyebrow}</p>}
        <h1 className="text-5xl font-light leading-[1.02] text-ink md:text-7xl">{title}</h1>
        {intro && <p className="mt-7 max-w-2xl text-lg leading-relaxed text-mist">{intro}</p>}
        {children}
      </motion.div>
    </section>
  );
}