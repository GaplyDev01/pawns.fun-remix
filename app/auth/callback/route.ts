import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.session) {
      // Now the user exists in auth.users table, so we can create their profile
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.session.user.id)
        .single()

      // Only create profile if it doesn't exist
      if (!existingProfile) {
        const adminClient = createAdminClient()

        // Get username from user metadata or use email as fallback
        const username = data.session.user.user_metadata.username || data.session.user.email?.split("@")[0] || "user"

        // Create profile
        await adminClient.from("profiles").insert({
          id: data.session.user.id,
          username,
          avatar_url: data.session.user.user_metadata.avatar_url,
        })

        // Create initial rating history entry
        await adminClient.from("rating_history").insert({
          user_id: data.session.user.id,
          rating: 1200, // Default starting rating
        })
      }
    }
  }

  // Redirect to dashboard or home page
  return NextResponse.redirect(new URL("/dashboard", requestUrl.origin))
}
