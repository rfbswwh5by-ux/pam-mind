import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/site/Reveal";
import AuthorPortrait from "@/components/site/AuthorPortrait";
import { useSettings } from "@/lib/content";

export default function AboutPreview() {
  const { data: s } = useSettings();
  return (
    <section className="py-24 md:py-36" aria-labelledby="behind-title">
      <div className="container-edit grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-24">
        <Reveal className="relative">
          <div className="absolute -left-4 -top-4 h-full w-full rounded-md border border-taupe/50 md:-left-6 md:-top-6" aria-hidden="true" />
          <AuthorPortrait photo={s.profile_photo} name={s.author_name} className="relative" />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="eyebrow mb-6 text-mist">About the author</p>
          <h2 id="behind-title" className="text-4xl font-light leading-[1.08] text-ink md:text-[3.4rem]">{s.behind_title}</h2>
          <p className="mt-8 text-lg leading-[1.8] text-mist">{s.author_bio}</p>
          <Link to="/about" className="btn btn-ink mt-10">
            Meet Pam <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}