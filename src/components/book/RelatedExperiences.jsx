import React from "react";
import SectionHeading from "@/components/site/SectionHeading";
import OfferingCard from "@/components/site/OfferingCard";
import MovementFeature from "@/components/book/MovementFeature";

export default function RelatedExperiences({ book, offerings, dark }) {
  if (!offerings.length) return null;
  const movement = book.theme === "playful" ? offerings.find((o) => o.experience_category === "Movement" && !o.coming_soon) : null;
  const rest = offerings.filter((o) => o !== movement);
  return (
    <div className="container-edit py-20 md:py-28">
      <SectionHeading eyebrow="In-flight extras" title="Related Experiences" intro="Resources and experiences that continue the journey beyond the book." dark={dark} className="mb-14" />
      {movement && <MovementFeature offering={movement} />}
      {rest.length > 0 && (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((o) => <OfferingCard key={o.id} offering={o} dark={dark} />)}
        </div>
      )}
    </div>
  );
}