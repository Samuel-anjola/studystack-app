"use client"

import { Button } from "@/components/student/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

const UnauthorisedPage = () => {
    // get the back url based on the user role
    const [backUrl, setBackUrl] = useState("/");

    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role) {
            if (role === "admin") {
                setBackUrl("/admin/course-note");
            } else if (role === "student") {
                setBackUrl("/student/dashboard");
            }
        }
    }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1>403 - Unauthorised</h1>
      <p className="mb-3">You do not have permission to access this page.</p>
      <Button>
      <Link href={backUrl}>
          Go back to the homepage
      </Link>
      </Button>
    </div>
  );
};

export default UnauthorisedPage;