import React from "react";
import { Feather } from "lucide-react";

export default function EmptyState({ title, text, action, dark = false }) {
  return (
    <div className={`rounded-lg border border-dashed px-6 py-16 text-center ${dark ? "border-ivory/20 text-ivory" : "border-ink/15 text-ink"}`}>
      <Feather className={`mx-auto h-6 w-6 ${dark ? "text-taupe" : "text-lavender"}`} aria-hidden="true" />
      <p className="mt-4 font-heading text-2xl">{title}</p>
      {text && <p className={`mx-auto mt-2 max-w-md text-sm ${dark ? "text-ivory/60" : "text-mist"}`}>{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}