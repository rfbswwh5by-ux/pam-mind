import React from "react";
import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";
import { IMAGES } from "@/lib/images";
import { formatDate } from "@/lib/content";

export default function ArticleCard({ article }) {
  return (
    <article className="group">
      <Link to={`/news/${article.slug}`} className="block">
        <div className="aspect-[3/2] overflow-hidden rounded-md">
          <Image src={article.hero_image || IMAGES.pages} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]" />
        </div>
        <div className="pt-5">
          <p className="eyebrow flex flex-wrap gap-x-3 text-mist">
            <span>{article.category}</span>
            {article.publish_date && <span aria-hidden="true">·</span>}
            {article.publish_date && <time dateTime={article.publish_date}>{formatDate(article.publish_date)}</time>}
          </p>
          <h3 className="mt-3 text-2xl font-light leading-snug text-ink"><span className="link-underline">{article.title}</span></h3>
          {article.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mist">{article.excerpt}</p>}
        </div>
      </Link>
    </article>
  );
}