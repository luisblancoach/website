// Which route owns each in-page section; links to a section that is not on the
// current route navigate to the route that owns it.
// November 10 (owner, canonical routes): Hire the DAO is the root page "/";
// /agency and /clients redirect to it permanently (next.config.ts). The former
// "/" entry page is retired.

export const AUDIENCES = [
  // The id "clients" is internal (data-audience, CSS, narrative and editorial ids);
  // the route is "/" since November 10, 2026 (/agency until then, /clients before).
  { id: "clients", label: "Hire the DAO", href: "/" },
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
  spears: "/",
  capabilities: "/",
  "case-studies": "/",
  contact: "/",
  "project-inquiry": "/",
};

const routeSections: Record<string, readonly SectionId[]> = {
  "/": ["case-studies", "spears", "capabilities", "team", "contact", "project-inquiry"],
  "/community": ["guild", "raida", "work", "gallery", "uncharted", "team", "join", "spears", "capabilities"],
};

export function routeHasSection(pathname: string, section: SectionId) {
  return routeSections[pathname]?.includes(section) ?? false;
}

export function sectionHref(pathname: string, section: SectionId) {
  return routeHasSection(pathname, section) ? `#${section}` : `${sectionHome[section]}#${section}`;
}

export function audienceForPath(pathname: string): AudienceId | null {
  // "/" is Hire the DAO itself, never a prefix of the other routes.
  return AUDIENCES.find((audience) => pathname === audience.href || (audience.href !== "/" && pathname.startsWith(`${audience.href}/`)))?.id ?? null;
}

// The October 23 review build switched audiences with "/?audience=hire|join".
// Those links now land on the audience routes. Other query parameters and the
// hash survive; the audience parameter is dropped, so the target never redirects.
const legacyAudienceRoutes: Record<string, string> = { hire: "/", join: "/community" };

export function legacyAudienceRedirect(url: URL): URL | null {
  if (url.pathname !== "/") return null;
  const target = legacyAudienceRoutes[url.searchParams.get("audience") ?? ""];
  if (!target) return null;
  const next = new URL(url);
  next.pathname = target;
  next.searchParams.delete("audience");
  return next;
}
