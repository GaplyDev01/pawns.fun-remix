import type React from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    redirect("/login")
  }

  return <div className="container mx-auto px-4 py-8">{children}</div>
}
