import React, { useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NAV } from "@/lib/nav";
import SocialLinks from "@/components/site/SocialLinks";
import { useSettings } from "@/lib/content";
import { LOGO } from "@/lib/images";

export default function MobileMenu({ open, onClose }) {
  const { data: s } = useSettings();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 flex flex-col bg-ink text-ivory lg:hidden"
        >
          <div className="container-edit flex h-20 items-center justify-between">
            <img src={s?.logo_image || LOGO} alt="Pam's Mind Flights" className="h-11 rounded-lg" />
            <button onClick={onClose} aria-label="Close menu" className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="container-edit flex-1 overflow-y-auto pt-8">
            <ul className="space-y-1">
              {NAV.map((n, i) => (
                <motion.li key={n.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05, duration: 0.5 }}>
                  <NavLink to={n.to} end={n.to === "/"} className={({ isActive }) => `block py-3 font-heading text-4xl font-light ${isActive ? "text-ivory" : "text-ivory/60"}`}>
                    {n.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </nav>
          <div className="container-edit space-y-6 border-t border-ivory/10 py-8">
            <Link to="/books" className="btn btn-light w-full">Explore the Books</Link>
            <SocialLinks dark labels />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}