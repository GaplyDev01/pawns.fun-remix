import SignupPageClient from "./SignupPageClient"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function SignupPage() {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If user is already logged in, redirect to dashboard
  if (data.session) {
    redirect("/dashboard")
  }

  return <SignupPageClient />
}
