import type { Metadata } from "next";
import ClientsPage, { metadata as clientsMetadata } from "../clients/page";

// Render the existing agency experience without a redirect, preserving its unfurl.
export const metadata: Metadata = {
  ...clientsMetadata,
  alternates: { canonical: "/agency" },
  openGraph: { ...clientsMetadata.openGraph, url: "/agency" },
};

export default ClientsPage;
