import React from "react";
import { Facebook, Instagram } from "lucide-react";
import { useSettings } from "@/lib/content";

export default function SocialLinks({ dark = false, labels = false, className = "" }) {
  const { data: s } = useSettings();
  const links = [
    { url: s?.facebook_url, label: "Facebook", Icon: Facebook },
    { url: s?.instagram_url, label: "Instagram", Icon: Instagram },
  ].filter((l) => l.url);

  if (!links.length) {
    return <p className={`text-xs italic ${dark ? "text-ivory/45" : "text-mist/80"} ${className}`}>[Facebook & Instagram links: add in Site Settings]</p>;
  }
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ url, label, Icon }) => (
        <li key={label}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Pam on ${label}`}
            className={`inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border px-3 text-sm transition-all duration-500 ${
              dark ? "border-ivory/20 text-ivory hover:bg-ivory hover:text-ink" : "border-ink/15 text-ink hover:bg-ink hover:text-ivory"
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {labels && <span className="pr-1">{label}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}