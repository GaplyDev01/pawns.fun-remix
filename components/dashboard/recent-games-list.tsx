"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface Game {
  id: string
  white: {
    id: string
    username: string
    avatar_url: string
  }
  black: {
    id: string
    username: string
    avatar_url: string
  }
  time_control: string
  rating_diff: number
  fen: string
}

interface RecentGamesListProps {
  games: Game[]
}

export function RecentGamesList({ games }: RecentGamesListProps) {
  return (
    <Card className="overflow-hidden bg-chainBg/60 backdrop-blur-sm border-chain1/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Recent Games</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {games.length === 0 ? (
          <div className="p-4 text-center text-gray-400">No recent games found</div>
        ) : (
          <ul className="divide-y divide-gray-800">
            {games.map((game) => (
              <motion.li
                key={game.id}
                whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                className="transition-colors"
              >
                <Link href={`/game/${game.id}`} className="block p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {game.white.username} vs {game.black.username}
                      </div>
                      <div className="text-sm text-gray-400">{game.time_control}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </Link>
              </motion.li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
