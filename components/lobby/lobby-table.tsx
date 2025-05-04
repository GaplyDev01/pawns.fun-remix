"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"

interface Game {
  id: string
  white: {
    id: string
    username: string
    rating?: number // Make rating optional since it might not exist directly on the profile
  }
  time_control: string
}

interface LobbyTableProps {
  games: Game[]
}

export function LobbyTable({ games }: LobbyTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: games.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  })

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
                      <Button size="sm">Join</Button>
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
