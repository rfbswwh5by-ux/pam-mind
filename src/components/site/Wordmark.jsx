import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "@/lib/content";
import { LOGO } from "@/lib/images";

export default function Wordmark({ dark = false, compact = false }) {
  const { data: s } = useSettings();
  return (
    <Link to="/" className="inline-flex min-h-[44px] items-center" aria-label="Pam's Mind Flights, home">
      <img
        src={s?.logo_image || LOGO}
        alt="Pam's Mind Flights"
        className={`shrink-0 rounded-lg transition-all duration-500 ${compact ? "h-9" : "h-11 md:h-14"}`}
      />
    </Link>
  );
}