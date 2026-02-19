import { withPayload } from '@payloadcms/next/withPayload'
import redirects from './redirects.js'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const REMOTE_URLS = [];
if (NEXT_PUBLIC_SERVER_URL) {
  REMOTE_URLS.push(NEXT_PUBLIC_SERVER_URL);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    reactCompiler: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: REMOTE_URLS.map((item) => {
      try {
        const url = new URL(item)
        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', ''),
        }
      } catch (err) {
        console.warn('Invalid URL for image remotePatterns:', item)
        return null
      }
    }).filter(Boolean),
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  reactStrictMode: true,
  redirects,
  output: 'standalone',
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
