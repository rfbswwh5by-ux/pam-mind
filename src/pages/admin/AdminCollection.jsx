import React from "react";
import CollectionManager from "@/components/admin/CollectionManager";
import { COLLECTIONS } from "@/components/admin/collections";

export default function AdminCollection({ type }) {
  const config = COLLECTIONS[type];
  return <CollectionManager key={type} config={config} />;
}