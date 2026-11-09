// The source copy of the editable sections: id → published text, in page
// order. Editorial Mode compares drafts against it (conflicts) and labels the
// changes with it, including drafts for the page that is not open. Only the
// editor's own chunk imports this file (opt-in builds, after ?editorial=1).
import {
  clientsCreed, clientsFaq, clientsHero, clientsInquiry, clientsMeta, clientsNav, clientsPreviousWorks, clientsReasons, clientsServiceGallery,
} from "../narrative/clients";
import {
  communityActivity, communityBenefits, communityCapabilities, communityCreed, communityFaq, communityGuild, communityHats, communityHero, communityJoin,
  communityMeta, communityMoloch, communityNav, communityRaidaFeature,
} from "../narrative/community";
import { buildersClients, buildersCommunity, peopleClients } from "../narrative/shared";
import { siteContent } from "../narrative/site";
import { collectCopy } from "../narrative/types";
import { EDITORIAL_SECTIONS, isEditableId, kindOf, sectionFor } from "./config";

// One tree per entry in EDITORIAL_SECTIONS (same prefix).
export const TREES: Record<string, unknown> = {
  "clients.nav": clientsNav,
  "clients.hero": clientsHero,
  "clients.serviceGallery": clientsServiceGallery,
  "clients.reasons": clientsReasons,
  "clients.previousWorks": clientsPreviousWorks,
  "shared.builders.clients": buildersClients,
  "shared.people.clients": peopleClients,
  "clients.faq": clientsFaq,
  "clients.inquiry": clientsInquiry,
  "clients.creed": clientsCreed,
  "clients.meta": clientsMeta,
  "community.nav": communityNav,
  "community.hero": communityHero,
  "community.guild": communityGuild,
  "community.capabilities": communityCapabilities,
  "community.raidaFeature": communityRaidaFeature,
  "community.moloch": communityMoloch,
  "community.hats": communityHats,
  "community.benefits": communityBenefits,
  "shared.builders.community": buildersCommunity,
  "community.activity.collection": communityActivity.collection,
  "community.join": communityJoin,
  "community.faq": communityFaq,
  "community.creed": communityCreed,
  "community.meta": communityMeta,
  "site.header": siteContent.header,
  "site.hero": siteContent.hero,
  "site.ticker": siteContent.ticker,
  "site.creed": siteContent.creed,
  "site.footer": siteContent.footer,
};

export const originals = new Map<string, string>();
export const sourceOrder = new Map<string, number>();
// The hidden items (alt text, screen-reader names, metadata) per section, for the panel's "Hidden text" list.
export const hiddenIds: string[] = [];
for (const section of EDITORIAL_SECTIONS) {
  const tree = TREES[section.prefix];
  if (!tree) throw new Error(`Editorial section ${section.prefix} has no narrative tree in catalog.ts`);
  for (const copy of collectCopy(tree)) {
    if (!isEditableId(copy.id)) continue;
    if (sectionFor(copy.id) !== section) throw new Error(`Copy ${copy.id} is outside its section ${section.prefix}`);
    sourceOrder.set(copy.id, sourceOrder.size);
    originals.set(copy.id, copy.text);
    if (kindOf(copy.id) !== "visible") hiddenIds.push(copy.id);
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
    const named = [`${base}.title`, `${base}.name`, `${base}.question`, `${base}.term`, `${base}.label`].map((key) => originals.get(key)).find(Boolean);
    return named ? plain(named) : undefined;
  };
}
