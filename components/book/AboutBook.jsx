import React from "react";
import ReactMarkdown from "react-markdown";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { tone } from "@/lib/theme";

export default function AboutBook({ book, dark }) {
  const t = tone(dark);
  if (!book.full_description && !book.pull_quote && !book.author_commentary) return null;
  return (
    <section className="py-20 md:py-32" aria-labelledby="about-book">
      <div className="container-edit grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <Reveal>
          <p className={`eyebrow ${dark ? "text-taupe" : "text-mist"}`}>{dark ? "The story" : "The book"}</p>
          <h2 id="about-book" className={`mt-4 text-4xl font-light md:text-5xl ${t.text}`}>{dark ? "About the Story" : "About This Book"}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          {book.full_description && (
            <div className={`prose-edit text-[17px] ${t.muted}`}><ReactMarkdown>{book.full_description}</ReactMarkdown></div>
          )}
          {book.pull_quote && (
            <blockquote className={`my-12 border-l-2 border-[var(--accent-2)] pl-6 font-heading text-3xl font-light italic leading-snug md:text-4xl ${t.text}`}>
              {book.pull_quote}
            </blockquote>
          )}
          {book.author_commentary && (
            <aside className={`rounded-lg p-7 md:p-9 ${dark ? "bg-white/[0.05]" : "bg-white/70 ring-1 ring-ink/5"}`}>
              <p className={`eyebrow ${t.muted}`}>A note from Pam</p>
              <p className={`mt-4 font-heading text-xl italic leading-relaxed ${t.text}`}>{book.author_commentary}</p>
            </aside>
          )}
        </Reveal>
      </div>
      {(book.additional_images || []).length > 0 && (
        <div className="container-edit mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {book.additional_images.map((src, i) => (
            <div key={i} className="aspect-[4/3] overflow-hidden rounded-md">
              <Image src={src} alt={`${book.title}: image ${i + 1}`} loading="lazy" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}