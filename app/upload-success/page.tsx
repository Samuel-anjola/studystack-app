"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Upload } from "lucide-react"

export default function UploadSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const type = searchParams.get("type")
  const fileName = searchParams.get("file")
  const course = searchParams.get("course")
  const level = searchParams.get("level")
  const semester = searchParams.get("semester")
  const year = searchParams.get("year")
  const department = searchParams.get("department")

  const handleUploadAnother = () => {
    const isAdmin = searchParams.get("admin") === "true"

    if (type === "course-note") {
      router.push(isAdmin ? "/admin/course-note" : "/course-note")
    } else if (type === "practice-question") {
      router.push(isAdmin ? "/admin/practice-question" : "/practice-question")
    } else if (type === "past-question") {
      router.push(isAdmin ? "/admin/past-question" : "/past-question")
    }
  }

  const getSection = () => {
    return type === "course-note" ? "Course Notes" : "Practice Questions"
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mx-auto max-w-2xl">
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-green-600 mb-2">Upload Successful!</h1>
              </div>

              <div className="text-left space-y-2 mb-8 bg-gray-50 p-6 rounded-lg">
                <h2 className="text-lg font-semibold mb-4">You just uploaded:</h2>
                <div className="space-y-1 text-gray-700">
                  <p>
                    <span className="font-medium">• File Name:</span> {fileName || "Unknown file"}
                  </p>
                  <p>
                    <span className="font-medium">• Section:</span> {getSection()}
                  </p>
                  {course && (
                    <p>
                      <span className="font-medium">• Course Title:</span> {course}
                    </p>
                  )}
                  {semester && (
                    <p>
                      <span className="font-medium">• Semester:</span> {semester}
                    </p>
                  )}
                  {level && (
                    <p>
                      <span className="font-medium">• Level:</span> {level}
                    </p>
                  )}
                  {year && (
                    <p>
                      <span className="font-medium">• Year:</span> {year}
                    </p>
                  )}
                  {department && (
                    <p>
                      <span className="font-medium">• Department:</span> {department}
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={handleUploadAnother} className="bg-purple-600 hover:bg-purple-700 px-8">
                <Upload className="h-4 w-4 mr-2" />
                Upload Another
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
