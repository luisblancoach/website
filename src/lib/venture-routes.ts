// Which route owns each in-page section. "/" still carries every section until
// the entry experience is reduced; links to a section that is not on the current
// route navigate to the route that owns it.

export const AUDIENCES = [
  { id: "clients", label: "Hire the DAO", href: "/clients" },
  { id: "community", label: "Join the DAO", href: "/community" },
] as const;

export type AudienceId = (typeof AUDIENCES)[number]["id"];

export type SectionId =
  | "guild" | "team" | "work" | "gallery" | "uncharted" | "tension" | "path" | "join" | "raida"
  | "spears" | "contact" | "project-inquiry" | "capabilities" | "case-studies";

const sectionHome: Record<SectionId, string> = {
  guild: "/community",
  team: "/community",
  work: "/community",
  gallery: "/community",
  uncharted: "/community",
  tension: "/community",
  path: "/community",
  join: "/community",
  raida: "/community",
  spears: "/clients",
  capabilities: "/clients",
  "case-studies": "/clients",
  contact: "/clients",
  "project-inquiry": "/clients",
};

const routeSections: Record<string, readonly SectionId[]> = {
  "/": ["guild", "team", "work", "gallery", "uncharted", "spears", "contact", "project-inquiry"],
  "/community": ["guild", "raida", "work", "gallery", "uncharted", "team", "join", "spears", "capabilities"],
  "/clients": ["case-studies", "spears", "capabilities", "team", "contact", "project-inquiry"],
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

// The October 23 review build switched audiences with "/?audience=hire|join".
// Those links now land on the audience routes. Other query parameters and the
// hash survive; the audience parameter is dropped, so the target never redirects.
const legacyAudienceRoutes: Record<string, string> = { hire: "/clients", join: "/community" };

export function legacyAudienceRedirect(url: URL): URL | null {
  if (url.pathname !== "/") return null;
  const target = legacyAudienceRoutes[url.searchParams.get("audience") ?? ""];
  if (!target) return null;
  const next = new URL(url);
  next.pathname = target;
  next.searchParams.delete("audience");
  return next;
}
