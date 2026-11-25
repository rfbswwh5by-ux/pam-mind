import React from "react";
import Reveal from "@/components/site/Reveal";
import FlightPath from "@/components/site/FlightPath";
import NewsletterForm from "@/components/site/NewsletterForm";
import { useSettings } from "@/lib/content";

export default function NewsletterSection() {
  const { data: s } = useSettings();
  return (
    <section className="px-4 pb-4 md:px-6 md:pb-6" aria-labelledby="journey-title">
      <div className="relative overflow-hidden rounded-lg bg-[#1D2740] px-6 py-24 text-center md:py-32">
        <FlightPath className="absolute inset-x-0 top-1/2 h-40 w-full -translate-y-1/2" color="#9B8FB4" />
        <Reveal className="relative mx-auto max-w-2xl">
          <p className="eyebrow text-taupe">The mailing list</p>
          <h2 id="journey-title" className="mt-5 text-4xl font-light leading-tight text-ivory md:text-6xl">{s.newsletter_headline}</h2>
          <p className="mx-auto mt-6 max-w-lg text-ivory/70">{s.newsletter_body}</p>
          <div className="mx-auto mt-10 max-w-lg text-left">
            <NewsletterForm dark button="Join the Journey" source="home" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}