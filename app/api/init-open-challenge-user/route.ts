import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// This endpoint should be protected and only accessible by admins
export async function POST() {
  try {
    // Create a Supabase client with the service role key
    const supabaseAdmin = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // First check if the user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id, username")
      .eq("username", "open_challenge")
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: true,
        message: "Open challenge user already exists",
        id: existingUser.id,
      })
    }

    // Create the auth user first
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: "open_challenge@pawns.fun",
      password: crypto.randomUUID(), // Random secure password
      email_confirm: true,
      user_metadata: {
        is_system_user: true,
        display_name: "Open Challenge",
      },
    })

    if (authError) {
      console.error("Error creating auth user:", authError)
      return NextResponse.json({ success: false, error: authError.message }, { status: 500 })
    }

    // The profile should be created automatically via trigger,
    // but let's update it with our specific values
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        username: "open_challenge",
        display_name: "Open Challenge",
        elo_rating: 1200,
        is_admin: false,
        is_banned: false,
      })
      .eq("id", authUser.user.id)
      .select()
      .single()

    if (profileError) {
      console.error("Error updating profile:", profileError)
      return NextResponse.json({ success: false, error: profileError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Open challenge user created successfully",
      id: authUser.user.id,
    })
  } catch (error) {
    console.error("Error creating open challenge user:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
