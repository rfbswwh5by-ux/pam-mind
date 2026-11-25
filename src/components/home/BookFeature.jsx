import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import BookCover from "@/components/site/BookCover";
import Reveal from "@/components/site/Reveal";
import { bookVars, tone } from "@/lib/theme";

export default function BookFeature({ book, related = [], index = 0 }) {
  const dark = book.theme === "cinematic";
  const t = tone(dark);
  const flip = index % 2 === 1;
  const extras = related.length ? related.map((r) => r.title) : book.related_label ? [book.related_label] : [];
  const hasBuy = (book.purchase_links || []).some((l) => l?.url);

  return (
    <article className="relative py-20 md:py-28" style={{ ...bookVars(book), backgroundColor: book.accent_background }}>
      <div className={`container-edit grid items-center gap-12 md:grid-cols-2 md:gap-20 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}>
        <Reveal className="flex justify-center">
          <Link to={`/books/${book.slug}`} className="group block w-[62%] max-w-[320px]" aria-label={`${book.title}: learn more`}>
            <BookCover book={book} className="transition-all duration-700 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]" sizeTitle="text-2xl md:text-3xl" />
          </Link>
        </Reveal>
        <Reveal delay={0.12}>
          <p className={`eyebrow ${dark ? "text-taupe" : "text-[var(--accent)]"}`}>{String(index + 1).padStart(2, "0")} · {book.genre || book.category}</p>
          <h3 className={`mt-4 text-4xl font-light leading-[1.05] md:text-5xl ${t.text}`}>{book.title}</h3>
          <p className={`mt-6 text-base leading-[1.8] md:text-lg ${t.muted}`}>{book.short_description}</p>
          {extras.length > 0 && (
            <div className="mt-7">
              <p className={`eyebrow mb-3 ${t.muted}`}>Related experiences</p>
              <ul className="flex flex-wrap gap-2">
                {extras.map((e) => (
                  <li key={e} className={`rounded-full border px-4 py-1.5 text-xs ${dark ? "border-ivory/20 text-ivory/85" : "border-ink/15 bg-white/60 text-ink"}`}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={`/books/${book.slug}`} className={`btn ${t.btn} relative isolate ${related.length ? "aura" : ""}`}>
              Learn More <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            {hasBuy && <Link to={`/books/${book.slug}#purchase`} className={`btn ${t.btn2}`}>Buy the Book</Link>}
          </div>
        </Reveal>
      </div>
    </article>
  );
}