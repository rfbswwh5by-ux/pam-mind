import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { CATEGORY_IMAGE } from "@/lib/images";

export default function ExperienceTile({ offering, book, large = false }) {
  const img = offering.thumbnail || CATEGORY_IMAGE[offering.experience_category] || CATEGORY_IMAGE.Other;
  return (
    <Link to={book ? `/books/${book.slug}#extras` : "/experiences"} className={`group relative block overflow-hidden rounded-md ${large ? "aspect-[4/5] lg:aspect-auto lg:h-full" : "aspect-[16/10]"}`}>
      <Image src={img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.02]" />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
        <div>
          <p className="eyebrow text-ivory/75">{offering.experience_category}{book ? ` · ${book.title}` : ""}</p>
          <h3 className={`mt-2 font-light text-ivory ${large ? "text-4xl md:text-5xl" : "text-3xl"}`}>{offering.title}</h3>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ivory/40 text-ivory transition-all duration-500 group-hover:bg-ivory group-hover:text-ink" aria-hidden="true">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}