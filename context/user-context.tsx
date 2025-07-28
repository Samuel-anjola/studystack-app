"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface UserData {
  firstName: string
  lastName: string
  email: string
  profilePicture: string
}

interface UserContextType {
  userData: UserData
  updateUserData: (data: Partial<UserData>) => void
  isDarkMode: boolean
  setDarkMode: (isDark: boolean) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>({
    firstName: "Badejo",
    lastName: "Temi",
    email: "badejo.temi@example.com",
    profilePicture: "/placeholder-user.jpg",
  })

  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load saved data on mount
  useEffect(() => {
    // Load user data from localStorage
    const savedUserData = localStorage.getItem("studystack-user-data")
    if (savedUserData) {
      try {
        const parsedData = JSON.parse(savedUserData)
        setUserData(parsedData)
      } catch (error) {
        console.error("Error loading user data:", error)
      }
    }

    // Load theme preference
    const savedTheme = localStorage.getItem("studystack-theme")
    const prefersDark = savedTheme === "dark"
    setIsDarkMode(prefersDark)
    applyDarkMode(prefersDark)
  }, [])

  const updateUserData = (newData: Partial<UserData>) => {
    const updatedData = { ...userData, ...newData }
    setUserData(updatedData)

    // Save to localStorage
    localStorage.setItem("studystack-user-data", JSON.stringify(updatedData))
  }

  const setDarkMode = (isDark: boolean) => {
    setIsDarkMode(isDark)
    applyDarkMode(isDark)

    // Save theme preference
    localStorage.setItem("studystack-theme", isDark ? "dark" : "light")
  }

  const applyDarkMode = (isDark: boolean) => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      document.body.style.backgroundColor = "#1a202c"
    } else {
      document.documentElement.classList.remove("dark")
      document.body.style.backgroundColor = "#f7fafc"
    }
  }

  return (
    <UserContext.Provider value={{ userData, updateUserData, isDarkMode, setDarkMode }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
