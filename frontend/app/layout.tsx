import type React from "react"
import {ReactNode} from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from '@/lib/auth-context'; // Importez votre AuthProvider
import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Crazy Pinball",
  description: "Buy, sell & collect pinball machines",
  generator: "v0.app",
}

export default async function RootLayout({ children, params: { locale } }: { children: ReactNode, params: { locale: string } }) {
    let messages
    try {
        messages = (await import(`../messages/${locale}.json`)).default
    } catch (error) {
    }
    return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
      <AuthProvider>
      <Suspense fallback={null}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <LanguageProvider>{children}</LanguageProvider>
          </NextIntlClientProvider>
        </Suspense>
        <Analytics />
      </AuthProvider>
      </body>
    </html>
  )
}
