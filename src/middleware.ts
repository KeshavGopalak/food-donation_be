// src/middleware.ts

import { NextResponse, type NextRequest } from "next/server.js"


// Define which routes require authentication
const protectedRoutes = ['/dashboard', '/profile', '/settings']

export function middleware(request: NextRequest) {
  // Extract token from cookies (adjust the key name to match your auth provider)
  const token = request.cookies.get('session_token')?.value
  const { pathname } = request.nextUrl

  // Check if the current route is protected
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtected && !token) {
    // Redirect unauthenticated users to the login page
    const loginUrl = new URL('/login', request.url)
    // Optional: Pass the original path as a query param for post-login redirect
    loginUrl.searchParams.set('callbackUrl', pathname) 
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Optimize middleware execution by filtering out static assets

