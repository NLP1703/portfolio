import { useEffect, useRef, useState } from 'react'

/**
 * Déclencheur d'entrée de section : passe à vrai une seule fois, quand
 * l'élément observé atteint le viewport. C'est le pendant du seuil
 * « opacité de section > 0.3 » de la référence : un seul signal par section,
 * dont tous les enfants dérivent leur délai.
 */
export function useInView<T extends HTMLElement>(amount = 0) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            observer.disconnect()
          }
        }
      },
      { threshold: amount, rootMargin: '0px 0px -15% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [amount])

  return { ref, inView }
}
