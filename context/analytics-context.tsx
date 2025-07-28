"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface TimeSpentData {
  date: string
  minutes: number
}

interface StudySession {
  id: string
  type: "practice" | "revision"
  startTime: number
  endTime?: number
  duration?: number
  courseCode?: string
  questionsAnswered?: number
  score?: number
  completed: boolean
}

interface DownloadedCourse {
  id: string
  courseCode: string
  title: string
  downloadDate: number
  type: "question" | "note"
}

interface AnalyticsData {
  // Time tracking
  timeSpentData: TimeSpentData[]
  totalTimeSpent: number
  averageTimeSpent: number

  // Streak tracking
  currentStreak: number
  longestStreak: number
  lastActiveDate: string

  // Course tracking
  downloadedCourses: DownloadedCourse[]

  // Practice tracking
  completedPractices: StudySession[]
  totalQuestionsAnswered: number
  averageScore: number

  // Session tracking
  currentSession: StudySession | null
  dailyGoalMinutes: number
  dailyProgress: number
}

interface AnalyticsContextType {
  analytics: AnalyticsData

  // Time tracking methods
  startSession: (type: "practice" | "revision", courseCode?: string) => string
  endSession: (sessionId: string, questionsAnswered?: number, score?: number) => void
  updateSessionProgress: (sessionId: string, questionsAnswered: number) => void

  // Download tracking
  recordDownload: (courseCode: string, title: string, type: "question" | "note") => void

  // Settings
  setDailyGoal: (minutes: number) => void

  // Utility methods
  getWeeklyTimeData: () => TimeSpentData[]
  getTodayTimeSpent: () => number
  getStreakData: () => { current: number; longest: number; daysActive: boolean[] }
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    timeSpentData: [],
    totalTimeSpent: 0,
    averageTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: "",
    downloadedCourses: [],
    completedPractices: [],
    totalQuestionsAnswered: 0,
    averageScore: 0,
    currentSession: null,
    dailyGoalMinutes: 60, // Default 1 hour daily goal
    dailyProgress: 0,
  })

  // Load saved analytics data on mount
  useEffect(() => {
    const savedAnalytics = localStorage.getItem("studystack-analytics")
    if (savedAnalytics) {
      try {
        const parsedData = JSON.parse(savedAnalytics)
        setAnalytics((prev) => ({ ...prev, ...parsedData }))
      } catch (error) {
        console.error("Error loading analytics data:", error)
      }
    }
  }, [])

  // Save analytics data whenever it changes
  useEffect(() => {
    localStorage.setItem("studystack-analytics", JSON.stringify(analytics))
  }, [analytics])

  // Update time spent every minute when there's an active session
  useEffect(() => {
    if (!analytics.currentSession) return

    const interval = setInterval(() => {
      const now = Date.now()
      const sessionDuration = Math.floor((now - analytics.currentSession!.startTime) / (1000 * 60))

      updateTimeSpent(sessionDuration)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [analytics.currentSession])

  // Calculate streak on component mount and daily
  useEffect(() => {
    calculateStreak()
  }, [])

  const updateTimeSpent = useCallback((additionalMinutes: number) => {
    const today = new Date().toISOString().split("T")[0]

    setAnalytics((prev) => {
      const updatedTimeData = [...prev.timeSpentData]
      const todayIndex = updatedTimeData.findIndex((item) => item.date === today)

      if (todayIndex >= 0) {
        updatedTimeData[todayIndex].minutes += additionalMinutes
      } else {
        updatedTimeData.push({ date: today, minutes: additionalMinutes })
      }

      // Keep only last 30 days
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const filteredData = updatedTimeData.filter((item) => new Date(item.date) >= thirtyDaysAgo)

      const totalTime = filteredData.reduce((sum, item) => sum + item.minutes, 0)
      const averageTime = filteredData.length > 0 ? Math.round(totalTime / filteredData.length) : 0
      const todayTime = filteredData.find((item) => item.date === today)?.minutes || 0
      const dailyProgress = Math.min((todayTime / prev.dailyGoalMinutes) * 100, 100)

      return {
        ...prev,
        timeSpentData: filteredData,
        totalTimeSpent: totalTime,
        averageTimeSpent: averageTime,
        dailyProgress,
        lastActiveDate: today,
      }
    })
  }, [])

  const calculateStreak = useCallback(() => {
    const today = new Date()
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0

    // Check each day going backwards from today
    for (let i = 0; i < 365; i++) {
      // Check up to a year
      const checkDate = new Date(today)
      checkDate.setDate(checkDate.getDate() - i)
      const dateString = checkDate.toISOString().split("T")[0]

      const dayData = analytics.timeSpentData.find((item) => item.date === dateString)
      const hasActivity = dayData && dayData.minutes >= 10 // At least 10 minutes counts as active

      if (hasActivity) {
        tempStreak++
        if (i === 0 || currentStreak === i) {
          // Consecutive from today
          currentStreak = tempStreak
        }
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        if (i === 0) {
          // If today has no activity, check if yesterday does
          const yesterday = new Date(today)
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayString = yesterday.toISOString().split("T")[0]
          const yesterdayData = analytics.timeSpentData.find((item) => item.date === yesterdayString)

          if (yesterdayData && yesterdayData.minutes >= 10) {
            // Continue checking from yesterday
            continue
          }
        }
        tempStreak = 0
      }
    }

    setAnalytics((prev) => ({
      ...prev,
      currentStreak,
      longestStreak: Math.max(longestStreak, prev.longestStreak),
    }))
  }, [analytics.timeSpentData])

  const startSession = useCallback((type: "practice" | "revision", courseCode?: string): string => {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const session: StudySession = {
      id: sessionId,
      type,
      startTime: Date.now(),
      courseCode,
      questionsAnswered: 0,
      completed: false,
    }

    setAnalytics((prev) => ({
      ...prev,
      currentSession: session,
    }))

    return sessionId
  }, [])

  const endSession = useCallback(
    (sessionId: string, questionsAnswered?: number, score?: number) => {
      setAnalytics((prev) => {
        if (!prev.currentSession || prev.currentSession.id !== sessionId) {
          return prev
        }

        const endTime = Date.now()
        const duration = Math.floor((endTime - prev.currentSession.startTime) / (1000 * 60))

        const completedSession: StudySession = {
          ...prev.currentSession,
          endTime,
          duration,
          questionsAnswered: questionsAnswered || prev.currentSession.questionsAnswered || 0,
          score,
          completed: true,
        }

        // Update time spent
        updateTimeSpent(duration)

        // Calculate new averages
        const allPractices = [...prev.completedPractices, completedSession]
        const practicesSessions = allPractices.filter((s) => s.type === "practice" && s.completed)
        const totalQuestions = practicesSessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0)
        const scoresWithValues = practicesSessions.filter((s) => s.score !== undefined).map((s) => s.score!)
        const averageScore =
          scoresWithValues.length > 0
            ? Math.round(scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length)
            : 0

        return {
          ...prev,
          currentSession: null,
          completedPractices: allPractices,
          totalQuestionsAnswered: totalQuestions,
          averageScore,
        }
      })

      // Recalculate streak after session ends
      setTimeout(calculateStreak, 100)
    },
    [updateTimeSpent, calculateStreak],
  )

  const updateSessionProgress = useCallback((sessionId: string, questionsAnswered: number) => {
    setAnalytics((prev) => {
      if (!prev.currentSession || prev.currentSession.id !== sessionId) {
        return prev
      }

      return {
        ...prev,
        currentSession: {
          ...prev.currentSession,
          questionsAnswered,
        },
      }
    })
  }, [])

  const recordDownload = useCallback((courseCode: string, title: string, type: "question" | "note") => {
    const download: DownloadedCourse = {
      id: `download_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      courseCode,
      title,
      downloadDate: Date.now(),
      type,
    }

    setAnalytics((prev) => ({
      ...prev,
      downloadedCourses: [...prev.downloadedCourses, download],
    }))
  }, [])

  const setDailyGoal = useCallback((minutes: number) => {
    setAnalytics((prev) => {
      const todayTime = getTodayTimeSpent()
      const dailyProgress = Math.min((todayTime / minutes) * 100, 100)

      return {
        ...prev,
        dailyGoalMinutes: minutes,
        dailyProgress,
      }
    })
  }, [])

  const getWeeklyTimeData = useCallback((): TimeSpentData[] => {
    const weekData: TimeSpentData[] = []
    const today = new Date()

    // Get last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const existingData = analytics.timeSpentData.find((item) => item.date === dateString)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

      weekData.push({
        date: dayName,
        minutes: existingData?.minutes || 0,
      })
    }

    return weekData
  }, [analytics.timeSpentData])

  const getTodayTimeSpent = useCallback((): number => {
    const today = new Date().toISOString().split("T")[0]
    const todayData = analytics.timeSpentData.find((item) => item.date === today)
    return todayData?.minutes || 0
  }, [analytics.timeSpentData])

  const getStreakData = useCallback(() => {
    const daysActive: boolean[] = []
    const today = new Date()

    // Get last 7 days activity
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split("T")[0]

      const dayData = analytics.timeSpentData.find((item) => item.date === dateString)
      daysActive.push(dayData ? dayData.minutes >= 10 : false)
    }

    return {
      current: analytics.currentStreak,
      longest: analytics.longestStreak,
      daysActive,
    }
  }, [analytics.currentStreak, analytics.longestStreak, analytics.timeSpentData])

  return (
    <AnalyticsContext.Provider
      value={{
        analytics,
        startSession,
        endSession,
        updateSessionProgress,
        recordDownload,
        setDailyGoal,
        getWeeklyTimeData,
        getTodayTimeSpent,
        getStreakData,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider")
  }
  return context
}
