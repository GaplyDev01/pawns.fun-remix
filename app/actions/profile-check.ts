"use server"

import { createClient } from "@/lib/supabase/server"
import { ensureProfileExists } from "@/lib/ensure-profile"
import { cookies } from "next/headers"

export async function checkAndCreateProfile() {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return { error: "Not authenticated" }
  }

  try {
    const success = await ensureProfileExists(data.user)
    return { success }
  } catch (error) {
    console.error("Error in checkAndCreateProfile:", error)
    return { error: "Failed to check or create profile" }
  }
}
