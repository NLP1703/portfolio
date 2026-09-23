import { useEffect, useRef, useState } from 'react'

/**
 * Visibilité continue d'un élément, contrairement à `useInView` qui ne
 * bascule qu'une fois. Sert à suspendre le rendu d'une scène 3D dès
 * qu'elle quitte l'écran.
 */
export function useVisible<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}
