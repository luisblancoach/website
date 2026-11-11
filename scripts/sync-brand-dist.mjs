import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const websiteRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const brandRoot = path.resolve(websiteRoot, "../raidguild-brand");
const source = path.join(brandRoot, "dist/consumer");
const destination = path.join(websiteRoot, "src/brand-dist");

await mkdir(destination, { recursive: true });

await cp(
  path.join(source, "palette.css"),
  path.join(destination, "palette.css"),
  { force: true }
);

await cp(
  path.join(source, "VERSION.json"),
  path.join(destination, "VERSION.json"),
  { force: true }
);

console.log("RaidGuild Brand synced to src/brand-dist");
