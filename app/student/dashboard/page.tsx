"use client"

import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Search, ChevronDown, Flame, BookOpen, Clock, CheckCircle, Download, Settings } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/student/ui/avatar"
import { Button } from "@/components/student/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/student/ui/card"
import { Input } from "@/components/student/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/student/ui/select"
// Update the import path if the file exists elsewhere, for example:
import { useState } from "react";
import { useUser } from "../../../context/user-context"
import { useAnalytics } from "../../../context/analytics-context"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useRouter } from "next/navigation";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function Component() {
  const { userData, isDarkMode } = useUser()
  const { analytics, getWeeklyTimeData, getTodayTimeSpent, getStreakData, recordDownload } = useAnalytics()
  const router = useRouter();
  const [userState, setUserData] = useState<any>(null);
  const { user } = useKindeAuth();

    // 👇 Save authenticated student to DB

  useEffect(() => {
    const saveUserToDB = async () => {
      try {
        await fetch("/api/save-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "Student logged in" }),
        });
      } catch (err) {
        console.error("Error saving user:", err);
      }
    };

    saveUserToDB();
     async function fetchUserData() {
    const res = await fetch("/api/get-user");
    const data = await res.json();
    setUserData(data);
  }

  if (user) {
    fetchUserData();
  }
  }, []);
  


 

const getDisplayName = () => {
  const firstName = userState?.firstName || user?.given_name || "";
  const lastName = userState?.lastName || user?.family_name || "";
  return `${firstName} ${lastName}`.trim() || "Student";
};

const getInitials = () => {
  const firstInitial = (userState?.firstName || user?.given_name || "S").charAt(0);
  const lastInitial = (userState?.lastName || user?.family_name || "T").charAt(0);
  return `${firstInitial}${lastInitial}`;
};


  // Get real-time data
  const weeklyTimeData = getWeeklyTimeData()
  const todayTimeSpent = getTodayTimeSpent()
  const streakData = getStreakData()

  // Convert minutes to hours for display
  const formatTimeSpent = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  // Chart data with real values
  const chartData = weeklyTimeData.map((item) => ({
    name: item.date,
    value: item.minutes,
  }))

  // Calculate statistics
  const totalDownloads = analytics.downloadedCourses.length
  const averageTimeSpentFormatted = formatTimeSpent(analytics.averageTimeSpent)
  const completedPracticesCount = analytics.completedPractices.filter(
    (p) => p.completed && p.type === "practice",
  ).length

  // Handle search button click (simulate download)
  const handleSearch = () => {
    // Simulate downloading a course when searching
    recordDownload("CSC301", "Object Oriented Programming", "question")
  }

  const handleLogout = () => {
    localStorage.removeItem("matricNumber");
    localStorage.removeItem("userRole");
    router.push("/login/student");
  };

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
            <Button variant="default" className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
              <div className="w-4 h-4 mr-3 bg-white rounded-sm" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className={`w-full justify-start transition-colors duration-200 ${
                isDarkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600"
              }`}
              asChild
            >
              <Link href="/student/practice">
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
              <Link href="/student/revision">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Time Spent Chart */}
              <div className="lg:col-span-2">
                <Card
                  className={`transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle
                        className={`text-lg font-semibold transition-colors duration-200 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Time Spent This Week
                      </CardTitle>
                      <div className="text-right">
                        <div
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Today: {formatTimeSpent(todayTimeSpent)}
                        </div>
                        <div
                          className={`text-xs transition-colors duration-200 ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          Goal: {formatTimeSpent(analytics.dailyGoalMinutes)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: isDarkMode ? "#9CA3AF" : "#6B7280" }}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: isDarkMode ? "#9CA3AF" : "#6B7280" }}
                            tickFormatter={(value) => `${value}m`}
                          />
                          <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Progress bar for daily goal */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Daily Progress</span>
                        <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          {Math.round(analytics.dailyProgress)}%
                        </span>
                      </div>
                      <div className={`w-full bg-gray-200 rounded-full h-2 ${isDarkMode ? "bg-gray-700" : ""}`}>
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(analytics.dailyProgress, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Cards and Streak */}
              <div className="space-y-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Download className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-600">Course Downloaded</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">{totalDownloads}</div>
                      <div className="text-xs text-purple-700 mt-1">
                        {
                          analytics.downloadedCourses.filter((d) => {
                            const downloadDate = new Date(d.downloadDate)
                            const today = new Date()
                            return downloadDate.toDateString() === today.toDateString()
                          }).length
                        }{" "}
                        today
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple-100 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-purple-600" />
                        <span className="text-sm text-purple-600">Average Time Spent</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-900">{averageTimeSpentFormatted}</div>
                      <div className="text-xs text-purple-700 mt-1">per day (last 30 days)</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                      <span className="text-sm text-purple-600">Practice Questions Completed</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{completedPracticesCount}</div>
                    <div className="text-xs text-purple-700 mt-1">
                      {analytics.totalQuestionsAnswered} total questions • {analytics.averageScore}% avg score
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Streak Card */}
                <Card
                  className={`transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="mb-4">
                      <Flame className="w-12 h-12 text-orange-500 mx-auto mb-2" />
                      <div
                        className={`font-semibold transition-colors duration-200 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {streakData.current > 0
                          ? `You are on a ${streakData.current} day${streakData.current > 1 ? "s" : ""} streak!`
                          : "Start your streak today!"}
                      </div>
                      <div
                        className={`text-sm transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {streakData.longest > 0 && `Longest: ${streakData.longest} days`}
                      </div>
                      <div
                        className={`text-xs mt-1 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        Study for 10+ minutes daily to maintain your streak
                      </div>
                    </div>
                    <div className="flex justify-center gap-1">
                      {streakData.daysActive.map((isActive, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            isActive
                              ? "bg-orange-400 text-orange-900"
                              : isDarkMode
                                ? "bg-gray-600 text-gray-400"
                                : "bg-gray-200 text-gray-400"
                          }`}
                          title={`${7 - i} days ago`}
                        >
                          {isActive ? "🔥" : "⭐"}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Search Section */}
            <Card
              className={`mt-6 transition-colors duration-200 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2
                    className={`text-lg font-semibold mb-1 transition-colors duration-200 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Welcome <span className="text-purple-600">{userData.firstName}</span>,
                  </h2>
                  <p className={`transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Ace your next exam—start with StudyStack!
                  </p>
                </div>

                <div className="mb-6">
                  <h3
                    className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Search <span className="text-purple-600">Past Question</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Select>
                      <SelectTrigger
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
                        }`}
                      >
                        <SelectValue placeholder="Department" />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}>
                        <SelectItem
                          value="computer-science"
                          className={isDarkMode ? "text-white hover:bg-gray-600" : ""}
                        >
                          Computer Science
                        </SelectItem>
                        <SelectItem value="engineering" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          Engineering
                        </SelectItem>
                        <SelectItem value="medicine" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          Medicine
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
                        }`}
                      >
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}>
                        <SelectItem value="100" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          100 Level
                        </SelectItem>
                        <SelectItem value="200" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          200 Level
                        </SelectItem>
                        <SelectItem value="300" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          300 Level
                        </SelectItem>
                        <SelectItem value="400" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          400 Level
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
                        }`}
                      >
                        <SelectValue placeholder="Semester" />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}>
                        <SelectItem value="first" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          First Semester
                        </SelectItem>
                        <SelectItem value="second" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          Second Semester
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select>
                      <SelectTrigger
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white"
                        }`}
                      >
                        <SelectValue placeholder="Course" />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}>
                        <SelectItem value="mathematics" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          Mathematics
                        </SelectItem>
                        <SelectItem value="physics" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          Physics
                        </SelectItem>
                        <SelectItem value="chemistry" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          Chemistry
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-2"
                      onClick={handleSearch}
                      asChild
                    >
                      <Link href="/search-results">SEARCH</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logout Button */}
            <div className="mt-8 flex justify-end">
              <LogoutLink postLogoutRedirectURL="http://localhost:3000">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </LogoutLink>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
