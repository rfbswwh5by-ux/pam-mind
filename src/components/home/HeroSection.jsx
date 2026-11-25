import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useBooks, useSettings } from "@/lib/content";
import FlightPath from "@/components/site/FlightPath";
import HeroBooks from "@/components/home/HeroBooks";

const ease = [0.22, 1, 0.36, 1];

export default function HeroSection() {
  const { data: s } = useSettings();
  const { data: books = [] } = useBooks();
  const reduce = useReducedMotion();
  const rise = (d) => ({ initial: { opacity: 0, y: reduce ? 0 : 28 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, delay: d, ease } });

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <FlightPath className="absolute inset-x-0 bottom-10 h-40 w-full" d="M0 160 C 300 60, 520 200, 820 110 S 1250 40, 1440 70" />
      <div className="container-edit relative grid min-h-[calc(100svh-6rem)] items-center gap-10 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div className="max-w-xl">
          <motion.p {...rise(0.05)} className="eyebrow mb-7 flex items-center gap-3 text-mist">
            <span className="h-px w-10 bg-mist/50" aria-hidden="true" /> {s.hero_eyebrow}
          </motion.p>
          <motion.h1 {...rise(0.15)} id="hero-title" className="text-[2.9rem] font-light leading-[1.02] text-ink sm:text-6xl lg:text-[4.4rem]">
            {s.hero_headline}
          </motion.h1>
          <motion.p {...rise(0.3)} className="mt-8 max-w-lg text-lg leading-relaxed text-mist">{s.hero_description}</motion.p>
          <motion.div {...rise(0.45)} className="mt-10 flex flex-wrap gap-3">
            <Link to="/books" className="btn btn-ink">
              {s.hero_cta_primary} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link to="/about" className="btn btn-outline">{s.hero_cta_secondary}</Link>
          </motion.div>
        </div>
        <HeroBooks books={books.slice(0, 3)} />
      </div>
    </section>
  );
}