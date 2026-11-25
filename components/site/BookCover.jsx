import React from "react";
import { Image } from "@/components/ui/image";

export default function BookCover({ book, className = "", sizeTitle = "text-2xl" }) {
  const alt = `Book Cover: ${book?.title || "Untitled"} by Pam`;
  if (book?.cover_image) {
    return (
      <div className={`relative aspect-[2/3] overflow-hidden rounded-[3px] bg-ivory shadow-book ${className}`}>
        <Image src={book.cover_image} alt={alt} fittingType="fit" className="h-full w-full" />
      </div>
    );
  }
  const accent = book?.accent_primary || "#172033";
  return (
    <div
      role="img"
      aria-label={`${alt} (placeholder cover)`}
      className={`relative flex aspect-[2/3] flex-col justify-between overflow-hidden rounded-[3px] p-[9%] text-ivory shadow-book ${className}`}
      style={{ background: `linear-gradient(155deg, ${accent} 0%, ${accent} 55%, rgba(0,0,0,0.25) 140%)`, backgroundColor: accent }}
    >
      <span className="absolute inset-y-0 left-0 w-[6%] bg-gradient-to-r from-black/25 via-white/10 to-transparent" aria-hidden="true" />
      <span className="absolute inset-[5%] rounded-[2px] border border-ivory/25" aria-hidden="true" />
      <p className="relative text-[0.55rem] uppercase tracking-[0.3em] text-ivory/75">Pam’s Mind Flights</p>
      <div className="relative">
        <p className={`font-heading font-light leading-[1.05] ${sizeTitle}`}>{book?.title}</p>
        <span className="mt-4 block h-px w-10 bg-ivory/50" aria-hidden="true" />
      </div>
      <p className="relative text-[0.55rem] uppercase tracking-[0.25em] text-ivory/60">Cover coming soon</p>
    </div>
  );
}