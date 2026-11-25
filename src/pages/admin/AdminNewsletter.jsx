import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2 } from "lucide-react";
import { db } from "@/api/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmpty from "@/components/admin/AdminEmpty";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminNewsletter() {
  const qc = useQueryClient();
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin", "NewsletterSubscriber", "list"], queryFn: () => db.entities.NewsletterSubscriber.list("-created_date", 1000) });
  const exportCsv = () => {
    const csv = ["First name,Email,Source,Status,Joined", ...rows.map((r) => [r.first_name || "", r.email, r.source || "", r.status, r.created_date?.slice(0, 10)].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "subscribers.csv";
    a.click();
  };
  const toggle = async (r) => { await db.entities.NewsletterSubscriber.update(r.id, { status: r.status === "subscribed" ? "unsubscribed" : "subscribed" }); qc.invalidateQueries({ queryKey: ["admin"] }); };
  const remove = async (r) => { if (window.confirm(`Remove ${r.email}?`)) { await db.entities.NewsletterSubscriber.delete(r.id); qc.invalidateQueries({ queryKey: ["admin"] }); } };

  return (
    <div>
      <AdminHeader title="Newsletter" description="People who joined the mailing list. Export the list any time to import into an email marketing service.">
        <button onClick={exportCsv} disabled={!rows.length} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-muted disabled:opacity-40"><Download className="h-4 w-4" /> Export CSV</button>
      </AdminHeader>
      {isLoading ? <div className="h-40 animate-pulse rounded-lg bg-card" /> : !rows.length ? <AdminEmpty title="No subscribers yet." /> : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground">
              <tr><th className="px-5 py-3 font-medium">Name</th><th className="px-5 py-3 font-medium">Email</th><th className="px-5 py-3 font-medium">Source</th><th className="px-5 py-3 font-medium">Joined</th><th className="px-5 py-3 font-medium">Status</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3">{r.first_name || "—"}</td>
                  <td className="px-5 py-3">{r.email}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.source}</td>
                  <td className="px-5 py-3 text-muted-foreground">{new Date(r.created_date).toLocaleDateString()}</td>
                  <td className="px-5 py-3"><button onClick={() => toggle(r)} title="Toggle status"><StatusBadge status={r.status} /></button></td>
                  <td className="px-5 py-3 text-right"><button onClick={() => remove(r)} className="p-1 text-muted-foreground hover:text-foreground" aria-label="Remove subscriber"><Trash2 className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}