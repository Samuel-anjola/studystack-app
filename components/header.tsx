"use client"

import type React from "react"

import { Search, ChevronDown, HelpCircle, Settings, LogOut, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/context/auth-context"
import { useSearch } from "@/context/search-context"
import { SearchResults } from "@/components/search-results"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components"

// Mock data for search - in a real app, this would come from an API
const mockSearchData = [
  {
    id: "1",
    title: "Object Oriented Programming",
    type: "course-note" as const,
    courseCode: "CSC 302",
    level: "300L",
    semester: "2nd Semester",
    year: "2023",
    url: "/admin/course-note",
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    type: "course-note" as const,
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2023",
    url: "/admin/course-note",
  },
  {
    id: "3",
    title: "Database Management Systems",
    type: "course-note" as const,
    courseCode: "CSC 303",
    level: "300L",
    semester: "2nd Semester",
    year: "2024",
    url: "/admin/course-note",
  },
  {
    id: "4",
    title: "OOP Practice Questions",
    type: "practice-question" as const,
    courseCode: "CSC 302",
    level: "300L",
    semester: "2nd Semester",
    year: "2023",
    url: "/admin/practice-question",
  },
  {
    id: "5",
    title: "Data Structures Quiz",
    type: "practice-question" as const,
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2023",
    url: "/admin/practice-question",
  },
  {
    id: "6",
    title: "Object Oriented Programming Final Exam",
    type: "past-question" as const,
    courseCode: "CSC 302",
    level: "300L",
    semester: "2nd Semester",
    year: "2023",
    url: "/admin/past-question",
  },
  {
    id: "7",
    title: "Computer Architecture Mid-Term",
    type: "past-question" as const,
    courseCode: "CSC 305",
    level: "300L",
    semester: "1st Semester",
    year: "2022",
    url: "/admin/past-question",
  },
]

export function Header() {
  const { user } = useAuth()
  const { searchQuery, setSearchQuery, setSearchResults, isSearching, setIsSearching } = useSearch()
  const [adminProfileImage, setAdminProfileImage] = useState<string | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Load admin profile image from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedImage = localStorage.getItem("adminProfileImage")
      setAdminProfileImage(savedImage)
    }
  }, [])

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (typeof window !== "undefined") {
        const savedImage = localStorage.getItem("adminProfileImage")
        setAdminProfileImage(savedImage)
      }
    }

    window.addEventListener("adminProfileUpdated", handleProfileUpdate)
    return () => window.removeEventListener("adminProfileUpdated", handleProfileUpdate)
  }, [])

  // Handle search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Simulate API delay
    const searchTimeout = setTimeout(() => {
      const results = mockSearchData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.courseCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setSearchResults(results)
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [searchQuery, setSearchResults, setIsSearching])

  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchQuery("")
        setSearchResults([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [setSearchQuery, setSearchResults])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to a dedicated search results page if needed
      console.log("Search submitted:", searchQuery)
    }
  }

  const handleLogout = () => {
    // Clear stored data before logout
    localStorage.removeItem("userRole")
    localStorage.removeItem("matricNumber")
    localStorage.removeItem("adminProfileImage")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div ref={searchRef} className="relative flex-1">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              {isSearching ? (
                <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                placeholder="Search for courses, notes, questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>
          </form>
          <SearchResults />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button variant="ghost" size="icon" className="rounded-full">
          <HelpCircle className="h-5 w-5 text-gray-600" />
        </Button>

        {/* Admin header - with dropdown menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 rounded-full border border-gray-200 p-1 pr-3">
              <Avatar className="h-8 w-8">
                {user?.picture ? (
                  <AvatarImage src={user.picture || "/placeholder.svg"} alt="Profile" />
                ) : adminProfileImage ? (
                  <AvatarImage src={adminProfileImage || "/placeholder.svg"} alt="Admin Profile" />
                ) : (
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                )}
                <AvatarFallback className="bg-purple-600 text-white">
                  {user?.name?.substring(0, 2) || "A"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{user?.name || "Admin"}</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-0.5 rounded-full">Admin</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <LogoutLink onClick={handleLogout}>
                <div className="flex items-center w-full cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </div>
              </LogoutLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
