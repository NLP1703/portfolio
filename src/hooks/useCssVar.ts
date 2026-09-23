import { useEffect, useState } from 'react'

function read(name: string) {
  if (typeof document === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/**
 * Lit un jeton CSS et le relit à chaque changement de thème. Les scènes 3D
 * ne voient pas les variables CSS : c'est ce pont qui leur donne la même
 * palette que le reste de la page.
 */
export function useCssVar(name: string) {
  const [value, setValue] = useState(() => read(name))

  useEffect(() => {
    setValue(read(name))
    const observer = new MutationObserver(() => setValue(read(name)))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [name])

  return value
}
