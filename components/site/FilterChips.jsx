import React from "react";

export default function FilterChips({ options, value, onChange, label = "Filter" }) {
  return (
    <div role="tablist" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          role="tab"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={`min-h-[44px] rounded-full border px-5 text-sm transition-all duration-500 ${value === o ? "border-ink bg-ink text-ivory" : "border-ink/15 text-ink hover:border-ink/40"}`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}