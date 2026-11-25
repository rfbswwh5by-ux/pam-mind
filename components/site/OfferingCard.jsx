import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CATEGORY_IMAGE } from "@/lib/images";

export default function OfferingCard({ offering, book, dark = false }) {
  const img = offering.thumbnail || CATEGORY_IMAGE[offering.experience_category] || CATEGORY_IMAGE.Other;
  const href = offering.external_url || offering.media_url;
  const external = href && !offering.coming_soon;
  const cta = offering.coming_soon ? "Coming Soon" : offering.cta_text || "Learn More";
  const inner = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden rounded-md">
        <Image src={img} alt="" loading="lazy" className={`h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02] ${offering.coming_soon ? "grayscale-[60%] opacity-70" : ""}`} />
        <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] ${dark ? "bg-ink/80 text-ivory" : "bg-ivory/90 text-ink"}`}>{offering.type}</span>
      </div>
      <div className="pt-5">
        {book && <p className={`eyebrow ${dark ? "text-taupe" : "text-mist"}`}>From {book.title}</p>}
        <h3 className={`mt-2 text-2xl font-light ${dark ? "text-ivory" : "text-ink"}`}>{offering.title}</h3>
        <p className={`mt-2 line-clamp-3 text-sm leading-relaxed ${dark ? "text-ivory/65" : "text-mist"}`}>{offering.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className={`inline-flex min-h-[44px] items-center gap-2 text-sm font-medium ${dark ? "text-ivory" : "text-ink"} ${offering.coming_soon ? "opacity-60" : ""}`}>
            {cta} {!offering.coming_soon && (external ? <ArrowUpRight className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />)}
          </span>
          {offering.price && <span className={`text-sm ${dark ? "text-ivory/70" : "text-mist"}`}>{offering.price}</span>}
        </div>
      </div>
    </>
  );
  if (offering.coming_soon) return <article className="group">{inner}</article>;
  if (external) return <a href={href} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>;
  return <Link to={book ? `/books/${book.slug}#extras` : "/experiences"} className="group block">{inner}</Link>;
}