import React from "react";
import { useQuery } from "@tanstack/react-query";
import { db } from "@/api/client";

export const selectCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export default function RefSelect({ entity, value, onChange, id }) {
  const { data = [] } = useQuery({ queryKey: ["admin", entity], queryFn: () => db.entities[entity].list(entity === "Book" ? "sort_order" : "-created_date", 500) });
  return (
    <select id={id} className={selectCls} value={value || ""} onChange={(e) => onChange(e.target.value)}>
      <option value="">None</option>
      {data.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
    </select>
  );
}