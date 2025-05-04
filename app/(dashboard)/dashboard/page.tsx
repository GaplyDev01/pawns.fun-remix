import { EloStatCard } from "@/components/dashboard/elo-stat-card"
import { WinRateRing } from "@/components/dashboard/win-rate-ring"
import { RecentGamesList } from "@/components/dashboard/recent-games-list"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!data.session) {
    redirect("/login")
  }

  const user = data.session.user

  // Fetch user stats
  const { data: userStats } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch most recent rating from rating_history
  const { data: latestRating } = await supabase
    .from("rating_history")
    .select("rating")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Default rating if none exists
  const userRating = latestRating?.rating || 1200

  // Fetch recent games
  const { data: recentGames } = await supabase
    .from("games")
    .select("*, white:white_id(*), black:black_id(*)")
    .or(`white_id.eq.${user.id},black_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EloStatCard rating={userRating} />
        <WinRateRing winRate={65} /> {/* Example value */}
        <div className="col-span-full lg:col-span-1">
          <RecentGamesList games={recentGames || []} />
        </div>
      </div>
    </div>
  )
}
