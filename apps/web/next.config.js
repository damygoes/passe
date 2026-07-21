import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// resolveMediaUrl (src/lib/media.ts) always returns an absolute URL — even
// for our own /api/media/... route — because React Native's Image component
// can't resolve a same-origin-relative URL the way a browser can. That means
// next/image needs our own app origin in remotePatterns too, same as any
// other external host, or it'll refuse to optimize the image.
function ownOriginRemotePattern() {
  if (!process.env.APP_URL) return null
  try {
    const url = new URL(process.env.APP_URL)
    return {
      protocol: /** @type {'http' | 'https'} */ (url.protocol.replace(':', '')),
      hostname: url.hostname,
      port: url.port || undefined,
    }
  } catch {
    return null
  }
}

// In local dev, APP_URL points at localhost, so resolveMediaUrl's absolute
// /api/media/... URL resolves to a loopback IP. Next's image optimizer
// blocks any upstream fetch that resolves to a private IP as SSRF
// protection, so it refuses to fetch our own dev server's images. Safe to
// relax here because it's derived from APP_URL itself, not a static flag —
// production APP_URL is a public domain and never trips this.
function isOwnOriginLocalhost() {
  if (!process.env.APP_URL) return false
  try {
    const { hostname } = new URL(process.env.APP_URL)
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
  } catch {
    return false
  }
}

/** @type {import('next').NextConfig} */
export default withSentryConfig(
  withNextIntl({
    // sharp ships a native binary — let the bundler leave it external rather
    // than trying to trace/bundle it into the serverless function output.
    serverExternalPackages: ['sharp'],
    // Next's file tracer can't see fs reads inside a dynamically-built path
    // (Font.register in src/lib/pdf/fonts.ts joins process.cwd() at runtime),
    // so the vendored .ttf files wouldn't otherwise ship with the
    // serverless function — force-include them explicitly.
    outputFileTracingIncludes: {
      '/api/trips/[id]/pdf': ['./src/lib/pdf/fonts/*.ttf'],
    },
    images: {
      dangerouslyAllowLocalIP: isOwnOriginLocalhost(),
      // Matches the RESPONSIVE_WIDTHS bucket list in apps/web/src/lib/media.ts
      // (the pre-minted signed-URL set for our own media) — keeps Next's own
      // responsive-image algorithm requesting widths close to what's actually
      // been pre-signed, and caps at 2048 since client-side upload compression
      // already limits stored originals to ~2000px (nothing wider has more
      // real detail to serve, for our media or the Unsplash/Cloudinary/picsum
      // fallbacks alike).
      deviceSizes: [480, 750, 1080, 1600, 2048],
      imageSizes: [160, 224, 448],
      remotePatterns: [
        ...(ownOriginRemotePattern() ? [ownOriginRemotePattern()] : []),
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
