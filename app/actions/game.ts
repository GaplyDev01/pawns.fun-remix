"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"

type TimeControl = "1+0" | "3+2" | "5+5" | "10+0"
type ColorPreference = "white" | "black" | "random"
type OpponentType = "human" | "ai"

interface CreateGameParams {
  timeControl: TimeControl
  colorPreference: ColorPreference
  opponentType: OpponentType
}

// Helper to convert time control string to milliseconds
function timeControlToMs(timeControl: TimeControl): { initial: number; increment: number } {
  const [minutes, increment] = timeControl.split("+").map(Number)
  return {
    initial: minutes * 60 * 1000, // Convert minutes to milliseconds
    increment: (increment || 0) * 1000, // Convert seconds to milliseconds
  }
}

export async function createGame(params: CreateGameParams) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to create a game" }
  }

  const { timeControl, colorPreference, opponentType } = params
  const { initial: initialTimeMs, increment: incrementMs } = timeControlToMs(timeControl)

  try {
    if (opponentType === "human") {
      // Create a challenge for human opponent
      const challengeId = uuidv4()

      const { error } = await supabase.from("challenges").insert({
        id: challengeId,
        challenger_id: user.id,
        time_control: timeControl,
        color_preference: colorPreference,
        initial_time_ms: initialTimeMs,
        increment_ms: incrementMs,
        status: "pending",
      })

      if (error) {
        console.error("Error creating challenge:", error)
        return { error: "Failed to create challenge" }
      }

      revalidatePath("/dashboard/lobby")
      return { challengeId }
    } else {
      // Create a game with AI opponent
      const gameId = uuidv4()
      const adminClient = createAdminClient()

      // Determine player colors
      let whiteId = user.id
      let blackId = null

      if (colorPreference === "black") {
        whiteId = null
        blackId = user.id
      } else if (colorPreference === "random") {
        // Randomly assign color
        if (Math.random() > 0.5) {
          whiteId = null
          blackId = user.id
        }
      }

      // Create game entry
      const { error: gameError } = await adminClient.from("games").insert({
        id: gameId,
        white_id: whiteId,
        black_id: blackId,
        time_control: timeControl,
        fen_position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
        white_time_remaining: initialTimeMs,
        black_time_remaining: initialTimeMs,
        increment_ms: incrementMs,
        is_ai_game: true,
      })

      if (gameError) {
        console.error("Error creating game:", gameError)
        return { error: "Failed to create game" }
      }

      // Create AI game session
      const { error: aiSessionError } = await adminClient.from("ai_game_sessions").insert({
        game_id: gameId,
        user_id: user.id,
        ai_level: "intermediate", // Default AI level
        user_plays_as: whiteId ? "white" : "black",
      })

      if (aiSessionError) {
        console.error("Error creating AI session:", aiSessionError)
        return { error: "Failed to create AI game session" }
      }

      revalidatePath("/dashboard/lobby")
      return { gameId }
    }
  } catch (error) {
    console.error("Error in createGame:", error)
    return { error: "An unexpected error occurred" }
  }
}

export async function cancelChallenge(challengeId: string) {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You must be logged in to cancel a challenge" }
  }

  try {
    // Verify the user owns this challenge
    const { data: challenge } = await supabase.from("challenges").select("challenger_id").eq("id", challengeId).single()

    if (!challenge || challenge.challenger_id !== user.id) {
      return { error: "Challenge not found or you don't have permission to cancel it" }
    }

    // Update challenge status to cancelled
    const { error } = await supabase.from("challenges").update({ status: "cancelled" }).eq("id", challengeId)

    if (error) {
      console.error("Error cancelling challenge:", error)
      return { error: "Failed to cancel challenge" }
    }

    revalidatePath("/dashboard/lobby")
    return { success: true }
  } catch (error) {
    console.error("Error in cancelChallenge:", error)
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
    // Get the challenge details
    const { data: challenge, error: challengeError } = await supabase
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

    // Create a new game
    const gameId = uuidv4()

    // Determine player colors based on challenger's preference
    let whiteId = challenge.challenger_id
    let blackId = user.id

    if (challenge.color_preference === "black") {
      whiteId = user.id
      blackId = challenge.challenger_id
    } else if (challenge.color_preference === "random") {
      // Randomly assign colors
      if (Math.random() > 0.5) {
        whiteId = user.id
        blackId = challenge.challenger_id
      }
    }

    // Create game entry
    const { error: gameError } = await adminClient.from("games").insert({
      id: gameId,
      white_id: whiteId,
      black_id: blackId,
      time_control: challenge.time_control,
      fen_position: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", // Initial position
      white_time_remaining: challenge.initial_time_ms,
      black_time_remaining: challenge.initial_time_ms,
      increment_ms: challenge.increment_ms,
    })

    if (gameError) {
      console.error("Error creating game:", gameError)
      return { error: "Failed to create game" }
    }

    // Update challenge status to matched and link to game
    const { error: updateError } = await adminClient
      .from("challenges")
      .update({
        status: "matched",
        acceptor_id: user.id,
        game_id: gameId,
      })
      .eq("id", challengeId)

    if (updateError) {
      console.error("Error updating challenge:", updateError)
      return { error: "Failed to update challenge" }
    }

    revalidatePath("/dashboard/lobby")
    return { gameId }
  } catch (error) {
    console.error("Error in acceptChallenge:", error)
    return { error: "An unexpected error occurred" }
  }
}
