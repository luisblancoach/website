// The source copy of the editable sections: id → published text, in page
// order. Editorial Mode compares drafts against it (conflicts) and labels the
// changes with it, including drafts for the page that is not open.
import { clientsHero, clientsReasons, clientsServiceGallery } from "../narrative/clients";
import { communityCapabilities, communityHero, communityJoin } from "../narrative/community";
import { collectCopy } from "../narrative/types";
import { EDITORIAL_SECTIONS, isEditableId, sectionFor } from "./config";

// One tree per entry in EDITORIAL_SECTIONS (same prefix).
const TREES: Record<string, unknown> = {
  "clients.hero": clientsHero,
  "clients.serviceGallery": clientsServiceGallery,
  "clients.reasons": clientsReasons,
  "community.hero": communityHero,
  "community.capabilities": communityCapabilities,
  "community.join": communityJoin,
};

export const originals = new Map<string, string>();
export const sourceOrder = new Map<string, number>();
for (const section of EDITORIAL_SECTIONS) {
  const tree = TREES[section.prefix];
  if (!tree) throw new Error(`Editorial section ${section.prefix} has no narrative tree in catalog.ts`);
  for (const copy of collectCopy(tree)) {
    if (!isEditableId(copy.id)) continue;
    sourceOrder.set(copy.id, sourceOrder.size);
    originals.set(copy.id, copy.text);
  }
}

const plain = (text: string) => text.replace(/\*\*/g, "");

// Names an array item by its title: "cards.2" → "Smart contracts, onchain systems".
export function itemContext(id: string) {
  const section = sectionFor(id);
  if (!section) return undefined;
  return (itemPath: string) => {
    const base = `${section.prefix}.${itemPath}`;
    const lead = originals.get(`${base}.title.lead`);
    if (lead) return plain(`${lead} ${originals.get(`${base}.title.em`) ?? ""}`.trim());
    const title = originals.get(`${base}.title`);
    return title ? plain(title) : undefined;
  };
}
