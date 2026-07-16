import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
export default withSentryConfig(
  withNextIntl({
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'res.cloudinary.com',
        },
        // Placeholder cover image fallback used by TripCard
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
    },
    allowedDevOrigins: ['192.168.68.57', 'localhost:3000'],
  }),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    authToken: process.env.SENTRY_AUTH_TOKEN,
    silent: true,
    widenClientFileUpload: true,
    webpack: {
      treeshake: { removeDebugLogging: true },
      automaticVercelMonitors: true,
    },
  },
)
