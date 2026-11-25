import React from "react";

const STYLES = {
  published: "bg-emerald-500/15 text-emerald-300",
  draft: "bg-zinc-500/20 text-zinc-300",
  new: "bg-lavender/25 text-[#D8CFEA]",
  read: "bg-zinc-500/20 text-zinc-300",
  responded: "bg-emerald-500/15 text-emerald-300",
  archived: "bg-zinc-700/50 text-zinc-400",
  subscribed: "bg-emerald-500/15 text-emerald-300",
  unsubscribed: "bg-zinc-700/50 text-zinc-400",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${STYLES[status] || STYLES.draft}`}>
      {status || "draft"}
    </span>
  );
}