import React, { useState } from "react";
import { publicCall } from "@/api/client";
import { Check, Loader2 } from "lucide-react";
import { clean, isEmail, throttled } from "@/lib/forms";

export default function NewsletterForm({ withName = false, dark = false, button = "Join the List", source = "website" }) {
  const [form, setForm] = useState({ first_name: "", email: "", website: "" });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState("idle");
  const [failure, setFailure] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (form.website) return setState("done"); // honeypot
    const errs = {};
    if (withName && !clean(form.first_name)) errs.first_name = "Please enter your first name.";
    if (!isEmail(form.email)) errs.email = "Please enter a valid email address.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    if (throttled("pmf_newsletter")) return setErrors({ email: "You’ve just signed up. Please wait a moment before trying again." });
    setState("loading");
    try {
      await publicCall("newsletter.subscribe", { first_name: clean(form.first_name, 80), email: clean(form.email, 200).toLowerCase(), source });
      setState("done");
    } catch (err) {
      setFailure(err?.code === "RATE_LIMIT" || err?.code === "INVALID" ? err.message : "");
      setState("error");
    }
  };

  const field = dark ? "w-full rounded-full border border-ivory/20 bg-white/5 px-6 py-3.5 text-ivory placeholder:text-ivory/45 focus:border-ivory/60 focus:outline-none" : "field rounded-full px-6";
  if (state === "done") {
    return (
      <p role="status" className={`flex items-center gap-3 font-heading text-2xl ${dark ? "text-ivory" : "text-ink"}`}>
        <Check className="h-5 w-5 text-lavender" aria-hidden="true" /> Thank you. You’re on the list.
      </p>
    );
  }
  const Err = ({ k }) => (errors[k] ? <p id={`${source}-${k}-err`} className={`mt-2 pl-6 text-xs ${dark ? "text-[#F2C1B6]" : "text-destructive"}`}>{errors[k]}</p> : null);

  return (
    <form onSubmit={submit} noValidate className="w-full">
      <div className={`grid gap-3 ${withName ? "sm:grid-cols-[1fr_1.3fr_auto]" : "sm:grid-cols-[1fr_auto]"}`}>
        {withName && (
          <div>
            <label htmlFor={`${source}-fn`} className="sr-only">First name</label>
            <input id={`${source}-fn`} className={field} placeholder="First name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} aria-invalid={!!errors.first_name} aria-describedby={`${source}-first_name-err`} />
            <Err k="first_name" />
          </div>
        )}
        <div>
          <label htmlFor={`${source}-em`} className="sr-only">Email address</label>
          <input id={`${source}-em`} type="email" className={field} placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-invalid={!!errors.email} aria-describedby={`${source}-email-err`} />
          <Err k="email" />
        </div>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
        <button type="submit" disabled={state === "loading"} className={`btn ${dark ? "btn-light" : "btn-ink"} self-start`}>
          {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />} {button}
        </button>
      </div>
      {state === "error" && <p role="alert" className="mt-3 text-sm text-destructive">{failure || "Something went wrong. Please try again."}</p>}
    </form>
  );
}