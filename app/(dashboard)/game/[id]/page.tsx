import { GameBoardPage } from "@/components/game/game-board-page"
import { createSupabase } from "@/lib/supabase-client"
import { notFound } from "next/navigation"

export default async function GamePage({ params }: { params: { id: string } }) {
  const supabase = createSupabase()

  // Fetch game data
  const { data: game } = await supabase
    .from("games")
    .select("*, white:white_id(*), black:black_id(*)")
    .eq("id", params.id)
    .single()

  if (!game) {
    notFound()
  }

  return <GameBoardPage game={game} />
}
