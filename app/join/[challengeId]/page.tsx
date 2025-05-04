import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { acceptChallenge } from "@/app/actions/game"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/animated-button"

export default async function JoinGamePage({ params }: { params: { challengeId: string } }) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  // If not logged in, redirect to login with return URL
  if (!data.session) {
    const returnUrl = encodeURIComponent(`/join/${params.challengeId}`)
    redirect(`/login?returnUrl=${returnUrl}`)
  }

  // Get challenge details
  const { data: challenge, error } = await supabase
    .from("challenges")
    .select(`
      *,
      challenger:challenger_id(username, avatar_url),
      game:game_id(time_control)
    `)
    .eq("id", params.challengeId)
    .single()

  // If challenge doesn't exist or is not pending, redirect to lobby
  if (error || !challenge || challenge.status !== "pending") {
    redirect("/dashboard/lobby")
  }

  // Check if the user is the challenger (can't join own challenge)
  if (challenge.challenger_id === data.session.user.id) {
    redirect(`/dashboard/waiting/${params.challengeId}`)
  }

  async function handleJoinGame() {
    "use server"

    const result = await acceptChallenge(params.challengeId)

    if (result.error) {
      // In a real app, you'd handle this error better
      console.error("Error joining game:", result.error)
      redirect("/dashboard/lobby")
    }

    redirect(`/game/${result.gameId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md bg-chainBg/60 backdrop-blur-md border-chain1/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Game Invitation</CardTitle>
          <CardDescription>You've been invited to join a chess game</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Challenger</p>
            <p className="font-medium">{challenge.challenger.username}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Time Control</p>
            <p className="font-medium">{challenge.game.time_control || "5+5"}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-400">Colors</p>
            <p className="font-medium">Randomly assigned</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <form action={handleJoinGame} className="w-full">
            <AnimatedButton type="submit" className="w-full">
              Accept Challenge
            </AnimatedButton>
          </form>

          <Button variant="outline" className="w-full" asChild>
            <a href="/dashboard/lobby">Return to Lobby</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
