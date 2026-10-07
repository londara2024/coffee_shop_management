import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { AUTH_COOKIE } from "@/lib/auth"

/** Gate the home page behind sign-in. No real backend yet — presence of the cookie is enough. */
export function middleware(request: NextRequest) {
  const signedIn = request.cookies.get(AUTH_COOKIE)?.value === "1"
  if (!signedIn) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/"],
}
