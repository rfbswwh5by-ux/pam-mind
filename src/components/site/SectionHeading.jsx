import React from "react";
import Reveal from "@/components/site/Reveal";

export default function SectionHeading({ eyebrow, title, intro, align = "left", dark = false, className = "" }) {
  const center = align === "center";
  return (
    <Reveal className={`${center ? "mx-auto text-center" : ""} max-w-2xl ${className}`}>
      {eyebrow && (
        <p className={`eyebrow mb-5 flex items-center gap-3 ${center ? "justify-center" : ""} ${dark ? "text-taupe" : "text-mist"}`}>
          <span className={`h-px w-8 ${dark ? "bg-taupe/60" : "bg-mist/50"}`} aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className={`text-4xl font-light leading-[1.08] md:text-5xl ${dark ? "text-ivory" : "text-ink"}`}>{title}</h2>
      {intro && <p className={`mt-6 text-base leading-relaxed md:text-lg ${dark ? "text-ivory/70" : "text-mist"}`}>{intro}</p>}
    </Reveal>
  );
}