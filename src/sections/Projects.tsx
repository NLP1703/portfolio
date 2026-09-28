import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FiChevronDown, FiGithub } from 'react-icons/fi'
import { ProjectThumb } from '../components/ProjectThumb'
import { Section, useSectionMotion } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Stagger } from '../components/Stagger'
import { Tilt } from '../components/Tilt'
import { projects, type Project } from '../data/projects'

/** Décalage entre deux cartes projet. */
const STEP = 120

function StatusTag({ project }: { project: Project }) {
  if (project.status === 'design') {
    return <span className="tag tag-amber">{project.statusLabel ?? 'En conception'}</span>
  }
  if (project.status === 'ongoing') {
    return <span className="tag tag-green">{project.statusLabel ?? 'En cours'}</span>
  }
  return null
}

type CardProps = {
  project: Project
  reversed: boolean
  /** Délai de la carte dans la séquence, transmis à la vignette. */
  delay: number
}

function ProjectCard({ project, reversed, delay }: CardProps) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const detailsId = `details-${project.id}`

  return (
    <article className="card card-interactive group">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        <div
          className={`overflow-hidden rounded-card ${reversed ? 'lg:order-2' : ''}`}
        >
          <div className="h-full transition-transform duration-300 ease-out group-hover:scale-[1.03]">
            <ProjectThumb project={project} delay={delay} />
          </div>
        </div>

        <div className={`flex flex-col ${reversed ? 'lg:order-1' : ''}`}>
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-cardtitle">{project.name}</h3>
            <StatusTag project={project} />
          </div>

          <p className="mt-1 text-caption text-ink-muted">{project.label}</p>

          <p className="mt-4 text-caption text-ink-secondary">{project.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="tag tag-muted">
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer noopener"
                className="btn-secondary btn-sm"
                aria-label={`Code source de ${project.name} sur GitHub, nouvel onglet`}
              >
                <FiGithub size={16} aria-hidden="true" />
                Code source
              </a>
            )}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls={detailsId}
              className="btn-secondary btn-sm"
            >
              <FiChevronDown
                size={16}
                aria-hidden="true"
                className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
              {open ? 'Masquer les détails' : 'Détails'}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id={detailsId}
                className="overflow-hidden"
                initial={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={reduce ? { opacity: 1 } : { height: 0, opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <ul className="mt-6 space-y-2 border-t border-hairline pt-6">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-caption text-ink-secondary">
                      <span aria-hidden="true" className="mt-[0.6em] h-[2px] w-3 shrink-0 bg-accent" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </article>
  )
}

function ProjectList() {
  const inView = useSectionMotion()

  return (
    <div className="flex flex-col gap-8">
      {projects.map((project, index) => (
        <Stagger key={project.id} show={inView} delay={index * STEP}>
          <Tilt max={3}>
            <ProjectCard project={project} reversed={index % 2 === 1} delay={index * STEP} />
          </Tilt>
        </Stagger>
      ))}
    </div>
  )
}

export function Projects() {
  return (
    <Section id="projets" labelledBy="titre-projets">
      <SectionHeading id="titre-projets" title="Projets" />
      <ProjectList />
    </Section>
  )
}
