import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import FieldInput, { slugify } from "@/components/admin/FieldInput";

export default function EditorDialog({ config, record, rows, onClose, onSave }) {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(null);
  useEffect(() => { setData(record || {}); setErrors({}); }, [record]);

  const set = (f) => (v) => {
    const next = { ...data, [f.key]: v };
    const slugField = config.fields.find((x) => x.type === "slug" && x.from === f.key);
    if (slugField && !record?.id && (!data[slugField.key] || data[slugField.key] === slugify(data[f.key] || ""))) next[slugField.key] = slugify(v);
    setData(next);
  };

  const submit = async (status) => {
    const errs = {};
    config.fields.forEach((f) => { if (f.required && !String(data[f.key] || "").trim()) errs[f.key] = `Please enter a ${f.label.toLowerCase()}.`; });
    if (data.slug && rows.some((r) => r.slug === data.slug && r.id !== data.id)) errs.slug = "Another item already uses this address. Please choose a different one.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const clean = { ...data };
    config.fields.filter((f) => f.type === "tags").forEach((f) => { clean[f.key] = (clean[f.key] || []).map((t) => t.trim()).filter(Boolean); });
    ["id", "created_date", "updated_date", "created_by_id", "created_by"].forEach((k) => delete clean[k]);
    if (status) clean.status = status;
    setSaving(status || "save");
    await onSave(data.id, clean);
    setSaving(null);
  };

  return (
    <Sheet open={!!record} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <SheetTitle className="font-heading text-3xl font-light">{record?.id ? `Edit ${config.singular}` : `New ${config.singular}`}</SheetTitle>
          <SheetDescription>Fields marked * are required. Everything else is optional and only appears on the site when filled in.</SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          {config.fields.map((f, i) =>
            f.section ? (
              <p key={`s${i}`} className="border-b border-border pb-2 pt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-lavender first:pt-0">{f.section}</p>
            ) : (
              <FieldInput key={f.key} field={f} value={data[f.key]} onChange={set(f)} error={errors[f.key]} category={config.mediaCategory} />
            )
          )}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border px-6 py-4">
          <button onClick={onClose} className="rounded-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => submit("draft")} disabled={!!saving} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm hover:bg-muted">
            {saving === "draft" && <Loader2 className="h-4 w-4 animate-spin" />} Save draft
          </button>
          <button onClick={() => submit("published")} disabled={!!saving} className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2 text-sm font-medium text-charcoal hover:bg-white">
            {saving === "published" && <Loader2 className="h-4 w-4 animate-spin" />} Publish
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}