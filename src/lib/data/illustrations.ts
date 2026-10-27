// Approved transparent illustrations (brand steward, imaginery library; placed
// in B3.4). Each scene exists as a portrait and a horizontal cut; each scene is
// used once, in the cut that suits its layout. They are decorative: every
// placement renders with empty alt text.
export type Illustration = { src: string; width: number; height: number };

// A foundry turning raw material into output: "Ideas into working systems".
export const foundryPortrait: Illustration = { src: "/images/illustrations/Ilus_03.png", width: 1536, height: 2048 };
// A mixed crew repairing a vessel together: the builder network's range of skills.
export const crewHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_003.png", width: 1024, height: 768 };
// A builder keeping the antenna, servers and tools running: "Keepers of the signal".
export const keeperHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_001.png", width: 1024, height: 768 };
