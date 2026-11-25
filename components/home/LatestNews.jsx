import React from "react";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/site/SectionHeading";
import ArticleCard from "@/components/site/ArticleCard";
import EmptyState from "@/components/site/EmptyState";
import { CardGridSkeleton } from "@/components/site/Skeletons";
import { useArticles, useSettings } from "@/lib/content";

export default function LatestNews() {
  const { data: all = [], isLoading } = useArticles();
  const { data: s } = useSettings();
  const pinned = all.find((a) => a.id === s.featured_article_id);
  const articles = pinned ? [pinned, ...all.filter((a) => a !== pinned)] : all;
  return (
    <section className="py-24 md:py-32" aria-labelledby="latest-title">
      <div className="container-edit">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Journal" title={<span id="latest-title">{s.latest_title}</span>} />
          <Link to="/news" className="btn btn-outline shrink-0 self-start md:self-auto">View All Updates</Link>
        </div>
        {isLoading && <CardGridSkeleton />}
        {!isLoading && !articles.length && <EmptyState title="Updates are coming soon." text="New announcements, events and resources will be shared here." />}
        {!isLoading && articles.length > 0 && (
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 3).map((a) => <ArticleCard key={a.id} article={a} />)}
          </div>
        )}
      </div>
    </section>
  );
}