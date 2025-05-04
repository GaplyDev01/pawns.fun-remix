"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Game {
  id: string
  white: {
    id: string
    username: string
    rating?: number
  }
  time_control: string
}

interface LobbyTableProps {
  games: Game[]
}

export function LobbyTable({ games }: LobbyTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const rowVirtualizer = useVirtualizer({
    count: games.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  })

  const handleJoin = async (gameId: string) => {
    try {
      setJoiningId(gameId)

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to join a game",
        })
        return
      }

      // Update the game to add the current user as black
      const { error } = await supabase.from("games").update({ black_id: user.id }).eq("id", gameId).is("black_id", null)

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to join game. It may no longer be available.",
        })
        return
      }

      toast({
        title: "Game joined!",
        description: "Redirecting to game board...",
      })

      router.push(`/game/${gameId}`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to join game. Please try again.",
      })
    } finally {
      setJoiningId(null)
    }
  }

  return (
    <div className="rounded-md border border-gray-800 bg-chainBg/60 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Host</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Time Control</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      <div
        ref={parentRef}
        className="max-h-[400px] overflow-auto"
        style={{
          height: `${Math.min(400, games.length * 60)}px`,
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          <Table>
            <TableBody>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const game = games[virtualRow.index]
                return (
                  <TableRow
                    key={game.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <TableCell>{game.white.username}</TableCell>
                    <TableCell>{game.white.rating || 1200}</TableCell>
                    <TableCell>{game.time_control}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => handleJoin(game.id)} disabled={joiningId === game.id}>
                        {joiningId === game.id ? (
                          <>
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                            Joining...
                          </>
                        ) : (
                          "Join"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
