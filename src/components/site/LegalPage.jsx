import React from "react";
import { AlertTriangle } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import useSeo from "@/lib/useSeo";
import { useSettings } from "@/lib/content";

export default function LegalPage({ title, field }) {
  const { data: s } = useSettings();
  const sections = (s?.[field] || []).filter((x) => x?.heading || x?.body);
  useSeo({ title, description: `${title} for ${s?.site_name || "Pam’s Mind Flights"}.` });
  return (
    <>
      <PageHero eyebrow="Legal" title={title} />
      <section className="container-edit max-w-3xl py-16 md:py-20">
        {s?.legal_notice !== false && (
        <div role="note" className="mb-12 flex gap-3 rounded-lg border border-taupe/60 bg-[#F2EBDF] p-5 text-sm leading-relaxed text-ink">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p><strong>Placeholder text. Not legal advice.</strong> This page is a structured template and must be reviewed and completed by a qualified legal professional before the site is used in production.</p>
        </div>
        )}
        {sections.map(({ heading, body }, i) => (
          <div key={i} className="border-t border-ink/10 py-8">
            <h2 className="text-2xl font-light text-ink md:text-3xl">{i + 1}. {heading}</h2>
            <p className="mt-3 whitespace-pre-line leading-[1.85] text-mist">{body}</p>
          </div>
        ))}
        {s?.legal_updated && <p className="mt-6 text-sm italic text-mist">Last updated: {s.legal_updated}</p>}
      </section>
    </>
  );
}