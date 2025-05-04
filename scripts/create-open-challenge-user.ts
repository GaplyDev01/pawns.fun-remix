import { createClient } from "@supabase/supabase-js"

// This script must be run with the service role key
const supabaseAdmin = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

async function createOpenChallengeUser() {
  console.log("Creating open challenge user...")

  // First check if the user already exists
  const { data: existingUser } = await supabaseAdmin
    .from("profiles")
    .select("id, username")
    .eq("username", "open_challenge")
    .single()

  if (existingUser) {
    console.log("Open challenge user already exists:", existingUser)
    return existingUser.id
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
    throw authError
  }

  console.log("Created auth user:", authUser.user.id)

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
    throw profileError
  }

  console.log("Updated profile:", profile)
  return authUser.user.id
}

// Execute the function
createOpenChallengeUser()
  .then((id) => {
    console.log("Open challenge user created with ID:", id)
    process.exit(0)
  })
  .catch((error) => {
    console.error("Failed to create open challenge user:", error)
    process.exit(1)
  })
