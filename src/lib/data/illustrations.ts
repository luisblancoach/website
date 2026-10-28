// Approved transparent illustrations from the imaginery library: AI-generated
// for RaidGuild and approved for public use in this project by the project
// owner (docs/asset-provenance.md). Each scene exists as a portrait and a horizontal cut; each scene is
// used once, in the cut that suits its layout, except the foundry, whose
// horizontal cut is the mobile Services art on /clients (approved October 28,
// 2026). They are decorative: every placement renders with empty alt text.
export type Illustration = { src: string; width: number; height: number };

// A foundry turning raw material into output: "Ideas into working systems".
export const foundryPortrait: Illustration = { src: "/images/illustrations/Ilus_03.png", width: 1536, height: 2048 };
export const foundryHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_002.png", width: 1024, height: 768 };
// A mixed crew repairing a vessel together: the builder network's range of skills.
export const crewHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_003.png", width: 1024, height: 768 };
// A builder keeping the antenna, servers and tools running: "Keepers of the signal".
export const keeperHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_001.png", width: 1024, height: 768 };
