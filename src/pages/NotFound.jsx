import React from "react";
import { Link } from "react-router-dom";
import FlightPath from "@/components/site/FlightPath";
import useSeo from "@/lib/useSeo";

export default function NotFound() {
  useSeo({ title: "Page not found", description: "The page you were looking for couldn’t be found." });
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden py-24">
      <FlightPath className="absolute inset-x-0 top-1/2 h-48 w-full -translate-y-1/2" d="M0 60 C 300 60, 500 180, 760 150 S 1100 20, 1000 90 S 1300 200, 1440 180" />
      <div className="container-edit relative max-w-2xl text-center">
        <p className="eyebrow text-mist">Error 404</p>
        <h1 className="mt-6 text-5xl font-light leading-[1.05] text-ink md:text-7xl">This Flight Took a Wrong Turn.</h1>
        <p className="mt-6 text-lg text-mist">The page you were looking for couldn’t be found.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn btn-ink">Return Home</Link>
          <Link to="/books" className="btn btn-outline">Explore Books</Link>
        </div>
      </div>
    </section>
  );
}