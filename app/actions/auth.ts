"use server"

import { cookies } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { rateLimit } from "@/lib/rate-limit"

interface AuthState {
  error: string
  success: string
}

// Update the signIn function to handle returnUrl
export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState | { redirect: string }> {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const returnUrl = formData.get("returnUrl") as string | null

  if (!email || !password) {
    return { error: "Email and password are required", success: "" }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message, success: "" }
  }

  // If returnUrl is provided, redirect there
  if (returnUrl) {
    return { redirect: returnUrl }
  }

  // Otherwise redirect to dashboard
  return { redirect: "/dashboard" }
}

export async function signUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
  // Call cookies() to opt out of Next.js cache
  cookies()

  // Rate limiting
  try {
    await rateLimit.check(5, "SIGNUP_RATE_LIMIT")
  } catch {
    return { error: "Too many signup attempts. Please try again later.", success: "" }
  }

  const supabase = await createClient()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string

  if (!email || !password || !username) {
    return { error: "All fields are required", success: "" }
  }

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message, success: "" }
  }

  // If email confirmation is disabled, create profile immediately
  if (data.session) {
    const adminClient = createAdminClient()

    // Create profile
    const { error: profileError } = await adminClient.from("profiles").insert({
      id: data.user.id,
      username,
    })

    if (profileError) {
      return { error: profileError.message, success: "" }
    }

    // Create initial rating history entry
    const { error: ratingError } = await adminClient.from("rating_history").insert({
      user_id: data.user.id,
      rating: 1200, // Default starting rating
    })

    if (ratingError) {
      return { error: ratingError.message, success: "" }
    }

    redirect("/dashboard")
  }

  return {
    error: "",
    success: "Check your email to confirm your account",
  }
}

export async function resetPassword(prevState: AuthState, formData: FormData): Promise<AuthState> {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required", success: "" }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message, success: "" }
  }

  return {
    error: "",
    success: "Check your email for the password reset link",
  }
}

export async function signOut(): Promise<void> {
  // Call cookies() to opt out of Next.js cache
  cookies()

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}
