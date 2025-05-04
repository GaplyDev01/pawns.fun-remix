"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect } from "react"

interface WinRateRingProps {
  winRate: number
}

export function WinRateRing({ winRate }: WinRateRingProps) {
  const progress = useMotionValue(0)
  const displayRate = useTransform(progress, (value) => Math.round(value))

  useEffect(() => {
    const animation = animate(progress, winRate, { duration: 2 })
    return animation.stop
  }, [winRate, progress])

  return (
    <Card className="overflow-hidden bg-chainBg/60 backdrop-blur-sm border-chain1/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Win Rate</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative h-32 w-32">
          <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
            {/* Background circle */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="10" strokeLinecap="round" />

            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#winRateGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset={useTransform(progress, (value) => 283 - (value / 100) * 283)}
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="winRateGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E3FF" />
                <stop offset="100%" stopColor="#7353FF" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div className="text-3xl font-bold">{displayRate}</motion.div>
            <div className="text-sm text-gray-400">Win %</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
