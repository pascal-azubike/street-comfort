import { Playfair_Display } from "next/font/google"
import "./globals.css"
import type React from "react"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { navigationItems } from "@/config/navigation"
import ClientSetup from "@/components/clientSetup"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"
import { CartSyncHandler } from "@/components/cart-sync-handler"
import Script from "next/script"

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ['500'],
  display: 'swap',
  variable: '--font-playfair',
})

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <html lang="en">
      <head>
        <Script 
          src="https://checkout.flutterwave.com/v3.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={`${playfair.variable} font-serif`}>
        <SessionProvider session={session}>
          <ClientSetup>
            <CartSyncHandler />
            <FloatingNav />
            {children}
            <Toaster />
          </ClientSetup>
        </SessionProvider>
      </body>
    </html>
  )
}
