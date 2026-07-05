import { createTranslator } from 'next-intl'
import messages from '../../../../packages/i18n/src/locales/en.json'

// Mocks `next-intl/server`'s `getTranslations` for Storybook, which runs in a
// Vite environment with no Next.js request context (cookies/headers) for the
// real implementation to read the locale from. Backed by the same real en.json
// messages the client-side NextIntlClientProvider decorator uses in preview.tsx.
export async function getTranslations(namespaceOrOptions?: string | { namespace?: string }) {
  const namespace =
    typeof namespaceOrOptions === 'string' ? namespaceOrOptions : namespaceOrOptions?.namespace
  return createTranslator({ locale: 'en', messages, namespace })
}
