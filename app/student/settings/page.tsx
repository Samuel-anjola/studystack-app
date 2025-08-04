"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/student/ui/avatar"
import { Button } from "@/components/student/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/student/ui/card"
import { Input } from "@/components/student/ui/input"
import { Label } from "@/components/student/ui/label"
import { Switch } from "@/components/student/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/student/ui/select"
import { Separator } from "@/components/student/ui/separator"
import {
  Search,
  ChevronDown,
  BookOpen,
  Settings,
  User,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useUser } from "../../../context/user-context"
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

export default function SettingsPage() {
  const { userData, updateUserData, isDarkMode, setDarkMode } = useUser()

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
    const [userState, setUserData] = useState<any>(null);
      const { user } = useKindeAuth();

  const [localSettings, setLocalSettings] = useState({
    // Password Settings
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",

    // Study Preferences
    defaultPracticeTime: "10",
    autoSaveProgress: true,
  })

  const handleLocalSettingChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleUserDataChange = (key: keyof typeof userData, value: string) => {
    updateUserData({ [key]: value })
  }

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        updateUserData({ profilePicture: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log("Settings saved:", { userData, localSettings })
    alert("Settings saved successfully!")
  }

  const handleChangePassword = () => {
    if (!localSettings.currentPassword || !localSettings.newPassword || !localSettings.confirmPassword) {
      alert("Please fill in all password fields")
      return
    }

    if (localSettings.newPassword !== localSettings.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    if (localSettings.newPassword.length < 8) {
      alert("New password must be at least 8 characters long")
      return
    }

    // Change password logic here
    console.log("Password change requested")
    alert("Password changed successfully!")

    // Clear password fields
    setLocalSettings((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  const handleDeleteAccount = () => {
    // Delete account logic here
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      console.log("Account deletion requested")
    }
  }

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked)
  }

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

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`w-64 border-r min-h-screen transition-colors duration-200 ${
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
            <Button variant="default" className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white">
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1
                className={`text-3xl font-bold mb-2 transition-colors duration-200 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Settings
              </h1>
              <p className={`transition-colors duration-200 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Manage your account preferences and study settings
              </p>
            </div>

            <div className="space-y-6">
              {/* Profile Settings */}
              <Card
                className={`transition-colors duration-200 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={userData.profilePicture || "/placeholder.svg"} />
                        <AvatarFallback className={`text-lg ${isDarkMode ? "bg-gray-700 text-white" : ""}`}>
                          {getInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 transition-colors duration-200 ${
                          isDarkMode
                            ? "bg-gray-700 border-gray-600 hover:bg-gray-600 text-white"
                            : "bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-medium transition-colors duration-200 ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        Profile Picture
                      </h3>
                      <p
                        className={`text-sm mb-2 transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Upload a new profile picture
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white" : ""
                        }`}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>

                  <Separator className={isDarkMode ? "bg-gray-700" : ""} />
{/* Name Fields (Read-only) */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>
    <Label
      htmlFor="firstName"
      className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
    >
      First Name
    </Label>
    <Input
      id="firstName"
      value={user?.given_name || ""}
      disabled
      className={`cursor-not-allowed transition-colors duration-200 ${
        isDarkMode ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-gray-50"
      }`}
    />
  </div>
  <div>
    <Label
      htmlFor="lastName"
      className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
    >
      Last Name
    </Label>
    <Input
      id="lastName"
      value={user?.family_name || ""}
      disabled
      className={`cursor-not-allowed transition-colors duration-200 ${
        isDarkMode ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-gray-50"
      }`}
    />
  </div>
</div>

{/* Email (Read-only) */}
<div>
  <Label
    htmlFor="email"
    className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
  >
    Email Address
  </Label>
  <Input
    id="email"
    type="email"
    value={user?.email || ""}
    disabled
    className={`cursor-not-allowed transition-colors duration-200 ${
      isDarkMode ? "bg-gray-700 border-gray-600 text-gray-400" : "bg-gray-50"
    }`}
  />
  <p
    className={`text-xs mt-1 transition-colors duration-200 ${
      isDarkMode ? "text-gray-500" : "text-gray-500"
    }`}
  >
    Email address cannot be changed
  </p>
</div>
                  
                </CardContent>
              </Card>

              {/* Change Password */}
              <Card
                className={`transition-colors duration-200 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="currentPassword"
                      className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={localSettings.currentPassword}
                        onChange={(e) => handleLocalSettingChange("currentPassword", e.target.value)}
                        placeholder="Enter current password"
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                          isDarkMode ? "text-gray-400 hover:text-gray-300" : ""
                        }`}
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="newPassword"
                      className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={localSettings.newPassword}
                        onChange={(e) => handleLocalSettingChange("newPassword", e.target.value)}
                        placeholder="Enter new password (min. 8 characters)"
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                          isDarkMode ? "text-gray-400 hover:text-gray-300" : ""
                        }`}
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label
                      htmlFor="confirmPassword"
                      className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={localSettings.confirmPassword}
                        onChange={(e) => handleLocalSettingChange("confirmPassword", e.target.value)}
                        placeholder="Confirm new password"
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : ""
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent ${
                          isDarkMode ? "text-gray-400 hover:text-gray-300" : ""
                        }`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleChangePassword} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Study Preferences */}
              <Card
                className={`transition-colors duration-200 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <BookOpen className="w-5 h-5" />
                    Study Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="defaultPracticeTime"
                      className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                    >
                      Default Practice Time (minutes)
                    </Label>
                    <Select
                      value={localSettings.defaultPracticeTime}
                      onValueChange={(value) => handleLocalSettingChange("defaultPracticeTime", value)}
                    >
                      <SelectTrigger
                        className={`transition-colors duration-200 ${
                          isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                        }`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className={isDarkMode ? "bg-gray-700 border-gray-600" : ""}>
                        <SelectItem value="5" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          5 minutes
                        </SelectItem>
                        <SelectItem value="10" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          10 minutes
                        </SelectItem>
                        <SelectItem value="15" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          15 minutes
                        </SelectItem>
                        <SelectItem value="20" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          20 minutes
                        </SelectItem>
                        <SelectItem value="30" className={isDarkMode ? "text-white hover:bg-gray-600" : ""}>
                          30 minutes
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="autoSaveProgress"
                        className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Auto-save Progress
                      </Label>
                      <p
                        className={`text-sm transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Automatically save your study progress
                      </p>
                    </div>
                    <Switch
                      id="autoSaveProgress"
                      checked={localSettings.autoSaveProgress}
                      onCheckedChange={(checked) => handleLocalSettingChange("autoSaveProgress", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="darkMode"
                        className={`transition-colors duration-200 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        Dark Mode
                      </Label>
                      <p
                        className={`text-sm transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Use dark theme for the interface
                      </p>
                    </div>
                    <Switch id="darkMode" checked={isDarkMode} onCheckedChange={handleDarkModeToggle} />
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card
                className={`transition-colors duration-200 ${
                  isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}
              >
                <CardHeader>
                  <CardTitle
                    className={`flex items-center gap-2 transition-colors duration-200 ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <Trash2 className="w-5 h-5" />
                    Account Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-red-600">Delete Account</Label>
                      <p
                        className={`text-sm transition-colors duration-200 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Save Changes
                </Button>
              </div>
              {/* Logout Button */}
                          <div className="mt-8 flex justify-end">
                            <LogoutLink postLogoutRedirectURL="http://localhost:3000">
                              <button
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
                              >
                                Log Out
                              </button>
                            </LogoutLink>
                          </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
