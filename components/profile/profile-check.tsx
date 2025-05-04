"use client"

import { useEffect } from "react"
import { checkAndCreateProfile } from "@/app/actions/profile-check"
import { useToast } from "@/components/ui/use-toast"

export function ProfileCheck() {
  const { toast } = useToast()

  useEffect(() => {
    const check = async () => {
      const result = await checkAndCreateProfile()

      if (result.error) {
        toast({
          variant: "destructive",
          title: "Profile Check Failed",
          description: result.error,
        })
      }
    }

    check()
  }, [toast])

  // This component doesn't render anything
  return null
}
