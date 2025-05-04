"use client"

import { useState, useEffect } from "react"
import { useActionState } from "react"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { signIn, signUp, resetPassword } from "@/app/actions/auth"
import { AnimatedButton } from "@/components/ui/AnimatedButton"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const initialState = { error: "", success: "" }

export function AuthCard() {
  const [showPassword, setShowPassword] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [signInState, signInAction] = useActionState(signIn, initialState)
  const [signUpState, signUpAction] = useActionState(signUp, initialState)
  const [resetState, resetAction] = useActionState(resetPassword, initialState)
  const { toast } = useToast()

  // Use useEffect to show toasts only when state changes
  useEffect(() => {
    if (signInState?.error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: signInState.error,
      })
    }
  }, [signInState?.error, toast])

  useEffect(() => {
    if (signUpState?.error) {
      toast({
        variant: "destructive",
        title: "Registration Error",
        description: signUpState.error,
      })
    }
  }, [signUpState?.error, toast])

  useEffect(() => {
    if (signUpState?.success) {
      toast({
        title: "Registration Successful",
        description: signUpState.success,
      })
    }
  }, [signUpState?.success, toast])

  useEffect(() => {
    if (resetState?.success) {
      toast({
        title: "Password Reset Email Sent",
        description: resetState.success,
      })
      setResetDialogOpen(false)
    }
  }, [resetState?.success, toast])

  return (
    <div className="w-full max-w-md">
      <Card className="bg-chainBg/60 backdrop-blur-md border-chain1/20">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signInAction} className="space-y-4">
                {signInState?.error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{signInState.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="bg-chainBg/80 focus:ring-chain1/50"
                    aria-label="Email address"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="link" className="text-xs text-chain1 p-0 h-auto">
                          Forgot password?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-chainBg border-chain1/20">
                        <DialogHeader>
                          <DialogTitle>Reset Password</DialogTitle>
                        </DialogHeader>
                        <form action={resetAction} className="space-y-4 pt-4">
                          {resetState?.error && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{resetState.error}</AlertDescription>
                            </Alert>
                          )}
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">Email</Label>
                            <Input
                              id="reset-email"
                              name="email"
                              type="email"
                              placeholder="Enter your email"
                              required
                              className="bg-chainBg/80 focus:ring-chain1/50"
                              aria-label="Email address for password reset"
                            />
                          </div>
                          <AnimatedButton type="submit" className="w-full">
                            Send Reset Link
                          </AnimatedButton>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      required
                      className="bg-chainBg/80 pr-10 focus:ring-chain1/50"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <AnimatedButton type="submit" className="w-full">
                  Sign In
                </AnimatedButton>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>Fill in the details below to create your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={signUpAction} className="space-y-4">
                {signUpState?.error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{signUpState.error}</AlertDescription>
                  </Alert>
                )}

                {signUpState?.success && (
                  <Alert className="mb-4 bg-green-500/20 text-green-300 border-green-500/50">
                    <AlertDescription>{signUpState.success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="signup-username">Username</Label>
                  <Input
                    id="signup-username"
                    name="username"
                    placeholder="Choose a username"
                    required
                    className="bg-chainBg/80 focus:ring-chain1/50"
                    aria-label="Username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    className="bg-chainBg/80 focus:ring-chain1/50"
                    aria-label="Email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      required
                      className="bg-chainBg/80 pr-10 focus:ring-chain1/50"
                      aria-label="Password"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <AnimatedButton type="submit" className="w-full">
                  Sign Up
                </AnimatedButton>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
