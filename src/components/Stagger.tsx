import type { ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

type Props = {
  /** Signal d'entrée de la section : tous les enfants le partagent. */
  show: boolean
  /** Décalage en millisecondes dans la séquence. */
  delay?: number
  className?: string
  as?: 'div' | 'li'
  children: ReactNode
}

/**
 * Élément d'une séquence orchestrée : fondu et remontée de 24px,
 * 0.8s sur une courbe très décélérée (0.16, 1, 0.3, 1). Le mouvement se
 * termine long et lent — c'est ce qui donne la sensation cinématique.
 */
export function Stagger({ show, delay = 0, className, as = 'div', children }: Props) {
  const reduce = useReducedMotion()
  const Tag = as

  if (reduce) return <Tag className={className}>{children}</Tag>

  return (
    <Tag
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(24px)',
        transition:
          'opacity 0.8s var(--ease-cinematic), transform 0.8s var(--ease-cinematic)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Tag>
  )
}
