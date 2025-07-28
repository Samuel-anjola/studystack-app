"use client"

import type React from "react"
import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Upload, FileText, Download, Edit, Trash2 } from "lucide-react"

const existingQuestions = [
  {
    id: 1,
    title: "OOP Practice Questions",
    courseCode: "CSC 302",
    uploadedBy: "Dr. Johnson",
    downloads: 23,
  },
  {
    id: 2,
    title: "Data Structures Quiz",
    courseCode: "CSC 301",
    uploadedBy: "Prof. Smith",
    downloads: 18,
  },
]

export default function AdminPracticeQuestionPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    course: "",
    department: "",
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
    if (!formData.file || !formData.course || !formData.department) {
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
        description: "Practice question uploaded successfully",
      })
      setFormData({
        course: "",
        department: "",
        file: null,
      })
    }, 2000)
  }

  const handleSearch = () => {
    toast({
      title: "Search",
      description: "Search functionality would be implemented here",
    })
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin - Practice Question Management</h1>
            <p className="text-gray-600">Manage and upload practice questions</p>
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
                    <SelectValue placeholder="300 L" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100 L</SelectItem>
                    <SelectItem value="200">200 L</SelectItem>
                    <SelectItem value="300">300 L</SelectItem>
                    <SelectItem value="400">400 L</SelectItem>
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
              <CardTitle className="text-purple-600">Existing Practice Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {existingQuestions.map((question) => (
                  <div key={question.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{question.title}</h3>
                      <p className="text-sm text-gray-600">{question.courseCode}</p>
                      <p className="text-sm text-gray-500">
                        Uploaded by: {question.uploadedBy} • Downloads: {question.downloads}
                      </p>
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
              <CardTitle className="text-purple-600">Upload Practice Question</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="course">Course:</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, course: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csc301">CSC 301</SelectItem>
                      <SelectItem value="csc302">CSC 302</SelectItem>
                      <SelectItem value="csc303">CSC 303</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department:</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, department: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="CSC" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSC">CSC</SelectItem>
                      <SelectItem value="MAT">MAT</SelectItem>
                      <SelectItem value="PHY">PHY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file">Upload File:</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="file"
                      accept=".csv,.xlsx,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="file" className="cursor-pointer">
                      {formData.file ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-5 w-5" />
                          <span>{formData.file.name}</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-gray-500">Drag or Choose .csv, .xlsx</p>
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
