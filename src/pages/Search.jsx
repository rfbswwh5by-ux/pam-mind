import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import EmptyState from "@/components/site/EmptyState";
import { Bar } from "@/components/site/Skeletons";
import useSeo from "@/lib/useSeo";
import { useBooks, useArticles, useVideos, useAudio, useOfferings } from "@/lib/content";

const match = (q, ...fields) => fields.join(" ").toLowerCase().includes(q);

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const term = (params.get("q") || "").trim().toLowerCase();
  const books = useBooks(), articles = useArticles(), videos = useVideos(), audio = useAudio(), offerings = useOfferings();
  const loading = [books, articles, videos, audio, offerings].some((x) => x.isLoading);
  useSeo({ title: "Search", description: "Search books, articles, videos and experiences." });

  const groups = useMemo(() => {
    if (!term) return [];
    const bookSlug = (id) => (books.data || []).find((b) => b.id === id)?.slug;
    return [
      { label: "Books", items: (books.data || []).filter((b) => match(term, b.title, b.genre, b.short_description)).map((b) => ({ id: b.id, title: b.title, text: b.short_description, to: `/books/${b.slug}` })) },
      { label: "Articles", items: (articles.data || []).filter((a) => match(term, a.title, a.excerpt, a.body)).map((a) => ({ id: a.id, title: a.title, text: a.excerpt, to: `/news/${a.slug}` })) },
      { label: "Experiences", items: (offerings.data || []).filter((o) => match(term, o.title, o.description, o.type)).map((o) => ({ id: o.id, title: o.title, text: o.description, to: bookSlug(o.book_id) ? `/books/${bookSlug(o.book_id)}#extras` : "/experiences" })) },
      { label: "Videos", items: (videos.data || []).filter((v) => match(term, v.title, v.description, v.category)).map((v) => ({ id: v.id, title: v.title, text: v.description, to: bookSlug(v.book_id) ? `/books/${bookSlug(v.book_id)}#extras` : "/experiences?c=Video" })) },
      { label: "Audio & Resources", items: (audio.data || []).filter((a) => match(term, a.title, a.description)).map((a) => ({ id: a.id, title: a.title, text: a.description, to: bookSlug(a.book_id) ? `/books/${bookSlug(a.book_id)}#extras` : "/experiences?c=Audio" })) },
    ].filter((g) => g.items.length);
  }, [term, books.data, articles.data, videos.data, audio.data, offerings.data]);

  return (
    <section className="container-edit max-w-4xl py-16 md:py-24">
      <h1 className="text-5xl font-light text-ink md:text-6xl">Search</h1>
      <form role="search" onSubmit={(e) => { e.preventDefault(); setParams(q.trim() ? { q: q.trim() } : {}); }} className="mt-10 flex items-center gap-3 border-b border-ink/20 pb-3 focus-within:border-ink">
        <SearchIcon className="h-5 w-5 text-mist" aria-hidden="true" />
        <label htmlFor="site-search" className="sr-only">Search the site</label>
        <input id="site-search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Books, articles, videos, experiences…" className="flex-1 bg-transparent font-heading text-2xl text-ink placeholder:text-mist/60 focus:outline-none md:text-3xl" />
        <button type="submit" className="btn btn-ink">Search</button>
      </form>
      <div className="mt-14" aria-live="polite">
        {term && loading && <div className="space-y-4"><Bar className="h-6 w-1/3" /><Bar className="h-16 w-full" /><Bar className="h-16 w-full" /></div>}
        {!term && <EmptyState title="Where would you like to go?" text="Search across Pam’s books, updates, videos and experiences." />}
        {term && !loading && !groups.length && <EmptyState title={`Nothing found for “${term}”.`} text="Try a different word, or browse the full library." action={<Link to="/books" className="btn btn-ink">Browse the Books</Link>} />}
        {groups.map((g) => (
          <div key={g.label} className="mb-12">
            <p className="eyebrow mb-4 text-mist">{g.label} · {g.items.length}</p>
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {g.items.map((i) => (
                <li key={i.id}>
                  <Link to={i.to} className="group flex items-center justify-between gap-6 py-5">
                    <span><span className="block font-heading text-2xl text-ink">{i.title}</span><span className="mt-1 line-clamp-1 block text-sm text-mist">{i.text}</span></span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-mist transition-transform duration-500 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}