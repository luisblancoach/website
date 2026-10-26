"use client";

import type { ReactNode } from "react";
import type { NarrativeLink } from "@/lib/narrative/types";
import { useVenture } from "../shell/VentureShell";
import { ReviewFlag } from "./Review";

// Section links scroll in place or route to the audience that owns the section.
// Outbound links open in a new tab, as everywhere else on the site. A flagged
// destination outlines the whole link until it is confirmed.
export default function NarrativeAnchor({ link, className, children }: { link: NarrativeLink; className?: string; children: ReactNode }) {
  const { sectionHref, followSectionLink } = useVenture();
  const section = link.section;
  const anchor = section ? (
    <a className={className} href={sectionHref(section)} onClick={(event) => followSectionLink(event, section)}>{children}</a>
  ) : (
    <a className={className} href={link.href} target="_blank" rel="noopener noreferrer">{children}</a>
  );
  const destination = link.destination;
  if (!destination || destination.status === "approved") return anchor;
  return (
    <ReviewFlag id={destination.id} reason="claim" note={`${destination.text}. ${destination.note ?? ""}`.trim()}>
      {anchor}
    </ReviewFlag>
  );
}
