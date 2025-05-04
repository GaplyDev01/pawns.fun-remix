"use client"

import { useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { AnimatedButton } from "@/components/animated-button"
import confetti from "canvas-confetti"

interface Opponent {
  id: string
  username: string
  avatar_url: string
}

interface MatchFoundModalProps {
  open: boolean
  onClose: () => void
  opponent: Opponent
}

export function MatchFoundModal({ open, onClose, opponent }: MatchFoundModalProps) {
  useEffect(() => {
    if (open) {
      confetti({
        particleCount: 160,
        spread: 90,
        colors: ["#00E3FF", "#7353FF"],
      })
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-chainBg/70 backdrop-blur-md border-chain1/20">
        <h2 className="text-3xl font-bold text-chain1 mb-1">MATCH FOUND</h2>
        <p className="text-gray-300 mb-4">{opponent ? `${opponent.username} is ready!` : "Finding opponent..."}</p>
        <AnimatedButton onClick={onClose}>Play now</AnimatedButton>
      </DialogContent>
    </Dialog>
  )
}
