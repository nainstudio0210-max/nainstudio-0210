"use client"

import { useMotionValue, useTransform, motion } from "framer-motion"
import type { ReactNode } from "react"

type TiltCardProps = {
  children: ReactNode
  className?: string
}

export default function TiltCard({ children, className = "" }: TiltCardProps) {
  const rX = useMotionValue(0)
  const rY = useMotionValue(0)
  const rotateX = useTransform(rY, [-0.5, 0.5], [4, -4])
  const rotateY = useTransform(rX, [-0.5, 0.5], [-4, 4])

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia("(pointer: fine)").matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    rX.set((e.clientX - rect.left) / rect.width - 0.5)
    rY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handlePointerLeave() {
    rX.set(0)
    rY.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  )
}
