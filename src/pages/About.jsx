import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AuthorPortrait from "@/components/site/AuthorPortrait";
import SocialLinks from "@/components/site/SocialLinks";
import TextBlock from "@/components/site/TextBlock";
import AuthorQuote from "@/components/site/AuthorQuote";
import BookCard from "@/components/site/BookCard";
import Reveal from "@/components/site/Reveal";
import useSeo from "@/lib/useSeo";
import { useSettings, useBooks, isPlaceholder } from "@/lib/content";

export default function About() {
  const { data: s } = useSettings();
  const { data: books = [] } = useBooks();
  const reduce = useReducedMotion();
  const jsonLd = !isPlaceholder(s.author_name) && !s.author_name.includes("[")
    ? { "@context": "https://schema.org", "@type": "Person", name: s.author_name, jobTitle: "Author", ...(s.profile_photo && { image: s.profile_photo }), sameAs: [s.facebook_url, s.instagram_url].filter(Boolean) }
    : null;
  useSeo({ title: "About Pam", description: "Meet Pam, the author behind Pam’s Mind Flights.", image: s.profile_photo, jsonLd });

  return (
    <>
      <section className="container-edit grid items-center gap-12 py-16 md:grid-cols-[1fr_1fr] md:gap-20 md:py-24">
        <motion.div initial={{ opacity: 0, clipPath: reduce ? "inset(0 0 0 0)" : "inset(0 0 100% 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
          <AuthorPortrait photo={s.profile_photo} name={s.author_name} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: reduce ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <p className="eyebrow text-mist">About the author</p>
          <h1 className="mt-5 text-6xl font-light leading-none text-ink md:text-8xl">{s.about_heading}</h1>
          <p className="mt-3 font-heading text-2xl italic text-mist">{s.author_name}</p>
          <p className="mt-8 text-lg leading-[1.85] text-mist">{s.author_bio}</p>
          <div className="mt-8"><SocialLinks labels /></div>
        </motion.div>
      </section>
      <section className="container-edit pb-16">
        <TextBlock label="01" title="Pam’s Story" text={s.author_story} />
        <TextBlock label="02" title="Why I Write" text={s.why_i_write} />
        <TextBlock label="03" title="What Inspires Me" text={s.what_inspires} />
        {(s.author_qa || []).length > 0 && (
          <Reveal className="grid gap-6 border-t border-ink/10 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
            <div><p className="eyebrow text-mist">04</p><h2 className="mt-3 text-3xl font-light text-ink md:text-4xl">Author Q&A</h2></div>
            <Accordion type="single" collapsible>
              {s.author_qa.map((q, i) => (
                <AccordionItem key={i} value={`q${i}`} className="border-ink/10">
                  <AccordionTrigger className="text-left font-heading text-xl font-normal text-ink hover:no-underline">{q.question}</AccordionTrigger>
                  <AccordionContent className="text-[15px] leading-relaxed text-mist">{q.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        )}
      </section>
      <AuthorQuote />
      {books.length > 0 && (
        <section className="container-edit py-24">
          <h2 className="mb-12 text-4xl font-light text-ink md:text-5xl">My Books</h2>
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </>
  );
}