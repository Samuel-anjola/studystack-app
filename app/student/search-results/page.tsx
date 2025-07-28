"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/student/ui/avatar"
import { Button } from "@/components/student/ui/button"
import { Card, CardContent } from "@/components/student/ui/card"
import { Input } from "@/components/student/ui/input"
import { Search, ChevronDown, BookOpen, Download, Book, Settings } from "lucide-react"
import Link from "next/link"
import { useUser } from "../../contexts/user-context"

const questionPapers = [
  {
    id: 1,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2023",
  },
  {
    id: 2,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2025",
  },
  {
    id: 3,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2022",
  },
  {
    id: 4,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2024",
  },
]

export default function SearchResults() {
  const { userData, isDarkMode } = useUser()

  const getDisplayName = () => {
    return `${userData.firstName} ${userData.lastName}`
  }

  const getInitials = () => {
    return `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header
        className={`border-b px-6 py-4 transition-colors duration-200 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xl font-bold transition-colors duration-200 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              StudyStack
            </span>
          </div>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-400"
                }`}
              />
              <Input
                placeholder="Search for course"
                className={`pl-10 transition-colors duration-200 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-gray-50 border-gray-200"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userData.profilePicture || "/placeholder.svg"} />
              <AvatarFallback className={isDarkMode ? "bg-gray-700 text-white" : ""}>{getInitials()}</AvatarFallback>
            </Avatar>
            <span
              className={`font-medium transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-900"}`}
            >
              {getDisplayName()}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Fixed Sidebar */}
        <aside
          className={`w-64 border-r transition-colors duration-200 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <nav className="p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/">
                <div className={`w-4 h-4 mr-3 rounded-sm ${isDarkMode ? "bg-gray-600" : "bg-gray-400"}`} />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/practice">
                <BookOpen className="w-4 h-4 mr-3" />
                Practice Room
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/revision">
                <BookOpen className="w-4 h-4 mr-3" />
                Revision Room
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Search Results Header */}
            <div className="mb-6">
              <p className={`mb-4 transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                <span className="font-semibold text-purple-600">12</span>{" "}
                <span className="text-purple-600">Past Question</span> found for:{" "}
                <span className="font-semibold">300 Level • Computer Science • 1st Semester</span>
              </p>
            </div>

            {/* Question Papers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {questionPapers.map((paper) => (
                <Card
                  key={paper.id}
                  className={`hover:shadow-md transition-all duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-750" : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Book className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold mb-1 transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {paper.title}
                        </h3>
                        <p
                          className={`text-sm mb-1 transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {paper.courseCode}
                        </p>
                        <p
                          className={`text-sm mb-4 transition-colors duration-200 ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {paper.level} • {paper.semester} • {paper.year}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent transition-colors duration-200 ${
                            isDarkMode ? "hover:bg-purple-900/20 border-purple-400" : ""
                          }`}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
