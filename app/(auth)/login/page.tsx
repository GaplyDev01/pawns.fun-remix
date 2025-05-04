import { AuthCard } from "@/components/auth/AuthCard"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const supabase = await createClient()

  // Get the user session
  const { data } = await supabase.auth.getSession()

  // If user is already logged in, redirect to dashboard or returnUrl if provided
  if (data.session) {
    const returnUrl = searchParams.returnUrl
    if (returnUrl) {
      redirect(returnUrl)
    }
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <AuthCard returnUrl={searchParams.returnUrl} />
    </div>
  )
}
