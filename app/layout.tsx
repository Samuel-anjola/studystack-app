import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { LayoutWrapper } from "@/components/layout-wrapper"
import { AuthProvider } from "@/context/auth-context"
import { SearchProvider } from "@/context/search-context"
import { KindeAuthProvider } from "@/components/kinde-provider"
import { Suspense } from "react"
import { UserProvider } from "@/context/user-context"
import { AnalyticsProvider } from "@/context/analytics-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "StudyStack",
  description: "Your study companion",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KindeAuthProvider>
          <AuthProvider>
            <SearchProvider>
              <UserProvider>
                <AnalyticsProvider>
                  <Suspense fallback={null}>
                    <LayoutWrapper>{children}</LayoutWrapper>
                    <Toaster />
                  </Suspense>
                </AnalyticsProvider>
              </UserProvider>
            </SearchProvider>
          </AuthProvider>
        </KindeAuthProvider>
      </body>
    </html>
  )
}
