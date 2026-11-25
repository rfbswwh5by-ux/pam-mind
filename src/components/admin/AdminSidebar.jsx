import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, BookOpen, Sparkles, Video, Headphones, Newspaper, Image as ImageIcon, Mail, Users, Settings, ArrowUpRight, LogOut } from "lucide-react";
import { useAdminSession } from "@/lib/AdminSession";

export const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/books", label: "Books", Icon: BookOpen },
  { to: "/admin/offerings", label: "Offerings", Icon: Sparkles },
  { to: "/admin/videos", label: "Videos", Icon: Video },
  { to: "/admin/audio", label: "Audio", Icon: Headphones },
  { to: "/admin/news", label: "News", Icon: Newspaper },
  { to: "/admin/media", label: "Media", Icon: ImageIcon },
  { to: "/admin/messages", label: "Messages", Icon: Mail },
  { to: "/admin/newsletter", label: "Newsletter", Icon: Users },
  { to: "/admin/settings", label: "Site Settings", Icon: Settings },
];

export default function AdminSidebar() {
  const { logout } = useAdminSession();
  const link = ({ isActive }) => `flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-white/10 text-ivory" : "text-zinc-400 hover:bg-white/5 hover:text-ivory"}`;
  return (
    <aside className="border-b border-border bg-[#1F1F1F] lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-5">
        <Link to="/admin" className="font-heading text-xl text-ivory">Pam’s Mind Flights<span className="block font-body text-[10px] uppercase tracking-[0.25em] text-lavender">Control Tower</span></Link>
      </div>
      <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
        {ADMIN_NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={link}><Icon className="h-4 w-4" /> {label}</NavLink>
        ))}
      </nav>
      <div className="flex gap-1 border-t border-border px-3 py-3 lg:absolute lg:bottom-0 lg:block lg:w-full lg:space-y-1 lg:py-4">
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm text-zinc-400 hover:text-ivory"><ArrowUpRight className="h-4 w-4" /> View website</a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-400 hover:text-ivory"><LogOut className="h-4 w-4" /> Sign out</button>
      </div>
    </aside>
  );
}