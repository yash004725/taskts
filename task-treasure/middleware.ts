import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only run middleware on admin routes except the login page
  if (pathname.startsWith("/admin") && pathname !== "/admin") {
    // Check if the user is authenticated
    const sessionCookie = request.cookies.get("admin_session")

    if (!sessionCookie) {
      // Redirect to login page if not authenticated
      return NextResponse.redirect(new URL("/admin", request.url))
    }

    try {
      const session = JSON.parse(sessionCookie.value)

      if (!session || !session.authenticated) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL("/admin", request.url))
      }
    } catch (error) {
      // Redirect to login page if session is invalid
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

