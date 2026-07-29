/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental.appDir - it's deprecated
  
  // Optional: Add path aliases
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname,
    };
    return config;
  },
};

module.exports = nextConfig;
