// Only catalog entries with a verified local preview belong here. The live
// catalog can omit images, but an unknown ID should keep its text placeholder.
export const artifactPreviews: Readonly<Record<string, string>> = {
  "sirocco-oasis": "/images/artifacts/sirocco-oasis.png",
  "lunar-republic": "/images/artifacts/lunar-republic.png",
  "portal-motion": "/images/artifacts/portal-motion.png",
  "cosmic-carnival": "/images/artifacts/cosmic-carnival.png",
  "module-gallery-study": "/images/artifacts/module-gallery-study.png",
  "desert-walker": "/images/artifacts/desert-walker.png",
  "rg-tlm-game": "/images/artifacts/rg-tlm-game.webp",
  "brewers-rendezvous": "/images/artifacts/brewers-rendezvous.jpg",
};

export function resolveArtifactPreview(id: string, image?: string | null): string | null {
  return image?.trim() || artifactPreviews[id] || null;
}
