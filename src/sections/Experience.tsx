import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { experiences } from '../data/experiences'

/** Décalage entre deux jalons de la timeline. */
const STEP = 120
/** Centre vertical d'un point, depuis le haut de son jalon (top 6px + rayon 6px). */
const DOT_CENTER = 12

function Timeline() {
  const inView = useSectionMotion()
  const reduce = useReducedMotion()
  const timelineRef = useRef<HTMLDivElement>(null)
  /** Position de chaque point, en fraction de la hauteur de la timeline. */
  const stops = useRef<number[]>([])
  const [reached, setReached] = useState(0)

  // Le tracé part quand le haut de la timeline passe aux trois quarts de
  // l'écran et arrive au bas quand celui-ci atteint le milieu.
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })

  const count = (value: number) => stops.current.filter((stop) => value >= stop).length

  useLayoutEffect(() => {
    const timeline = timelineRef.current
    if (!timeline) return

    const measure = () => {
      const height = timeline.offsetHeight || 1
      stops.current = Array.from(
        timeline.querySelectorAll<HTMLElement>('li'),
        (item) => (item.offsetTop + DOT_CENTER) / height,
      )
      setReached(count(fill.get()))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(timeline)
    return () => observer.disconnect()
    // `fill` est stable : la mesure ne dépend que de la mise en page.
  }, [])

  // Un rendu seulement quand un point est franchi, pas à chaque image.
  useMotionValueEvent(fill, 'change', (value) => setReached(count(value)))

  const lit = reduce ? experiences.length : reached

  return (
    <div ref={timelineRef} className="relative ml-1">
      {/* Le rail, puis le tracé qui le remplit au fil du défilement. */}
      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-[2px] bg-bg-elevated" />
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[2px] origin-top bg-accent"
        style={{ scaleY: reduce ? 1 : fill }}
      />

      <ol className="pl-[2px]">
        {experiences.map((experience, index) => (
          <Stagger
            key={experience.title}
            as="li"
            show={inView}
            delay={index * STEP}
            className={`relative pl-8 ${index === experiences.length - 1 ? 'pb-0' : 'pb-10'}`}
          >
            <span
              aria-hidden="true"
              className={`absolute -left-[7px] top-[6px] h-3 w-3 rounded-full border border-accent ${
                index < lit ? 'dot-reached bg-accent' : 'bg-bg-primary'
              }`}
              style={{ transition: 'background-color 0.4s var(--ease-cinematic), box-shadow 0.4s var(--ease-cinematic)' }}
            />

            <h3 className="text-cardtitle">{experience.title}</h3>
            <p className="mt-1 text-caption font-medium text-accent">{experience.org}</p>
            <p className="mt-3 max-w-bio text-caption text-ink-secondary">{experience.detail}</p>
            {experience.meta && <p className="mt-2 text-caption text-ink-muted">{experience.meta}</p>}
          </Stagger>
        ))}
      </ol>
    </div>
  )
}

export function Experience() {
  return (
    <Section id="experiences" labelledBy="titre-experiences">
      <SectionHeading id="titre-experiences" title="Expériences" />
      <Timeline />
    </Section>
  )
}
