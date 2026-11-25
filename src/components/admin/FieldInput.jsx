import React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import ImageUploader from "@/components/admin/ImageUploader";
import FileField from "@/components/admin/FileField";
import RefSelect, { selectCls } from "@/components/admin/RefSelect";
import RepeaterField from "@/components/admin/RepeaterField";
import { isPlaceholder } from "@/lib/content";

export const slugify = (s = "") => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");

function Control({ field: f, value, onChange, category }) {
  const id = `f-${f.key}`;
  switch (f.type) {
    case "textarea": return <Textarea id={id} rows={3} value={value || ""} onChange={(e) => onChange(e.target.value)} />;
    case "markdown": return <Textarea id={id} rows={10} className="font-mono text-[13px]" value={value || ""} onChange={(e) => onChange(e.target.value)} />;
    case "select": return (
      <select id={id} className={selectCls} value={value || ""} onChange={(e) => onChange(e.target.value)}>
        {f.options.map((o) => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    );
    case "boolean": return <Switch id={id} checked={!!value} onCheckedChange={onChange} />;
    case "date": return <Input id={id} type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-auto" />;
    case "color": return (
      <div className="flex items-center gap-2">
        <input type="color" aria-label={f.label} value={value || "#9B8FB4"} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded border border-border bg-transparent" />
        <Input id={id} value={value || ""} onChange={(e) => onChange(e.target.value)} className="w-32 font-mono" />
      </div>
    );
    case "image": return <ImageUploader value={value} onChange={onChange} category={category} tall={f.key === "cover_image"} />;
    case "images": return (
      <div className="space-y-3">
        {(value || []).map((src, i) => (
          <div key={i} className="flex items-center gap-2">
            <ImageUploader value={src} onChange={(v) => onChange((value || []).map((x, j) => (j === i ? v : x)).filter(Boolean))} category={category} />
            <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((_, j) => j !== i))} className="p-1 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
          </div>
        ))}
        <button type="button" onClick={() => onChange([...(value || []), ""])} className="inline-flex items-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground"><Plus className="h-4 w-4" /> Add image</button>
      </div>
    );
    case "file": return <FileField id={id} value={value} onChange={onChange} placeholder={f.placeholder} accept={f.accept} />;
    case "tags": return <Input id={id} value={(value || []).join(", ")} onChange={(e) => onChange(e.target.value.split(",").map((t) => t.trimStart()).filter((t, i, a) => t || i === a.length - 1))} />;
    case "ref": return <RefSelect id={id} entity={f.entity} value={value} onChange={onChange} />;
    case "repeater": return <RepeaterField value={value} onChange={onChange} subfields={f.subfields} addLabel={f.addLabel} />;
    default: return <Input id={id} value={value || ""} placeholder={f.placeholder} onChange={(e) => onChange(f.type === "slug" ? slugify(e.target.value) : e.target.value)} />;
  }
}

export default function FieldInput({ field, value, onChange, error, category }) {
  const placeholder = isPlaceholder(value) || (Array.isArray(value) && value.some((v) => isPlaceholder(v?.question) || isPlaceholder(v?.answer) || isPlaceholder(v?.body)));
  return (
    <div className={field.type === "boolean" ? "flex items-center justify-between gap-4 rounded-md border border-border px-4 py-3" : ""}>
      <label htmlFor={`f-${field.key}`} className="mb-1.5 block text-sm font-medium">
        {field.label}{field.required && <span className="text-red-400"> *</span>}
      </label>
      <Control field={field} value={value} onChange={onChange} category={category} />
      {placeholder && <p className="mt-1.5 text-xs text-amber-300">Placeholder text. Replace with Pam’s own content.</p>}
      {field.help && <p className="mt-1.5 text-xs text-muted-foreground">{field.help}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}