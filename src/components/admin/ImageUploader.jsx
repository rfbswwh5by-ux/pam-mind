import React, { useState } from "react";
import { db, uploadFile } from "@/api/client";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Image } from "@/components/ui/image";

export async function uploadImage(file, category = "General", { library = true } = {}) {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file (JPG, PNG, WebP or GIF).");
  if (file.size > 10 * 1024 * 1024) throw new Error("Images must be under 10 MB.");
  const file_url = await uploadFile(file);
  if (library) await db.entities.MediaAsset.create({ title: file.name, file_url, category }).catch(() => null);
  return file_url;
}

export default function ImageUploader({ value, onChange, category, tall = false }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      onChange(await uploadImage(file, category));
    } catch (x) {
      setErr(x.message);
    }
    setBusy(false);
  };
  return (
    <div className="flex items-start gap-4">
      <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted ${tall ? "h-28 w-20" : "h-20 w-28"}`}>
        {value ? <Image src={value} alt="Preview" className="h-full w-full object-cover" /> : <ImagePlus className="h-5 w-5 text-muted-foreground" />}
      </div>
      <div className="space-y-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted focus-within:ring-2 focus-within:ring-ring">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {value ? "Replace image" : "Upload image"}
          <input type="file" accept="image/*" className="sr-only" onChange={pick} disabled={busy} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" /> Remove
          </button>
        )}
        {err && <p className="text-xs text-red-400">{err}</p>}
      </div>
    </div>
  );
}