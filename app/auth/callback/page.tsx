"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      if (user.role === "admin") {
        router.push("/admin/course-note")
      } else if (user.role === "student") {
        router.push("/student/dashboard")
      } else {
        // Default fallback
        router.push("/login/student")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-600" />
        <h2 className="text-xl font-semibold mb-2">Setting up your account...</h2>
        <p className="text-gray-600">Please wait while we redirect you to your dashboard.</p>
      </div>
    </div>
  )
}
