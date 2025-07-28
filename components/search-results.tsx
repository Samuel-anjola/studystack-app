"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, FileQuestion, GraduationCap, X } from "lucide-react"
import { useSearch } from "@/context/search-context"

export function SearchResults() {
  const { searchResults, searchQuery, setSearchQuery, setSearchResults } = useSearch()
  const router = useRouter()

  if (!searchQuery || searchResults.length === 0) {
    return null
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "course-note":
        return BookOpen
      case "practice-question":
        return FileQuestion
      case "past-question":
        return GraduationCap
      default:
        return BookOpen
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "course-note":
        return "Course Note"
      case "practice-question":
        return "Practice Question"
      case "past-question":
        return "Past Question"
      default:
        return "Unknown"
    }
  }

  const handleResultClick = (result: any) => {
    router.push(result.url)
    setSearchQuery("")
    setSearchResults([])
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <Card className="shadow-lg border-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-gray-700">
              Search Results for "{searchQuery}" ({searchResults.length})
            </h3>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {searchResults.map((result) => {
              const Icon = getIcon(result.type)
              return (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer border"
                >
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{result.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        {getTypeLabel(result.type)}
                      </span>
                      <span>{result.courseCode}</span>
                      {result.level && <span>• {result.level}</span>}
                      {result.semester && <span>• {result.semester}</span>}
                      {result.year && <span>• {result.year}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
