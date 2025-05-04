"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { acceptChallenge } from "@/app/actions/game"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Challenge {
  id: string
  challenger: {
    id: string
    username: string
    avatar_url: string
  }
  time_control: string
  created_at: string
}

interface ChallengesListProps {
  challenges: Challenge[]
}

export function ChallengesList({ challenges }: ChallengesListProps) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleAccept = async (challengeId: string) => {
    try {
      setAcceptingId(challengeId)
      const result = await acceptChallenge(challengeId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "Challenge accepted!",
        description: "Redirecting to game...",
      })

      router.push(`/game/${result.gameId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept challenge. Please try again.",
      })
    } finally {
      setAcceptingId(null)
    }
  }

  if (challenges.length === 0) {
    return (
      <Card className="bg-chainBg/60 backdrop-blur-sm border-chain1/20">
        <CardContent className="p-6 text-center text-gray-400">No active challenges at the moment.</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {challenges.map((challenge) => (
        <Card key={challenge.id} className="bg-chainBg/60 backdrop-blur-sm border-chain1/20 overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage
                    src={challenge.challenger.avatar_url || "/placeholder.svg"}
                    alt={challenge.challenger.username}
                  />
                  <AvatarFallback>{challenge.challenger.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{challenge.challenger.username}</div>
                  <div className="text-sm text-gray-400">{challenge.time_control || "5+5"} • Random colors</div>
                </div>
              </div>

              <Button onClick={() => handleAccept(challenge.id)} disabled={acceptingId === challenge.id} size="sm">
                {acceptingId === challenge.id ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Accepting...
                  </>
                ) : (
                  "Accept"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
