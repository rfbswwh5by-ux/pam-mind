import React from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";
import BookCover from "@/components/site/BookCover";
import ShareBar from "@/components/site/ShareBar";
import { IMAGES } from "@/lib/images";
import { tone } from "@/lib/theme";
import { formatDate } from "@/lib/content";

export default function BookHero({ book, dark }) {
  const t = tone(dark);
  const reduce = useReducedMotion();
  const meta = [
    ["Publisher", book.publisher],
    ["Published", book.publication_date && formatDate(book.publication_date)],
    ["ISBN", book.isbn],
    ["Formats", (book.formats || []).join(", ")],
  ].filter(([, v]) => v);

  return (
    <section className="relative overflow-hidden" style={{ backgroundColor: book.accent_background }}>
      {dark && (
        <>
          <Image src={IMAGES.mystery} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <span className="absolute inset-0 bg-gradient-to-b from-[#0F1626]/40 via-[#0F1626]/70 to-[#0F1626]" aria-hidden="true" />
        </>
      )}
      <div className="container-edit relative grid items-center gap-12 py-16 md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: reduce ? 0 : 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="mx-auto w-[70%] max-w-[360px] md:w-full">
          <BookCover book={book} sizeTitle="text-3xl" />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
          <nav aria-label="Breadcrumb" className={`mb-8 text-xs ${t.muted}`}>
            <Link to="/books" className="link-underline">Books</Link> <span aria-hidden="true">/</span> <span aria-current="page">{book.title}</span>
          </nav>
          <p className={`eyebrow ${dark ? "text-taupe" : "text-[var(--accent)]"}`}>{book.genre || book.category}</p>
          <h1 className={`mt-4 text-5xl font-light leading-[1.02] md:text-6xl lg:text-7xl ${t.text}`}>{book.title}</h1>
          {book.subtitle && <p className={`mt-4 font-heading text-2xl italic ${t.muted}`}>{book.subtitle}</p>}
          <p className={`mt-7 max-w-xl text-lg leading-[1.8] ${t.muted}`}>{book.short_description}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#purchase" className={`btn ${t.btn}`}>Buy the Book</a>
            <a href="#extras" className={`btn ${t.btn2}`}>Explore Extras</a>
          </div>
          {meta.length > 0 && (
            <dl className={`mt-10 grid max-w-lg grid-cols-2 gap-x-8 gap-y-4 border-t pt-6 text-sm ${t.border}`}>
              {meta.map(([k, v]) => (
                <div key={k}>
                  <dt className={`eyebrow ${t.muted}`}>{k}</dt>
                  <dd className={`mt-1 ${t.text}`}>{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-10"><ShareBar title={book.title} dark={dark} /></div>
        </motion.div>
      </div>
    </section>
  );
}