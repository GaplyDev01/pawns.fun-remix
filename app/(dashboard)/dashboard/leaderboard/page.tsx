import { LeaderboardTable } from "@/components/leaderboard/leaderboard-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/server"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Get the latest rating for each user by joining profiles with rating_history
  const { data: globalLeaderboard } = await supabase
    .from("profiles")
    .select(`
      id,
      username,
      avatar_url,
      latest_rating:rating_history(rating)
    `)
    .order("latest_rating.rating", { ascending: false })
    .limit(100)

  // Transform the data to match the expected format
  const formattedLeaderboard =
    globalLeaderboard?.map((player) => ({
      id: player.id,
      username: player.username || "Anonymous",
      avatar_url: player.avatar_url,
      // Get the rating from the first entry in the latest_rating array or default to 1200
      rating: player.latest_rating?.[0]?.rating || 1200,
    })) || []

  // For friends leaderboard, we'd do something similar but with a filter
  // This is just a placeholder
  const formattedFriendsLeaderboard = formattedLeaderboard.slice(0, 10)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Leaderboard</h1>

      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
        </TabsList>
        <TabsContent value="global">
          <LeaderboardTable players={formattedLeaderboard} />
        </TabsContent>
        <TabsContent value="friends">
          <LeaderboardTable players={formattedFriendsLeaderboard} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
