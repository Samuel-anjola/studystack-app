"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Shield, Mail, User } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function AdminSignupPage() {
  const [adminCode, setAdminCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminCode.trim() || !name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    if (adminCode !== "ADMIN2024") {
      toast({
        title: "Error",
        description: "Invalid admin verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      localStorage.setItem("userRole", "admin");
      login("admin");
      // Redirects with Kinde auth
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while saving user.",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section (same as before) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-purple-600 to-purple-800 flex-col items-center justify-center text-white p-10 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg mb-8">Jump back into your admin dashboard.</p>
          <Button
            asChild
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white hover:text-purple-700"
          >
            <Link href="/login/admin">Sign In</Link>
          </Button>
        </div>
      </div>

      {/* Right Section: Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold">StudyStack</span>
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-purple-600 mb-6">
            Create Admin Account
          </h2>

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Admin Code */}
            <div className="space-y-2">
              <Label htmlFor="adminCode">Admin Verification Code</Label>
              <div className="relative">
                <Input
                  id="adminCode"
                  type="password"
                  placeholder="Enter admin verification code"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                  className="pl-10"
                  required
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 mt-6"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Continue with Kinde Auth"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/login/admin"
              className="text-purple-600 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
