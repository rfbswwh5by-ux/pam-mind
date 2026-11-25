import React from "react";
import Reveal from "@/components/site/Reveal";
import PurchaseButtons from "@/components/site/PurchaseButtons";
import { tone } from "@/lib/theme";

export default function PurchaseSection({ book, dark }) {
  const t = tone(dark);
  return (
    <section id="purchase" className="scroll-mt-20 px-4 md:px-6" aria-labelledby="purchase-title">
      <Reveal className={`container-edit rounded-lg py-16 md:py-20 ${dark ? "bg-white/[0.05] ring-1 ring-ivory/10" : "bg-white/80 ring-1 ring-ink/5"}`}>
        <div className="grid items-center gap-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className={`eyebrow ${dark ? "text-taupe" : "text-[var(--accent)]"}`}>Available now</p>
            <h2 id="purchase-title" className={`mt-3 text-4xl font-light md:text-5xl ${t.text}`}>Get Your Copy</h2>
            {(book.formats || []).length > 0 && <p className={`mt-3 text-sm ${t.muted}`}>Formats: {book.formats.join(" · ")}</p>}
          </div>
          <PurchaseButtons book={book} dark={dark} />
        </div>
      </Reveal>
    </section>
  );
}