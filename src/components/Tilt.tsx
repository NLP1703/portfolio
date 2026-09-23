import type { PointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion, useSpring } from 'framer-motion'

type Props = {
  /** Inclinaison maximale en degrés : faible pour une carte large, plus forte pour une petite. */
  max?: number
  className?: string
  children: ReactNode
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.6 }

/**
 * La carte s'incline vers le pointeur, en perspective. Souris uniquement :
 * au doigt, l'effet se déclencherait au milieu d'un défilement.
 */
export function Tilt({ max = 6, className, children }: Props) {
  const reduce = useReducedMotion()
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)

  if (reduce) return <div className={className}>{children}</div>

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    rotateY.set(x * 2 * max)
    rotateX.set(-y * 2 * max)
  }

  const reset = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
