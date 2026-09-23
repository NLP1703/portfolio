import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { Group } from 'three'
import { useCssVar } from '../hooks/useCssVar'

type Props = {
  /** Faux : la scène est hors écran ou le mouvement est réduit, le rendu s'arrête. */
  animate: boolean
}

/** Amplitude maximale de l'inclinaison suivant le pointeur, en radians. */
const PARALLAX = 0.35

function Orb({ animate }: Props) {
  const ref = useRef<Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const color = useCssVar('--accent')

  // Le canvas ne capte pas le pointeur (il est sous l'avatar) : on écoute la fenêtre.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((_, delta) => {
    const group = ref.current
    if (!animate || !group) return
    const ease = 1 - Math.exp(-delta * 3)
    group.rotation.y += delta * 0.18
    group.rotation.x += (pointer.current.y * PARALLAX - group.rotation.x) * ease
    group.rotation.z += (-pointer.current.x * PARALLAX * 0.5 - group.rotation.z) * ease
  })

  return (
    <group ref={ref} rotation={[0.3, 0, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.28} />
      </mesh>
      <points>
        <icosahedronGeometry args={[1.5, 1]} />
        <pointsMaterial color={color} size={0.06} sizeAttenuation transparent opacity={0.9} />
      </points>
      {/* Incliné pour rester une ellipse visible, jamais un simple trait de profil. */}
      <mesh rotation={[Math.PI / 2 - 0.5, 0.35, 0]}>
        <torusGeometry args={[1.9, 0.004, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

/** Polyèdre filaire qui gravite autour de l'avatar et suit le pointeur. */
export default function HeroOrb({ animate }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 2]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
    >
      <Orb animate={animate} />
    </Canvas>
  )
}
