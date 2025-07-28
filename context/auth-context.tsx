"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs"

type UserRole = "student" | "admin" | null

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  matricNumber?: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (role: UserRole) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: kindeUser, isAuthenticated = false, isLoading: kindeLoading = true } = useKindeAuth()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!kindeLoading) {
      if (isAuthenticated && kindeUser) {
        // Get user role from localStorage (set during login)
        const storedRole = localStorage.getItem("userRole") as UserRole
        const role = storedRole || "admin" // Default to admin

        const userData: User = {
          id: kindeUser.id,
          name:
            kindeUser.given_name && kindeUser.family_name
              ? `${kindeUser.given_name} ${kindeUser.family_name}`
              : kindeUser.email?.split("@")[0] || "User",
          email: kindeUser.email || "",
          role,
          picture: kindeUser.picture || undefined,
          ...(role === "student" ? { matricNumber: localStorage.getItem("matricNumber") || undefined } : {}),
        }

        setUser(userData)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
  }, [kindeUser, isAuthenticated, kindeLoading])

  const login = (role: UserRole) => {
    // Save the role for use after authentication
    localStorage.setItem("userRole", role || "")
    // Optionally save matricNumber for students before calling this
    let redirect = "/"
    if (role === "student") {
      redirect = "/student/dashboard"
    } else if (role === "admin") {
      redirect = "/admin/course-note"
    }
    // Redirect to Kinde login
    window.location.href = `/api/auth/login?post_login_redirect_url=${encodeURIComponent(redirect)}`
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
