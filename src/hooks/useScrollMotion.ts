import { useEffect, useState } from 'react'

/** Constante de lissage : plus elle est haute, plus la valeur rattrape vite le scroll réel. */
const LERP_TAU = 8
/** En deçà de cet écart, on colle à la cible pour éviter une asymptote infinie. */
const SNAP = 0.002

/**
 * Publie une progression de défilement lissée dans `--scroll-progress`
 * (0 = haut de page, 1 = un viewport parcouru).
 *
 * La valeur brute de `scrollY` avance par sauts ; on l'interpole image par
 * image avec un lerp exponentiel indépendant du framerate, ce qui donne un
 * fondu continu plutôt qu'une succession de paliers. L'écriture se fait dans
 * une variable CSS, pas dans un état React : le scroll ne provoque aucun rendu.
 *
 * @param threshold progression au-delà de laquelle `scrolled` bascule à vrai.
 */
export function useScrollMotion(threshold = 0.08) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    let span = window.innerHeight || 1
    const measure = () => {
      span = window.innerHeight || 1
    }
    measure()
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', measure)

    let raf = 0
    let last = performance.now()
    let current = 0
    let published = -1
    let above = false

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now

      const target = Math.min(1, Math.max(0, window.scrollY / span))

      if (reduce.matches) {
        current = target
      } else {
        current += (target - current) * (1 - Math.exp(-dt * LERP_TAU))
        if (Math.abs(target - current) < SNAP) current = target
      }

      // Mouvement réduit : aucun fondu piloté par le scroll, la variable reste à 0.
      const value = reduce.matches ? 0 : current
      const rounded = Math.round(value * 1000) / 1000
      if (rounded !== published) {
        published = rounded
        root.style.setProperty('--scroll-progress', String(rounded))
      }

      const next = target > threshold
      if (next !== above) {
        above = next
        setScrolled(next)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', measure)
      root.style.removeProperty('--scroll-progress')
    }
  }, [threshold])

  return scrolled
}
