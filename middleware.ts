import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { unauthorized } from "next/navigation";

export async function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const {isAuthenticated} = getKindeServerSession();
    const isUserAuthenticated = await isAuthenticated();

  // If User is not Authenticated, redirect to the login page
  if (!isUserAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // check if request url contains admin
  if (request.url.includes("/admin/")) {
    // Check if the user has admin privileges
    const role = request.cookies.get("userRole")?.value;
    if (role && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorised", request.url));
    }
  }

  // check if request url contains student
  if (request.url.includes("/student/")) {
    // Check if the user has student privileges
    const role = request.cookies.get("userRole")?.value;
    if (role && role !== "student") {
      return NextResponse.redirect(new URL("/unauthorised", request.url));
    }
  }
  // If the user is authenticated, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*",],
};
