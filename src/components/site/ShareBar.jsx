import React, { useState } from "react";
import { Facebook, Mail, Link2, Check } from "lucide-react";

export default function ShareBar({ title, dark = false }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.href : "";
  const cls = `inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-500 ${dark ? "border-ivory/20 text-ivory hover:bg-ivory hover:text-ink" : "border-ink/15 text-ink hover:bg-ink hover:text-ivory"}`;
  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-3">
      <span className={`eyebrow mr-2 ${dark ? "text-ivory/60" : "text-mist"}`}>Share</span>
      <a className={cls} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
        <Facebook className="h-4 w-4" />
      </a>
      <a className={cls} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} aria-label="Share by email">
        <Mail className="h-4 w-4" />
      </a>
      <button className={cls} onClick={copy} aria-label="Copy link">
        {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      </button>
      <span role="status" className="sr-only">{copied ? "Link copied" : ""}</span>
    </div>
  );
}