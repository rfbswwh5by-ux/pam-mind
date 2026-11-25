import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { db } from "@/api/client";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmpty from "@/components/admin/AdminEmpty";
import CollectionRow from "@/components/admin/CollectionRow";
import EditorDialog from "@/components/admin/EditorDialog";
import { toast } from "@/components/ui/use-toast";

const failed = (error) => toast({ variant: "destructive", title: "That didn’t save", description: error?.message || "Please try again." });

export default function CollectionManager({ config }) {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [editing, setEditing] = useState(null);
  const api = db.entities[config.entity];
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin", config.entity, "list"], queryFn: () => api.list(config.sort, 500) });
  const { data: books = [] } = useQuery({ queryKey: ["admin", "Book"], queryFn: () => db.entities.Book.list("sort_order", 500) });

  useEffect(() => {
    if (params.get("new")) {
      setEditing({ ...config.defaults });
      setParams({}, { replace: true });
    }
  }, [params, config, setParams]);

  const refresh = () => qc.invalidateQueries();
  const add = () => setEditing({ ...config.defaults, sort_order: rows.length });
  const save = async (id, data) => {
    try {
      if (id) await api.update(id, data);
      else await api.create(data);
    } catch (error) {
      failed(error);
      return;
    }
    await refresh();
    setEditing(null);
    toast({ title: "Saved" });
  };
  const remove = async (row) => {
    if (!window.confirm(`Delete “${row.title}”? This can’t be undone.`)) return;
    try { await api.delete(row.id); } catch (error) { failed(error); }
    refresh();
  };
  const toggle = async (row) => {
    try { await api.update(row.id, { status: row.status === "published" ? "draft" : "published" }); } catch (error) { failed(error); }
    refresh();
  };
  const move = async (i, dir) => {
    const next = [...rows];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    try { await api.bulkUpdate(next.map((r, idx) => ({ id: r.id, sort_order: idx }))); } catch (error) { failed(error); }
    refresh();
  };
  const bookName = (id) => books.find((b) => b.id === id)?.title;

  return (
    <div>
      <AdminHeader title={config.label} description={`${rows.length} ${rows.length === 1 ? config.singular.toLowerCase() : config.label.toLowerCase()} · Drafts are never shown publicly.`}>
        <button onClick={add} className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-white">
          <Plus className="h-4 w-4" /> Add {config.singular.toLowerCase()}
        </button>
      </AdminHeader>
      {isLoading ? (
        <div className="space-y-2">{[0, 1, 2].map((i) => <div key={i} className="h-20 animate-pulse rounded-lg bg-card" />)}</div>
      ) : !rows.length ? (
        <AdminEmpty title={`No ${config.label.toLowerCase()} yet.`} action={`Add your first ${config.singular.toLowerCase()}`} onAction={add} />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {rows.map((r, i) => (
            <CollectionRow key={r.id} row={r} config={config} bookName={config.entity !== "Book" && bookName(r.book_id)} first={i === 0} last={i === rows.length - 1}
              onEdit={() => setEditing(r)} onDelete={() => remove(r)} onToggle={() => toggle(r)} onMove={(d) => move(i, d)} />
          ))}
        </ul>
      )}
      <EditorDialog config={config} record={editing} rows={rows} onClose={() => setEditing(null)} onSave={save} />
    </div>
  );
}