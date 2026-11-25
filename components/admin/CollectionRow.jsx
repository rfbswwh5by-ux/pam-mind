import React from "react";
import { ArrowUp, ArrowDown, Pencil, Trash2, ExternalLink, Eye, EyeOff, Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import StatusBadge from "@/components/admin/StatusBadge";
import { isPlaceholder } from "@/lib/content";

const IconBtn = ({ label, onClick, children, disabled }) => (
  <button onClick={onClick} disabled={disabled} aria-label={label} title={label} className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-30">
    {children}
  </button>
);

export default function CollectionRow({ row, config, bookName, first, last, onEdit, onDelete, onToggle, onMove }) {
  const img = row[config.image];
  return (
    <li className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
      <button onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-4 text-left">
        <div className="h-14 w-11 shrink-0 overflow-hidden rounded bg-muted" style={!img && row.accent_primary ? { background: row.accent_primary } : undefined}>
          {img && <Image src={img} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0">
          <p className="flex items-center gap-2 truncate font-medium">
            {row.title || row.name}
            {row.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-300 text-amber-300" aria-label="Featured" />}
          </p>
          <p className="truncate text-xs text-muted-foreground">{[config.subtitle?.(row), bookName].filter(Boolean).join(" · ")}</p>
          {isPlaceholder(row.title) && <p className="text-[11px] text-amber-300">Needs Pam’s real content</p>}
        </div>
      </button>
      <div className="flex items-center gap-1 sm:justify-end">
        <StatusBadge status={row.status} />
        {config.reorder && (
          <>
            <IconBtn label="Move up" onClick={() => onMove(-1)} disabled={first}><ArrowUp className="h-4 w-4" /></IconBtn>
            <IconBtn label="Move down" onClick={() => onMove(1)} disabled={last}><ArrowDown className="h-4 w-4" /></IconBtn>
          </>
        )}
        <IconBtn label={row.status === "published" ? "Unpublish" : "Publish"} onClick={onToggle}>
          {row.status === "published" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </IconBtn>
        {config.publicPath && row.status === "published" && (
          <a href={config.publicPath(row)} target="_blank" rel="noopener noreferrer" aria-label="View on site" title="View on site" className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <IconBtn label="Edit" onClick={onEdit}><Pencil className="h-4 w-4" /></IconBtn>
        <IconBtn label="Delete" onClick={onDelete}><Trash2 className="h-4 w-4" /></IconBtn>
      </div>
    </li>
  );
}