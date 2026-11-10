export const AI_CRAWLERS = ["GPTBot", "ChatGPT-User", "OAI-SearchBot", "Google-Extended", "ClaudeBot", "Claude-Web", "anthropic-ai", "PerplexityBot", "CCBot", "Amazonbot", "Bytespider", "Applebot-Extended", "cohere-ai"] as const;
export const CONTENT_SIGNAL = "search=yes, ai-input=yes, ai-train=no";

export const ROBOTS_TEXT = [
  "User-agent: *", "Allow: /", `Content-Signal: ${CONTENT_SIGNAL}`, "",
  ...AI_CRAWLERS.flatMap((crawler) => [`User-agent: ${crawler}`, "Allow: /", `Content-Signal: ${CONTENT_SIGNAL}`, ""]),
  "Sitemap: https://www.raidguild.org/sitemap.xml", "Host: https://www.raidguild.org", "",
].join("\n");

export const DISCOVERY_LINKS = ['</llms.txt>; rel="service-doc"', '</sitemap.xml>; rel="sitemap"'] as const;

export function appendDiscoveryLinks(existing: string | null): string {
  const values = existing ? existing.split(",").map((value) => value.trim()) : [];
  for (const link of DISCOVERY_LINKS) if (!values.includes(link)) values.push(link);
  return values.join(", ");
}

export function mergeVary(existing: string | null, value: string): string {
  const values = existing ? existing.split(",").map((item) => item.trim()) : [];
  if (!values.some((item) => item.toLowerCase() === value.toLowerCase())) values.push(value);
  return values.join(", ");
}

export function acceptsMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  return accept.split(",").some((range) => {
    const [mediaType, ...parameters] = range.split(";").map((value) => value.trim());
    if (mediaType.toLowerCase() !== "text/markdown") return false;
    const quality = parameters.find((parameter) => parameter.toLowerCase().startsWith("q="));
    return !quality || Number.parseFloat(quality.slice(2)) > 0;
  });
}

// November 10 (SEO / AEO handoff): the "/" and "/join" Markdown variants were
// removed. "/" described the previous site (a "#hire-us" section, a free
// four-week cohort) and differed from what people see; "/join" redirects to
// Portal before this runs. Agents asking for Markdown now get the same HTML as
// everyone else on those routes. /witch keeps its short description.
const MARKDOWN_PAGES: Record<string, string> = {
  "/witch": `# The RaidGuild Witch

The Witch is an interactive public RaidGuild experience. Open the [HTML experience](https://www.raidguild.org/witch) in a browser to use it.
`,
};

export function markdownForPath(pathname: string): string | undefined {
  const normalized = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;
  return MARKDOWN_PAGES[normalized];
}

export function isInternalNextRequest(headers: Headers): boolean {
  return headers.has("rsc") || headers.has("next-router-prefetch") || headers.has("next-action");
}
