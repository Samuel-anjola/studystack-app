"use client"

import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestAuthPage() {
  const { user, isLoading, login, logout, isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Kinde Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm">
              Connected to: <code className="bg-white px-1 rounded">studystack.kinde.com</code>
            </span>
          </div>

          {/* Authentication Status */}
          <div className="space-y-2">
            <h3 className="font-semibold">Authentication Status:</h3>
            {isLoading ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Authenticated</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>Not authenticated</span>
              </div>
            )}
          </div>

          {/* User Information */}
          {user && (
            <div className="space-y-2 p-3 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800">User Information:</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Name:</strong> {user.name}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                {user.matricNumber && (
                  <p>
                    <strong>Matric:</strong> {user.matricNumber}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {!isAuthenticated ? (
              <div className="space-y-2">
                <Button
                  onClick={() => login("student")}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  Test Student Login
                </Button>
                <Button
                  onClick={() => login("admin")}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={isLoading}
                >
                  Test Admin Login
                </Button>
              </div>
            ) : (
              <Button onClick={logout} variant="outline" className="w-full bg-transparent" disabled={isLoading}>
                Logout
              </Button>
            )}
          </div>

          {/* Configuration Info */}
          <div className="text-xs text-gray-500 space-y-1 p-3 bg-gray-50 rounded-lg">
            <p>
              <strong>Client ID:</strong> 081d6e68...fe82
            </p>
            <p>
              <strong>Domain:</strong> studystack.kinde.com
            </p>
            <p>
              <strong>Callback:</strong> /auth/callback
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
