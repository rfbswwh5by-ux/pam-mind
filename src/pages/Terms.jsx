import React from "react";
import LegalPage from "@/components/site/LegalPage";

// The text is edited in /admin → Site Settings → Privacy & Terms.
export default function Terms() {
  return <LegalPage title="Terms of Use" field="terms_sections" />;
}
