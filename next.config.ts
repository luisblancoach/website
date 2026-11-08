import type { NextConfig } from "next";
import { execSync } from "node:child_process";

// The commit an editorial export refers to: set by deploy/cloudflare/build.sh,
// else the local checkout ("+changes" when it has uncommitted work), else "unknown".
function sourceRevision() {
  if (process.env.NEXT_PUBLIC_EDITORIAL_SOURCE_REVISION) return process.env.NEXT_PUBLIC_EDITORIAL_SOURCE_REVISION;
  try {
    const head = execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    const dirty = execSync("git status --porcelain -- src", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return dirty ? `${head}+changes` : head;
  } catch {
    return "unknown";
  }
}

const nextConfig: NextConfig = {
  // Editorial Mode build flag (lib/editorial/config.ts). Always a literal, so the
  // build folds the editor's entry points away: "opt-in" only when a build sets
  // NEXT_PUBLIC_EDITORIAL_MODE=opt-in (the Cloudflare review host); every other
  // build, raidguild.org included, gets "disabled" and no editor in its bundle.
  env: {
    NEXT_PUBLIC_EDITORIAL_MODE: process.env.NEXT_PUBLIC_EDITORIAL_MODE === "opt-in" ? "opt-in" : "disabled",
    // Read only by the editor's export, so builds without the editor do not change.
    NEXT_PUBLIC_EDITORIAL_SOURCE_REVISION: sourceRevision(),
  },
  async redirects() {
    return [
      {
        source: "/join",
        destination: "https://portal.raidguild.org/join",
        permanent: true,
      },
      {
        source: "/deck",
        destination: "/files/raid_guild.pdf",
        permanent: false, // true if you want a 308 permanent redirect
      },
      // November 7, 2026: Hire the DAO moved from /clients to /agency. Old links
      // (and anything below /clients) land on the same place with a 308; the
      // query string is kept and the browser keeps the #section.
      {
        source: "/clients/:path*",
        destination: "/agency/:path*",
        permanent: true,
      },
      // Public review domain (November 3, 2026): its root opens Hire the DAO.
      // Scoped to that host, so raidguild.org and every other host keep "/".
      {
        source: "/",
        has: [{ type: "host", value: "raidguild.estudioblanco.org" }],
        destination: "/agency",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
