"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const username = formData.get("username") as string

  if (!username || username.trim() === "") {
    return { error: "Username is required" }
  }

  const { error } = await supabase.from("profiles").update({ username }).eq("id", user.id)

  if (error) {
    if (error.code === "42501") {
      // Permission denied error code
      // Try with admin client if RLS is preventing update
      const adminClient = createAdminClient()
      const { error: adminError } = await adminClient.from("profiles").update({ username }).eq("id", user.id)

      if (adminError) {
        return { error: adminError.message }
      }
    } else {
      return { error: error.message }
    }
  }

  revalidatePath("/dashboard/profile")
  return { success: "Profile updated successfully" }
}

export async function updateAvatar(userId: string, avatarUrl: string) {
  const adminClient = createAdminClient()

  const { error } = await adminClient.from("profiles").update({ avatar_url: avatarUrl }).eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/profile")
  return { success: "Avatar updated successfully" }
}
