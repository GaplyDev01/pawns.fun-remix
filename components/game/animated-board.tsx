"use client"

import type React from "react"

import { forwardRef, useRef, useImperativeHandle, useState, useEffect } from "react"
import { Chessboard } from "react-chessboard"
import { motion } from "framer-motion"
import useSound from "use-sound"
import { Chess } from "chess.js"

interface AnimatedBoardProps {
  position?: string
  onPieceDrop?: (sourceSquare: string, targetSquare: string) => boolean
  boardOrientation?: "white" | "black"
}

export const AnimatedBoard = forwardRef<any, AnimatedBoardProps>(
  (
    { position = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", onPieceDrop, boardOrientation = "white" },
    ref,
  ) => {
    const [fen, setFen] = useState(position)
    const [game, setGame] = useState(new Chess(position))
    const [playCapture] = useSound("/sfx/capture.mp3", { volume: 0.4 })
    const [playMove] = useSound("/sfx/move.mp3", { volume: 0.3 })
    const [legalSquares, setLegalSquares] = useState<Record<string, boolean>>({})
    const chessboardRef = useRef<any>(null)

    useEffect(() => {
      setFen(position)
      try {
        setGame(new Chess(position))
      } catch (e) {
        console.error("Invalid FEN:", e)
      }
    }, [position])

    useImperativeHandle(ref, () => ({
      moveFromFEN: (newFen: string) => {
        setFen(newFen)
        setGame(new Chess(newFen))
      },
    }))

    const handlePieceDragBegin = (piece: string, sourceSquare: string) => {
      // Get all legal moves for the piece
      const moves = game.moves({
        square: sourceSquare,
        verbose: true,
      })

      // Create a map of legal target squares
      const squares: Record<string, boolean> = {}
      moves.forEach((move) => {
        squares[move.to] = true
      })

      setLegalSquares(squares)
    }

    const handlePieceDragEnd = () => {
      setLegalSquares({})
    }

    const handlePieceDrop = (sourceSquare: string, targetSquare: string) => {
      try {
        // Check if the move is a capture
        const isCapture = game.get(targetSquare) !== null

        // Make the move
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: "q", // Always promote to queen for simplicity
        })

        if (move) {
          setFen(game.fen())

          // Play sound
          if (isCapture) {
            playCapture()
          } else {
            playMove()
          }

          // Call the onPieceDrop callback if provided
          if (onPieceDrop) {
            return onPieceDrop(sourceSquare, targetSquare)
          }

          return true
        }
      } catch (e) {
        console.error("Invalid move:", e)
      }

      return false
    }

    // Custom styles for the chessboard
    const customSquareStyles: Record<string, React.CSSProperties> = {}

    // Add highlight for legal squares
    Object.keys(legalSquares).forEach((square) => {
      customSquareStyles[square] = {
        position: "relative",
      }
    })

    // Custom piece renderer to add the highlight effect
    const customSquareRenderer = (props: any) => {
      const { square, children } = props

      if (legalSquares[square]) {
        return (
          <div {...props}>
            <div className="absolute inset-0 animate-breathe bg-chain1/10 rounded-sm" />
            {children}
          </div>
        )
      }

      return <div {...props}>{children}</div>
    }

    const customDndStyles = {
      draggablePiece: {
        filter: "drop-shadow(0 0 6px #00E3FF)",
      },
    }

    return (
      <motion.div whileHover={{ scale: 1.02 }} className="rounded-2xl shadow-xl ring-1 ring-chain1/30 overflow-hidden">
        <Chessboard
          id="main-board"
          position={fen}
          onPieceDrop={handlePieceDrop}
          onPieceDragBegin={handlePieceDragBegin}
          onPieceDragEnd={handlePieceDragEnd}
          boardOrientation={boardOrientation}
          customSquareStyles={customSquareStyles}
          customSquareRenderer={customSquareRenderer}
          customDndStyles={customDndStyles}
          ref={chessboardRef}
        />
      </motion.div>
    )
  },
)

AnimatedBoard.displayName = "AnimatedBoard"
