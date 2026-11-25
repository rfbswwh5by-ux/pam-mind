import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Upload, Loader2, Trash2, Copy, RefreshCw, Check, Video, Music, FileText } from "lucide-react";
import { db, uploadFile } from "@/api/client";
import { Image } from "@/components/ui/image";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminEmpty from "@/components/admin/AdminEmpty";
import { uploadImage } from "@/components/admin/ImageUploader";
import { selectCls } from "@/components/admin/RefSelect";

const CATS = ["General", "Book Cover", "Author Photo", "Article Image", "Video Thumbnail", "Audio Artwork"];
const ACCEPT = "image/*,video/*,audio/*,.pdf,.epub";
const MAX_MB = 200;

const kindOf = (url = "") =>
  /\.(mp4|mov|webm|m4v)$/i.test(url) ? "video"
    : /\.(mp3|m4a|wav|ogg|aac|flac)$/i.test(url) ? "audio"
    : /\.(pdf|epub|zip)$/i.test(url) ? "document"
    : "image";

async function uploadToLibrary(file, category) {
  if (file.type.startsWith("image/")) return uploadImage(file, category);
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`Files must be under ${MAX_MB} MB.`);
  const file_url = await uploadFile(file);
  const fileCategory = file.type.startsWith("video/") ? "Video File" : file.type.startsWith("audio/") ? "Audio File" : category;
  await db.entities.MediaAsset.create({ title: file.name, file_url, category: fileCategory });
  return file_url;
}

function Preview({ asset }) {
  const kind = kindOf(asset.file_url);
  if (kind === "image") {
    return <Image src={asset.file_url} alt={asset.alt_text || asset.title || ""} className="h-full w-full object-cover" />;
  }
  const Icon = kind === "video" ? Video : kind === "audio" ? Music : FileText;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <Icon className="h-8 w-8" />
      <span className="text-[10px] uppercase tracking-widest">{kind}</span>
    </div>
  );
}

export default function AdminMedia() {
  const qc = useQueryClient();
  const [cat, setCat] = useState("General");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(null);
  const { data: rows = [], isLoading } = useQuery({ queryKey: ["admin", "MediaAsset", "list"], queryFn: () => db.entities.MediaAsset.list("-created_date", 500) });
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin"] });

  const onUpload = async (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    setBusy(true); setErr("");
    for (const f of files) {
      try { await uploadToLibrary(f, cat); } catch (x) { setErr(`${f.name}: ${x.message}`); }
    }
    setBusy(false); refresh();
  };
  const replace = async (row, e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const file_url = f.type.startsWith("image/") ? await uploadImage(f, row.category, { library: false }) : await uploadFile(f);
      await db.entities.MediaAsset.update(row.id, { file_url, title: f.name });
      refresh();
    } catch (x) {
      setErr(`${f.name}: ${x.message}`);
    }
  };
  const remove = async (row) => {
    if (!window.confirm("Delete this file from the library? Pages already using it will keep their copy of the link.")) return;
    try { await db.entities.MediaAsset.delete(row.id); } catch (x) { setErr(x.message); }
    refresh();
  };
  const copy = async (row) => { await navigator.clipboard.writeText(row.file_url); setCopied(row.id); setTimeout(() => setCopied(null), 1500); };

  return (
    <div>
      <AdminHeader title="Media Library" description="Every image, video and audio file uploaded across the site. Files uploaded inside a book, video or audio item are added here automatically.">
        <select aria-label="Category for new image uploads" className={`${selectCls} w-44`} value={cat} onChange={(e) => setCat(e.target.value)}>{CATS.map((c) => <option key={c}>{c}</option>)}</select>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-white focus-within:ring-2 focus-within:ring-ring">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload files
          <input type="file" accept={ACCEPT} multiple className="sr-only" onChange={onUpload} disabled={busy} />
        </label>
      </AdminHeader>
      {err && <p className="mb-4 text-sm text-red-400">{err}</p>}
      {isLoading ? <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-card" />)}</div> : !rows.length ? <AdminEmpty title="No media yet. Upload your first file above." /> : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {rows.map((r) => (
            <li key={r.id} className="overflow-hidden rounded-lg border border-border bg-card">
              <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-muted"><Preview asset={r} /></a>
              <div className="p-3">
                <p className="truncate text-xs">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.category}</p>
                <div className="mt-2 flex gap-1">
                  <button onClick={() => copy(r)} className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Copy link">{copied === r.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button>
                  <label className="cursor-pointer rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Replace file"><RefreshCw className="h-4 w-4" /><input type="file" accept={ACCEPT} className="sr-only" onChange={(e) => replace(r, e)} /></label>
                  <button onClick={() => remove(r)} className="ml-auto rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}