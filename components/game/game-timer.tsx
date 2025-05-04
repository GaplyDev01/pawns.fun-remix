"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"

interface GameTimerProps {
  initialTimeMs: number
  isRunning: boolean
  onTimeUpdate?: (timeMs: number) => void
}

export function GameTimer({ initialTimeMs, isRunning, onTimeUpdate }: GameTimerProps) {
  const [timeMs, setTimeMs] = useState(initialTimeMs)
  const timeMotion = useMotionValue(timeMs)
  const displaySeconds = useTransform(timeMotion, (value) => Math.ceil(value / 1000))

  useEffect(() => {
    timeMotion.set(initialTimeMs)
    setTimeMs(initialTimeMs)
  }, [initialTimeMs, timeMotion])

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setTimeMs((prev) => {
        const newTime = Math.max(0, prev - 100)
        timeMotion.set(newTime)
        onTimeUpdate?.(newTime)
        return newTime
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isRunning, onTimeUpdate, timeMotion])

  const formatTime = (ms: number) => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="rounded-md bg-chainBg/80 px-3 py-1 text-xl font-mono tabular-nums">
        <motion.div
          key={Math.ceil(timeMs / 1000)}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className={`${timeMs < 30000 ? "text-red-500" : timeMs < 60000 ? "text-yellow-500" : "text-white"}`}
        >
          {formatTime(timeMs)}
        </motion.div>
      </div>
    </div>
  )
}
