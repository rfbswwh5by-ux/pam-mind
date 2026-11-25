import React from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import ExperienceTile from "@/components/home/ExperienceTile";
import { Bar } from "@/components/site/Skeletons";
import { useBooks, useOfferings, useSettings } from "@/lib/content";

export default function MoreThanBook() {
  const { data: offerings = [], isLoading } = useOfferings();
  const { data: books = [] } = useBooks();
  const { data: s } = useSettings();
  const live = offerings.filter((o) => !o.coming_soon);
  const featured = live.filter((o) => o.featured);
  const pinned = live.find((o) => o.id === s.featured_offering_id);
  const tiles = [pinned, ...(featured.length ? featured : live).filter((o) => o !== pinned)].filter(Boolean).slice(0, 3);
  const bookOf = (o) => books.find((b) => b.id === o.book_id);
  if (!isLoading && !tiles.length) return null;

  return (
    <section className="bg-paper py-24 md:py-36" aria-labelledby="more-title">
      <div className="container-edit">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Beyond the page" title={<span id="more-title">{s.more_title}</span>} intro={s.more_intro} />
          <Link to="/experiences" className="btn btn-ink shrink-0 self-start md:self-auto">Explore All Experiences</Link>
        </div>
        {isLoading ? (
          <div className="grid gap-5 lg:grid-cols-2"><Bar className="aspect-[4/5]" /><div className="grid gap-5"><Bar className="aspect-[16/10]" /><Bar className="aspect-[16/10]" /></div></div>
        ) : (
          <Reveal className="grid gap-5 lg:grid-cols-2">
            {tiles[0] && <ExperienceTile offering={tiles[0]} book={bookOf(tiles[0])} large />}
            <div className="grid gap-5">
              {tiles.slice(1).map((o) => <ExperienceTile key={o.id} offering={o} book={bookOf(o)} />)}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}