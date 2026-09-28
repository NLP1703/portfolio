import type { CSSProperties } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Project } from '../data/projects'
import { useSectionMotion } from './Section'

type Props = {
  project: Project
  /** Délai de la carte dans la séquence de la section, en millisecondes. */
  delay?: number
}

/** La carte s'installe, puis le terminal imprime une ligne toutes les 160ms. */
const PRINT_DELAY = 350
const LINE_STEP = 160

/**
 * Vignette générative : une fenêtre de terminal en aplats, sans dégradé.
 * Remplacée par `project.image` dès qu'une capture est fournie.
 */
export function ProjectThumb({ project, delay = 0 }: Props) {
  const inView = useSectionMotion()
  const reduce = useReducedMotion()
  if (project.image) {
    return (
      <img
        src={project.image}
        alt={`Aperçu du projet ${project.name}`}
        loading="lazy"
        className="h-full w-full rounded-card object-cover"
      />
    )
  }

  const lineStart = (index: number) => delay + PRINT_DELAY + index * LINE_STEP

  const printed = (index: number): CSSProperties | undefined =>
    reduce
      ? undefined
      : {
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateX(0)' : 'translateX(-6px)',
          transition: 'opacity 0.4s var(--ease-cinematic), transform 0.4s var(--ease-cinematic)',
          transitionDelay: `${lineStart(index)}ms`,
        }

  return (
    <div
      className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-card border border-hairline bg-bg-primary"
      role="img"
      aria-label={`Illustration du projet ${project.name}`}
    >
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--thumb-ink)]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--thumb-ink)]" />
        <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[var(--thumb-ink)]" />
        <span className="ml-2 font-mono text-tag text-ink-muted">{project.id}</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2 px-4 py-5 font-mono text-tag leading-relaxed">
        {project.terminal.map((line, index) => (
          <p key={line} className={index === 0 ? 'text-accent' : 'text-ink-secondary'} style={printed(index)}>
            <span aria-hidden="true" className="mr-2 text-ink-muted">
              &gt;
            </span>
            {line}
          </p>
        ))}
        {/* Invite finale : le curseur clignote trois fois puis s'efface, comme dans le hero. */}
        <p aria-hidden="true" style={printed(project.terminal.length)}>
          <span className="mr-2 text-ink-muted">&gt;</span>
          <span
            className={`caret ${inView ? 'caret-finish' : 'opacity-0'}`}
            style={{ animationDelay: `${lineStart(project.terminal.length)}ms` }}
          />
        </p>
      </div>
    </div>
  )
}
