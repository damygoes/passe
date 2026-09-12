import { MotionProvider } from '@/components/motion/MotionProvider'
import { LandingExitProvider } from '@/features/landing/components/LandingExitProvider'
import type { Preview } from '@storybook/nextjs-vite'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import messages from '../../../packages/i18n/src/locales/en.json'
import '../src/styles/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <MotionProvider>
            <LandingExitProvider>
              <div className="bg-background text-foreground">
                <Story />
              </div>
            </LandingExitProvider>
          </MotionProvider>
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
  ],
}

export default preview
