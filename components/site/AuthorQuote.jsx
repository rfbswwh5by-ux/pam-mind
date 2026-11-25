import React from "react";
import Reveal from "@/components/site/Reveal";
import { useSettings } from "@/lib/content";

export default function AuthorQuote() {
  const { data: s } = useSettings();
  if (!s.author_quote) return null;
  return (
    <section className="bg-[#EFE8DC] py-24 md:py-32" aria-label="A quote from Pam">
      <Reveal className="container-edit max-w-4xl text-center">
        <span className="font-heading text-7xl leading-none text-lavender" aria-hidden="true">“</span>
        <blockquote className="mt-2 font-heading text-3xl font-light italic leading-snug text-ink md:text-[2.8rem]">
          {s.author_quote}
        </blockquote>
        <p className="eyebrow mt-8 text-mist">— Pam</p>
      </Reveal>
    </section>
  );
}