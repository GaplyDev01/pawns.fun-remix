import { LobbyTable } from "@/components/lobby/lobby-table"
import { createClient } from "@/lib/supabase/server"
import { ChallengesList } from "@/components/lobby/challenges-list"
import { CreateGameButton } from "@/components/game/create-game-button"

export default async function LobbyPage() {
  const supabase = await createClient()

  // Fetch open games
  const { data: openGames } = await supabase
    .from("games")
    .select("*, white:white_id(*)")
    .is("black_id", null)
    .is("is_ai_game", false)
    .order("created_at", { ascending: false })

  // Fetch active challenges
  const { data: challenges } = await supabase
    .from("challenges")
    .select("*, challenger:challenger_id(*)")
    .eq("status", "pending")
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
        <CreateGameButton />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Open Games</h2>
          <LobbyTable games={gamesWithRatings || []} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
          <ChallengesList challenges={challenges || []} />
        </div>
      </div>
    </div>
  )
}
