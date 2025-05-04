import { createClient } from "@/lib/supabase/server"
import { WaitingScreen } from "@/components/game/waiting-screen"
import { notFound, redirect } from "next/navigation"

export default async function WaitingPage({ params }: { params: { challengeId: string } }) {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!data.session) {
    redirect("/login")
  }

  const user = data.session.user

  // Fetch challenge details
  const { data: challenge, error } = await supabase.from("challenges").select("*").eq("id", params.challengeId).single()

  if (error || !challenge) {
    notFound()
  }

  // Verify this is the user's challenge
  if (challenge.challenger_id !== user.id) {
    redirect("/dashboard/lobby")
  }

  // If challenge is already matched, redirect to game
  if (challenge.status === "matched" && challenge.game_id) {
    redirect(`/game/${challenge.game_id}`)
  }

  // If challenge is cancelled, redirect to lobby
  if (challenge.status === "cancelled") {
    redirect("/dashboard/lobby")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <WaitingScreen
        challengeId={challenge.id}
        timeControl={challenge.time_control}
        colorPreference={challenge.color_preference}
      />
    </div>
  )
}
