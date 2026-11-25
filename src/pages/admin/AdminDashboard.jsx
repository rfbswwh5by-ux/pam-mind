import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Sparkles, Newspaper, Video, ArrowRight } from "lucide-react";
import { db } from "@/api/client";
import AdminHeader from "@/components/admin/AdminHeader";
import StatusBadge from "@/components/admin/StatusBadge";
import { isPlaceholder } from "@/lib/content";

const useList = (entity, sort = "-updated_date") =>
  useQuery({ queryKey: ["admin", entity, "dash"], queryFn: () => db.entities[entity].list(sort, 500) }).data || [];

const QUICK = [
  { to: "/admin/books?new=1", label: "Add Book", Icon: BookOpen },
  { to: "/admin/offerings?new=1", label: "Add Offering", Icon: Sparkles },
  { to: "/admin/news?new=1", label: "Post News", Icon: Newspaper },
  { to: "/admin/videos?new=1", label: "Add Video", Icon: Video },
];

export default function AdminDashboard() {
  const books = useList("Book"), offerings = useList("Offering"), videos = useList("Video"), articles = useList("Article"), messages = useList("ContactMessage", "-created_date");
  const stats = [
    ["Total Books", books.length], ["Published Books", books.filter((b) => b.status === "published").length],
    ["Offerings", offerings.length], ["Videos", videos.length], ["News Articles", articles.length],
    ["Unread Messages", messages.filter((m) => m.status === "new").length],
  ];
  const recent = [...books.map((r) => ({ ...r, kind: "Book", to: "/admin/books" })), ...articles.map((r) => ({ ...r, kind: "Article", to: "/admin/news" })), ...offerings.map((r) => ({ ...r, kind: "Offering", to: "/admin/offerings" }))]
    .sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date)).slice(0, 6);
  const placeholders = [...books, ...offerings, ...videos, ...articles].filter((r) => isPlaceholder(r.title) || isPlaceholder(r.short_description) || isPlaceholder(r.description)).length;

  return (
    <div>
      <AdminHeader title="Welcome back" description="Here’s everything happening across Pam’s Mind Flights." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map(([label, n]) => (
          <div key={label} className="rounded-lg border border-border bg-card p-5">
            <p className="font-heading text-4xl font-light">{n}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      {placeholders > 0 && (
        <p className="mt-4 rounded-lg border border-amber-300/20 bg-amber-300/5 px-5 py-3 text-sm text-amber-200">
          {placeholders} item{placeholders > 1 ? "s" : ""} still use placeholder text, marked “Needs Pam’s real content” in each list. Also review About Pam details in Site Settings.
        </p>
      )}
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {QUICK.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="group flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4 text-sm transition-colors hover:border-lavender/50">
            <span className="flex items-center gap-3"><Icon className="h-4 w-4 text-lavender" /> {label}</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-heading text-2xl">Recent Messages</h2><Link to="/admin/messages" className="text-xs text-lavender hover:underline">View all</Link></div>
          {!messages.length ? <p className="py-8 text-center text-sm text-muted-foreground">No messages yet.</p> : (
            <ul className="divide-y divide-border">
              {messages.slice(0, 5).map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <div className="min-w-0"><p className="truncate text-sm">{m.name} · <span className="text-muted-foreground">{m.reason}</span></p><p className="truncate text-xs text-muted-foreground">{m.subject || m.message}</p></div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="mb-4 font-heading text-2xl">Recent Content</h2>
          {!recent.length ? <p className="py-8 text-center text-sm text-muted-foreground">No content yet.</p> : (
            <ul className="divide-y divide-border">
              {recent.map((r) => (
                <li key={r.id}><Link to={r.to} className="flex items-center justify-between gap-4 py-3 hover:text-ivory">
                  <div className="min-w-0"><p className="truncate text-sm">{r.title}</p><p className="text-xs text-muted-foreground">{r.kind}</p></div>
                  <StatusBadge status={r.status} />
                </Link></li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}