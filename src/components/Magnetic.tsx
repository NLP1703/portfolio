import type { PointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

type Props = {
  /** Part de l'écart au centre que l'élément parcourt vers le pointeur (0 à 1). */
  strength?: number
  className?: string
  children: ReactNode
}

const SPRING = { stiffness: 180, damping: 15, mass: 0.4 }

/**
 * L'élément est attiré par le pointeur puis revient en place sur un ressort
 * légèrement sous-amorti. Souris uniquement, comme `Tilt`.
 */
export function Magnetic({ strength = 0.3, className = '', children }: Props) {
  const reduce = useReducedMotion()
  const x = useSpring(0, SPRING)
  const y = useSpring(0, SPRING)

  if (reduce) return <span className={`inline-block ${className}`}>{children}</span>

  const onPointerMove = (event: PointerEvent<HTMLSpanElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.span>
  )
}
