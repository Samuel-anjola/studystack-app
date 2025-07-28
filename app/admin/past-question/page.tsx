"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Download, Edit, Trash2, BookOpen } from "lucide-react"

const existingQuestions = [
  {
    id: 1,
    title: "Object Oriented Programming",
    courseCode: "CSC 302",
    level: "300L",
    semester: "2nd Semester",
    year: "2023",
    examType: "Final Exam",
    uploadedBy: "Dr. Johnson",
    downloads: 67,
  },
  {
    id: 2,
    title: "Data Structures",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2023",
    examType: "Mid-Term",
    uploadedBy: "Prof. Smith",
    downloads: 45,
  },
]

export default function AdminPastQuestionPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    courseTitle: "",
    courseCode: "",
    level: "",
    year: "",
    semester: "",
    examType: "",
    file: null as File | null,
  })
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, file }))
    }
  }

  const handleUpload = async () => {
    if (
      !formData.file ||
      !formData.courseTitle ||
      !formData.courseCode ||
      !formData.level ||
      !formData.year ||
      !formData.semester ||
      !formData.examType
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    setTimeout(() => {
      setIsUploading(false)
      toast({
        title: "Success",
        description: "Past question uploaded successfully",
      })
      setFormData({
        courseTitle: "",
        courseCode: "",
        level: "",
        year: "",
        semester: "",
        examType: "",
        file: null,
      })
    }, 2000)
  }

  const handleSearch = () => {
    toast({
      title: "Search",
      description: "Search functionality would filter the past questions",
    })
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-purple-600">Admin - Past Question Management</h1>
            <p className="text-gray-600">Manage and upload past exam questions</p>
          </div>

          {/* Search Section */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="CSC" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csc">CSC</SelectItem>
                    <SelectItem value="mat">MAT</SelectItem>
                    <SelectItem value="phy">PHY</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="300 LVL" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 LVL</SelectItem>
                    <SelectItem value="200">200 LVL</SelectItem>
                    <SelectItem value="300">300 LVL</SelectItem>
                    <SelectItem value="400">400 LVL</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="1st Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Semester</SelectItem>
                    <SelectItem value="2nd">2nd Semester</SelectItem>
                  </SelectContent>
                </Select>

                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="CSC 301" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csc301">CSC 301</SelectItem>
                    <SelectItem value="csc302">CSC 302</SelectItem>
                    <SelectItem value="csc303">CSC 303</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 px-8">
                  SEARCH
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Questions Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Existing Past Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingQuestions.map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{question.title}</h3>
                          <p className="text-sm text-gray-600">{question.courseCode}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                              {question.examType}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                              {question.year}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {question.level} • {question.semester} • Uploaded by: {question.uploadedBy} • Downloads:{" "}
                            {question.downloads}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">Upload Past Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseTitle">Course Title:</Label>
                  <Input
                    id="courseTitle"
                    value={formData.courseTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, courseTitle: e.target.value }))}
                    placeholder="Enter course title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseCode">Course Code:</Label>
                  <Input
                    id="courseCode"
                    value={formData.courseCode}
                    onChange={(e) => setFormData((prev) => ({ ...prev, courseCode: e.target.value }))}
                    placeholder="e.g. CSC 301"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level:</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100L">100L</SelectItem>
                      <SelectItem value="200L">200L</SelectItem>
                      <SelectItem value="300L">300L</SelectItem>
                      <SelectItem value="400L">400L</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year:</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, year: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2020">2020</SelectItem>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester:</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, semester: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Semester">1st Semester</SelectItem>
                      <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="examType">Exam Type:</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, examType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Exam Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mid-Term">Mid-Term</SelectItem>
                      <SelectItem value="Final Exam">Final Exam</SelectItem>
                      <SelectItem value="Quiz">Quiz</SelectItem>
                      <SelectItem value="Assignment">Assignment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file">Upload PDF:</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input type="file" id="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    <label htmlFor="file" className="cursor-pointer">
                      {formData.file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-5 w-5" />
                          <span>{formData.file.name}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-gray-500">Drag or Choose PDF File</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button variant="outline" className="px-8 bg-transparent">
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
