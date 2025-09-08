/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  output: 'export',
  outputFileTracingRoot: path.join(path.resolve(), '../'),

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
