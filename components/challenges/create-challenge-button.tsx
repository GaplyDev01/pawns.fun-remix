"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateChallengeDialog } from "@/components/challenges/create-challenge-dialog"
import { Plus } from "lucide-react"

interface CreateChallengeButtonProps {
  gameModes: { id: number; name: string }[]
}

export function CreateChallengeButton({ gameModes }: CreateChallengeButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-500">
        <Plus className="mr-2 h-4 w-4" />
        New Challenge
      </Button>
      <CreateChallengeDialog open={open} onOpenChange={setOpen} gameModes={gameModes} />
    </>
  )
}
