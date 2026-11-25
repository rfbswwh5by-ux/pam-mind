import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { IMAGES } from "@/lib/images";

export default function MovementFeature({ offering }) {
  const href = offering.external_url || offering.media_url;
  const cta = offering.cta_text || "Explore the Movement";
  return (
    <Reveal className="mb-16 overflow-hidden rounded-lg bg-[var(--accent)] text-white">
      <div className="grid md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <Image src={offering.thumbnail || IMAGES.movement} alt="Children dancing in a sunny meadow" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="relative p-8 md:p-14">
          <svg viewBox="0 0 200 60" className="absolute right-6 top-6 h-10 w-32 opacity-50" aria-hidden="true">
            <path d="M2 40 Q 30 5, 60 35 T 120 30 T 198 20" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
          <p className="eyebrow text-white/80">A family experience</p>
          <h3 className="mt-4 text-4xl font-light leading-tight md:text-5xl">{offering.title}</h3>
          <p className="mt-5 leading-relaxed text-white/85">{offering.description}</p>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="btn btn-light mt-8">{cta} <ArrowRight className="h-4 w-4" /></a>
          ) : (
            <Link to="/experiences?c=Movement" className="btn btn-light mt-8">{cta} <ArrowRight className="h-4 w-4" /></Link>
          )}
        </div>
      </div>
    </Reveal>
  );
}