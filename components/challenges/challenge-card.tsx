"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { acceptChallenge, rejectChallenge, cancelChallenge } from "@/app/actions/challenge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Clock, Award } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChallengeCardProps {
  challenge: {
    id: string
    challenger?: {
      id: string
      username: string
      avatar_url: string | null
    }
    challenged?: {
      id: string
      username: string
      avatar_url: string | null
    }
    game_mode?: {
      id: number
      name: string
    }
    created_at: string
    expires_at: string
  }
  type: "open" | "incoming" | "outgoing"
}

export function ChallengeCard({ challenge, type }: ChallengeCardProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleAccept = async () => {
    try {
      setIsLoading("accept")
      const result = await acceptChallenge(challenge.id)

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
      setIsLoading(null)
    }
  }

  const handleReject = async () => {
    try {
      setIsLoading("reject")
      const result = await rejectChallenge(challenge.id)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "Challenge rejected",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reject challenge. Please try again.",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleCancel = async () => {
    try {
      setIsLoading("cancel")
      const result = await cancelChallenge(challenge.id)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "Challenge cancelled",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel challenge. Please try again.",
      })
    } finally {
      setIsLoading(null)
    }
  }

  const timeAgo = formatDistanceToNow(new Date(challenge.created_at), { addSuffix: true })
  const expiresIn = formatDistanceToNow(new Date(challenge.expires_at), { addSuffix: true })

  return (
    <Card className="bg-chainBg/60 backdrop-blur-sm border-chain1/20 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={challenge.challenger?.avatar_url || "/placeholder.svg"}
                  alt={challenge.challenger?.username || "Anonymous"}
                />
                <AvatarFallback>{(challenge.challenger?.username || "A").slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">
                  {type === "outgoing" && challenge.challenged
                    ? `To: ${challenge.challenged.username}`
                    : challenge.challenger?.username || "Anonymous"}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Created {timeAgo}
                </div>
              </div>
            </div>

            {challenge.game_mode && (
              <div className="flex items-center gap-1 bg-chain1/10 px-2 py-1 rounded-full">
                <Award className="h-3 w-3 text-chain1" />
                <span className="text-xs">{challenge.game_mode.name}</span>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Time Control:</span>
              <span className="font-medium">5+5</span>
            </div>
            <div className="flex justify-between">
              <span>Expires:</span>
              <span className="font-medium">{expiresIn}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {type === "open" || type === "incoming" ? (
              <>
                <Button
                  onClick={handleAccept}
                  disabled={isLoading !== null}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                >
                  {isLoading === "accept" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Accept"}
                </Button>
                <Button onClick={handleReject} disabled={isLoading !== null} variant="outline" className="flex-1">
                  {isLoading === "reject" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Decline"}
                </Button>
              </>
            ) : (
              <Button onClick={handleCancel} disabled={isLoading !== null} variant="destructive" className="flex-1">
                {isLoading === "cancel" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cancel"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
