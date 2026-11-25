import React, { useState } from "react";
import PageHero from "@/components/site/PageHero";
import FilterChips from "@/components/site/FilterChips";
import ArticleCard from "@/components/site/ArticleCard";
import EmptyState from "@/components/site/EmptyState";
import NewsletterForm from "@/components/site/NewsletterForm";
import { CardGridSkeleton } from "@/components/site/Skeletons";
import useSeo from "@/lib/useSeo";
import { useArticles, useSettings } from "@/lib/content";

export default function News() {
  const { data: articles = [], isLoading } = useArticles();
  const { data: s } = useSettings();
  const [cat, setCat] = useState("All");
  useSeo({ title: "News & Updates", description: "Book announcements, events, new resources and updates from Pam." });
  const cats = ["All", ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];
  const shown = cat === "All" ? articles : articles.filter((a) => a.category === cat);

  return (
    <>
      <PageHero eyebrow="Journal" title={s.news_page_title} intro={s.news_page_intro} />
      <section className="container-edit py-16 md:py-24">
        {cats.length > 2 && <div className="mb-14"><FilterChips options={cats} value={cat} onChange={setCat} label="Filter updates" /></div>}
        {isLoading && <CardGridSkeleton />}
        {!isLoading && !shown.length && <EmptyState title="No updates yet." text="News and announcements will be shared here." />}
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </section>
      <section className="border-t border-ink/10 bg-paper py-20 md:py-28" aria-labelledby="stay-title">
        <div className="container-edit grid gap-10 md:grid-cols-2 md:items-end">
          <div>
            <h2 id="stay-title" className="text-4xl font-light text-ink md:text-5xl">Stay Along for the Journey</h2>
            <p className="mt-4 max-w-md text-mist">Receive occasional updates about new books, resources, events, and projects from Pam’s Mind Flights.</p>
          </div>
          <NewsletterForm withName source="news" />
        </div>
      </section>
    </>
  );
}