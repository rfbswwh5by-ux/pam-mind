import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHero from "@/components/site/PageHero";
import BookCard from "@/components/site/BookCard";
import FilterChips from "@/components/site/FilterChips";
import EmptyState from "@/components/site/EmptyState";
import { CardGridSkeleton } from "@/components/site/Skeletons";
import useSeo from "@/lib/useSeo";
import { useBooks, useOfferings, useSettings, forBook } from "@/lib/content";

export default function Books() {
  const { data: books = [], isLoading } = useBooks();
  const { data: offerings = [] } = useOfferings();
  const { data: s } = useSettings();
  const [cat, setCat] = useState("All");
  useSeo({ title: "Books", description: "The complete library of books by Pam, from children’s stories to wellness and mystery." });
  const cats = ["All", ...Array.from(new Set(books.map((b) => b.category).filter(Boolean)))];
  const shown = cat === "All" ? books : books.filter((b) => b.category === cat);

  return (
    <>
      <PageHero eyebrow="The Library" title={s.books_page_title} intro={s.books_page_intro} />
      <section className="container-edit py-16 md:py-24">
        {cats.length > 2 && <div className="mb-14"><FilterChips options={cats} value={cat} onChange={setCat} label="Filter books by category" /></div>}
        {isLoading && <CardGridSkeleton cover />}
        {!isLoading && !shown.length && <EmptyState title="No books here yet." text="New titles will appear in the library soon." />}
        <motion.div layout className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((b) => (
              <motion.div key={b.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
                <BookCard book={b} related={forBook(offerings, b.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>
    </>
  );
}