"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, useSpring } from "framer-motion"
import { useEffect, useState } from "react"

interface EloStatCardProps {
  rating: number
}

export function EloStatCard({ rating }: EloStatCardProps) {
  const [prevRating, setPrevRating] = useState(rating)
  const springRating = useSpring(prevRating, { stiffness: 100, damping: 30 })

  useEffect(() => {
    setPrevRating(rating)
    springRating.set(rating)
  }, [rating, springRating])

  return (
    <Card className="overflow-hidden bg-chainBg/60 backdrop-blur-sm border-chain1/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Elo Rating</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <motion.div
            className="text-4xl font-bold tabular-nums text-chain1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
          >
            {Math.round(springRating.get())}
          </motion.div>

          <div className="text-sm text-gray-400">
            {rating > prevRating ? (
              <span className="text-green-400">↑ Increasing</span>
            ) : rating < prevRating ? (
              <span className="text-red-400">↓ Decreasing</span>
            ) : (
              <span>Stable</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
