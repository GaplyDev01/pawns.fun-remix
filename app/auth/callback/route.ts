import { createClient } from "@/lib/supabase/server"
import { ensureProfileExists } from "@/lib/ensure-profile"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Now the user exists in auth.users table, ensure they have a profile
      await ensureProfileExists(data.session.user).catch((err) => {
        console.error("Error ensuring profile exists:", err)
      })
    }
  }

  // Redirect to dashboard or home page
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
}
