"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createChallenge, type ChallengeType, type TimeControl } from "@/app/actions/challenge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AnimatedButton } from "@/components/animated-button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Users, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateChallengeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gameModes: { id: number; name: string }[]
}

export function CreateChallengeDialog({ open, onOpenChange, gameModes }: CreateChallengeDialogProps) {
  const [timeControl, setTimeControl] = useState<TimeControl>("5+5")
  const [challengeType, setChallengeType] = useState<ChallengeType>("open")
  const [opponentUsername, setOpponentUsername] = useState("")
  const [opponentId, setOpponentId] = useState("")
  const [gameMode, setGameMode] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchResults, setSearchResults] = useState<{ id: string; username: string }[]>([])
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = async (username: string) => {
    setOpponentUsername(username)

    if (username.length < 3) {
      setSearchResults([])
      return
    }

    try {
      // In a real app, you would search for users here
      // For now, we'll just simulate some results
      setSearchResults(
        [
          { id: "user1", username: "chess_master" },
          { id: "user2", username: "grandmaster" },
          { id: "user3", username: "pawn_star" },
        ].filter((user) => user.username.includes(username.toLowerCase())),
      )
    } catch (error) {
      console.error("Error searching for users:", error)
    }
  }

  const handleSelectOpponent = (id: string, username: string) => {
    setOpponentId(id)
    setOpponentUsername(username)
    setSearchResults([])
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      // Validate direct challenge has an opponent
      if (challengeType === "direct" && !opponentId) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please select an opponent for your direct challenge",
        })
        setIsSubmitting(false)
        return
      }

      const result = await createChallenge({
        type: challengeType,
        timeControl,
        opponentId: challengeType === "direct" ? opponentId : undefined,
        gameMode,
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      toast({
        title: "Challenge created!",
        description:
          challengeType === "open" ? "Your challenge is now available in the lobby" : "Challenge sent to opponent",
      })

      // Close the dialog
      onOpenChange(false)

      // Redirect to waiting page for open challenges
      if (challengeType === "open") {
        router.push(`/dashboard/waiting/${result.challengeId}`)
      } else {
        router.push("/dashboard/challenges")
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create challenge. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-chainBg/70 backdrop-blur-md border-chain1/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Challenge</DialogTitle>
          <DialogDescription>Challenge another player to a game of chess.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="open" onValueChange={(value) => setChallengeType(value as ChallengeType)}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="open" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Open Challenge
            </TabsTrigger>
            <TabsTrigger value="direct" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Direct Challenge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="space-y-4 pt-4">
            <p className="text-sm text-gray-400">Create an open challenge that any player can accept from the lobby.</p>
          </TabsContent>

          <TabsContent value="direct" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="opponent">Opponent Username</Label>
              <div className="relative">
                <Input
                  id="opponent"
                  value={opponentUsername}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for a player..."
                  className="bg-chainBg/80"
                />

                {searchResults.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-chainBg border border-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="px-4 py-2 hover:bg-gray-800 cursor-pointer"
                        onClick={() => handleSelectOpponent(user.id, user.username)}
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Label>Game Mode</Label>
            <Select value={gameMode.toString()} onValueChange={(value) => setGameMode(Number.parseInt(value))}>
              <SelectTrigger className="bg-chainBg/80">
                <SelectValue placeholder="Select game mode" />
              </SelectTrigger>
              <SelectContent className="bg-chainBg border-gray-800">
                {gameModes.map((mode) => (
                  <SelectItem key={mode.id} value={mode.id.toString()}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Time Control</h3>
            <RadioGroup
              value={timeControl}
              onValueChange={(value) => setTimeControl(value as TimeControl)}
              className="grid grid-cols-2 gap-2"
            >
              {[
                { value: "1+0", label: "1 min" },
                { value: "3+2", label: "3 min + 2 sec" },
                { value: "5+5", label: "5 min + 5 sec" },
                { value: "10+0", label: "10 min" },
                { value: "15+10", label: "15 min + 10 sec" },
                { value: "30+0", label: "30 min" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`time-${option.value}`} className="border-chain1/50" />
                  <Label htmlFor={`time-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <AnimatedButton onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Challenge"
            )}
          </AnimatedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
