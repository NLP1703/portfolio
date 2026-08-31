import { useEffect, useState } from 'react'

type Options = {
  /** Millisecondes par caractère. */
  speed?: number
  /** Attente avant le premier caractère. */
  startDelay?: number
  /** Faux (mouvement réduit) : le texte est affiché immédiatement. */
  enabled?: boolean
}

export function useTypewriter(text: string, { speed = 45, startDelay = 800, enabled = true }: Options = {}) {
  const [typed, setTyped] = useState(enabled ? '' : text)
  const [done, setDone] = useState(!enabled)

  useEffect(() => {
    if (!enabled) {
      setTyped(text)
      setDone(true)
      return
    }

    setTyped('')
    setDone(false)

    let index = 0
    let interval: number | undefined

    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        index += 1
        setTyped(text.slice(0, index))
        if (index >= text.length) {
          window.clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(start)
      if (interval) window.clearInterval(interval)
    }
  }, [text, speed, startDelay, enabled])

  return { typed, done }
}
