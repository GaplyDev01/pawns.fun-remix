"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useRef } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Player {
  id: string
  username: string
  avatar_url: string
  rating: number // This will be populated from rating_history
}

interface LeaderboardTableProps {
  players: Player[]
}

export function LeaderboardTable({ players }: LeaderboardTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: players.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 5,
  })

  return (
    <div className="rounded-md border border-gray-800 bg-chainBg/60 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Rank</TableHead>
            <TableHead>Player</TableHead>
            <TableHead className="text-right">Rating</TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      <div
        ref={parentRef}
        className="max-h-[600px] overflow-auto"
        style={{
          height: `${Math.min(600, players.length * 60)}px`,
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
                const player = players[virtualRow.index]
                const rank = virtualRow.index + 1

                return (
                  <motion.tr
                    key={player.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.2, delay: virtualRow.index * 0.02 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="hover:bg-white/5"
                  >
                    <TableCell className="font-medium">
                      {rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={player.avatar_url || "/placeholder.svg"} alt={player.username} />
                          <AvatarFallback>{player.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span>{player.username}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">{player.rating}</TableCell>
                  </motion.tr>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
