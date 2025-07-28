"use client"


import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { BookOpen } from "lucide-react"
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useAuth } from "@/context/auth-context"

export default function StudentSignupPage() {
  const [matricNumber, setMatricNumber] = useState("")
  const { login, isLoading } = useAuth()
  const { toast } = useToast()

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!matricNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter your matric number",
        variant: "destructive",
      })
      return
    }
    // Validate matric number format: e.g., 2021/300 to 2026/600
    const matricPattern = /^(202[1-6])\/(\d{3})$/;
    const match = matricNumber.match(matricPattern);
    if (!match) {
      toast({
        title: "Error",
        description: "Matric number must be in the format YYYY/NNN (e.g., 2021/300)",
        variant: "destructive",
      })
      return;
    }
    const year = parseInt(match[1], 10);
    const number = parseInt(match[2], 10);
    if (
      year < 2021 || year > 2026 ||
      (year === 2021 && number < 300) ||
      (year === 2026 && number > 600)
    ) {
      toast({
        title: "Error",
        description: "Matric number must be between 2021/300 and 2026/600",
        variant: "destructive",
      })
      return;
    }
    localStorage.setItem("matricNumber", matricNumber)
    localStorage.setItem("userRole", "student")
    login("student") // This should trigger Kinde Auth for student
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Purple gradient with illustration */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-500 to-purple-700 flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg mb-8">Jump back into your revision & test practice.</p>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-purple-700"
          >
            <Link href="/login/student">Sign In</Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-20 h-20 rounded-full bg-purple-400 opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-purple-300 opacity-20"></div>
        <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded-full bg-purple-200 opacity-20"></div>
      </div>

      {/* Right side - Signup form */}
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

          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">Create Student Account</h2>

<form className="space-y-4" onSubmit={handleSignup}>
  <div className="space-y-2">
    <Label htmlFor="matricNumber">Matric Number</Label>
    <Input
      id="matricNumber"
      placeholder="Enter your matric number"
      value={matricNumber}
      onChange={(e) => setMatricNumber(e.target.value)}
      required
    />
    <p className="text-sm text-gray-500">
      Enter your matric number, then continue with Kinde authentication
    </p>
  </div>
  <Button
    className="w-full bg-purple-600 hover:bg-purple-700"
    type="submit"
    disabled={isLoading}
  >
    Continue with Kinde Auth
  </Button>
</form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login/student" className="text-purple-600 hover:underline">
                Sign in
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
