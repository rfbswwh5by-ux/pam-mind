import React from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const embedUrl = (v) => {
  const url = v?.video_url || "";
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return { type: "iframe", src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0` };
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vm) return { type: "iframe", src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  if (url) return { type: "video", src: url };
  return null;
};

export default function VideoModal({ video, onClose }) {
  const embed = embedUrl(video);
  return (
    <Dialog open={!!video} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl border-none bg-ink p-0 text-ivory sm:rounded-lg">
        <div className="aspect-video w-full overflow-hidden bg-black sm:rounded-t-lg">
          {embed?.type === "iframe" && <iframe src={embed.src} title={video?.title} className="h-full w-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />}
          {embed?.type === "video" && <video src={embed.src} controls autoPlay className="h-full w-full" />}
          {!embed && <div className="flex h-full items-center justify-center font-heading text-2xl italic text-ivory/60">Video coming soon</div>}
        </div>
        <div className="p-6 md:p-8">
          <DialogTitle className="font-heading text-3xl font-light">{video?.title}</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-ivory/65">{video?.description}</DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
}