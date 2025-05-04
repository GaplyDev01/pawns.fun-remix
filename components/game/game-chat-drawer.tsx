"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AnimatedButton } from "@/components/animated-button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send } from "lucide-react"
import { motion } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Chat {
  id: string
  self: boolean
  username: string
  content: string
}

interface GameChatDrawerProps {
  gameId: string
}

export function GameChatDrawer({ gameId }: GameChatDrawerProps) {
  const [messages, setMessages] = useState<Chat[]>([])
  const [inputValue, setInputValue] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Subscribe to chat messages
    const channel = supabase
      .channel(`game_chat:${gameId}`)
      .on("broadcast", { event: "message" }, ({ payload }) => {
        setMessages((prev) => [...prev, payload])
      })
      .subscribe()

    // Scroll to bottom when messages change
    endRef.current?.scrollIntoView({ behavior: "smooth" })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [gameId, messages, supabase])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    // In a real app, you would send the message to the server
    const newMessage: Chat = {
      id: Date.now().toString(),
      self: true,
      username: "You",
      content: inputValue,
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Scroll to bottom
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <AnimatedButton className="w-full">
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat
        </AnimatedButton>
      </SheetTrigger>
      <SheetContent side="right" className="bg-chainBg/80 w-80 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-2 px-2 py-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No messages yet</div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-2 rounded-xl ${message.self ? "bg-chain1/20 ml-auto" : "bg-white/10"} max-w-[80%]`}
              >
                <span className="text-xs text-chain1">{message.username}</span>
                <br />
                {message.content}
              </motion.div>
            ))
          )}
          <div ref={endRef} />
        </div>

        <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-800">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="bg-chainBg/60"
            />
            <AnimatedButton type="submit" size="icon" disabled={!inputValue.trim()}>
              <Send className="h-4 w-4" />
            </AnimatedButton>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
