import { LobbyTable } from "@/components/lobby/lobby-table"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"

export default async function LobbyPage() {
  const supabase = await createClient()

  // Fetch open games
  const { data: openGames } = await supabase
    .from("games")
    .select("*, white:white_id(*)")
    .is("black_id", null)
    .order("created_at", { ascending: false })

  // For each game, fetch the white player's latest rating
  const gamesWithRatings = await Promise.all(
    (openGames || []).map(async (game) => {
      const { data: latestRating } = await supabase
        .from("rating_history")
        .select("rating")
        .eq("user_id", game.white.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      return {
        ...game,
        white: {
          ...game.white,
          rating: latestRating?.rating || 1200,
        },
      }
    }),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Game Lobby</h1>
        <Button>Create Game</Button>
      </div>

      <LobbyTable games={gamesWithRatings || []} />
    </div>
  )
}
