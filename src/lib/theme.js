export const bookVars = (book = {}) => ({
  "--accent": book.accent_primary || "#9B8FB4",
  "--accent-2": book.accent_secondary || "#B7A999",
  "--accent-bg": book.accent_background || "#F3EFF7",
});

export const tone = (dark) =>
  dark
    ? { text: "text-ivory", muted: "text-ivory/65", border: "border-ivory/15", surface: "bg-white/[0.04]", btn: "btn-light", btn2: "btn-outline-light" }
    : { text: "text-ink", muted: "text-mist", border: "border-ink/10", surface: "bg-white", btn: "btn-ink", btn2: "btn-outline" };