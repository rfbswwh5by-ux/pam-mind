import React from "react";
import { Feather, Plus } from "lucide-react";

export default function AdminEmpty({ title, action, onAction }) {
  return (
    <div className="rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <Feather className="mx-auto h-6 w-6 text-lavender" />
      <p className="mt-4 font-heading text-2xl">{title}</p>
      {action && (
        <button onClick={onAction} className="mt-6 inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-sm font-medium text-charcoal hover:bg-white">
          <Plus className="h-4 w-4" /> {action}
        </button>
      )}
    </div>
  );
}