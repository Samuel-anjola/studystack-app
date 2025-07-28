"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin-sidebar"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup") || pathname.startsWith("/auth") || pathname === "/"
  const isAdminPage = pathname.startsWith("/admin")

  if (isAuthPage) {
    return <>{children}</>
  }

  // Only show sidebar for admin pages for now
  // Student pages will be added by the user
  if (isAdminPage) {
    return (
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1">{children}</main>
      </SidebarProvider>
    )
  }

  // For student pages, just return children without sidebar
  // The user will add their own student layout
  return <>{children}</>
}
