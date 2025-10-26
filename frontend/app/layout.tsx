import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"
import {Suspense} from "react"
import * as Sentry from "@sentry/react";

import "./globals.css"
import { AuthProvider } from '@/lib/auth-context';
import {Toaster} from "@/components/ui/toaster"; // Importez votre AuthProvider


export const metadata: Metadata = {
  title: "Crazy Pinball",
  description: "Buy, sell & collect pinball machines",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
    Sentry.init({
        dsn: "https://b6c01400b8bfc7764f2929b6f084cf87@o139094.ingest.us.sentry.io/4510255670493184",
        // Setting this option to true will send default PII data to Sentry.
        // For example, automatic IP address collection on events
        sendDefaultPii: true
    });

    return (
      <html lang="en" suppressHydrationWarning>
      <head>
          <link rel="icon" href="/images/logo.ico"/>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>

      <AuthProvider>

          <Toaster/>
          <Suspense fallback={null}>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                  <LanguageProvider>{children}</LanguageProvider>
              </ThemeProvider>
          </Suspense>
          <Analytics/>
      </AuthProvider>
      </body>
      </html>
  )
}
