import React from "react";
import SectionHeading from "@/components/site/SectionHeading";
import AudioCard from "@/components/site/AudioCard";

export default function AudioSection({ audio, dark }) {
  if (!audio.length) return null;
  return (
    <div className="container-edit pb-20 md:pb-28">
      <SectionHeading eyebrow="Listen" title="Meditation & Audio" dark={dark} className="mb-10" />
      <div className="grid gap-6 lg:grid-cols-2">
        {audio.map((a) => <AudioCard key={a.id} audio={a} />)}
      </div>
    </div>
  );
}