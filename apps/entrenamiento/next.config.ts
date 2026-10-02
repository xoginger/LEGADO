import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  transpilePackages: ["@legado/shared"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // Browser opens via 127.0.0.1 while Next prints localhost — unblock HMR/dev assets.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
