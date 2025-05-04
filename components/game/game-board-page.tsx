"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatedBoard } from "@/components/game/animated-board"
import { GameTimer } from "@/components/game/game-timer"
import { MatchFoundModal } from "@/components/game/match-found-modal"
import { GameChatDrawer } from "@/components/game/game-chat-drawer"
import { Card, CardContent } from "@/components/ui/card"
import { AnimatedButton } from "@/components/animated-button"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

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
  fen_position: string
  white_time_remaining: number
  black_time_remaining: number
}

interface GameBoardPageProps {
  game: Game
  currentUserId: string
}

export function GameBoardPage({ game, currentUserId }: GameBoardPageProps) {
  const [fen, setFen] = useState(game.fen_position || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1")
  const [whiteTime, setWhiteTime] = useState(game.white_time_remaining || 600000) // 10 minutes in ms
  const [blackTime, setBlackTime] = useState(game.black_time_remaining || 600000)
  const [isWhiteTurn, setIsWhiteTurn] = useState(true)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [userPlaysWhite, setUserPlaysWhite] = useState(game.white.id === currentUserId)
  const boardRef = useRef(null)
  const supabase = createClientComponentClient()
  const { toast } = useToast()

  useEffect(() => {
    // Show match modal briefly when component mounts
    setShowMatchModal(true)
    const timer = setTimeout(() => {
      setShowMatchModal(false)
    }, 3000)

    // Subscribe to game updates
    const channel = supabase
      .channel(`game:${game.id}`)
      .on("broadcast", { event: "move" }, ({ payload }) => {
        setFen(payload.fen_after_move)
        setIsWhiteTurn(!isWhiteTurn)
      })
      .subscribe()

    return () => {
      clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [game.id, isWhiteTurn, supabase])

  const handleMove = (sourceSquare: string, targetSquare: string) => {
    // Only allow moves if it's the user's turn
    if ((userPlaysWhite && !isWhiteTurn) || (!userPlaysWhite && isWhiteTurn)) {
      toast({
        title: "Not your turn",
        description: "Please wait for your opponent to move",
        variant: "destructive",
      })
      return false
    }

    // In a real app, you would validate the move and update the game state
    toast({
      title: "Move made",
      description: `${sourceSquare} to ${targetSquare}`,
    })

    // Toggle turn
    setIsWhiteTurn(!isWhiteTurn)

    return true
  }

  // Determine board orientation based on player color
  const boardOrientation = userPlaysWhite ? "white" : "black"

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold">{game.black.username}</div>
              <GameTimer initialTimeMs={blackTime} isRunning={!isWhiteTurn} onTimeUpdate={setBlackTime} />
            </div>
          </div>

          <AnimatedBoard ref={boardRef} position={fen} onPieceDrop={handleMove} boardOrientation={boardOrientation} />

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold">{game.white.username}</div>
              <GameTimer initialTimeMs={whiteTime} isRunning={isWhiteTurn} onTimeUpdate={setWhiteTime} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="bg-chainBg/60 backdrop-blur-sm border-chain1/20">
            <CardContent className="p-4">
              <h2 className="mb-4 text-xl font-bold">Game Info</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Control:</span>
                  <span>{game.time_control}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Your Color:</span>
                  <span>{userPlaysWhite ? "White" : "Black"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Rating Difference:</span>
                  <span>{game.rating_diff}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex space-x-2">
            <AnimatedButton className="flex-1">Offer Draw</AnimatedButton>
            <AnimatedButton className="flex-1" variant="destructive">
              Resign
            </AnimatedButton>
          </div>

          <GameChatDrawer gameId={game.id} />
        </div>
      </div>

      <MatchFoundModal
        open={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        opponent={userPlaysWhite ? game.black : game.white}
      />
    </div>
  )
}
