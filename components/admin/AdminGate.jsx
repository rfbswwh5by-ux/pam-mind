import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAdminSession } from "@/lib/AdminSession";

function Frame({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal px-6 py-12 text-ivory">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

const primary = "mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-white disabled:opacity-60";
const secondary = "inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm hover:bg-white/5 disabled:opacity-60";

function Field({ label, ...props }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-zinc-400">{label}</span>
      <Input aria-label={label} {...props} />
    </label>
  );
}

/** Shows the dashboard once signed in; otherwise the claim, sign-in or recovery screen. */
export default function AdminGate({ children }) {
  const { status, loadError, login, claim, recover, retry } = useAdminSession();
  const [code, setCode] = useState("");
  const [confirm, setConfirm] = useState("");
  const [setupKey, setSetupKey] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recovering, setRecovering] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newConfirm, setNewConfirm] = useState("");

  if (status === "unlocked") return children;

  if (status === "loading") {
    return <div className="flex min-h-screen items-center justify-center bg-charcoal"><Loader2 className="h-6 w-6 animate-spin text-lavender" /></div>;
  }

  if (status === "error") {
    return (
      <Frame>
        <Lock className="mx-auto h-6 w-6 text-lavender" />
        <h1 className="mt-4 text-center font-heading text-4xl font-light">Can’t open the dashboard</h1>
        <p className="mt-3 text-center text-sm text-zinc-400">{loadError}</p>
        <button type="button" onClick={retry} className={`${primary} mt-8`}>Try again</button>
      </Frame>
    );
  }

  const isSetup = status === "setup";
  const type = visible ? "text" : "password";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (isSetup && code !== confirm) return setError("The two codes don’t match.");
    setBusy(true);
    try {
      const res = isSetup ? await claim(code, setupKey) : await login(code);
      if (!res?.ok) setError(res?.error || "That code isn’t right.");
      else {
        setCode("");
        setConfirm("");
        setSetupKey("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    if (newCode !== newConfirm) return setError("The two new codes don’t match.");
    setBusy(true);
    try {
      const res = await recover(newCode, setupKey);
      if (res?.ok) {
        setNotice("Your access code was reset. Enter the new code to sign in.");
        setRecovering(false);
        setNewCode("");
        setNewConfirm("");
        setSetupKey("");
      } else setError(res?.error || "Could not reset the access code.");
    } catch {
      setError("Could not reset the access code. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const errorBox = error && (
    <p role="alert" className="flex items-start gap-2 text-sm text-red-400"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" /> {error}</p>
  );

  if (recovering && !isSetup) {
    return (
      <Frame>
        <Lock className="mx-auto h-6 w-6 text-lavender" />
        <h1 className="mt-4 text-center font-heading text-4xl font-light">Reset your access code</h1>
        <p className="mt-3 text-center text-sm text-zinc-400">Enter the site’s setup key (the private key you were given with the website) and choose a new access code. Anyone signed in elsewhere is signed out.</p>
        <form onSubmit={reset} className="mt-8 space-y-4">
          <Field label="Setup key" type="password" value={setupKey} onChange={(e) => setSetupKey(e.target.value)} autoComplete="off" autoFocus />
          <Field label="New access code" type={type} value={newCode} onChange={(e) => setNewCode(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" />
          <Field label="Confirm new access code" type={type} value={newConfirm} onChange={(e) => setNewConfirm(e.target.value)} autoComplete="new-password" />
          {errorBox}
          <button type="submit" disabled={busy || !setupKey || newCode.length < 8} className={primary}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Reset access code
          </button>
          <button type="button" onClick={() => { setRecovering(false); setError(""); }} className={secondary}>Back to sign in</button>
        </form>
      </Frame>
    );
  }

  return (
    <Frame>
      <Lock className="mx-auto h-6 w-6 text-lavender" />
      <h1 className="mt-4 text-center font-heading text-4xl font-light">{isSetup ? "Claim this website" : "Admin access"}</h1>
      <p className="mt-3 text-center text-sm text-zinc-400">
        {isSetup
          ? "First-time setup. Enter the setup key you were given and choose your own access code. You’ll use that code to sign in from now on."
          : "Enter your access code to manage the website."}
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block text-zinc-400">{isSetup ? "Choose an access code" : "Access code"}</span>
          <div className="relative">
            <Input aria-label={isSetup ? "Choose an access code" : "Access code"} type={type} value={code} onChange={(e) => setCode(e.target.value)}
              autoComplete={isSetup ? "new-password" : "current-password"} autoFocus placeholder={isSetup ? "At least 8 characters" : "••••••••"} className="pr-10" />
            <button type="button" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide code" : "Show code"} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-ivory">
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        {isSetup && (
          <>
            <Field label="Confirm access code" type={type} value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
            <Field label="Setup key" type="password" value={setupKey} onChange={(e) => setSetupKey(e.target.value)} autoComplete="off" />
          </>
        )}
        {errorBox}
        {notice && <p role="status" className="text-sm text-emerald-400">{notice}</p>}
        <button type="submit" disabled={busy || !code || (isSetup && !setupKey)} className={primary}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} {isSetup ? "Set code & enter" : "Enter"}
        </button>
      </form>
      {!isSetup && (
        <button type="button" onClick={() => { setRecovering(true); setError(""); setNotice(""); }} className="mx-auto mt-5 block text-xs text-zinc-500 underline-offset-2 hover:text-ivory hover:underline">
          Lost your access code?
        </button>
      )}
      <p className="mt-6 text-center text-[11px] leading-relaxed text-zinc-500">
        Codes are stored securely (never in plain text). Sessions last 8 hours, and repeated wrong attempts are locked for 15 minutes.
      </p>
      <Link to="/" className="mt-4 block text-center text-xs text-zinc-500 hover:text-ivory">Back to website</Link>
    </Frame>
  );
}
