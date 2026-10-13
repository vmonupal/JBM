import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  outputFileTracingIncludes: {
    '/api/**/*': [
      './data/church.db',
      './public/data/bible/**/*',
      './src/data/bible/**/*'
    ]
  }
};

export default nextConfig;

