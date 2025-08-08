"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { Upload, FileText, Download, Edit, Trash2 } from "lucide-react";
import { departments, levels, semester, years } from "@/lib/common";


const existingNotes = [
  {
    id: 1,
    title: "Object Oriented Programming",
    courseCode: "CSC 302",
    level: "300L",
    semester: "2nd Semester",
    year: "2023",
    uploadedBy: "Dr. Johnson",
    downloads: 45,
  },
  {
    id: 2,
    title: "Data Structures",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2023",
    uploadedBy: "Prof. Smith",
    downloads: 32,
  },
];

export default function AdminCourseNotePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isSearching, setSearching] = useState(false);
  const [formData, setFormData] = useState({
    courseTitle: "",
    level: "100L",
    year: "2024",
    semester: "2nd",
    department: "CSC",
    file: null as File | null,
  });
  const [searchData, setSearchData] = useState({
    level: "",
    year: "",
    semester: "",
    department: "",
  });
  const [searchedNotes, setSearchedNotes] = useState<
    {
      _id: string;
      courseTitle: string;
      level: string;
      semester: string;
      year: string;
      fileUrl: string;
      uploadedByName?: string;
      downloads?: number;
    }[]
  >([]);

  const { toast } = useToast();

  const { user } = useKindeAuth();

  useEffect(() => {
    async function saveUserToDB() {
      if (!user) return;

      try {
        const res = await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: localStorage.getItem("userRole"),
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error("❌ Failed to save user:", errorData);

          toast({
            title: "Save failed",
            description: errorData.error || "Unexpected error. Try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("✅ User saved to MongoDB");
      } catch (err) {
        console.error("❌ Network error saving user:", err);
        toast({
          title: "Network Error",
          description: "Couldn't save user to database.",
          variant: "destructive",
        });
      }
    }

    saveUserToDB(); 
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    console.log(formData);
    if (
      !formData.file ||
      !formData.courseTitle ||
      !formData.level ||
      !formData.year ||
      !formData.semester ||
      !formData.department
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fd = new FormData();
      fd.append("courseTitle", formData.courseTitle);
      fd.append("level", formData.level);
      fd.append("year", formData.year);
      fd.append("semester", formData.semester);
      fd.append("department", formData.department);
      fd.append("file", formData.file);

      const response = await fetch("/api/course-notes", {
        method: "POST",
        body: fd,
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Upload failed",
          description: errorData.error || "Unexpected error. Try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Course note uploaded successfully",
      });
      // Reset form
      setFormData({
        courseTitle: "",
        level: "100L",
        year: "2024",
        semester: "2nd",
        department: "CSC",
        file: null,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSearch = async () => {
    setSearching(true);
    try {
      let url = "/api/course-notes";
      const searchParams = new URLSearchParams();
      if (searchData.level) {
        searchParams.append("level", searchData.level);
      }
      if (searchData.year) {
        searchParams.append("year", searchData.year);
      }
      if (searchData.semester) {
        searchParams.append("semester", searchData.semester);
      }
      if (searchData.department) {
        searchParams.append("department", searchData.department);
      }
      const response = await fetch(`${url}?${searchParams.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Search",
          description: "Failed to fetch existing notes.",
        });
      }

      const data = await response.json();
      setSearchedNotes(data);
      if (data.length === 0) {
        toast({
          variant: "destructive",
          title: "Search",
          description: "No course notes found for the selected criteria.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Search",
        description: "Error fetching existing notes.",
      });
    } finally {
      setSearching(false);
    }
  };

  const handleDelete = async (id: string) => {
    try{
      fetch(`/api/course-notes?noteId=${id}`, {
        method: "DELETE",
      }).then(async (res) => {
        if (!res.ok) {
          toast({
            title: "Error",
            description: "Failed to delete course note",
            variant: "destructive"
          });
          return;
        }
        await handleSearch();
        toast({
          title: "Success",
          description: "Course note deleted successfully",
        });
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course note",
        variant: "destructive"
      });
    }
    
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Info",
      description: "Edit functionality would be implemented here",
    });
  };

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin - Course Note Management
            </h1>
            <p className="text-gray-600">Manage and upload course notes</p>
          </div>

          {/* Search Section */}
          <Card>
            <CardContent className="p-6">
            <h3
                    className={`text-xl font-semibold mb-4 transition-colors duration-200`}
                  >
                    Search{" "}
                    <span className="text-purple-600">Course Note</span>
                  </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <Select
                  onValueChange={(value) =>
                    setSearchData((prev) => ({ ...prev, department: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.value} value={department.value}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setSearchData((prev) => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setSearchData((prev) => ({ ...prev, semester: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semester.map((sem) => (
                      <SelectItem key={sem.value} value={sem.value}>
                        {sem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value) =>
                    setSearchData((prev) => ({ ...prev, year: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="bg-purple-600 hover:bg-purple-700 px-8"
                >
                  {isSearching? "Searching..." : "SEARCH"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Existing Notes Management */}
          {searchedNotes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-purple-600">
                  Search Results: Course Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {searchedNotes.map((note) => (
                    <div
                      key={note._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold">{note.courseTitle}</h3>
                        <p className="text-sm text-gray-600">
                          {note.level} • {note.semester} Semester • {note.year}
                        </p>
                        <p className="text-sm text-gray-500">
                          Uploaded by: {note.uploadedByName || "Admin"} •
                          Downloads: {note.downloads || 0}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(note._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => window.open(note.fileUrl, "_blank")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-600">
                Upload New Course Note
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="courseTitle">Course Title:</Label>
                  <Input
                    id="courseTitle"
                    value={formData.courseTitle}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        courseTitle: e.target.value,
                      }))
                    }
                    placeholder="Enter course title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year:</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, year: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.year} />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level:</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, level: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.level} />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester:</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, semester: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.semester} />
                    </SelectTrigger>
                    <SelectContent>
                      {semester.map((sem) => (
                        <SelectItem key={sem.value} value={sem.value}>
                          {sem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="department">Department:</Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, department: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={formData.department} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="file">Upload PDF:</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      id="file"
                      accept=".pdf"
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
                          <p className="text-gray-500">
                            Drag or Choose PDF File
                          </p>
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
  );
}
