import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/admin/ImageUploader";

export default function RepeaterField({ value = [], onChange, subfields, addLabel = "Add item" }) {
  const items = value || [];
  const update = (i, k, v) => onChange(items.map((it, j) => (j === i ? { ...it, [k]: v } : it)));
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="relative space-y-3 rounded-md border border-border bg-muted/40 p-4 pr-12">
          {subfields.map((sf) => (
            <div key={sf.key}>
              <p className="mb-1 text-xs text-muted-foreground">{sf.label}</p>
              {sf.type === "textarea" ? (
                <Textarea rows={3} value={it[sf.key] || ""} onChange={(e) => update(i, sf.key, e.target.value)} />
              ) : sf.type === "image" ? (
                <ImageUploader value={it[sf.key]} onChange={(v) => update(i, sf.key, v)} />
              ) : (
                <Input value={it[sf.key] || ""} placeholder={sf.placeholder} onChange={(e) => update(i, sf.key, e.target.value)} />
              )}
            </div>
          ))}
          <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} className="absolute right-3 top-3 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Remove item">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, {}])} className="inline-flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
        <Plus className="h-4 w-4" /> {addLabel}
      </button>
    </div>
  );
}