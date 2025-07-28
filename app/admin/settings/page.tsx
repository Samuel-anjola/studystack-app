"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Save, Upload, Download, FileText, Camera, User } from "lucide-react"

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    adminEmail: "admin@studystack.com",
    maxFileSize: "10",
    allowedFileTypes: ".pdf,.doc,.docx",
    enableDownloads: true,
    enableUploads: true,
    showUploadStats: true,
    autoApproveUploads: false,
  })
  const [profileImage, setProfileImage] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("adminProfileImage") : null,
  )
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setProfileImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    // Save profile image to localStorage
    if (profileImage && typeof window !== "undefined") {
      localStorage.setItem("adminProfileImage", profileImage)
    }

    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully.",
    })

    // Trigger a custom event to update the header
    window.dispatchEvent(new CustomEvent("adminProfileUpdated"))
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("adminProfileImage")
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <p className="text-gray-600">Manage basic system settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) => setSettings((prev) => ({ ...prev, adminEmail: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Picture
                      </Button>
                      {profileImage && (
                        <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                          Remove Picture
                        </Button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Recommended: Square image, max 5MB</p>
                </div>
              </CardContent>
            </Card>

            {/* File Management */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  File Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    value={settings.maxFileSize}
                    onChange={(e) => setSettings((prev) => ({ ...prev, maxFileSize: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allowedFileTypes">Allowed File Types</Label>
                  <Input
                    id="allowedFileTypes"
                    value={settings.allowedFileTypes}
                    onChange={(e) => setSettings((prev) => ({ ...prev, allowedFileTypes: e.target.value }))}
                    placeholder=".pdf,.doc,.docx"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable File Uploads</Label>
                    <p className="text-sm text-gray-500">Allow users to upload files</p>
                  </div>
                  <Switch
                    checked={settings.enableUploads}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableUploads: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-approve Uploads</Label>
                    <p className="text-sm text-gray-500">Automatically approve new uploads</p>
                  </div>
                  <Switch
                    checked={settings.autoApproveUploads}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, autoApproveUploads: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Download Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Download Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Downloads</Label>
                    <p className="text-sm text-gray-500">Allow users to download files</p>
                  </div>
                  <Switch
                    checked={settings.enableDownloads}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, enableDownloads: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Show Upload Statistics</Label>
                    <p className="text-sm text-gray-500">Display download counts and stats</p>
                  </div>
                  <Switch
                    checked={settings.showUploadStats}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showUploadStats: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 px-8">
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
