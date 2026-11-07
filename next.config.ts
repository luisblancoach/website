import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
