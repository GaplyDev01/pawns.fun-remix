import { ProfilePage } from "@/components/profile/profile-page"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfileRoute() {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!data.session) {
    redirect("/login")
  }

  const user = data.session.user

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch rating history
  const { data: ratingHistory } = await supabase
    .from("rating_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true })

  return <ProfilePage profile={profile} ratingHistory={ratingHistory || []} />
}
