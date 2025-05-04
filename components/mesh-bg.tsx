"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { useMotionValue } from "framer-motion"

// Dynamically import Three.js components to avoid SSR issues
const DynamicMeshBGCanvas = dynamic(() => import("@/components/three/mesh-bg-canvas"), { ssr: false })

export function MeshBG() {
  const [mounted, setMounted] = useState(false)
  const [lowPerformance, setLowPerformance] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    setMounted(true)

    // Check for low-end devices
    if (navigator.hardwareConcurrency < 4) {
      setLowPerformance(true)
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth)
      mouseY.set(e.clientY / window.innerHeight)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  if (!mounted || lowPerformance) return null

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <DynamicMeshBGCanvas mouseX={mouseX} mouseY={mouseY} />
    </div>
  )
}
