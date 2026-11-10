// Inline formatting of narrative copy (November 10, Editorial Mode rich text).
//
// Copy stays a plain string. Four inline marks are recognised, and nothing else:
//   **bold**   _italic_   ++underline++   [link text](https://…)
// No HTML, styles, sizes or colours can be expressed. A marker without its
// closing pair is plain text. Marks may nest (bold inside a link, italic inside
// bold); links never nest. Strings without these markers are plain text, so
// every existing string reads exactly as before.
//
// One module for every reader: the page renderer (Review.tsx), the editor's
// serializer (EditorialMode.tsx), the drafts and export checks, the apply CLI,
// and search metadata (lib/seo.ts), so they cannot disagree.

export type InlineNode =
  | { type: "text"; text: string }
  | { type: "strong" | "em" | "u"; children: InlineNode[] }
  | { type: "link"; href: string; children: InlineNode[] };

const PAIRS = [["**", "strong"], ["++", "u"], ["_", "em"]] as const;

// Links: https, http, mailto, a site path ("/agency") or an anchor ("#faq").
// Anything else (javascript:, data:, protocol-relative "//", spaces, quotes or
// angle brackets) is not a link.
export function safeHref(raw: string): string | null {
  const href = raw.trim();
  if (!href || href.length > 2048 || /[\s"'<>\\`]/.test(href)) return null;
  if (/^#[\w-]+$/.test(href)) return href;
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  try {
    const url = new URL(href);
    // Validated, then kept exactly as written, so a text round-trips unchanged.
    if ((url.protocol === "https:" || url.protocol === "http:") && url.hostname && /^https?:\/\//i.test(href)) return href;
    if (url.protocol === "mailto:" && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(url.pathname)) return href;
  } catch { /* not a URL */ }
  return null;
}

// Parses formatted copy into nodes. `inLink` stops a link inside a link.
export function parseInline(text: string, inLink = false): InlineNode[] {
  const nodes: InlineNode[] = [];
  let buffer = "";
  const flush = () => { if (buffer) { nodes.push({ type: "text", text: buffer }); buffer = ""; } };
  let i = 0;
  scan: while (i < text.length) {
    for (const [marker, type] of PAIRS) {
      if (!text.startsWith(marker, i)) continue;
      // "_" only opens next to a word boundary, so "snake_case" stays text.
      if (marker === "_" && i > 0 && /\w/.test(text[i - 1])) continue;
      const close = text.indexOf(marker, i + marker.length);
      if (close > i + marker.length) {
        if (marker === "_" && close + 1 < text.length && /\w/.test(text[close + 1])) continue;
        flush();
        nodes.push({ type, children: parseInline(text.slice(i + marker.length, close), inLink) });
        i = close + marker.length;
        continue scan;
      }
    }
    if (!inLink && text[i] === "[") {
      const match = /^\[([^\]]+)\]\(([^()\s]+)\)/.exec(text.slice(i));
      const href = match && safeHref(match[2]);
      if (match && href) {
        flush();
        nodes.push({ type: "link", href, children: parseInline(match[1], true) });
        i += match[0].length;
        continue;
      }
    }
    buffer += text[i];
    i += 1;
  }
  flush();
  return nodes;
}

const MARKER = { strong: "**", em: "_", u: "++" } as const;

// Nodes back to the string format.
export function printInline(nodes: InlineNode[]): string {
  return nodes.map((node) => node.type === "text" ? node.text
    : node.type === "link" ? `[${printInline(node.children)}](${node.href})`
    : `${MARKER[node.type]}${printInline(node.children)}${MARKER[node.type]}`).join("");
}

// The words only: for alt text, metadata, JSON-LD, length checks and diffs.
export function plainText(text: string): string {
  const walk = (nodes: InlineNode[]): string => nodes.map((node) => node.type === "text" ? node.text : walk(node.children)).join("");
  return walk(parseInline(text));
}

export const hasFormatting = (text: string) => parseInline(text).some((node) => node.type !== "text");

// What a field may carry (lib/editorial/config.ts `formattingFor`).
export type FormattingPolicy = { marks: boolean; links: boolean };

// Problems with a proposed text under a field's policy, in plain words.
export function inlineProblems(text: string, policy: FormattingPolicy): string[] {
  const problems: string[] = [];
  const nodes = parseInline(text);
  const kinds = new Set<string>();
  const visit = (list: InlineNode[]) => list.forEach((node) => { if (node.type !== "text") { kinds.add(node.type); visit(node.children); } });
  visit(nodes);
  if (!policy.marks && kinds.size) problems.push("This field takes plain text only: bold, italic, underline and links are not used here.");
  else if (!policy.links && kinds.has("link")) problems.push("Links cannot be added to this field.");
  // A link-shaped segment that was not accepted: an unsafe or malformed address.
  for (const match of text.matchAll(/\[([^\]]+)\]\(([^)]*)\)/g)) if (!safeHref(match[2])) problems.push(`The link address “${match[2]}” is not allowed (use https://, mailto:, a site path or #anchor).`);
  if (/<\/?[a-z][^>]*>/i.test(text)) problems.push("HTML is not allowed in copy.");
  return problems;
}
