"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/student/ui/avatar"
import { Button } from "@/components/student/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/student/ui/card"
import { Input } from "@/components/student/ui/input"
import { Progress } from "@/components/student/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/student/ui/select"
import { Search, ChevronDown, BookOpen, Clock, CheckCircle2, X, ArrowLeft, ArrowRight, Settings } from "lucide-react"
import Link from "next/link"
import { useUser } from "../../../context/user-context"
import { useAnalytics } from "../../../context/analytics-context"
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";


export default function PracticeMode() {
  const { userData, isDarkMode } = useUser()
  const { startSession, endSession, updateSessionProgress } = useAnalytics()
  const [userState, setUserData] = useState<any>(null);
    const { user } = useKindeAuth();
  

  const [currentView, setCurrentView] = useState<"landing" | "test" | "result">("landing")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(20).fill(null))
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [testConfig, setTestConfig] = useState({
    department: "csc",
    level: "300",
    semester: "first",
    course: "csc301",
  })

  const sampleQuestions = [
    {
      id: 1,
      question: "What is the primary function of the CPU in a computer system?",
      options: [
        "To store data permanently",
        "To execute instructions and perform calculations",
        "To display graphics on the screen",
        "To connect to the internet",
      ],
      correctAnswer: 1,
      subject: "Computer Science",
      difficulty: "Easy",
    },
    {
      id: 2,
      question: "Which of the following is NOT a programming paradigm?",
      options: [
        "Object-Oriented Programming",
        "Functional Programming",
        "Procedural Programming",
        "Database Programming",
      ],
      correctAnswer: 3,
      subject: "Computer Science",
      difficulty: "Medium",
    },
    {
      id: 3,
      question: "What does HTML stand for?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language",
      ],
      correctAnswer: 0,
      subject: "Web Development",
      difficulty: "Easy",
    },
    {
      id: 4,
      question: "Which data structure uses LIFO (Last In, First Out) principle?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correctAnswer: 1,
      subject: "Computer Science",
      difficulty: "Easy",
    },
    {
      id: 5,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correctAnswer: 1,
      subject: "Computer Science",
      difficulty: "Medium",
    },
    {
      id: 6,
      question: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
      correctAnswer: 2,
      subject: "Database",
      difficulty: "Easy",
    },
    {
      id: 7,
      question: "What does CSS stand for?",
      options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
      correctAnswer: 1,
      subject: "Web Development",
      difficulty: "Easy",
    },
    {
      id: 8,
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: ["Bubble Sort", "Selection Sort", "Quick Sort", "Insertion Sort"],
      correctAnswer: 2,
      subject: "Computer Science",
      difficulty: "Medium",
    },
    {
      id: 9,
      question: "What is the purpose of a constructor in OOP?",
      options: ["To destroy objects", "To initialize objects", "To copy objects", "To compare objects"],
      correctAnswer: 1,
      subject: "Computer Science",
      difficulty: "Easy",
    },
    {
      id: 10,
      question: "Which protocol is used for secure web communication?",
      options: ["HTTP", "HTTPS", "FTP", "SMTP"],
      correctAnswer: 1,
      subject: "Networking",
      difficulty: "Easy",
    },
    {
      id: 11,
      question: "What is polymorphism in OOP?",
      options: ["Having multiple forms", "Data hiding", "Code reusability", "Memory management"],
      correctAnswer: 0,
      subject: "Computer Science",
      difficulty: "Medium",
    },
    {
      id: 12,
      question: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Object"],
      correctAnswer: 2,
      subject: "Web Development",
      difficulty: "Easy",
    },
    {
      id: 13,
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "Sequential Query Language",
      ],
      correctAnswer: 0,
      subject: "Database",
      difficulty: "Easy",
    },
    {
      id: 14,
      question: "Which design pattern ensures only one instance of a class?",
      options: ["Factory", "Singleton", "Observer", "Strategy"],
      correctAnswer: 1,
      subject: "Computer Science",
      difficulty: "Medium",
    },
    {
      id: 15,
      question: "What is the default port for HTTP?",
      options: ["21", "22", "80", "443"],
      correctAnswer: 2,
      subject: "Networking",
      difficulty: "Easy",
    },
    {
      id: 16,
      question: "Which of the following is a version control system?",
      options: ["Git", "Docker", "Jenkins", "Maven"],
      correctAnswer: 0,
      subject: "Software Engineering",
      difficulty: "Easy",
    },
    {
      id: 17,
      question: "What is the purpose of an index in a database?",
      options: ["To store data", "To speed up queries", "To backup data", "To encrypt data"],
      correctAnswer: 1,
      subject: "Database",
      difficulty: "Medium",
    },
    {
      id: 18,
      question: "Which HTTP method is used to update a resource?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correctAnswer: 2,
      subject: "Web Development",
      difficulty: "Easy",
    },
    {
      id: 19,
      question: "What is the space complexity of merge sort?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 2,
      subject: "Computer Science",
      difficulty: "Hard",
    },
    {
      id: 20,
      question: "Which of the following is NOT a principle of OOP?",
      options: ["Encapsulation", "Inheritance", "Polymorphism", "Compilation"],
      correctAnswer: 3,
      subject: "Computer Science",
      difficulty: "Medium",
    },
  ]

  useEffect(() => {
    if (currentView === "test") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentView]) 
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
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startTest = () => {
    // Start analytics session
    const sessionId = startSession("practice", testConfig.course)
    setCurrentSessionId(sessionId)

    setAnswers(new Array(sampleQuestions.length).fill(null))
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setTimeLeft(600) // 10 minutes
    setCurrentView("test")
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)

    // Update session progress
    if (currentSessionId) {
      const answeredCount = newAnswers.filter((answer) => answer !== null).length
      updateSessionProgress(currentSessionId, answeredCount)
    }
  }

  const handleNext = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1])
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1])
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      return answer === sampleQuestions[index].correctAnswer ? score + 1 : score
    }, 0)
  }

  const handleSubmit = () => {
    if (currentSessionId) {
      const score = calculateScore()
      const percentage = Math.round((score / sampleQuestions.length) * 100)
      const questionsAnswered = answers.filter((answer) => answer !== null).length

      endSession(currentSessionId, questionsAnswered, percentage)
    }
    setCurrentView("result")
  }

  const resetTest = () => {
    if (currentSessionId) {
      // End session without completion if user exits early
      endSession(currentSessionId, 0, 0)
    }

    setCurrentView("landing")
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers(new Array(sampleQuestions.length).fill(null))
    setTimeLeft(600)
    setCurrentSessionId(null)
  }

  // Landing Page View
  if (currentView === "landing") {
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
                <Link href="/student/dashboard">
                  <div className={`w-4 h-4 mr-3 rounded-sm ${isDarkMode ? "bg-gray-600" : "bg-gray-400"}`} />
                  Dashboard
                </Link>
              </Button>
              <Button variant="default" className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                <BookOpen className="w-4 h-4 mr-3" />
                Practice Room
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
              {/* Top Section - Instructions and Test Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Instructions Card */}
                <Card
                  className={`h-fit transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <CardHeader className="bg-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-lg font-bold">INSTRUCTIONS</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span
                          className={`leading-relaxed transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          20 multiple-choice questions
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span
                          className={`leading-relaxed transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Time limit: 10 minutes
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span
                          className={`leading-relaxed transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Score are shown at the end
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span
                          className={`leading-relaxed transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Each question carries equal marks
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span
                          className={`leading-relaxed transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          No negative marking for wrong answers
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span
                          className={`leading-relaxed transition-colors duration-200 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          Your progress will be tracked automatically
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Overview Card */}
                <Card
                  className={`h-full transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <CardHeader
                    className={`border-b transition-colors duration-200 ${
                      isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    <CardTitle
                      className={`text-lg font-bold transition-colors duration-200 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      TEST OVERVIEW
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div
                        className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Subject:
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {testConfig.department
                            ? testConfig.department === "csc"
                              ? "Computer Science"
                              : testConfig.department === "eng"
                                ? "Engineering"
                                : testConfig.department === "mat"
                                  ? "Mathematics"
                                  : "Computer Science"
                            : "Computer Science"}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Course Code:
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {testConfig.course
                            ? testConfig.course === "csc301"
                              ? "CSC 301"
                              : testConfig.course === "csc302"
                                ? "CSC 302"
                                : testConfig.course === "csc303"
                                  ? "CSC 303"
                                  : testConfig.course.toUpperCase()
                            : "CSC 301"}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Level:
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {testConfig.level ? `${testConfig.level} Level` : "300 Level"}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Semester:
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-200 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {testConfig.semester
                            ? testConfig.semester === "first"
                              ? "1st Semester"
                              : "2nd Semester"
                            : "1st Semester"}
                        </span>
                      </div>
                      <div
                        className={`flex justify-between items-center py-2 border-b transition-colors duration-200 ${
                          isDarkMode ? "border-gray-700" : "border-gray-100"
                        }`}
                      >
                        <span
                          className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Total Questions:
                        </span>
                        <span className="text-purple-600 font-bold">20</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span
                          className={`font-medium transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          Duration:
                        </span>
                        <span className="text-purple-600 font-bold">10 Minutes</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Practice Question Configuration */}
              <Card className="bg-purple-600">
                <CardContent className="p-6">
                  <h2 className="text-white text-xl font-semibold mb-6">Practice Question</h2>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Select
                      value={testConfig.department}
                      onValueChange={(value) => setTestConfig({ ...testConfig, department: value })}
                      defaultValue="csc"
                    >
                      <SelectTrigger className="bg-white text-gray-900">
                        <SelectValue placeholder="CSC" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="csc" className="text-gray-900 hover:bg-gray-100">
                          CSC
                        </SelectItem>
                        <SelectItem value="eng" className="text-gray-900 hover:bg-gray-100">
                          ENG
                        </SelectItem>
                        <SelectItem value="mat" className="text-gray-900 hover:bg-gray-100">
                          MAT
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={testConfig.level}
                      onValueChange={(value) => setTestConfig({ ...testConfig, level: value })}
                      defaultValue="300"
                    >
                      <SelectTrigger className="bg-white text-gray-900">
                        <SelectValue placeholder="300 LVL" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="100" className="text-gray-900 hover:bg-gray-100">
                          100 LVL
                        </SelectItem>
                        <SelectItem value="200" className="text-gray-900 hover:bg-gray-100">
                          200 LVL
                        </SelectItem>
                        <SelectItem value="300" className="text-gray-900 hover:bg-gray-100">
                          300 LVL
                        </SelectItem>
                        <SelectItem value="400" className="text-gray-900 hover:bg-gray-100">
                          400 LVL
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={testConfig.semester}
                      onValueChange={(value) => setTestConfig({ ...testConfig, semester: value })}
                      defaultValue="first"
                    >
                      <SelectTrigger className="bg-white text-gray-900">
                        <SelectValue placeholder="1st Semester" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="first" className="text-gray-900 hover:bg-gray-100">
                          1st Semester
                        </SelectItem>
                        <SelectItem value="second" className="text-gray-900 hover:bg-gray-100">
                          2nd Semester
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={testConfig.course}
                      onValueChange={(value) => setTestConfig({ ...testConfig, course: value })}
                      defaultValue="csc301"
                    >
                      <SelectTrigger className="bg-white text-gray-900">
                        <SelectValue placeholder="CSC 301" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200">
                        <SelectItem value="csc301" className="text-gray-900 hover:bg-gray-100">
                          CSC 301
                        </SelectItem>
                        <SelectItem value="csc302" className="text-gray-900 hover:bg-gray-100">
                          CSC 302
                        </SelectItem>
                        <SelectItem value="csc303" className="text-gray-900 hover:bg-gray-100">
                          CSC 303
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      onClick={startTest}
                      className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-2 font-semibold"
                    >
                      START TEST
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Result View
  if (currentView === "result") {
    const score = calculateScore()
    const percentage = Math.round((score / sampleQuestions.length) * 100)
    const timeTaken = 600 - timeLeft // Calculate time taken
    const minutesTaken = Math.floor(timeTaken / 60)
    const secondsTaken = timeTaken % 60

    // Generate question summary data
    const questionSummary = sampleQuestions.map((question, index) => ({
      questionNumber: index + 1,
      isCorrect: answers[index] === question.correctAnswer,
      userAnswer: answers[index] !== null ? String.fromCharCode(65 + answers[index]) : "Not Answered",
      correctAnswer: String.fromCharCode(65 + question.correctAnswer),
      status: answers[index] === question.correctAnswer ? "Correct" : "Incorrect",
    }))

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
              <Button variant="default" className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
                <BookOpen className="w-4 h-4 mr-3" />
                Practice Room
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
            <div className="flex items-center justify-center min-h-full p-6">
              <div className="w-full max-w-4xl space-y-6">
                {/* Practice Complete Card */}
                <Card
                  className={`w-full max-w-2xl mx-auto transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <h2
                        className={`text-2xl font-bold mb-2 transition-colors duration-200 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Practice Complete!
                      </h2>
                      <p className={`transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                        Great job on completing the practice session. Your progress has been saved!
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">{score}</div>
                        <div
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Correct
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-500">{sampleQuestions.length - score}</div>
                        <div
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Incorrect
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
                        <div
                          className={`text-sm transition-colors duration-200 ${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Score
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="outline"
                        onClick={resetTest}
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : ""
                        }`}
                      >
                        Practice Again
                      </Button>
                      <Button asChild className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Link href="/student/dashboard">Back to Dashboard</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Question Summary Card */}
                <Card
                  className={`w-full transition-colors duration-200 ${
                    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-6">
                    <h3
                      className={`text-xl font-semibold mb-4 transition-colors duration-200 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Question Summary
                    </h3>

                    {/* Table Header */}
                    <div className="bg-purple-600 text-white rounded-t-lg">
                      <div className="grid grid-cols-4 gap-4 p-4 text-sm font-medium">
                        <div>S/N</div>
                        <div>Status</div>
                        <div>Your Answer</div>
                        <div>Correct Answer</div>
                      </div>
                    </div>

                    {/* Table Body */}
                    <div
                      className={`border border-gray-200 rounded-b-lg transition-colors duration-200 ${
                        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
                      }`}
                    >
                      {questionSummary.slice(0, 5).map((item, index) => (
                        <div
                          key={item.questionNumber}
                          className={`grid grid-cols-4 gap-4 p-4 border-b text-sm transition-colors duration-200 ${
                            isDarkMode
                              ? index % 2 === 0
                                ? "bg-gray-750 border-gray-700"
                                : "bg-gray-800 border-gray-700"
                              : index % 2 === 0
                                ? "bg-gray-50 border-gray-100"
                                : "bg-white border-gray-100"
                          }`}
                        >
                          <div
                            className={`transition-colors duration-200 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {item.questionNumber}
                          </div>
                          <div className={`font-medium ${item.isCorrect ? "text-green-600" : "text-red-600"}`}>
                            {item.status}
                          </div>
                          <div
                            className={`transition-colors duration-200 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {item.userAnswer}
                          </div>
                          <div
                            className={`transition-colors duration-200 ${
                              isDarkMode ? "text-gray-300" : "text-gray-900"
                            }`}
                          >
                            {item.correctAnswer}
                          </div>
                        </div>
                      ))}

                      {/* See All Button */}
                      {questionSummary.length > 5 && (
                        <div className="p-4 text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`transition-colors duration-200 ${
                              isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : ""
                            }`}
                          >
                            See All <ChevronDown className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Test Interface View
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100

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
            <Button variant="default" className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
              <BookOpen className="w-4 h-4 mr-3" />
              Practice Room
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
            {/* Practice Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1
                    className={`text-2xl font-bold transition-colors duration-200 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Practice Mode
                  </h1>
                  <p className={`transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Computer Science - Past Questions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetTest}
                    className={`transition-colors duration-200 ${
                      isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : ""
                    }`}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Exit
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div
                  className={`flex justify-between text-sm mb-2 transition-colors duration-200 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <span>
                    Question {currentQuestion + 1} of {sampleQuestions.length}
                  </span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>

            {/* Question Card */}
            <Card
              className={`mb-6 transition-colors duration-200 ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle
                    className={`text-lg transition-colors duration-200 ${isDarkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Question {currentQuestion + 1}
                  </CardTitle>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {sampleQuestions[currentQuestion].subject}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      {sampleQuestions[currentQuestion].difficulty}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-lg mb-6 transition-colors duration-200 ${
                    isDarkMode ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  {sampleQuestions[currentQuestion].question}
                </p>

                <div className="space-y-3">
                  {sampleQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                        selectedAnswer === index
                          ? "border-purple-500 bg-purple-50"
                          : isDarkMode
                            ? "border-gray-600 hover:border-gray-500 bg-gray-700"
                            : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index ? "border-purple-500 bg-purple-500" : "border-gray-300"
                          }`}
                        >
                          {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <span
                          className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-900"}`}
                        >
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`transition-colors duration-200 ${
                  isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : ""
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {sampleQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestion(index)
                      setSelectedAnswer(answers[index])
                    }}
                    className={`w-8 h-8 rounded-full text-sm font-medium ${
                      index === currentQuestion
                        ? "bg-purple-600 text-white"
                        : answers[index] !== null
                          ? "bg-green-100 text-green-800"
                          : isDarkMode
                            ? "bg-gray-700 text-gray-300"
                            : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === sampleQuestions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={selectedAnswer === null}
                >
                  Submit Test
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
