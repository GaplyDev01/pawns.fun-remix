"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronRight, Shield, Zap, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AnimatedHeroProps {
  isLoggedIn: boolean
}

export function AnimatedHero({ isLoggedIn }: AnimatedHeroProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col space-y-8"
        >
          <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium self-start">
            <span className="animate-pulse mr-1.5">●</span> Chess Reimagined
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="block text-white">Play Chess in the</span>
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent animate-text-flicker">
              Blockchain Era
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-xl">
            Experience chess like never before with decentralized gameplay, NFT collectibles, and global tournaments
            secured by blockchain technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold">
              <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                {isLoggedIn ? "Enter the Chain" : "Get Started"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {[
              { icon: Shield, label: "Secure Gameplay", value: "100%" },
              { icon: Zap, label: "Fast Matches", value: "<5s" },
              { icon: Trophy, label: "Active Players", value: "10K+" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                className="flex flex-col items-center p-4 rounded-lg bg-chain-card border border-chain-border"
              >
                <div className="p-2 rounded-full bg-emerald-500/10 mb-3">
                  <stat.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative"
        >
          <div className="aspect-square max-w-lg mx-auto relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-3xl"></div>
            <div className="relative z-10 w-full h-full rounded-lg overflow-hidden border border-emerald-500/30 bg-chain-card/80 backdrop-blur-sm">
              <div className="absolute inset-0 bg-blockchain-grid bg-[length:20px_20px] opacity-30"></div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 relative">
                  <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
                    {Array.from({ length: 64 }).map((_, i) => {
                      const row = Math.floor(i / 8)
                      const col = i % 8
                      const isBlack = (row + col) % 2 === 1
                      return (
                        <div
                          key={i}
                          className={`${isBlack ? "bg-gray-800" : "bg-gray-700"} border border-emerald-900/20`}
                        />
                      )
                    })}
                  </div>

                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16"
                    animate={{
                      rotate: [0, 0, 180, 180, 0],
                      scale: [1, 1.2, 1.2, 1, 1],
                    }}
                    transition={{
                      duration: 5,
                      ease: "easeInOut",
                      times: [0, 0.2, 0.5, 0.8, 1],
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 1,
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-emerald-500/30 flex items-center justify-center">
                      <div className="text-3xl">♟️</div>
                    </div>
                  </motion.div>

                  {/* Digital circuit lines */}
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute h-0.5 bg-emerald-500/50"
                      style={{
                        top: `${20 + i * 15}%`,
                        left: "0%",
                        width: "100%",
                      }}
                      initial={{ scaleX: 0, opacity: 0.3 }}
                      animate={{
                        scaleX: [0, 1, 1, 0],
                        opacity: [0.3, 0.7, 0.7, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        delay: i * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 2,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Matrix-like falling characters */}
              <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
  <div
    key={i}
    className="absolute text-xs font-mono text-emerald-400"
    style={{
      left: `${i * 10 + i * 0.5}%`, // deterministic
      top: `-20px`,
      animation: `matrix-fall ${6 + i}s linear infinite`, // deterministic
      animationDelay: `${i * 0.3}s`, // deterministic
    }}
  >
    {Array.from({ length: 20 }).map((_, j) => (
      <div key={j} className="my-1">
        {String.fromCharCode(0x30a0 + ((i * 17 + j * 13) % 96))} {/* deterministic */}
      </div>
    ))}
  </div>
))}
              </div>
            </div>
          </div>

          {/* Floating badges */}
          <motion.div
            className="absolute -top-4 -right-4 bg-chain-card border border-emerald-500/30 rounded-lg p-3 shadow-lg shadow-emerald-500/20"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-xs text-gray-400">VERIFIED BY</div>
            <div className="text-sm font-bold text-white">BLOCKCHAIN</div>
          </motion.div>

          <motion.div
            className="absolute -bottom-4 -left-4 bg-chain-card border border-emerald-500/30 rounded-lg p-3 shadow-lg shadow-emerald-500/20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="text-xs text-gray-400">SECURED WITH</div>
            <div className="text-sm font-bold text-white">SMART CONTRACTS</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="py-24 border-t border-emerald-900/20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Blockchain Chess Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience the future of chess with our innovative blockchain-powered features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Blockchain Secured",
              description: "Every move is recorded on the blockchain, ensuring fair play and permanent game history.",
              icon: "🔐",
            },
            {
              title: "NFT Collectibles",
              description:
                "Earn unique chess pieces and boards as NFTs by winning tournaments and completing challenges.",
              icon: "🏆",
            },
            {
              title: "Global Tournaments",
              description: "Compete in decentralized tournaments with players from around the world for crypto prizes.",
              icon: "🌍",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.2, duration: 0.5 }}
              className="p-8 rounded-xl border border-chain-border bg-chain-card/80 backdrop-blur-sm flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to action section */}
      <div className="py-24 border-t border-emerald-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Play Chess on the Blockchain?</h2>
          <p className="text-gray-400 mb-8 mx-auto max-w-2xl">
            Join thousands of players already experiencing the future of chess. Sign up now and receive a welcome bonus
            of exclusive NFT chess pieces.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-black font-bold">
              <Link href={isLoggedIn ? "/dashboard" : "/signup"}>
                {isLoggedIn ? "Enter the Chain" : "Get Started Now"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Link href="/leaderboard">Explore Leaderboard</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-emerald-900/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-emerald-400 mb-4">Pawns.fun</div>
            <p className="text-gray-400 max-w-md">
              The future of chess is here. Play, collect, and compete in the blockchain era.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-emerald-400">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/lobby" className="text-gray-400 hover:text-emerald-400">
                  Game Lobby
                </Link>
              </li>
              <li>
                <Link href="/dashboard/leaderboard" className="text-gray-400 hover:text-emerald-400">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/profile" className="text-gray-400 hover:text-emerald-400">
                  Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  Telegram
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-emerald-400">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-emerald-900/20 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Pawns.fun. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
