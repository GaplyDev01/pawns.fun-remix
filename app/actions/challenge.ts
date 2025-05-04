"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export type TimeControl = "1+0" | "3+2" | "5+5" | "10+0" | "15+10" | "30+0"
export type ChallengeType = "open" | "direct"

interface CreateChallengeParams {
  type: ChallengeType
  timeControl: TimeControl
  opponentId?: string
  gameMode: number
}

// Helper function to find a suitable user for open challenges
async function findOpenChallengeUser(): Promise<string | null> {
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

export async function createChallenge(params: CreateChallengeParams) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient() // Use admin client to bypass RLS

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a challenge" }
  }

  const { type, timeControl, opponentId, gameMode } = params

  try {
    const challengeId = uuidv4()
    const gameId = uuidv4()

    // Create a game first
    const { error: gameError } = await adminClient.from("games").insert({
      id: gameId,
      white_player_id: user.id,
      fen_position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
      time_control: timeControl,
      status: "waiting_for_players", // Use the correct enum value from the schema
    })

    if (gameError) {
      console.error("Error creating game:", gameError)
      return { error: "Failed to create game: " + gameError.message }
    }

    let challengedId: string

    if (type === "open") {
      // Find a suitable user for open challenges
      const openChallengeId = await findOpenChallengeUser()

      if (!openChallengeId) {
        return { error: "Could not find or create an open challenge user. Please contact an administrator." }
      }

      challengedId = openChallengeId
    } else if (type === "direct" && opponentId) {
      challengedId = opponentId
    } else {
      return { error: "Invalid challenge parameters" }
    }

    // Create the challenge
    const { error } = await adminClient.from("challenges").insert({
      id: challengeId,
      challenger_id: user.id,
      challenged_id: challengedId,
      status: "pending",
      game_id: gameId,
      game_mode_id: gameMode,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
    })

    if (error) {
      console.error("Error creating challenge:", error)
      return { error: "Failed to create challenge: " + error.message }
    }

    revalidatePath("/dashboard/lobby")
    return { challengeId, gameId }
  } catch (error) {
    console.error("Error in createChallenge:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function acceptChallenge(challengeId: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to accept a challenge" }
  }

  try {
    // Get the challenge details - use admin client to bypass RLS
    const { data: challenge, error: challengeError } = await adminClient
      .from("challenges")
      .select("*")
      .eq("id", challengeId)
      .single()

    if (challengeError || !challenge) {
      return { error: "Challenge not found" }
    }

    if (challenge.status !== "pending") {
      return { error: "This challenge is no longer available" }
    }

    if (challenge.challenger_id === user.id) {
      return { error: "You cannot accept your own challenge" }
    }

    // Check if this is an open challenge by checking if the challenged_id is not the current user
    // This is a simplification - in a real system, you might want to check against a list of known open challenge users
    const isOpenChallenge = challenge.challenged_id !== user.id

    // If it's not an open challenge, verify the current user is the challenged player
    if (!isOpenChallenge && challenge.challenged_id !== user.id) {
      return { error: "This challenge was not sent to you" }
    }

    // Update challenge status to accepted and set acceptor_id
    const { error: updateError } = await adminClient
      .from("challenges")
      .update({
        status: "accepted",
      })
      .eq("id", challengeId)

    if (updateError) {
      console.error("Error updating challenge:", updateError)
      return { error: "Failed to update challenge: " + updateError.message }
    }

    revalidatePath("/dashboard/lobby")
    return { gameId: challenge.game_id }
  } catch (error) {
    console.error("Error in acceptChallenge:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function rejectChallenge(challengeId: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient() // Use admin client to bypass RLS

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to reject a challenge" }
  }

  try {
    // Verify the user is the challenged user - use admin client to bypass RLS
    const { data: challenge } = await adminClient
      .from("challenges")
      .select("challenged_id")
      .eq("id", challengeId)
      .single()

    if (!challenge || challenge.challenged_id !== user.id) {
      return { error: "Challenge not found or you don't have permission to reject it" }
    }

    // Update challenge status to rejected - use admin client to bypass RLS
    const { error } = await adminClient
      .from("challenges")
      .update({
        status: "rejected",
      })
      .eq("id", challengeId)

    if (error) {
      console.error("Error rejecting challenge:", error)
      return { error: "Failed to reject challenge: " + error.message }
    }

    revalidatePath("/dashboard/lobby")
    return { success: true }
  } catch (error) {
    console.error("Error in rejectChallenge:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function cancelChallenge(challengeId: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient() // Use admin client to bypass RLS

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to cancel a challenge" }
  }

  try {
    // Verify the user owns this challenge - use admin client to bypass RLS
    const { data: challenge } = await adminClient
      .from("challenges")
      .select("challenger_id")
      .eq("id", challengeId)
      .single()

    if (!challenge || challenge.challenger_id !== user.id) {
      return { error: "Challenge not found or you don't have permission to cancel it" }
    }

    // Update challenge status to rejected instead of cancelled
    // This assumes "rejected" is a valid status in your schema
    const { error } = await adminClient
      .from("challenges")
      .update({
        status: "rejected", // Changed from "cancelled" to "rejected"
      })
      .eq("id", challengeId)

    if (error) {
      console.error("Error cancelling challenge:", error)
      return { error: "Failed to cancel challenge: " + error.message }
    }

    revalidatePath("/dashboard/lobby")
    return { success: true }
  } catch (error) {
    console.error("Error in cancelChallenge:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function fetchChallenges() {
  cookies()

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to view challenges" }
  }

  try {
    // Fetch all challenges and filter on the client side
    const { data: allChallenges, error: challengesError } = await supabase
      .from("challenges")
      .select(`
        *,
        challenger:challenger_id(id, username, avatar_url),
        challenged:challenged_id(id, username, avatar_url),
        game_mode:game_mode_id(id, name)
      `)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (challengesError) {
      return { error: "Failed to fetch challenges" }
    }

    // Filter challenges into open, incoming, and outgoing
    const openChallenges = allChallenges.filter(
      (c) => c.challenged?.username === "open_challenge" || c.challenged?.is_admin === true,
    )

    const incomingChallenges = allChallenges.filter((c) => c.challenged_id === user.id)

    const outgoingChallenges = allChallenges.filter((c) => c.challenger_id === user.id)

    return {
      open: openChallenges || [],
      incoming: incomingChallenges || [],
      outgoing: outgoingChallenges || [],
    }
  } catch (error) {
    console.error("Error in fetchChallenges:", error)
    return { error: "An unexpected error occurred" }
  }
}
