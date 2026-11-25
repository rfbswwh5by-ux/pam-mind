import React from "react";
import { Link } from "react-router-dom";
import Wordmark from "@/components/site/Wordmark";
import SocialLinks from "@/components/site/SocialLinks";
import FlightPath from "@/components/site/FlightPath";
import { useSettings } from "@/lib/content";

const Col = ({ title, links }) => (
  <div>
    <p className="eyebrow mb-5 text-taupe">{title}</p>
    <ul className="space-y-3">
      {links.map(([to, label]) => (
        <li key={to}>
          <Link to={to} className="link-underline text-sm text-ivory/75 transition-colors hover:text-ivory">{label}</Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  const { data: s } = useSettings();
  return (
    <footer className="relative overflow-hidden bg-ink text-ivory">
      <FlightPath className="absolute inset-x-0 top-0 h-32 w-full" color="#B7A999" />
      <div className="container-edit relative grid gap-12 pb-12 pt-24 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="max-w-xs">
          <Wordmark dark />
          <p className="mt-5 font-heading text-xl italic text-ivory/70">{s?.footer_text}</p>
        </div>
        <Col title="Explore" links={[["/books", "Books"], ["/experiences", "Experiences"], ["/news", "News"]]} />
        <Col title="About" links={[["/about", "About Pam"], ["/contact", "Contact"]]} />
        <div>
          <p className="eyebrow mb-5 text-taupe">Connect</p>
          <SocialLinks dark labels className="flex-wrap" />
        </div>
      </div>
      <div className="container-edit relative flex flex-col gap-4 border-t border-ivory/10 py-8 text-xs text-ivory/55 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {s?.site_name || "Pam’s Mind Flights"}. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="link-underline hover:text-ivory">Privacy Policy</Link>
          <Link to="/terms" className="link-underline hover:text-ivory">Terms</Link>
        </div>
      </div>
    </footer>
  );
}