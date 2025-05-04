"use client"

import Link from "next/link"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Trophy, User } from "lucide-react"
import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { AuthButton } from "@/components/auth/auth-button"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Lobby", href: "/dashboard/lobby", icon: Home },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy },
  { name: "Profile", href: "/dashboard/profile", icon: User },
]

interface AppNavProps {
  isLoggedIn: boolean
}

export function AppNav({ isLoggedIn }: AppNavProps) {
  const pathname = usePathname()

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 backdrop-blur-sm bg-chain-bg/70 border-b border-emerald-900/20">
      <div className="container flex h-full items-center px-4 sm:px-6 lg:px-8 mx-auto">
        <Link href="/" className="flex items-center">
          <motion.div className="text-2xl font-bold text-emerald-400 animate-breathe" whileHover={{ scale: 1.05 }}>
            Pawns.fun
          </motion.div>
        </Link>

        <nav className="hidden md:flex ml-auto gap-8">
          {isLoggedIn &&
            navItems.map((item) => (
              <motion.div key={item.name} whileHover={{ scale: 1.1 }}>
                <Link
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href ? "text-emerald-400" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          <AuthButton isLoggedIn={isLoggedIn} />
        </nav>

        <Sheet>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <button className="p-2">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-chain-bg/90">
            <div className="flex flex-col gap-6 mt-8">
              {isLoggedIn &&
                navItems.map((item) => (
                  <Link key={item.name} href={item.href} className="flex items-center gap-3 py-2 text-lg">
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                ))}
              <div className="mt-4">
                <AuthButton isLoggedIn={isLoggedIn} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
