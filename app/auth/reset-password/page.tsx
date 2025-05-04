import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/AnimatedButton"

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getSession()

  // If user is already logged in, redirect to dashboard
  if (data.session) {
    redirect("/dashboard")
  }

  async function updatePassword(formData: FormData) {
    "use server"

    const password = formData.get("password") as string

    if (!password || password.length < 6) {
      return { error: "Password must be at least 6 characters" }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return { error: error.message }
    }

    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-chainBg/60 backdrop-blur-md border-chain1/20">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your new password"
                  required
                  className="bg-chainBg/80 focus:ring-chain1/50"
                  aria-label="New password"
                />
              </div>

              <AnimatedButton type="submit" className="w-full">
                Update Password
              </AnimatedButton>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
