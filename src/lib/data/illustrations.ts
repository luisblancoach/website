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
// The builder network is shared, so it carries this scene on both audience
// routes (October 30); it still appears once per page.
export const crewHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_003.png", width: 1024, height: 768 };
// A builder keeping the antenna, servers and tools running: "Keepers of the signal".
export const keeperHorizontal: Illustration = { src: "/images/illustrations/ilus_horiz_001.png", width: 1024, height: 768 };

// Immersive features on /community (October 29): the owner's artwork in three
// cuts per entity (docs/asset-provenance.md). Desktop shows the wide horizontal
// cut, phones the vertical cut, and the 16:9 rectangle covers tablets and
// squarer monitors (ImmersiveFeature). Replace a file at its path to change the art.
export type EntityArtwork = { desktop: Illustration; rectangle: Illustration; mobile: Illustration };
const entity = (name: string, file: string): EntityArtwork => ({
  desktop: { src: `/images/venture/entities/${name}/${file}-desktop.png`, width: 2877, height: 1230 },
  rectangle: { src: `/images/venture/entities/${name}/${file}-rectangle.png`, width: 2508, height: 1412 },
  mobile: { src: `/images/venture/entities/${name}/${file}-mobile.png`, width: 1536, height: 2304 },
});
export const queenRaidaArtwork = entity("queen-raida", "queen");
export const molochArtwork = entity("moloch", "moloch");

// Final contact module, both audience routes (October 30, afternoon): the owner's
// Venture Beyond scene behind the module and a rotating gallery of transparent
// profession groups in front of it (docs/asset-provenance.md). One scene per
// theme (dark added the same afternoon); the horizontal cut is the desktop
// scene, the vertical cut the phone scene. Only the current theme's scene is
// rendered visible, so only it downloads.
export type ContactScene = { horizontal: Illustration; vertical: Illustration };
export const contactScenes: Partial<Record<"light" | "dark", ContactScene>> = {
  light: {
    horizontal: { src: "/images/neo/join-horizontal-light.png", width: 2880, height: 1260 },
    vertical: { src: "/images/neo/join-vertical-light.png", width: 1536, height: 2304 },
  },
  dark: {
    horizontal: { src: "/images/neo/join-horizontal-dark.png", width: 2880, height: 1260 },
    vertical: { src: "/images/neo/join-vertical-dark.png", width: 1536, height: 2304 },
  },
};

// The profession groups, 768 × 1024 transparent PNGs, in rotation order. The
// gallery opens on "Druid 2", the group the module showed before (the same file
// as neo/contact-druid-transparent.png). Names label the active scene.
export type Profession = Illustration & { name: string };
const profession = (file: string, name: string): Profession => ({ src: `/images/professions/${encodeURIComponent(file)}.png`, width: 768, height: 1024, name });
export const professions: Profession[] = [
  profession("Druid 2", "Druids"),
  profession("Archers", "Archers"),
  profession("Angry Dwarves", "Angry dwarves"),
  profession("Hunters", "Hunters"),
  profession("Paladins", "Paladins"),
  profession("Druid", "Druid and companions"),
];
