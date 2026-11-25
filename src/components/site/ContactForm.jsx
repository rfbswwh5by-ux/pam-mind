import React, { useState } from "react";
import { publicCall } from "@/api/client";
import { Check, Loader2 } from "lucide-react";
import { clean, isEmail, throttled } from "@/lib/forms";

const REASONS = ["General Question", "Book Question", "Speaking / Event Inquiry", "Media Inquiry", "Book Club", "Other"];
const EMPTY = { reason: "General Question", name: "", email: "", subject: "", message: "", company: "" };

export default function ContactForm() {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [failure, setFailure] = useState("");
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (f.company) return setState("done");
    const errs = {};
    if (!clean(f.name)) errs.name = "Please enter your name.";
    if (!isEmail(f.email)) errs.email = "Please enter a valid email address.";
    if (clean(f.message).length < 5) errs.message = "Please enter a message.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (throttled("pmf_contact", 60)) return setErrors({ message: "Your message was just sent. Please wait a minute before sending another." });
    setState("loading");
    try {
      await publicCall("contact.submit", { reason: f.reason, name: clean(f.name, 120), email: clean(f.email, 200), subject: clean(f.subject, 200), message: clean(f.message, 5000), company: f.company });
      setState("done");
    } catch (err) {
      setFailure(err?.code === "RATE_LIMIT" || err?.code === "INVALID" ? err.message : "");
      setState("error");
    }
  };

  if (state === "done") {
    return (
      <div role="status" className="rounded-lg bg-white/80 p-10 text-center ring-1 ring-ink/5">
        <Check className="mx-auto h-8 w-8 text-lavender" aria-hidden="true" />
        <p className="mt-4 font-heading text-3xl text-ink">Thank you. Your message is on its way.</p>
        <p className="mt-2 text-mist">Pam will be in touch as soon as she can.</p>
        <button onClick={() => { setF(EMPTY); setState("idle"); }} className="btn btn-outline mt-6">Send another message</button>
      </div>
    );
  }
  const Field = ({ k, label, children }) => (
    <div>
      <label htmlFor={`c-${k}`} className="mb-2 block text-sm font-medium text-ink">{label}</label>
      {children}
      {errors[k] && <p id={`c-${k}-err`} className="mt-2 text-xs text-destructive">{errors[k]}</p>}
    </div>
  );
  const a11y = (k) => ({ id: `c-${k}`, "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `c-${k}-err` : undefined });

  return (
    <form onSubmit={submit} noValidate className="space-y-6">
      {Field({ k: "reason", label: "Reason for contacting", children: <select {...a11y("reason")} className="field" value={f.reason} onChange={set("reason")}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select> })}
      <div className="grid gap-6 sm:grid-cols-2">
        {Field({ k: "name", label: "Name", children: <input {...a11y("name")} className="field" value={f.name} onChange={set("name")} autoComplete="name" /> })}
        {Field({ k: "email", label: "Email", children: <input {...a11y("email")} type="email" className="field" value={f.email} onChange={set("email")} autoComplete="email" /> })}
      </div>
      {Field({ k: "subject", label: "Subject", children: <input {...a11y("subject")} className="field" value={f.subject} onChange={set("subject")} /> })}
      {Field({ k: "message", label: "Message", children: <textarea {...a11y("message")} rows={6} className="field resize-y" value={f.message} onChange={set("message")} /> })}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" value={f.company} onChange={set("company")} />
      {state === "error" && <p role="alert" className="text-sm text-destructive">{failure || "Something went wrong sending your message. Please try again."}</p>}
      <button type="submit" disabled={state === "loading"} className="btn btn-ink">
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} Send Message
      </button>
    </form>
  );
}