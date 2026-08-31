import type { Project } from '../data/projects'

type Props = {
  project: Project
}

/**
 * Vignette générative : une fenêtre de terminal en aplats, sans dégradé.
 * Remplacée par `project.image` dès qu'une capture est fournie.
 */
export function ProjectThumb({ project }: Props) {
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
          <p key={line} className={index === 0 ? 'text-accent' : 'text-ink-secondary'}>
            <span aria-hidden="true" className="mr-2 text-ink-muted">
              &gt;
            </span>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
