import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function PurchaseButtons({ book, dark = false }) {
  const links = (book?.purchase_links || []).filter((l) => l?.url);
  if (!links.length) {
    return (
      <p className={`rounded-md border border-dashed px-5 py-4 text-sm italic ${dark ? "border-ivory/20 text-ivory/60" : "border-ink/15 text-mist"}`}>
        [Purchase links coming soon. Add retailers in the admin dashboard.]
      </p>
    );
  }
  return (
    <ul className="flex flex-wrap gap-3">
      {links.map((l, i) => (
        <li key={i}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn ${i === 0 ? (dark ? "btn-light" : "btn-ink") : dark ? "btn-outline-light" : "btn-outline"}`}
          >
            {l.retailer || "Buy the Book"} <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}