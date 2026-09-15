import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: "/league", destination: "/scoreboard", permanent: true },
      { source: "/strategy", destination: "/live-agent", permanent: true },
      { source: "/about", destination: "/about-us", permanent: true },
    ];
  },
};

export default nextConfig;
