import React from "react";
import { Mail } from "lucide-react";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";
import SocialLinks from "@/components/site/SocialLinks";
import useSeo from "@/lib/useSeo";
import { useSettings } from "@/lib/content";

export default function Contact() {
  const { data: s } = useSettings();
  useSeo({ title: "Contact", description: "Get in touch with Pam about books, events, media, book clubs and more." });
  return (
    <>
      <PageHero eyebrow="Contact" title={s.contact_page_title} intro={s.contact_page_intro} />
      <section className="container-edit grid gap-16 py-16 md:py-24 lg:grid-cols-[1.4fr_0.8fr]">
        <ContactForm />
        <aside className="space-y-10 lg:border-l lg:border-ink/10 lg:pl-12">
          <div>
            <p className="eyebrow text-mist">Email</p>
            {s.contact_email ? (
              <a href={`mailto:${s.contact_email}`} className="mt-3 inline-flex min-h-[44px] items-center gap-3 font-heading text-2xl text-ink">
                <Mail className="h-5 w-5 text-lavender" aria-hidden="true" /><span className="link-underline">{s.contact_email}</span>
              </a>
            ) : (
              <p className="mt-3 text-sm italic text-mist">[Business email: add in Site Settings]</p>
            )}
          </div>
          <div>
            <p className="eyebrow mb-4 text-mist">Follow Pam</p>
            <SocialLinks labels className="flex-wrap" />
          </div>
          <div className="rounded-lg bg-paper p-6 ring-1 ring-ink/5">
            <p className="font-heading text-xl text-ink">Speaking & events</p>
            <p className="mt-2 text-sm leading-relaxed text-mist">For event, speaking or book club requests, choose the matching reason in the form so your message reaches Pam quickly.</p>
          </div>
        </aside>
      </section>
    </>
  );
}