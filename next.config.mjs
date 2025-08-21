/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
    clientSegmentCache: true,
    nodeMiddleware: true
  }
};

export default nextConfig;
