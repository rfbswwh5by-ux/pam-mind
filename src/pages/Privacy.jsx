import React from "react";
import LegalPage from "@/components/site/LegalPage";

// The text is edited in /admin → Site Settings → Privacy & Terms.
export default function Privacy() {
  return <LegalPage title="Privacy Policy" field="privacy_sections" />;
}
