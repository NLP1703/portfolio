/** Points répartis uniformément dans une boule (équivalent de maath/random.inSphere). */
export function randomInSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const r = radius * Math.cbrt(Math.random())
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }
  return positions
}

/** Coordonnées cartésiennes d'un point de latitude/longitude (degrés), axe Y vers le nord. */
export function latLonToVector(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lon + 180) * Math.PI) / 180
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  ]
}

/**
 * Segments d'un globe filaire : parallèles et méridiens tous les `step`
 * degrés, prêts pour un `lineSegments`.
 */
export function graticule(radius: number, step = 20, resolution = 64) {
  const points: number[] = []
  const push = (a: [number, number, number], b: [number, number, number]) => points.push(...a, ...b)

  for (let lat = -90 + step; lat < 90; lat += step) {
    for (let i = 0; i < resolution; i++) {
      const lon0 = (i / resolution) * 360 - 180
      const lon1 = ((i + 1) / resolution) * 360 - 180
      push(latLonToVector(lat, lon0, radius), latLonToVector(lat, lon1, radius))
    }
  }

  for (let lon = -180; lon < 180; lon += step) {
    for (let i = 0; i < resolution / 2; i++) {
      const lat0 = (i / (resolution / 2)) * 180 - 90
      const lat1 = ((i + 1) / (resolution / 2)) * 180 - 90
      push(latLonToVector(lat0, lon, radius), latLonToVector(lat1, lon, radius))
    }
  }

  return new Float32Array(points)
}
