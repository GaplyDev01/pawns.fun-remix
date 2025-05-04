"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateGameDialog } from "@/components/game/create-game-dialog"

export function CreateGameButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create Game</Button>
      <CreateGameDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
