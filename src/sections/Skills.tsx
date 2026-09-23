import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { Tilt } from '../components/Tilt'
import { skillGroups } from '../data/skills'

/** Décalage entre deux cartes de la grille. */
const STEP = 80

function SkillsGrid() {
  const inView = useSectionMotion()

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {skillGroups.map((group, index) => (
        <Stagger key={group.title} show={inView} delay={index * STEP} className="h-full">
          <Tilt max={8} className="h-full">
            <article className="card card-interactive h-full">
              <h3 className="text-cardtitle">{group.title}</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          </Tilt>
        </Stagger>
      ))}
    </div>
  )
}

export function Skills() {
  return (
    <Section id="competences" labelledBy="titre-competences">
      <SectionHeading id="titre-competences" title="Compétences" />
      <SkillsGrid />
    </Section>
  )
}
