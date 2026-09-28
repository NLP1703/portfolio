import { useReducedMotion } from 'framer-motion'
import { useSectionMotion } from './Section'

type Props = {
  title: string
  id: string
}

/** Le premier mot part après le trait, les suivants à 80ms d'intervalle. */
const WORD_DELAY = 100
const WORD_STEP = 80

export function SectionHeading({ title, id }: Props) {
  const inView = useSectionMotion()
  const reduce = useReducedMotion()
  const words = title.split(' ')

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
      {/*
       * Chaque mot remonte depuis derrière son propre bord inférieur : le
       * titre semble sortir de la ligne plutôt que d'apparaître en fondu.
       */}
      <h2 id={id} className="text-section">
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            <span className="reveal-mask">
              <span
                className="inline-block"
                style={
                  reduce
                    ? undefined
                    : {
                        transform: inView ? 'translateY(0)' : 'translateY(120%)',
                        transition: 'transform 0.9s var(--ease-cinematic)',
                        transitionDelay: `${WORD_DELAY + index * WORD_STEP}ms`,
                      }
                }
              >
                {word}
              </span>
            </span>
            {index < words.length - 1 && ' '}
          </span>
        ))}
      </h2>
    </header>
  )
}
