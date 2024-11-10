import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: `https://vtkcvstl6ylqsnabtvlgl5xc5e0ouick.lambda-url.eu-west-2.on.aws/auth/:path*`,
      },
      {
        source: "/api/:path",
        destination: `${process.env.API_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
