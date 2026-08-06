import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Always land on the admin panel first
  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  // Client-side layout handles authentication via localStorage
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/admin/:path*"],
}

