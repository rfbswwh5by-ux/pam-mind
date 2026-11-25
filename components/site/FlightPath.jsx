import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export default function FlightPath({ className = "", color = "#9B8FB4", d = "M0 120 C 240 20, 480 200, 720 90 S 1200 30, 1440 110" }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 1440 220" fill="none" preserveAspectRatio="none" className={`pointer-events-none ${className}`} aria-hidden="true">
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="1"
        strokeDasharray="2 7"
        initial={{ pathLength: reduce ? 1 : 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.7 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}