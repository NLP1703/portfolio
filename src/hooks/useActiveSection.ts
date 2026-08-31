import { useEffect, useState } from 'react'

/**
 * Renvoie l'identifiant de la section actuellement au centre du viewport.
 * Utilisé pour l'état actif de la navigation et le titre dynamique de l'onglet.
 */
export function useActiveSection<T extends string>(ids: readonly T[], fallback: T): T {
  const [active, setActive] = useState<T>(fallback)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }

        let best: { id: string; ratio: number } | null = null
        for (const [id, ratio] of visible) {
          if (ratio > 0 && (best === null || ratio > best.ratio)) best = { id, ratio }
        }

        if (best) setActive(best.id as T)
      },
      { rootMargin: '-40% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
