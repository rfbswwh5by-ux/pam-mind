import React, { useState } from "react";
import { Info } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import VideoCard from "@/components/site/VideoCard";
import VideoModal from "@/components/site/VideoModal";

export default function VideoLibrary({ videos, dark, disclaimer }) {
  const [active, setActive] = useState(null);
  if (!videos.length) return null;
  return (
    <div className="container-edit pb-20 md:pb-28">
      <SectionHeading eyebrow="Watch" title="Video Resources" dark={dark} className="mb-10" />
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => <VideoCard key={v.id} video={v} onPlay={setActive} dark={dark} />)}
      </div>
      {disclaimer && (
        <aside className={`mt-12 flex gap-4 rounded-lg p-6 text-sm leading-relaxed ${dark ? "bg-white/[0.05] text-ivory/70" : "bg-white/70 text-mist ring-1 ring-ink/5"}`} aria-label="Disclaimer">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{disclaimer}</p>
        </aside>
      )}
      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  );
}