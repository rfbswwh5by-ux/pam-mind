import React, { useState, useMemo } from "react";
import PageHero from "@/components/site/PageHero";
import FilterChips from "@/components/site/FilterChips";
import OfferingCard from "@/components/site/OfferingCard";
import AudioCard from "@/components/site/AudioCard";
import VideoCard from "@/components/site/VideoCard";
import VideoModal from "@/components/site/VideoModal";
import EmptyState from "@/components/site/EmptyState";
import { CardGridSkeleton } from "@/components/site/Skeletons";
import useSeo from "@/lib/useSeo";
import { useBooks, useOfferings, useAudio, useVideos, useSettings } from "@/lib/content";

const CATS = ["All", "Movement", "Audio", "Video", "Activities", "Downloads", "Programs"];

export default function Experiences() {
  const initial = new URLSearchParams(window.location.search).get("c");
  const [cat, setCat] = useState(CATS.includes(initial) ? initial : "All");
  const [video, setVideo] = useState(null);
  const { data: books = [] } = useBooks();
  const { data: offerings = [], isLoading } = useOfferings();
  const { data: audio = [] } = useAudio();
  const { data: videos = [] } = useVideos();
  const { data: s } = useSettings();
  useSeo({ title: "Experiences", description: "Movement, audio, video and resources connected to Pam’s books." });
  const bookOf = (id) => books.find((b) => b.id === id);

  const items = useMemo(() => {
    const o = offerings.filter((x) => cat === "All" || x.experience_category === cat).map((x) => ({ kind: "offering", x }));
    const a = cat === "All" || cat === "Audio" ? audio.map((x) => ({ kind: "audio", x })) : [];
    const v = cat === "All" || cat === "Video" ? videos.map((x) => ({ kind: "video", x })) : [];
    return [...o, ...a, ...v];
  }, [cat, offerings, audio, videos]);

  return (
    <>
      <PageHero eyebrow="Experiences" title={s.experiences_page_title} intro={s.experiences_page_intro} />
      <section className="container-edit py-16 md:py-24">
        <div className="mb-14"><FilterChips options={CATS} value={cat} onChange={setCat} label="Filter experiences" /></div>
        {isLoading && <CardGridSkeleton />}
        {!isLoading && !items.length && <EmptyState title={`No ${cat === "All" ? "" : cat.toLowerCase() + " "}experiences yet.`} text="New experiences are added as Pam’s books grow. Check back soon." />}
        <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ kind, x }) =>
            kind === "offering" ? <OfferingCard key={x.id} offering={x} book={bookOf(x.book_id)} /> :
            kind === "video" ? <VideoCard key={x.id} video={x} onPlay={setVideo} /> :
            <div key={x.id} className="sm:col-span-2"><AudioCard audio={x} book={bookOf(x.book_id)} /></div>
          )}
        </div>
      </section>
      <VideoModal video={video} onClose={() => setVideo(null)} />
    </>
  );
}