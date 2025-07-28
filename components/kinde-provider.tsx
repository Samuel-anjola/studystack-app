"use client"

import type React from "react"
import { KindeProvider } from "@kinde-oss/kinde-auth-nextjs"

export function KindeAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <KindeProvider
      domain="https://studystack.kinde.com"
      clientId={process.env.NEXT_PUBLIC_KINDE_CLIENT_ID}
      logoutUri={process.env.NEXT_PUBLIC_KINDE_SITE_URL}
      redirectUri={`${process.env.NEXT_PUBLIC_KINDE_SITE_URL}/auth/callback`}
    >
      {children}
    </KindeProvider>
  )
}
