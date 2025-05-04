import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { AppNav } from "@/components/app-nav"
import { PageTransition } from "@/components/page-transition"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pawns.fun - Chess in the Chain",
  description: "Play chess in the blockchain era",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()

  // Get the user session - no redirect needed as this is the root layout
  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data.session

  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-chain-bg text-white selection:bg-emerald-500/40 min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AppNav isLoggedIn={isLoggedIn} />
          <PageTransition>{children}</PageTransition>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
