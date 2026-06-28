import { ThemeProvider } from '@/components/providers/ThemeProvider'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { getLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Passé.',
  description: 'The past, beautifully kept.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale()
  return (
    <html lang={locale}>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
