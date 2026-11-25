import React from "react";

export const Bar = ({ className = "" }) => <div className={`animate-pulse rounded bg-ink/[0.07] ${className}`} />;

export function CardGridSkeleton({ count = 3, cover = false }) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <Bar className={cover ? "aspect-[2/3] w-full" : "aspect-[4/3] w-full"} />
          <Bar className="mt-5 h-3 w-24" />
          <Bar className="mt-3 h-6 w-3/4" />
          <Bar className="mt-3 h-4 w-full" />
        </div>
      ))}
    </div>
  );
}

export function FeatureSkeleton() {
  return (
    <div className="grid items-center gap-12 md:grid-cols-2" aria-busy="true" aria-label="Loading">
      <Bar className="mx-auto aspect-[2/3] w-2/3" />
      <div>
        <Bar className="h-3 w-28" />
        <Bar className="mt-4 h-10 w-3/4" />
        <Bar className="mt-6 h-4 w-full" />
        <Bar className="mt-2 h-4 w-5/6" />
      </div>
    </div>
  );
}