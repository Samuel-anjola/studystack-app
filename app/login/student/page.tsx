"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { BookOpen, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"

export default function StudentLoginPage() {
  const [matricNumber, setMatricNumber] = useState("")
  const [isValidated, setIsValidated] = useState(false)
  const { isLoading, isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "student") {
        router.push("/student/dashboard")
      } else if (user.role === "admin") {
        router.push("/admin/course-note")
      }
    }
  }, [isAuthenticated, user, router])

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!matricNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your matric number",
        variant: "destructive",
      })
      return
    }

    // Store matric number and role for after authentication
    localStorage.setItem("matricNumber", matricNumber)
    localStorage.setItem("userRole", "student")
    setIsValidated(true)

    toast({
      title: "Success",
      description: "Matric number saved! Click continue to authenticate with Kinde.",
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
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-500 to-purple-700 flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Hello, Scholar!</h1>
          <p className="text-lg mb-8">Your academic success starts right here. Let's get you signed in!</p>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-purple-700"
          >
            <Link href="/signup/student">Sign Up</Link>
          </Button>
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
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Student Sign In</h2>

          {!isValidated ? (
            // Step 1: Matric Number Input
            <form onSubmit={handleValidation} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="matricNumber">Matric Number</Label>
                <div className="relative">
                  <Input
                    id="matricNumber"
                    placeholder="Enter your matric number"
                    value={matricNumber}
                    onChange={(e) => setMatricNumber(e.target.value)}
                    className="pl-10"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.03-.696-.08-1.038A5.5 5.5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Enter your matric number to proceed to secure authentication</p>
              </div>

              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 mt-6">
                Continue
              </Button>
            </form>
          ) : (
            // Step 2: Kinde Authentication
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 text-sm">✅ Matric number saved! Continue with Kinde authentication:</p>
              </div>

              <LoginLink postLoginRedirectURL="/student/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                 Continue with Kinde Authentication
                   </Button>
                  </LoginLink>

            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Are you an Admin?{" "}
              <Link href="/login/admin" className="text-purple-600 hover:underline">
                Go to Admin Login
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Secured by <span className="font-semibold text-purple-600">Kinde Authentication</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
