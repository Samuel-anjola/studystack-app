"use client";

import { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/student/ui/avatar";
import { Button } from "@/components/student/ui/button";
import { Card, CardContent } from "@/components/student/ui/card";
import { Input } from "@/components/student/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/student/ui/select";
import {
  Search,
  ChevronDown,
  BookOpen,
  Clock,
  Download,
  Bookmark,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { useUser } from "../../../context/user-context";
import { useAnalytics } from "../../../context/analytics-context";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";
import { useToast } from "@/hooks/use-toast";
import { departments, levels, semester, years } from "@/lib/common";

const courseNotes = [
  {
    id: 1,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2023",
    readingTime: "15 min read",
    isBookmarked: false,
    isNew: true,
  },
  {
    id: 2,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2025",
    readingTime: "20 min read",
    isBookmarked: true,
    isNew: false,
  },
  {
    id: 3,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2022",
    readingTime: "18 min read",
    isBookmarked: false,
    isNew: false,
  },
  {
    id: 4,
    title: "Object Oriented Programming",
    courseCode: "CSC 301",
    level: "300L",
    semester: "1st Semester",
    year: "2024",
    readingTime: "12 min read",
    isBookmarked: true,
    isNew: true,
  },
];

export default function RevisionRoom() {
  const { toast } = useToast();

  const { userData, isDarkMode } = useUser();
  const { startSession, recordDownload } = useAnalytics();

  const [searchFilters, setSearchFilters] = useState({
    department: "",
    level: "",
    semester: "",
    course: "",
    year: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setSearching] = useState(false);

  const [notes, setNotes] = useState(courseNotes);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [userState, setUserData] = useState<any>(null);
  const { user } = useKindeAuth();

  // Calculate stats
  const newNotesCount = notes.filter((note) => note.isNew).length;
  const downloadedCount = notes.length; // Assuming all displayed notes are downloaded
  const bookmarkedCount = notes.filter((note) => note.isBookmarked).length;

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
      department: string;
    }[]
  >([]);

  const handleSearch = async () => {
    setActiveFilter(null);
    await processSearch();
    // Start a revision session when searching
    startSession("revision");
  };

  const processSearch = async () => {
    setSearching(true);
    try {
      let url = "/api/course-notes";
      const searchParams = new URLSearchParams();
      if (searchFilters.level) {
        searchParams.append("level", searchFilters.level);
      }
      if (searchFilters.year) {
        searchParams.append("year", searchFilters.year);
      }
      if (searchFilters.semester) {
        searchParams.append("semester", searchFilters.semester);
      }
      if (searchFilters.department) {
        searchParams.append("department", searchFilters.department);
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
      setHasSearched(true);
      setSearching(false);
    }
  };

  const handleDownload = (
    course: string,
    courseTitle: string,
    fileUrl: string
  ) => {
    // Record the download in analytics
    recordDownload(course, courseTitle, "note");

    window.open(fileUrl, "_blank");
  };

  const toggleBookmark = (noteId: string) => {
    // setSearchedNotes((prevNotes) =>
    //   prevNotes.map((note) => (note._id === noteId ? { ...note, isBookmarked: !note.isBookmarked } : note)),
    // )
  };

  const handleStatCardClick = (filterType: string) => {
    setActiveFilter(filterType);
    setHasSearched(true);
  };

  const getFilteredNotes = () => {
    if (!activeFilter) return searchedNotes;

    switch (activeFilter) {
      case "new":
        return notes.filter((note) => note.isNew);
      case "bookmarked":
        return notes.filter((note) => note.isBookmarked);
      default:
        return searchedNotes;
    }
  };

  const getSearchFilterText = () => {
    const parts = [];

    if (searchFilters.level) {
      parts.push(`${searchFilters.level} Level`);
    }

    if (searchFilters.department) {
      const deptMap: { [key: string]: string } = {
        "computer-science": "Computer Science",
        engineering: "Engineering",
        mathematics: "Mathematics",
      };
      parts.push(deptMap[searchFilters.department] || searchFilters.department);
    }

    if (searchFilters.semester) {
      const semesterMap: { [key: string]: string } = {
        first: "1st Semester",
        second: "2nd Semester",
      };
      parts.push(semesterMap[searchFilters.semester] || searchFilters.semester);
    }

    if (searchFilters.course) {
      const courseMap: { [key: string]: string } = {
        csc301: "CSC 301",
        csc302: "CSC 302",
        csc303: "CSC 303",
        csc304: "CSC 304",
      };
      parts.push(courseMap[searchFilters.course] || searchFilters.course);
    }

    return parts.length > 0 ? parts.join(" • ") : "All Courses";
  };

  const getResultsText = () => {
    const filteredNotes = getFilteredNotes();

    if (activeFilter === "new") {
      return `${filteredNotes.length} New Course Notes`;
    } else if (activeFilter === "bookmarked") {
      return `${filteredNotes.length} Bookmarked Course Notes`;
    } else if (activeFilter === "downloaded") {
      return `${filteredNotes.length} Downloaded Course Notes`;
    } else if (hasSearched) {
      return `${
        filteredNotes.length
      } Notes found for: ${getSearchFilterText()}`;
    } else {
      return "";
    }
  };

  const getDisplayName = () => {
    const firstName = userState?.firstName || user?.given_name || "";
    const lastName = userState?.lastName || user?.family_name || "";
    return `${firstName} ${lastName}`.trim() || "Student";
  };

  const getInitials = () => {
    const firstInitial = (
      userState?.firstName ||
      user?.given_name ||
      "S"
    ).charAt(0);
    const lastInitial = (
      userState?.lastName ||
      user?.family_name ||
      "T"
    ).charAt(0);
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`border-b px-6 py-4 transition-colors duration-200 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
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
              <AvatarImage
                src={userData.profilePicture || "/placeholder.svg"}
              />
              <AvatarFallback
                className={isDarkMode ? "bg-gray-700 text-white" : ""}
              >
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <span
              className={`font-medium transition-colors duration-200 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {getDisplayName()}
            </span>
            <ChevronDown
              className={`w-4 h-4 transition-colors duration-200 ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Fixed Sidebar */}
        <aside
          className={`w-64 border-r transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <nav className="p-4 space-y-2">
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/student/dashboard">
                <div
                  className={`w-4 h-4 mr-3 rounded-sm ${
                    isDarkMode ? "bg-gray-600" : "bg-gray-400"
                  }`}
                />
                Dashboard
              </Link>
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/student/practice">
                <BookOpen className="w-4 h-4 mr-3" />
                Practice Room
              </Link>
            </Button>
            <Button
              variant="default"
              className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
            >
              <BookOpen className="w-4 h-4 mr-3" />
              Revision Room
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode
                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/student/settings">
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </Link>
            </Button>
          </nav>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
              <h1
                className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Revision Room
              </h1>
              <p
                className={`transition-colors duration-200 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Review and reinforce your knowledge with curated study materials
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-blue-50 border-blue-200"
                onClick={() => handleStatCardClick("new")}
              >
                <CardContent className="p-4">
                  <div className="text-blue-800 text-sm font-medium mb-2">
                    New Notes Added
                  </div>
                  <div className="text-2xl font-bold text-blue-900">
                    {newNotesCount}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-green-50 border-green-200"
                onClick={() => handleStatCardClick("downloaded")}
              >
                <CardContent className="p-4">
                  <div className="text-green-800 text-sm font-medium mb-2">
                    Courses Downloaded
                  </div>
                  <div className="text-2xl font-bold text-green-900">
                    {downloadedCount}
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-purple-50 border-purple-200"
                onClick={() => handleStatCardClick("bookmarked")}
              >
                <CardContent className="p-4">
                  <div className="text-purple-800 text-sm font-medium mb-2">
                    Course Bookmarked
                  </div>
                  <div className="text-2xl font-bold text-purple-900">
                    {bookmarkedCount}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter Section */}
            <Card className="mb-6 bg-purple-600">
              <CardContent className="p-6">
                <h2 className="text-white text-xl font-semibold mb-6">
                  Find Course Notes
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Select
                    value={searchFilters.department}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, department: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {departments.map((department) => (
                        <SelectItem
                          key={department.value}
                          value={department.value}
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          {department.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={searchFilters.level}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, level: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {levels.map((level) => (
                        <SelectItem
                          key={level}
                          value={level}
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={searchFilters.semester}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, semester: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900">
                      <SelectValue placeholder="Semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {semester.map((sem) => (
                        <SelectItem
                          key={sem.value}
                          value={sem.value}
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          {sem.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={searchFilters.year}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, year: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      {years.map((year) => (
                        <SelectItem
                          key={year}
                          value={year}
                          className="text-gray-900 hover:bg-gray-100"
                        >
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={searchFilters.course}
                    onValueChange={(value) =>
                      setSearchFilters({ ...searchFilters, course: value })
                    }
                  >
                    <SelectTrigger className="bg-white text-gray-900">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem
                        value="csc301"
                        className="text-gray-900 hover:bg-gray-100"
                      >
                        CSC 301
                      </SelectItem>
                      <SelectItem
                        value="csc302"
                        className="text-gray-900 hover:bg-gray-100"
                      >
                        CSC 302
                      </SelectItem>
                      <SelectItem
                        value="csc303"
                        className="text-gray-900 hover:bg-gray-100"
                      >
                        CSC 303
                      </SelectItem>
                      <SelectItem
                        value="csc304"
                        className="text-gray-900 hover:bg-gray-100"
                      >
                        CSC 304
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-2 font-semibold"
                  >
                    {isSearching ? "Searching..." : "SEARCH MATERIALS"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="mb-6">
              <p
                className={`transition-colors duration-200 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span className="text-purple-600">{getResultsText()}</span>
              </p>
            </div>

            {/* Course Notes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchedNotes.map((note) => (
                <Card
                  key={note._id}
                  className={`hover:shadow-md transition-all duration-200 ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className={`font-semibold mb-1 transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {note.courseTitle}
                        </h3>
                        <p
                          className={`text-sm mb-1 transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          { departments.find(dep => dep.value == note.department)?.name || note.department }
                        </p>
                        <p
                          className={`text-sm mb-3 transition-colors duration-200 ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {note.level} • {note.semester} Semester • {note.year}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          <div
                            className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                              isDarkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            {/* {note.readingTime} */} 20 mins
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownload(
                                note.department,
                                note.courseTitle,
                                note.fileUrl
                              )
                            }
                            className={`text-purple-600 border-purple-200 hover:bg-purple-50 bg-transparent flex-1 transition-colors duration-200 ${
                              isDarkMode
                                ? "hover:bg-purple-900/20 border-purple-400"
                                : ""
                            }`}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBookmark(note._id)}
                            className={`border-purple-200 transition-colors duration-200 ${
                              false /* Replace with actual condition to check if note is bookmarked */
                                ? "bg-purple-600 text-white hover:bg-purple-700"
                                : isDarkMode
                                ? "text-purple-400 hover:bg-purple-900/20 bg-transparent border-purple-400"
                                : "text-purple-600 hover:bg-purple-50 bg-transparent"
                            }`}
                          >
                            <Bookmark
                              className={`w-4 h-4 ${
                                false ? "fill-current" : ""
                              }`}
                            />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {/* <div className="flex justify-center mt-8">
              <Button
                variant="outline"
                className={`px-8 bg-transparent transition-colors duration-200 ${
                  isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : ""
                }`}
              >
                Load More Materials
              </Button>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
