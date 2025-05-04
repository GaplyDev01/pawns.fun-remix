"use client"

import { signOut } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { LogOut, LogIn } from "lucide-react"
import Link from "next/link"

interface AuthButtonProps {
  isLoggedIn: boolean
}

export function AuthButton({ isLoggedIn }: AuthButtonProps) {
  if (isLoggedIn) {
    return (
      <form action={signOut}>
        <Button variant="outline" size="sm" type="submit">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </form>
    )
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <Link href="/login">
        <LogIn className="mr-2 h-4 w-4" />
        Sign In
      </Link>
    </Button>
  )
}
