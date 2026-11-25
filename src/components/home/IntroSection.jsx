import React from "react";
import { ArrowDown } from "lucide-react";
import { Image } from "@/components/ui/image";
import Reveal from "@/components/site/Reveal";
import { IMAGES } from "@/lib/images";
import { useSettings } from "@/lib/content";

export default function IntroSection() {
  const { data: s } = useSettings();
  return (
    <section className="bg-paper py-24 md:py-36" aria-labelledby="intro-title">
      <div className="container-edit">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow mb-6 text-mist">Pam’s Mind Flights</p>
            <h2 id="intro-title" className="text-4xl font-light leading-[1.08] text-ink md:text-[3.4rem]">{s.intro_headline}</h2>
          </Reveal>
          <Reveal delay={0.15} className="lg:pt-12">
            <p className="text-lg leading-[1.8] text-mist">{s.intro_body}</p>
            <a href="#library" className="mt-8 inline-flex min-h-[44px] items-center gap-3 text-sm font-medium text-ink">
              <span className="link-underline">Discover Pam’s Work</span>
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="mt-16 md:mt-24">
          <div className="relative aspect-[16/9] overflow-hidden rounded-md md:aspect-[21/9]">
            <Image src={s.intro_image || IMAGES.horizon} alt="A closed book resting on a stone beside a calm lake at golden hour" loading="lazy" className="h-full w-full object-cover" />
            <p className="absolute bottom-5 left-5 max-w-xs font-heading text-lg italic text-ivory md:bottom-8 md:left-8 md:text-2xl">{s.intro_caption}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}