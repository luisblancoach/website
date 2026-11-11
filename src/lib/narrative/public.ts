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

// Retired items (e.g. clients.reasons.items.5, Tae's batch 02) stay in the source as
// tombstones for their ids, but never leave the server, in any build.
const isRetired = (item: unknown) => typeof item === "object" && item !== null && "retired" in item && Boolean((item as { retired?: unknown }).retired);
function withoutRetired(node: unknown): unknown {
  if (Array.isArray(node)) return node.filter((item) => !isRetired(item)).map(withoutRetired);
  if (isCopy(node)) return node;
  if (typeof node === "object" && node !== null) return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, withoutRetired(value)]));
  return node;
}

export function forAudience<T>(tree: T, reviewing = reviewFlagsEnabled()): T {
  const active = withoutRetired(tree) as T;
  return reviewing ? active : (strip(active) as T);
}
