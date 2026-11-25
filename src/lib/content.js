import { publicCall } from "@/api/client";
import { DEFAULT_SETTINGS } from "@/lib/site-defaults";
import { useQuery } from "@tanstack/react-query";

export { DEFAULT_SETTINGS };

// Saved settings win, including deliberately emptied fields ("leave empty to
// hide"); defaults only fill in keys that were never saved.
export const mergeSettings = (row) => {
  const merged = { ...DEFAULT_SETTINGS };
  for (const [key, value] of Object.entries(row || {})) if (value !== null && value !== undefined) merged[key] = value;
  return merged;
};

const published = (entity, sort = "sort_order") => async () =>
  (await publicCall("public.list", { entity, sort })).items;

export const useBooks = () => useQuery({ queryKey: ["books"], queryFn: published("Book") });
export const useOfferings = () => useQuery({ queryKey: ["offerings"], queryFn: published("Offering") });
export const useVideos = () => useQuery({ queryKey: ["videos"], queryFn: published("Video") });
export const useAudio = () => useQuery({ queryKey: ["audio"], queryFn: published("AudioItem") });
export const useArticles = () =>
  useQuery({ queryKey: ["articles"], queryFn: published("Article", "-publish_date") });

export const useSettings = () =>
  useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { settings } = await publicCall("public.settings");
      return { ...mergeSettings(settings), _id: settings?.id };
    },
    placeholderData: DEFAULT_SETTINGS,
  });

export const isPlaceholder = (text) => typeof text === "string" && text.trim().startsWith("[");

export const forBook = (items = [], bookId) => items.filter((i) => i.book_id === bookId);

export const formatDate = (d) =>
  d ? new Date(d + (d.length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "";