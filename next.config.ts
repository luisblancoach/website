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
      // November 10, 2026 (owner, canonical routes): Hire the DAO is the root
      // page "/". Its former addresses, /agency (November 7) and /clients
      // (before), and anything below them land there with a 308; the query
      // string is kept and the browser keeps the #section. The host-scoped
      // "/" → /agency redirect for raidguild.estudioblanco.org (November 3) was
      // removed: "/" is Hire the DAO on every host, and keeping it would loop.
      // The bare paths need their own rules: "/:path*" with an empty path
      // resolves to an empty Location and loops on itself.
      { source: "/agency", destination: "/", permanent: true },
      { source: "/agency/:path+", destination: "/:path+", permanent: true },
      { source: "/clients", destination: "/", permanent: true },
      { source: "/clients/:path+", destination: "/:path+", permanent: true },
    ];
  },
};

export default nextConfig;
