"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { forwardRef } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

export interface AnimatedButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  asChild?: boolean
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, children, ...props }, ref) => {
    const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

    if (prefersReducedMotion) {
      return (
        <Button ref={ref} className={className} {...props}>
          {children}
        </Button>
      )
    }

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
          delay: 0.05,
        }}
      >
        <Button
          ref={ref}
          className={`relative overflow-hidden ring-1 ring-offset-2 ring-emerald-500/60 hover:ring-4 ${className}`}
          {...props}
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-600/20"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10">{children}</span>
        </Button>
      </motion.div>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"
