import { AnimatedHero } from "@/components/home/animated-hero"
import { BlockchainBackground } from "@/components/home/blockchain-background"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()

  // Get the user session - no redirect needed as this is a public page
  const { data } = await supabase.auth.getSession()
  const isLoggedIn = !!data.session

  return (
    <>
      <BlockchainBackground />
      <main className="min-h-screen">
        <AnimatedHero isLoggedIn={isLoggedIn} />
      </main>
    </>
  )
}
