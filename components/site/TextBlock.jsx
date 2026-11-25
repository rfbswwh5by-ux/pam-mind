import React from "react";
import Reveal from "@/components/site/Reveal";

export default function TextBlock({ label, title, text }) {
  if (!text) return null;
  return (
    <Reveal className="grid gap-6 border-t border-ink/10 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
      <div>
        <p className="eyebrow text-mist">{label}</p>
        <h2 className="mt-3 text-3xl font-light text-ink md:text-4xl">{title}</h2>
      </div>
      <p className="whitespace-pre-line text-[17px] leading-[1.85] text-mist">{text}</p>
    </Reveal>
  );
}