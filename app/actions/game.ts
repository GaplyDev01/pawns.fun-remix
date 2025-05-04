"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

type TimeControl = "1+0" | "3+2" | "5+5" | "10+0"
type OpponentType = "human" | "ai"

interface CreateGameParams {
  timeControl: TimeControl
  opponentType: OpponentType
}

// Helper to convert time control string to milliseconds
async function timeControlToMs(timeControl: TimeControl): Promise<{ initial: number; increment: number }> {
  const [minutes, increment] = timeControl.split("+").map(Number)
  return {
    initial: minutes * 60 * 1000, // Convert minutes to milliseconds
    increment: (increment || 0) * 1000, // Convert seconds to milliseconds
  }
}

// Helper function to ensure the user's profile exists
async function ensureProfileExists(user: any): Promise<boolean> {
  const adminClient = createAdminClient()

  try {
    // Check if the user's profile exists in the profiles table
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

    // If profile doesn't exist, create it
    const { error: createProfileError } = await adminClient.from("profiles").insert({
      id: user.id,
      username: user.email?.split("@")[0] || "Player",
      updated_at: new Date().toISOString(),
    })

    if (createProfileError) {
      // If another request created the profile in the meantime, that's fine
      if (createProfileError.code === "23505") {
        // PostgreSQL duplicate key error
        console.log("Profile was created by another request")
        return true
      }
      console.error("Error creating profile:", createProfileError)
      return false
    }

    // Also create initial rating history entry
    const { error: ratingError } = await adminClient.from("rating_history").insert({
      user_id: user.id,
      rating: 1200, // Default starting rating
    })

    if (ratingError) {
      console.error("Error creating rating history:", ratingError)
      // Continue anyway as this is not critical
    }

    return true
  } catch (error) {
    console.error("Unexpected error in ensureProfileExists:", error)
    return false
  }
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

export async function createGame(params: CreateGameParams) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient() // Use admin client to bypass RLS

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a game" }
  }

  // Ensure the user's profile exists before proceeding
  const profileExists = await ensureProfileExists(user)
  if (!profileExists) {
    return { error: "Failed to ensure user profile exists. Please try again." }
  }

  const { timeControl, opponentType } = params
  const { initial: initialTimeMs, increment: incrementMs } = await timeControlToMs(timeControl)

  try {
    if (opponentType === "human") {
      // Create a challenge for human opponent
      const challengeId = uuidv4()
      const gameId = uuidv4() // Pre-generate game ID for the challenge

      // Create a game first
      const { error: gameError } = await adminClient.from("games").insert({
        id: gameId,
        white_id: user.id,
        fen_position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
        status: "waiting_for_players", // Use the correct enum value from the schema
        white_time_remaining: initialTimeMs,
        black_time_remaining: initialTimeMs,
      })

      if (gameError) {
        console.error("Error creating game:", gameError)
        return { error: "Failed to create game: " + gameError.message }
      }

      // Find a suitable user for open challenges
      const openChallengeId = await findOpenChallengeUser()

      if (!openChallengeId) {
        return { error: "Could not find or create an open challenge user. Please contact an administrator." }
      }

      // Create the challenge with the open challenge user as the challenged_id
      const { error } = await adminClient.from("challenges").insert({
        id: challengeId,
        challenger_id: user.id,
        challenged_id: openChallengeId, // Use the open challenge user ID
        status: "pending",
        game_id: gameId,
        game_mode_id: 1, // Default game mode ID
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
      })

      if (error) {
        console.error("Error creating challenge:", error)
        return { error: "Failed to create challenge: " + error.message }
      }

      revalidatePath("/dashboard/lobby")
      return { challengeId, gameId }
    } else {
      // Create a game with AI opponent
      const gameId = uuidv4()

      // For AI games, randomly assign color
      const userPlaysWhite = Math.random() >= 0.5

      // Create game entry
      const { error: gameError } = await adminClient.from("games").insert({
        id: gameId,
        white_id: userPlaysWhite ? user.id : null,
        black_id: userPlaysWhite ? null : user.id,
        fen_position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
        white_time_remaining: initialTimeMs,
        black_time_remaining: initialTimeMs,
        status: "in_progress", // Use the correct enum value from the schema
      })

      if (gameError) {
        console.error("Error creating game:", gameError)
        return { error: "Failed to create game: " + gameError.message }
      }

      // Create AI game session
      const aiSessionId = uuidv4()
      const { error: aiSessionError } = await adminClient.from("ai_game_sessions").insert({
        id: aiSessionId,
        game_id: gameId,
        user_id: user.id,
        ai_level: "medium", // Default AI level
        user_plays_as: userPlaysWhite ? "white" : "black",
      })

      if (aiSessionError) {
        console.error("Error creating AI session:", aiSessionError)
        return { error: "Failed to create AI game session: " + aiSessionError.message }
      }

      revalidatePath("/dashboard/lobby")
      return { gameId }
    }
  } catch (error) {
    console.error("Error in createGame:", error)
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

  // Ensure the user's profile exists before proceeding
  const profileExists = await ensureProfileExists(user)
  if (!profileExists) {
    return { error: "Failed to ensure user profile exists. Please try again." }
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

    // Use the pre-assigned game ID
    const gameId = challenge.game_id

    // Randomly assign colors
    const challengerPlaysWhite = Math.random() >= 0.5
    const whiteId = challengerPlaysWhite ? challenge.challenger_id : user.id
    const blackId = challengerPlaysWhite ? user.id : challenge.challenger_id

    // Update the game with player information
    const { error: updateGameError } = await adminClient
      .from("games")
      .update({
        white_id: whiteId,
        black_id: blackId,
        status: "in_progress", // Use the correct enum value from the schema
      })
      .eq("id", gameId)

    if (updateGameError) {
      console.error("Error updating game:", updateGameError)
      return { error: "Failed to update game: " + updateGameError.message }
    }

    // Update challenge status to matched and link to game
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
    return { gameId }
  } catch (error) {
    console.error("Error in acceptChallenge:", error)
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

// Function to create a direct challenge to a specific player
export async function createDirectChallenge(opponentId: string, timeControl: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a challenge" }
  }

  try {
    const challengeId = uuidv4()
    const gameId = uuidv4() // Pre-generate game ID

    // Create a game first
    const { error: gameError } = await adminClient.from("games").insert({
      id: gameId,
      white_id: user.id,
      fen_position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
      status: "waiting_for_players", // Use the correct enum value from the schema
    })

    if (gameError) {
      console.error("Error creating game:", gameError)
      return { error: "Failed to create game: " + gameError.message }
    }

    // Create a direct challenge to a specific player
    const { error } = await adminClient.from("challenges").insert({
      id: challengeId,
      challenger_id: user.id,
      challenged_id: opponentId, // Direct challenge to a specific player
      status: "pending",
      game_id: gameId, // Pre-assign game ID
      game_mode_id: 1, // Default game mode ID
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
    })

    if (error) {
      console.error("Error creating direct challenge:", error)
      return { error: "Failed to create challenge: " + error.message }
    }

    return { challengeId, gameId }
  } catch (error) {
    console.error("Error in createDirectChallenge:", error)
    return { error: "An unexpected error occurred" }
  }
}

// Function to generate a shareable link for a challenge
export async function generateChallengeLink(challengeId: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/challenge/${challengeId}`
}

// Function to generate an invitation link for a challenge
export async function generateInviteLink(challengeId: string): Promise<string> {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  return `${baseUrl}/join/${challengeId}`
}

// Function to create a spectator session for a game
export async function createSpectatorSession(gameId: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const adminClient = createAdminClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to spectate a game" }
  }

  try {
    const spectatorId = uuidv4()

    // Create a spectator entry
    const { error } = await adminClient.from("game_spectators").insert({
      id: spectatorId,
      game_id: gameId,
      user_id: user.id,
      joined_at: new Date().toISOString(),
    })

    if (error) {
      // If the table doesn't exist, we'll just ignore the error
      console.log("Note: Spectator table might not exist:", error.message)
      // Continue anyway since spectating can work without a database entry
    }

    return { success: true, gameId }
  } catch (error) {
    console.error("Error in createSpectatorSession:", error)
    // Don't return an error as spectating should still work
    return { success: true, gameId }
  }
}
