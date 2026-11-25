import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, Reply } from "lucide-react";
import { db } from "@/api/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmpty from "@/components/admin/AdminEmpty";
import StatusBadge from "@/components/admin/StatusBadge";
import { selectCls } from "@/components/admin/RefSelect";

const STATUSES = ["new", "read", "responded", "archived"];

export default function AdminMessages() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin", "ContactMessage", "list"], queryFn: () => db.entities.ContactMessage.list("-created_date", 500) });
  const setStatus = async (m, status) => { await db.entities.ContactMessage.update(m.id, { status }); qc.invalidateQueries({ queryKey: ["admin"] }); };
  const expand = (m) => { setOpen(open === m.id ? null : m.id); if (m.status === "new") setStatus(m, "read"); };
  const remove = async (m) => { if (window.confirm("Delete this message?")) { await db.entities.ContactMessage.delete(m.id); qc.invalidateQueries({ queryKey: ["admin"] }); } };
  const shown = filter === "all" ? rows : rows.filter((m) => m.status === filter);

  return (
    <div>
      <AdminHeader title="Messages" description="Messages sent through the contact form. They’re stored privately and only admins can see them." />
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter === s ? "bg-ivory text-charcoal" : "border border-border text-muted-foreground hover:text-foreground"}`}>
            {s} {s !== "all" && `(${rows.filter((m) => m.status === s).length})`}
          </button>
        ))}
      </div>
      {isLoading ? <div className="h-40 animate-pulse rounded-lg bg-card" /> : !shown.length ? <AdminEmpty title="No messages here yet." /> : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {shown.map((m) => (
            <li key={m.id} className="px-5 py-4">
              <button onClick={() => expand(m)} className="grid w-full gap-1 text-left sm:grid-cols-[1.2fr_1fr_1.5fr_auto_auto] sm:items-center sm:gap-4" aria-expanded={open === m.id}>
                <span className={`truncate text-sm ${m.status === "new" ? "font-semibold" : ""}`}>{m.name}<span className="block truncate text-xs font-normal text-muted-foreground">{m.email}</span></span>
                <span className="text-xs text-muted-foreground">{m.reason}</span>
                <span className="truncate text-sm">{m.subject || "(No subject)"}</span>
                <span className="text-xs text-muted-foreground">{new Date(m.created_date).toLocaleDateString()}</span>
                <StatusBadge status={m.status} />
              </button>
              {open === m.id && (
                <div className="mt-4 rounded-md bg-muted/50 p-4">
                  <p className="whitespace-pre-line text-sm leading-relaxed">{m.message}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "Your message"))}`} onClick={() => setStatus(m, "responded")} className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm text-charcoal"><Reply className="h-4 w-4" /> Reply by email</a>
                    <label className="sr-only" htmlFor={`st-${m.id}`}>Status</label>
                    <select id={`st-${m.id}`} className={`${selectCls} w-40`} value={m.status} onChange={(e) => setStatus(m, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>)}
                    </select>
                    <button onClick={() => remove(m)} className="ml-auto rounded-md p-2 text-muted-foreground hover:text-foreground" aria-label="Delete message"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}