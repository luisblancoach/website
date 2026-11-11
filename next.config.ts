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
      // Public review domain (November 3, 2026): its root opens Hire the DAO.
      // Scoped to that host, so raidguild.org and every other host keep "/".
      {
        source: "/",
        has: [{ type: "host", value: "raidguild.estudioblanco.org" }],
        destination: "/clients",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
