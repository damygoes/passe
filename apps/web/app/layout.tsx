import { ThemeProvider } from '@/components/providers/ThemeProvider'
import '@/styles/globals.css'
import { TooltipProvider } from '@passe/ui'
import type { Metadata } from 'next'
import { Caveat, DM_Mono, Lora, Playfair_Display } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
})

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const dmMono = DM_Mono({
  variable: '--font-dm-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
})

// Scrapbook theme's handwriting accent; latin-ext covers German
const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Passé.',
  description: 'The past, beautifully kept.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  return (
    <html
      lang={locale}
      className={`${playfairDisplay.variable} ${lora.variable} ${dmMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <body className="no-scrollbar" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
