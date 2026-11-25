import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import BookCover from "@/components/site/BookCover";

export default function BookCard({ book, related = [] }) {
  const extras = related.length ? related.map((r) => r.title).join(" · ") : book.related_label;
  return (
    <article className="group flex h-full flex-col">
      <Link to={`/books/${book.slug}`} className="block rounded-md p-6 transition-colors duration-700 sm:p-8" style={{ backgroundColor: book.accent_background || "#EFE9DF" }} aria-label={`${book.title}: view book`}>
        <BookCover book={book} className="mx-auto w-[70%] transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]" sizeTitle="text-xl" />
      </Link>
      <div className="flex flex-1 flex-col pt-6">
        <p className="eyebrow text-mist">{book.genre || book.category}</p>
        <h3 className="mt-3 text-[1.75rem] font-light leading-tight text-ink">
          <Link to={`/books/${book.slug}`} className="link-underline">{book.title}</Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-mist">{book.short_description}</p>
        {extras && (
          <p className="mt-4 flex items-start gap-2 text-xs text-ink/80">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: book.accent_primary }} aria-hidden="true" />
            <span>{extras}</span>
          </p>
        )}
        <Link to={`/books/${book.slug}`} className="mt-auto inline-flex min-h-[44px] items-center gap-2 pt-5 text-sm font-medium text-ink">
          <span className="link-underline">Learn More</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}