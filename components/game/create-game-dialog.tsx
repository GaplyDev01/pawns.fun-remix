"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createGame } from "@/app/actions/game"
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
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface CreateGameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type TimeControl = "1+0" | "3+2" | "5+5" | "10+0"
type ColorPreference = "white" | "black" | "random"
type OpponentType = "human" | "ai"

export function CreateGameDialog({ open, onOpenChange }: CreateGameDialogProps) {
  const [timeControl, setTimeControl] = useState<TimeControl>("5+5")
  const [colorPreference, setColorPreference] = useState<ColorPreference>("random")
  const [opponentType, setOpponentType] = useState<OpponentType>("human")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const result = await createGame({
        timeControl,
        colorPreference,
        opponentType,
      })

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        })
        return
      }

      // Close the dialog
      onOpenChange(false)

      // Navigate based on opponent type
      if (opponentType === "human") {
        router.push(`/dashboard/waiting/${result.challengeId}`)
      } else {
        router.push(`/game/${result.gameId}`)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create game. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-chainBg/70 backdrop-blur-md border-chain1/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create Game</DialogTitle>
          <DialogDescription>Set up a new chess game with your preferred settings.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
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
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`time-${option.value}`} className="border-chain1/50" />
                  <Label htmlFor={`time-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Color Preference</h3>
            <RadioGroup
              value={colorPreference}
              onValueChange={(value) => setColorPreference(value as ColorPreference)}
              className="grid grid-cols-3 gap-2"
            >
              {[
                { value: "white", label: "White" },
                { value: "black", label: "Black" },
                { value: "random", label: "Random" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`color-${option.value}`} className="border-chain1/50" />
                  <Label htmlFor={`color-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Opponent</h3>
            <RadioGroup
              value={opponentType}
              onValueChange={(value) => setOpponentType(value as OpponentType)}
              className="grid grid-cols-2 gap-2"
            >
              {[
                { value: "human", label: "Human Player" },
                { value: "ai", label: "AI Opponent" },
              ].map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`opponent-${option.value}`} className="border-chain1/50" />
                  <Label htmlFor={`opponent-${option.value}`}>{option.label}</Label>
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
              "Create Game"
            )}
          </AnimatedButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
