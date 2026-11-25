import React from "react";
import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { ArrowLeft } from "lucide-react";
import { Image } from "@/components/ui/image";
import ShareBar from "@/components/site/ShareBar";
import BookCard from "@/components/site/BookCard";
import NewsletterForm from "@/components/site/NewsletterForm";
import { Bar } from "@/components/site/Skeletons";
import NotFound from "@/pages/NotFound";
import useSeo from "@/lib/useSeo";
import { IMAGES } from "@/lib/images";
import { useArticles, useBooks, useSettings, formatDate } from "@/lib/content";

export default function Article() {
  const { slug } = useParams();
  const { data: articles = [], isLoading } = useArticles();
  const { data: books = [] } = useBooks();
  const { data: s } = useSettings();
  const a = articles.find((x) => x.slug === slug);
  const book = a && books.find((b) => b.id === a.book_id);
  useSeo({
    title: a?.seo_title || a?.title,
    description: a?.seo_description || a?.excerpt,
    image: a?.hero_image,
    jsonLd: a ? { "@context": "https://schema.org", "@type": "Article", headline: a.title, ...(a.publish_date && { datePublished: a.publish_date }), ...(a.hero_image && { image: a.hero_image }), author: { "@type": "Person", name: s.author_name } } : null,
  });

  if (isLoading) return <div className="container-edit max-w-3xl py-24"><Bar className="h-12 w-3/4" /><Bar className="mt-8 aspect-[16/9] w-full" /></div>;
  if (!a) return <NotFound />;

  return (
    <article>
      <header className="container-edit max-w-3xl pb-10 pt-14 md:pt-20">
        <Link to="/news" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-mist hover:text-ink"><ArrowLeft className="h-4 w-4" /> All updates</Link>
        <p className="eyebrow mt-8 flex gap-3 text-mist"><span>{a.category}</span>{a.publish_date && <><span aria-hidden="true">·</span><time dateTime={a.publish_date}>{formatDate(a.publish_date)}</time></>}</p>
        <h1 className="mt-5 text-4xl font-light leading-[1.08] text-ink md:text-6xl">{a.title}</h1>
        {a.excerpt && <p className="mt-6 font-heading text-2xl italic leading-snug text-mist">{a.excerpt}</p>}
      </header>
      <div className="container-edit max-w-5xl">
        <div className="aspect-[16/9] overflow-hidden rounded-md">
          <Image src={a.hero_image || IMAGES.pages} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="container-edit max-w-3xl py-14 md:py-20">
        <div className="prose-edit text-[17px] text-ink/85"><ReactMarkdown>{a.body || ""}</ReactMarkdown></div>
        <div className="mt-12 border-t border-ink/10 pt-8"><ShareBar title={a.title} /></div>
        {book && (
          <aside className="mt-16 max-w-sm">
            <p className="eyebrow mb-6 text-mist">Related book</p>
            <BookCard book={book} />
          </aside>
        )}
        <section className="mt-20 rounded-lg bg-paper p-8 ring-1 ring-ink/5 md:p-10" aria-labelledby="art-nl">
          <h2 id="art-nl" className="text-3xl font-light text-ink">Stay Along for the Journey</h2>
          <p className="mb-6 mt-2 text-sm text-mist">Receive occasional updates about new books, resources, events, and projects from Pam’s Mind Flights.</p>
          <NewsletterForm withName source="article" />
        </section>
      </div>
    </article>
  );
}