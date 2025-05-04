import { createAdminClient } from "@/lib/supabase/admin"
import type { User } from "@supabase/supabase-js"

/**
 * Ensures that a profile exists for the given user.
 * If no profile exists, creates one with default values.
 */
export async function ensureProfileExists(user: User): Promise<boolean> {
  if (!user) return false

  const adminClient = createAdminClient()

  try {
    // Check if profile exists
    const { data: existingProfile, error: profileError } = await adminClient
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("Error checking profile:", profileError)
      return false
    }

    // If profile already exists, we're done
    if (existingProfile) {
      return true
    }

    // Extract username from user metadata or email
    const username = user.user_metadata?.username || user.email?.split("@")[0] || "Player"

    // Try to create the profile, but handle the case where it might have been created
    // by another concurrent request
    const { error: createProfileError } = await adminClient.from("profiles").insert({
      id: user.id,
      username,
      avatar_url: user.user_metadata?.avatar_url,
      updated_at: new Date().toISOString(),
    })

    // If we get a duplicate key error, the profile was created by another request
    // This is fine, so we can continue
    if (createProfileError) {
      if (createProfileError.code === "23505") {
        // PostgreSQL duplicate key error code
        console.log(`Profile for user ${user.id} was created by another request`)
        return true
      }
      console.error("Error creating profile:", createProfileError)
      return false
    }

    // Try to create initial rating history entry
    try {
      await adminClient.from("rating_history").insert({
        user_id: user.id,
        rating: 1200, // Default starting rating
      })
    } catch (ratingError) {
      console.error("Error creating rating history:", ratingError)
      // Continue anyway as this is not critical
    }

    console.log(`Created profile for user ${user.id} (${username})`)
    return true
  } catch (error) {
    console.error("Unexpected error in ensureProfileExists:", error)
    return false
  }
}
