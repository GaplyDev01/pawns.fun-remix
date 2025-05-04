"use client"

import { signOut } from "@/app/actions/auth"
import { AnimatedButton } from "@/components/animated-button"
import { LogOut, LogIn } from "lucide-react"
import Link from "next/link"

interface AuthButtonProps {
  isLoggedIn: boolean
}

export function AuthButton({ isLoggedIn }: AuthButtonProps) {
  if (isLoggedIn) {
    return (
      <form action={signOut}>
        <AnimatedButton variant="outline" size="sm" type="submit">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </AnimatedButton>
      </form>
    )
  }

  return (
    <AnimatedButton variant="outline" size="sm" asChild>
      <Link href="/login">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Link>
    </AnimatedButton>
  )
}
