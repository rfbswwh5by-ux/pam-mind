import React from "react";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/images";

export default function AuthorPortrait({ photo, name = "Pam", className = "" }) {
  return (
    <figure className={`relative aspect-[4/5] overflow-hidden rounded-md ${className}`}>
      <Image src={photo || IMAGES.desk} alt={photo ? `Portrait of author ${name}` : "A writing desk by a sunlit window"} loading="lazy" className="h-full w-full object-cover" />
      {!photo && (
        <figcaption className="absolute bottom-4 left-4 rounded-full bg-ivory/90 px-4 py-2 text-xs italic text-ink">
          [Author portrait: upload in Site Settings]
        </figcaption>
      )}
    </figure>
  );
}