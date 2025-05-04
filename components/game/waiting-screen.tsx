"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { cancelChallenge, generateInviteLink } from "@/app/actions/game"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/animated-button"
import { Loader2, Copy, Share2, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import confetti from "canvas-confetti"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WaitingScreenProps {
  challengeId: string
  timeControl: string
}

export function WaitingScreen({ challengeId, timeControl }: WaitingScreenProps) {
  const [isWaiting, setIsWaiting] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [waitTime, setWaitTime] = useState(0)
  const [inviteLink, setInviteLink] = useState("")
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Generate invite link when component mounts
  useEffect(() => {
    const fetchInviteLink = async () => {
      try {
        // Make sure to await the async function
        const link = await generateInviteLink(challengeId)
        setInviteLink(link)
      } catch (error) {
        console.error("Error generating invite link:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to generate invitation link",
        })
      }
    }

    fetchInviteLink()
  }, [challengeId, toast])

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
          if (payload.new.status === "accepted" && payload.new.game_id) {
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
          } else if (payload.new.status === "rejected") {
            // Challenge was rejected or cancelled
            toast({
              title: "Challenge ended",
              description: "The challenge has been cancelled or rejected.",
            })

            // Redirect to lobby
            setTimeout(() => {
              router.push("/dashboard/lobby")
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
        setIsCancelling(false)
        return
      }

      toast({
        title: "Challenge cancelled",
        description: "Redirecting to lobby...",
      })

      // Let the realtime subscription handle the redirect
      // This ensures we don't redirect before the database is updated
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel challenge. Please try again.",
      })
      setIsCancelling(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Invitation link copied to clipboard",
      })

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again or copy the link manually",
      })
    }
  }

  const shareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my chess game!",
          text: "I'm waiting for you to join my chess game on Pawns.fun!",
          url: inviteLink,
        })
        toast({
          title: "Shared successfully!",
          description: "Your invitation has been shared",
        })
      } catch (err) {
        // User probably canceled the share operation
        console.log("Share was canceled or failed")
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyToClipboard()
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
            <p className="text-gray-400">Colors will be randomly assigned</p>
          </div>
        </div>

        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <AnimatedButton className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Invite Player
            </AnimatedButton>
          </DialogTrigger>
          <DialogContent className="bg-chainBg/70 backdrop-blur-md border-chain1/20">
            <DialogHeader>
              <DialogTitle>Invite a Player</DialogTitle>
              <DialogDescription>Share this link with someone to invite them to join your game.</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col space-y-4 mt-4">
              <div className="flex space-x-2">
                <Input value={inviteLink} readOnly className="bg-chainBg/80 flex-1" />
                <Button size="icon" onClick={copyToClipboard} className="bg-chain1/20 hover:bg-chain1/30">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex space-x-2">
                <AnimatedButton className="flex-1" onClick={copyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </AnimatedButton>
                {navigator.share && (
                  <AnimatedButton className="flex-1" onClick={shareInvite}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </AnimatedButton>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
