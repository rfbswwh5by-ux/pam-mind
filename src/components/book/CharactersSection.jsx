import React from "react";
import { Image } from "@/components/ui/image";
import SectionHeading from "@/components/site/SectionHeading";
import { tone } from "@/lib/theme";

export default function CharactersSection({ book, dark }) {
  const chars = (book.characters || []).filter((c) => c?.name);
  if (!chars.length) return null;
  const t = tone(dark);
  return (
    <section className={`border-t py-20 md:py-28 ${t.border}`}>
      <div className="container-edit">
        <SectionHeading eyebrow="The cast" title="Meet the Characters" dark={dark} className="mb-14" />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {chars.map((c, i) => (
            <article key={i}>
              {c.image && (
                <div className="mb-5 aspect-[4/5] overflow-hidden rounded-md">
                  <Image src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover" />
                </div>
              )}
              <h3 className={`text-2xl font-light ${t.text}`}>{c.name}</h3>
              {c.description && <p className={`mt-2 text-sm leading-relaxed ${t.muted}`}>{c.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}