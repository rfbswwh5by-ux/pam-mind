import React from "react";
import { Play } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/images";

export default function VideoCard({ video, onPlay, dark = false }) {
  return (
    <button onClick={() => onPlay(video)} className="group block w-full text-left" aria-label={`Play video: ${video.title}`}>
      <div className="relative aspect-video overflow-hidden rounded-md">
        <Image src={video.thumbnail || IMAGES.wellness} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]" />
        <span className="absolute inset-0 bg-ink/20 transition-colors duration-500 group-hover:bg-ink/35" aria-hidden="true" />
        <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 text-ink transition-transform duration-500 group-hover:scale-105" aria-hidden="true">
          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
        </span>
        {video.duration && <span className="absolute bottom-3 right-3 rounded bg-ink/80 px-2 py-0.5 text-xs text-ivory">{video.duration}</span>}
      </div>
      <div className="pt-4">
        {video.category && <p className={`eyebrow ${dark ? "text-taupe" : "text-mist"}`}>{video.category}</p>}
        <h3 className={`mt-2 text-xl font-light ${dark ? "text-ivory" : "text-ink"}`}>{video.title}</h3>
        {video.description && <p className={`mt-1 line-clamp-2 text-sm ${dark ? "text-ivory/60" : "text-mist"}`}>{video.description}</p>}
      </div>
    </button>
  );
}