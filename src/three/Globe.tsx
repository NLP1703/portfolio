import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { DoubleSide, type Mesh } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { useCssVar } from '../hooks/useCssVar'
import { graticule, latLonToVector } from './geometry'

type Props = { animate: boolean }

const RADIUS = 1.6
/** Yaoundé. */
const HOME = { lat: 3.87, lon: 11.52 }

/**
 * Rotation au glisser, horizontale uniquement, sans zoom : le globe reste un
 * objet qu'on fait tourner, pas une carte où l'on se perd.
 */
function Controls({ animate }: Props) {
  const camera = useThree((state) => state.camera)
  const canvas = useThree((state) => state.gl.domElement)
  const invalidate = useThree((state) => state.invalidate)
  const controls = useRef<OrbitControls | null>(null)

  useEffect(() => {
    const instance = new OrbitControls(camera, canvas)
    instance.enableZoom = false
    instance.enablePan = false
    instance.minPolarAngle = Math.PI / 2
    instance.maxPolarAngle = Math.PI / 2
    instance.enableDamping = true
    instance.rotateSpeed = 0.6
    // OrbitControls bloque tout geste tactile : on rend le défilement vertical à la page.
    canvas.style.touchAction = 'pan-y'
    instance.addEventListener('change', () => invalidate())
    controls.current = instance
    return () => {
      instance.dispose()
      controls.current = null
    }
  }, [camera, canvas, invalidate])

  useEffect(() => {
    if (!controls.current) return
    controls.current.autoRotate = animate
    controls.current.autoRotateSpeed = 0.7
    controls.current.enableDamping = animate
  }, [animate])

  useFrame(() => controls.current?.update())
  return null
}

function Earth() {
  const color = useCssVar('--accent')
  const muted = useCssVar('--text-muted')
  const pulse = useRef<Mesh>(null)
  const lines = useMemo(() => graticule(RADIUS, 20), [])
  const home = useMemo(() => latLonToVector(HOME.lat, HOME.lon, RADIUS), [])
  const halo = useMemo(() => latLonToVector(HOME.lat, HOME.lon, RADIUS * 1.001), [])

  useFrame(({ clock }) => {
    if (!pulse.current) return
    const t = (clock.getElapsedTime() % 2) / 2
    pulse.current.scale.setScalar(1 + t * 2.5)
    const material = pulse.current.material as { opacity: number }
    material.opacity = 0.6 * (1 - t)
  })

  return (
    // Tourné pour que Yaoundé fasse face à la caméra au premier affichage.
    <group rotation={[0, (-HOME.lon - 90) * (Math.PI / 180), 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS * 0.995, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={0.04} depthWrite={false} />
      </mesh>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={muted} transparent opacity={0.35} />
      </lineSegments>
      <mesh position={home}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={pulse} position={halo} onUpdate={(self) => self.lookAt(0, 0, 0)}>
        <ringGeometry args={[0.05, 0.07, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  )
}

/** Globe filaire, Yaoundé marquée d'un point qui pulse. */
export default function Globe({ animate }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4.6], fov: 45 }}
      dpr={[1, 2]}
      frameloop={animate ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      style={{ pointerEvents: 'auto', cursor: 'grab' }}
    >
      <Controls animate={animate} />
      <Earth />
    </Canvas>
  )
}
