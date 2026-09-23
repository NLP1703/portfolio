import { Component, Suspense, useEffect, useState, type ReactNode } from 'react'

/** Une scène qui échoue (WebGL absent, contexte perdu) s'efface sans casser la page. */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

type Props = {
  className?: string
  children: ReactNode
}

/**
 * Point d'entrée commun des scènes 3D. Le monter ne coûte rien : le module
 * three.js n'est demandé qu'une fois le navigateur au repos, après le
 * premier affichage, pour ne jamais retarder le texte. La scène apparaît
 * ensuite en fondu (voir .scene-3d).
 */
export function Scene3D({ className = '', children }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!supportsWebGL()) return

    const start = () => setReady(true)
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }
    const id = setTimeout(start, 300)
    return () => clearTimeout(id)
  }, [])

  return (
    <div aria-hidden="true" className={`scene-3d pointer-events-none ${className}`}>
      {ready && (
        <WebGLBoundary>
          <Suspense fallback={null}>{children}</Suspense>
        </WebGLBoundary>
      )}
    </div>
  )
}
