import React from "react";
import { ArrowUpRight, Headphones } from "lucide-react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/images";

export default function AudioCard({ audio, book }) {
  return (
    <article className="grid gap-6 rounded-lg bg-white/80 p-5 ring-1 ring-ink/5 sm:grid-cols-[160px_1fr] sm:p-6">
      <div className="aspect-square overflow-hidden rounded-md">
        <Image src={audio.artwork || IMAGES.meditation} alt={`Artwork for ${audio.title}`} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-col">
        <p className="eyebrow flex items-center gap-2 text-mist">
          <Headphones className="h-3.5 w-3.5" aria-hidden="true" /> Audio{audio.duration ? ` · ${audio.duration}` : ""}
        </p>
        <h3 className="mt-2 text-2xl font-light text-ink">{audio.title}</h3>
        {book && <p className="text-xs text-mist">Companion to {book.title}</p>}
        <p className="mt-2 text-sm leading-relaxed text-mist">{audio.description}</p>
        {audio.audio_url ? (
          <audio controls preload="none" src={audio.audio_url} className="mt-4 w-full" aria-label={`Listen to ${audio.title}`} />
        ) : null}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
          {audio.purchase_url && (
            <a href={audio.purchase_url} target="_blank" rel="noopener noreferrer" className="btn btn-ink">
              {audio.price ? `Get it · ${audio.price}` : "Listen Now"} <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
          {!audio.purchase_url && !audio.audio_url && <p className="text-sm italic text-mist">[Listening details coming soon]</p>}
        </div>
      </div>
    </article>
  );
}