import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Check, KeyRound } from "lucide-react";
import { db } from "@/api/client";
import AdminHeader from "@/components/admin/AdminHeader";
import FieldInput from "@/components/admin/FieldInput";
import { Input } from "@/components/ui/input";
import { SETTINGS_GROUPS } from "@/components/admin/settingsFields";
import { mergeSettings } from "@/lib/content";
import { useAdminSession } from "@/lib/AdminSession";

function AccessCode() {
  const { changeCode } = useAdminSession();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) return setMsg({ error: true, text: "The two new codes don’t match." });
    setBusy(true);
    try {
      const res = await changeCode(current, next);
      if (res?.ok) {
        setMsg({ text: "Access code changed. Use the new code next time you sign in." });
        setCurrent(""); setNext(""); setConfirm("");
      } else setMsg({ error: true, text: res?.error || "Could not change the code." });
    } catch {
      setMsg({ error: true, text: "Could not change the code. Please try again." });
    } finally {
      setBusy(false);
    }
  };
  return (
    <section className="grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-[200px_1fr]">
      <h2 className="font-heading text-2xl">Access code</h2>
      <form onSubmit={submit} className="max-w-md space-y-4">
        <p className="text-sm text-muted-foreground">Change the code you use to sign in to this dashboard. If you ever forget it, use “Lost your access code?” on the sign-in screen with the site’s setup key.</p>
        <label className="block text-sm"><span className="mb-1.5 block font-medium">Current access code</span><Input aria-label="Current access code" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} autoComplete="current-password" /></label>
        <label className="block text-sm"><span className="mb-1.5 block font-medium">New access code</span><Input aria-label="New access code" type="password" value={next} onChange={(e) => setNext(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" /></label>
        <label className="block text-sm"><span className="mb-1.5 block font-medium">Confirm new access code</span><Input aria-label="Confirm new access code" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" /></label>
        {msg && <p role={msg.error ? "alert" : "status"} className={`text-sm ${msg.error ? "text-red-400" : "text-emerald-400"}`}>{msg.text}</p>}
        <button type="submit" disabled={busy || !current || next.length < 8} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-muted disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Change access code
        </button>
      </form>
    </section>
  );
}

export default function AdminSettings() {
  const qc = useQueryClient();
  const [data, setData] = useState(null);
  const [id, setId] = useState(null);
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    db.entities.SiteSettings.list("created_date", 1)
      .then((rows) => {
        setId(rows[0]?.id || null);
        setData(mergeSettings(rows[0]));
      })
      .catch((e) => setError(e.message || "Could not load the settings."));
  }, []);

  const save = async () => {
    setState("saving");
    setError("");
    const payload = {};
    SETTINGS_GROUPS.forEach((g) => g.fields.forEach((f) => { payload[f.key] = data[f.key] ?? ""; }));
    try {
      if (id) await db.entities.SiteSettings.update(id, payload);
      else setId((await db.entities.SiteSettings.create(payload)).id);
    } catch (e) {
      setError(e.message || "That didn’t save. Please try again.");
      setState("idle");
      return;
    }
    await qc.invalidateQueries();
    setState("saved");
    setTimeout(() => setState("idle"), 2000);
  };

  const button = (
    <button onClick={save} disabled={!data || state === "saving"} className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-white">
      {state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : state === "saved" ? <Check className="h-4 w-4" /> : null}
      {state === "saved" ? "Saved" : "Save changes"}
    </button>
  );

  return (
    <div>
      <AdminHeader title="Site Settings" description="Everything else on the website: name and logo, biography, homepage and page text, social links, legal pages and SEO.">{button}</AdminHeader>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-5 py-3 text-sm text-red-300">{error}</p>}
      {!data ? <div className="h-64 animate-pulse rounded-lg bg-card" /> : (
        <div className="space-y-6">
          {SETTINGS_GROUPS.map((g) => (
            <section key={g.title} className="grid gap-6 rounded-lg border border-border bg-card p-6 md:grid-cols-[200px_1fr]">
              <h2 className="font-heading text-2xl">{g.title}</h2>
              <div className="space-y-5">
                {g.fields.map((f) => (
                  <FieldInput key={f.key} field={f} value={data[f.key]} onChange={(v) => setData((d) => ({ ...d, [f.key]: v }))} category={f.key === "profile_photo" ? "Author Photo" : "General"} />
                ))}
              </div>
            </section>
          ))}
          <div className="flex justify-end">{button}</div>
          <AccessCode />
        </div>
      )}
    </div>
  );
}
