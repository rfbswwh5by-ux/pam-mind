import React from "react";
import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import LibrarySection from "@/components/home/LibrarySection";
import MoreThanBook from "@/components/home/MoreThanBook";
import AboutPreview from "@/components/home/AboutPreview";
import AuthorQuote from "@/components/site/AuthorQuote";
import LatestNews from "@/components/home/LatestNews";
import NewsletterSection from "@/components/home/NewsletterSection";
import useSeo from "@/lib/useSeo";
import { useSettings } from "@/lib/content";

export default function Home() {
  const { data: s } = useSettings();
  useSeo({ title: "", description: s.meta_description, image: s.share_image });
  return (
    <>
      <HeroSection />
      <IntroSection />
      <LibrarySection />
      <MoreThanBook />
      <AboutPreview />
      <AuthorQuote />
      <LatestNews />
      <NewsletterSection />
    </>
  );
}