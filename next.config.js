/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { ignoreDuringBuilds: true },
  images: { remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }] },
  webpack: (config, { dev }) => {
    if (dev) {
      // Use in-memory cache in development to eliminate Windows file-locking & ENOENT pack.gz errors
      config.cache = { type: 'memory' };
    }
    return config;
  },
};
