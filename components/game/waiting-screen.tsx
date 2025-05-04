"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cancelChallenge } from "@/app/actions/game"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"

interface WaitingScreenProps {
  challengeId: string
  timeControl: string
  colorPreference: string
}

export function WaitingScreen({ challengeId, timeControl, colorPreference }: WaitingScreenProps) {
  const [isWaiting, setIsWaiting] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [waitTime, setWaitTime] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Start timer
    const interval = setInterval(() => {
      setWaitTime((prev) => prev + 1)
    }, 1000)

    // Set up realtime subscription to listen for match
    const channel = supabase
      .channel(`challenge:${challengeId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "challenges",
          filter: `id=eq.${challengeId}`,
        },
        (payload) => {
          if (payload.new.status === "matched" && payload.new.game_id) {
            // Match found!
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            })

            toast({
              title: "Match found!",
              description: "Redirecting to game...",
            })

            // Short delay for confetti and toast to be visible
            setTimeout(() => {
              router.push(`/game/${payload.new.game_id}`)
            }, 1500)
          }
        },
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [challengeId, router, supabase, toast])

  const handleCancel = async () => {
    try {
      setIsCancelling(true)
      const result = await cancelChallenge(challengeId)

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      router.push("/dashboard/lobby")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel challenge. Please try again.",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-chainBg/60 backdrop-blur-sm border-chain1/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Finding Opponent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative h-24 w-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-chain1/30 border-t-chain1 animate-spin"></div>
            <span className="text-xl font-mono">{formatTime(waitTime)}</span>
          </div>

          <div className="text-center space-y-1">
            <p className="text-gray-400">Time Control: {timeControl}</p>
            <p className="text-gray-400">
              Color:{" "}
              {colorPreference === "random"
                ? "Random"
                : colorPreference.charAt(0).toUpperCase() + colorPreference.slice(1)}
            </p>
          </div>
        </div>

        <AnimatedButton onClick={handleCancel} disabled={isCancelling} variant="destructive" className="w-full">
          {isCancelling ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Cancelling...
            </>
          ) : (
            "Cancel"
          )}
        </AnimatedButton>
      </CardContent>
    </Card>
  )
}
