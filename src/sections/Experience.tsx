import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { experiences } from '../data/experiences'

/** Décalage entre deux jalons de la timeline. */
const STEP = 120

function Timeline() {
  const inView = useSectionMotion()

  return (
    <ol className="relative ml-1 border-l-2 border-bg-elevated">
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
            className="absolute -left-[7px] top-[6px] h-3 w-3 rounded-full border border-accent bg-bg-primary"
          />

          <h3 className="text-cardtitle">{experience.title}</h3>
          <p className="mt-1 text-caption font-medium text-accent">{experience.org}</p>
          <p className="mt-3 max-w-bio text-caption text-ink-secondary">{experience.detail}</p>
          {experience.meta && <p className="mt-2 text-caption text-ink-muted">{experience.meta}</p>}
        </Stagger>
      ))}
    </ol>
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
