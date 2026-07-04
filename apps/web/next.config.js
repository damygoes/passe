import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
export default withNextIntl({
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
    ],
  },
})
