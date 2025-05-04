import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { ensureProfileExists } from "@/lib/ensure-profile"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is authenticated, ensure they have a profile
  if (user) {
    try {
      // We don't await this because we don't want to block the request
      // It's okay if the profile is created after the current request
      ensureProfileExists(user).catch((err) => {
        // Just log the error, but don't block the request
        console.error("Error ensuring profile exists in middleware:", err)
      })
    } catch (error) {
      // Just log the error, but don't block the request
      console.error("Unexpected error in middleware profile check:", error)
    }

    // Check if there's a returnUrl in the query params after login
    const url = request.nextUrl.clone()
    const returnUrl = url.searchParams.get("returnUrl")

    if (returnUrl && (url.pathname === "/login" || url.pathname === "/signup")) {
      url.pathname = returnUrl
      url.searchParams.delete("returnUrl")
      return NextResponse.redirect(url)
    }
  }

  // If the user is not logged in and trying to access a protected route, redirect to login
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/signup") &&
    !request.nextUrl.pathname.startsWith("/auth") &&
    request.nextUrl.pathname !== "/"
  ) {
    const url = request.nextUrl.clone()

    // If trying to access a join link, save the return URL
    if (request.nextUrl.pathname.startsWith("/join/")) {
      url.pathname = "/login"
      url.searchParams.set("returnUrl", request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
