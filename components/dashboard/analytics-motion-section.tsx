'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionSectionProps {
  children: ReactNode
  delay?: number
  className?: string
}

export function MotionSection({
  children,
  delay = 0,
  className
}: MotionSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{
        y: -12,
        opacity: 0
      }}
      animate={{
        y: 0,
        opacity: 1
      }}
      transition={{
        duration: 0.4,
        delay,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  )
}