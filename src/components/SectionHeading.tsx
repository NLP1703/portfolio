import { useReducedMotion } from 'framer-motion'
import { useSectionMotion } from './Section'
import { Stagger } from './Stagger'

type Props = {
  title: string
  id: string
}

export function SectionHeading({ title, id }: Props) {
  const inView = useSectionMotion()
  const reduce = useReducedMotion()

  return (
    <header className="mb-10 lg:mb-14">
      <span
        aria-hidden="true"
        className="mb-5 block h-[2px] bg-accent"
        style={
          reduce
            ? { width: 40 }
            : { width: inView ? 40 : 0, transition: 'width 0.8s var(--ease-cinematic)' }
        }
      />
      <Stagger show={inView} delay={100}>
        <h2 id={id} className="text-section">
          {title}
        </h2>
      </Stagger>
    </header>
  )
}
