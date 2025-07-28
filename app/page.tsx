"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="flex flex-col items-center justify-center w-full p-8">
        <div className="text-center max-w-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-600">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <span className="text-4xl font-bold ml-4">StudyStack</span>
          </div>

          {/* Welcome Message */}
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-purple-600">StudyStack</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Your comprehensive platform for academic resources, course materials, and exam preparation.
          </p>

          {/* Login Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Student Login */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Student Portal</h3>
              <p className="text-gray-600 mb-6">
                Access course materials, practice questions, and past exam papers to excel in your studies.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/login/student">Student Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/signup/student">Create Student Account</Link>
                </Button>
              </div>
            </div>

            {/* Admin Login */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Admin Portal</h3>
              <p className="text-gray-600 mb-6">
                Manage course content, upload materials, and oversee the platform's academic resources.
              </p>
              <div className="space-y-3">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href="/login/admin">Admin Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/signup/admin">Create Admin Account</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Course Materials</h4>
              <p className="text-gray-600 text-sm">Access comprehensive lecture notes and study materials</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Practice Questions</h4>
              <p className="text-gray-600 text-sm">Test your knowledge with curated practice questions</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Past Questions</h4>
              <p className="text-gray-600 text-sm">Prepare with previous exam questions and solutions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
