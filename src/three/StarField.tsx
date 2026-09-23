import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Points } from 'three'
import { useCssVar } from '../hooks/useCssVar'
import { randomInSphere } from './geometry'

type Props = { animate: boolean }

function Stars({ animate }: Props) {
  const ref = useRef<Points>(null)
  const color = useCssVar('--accent')
  const opacity = Number(useCssVar('--star-opacity')) || 0.6

  // Moins de points sur petit écran : la densité perçue reste la même.
  const positions = useMemo(() => randomInSphere(window.innerWidth < 768 ? 900 : 2200, 1.2), [])

  useFrame((_, delta) => {
    if (!animate || !ref.current) return
    ref.current.rotation.x -= delta / 14
    ref.current.rotation.y -= delta / 20
  })

  return (
    <points ref={ref} rotation={[0, 0, Math.PI / 4]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      {/* Taille fixe en pixels : avec l'atténuation, les points proches de la caméra
          deviendraient de gros carrés qui passent devant le texte. */}
      <pointsMaterial
        color={color}
        size={1.5}
        sizeAttenuation={false}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  )
}

/** Champ d'étoiles en fond de page, en rotation lente. */
export default function StarField({ animate }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      dpr={[1, 1.5]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: false, alpha: true, powerPreference: 'low-power' }}
    >
      <Stars animate={animate} />
    </Canvas>
  )
}
