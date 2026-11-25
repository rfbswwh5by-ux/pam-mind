import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import BookHero from "@/components/book/BookHero";
import AboutBook from "@/components/book/AboutBook";
import CharactersSection from "@/components/book/CharactersSection";
import PurchaseSection from "@/components/book/PurchaseSection";
import RelatedExperiences from "@/components/book/RelatedExperiences";
import AudioSection from "@/components/book/AudioSection";
import VideoLibrary from "@/components/book/VideoLibrary";
import { FeatureSkeleton } from "@/components/site/Skeletons";
import NotFound from "@/pages/NotFound";
import useSeo from "@/lib/useSeo";
import { bookVars } from "@/lib/theme";
import { useBooks, useOfferings, useAudio, useVideos, useSettings, forBook, isPlaceholder } from "@/lib/content";

export default function BookDetail() {
  const { slug } = useParams();
  const { hash } = useLocation();
  const { data: books = [], isLoading } = useBooks();
  const { data: offerings = [] } = useOfferings();
  const { data: audio = [] } = useAudio();
  const { data: videos = [] } = useVideos();
  const { data: s } = useSettings();
  const book = books.find((b) => b.slug === slug);

  const jsonLd = book && !isPlaceholder(book.title)
    ? { "@context": "https://schema.org", "@type": "Book", name: book.title, author: { "@type": "Person", name: s.author_name }, ...(book.isbn && { isbn: book.isbn }), ...(book.publisher && { publisher: book.publisher }), ...(book.cover_image && { image: book.cover_image }) }
    : null;
  useSeo({ title: book?.seo_title || book?.title, description: book?.seo_description || book?.short_description, image: book?.cover_image, jsonLd });

  useEffect(() => {
    if (book && hash) setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 150);
  }, [book, hash]);

  if (isLoading) return <div className="container-edit py-24"><FeatureSkeleton /></div>;
  if (!book) return <NotFound />;
  const dark = book.theme === "cinematic";
  const related = { offerings: forBook(offerings, book.id), audio: forBook(audio, book.id), videos: forBook(videos, book.id) };

  return (
    <div style={bookVars(book)} className={dark ? "bg-[#0F1626]" : "bg-ivory"}>
      <BookHero book={book} dark={dark} />
      <AboutBook book={book} dark={dark} />
      <CharactersSection book={book} dark={dark} />
      <PurchaseSection book={book} dark={dark} />
      <section id="extras" className="scroll-mt-20" aria-label="Extras">
        <RelatedExperiences book={book} offerings={related.offerings} dark={dark} />
        <AudioSection audio={related.audio} dark={dark} />
        <VideoLibrary videos={related.videos} dark={dark} disclaimer={s.wellness_disclaimer} />
        {!related.offerings.length && !related.audio.length && !related.videos.length && (
          <p className={`container-edit py-20 text-center font-heading text-2xl italic ${dark ? "text-ivory/60" : "text-mist"}`}>Extras for this book are coming soon.</p>
        )}
      </section>
    </div>
  );
}