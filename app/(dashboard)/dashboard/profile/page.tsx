import { ProfilePage } from "@/components/profile/profile-page"
import { createSupabase } from "@/lib/supabase-client"

export default async function ProfileRoute() {
  const supabase = createSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch rating history
  const { data: ratingHistory } = await supabase
    .from("rating_history")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: true })

  return <ProfilePage profile={profile} ratingHistory={ratingHistory || []} />
}
