import { GameBoardPage } from "@/components/game/game-board-page"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"

export default async function GamePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!data.session) {
    redirect("/login")
  }

  const user = data.session.user

  // Fetch game data
  const { data: game, error } = await supabase
    .from("games")
    .select("*, white:white_id(*), black:black_id(*)")
    .eq("id", params.id)
    .single()

  if (error || !game) {
    notFound()
  }

  // Verify user is a participant in the game
  if (game.white.id !== user.id && game.black?.id !== user.id && !game.is_ai_game) {
    // User is not a participant, redirect to dashboard
    // In a real app, you might want to allow spectating
    redirect("/dashboard")
  }

  return <GameBoardPage game={game} currentUserId={user.id} />
}
