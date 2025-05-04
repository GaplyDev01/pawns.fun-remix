import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChallengeCard } from "@/components/challenges/challenge-card"
import { fetchChallenges } from "@/app/actions/challenge"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CreateChallengeButton } from "@/components/challenges/create-challenge-button"

export default async function ChallengesPage() {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If no session, redirect to login
  if (!data.session) {
    redirect("/login")
  }

  // Fetch challenges
  const challenges = await fetchChallenges()

  if ("error" in challenges) {
    // Handle error
    return <div>Error loading challenges: {challenges.error}</div>
  }

  // Fetch game modes
  const { data: gameModes } = await supabase.from("game_modes").select("id, name").order("id", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chess Challenges</h1>
        <CreateChallengeButton gameModes={gameModes || [{ id: 1, name: "Standard" }]} />
      </div>

      <Tabs defaultValue="incoming" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="incoming">Incoming ({challenges.incoming.length})</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing ({challenges.outgoing.length})</TabsTrigger>
          <TabsTrigger value="open">Open ({challenges.open.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming" className="mt-4 space-y-4">
          {challenges.incoming.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No incoming challenges at the moment.</div>
          ) : (
            challenges.incoming.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} type="incoming" />
            ))
          )}
        </TabsContent>

        <TabsContent value="outgoing" className="mt-4 space-y-4">
          {challenges.outgoing.length === 0 ? (
            <div className="text-center py-8 text-gray-400">You haven't sent any challenges yet.</div>
          ) : (
            challenges.outgoing.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} type="outgoing" />
            ))
          )}
        </TabsContent>

        <TabsContent value="open" className="mt-4 space-y-4">
          {challenges.open.length === 0 ? (
            <div className="text-center py-8 text-gray-400">No open challenges available.</div>
          ) : (
            challenges.open.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} type="open" />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
