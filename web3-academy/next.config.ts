import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    turbo: {
      resolveAlias: {
        underscore: 'lodash',
      },
    },
  },
};

export default nextConfig;
