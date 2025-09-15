import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { QueryProvider } from "@/components/query-provider"
import { LenisProvider } from "@/components/lenis-provider"


export const metadata: Metadata = {
  title: "CinemaHub - Movie Ticket Booking",
  description: "Book movie tickets online with ease",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
        <LenisProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <QueryProvider>
              <AuthProvider>
                <Navbar />
                <main className="min-h-screen">{children}</main>
                <Toaster />
              </AuthProvider>
            </QueryProvider>
          </Suspense>
        </LenisProvider>
        <Analytics />
      </body>
    </html>
  )
}
