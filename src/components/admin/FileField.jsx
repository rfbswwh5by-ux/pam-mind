import React, { useState } from "react";
import { db, uploadFile } from "@/api/client";
import { Upload, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

const ALLOWED = /\.(mp3|m4a|wav|ogg|aac|flac|mp4|mov|webm|m4v|pdf|zip|epub|png|jpe?g|webp)$/i;

export default function FileField({ id, value, onChange, placeholder = "https://", accept }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!ALLOWED.test(file.name)) return setErr("That file type isn’t supported. Use audio, video, PDF, EPUB, ZIP or image files.");
    if (file.size > 200 * 1024 * 1024) return setErr("Files must be under 200 MB.");
    setBusy(true);
    setErr("");
    try {
      const file_url = await uploadFile(file);
      onChange(file_url);
      const category = file.type.startsWith("video/") ? "Video File" : file.type.startsWith("audio/") ? "Audio File" : "General";
      await db.entities.MediaAsset.create({ title: file.name, file_url, category }).catch(() => null);
    } catch (x) {
      setErr(x.message || "Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <div className="flex gap-2">
        <Input id={id} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload
          <input type="file" accept={accept} className="sr-only" onChange={pick} disabled={busy} />
        </label>
      </div>
      {err && <p className="mt-1 text-xs text-red-400">{err}</p>}
    </div>
  );
}