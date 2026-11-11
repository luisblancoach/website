import { reviewFlagsEnabled, type Copy } from "./types";

// Narrative content as it may leave the server. With review flags off
// (production), every copy keeps only its id and text: review notes, sources
// and statuses stay on the server, and pending entries are dropped, so none of
// them reach the page payload or the browser bundle. Review builds get the
// full tree.
const isCopy = (value: unknown): value is Copy =>
  typeof value === "object" && value !== null && "text" in value && "status" in value && "source" in value;

function strip(node: unknown): unknown {
  if (isCopy(node)) return { id: node.id, text: node.text, status: "approved", source: "existing-site" } satisfies Copy;
  if (Array.isArray(node)) return node.filter((item) => !(typeof item === "object" && item !== null && "pending" in item)).map(strip);
  if (typeof node === "object" && node !== null) return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, strip(value)]));
  return node;
}

export function forAudience<T>(tree: T, reviewing = reviewFlagsEnabled()): T {
  return reviewing ? tree : (strip(tree) as T);
}
