// Which route owns each in-page section. "/" still carries every section until
// the entry experience is reduced; links to a section that is not on the current
// route navigate to the route that owns it.

export const AUDIENCES = [
  { id: "clients", label: "Clients", href: "/clients" },
  { id: "community", label: "Community", href: "/community" },
] as const;

export type AudienceId = (typeof AUDIENCES)[number]["id"];

export type SectionId = "guild" | "team" | "work" | "gallery" | "uncharted" | "spears" | "contact" | "project-inquiry";

const sectionHome: Record<SectionId, string> = {
  guild: "/community",
  team: "/community",
  work: "/community",
  gallery: "/community",
  uncharted: "/community",
  spears: "/clients",
  contact: "/clients",
  "project-inquiry": "/clients",
};

const routeSections: Record<string, readonly SectionId[]> = {
  "/": ["guild", "team", "work", "gallery", "uncharted", "spears", "contact", "project-inquiry"],
  "/community": ["guild", "team", "work", "gallery", "uncharted"],
  "/clients": ["spears", "contact", "project-inquiry"],
};

export function routeHasSection(pathname: string, section: SectionId) {
  return routeSections[pathname]?.includes(section) ?? false;
}

export function sectionHref(pathname: string, section: SectionId) {
  return routeHasSection(pathname, section) ? `#${section}` : `${sectionHome[section]}#${section}`;
}

export function audienceForPath(pathname: string): AudienceId | null {
  return AUDIENCES.find((audience) => pathname === audience.href || pathname.startsWith(`${audience.href}/`))?.id ?? null;
}
