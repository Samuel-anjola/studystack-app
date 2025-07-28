"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Shield, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"

export default function AdminLoginPage() {
  const [adminCode, setAdminCode] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const { isLoading, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/course-note")
    }
  }, [isAuthenticated, router])

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!adminCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter the admin verification code",
        variant: "destructive",
      })
      return
    }

    // Simple admin code verification
    if (adminCode !== "ADMIN2024") {
      toast({
        title: "Error",
        description: "Invalid admin verification code",
        variant: "destructive",
      })
      return
    }

    // Code is valid, show Kinde login button
    setIsValidated(true)
    // Store role for after authentication
    localStorage.setItem("userRole", "admin")

    toast({
      title: "Success",
      description: "Admin code verified! Click continue to authenticate with Kinde.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Purple gradient */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-600 to-purple-800 flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg mb-8">Jump back into your admin dashboard.</p>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-purple-400 opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-purple-300 opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-purple-200 opacity-20"></div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">StudyStack</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Admin Sign In</h2>

          {!isValidated ? (
            // Step 1: Admin Code Validation
            <form onSubmit={handleValidation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminCode">Admin Verification Code</Label>
                <div className="relative">
                  <Input
                    id="adminCode"
                    type="password"
                    placeholder="Enter admin verification code"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-500">Enter your admin code to proceed to secure authentication</p>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 mt-6">
                Verify Admin Code
              </Button>
            </form>
          ) : (
            // Step 2: Kinde Authentication
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">✅ Admin code verified! Continue with Kinde authentication:</p>
              </div>

              <LoginLink>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">Continue with Kinde Authentication</Button>
              </LoginLink>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Demo Admin Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">ADMIN2024</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Secured by <span className="font-semibold text-purple-600">Kinde Authentication</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
