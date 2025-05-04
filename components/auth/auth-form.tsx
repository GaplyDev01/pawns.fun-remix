"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { AnimatedButton } from "@/components/animated-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface AuthFormProps {
  type: "login" | "signup"
  action: (formData: FormData) => Promise<{ error?: string; success?: string }>
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <AnimatedButton type="submit" className="w-full" disabled={pending}>
      {pending ? "Processing..." : "Submit"}
    </AnimatedButton>
  )
}

export function AuthForm({ type, action }: AuthFormProps) {
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setMessage(null)
    const result = await action(formData)

    if (result.error) {
      setMessage({ type: "error", text: result.error })
    } else if (result.success) {
      setMessage({ type: "success", text: result.success })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="bg-chainBg/60 backdrop-blur-md border-chain1/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{type === "login" ? "Sign In" : "Create an Account"}</CardTitle>
          <CardDescription>
            {type === "login"
              ? "Enter your credentials to access your account"
              : "Fill in the details below to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            {message && (
              <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            {type === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  required
                  className="bg-chainBg/80"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="bg-chainBg/80"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="bg-chainBg/80"
              />
            </div>

            <SubmitButton />
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-800 pt-4">
          {type === "login" ? (
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-chain1 hover:underline">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-chain1 hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}
