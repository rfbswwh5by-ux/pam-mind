import React, { useEffect, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import Wordmark from "@/components/site/Wordmark";
import MobileMenu from "@/components/site/MobileMenu";

import { NAV } from "@/lib/nav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-ink/10 bg-ivory/90 backdrop-blur-md" : "border-b border-transparent bg-ivory"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">Skip to content</a>
      <div className={`container-edit flex items-center justify-between gap-6 transition-all duration-500 ${scrolled ? "h-16" : "h-20 md:h-24"}`}>
        <Wordmark compact={scrolled} />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.to === "/"} className={({ isActive }) => `link-underline py-2 text-[13px] tracking-wide transition-colors ${isActive ? "text-ink" : "text-mist hover:text-ink"}`}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1">
          <Link to="/search" aria-label="Search the site" className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/5">
            <Search className="h-[18px] w-[18px]" />
          </Link>
          <Link to="/books" className={`btn btn-ink hidden sm:inline-flex ${scrolled ? "min-h-[40px] px-5" : ""}`}>Explore the Books</Link>
          <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}