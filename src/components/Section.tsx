import { createContext, useContext, type ReactNode } from 'react'
import { useInView } from '../hooks/useInView'

/**
 * Une section = un signal d'entrée, partagé par tous ses enfants.
 * C'est ce qui distingue une séquence orchestrée d'une pluie de fondus
 * indépendants : le titre, le trait et le contenu dérivent tous du même
 * déclencheur, seuls leurs délais diffèrent.
 */
const SectionMotionContext = createContext(false)

export function useSectionMotion() {
  return useContext(SectionMotionContext)
}

type Props = {
  id: string
  labelledBy: string
  children: ReactNode
}

export function Section({ id, labelledBy, children }: Props) {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <SectionMotionContext.Provider value={inView}>
      <section ref={ref} id={id} aria-labelledby={labelledBy} className="section-gap">
        <div className="container-page">{children}</div>
      </section>
    </SectionMotionContext.Provider>
  )
}
