// Prints unresolved narrative content as Markdown, for review and PR descriptions.
// Usage: bun run review:claims
import { communityNarrative } from "../src/lib/narrative/community.ts";
import { clientsNarrative } from "../src/lib/narrative/clients.ts";
import { sharedNarrative } from "../src/lib/narrative/shared.ts";
import { collectCopy } from "../src/lib/narrative/types.ts";

const pages = { "/clients": clientsNarrative, "/community": communityNarrative, "shared (both audiences)": sharedNarrative };
const cell = (value = "") => String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");

for (const [route, narrative] of Object.entries(pages)) {
  // The same statement can appear in several places (e.g. each Join the DAO link).
  const grouped = new Map();
  for (const copy of collectCopy(narrative).filter((item) => item.status === "needs-review")) {
    const key = `${copy.reason}|${copy.text}|${copy.note}`;
    grouped.set(key, { ...copy, count: (grouped.get(key)?.count ?? 0) + 1 });
  }
  const pending = [...grouped.values()];
  const claims = pending.filter((copy) => copy.reason === "claim");
  const wordingItems = pending.filter((copy) => copy.reason === "wording");
  console.log(`### ${route}: ${claims.length} claims, ${wordingItems.length} wording items\n`);
  console.log("#### Claims to confirm\n");
  console.log("| Copy | What to confirm | Source |\n| --- | --- | --- |");
  for (const copy of claims) {
    const source = copy.sourceUrl ? `[${copy.source}](${copy.sourceUrl})` : copy.source;
    console.log(`| ${cell(copy.text)}${copy.count > 1 ? ` (×${copy.count})` : ""} | ${cell(copy.note)} | ${source} |`);
  }
  console.log("\n#### Wording awaiting editorial approval\n");
  for (const copy of wordingItems) console.log(`- ${cell(copy.text)}${copy.count > 1 ? ` (×${copy.count})` : ""}`);
  console.log("");
}
