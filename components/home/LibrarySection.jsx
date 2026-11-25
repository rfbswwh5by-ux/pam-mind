import React from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/site/SectionHeading";
import BookFeature from "@/components/home/BookFeature";
import { FeatureSkeleton } from "@/components/site/Skeletons";
import EmptyState from "@/components/site/EmptyState";
import { useBooks, useOfferings, useSettings, forBook } from "@/lib/content";

export default function LibrarySection() {
  const { data: books = [], isLoading } = useBooks();
  const { data: offerings = [] } = useOfferings();
  const { data: s } = useSettings();
  const featured = books.filter((b) => b.featured);
  const list = featured.length ? featured : books;

  return (
    <section id="library" aria-labelledby="library-title" className="scroll-mt-20">
      <div className="container-edit flex flex-col gap-6 pb-16 pt-24 md:flex-row md:items-end md:justify-between md:pt-32">
        <SectionHeading eyebrow="The Library" title={<span id="library-title">{s.library_title}</span>} intro={s.library_intro} />
        <Link to="/books" className="btn btn-outline shrink-0 self-start md:self-auto">View All Books</Link>
      </div>
      {isLoading && <div className="container-edit pb-24"><FeatureSkeleton /></div>}
      {!isLoading && !list.length && <div className="container-edit pb-24"><EmptyState title="New books are on the way." text="Pam’s library will appear here soon." /></div>}
      {list.map((b, i) => (
        <BookFeature key={b.id} book={b} index={i} related={forBook(offerings, b.id)} />
      ))}
    </section>
  );
}