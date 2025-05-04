import type React from "react"
import { ProfileCheck } from "@/components/profile/profile-check"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <ProfileCheck />
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
