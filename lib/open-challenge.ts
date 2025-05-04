import { createAdminClient } from "@/lib/supabase/admin"

// Helper function to find a suitable user for open challenges
export async function findOpenChallengeUser(): Promise<string | null> {
  const adminClient = createAdminClient()

  try {
    // First, try to find a user with username 'open_challenge'
    const { data: openChallengeUser } = await adminClient
      .from("profiles")
      .select("id")
      .eq("username", "open_challenge")
      .single()

    if (openChallengeUser) {
      return openChallengeUser.id
    }

    // If not found, look for any admin user that could serve as the open challenge recipient
    const { data: adminUser } = await adminClient.from("profiles").select("id").eq("is_admin", true).limit(1).single()

    if (adminUser) {
      return adminUser.id
    }

    // As a last resort, get the first user in the system
    const { data: anyUser } = await adminClient
      .from("profiles")
      .select("id")
      .neq("id", "00000000-0000-0000-0000-000000000000") // Avoid system users
      .limit(1)
      .single()

    if (anyUser) {
      return anyUser.id
    }

    return null
  } catch (error) {
    console.error("Error finding open challenge user:", error)
    return null
  }
}

// Check if a challenge is an open challenge
export async function isOpenChallenge(challengeId: string): Promise<boolean> {
  const adminClient = createAdminClient()

  try {
    // Get the challenge
    const { data: challenge } = await adminClient
      .from("challenges")
      .select("challenged_id")
      .eq("id", challengeId)
      .single()

    if (!challenge) {
      return false
    }

    // Get the challenged user
    const { data: challengedUser } = await adminClient
      .from("profiles")
      .select("username, is_admin")
      .eq("id", challenge.challenged_id)
      .single()

    // It's an open challenge if the challenged user is the open_challenge user or an admin
    return challengedUser?.username === "open_challenge" || challengedUser?.is_admin === true
  } catch (error) {
    console.error("Error checking if challenge is open:", error)
    return false
  }
}
